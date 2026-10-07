import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  Plus,
  Search,
  RefreshCw,
  Link2,
  Copy,
  Loader2,
  X,
  ImagePlus,
  Megaphone,
  QrCode,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { formatInWorkspaceTz, useWorkspaceTimezone } from "@/contexts/WorkspaceTimezoneContext";

// Simple version of replyagent's "WhatsApp Groups" (WAQR) module: pick a
// QR-connected (UazAPI) number and create groups on it. The number is the
// group's creator, so every group shows up on that phone. The list is read
// live from UazAPI — nothing is stored in EZCONN.

interface QrInstance {
  id: string;
  name: string;
  phone_number: string | null;
  profile_name: string | null;
  status: string;
}

interface WaGroup {
  jid: string;
  name: string;
  description: string | null;
  admin_only: boolean;
  image: string | null;
  invite_link: string | null;
  created_at: string | null;
}

const emptyForm = {
  name: "",
  description: "",
  participants: [] as string[],
  adminOnly: false,
  makeAdmins: false,
};

export default function WhatsAppGroupsSection() {
  const { t } = useTranslation();
  const { mode } = useTheme();
  const dark = mode === "dark";
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const workspaceTz = useWorkspaceTimezone();
  const [, navigate] = useLocation();

  const card = dark ? "bg-[#0f1829]" : "bg-white";
  const border = dark ? "border-slate-800" : "border-slate-200";
  const text = dark ? "text-white" : "text-slate-900";
  const sub = dark ? "text-slate-500" : "text-slate-400";
  const softBg = dark ? "bg-slate-950/40" : "bg-slate-50/50";
  const softBorder = dark ? "border-slate-800" : "border-slate-100";
  const inputCls = cn(
    "w-full h-11 rounded-xl transition-all px-4 border outline-none text-[13px]",
    dark ? "bg-slate-950/50 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900",
  );

  // ── Numbers (same query/key as the QR channel view) ────────────────
  const { data: instances = [], isLoading: loadingInstances } = useQuery<QrInstance[]>({
    queryKey: ["/api/uazapi/instances"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/uazapi/instances");
      const json = await res.json();
      return Array.isArray(json) ? json : json?.instances ?? [];
    },
  });
  const connected = useMemo(() => instances.filter((i) => i.status === "CONNECTED"), [instances]);
  const [instanceId, setInstanceId] = useState<string>("");
  useEffect(() => {
    if (!connected.some((i) => String(i.id) === instanceId)) {
      setInstanceId(connected[0] ? String(connected[0].id) : "");
    }
  }, [connected, instanceId]);
  const selected = connected.find((i) => String(i.id) === instanceId);

  // ── Groups list (live from UazAPI) ────────────────────────────────
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  useEffect(() => {
    const h = setTimeout(() => setDebounced(search.trim()), 400);
    return () => clearTimeout(h);
  }, [search]);

  const groupsKey = ["uazapi-groups", instanceId, debounced];
  const {
    data: groups = [],
    isLoading: loadingGroups,
    isFetching: fetchingGroups,
    refetch,
    error: groupsError,
  } = useQuery<WaGroup[]>({
    queryKey: groupsKey,
    enabled: !!instanceId,
    queryFn: async () => {
      const qs = debounced ? `?search=${encodeURIComponent(debounced)}` : "";
      const res = await apiRequest("GET", `/api/uazapi/instances/${instanceId}/groups${qs}`, undefined, {
        silentStatuses: [400],
      });
      const json = await res.json();
      return json?.groups ?? [];
    },
  });

  // ── Copy helpers ───────────────────────────────────────────────────
  const [linkLoading, setLinkLoading] = useState<string | null>(null);
  const copy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast({ title: t("whatsapp_groups.copied", { defaultValue: "{{label}} copied", label }) });
    } catch {
      toast({ title: value });
    }
  };
  const copyInviteLink = async (g: WaGroup) => {
    if (g.invite_link) return copy(g.invite_link, t("whatsapp_groups.invite_link", { defaultValue: "Invite link" }));
    setLinkLoading(g.jid);
    try {
      const res = await apiRequest("POST", `/api/uazapi/instances/${instanceId}/groups/invite-link`, { groupjid: g.jid });
      const json = await res.json();
      if (json?.invite_link) {
        queryClient.setQueryData<WaGroup[]>(groupsKey, (prev) =>
          (prev ?? []).map((x) => (x.jid === g.jid ? { ...x, invite_link: json.invite_link } : x)),
        );
        await copy(json.invite_link, t("whatsapp_groups.invite_link", { defaultValue: "Invite link" }));
      } else {
        toast({
          title: t("whatsapp_groups.no_link", { defaultValue: "Invite link is not available — the number must be a group admin." }),
          variant: "destructive",
        });
      }
    } catch {
      // apiRequest already showed the error toast.
    } finally {
      setLinkLoading(null);
    }
  };

  // ── Create dialog ─────────────────────────────────────────────────
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [phoneDraft, setPhoneDraft] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!image) return setImagePreview(null);
    const url = URL.createObjectURL(image);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const openCreate = () => {
    setForm(emptyForm);
    setPhoneDraft("");
    setImage(null);
    setOpen(true);
  };

  // Adds every number found in the draft (supports pasting a list).
  const commitPhones = (raw: string) => {
    const nums = raw
      .split(/[\s,;]+/)
      .map((p) => p.replace(/\D/g, ""))
      .filter(Boolean);
    if (!nums.length) return;
    const bad = nums.filter((n) => n.length < 8 || n.length > 15);
    if (bad.length) {
      toast({
        title: t("whatsapp_groups.invalid_number", {
          defaultValue: "Invalid number: {{n}} — use the full number with country code",
          n: bad.join(", "),
        }),
        variant: "destructive",
      });
    }
    const good = nums.filter((n) => n.length >= 8 && n.length <= 15);
    setForm((f) => ({ ...f, participants: Array.from(new Set([...f.participants, ...good])) }));
    setPhoneDraft("");
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      // Pick up a number still typed in the box but not yet added.
      const pending = phoneDraft
        .split(/[\s,;]+/)
        .map((p) => p.replace(/\D/g, ""))
        .filter((n) => n.length >= 8 && n.length <= 15);
      const participants = Array.from(new Set([...form.participants, ...pending]));
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("description", form.description.trim());
      fd.append("participants", JSON.stringify(participants));
      fd.append("admin_only", String(form.adminOnly));
      fd.append("make_admins", String(form.makeAdmins));
      if (image) fd.append("image", image);
      // 400/404 are reported by onError below — skip the global toast for them.
      const res = await apiRequest("POST", `/api/uazapi/instances/${instanceId}/groups`, fd, { silentStatuses: [400, 404] });
      return res.json();
    },
    onSuccess: (r: any) => {
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["uazapi-groups", instanceId] });
      toast({
        title: t("whatsapp_groups.created", { defaultValue: "Group \"{{name}}\" created", name: r?.group?.name ?? form.name }),
        description: t("whatsapp_groups.created_desc", {
          defaultValue: "It is now on {{phone}}'s WhatsApp.",
          phone: selected?.phone_number ?? selected?.name ?? "",
        }),
      });
      const failed: string[] = r?.failed ?? [];
      const warnings: string[] = r?.warnings ?? [];
      if (failed.length || warnings.length) {
        toast({
          title: t("whatsapp_groups.partial", { defaultValue: "Some steps did not complete" }),
          description: [
            failed.length
              ? t("whatsapp_groups.failed_numbers", {
                  defaultValue: "Not added: {{n}} (not on WhatsApp or privacy settings block adding).",
                  n: failed.join(", "),
                })
              : "",
            ...warnings,
          ]
            .filter(Boolean)
            .join(" • "),
          variant: "destructive",
        });
      }
    },
    onError: (e: any) => {
      toast({
        title: t("whatsapp_groups.create_failed", { defaultValue: "Could not create the group" }),
        description: e?.message,
        variant: "destructive",
      });
    },
  });

  const canSubmit = !!instanceId && form.name.trim().length > 0 && !createMutation.isPending;

  const fmtDate = (v: string | null) => {
    if (!v) return "—";
    const d = new Date(v);
    // UazAPI sends 0001-01-01 when WhatsApp didn't report a creation time.
    if (isNaN(d.getTime()) || d.getFullYear() < 2009) return "—";
    return formatInWorkspaceTz(d, "yyyy-MM-dd", workspaceTz);
  };

  const instanceLabel = (i: QrInstance) =>
    [i.profile_name || i.name, i.phone_number ? `+${i.phone_number}` : null].filter(Boolean).join(" · ");

  // ── Render ────────────────────────────────────────────────────────
  return (
    <>
      <Card className={cn("rounded-2xl border overflow-hidden shadow-sm transition-all duration-300", card, border)}>
        <CardContent className="p-0">
          {/* Header */}
          <div className={cn("px-8 py-5 border-b flex items-center justify-between gap-4", border)}>
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl shadow-sm bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className={cn("text-[16px] font-bold tracking-tight", text)}>
                  {t("whatsapp_groups.title", { defaultValue: "WhatsApp Groups" })}
                </h1>
                <p className={cn("text-[11px] font-bold mt-0.5 opacity-60 max-w-2xl", sub)}>
                  {t("whatsapp_groups.subtitle", {
                    defaultValue:
                      "Create WhatsApp groups from your QR-connected numbers. The selected number becomes the group admin and the group appears on its phone.",
                  })}
                </p>
              </div>
            </div>
            <button
              onClick={openCreate}
              disabled={!instanceId}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-primary text-white text-[13px] font-semibold shadow-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <Plus className="w-4 h-4" />
              {t("whatsapp_groups.new_group", { defaultValue: "New Group" })}
            </button>
          </div>

          <div className="p-8 space-y-6">
            {loadingInstances ? (
              <div className="flex items-center justify-center h-40">
                <LoadingSpinner size={28} />
              </div>
            ) : connected.length === 0 ? (
              /* No QR number connected yet */
              <div className={cn("flex flex-col items-center text-center gap-3 p-10 rounded-[1.5rem] border", softBg, softBorder)}>
                <div className="p-3 rounded-full bg-primary/10">
                  <QrCode className="w-6 h-6 text-primary" />
                </div>
                <p className={cn("text-[14px] font-bold", text)}>
                  {t("whatsapp_groups.no_numbers_title", { defaultValue: "No QR WhatsApp number connected" })}
                </p>
                <p className={cn("text-[12px] max-w-md", sub)}>
                  {t("whatsapp_groups.no_numbers_desc", {
                    defaultValue: "Groups are created from a WhatsApp number connected by QR code. Connect one first.",
                  })}
                </p>
                <button
                  onClick={() => navigate("/settings?tab=WhatsApp&view=qr")}
                  className="mt-1 inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-primary text-white text-[13px] font-semibold shadow-sm hover:opacity-90"
                >
                  {t("whatsapp_groups.connect_number", { defaultValue: "Connect Number" })}
                </button>
              </div>
            ) : (
              <>
                {/* Toolbar: number + search */}
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="md:w-80">
                    <label className={cn("block text-[11px] font-bold mb-1.5", sub)}>
                      {t("whatsapp_groups.phone_number", { defaultValue: "Phone number" })}
                    </label>
                    <select value={instanceId} onChange={(e) => setInstanceId(e.target.value)} className={cn(inputCls, "cursor-pointer")}>
                      {connected.map((i) => (
                        <option key={String(i.id)} value={String(i.id)}>
                          {instanceLabel(i)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className={cn("block text-[11px] font-bold mb-1.5", sub)}>
                      {t("whatsapp_groups.search_label", { defaultValue: "Search groups" })}
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className={cn("absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4", sub)} />
                        <input
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder={t("whatsapp_groups.search_placeholder", { defaultValue: "Name or description…" })}
                          className={cn(inputCls, "pl-10")}
                        />
                      </div>
                      <button
                        onClick={() => refetch()}
                        title={t("whatsapp_groups.refresh", { defaultValue: "Refresh" })}
                        className={cn("h-11 w-11 shrink-0 inline-flex items-center justify-center rounded-xl border", border, text)}
                      >
                        <RefreshCw className={cn("w-4 h-4", fetchingGroups && "animate-spin")} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Groups list */}
                <div className={cn("rounded-[1.5rem] border overflow-hidden", softBorder, softBg)}>
                  <div className={cn("px-5 py-3 border-b flex items-center justify-between", softBorder)}>
                    <span className={cn("text-[13px] font-bold", text)}>
                      {t("whatsapp_groups.groups", { defaultValue: "Groups" })}
                      <span className="ml-2 inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full bg-primary/10 text-primary text-[11px]">
                        {groups.length}
                      </span>
                    </span>
                  </div>

                  {loadingGroups ? (
                    <div className="flex items-center justify-center h-40">
                      <LoadingSpinner size={28} />
                    </div>
                  ) : groupsError ? (
                    <div className="p-8 text-center">
                      <p className="text-[13px] font-semibold text-red-500">
                        {t("whatsapp_groups.load_failed", { defaultValue: "Could not load groups for this number." })}
                      </p>
                      <p className={cn("text-[12px] mt-1", sub)}>{(groupsError as any)?.message}</p>
                    </div>
                  ) : groups.length === 0 ? (
                    <div className="flex flex-col items-center text-center gap-2 p-10">
                      <Users className={cn("w-8 h-8", sub)} />
                      <p className={cn("text-[14px] font-bold", text)}>
                        {debounced
                          ? t("whatsapp_groups.no_results", { defaultValue: "No groups match your search" })
                          : t("whatsapp_groups.empty_title", { defaultValue: "This number is not in any group yet" })}
                      </p>
                      {!debounced && (
                        <button
                          onClick={openCreate}
                          className="mt-2 inline-flex items-center gap-2 h-9 px-4 rounded-xl border border-primary/30 text-primary text-[13px] font-semibold hover:bg-primary/5"
                        >
                          <Plus className="w-4 h-4" />
                          {t("whatsapp_groups.new_group", { defaultValue: "New Group" })}
                        </button>
                      )}
                    </div>
                  ) : (
                    <ul className={cn("divide-y", dark ? "divide-slate-800" : "divide-slate-100")}>
                      {groups.map((g) => (
                        <li key={g.jid} className="px-5 py-3.5 flex items-center gap-4">
                          {g.image ? (
                            <img src={g.image} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/15 text-primary font-bold flex items-center justify-center shrink-0">
                              {(g.name || "G").charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className={cn("text-[13.5px] font-semibold truncate", text)}>{g.name || g.jid}</p>
                              {g.admin_only && (
                                <span className="inline-flex items-center gap-1 h-5 px-2 rounded-md border border-amber-300/50 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 text-[10px] font-semibold shrink-0">
                                  <Megaphone className="w-3 h-3" />
                                  {t("whatsapp_groups.admin_only_badge", { defaultValue: "Admins only" })}
                                </span>
                              )}
                            </div>
                            <p className={cn("text-[11.5px] truncate mt-0.5", sub)}>
                              {g.description || g.jid}
                            </p>
                          </div>
                          <span className={cn("hidden sm:block text-[11.5px] shrink-0", sub)}>{fmtDate(g.created_at)}</span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => copyInviteLink(g)}
                              disabled={linkLoading === g.jid}
                              title={t("whatsapp_groups.copy_link", { defaultValue: "Copy invite link" })}
                              className={cn("h-8 px-2.5 inline-flex items-center gap-1.5 rounded-lg border text-[12px] font-medium", border, text)}
                            >
                              {linkLoading === g.jid ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Link2 className="w-3.5 h-3.5" />}
                              <span className="hidden md:inline">{t("whatsapp_groups.link", { defaultValue: "Link" })}</span>
                            </button>
                            <button
                              onClick={() => copy(g.jid, t("whatsapp_groups.group_id", { defaultValue: "Group ID" }))}
                              title={t("whatsapp_groups.copy_id", { defaultValue: "Copy group ID" })}
                              className={cn("h-8 px-2.5 inline-flex items-center gap-1.5 rounded-lg border text-[12px] font-medium", border, text)}
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span className="hidden md:inline">ID</span>
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create group */}
      <Dialog open={open} onOpenChange={(v) => !createMutation.isPending && setOpen(v)}>
        <DialogContent className={cn("sm:max-w-[560px] max-h-[90vh] overflow-y-auto", card, border)}>
          <DialogHeader>
            <DialogTitle className={text}>{t("whatsapp_groups.new_group", { defaultValue: "New Group" })}</DialogTitle>
            <DialogDescription className={sub}>
              {t("whatsapp_groups.dialog_desc", {
                defaultValue: "The group is created on {{phone}} and appears on that phone with it as admin.",
                phone: selected ? instanceLabel(selected) : "",
              })}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 pt-1">
            {/* Number */}
            <div>
              <label className={cn("block text-[12px] font-bold mb-1.5", text)}>
                {t("whatsapp_groups.phone_number", { defaultValue: "Phone number" })}
              </label>
              <select value={instanceId} onChange={(e) => setInstanceId(e.target.value)} className={cn(inputCls, "cursor-pointer")}>
                {connected.map((i) => (
                  <option key={String(i.id)} value={String(i.id)}>
                    {instanceLabel(i)}
                  </option>
                ))}
              </select>
            </div>

            {/* Image + name */}
            <div className="flex items-start gap-4">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className={cn(
                  "relative w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden shrink-0",
                  dark ? "border-slate-700" : "border-slate-300",
                )}
                title={t("whatsapp_groups.image", { defaultValue: "Group image" })}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <ImagePlus className={cn("w-5 h-5", sub)} />
                )}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  e.target.value = "";
                  if (f && f.size > 5 * 1024 * 1024) {
                    toast({ title: t("whatsapp_groups.image_too_big", { defaultValue: "Image must be 5 MB or smaller" }), variant: "destructive" });
                    return;
                  }
                  setImage(f);
                }}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <label className={cn("text-[12px] font-bold", text)}>
                    {t("whatsapp_groups.group_name", { defaultValue: "Group name" })} <span className="text-red-500">*</span>
                  </label>
                  <span className={cn("text-[11px]", sub)}>{form.name.length}/100</span>
                </div>
                <input
                  value={form.name}
                  maxLength={100}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder={t("whatsapp_groups.group_name_placeholder", { defaultValue: "e.g. VIP Customers" })}
                  className={inputCls}
                  autoFocus
                />
                {image && (
                  <button type="button" onClick={() => setImage(null)} className="mt-1.5 text-[11px] text-red-500 font-medium">
                    {t("whatsapp_groups.remove_image", { defaultValue: "Remove image" })}
                  </button>
                )}
              </div>
            </div>

            {/* Participants */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={cn("text-[12px] font-bold", text)}>
                  {t("whatsapp_groups.participants", { defaultValue: "Participants" })}
                </label>
                <span className={cn("text-[11px]", sub)}>
                  {t("whatsapp_groups.participants_hint", { defaultValue: "Optional · with country code" })}
                </span>
              </div>
              <div className={cn("min-h-11 rounded-xl border px-2 py-1.5 flex flex-wrap items-center gap-1.5", dark ? "bg-slate-950/50 border-slate-800" : "bg-white border-slate-200")}>
                {form.participants.map((p) => (
                  <span key={p} className="inline-flex items-center gap-1 h-7 pl-2.5 pr-1.5 rounded-lg bg-primary/10 text-primary text-[12px] font-medium">
                    +{p}
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, participants: f.participants.filter((x) => x !== p) }))}
                      className="p-0.5 rounded hover:bg-primary/20"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  value={phoneDraft}
                  onChange={(e) => setPhoneDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "," || e.key === " ") {
                      e.preventDefault();
                      commitPhones(phoneDraft);
                    } else if (e.key === "Backspace" && !phoneDraft && form.participants.length) {
                      setForm((f) => ({ ...f, participants: f.participants.slice(0, -1) }));
                    }
                  }}
                  onBlur={() => commitPhones(phoneDraft)}
                  onPaste={(e) => {
                    const pasted = e.clipboardData.getData("text");
                    if (/[\s,;]/.test(pasted.trim())) {
                      e.preventDefault();
                      commitPhones(pasted);
                    }
                  }}
                  placeholder={
                    form.participants.length
                      ? ""
                      : t("whatsapp_groups.participants_placeholder", { defaultValue: "Type a number, e.g. 923001234567, and press Enter" })
                  }
                  autoComplete="off"
                  className={cn(
                    "flex-1 min-w-[180px] h-8 bg-transparent text-[13px] px-1.5 rounded-md",
                    "outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
                    text,
                  )}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={cn("block text-[12px] font-bold mb-1.5", text)}>
                {t("whatsapp_groups.description", { defaultValue: "Description" })}
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
                placeholder={t("whatsapp_groups.description_placeholder", { defaultValue: "What is this group about?" })}
                className={cn(inputCls, "h-auto py-3 resize-none")}
              />
            </div>

            {/* Settings */}
            <div className={cn("rounded-xl border divide-y", softBorder, softBg, dark ? "divide-slate-800" : "divide-slate-100")}>
              <label className="flex items-center justify-between gap-4 p-4 cursor-pointer">
                <div>
                  <p className={cn("text-[13px] font-semibold", text)}>
                    {t("whatsapp_groups.admin_only", { defaultValue: "Only admins can send messages" })}
                  </p>
                  <p className={cn("text-[11.5px] mt-0.5", sub)}>
                    {t("whatsapp_groups.admin_only_desc", { defaultValue: "Members can read but only admins can post." })}
                  </p>
                </div>
                <Switch checked={form.adminOnly} onCheckedChange={(v) => setForm((f) => ({ ...f, adminOnly: v }))} />
              </label>
              <label className="flex items-center justify-between gap-4 p-4 cursor-pointer">
                <div>
                  <p className={cn("text-[13px] font-semibold", text)}>
                    {t("whatsapp_groups.make_admins", { defaultValue: "Make participants admins" })}
                  </p>
                  <p className={cn("text-[11.5px] mt-0.5", sub)}>
                    {t("whatsapp_groups.make_admins_desc", { defaultValue: "Promote every added participant to group admin." })}
                  </p>
                </div>
                <Switch checked={form.makeAdmins} onCheckedChange={(v) => setForm((f) => ({ ...f, makeAdmins: v }))} />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={createMutation.isPending}
              className={cn("h-10 px-4 rounded-xl border text-[13px] font-semibold", border, text)}
            >
              {t("whatsapp_groups.cancel", { defaultValue: "Cancel" })}
            </button>
            <button
              type="button"
              onClick={() => createMutation.mutate()}
              disabled={!canSubmit}
              className="h-10 px-5 rounded-xl bg-primary text-white text-[13px] font-semibold inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {createMutation.isPending
                ? t("whatsapp_groups.creating", { defaultValue: "Creating…" })
                : t("whatsapp_groups.create", { defaultValue: "Create Group" })}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
