import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAvatarColor } from "@/lib/avatar-utils";
import {
  X,
  Search,
  Plus,
  User,
  ClipboardList,
  BarChart3,
  Calendar,
  Phone,
  MousePointerClick,
  ChevronRight,
  MoreHorizontal,
  MessageSquare,
  Image as ImageIcon,
  Key,
  Clock,
  Trash2,
  Mail,
  Loader2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ContactDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The list-row shape — we use its `id` to fetch the full detail. */
  contact: {
    id?: string | number;
    name?: string;
    displayName?: string;
    phoneNumber?: string;
    [key: string]: any;
  } | null;
}

/**
 * Full contact detail modal — fetches the enriched contact from
 * `/api/contacts/:id` on open and renders real data:
 *   - editable first / last name (PATCHed on blur)
 *   - phones + whatsapps + emails sections (with Primary / Opted-In badges)
 *   - tags chips (workspace tags loaded for the right-side picker)
 *   - custom fields list with this contact's values
 *   - sidebar TASKS / BOOKINGS / CALLS / AD CLICKS counts from server
 *   - Delete contact button wired to the proper mutation
 *
 * The hardcoded mock data (Chaney / Carey / +971… / carey-chaney@crm.local)
 * has been removed entirely — every visible value now comes from the
 * backend or workspace lookup queries.
 */
export default function ContactDetailsModal({
  open,
  onOpenChange,
  contact,
}: ContactDetailsModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeSection, setActiveSection] = useState("contacts");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Local edit buffers — kept separate from the server snapshot so a typo
  // doesn't fire a PATCH on every keystroke; we save on blur or Enter.
  const [editing, setEditing] = useState<{
    first_name: string;
    last_name: string;
    title: string;
    gender: string;
    language: string;
    locale: string;
    timezone: string;
  }>({
    first_name: "",
    last_name: "",
    title: "",
    gender: "",
    language: "",
    locale: "",
    timezone: "",
  });

  const contactId = contact?.id ? String(contact.id) : null;

  // ─── Fetch full contact detail ──────────────────────────────────────
  const { data: detailData, isLoading: detailLoading } = useQuery<any>({
    queryKey: ["/api/contacts", contactId, "detail"],
    queryFn: async () => {
      if (!contactId) return null;
      const res = await apiRequest("GET", `/api/contacts/${contactId}`);
      return res.json();
    },
    enabled: !!contactId && open,
  });

  const detail = detailData?.contact ?? null;

  // Hydrate edit buffer once detail arrives (or when switching contacts).
  useEffect(() => {
    if (!detail) return;
    setEditing({
      first_name: detail.first_name ?? "",
      last_name: detail.last_name ?? "",
      title: detail.title ?? "",
      gender: detail.gender ?? "",
      language: detail.language ?? "",
      locale: detail.locale ?? "",
      timezone: detail.timezone ?? "",
    });
  }, [detail?.id]);

  // ─── Workspace lookups (tags + custom-field definitions) ────────────
  const { data: tagsResponse } = useQuery({
    queryKey: ["/api/tags/list"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/tags/list");
      return res.json();
    },
    enabled: open,
  });
  const workspaceTags: string[] = useMemo(() => {
    const list = tagsResponse?.tags ?? tagsResponse ?? [];
    return Array.isArray(list)
      ? list.map((t: any) => (typeof t === "string" ? t : t.name)).filter(Boolean)
      : [];
  }, [tagsResponse]);

  const { data: customFieldsList } = useQuery<any>({
    queryKey: ["/api/custom-fields"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/custom-fields");
      return res.json();
    },
    enabled: open,
  });
  const workspaceCustomFields: any[] = useMemo(() => {
    if (Array.isArray(customFieldsList)) return customFieldsList;
    if (Array.isArray(customFieldsList?.custom_fields)) return customFieldsList.custom_fields;
    return [];
  }, [customFieldsList]);

  // Lookup the value for a given custom-field slug from the contact's
  // entity values payload (returned by the backend).
  const cfValue = (slug: string): string => {
    const cf = (detail?.custom_fields ?? []).find(
      (c: any) => c.system_name === slug || c.slug === slug || c.name === slug,
    );
    return cf?.value ?? cf?.values ?? "";
  };

  // Contact tags as a Set for fast lookup when rendering the chip picker.
  const appliedTags: string[] = useMemo(() => {
    if (!detail) return [];
    if (Array.isArray(detail.tags) && detail.tags.length) return detail.tags;
    return (detail.tag_links ?? [])
      .map((tl: any) => tl?.tags?.name ?? tl?.name)
      .filter(Boolean);
  }, [detail]);
  const appliedTagSet = useMemo(() => new Set(appliedTags), [appliedTags]);

  // ─── Mutations ──────────────────────────────────────────────────────
  const patchContact = useMutation({
    mutationFn: async (patch: Record<string, any>) => {
      if (!contactId) return null;
      const res = await apiRequest("PATCH", `/api/contacts/${contactId}`, patch);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contacts", contactId] });
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      toast({ title: "Saved", description: "Contact updated." });
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err?.message ?? "Could not save contact.",
        variant: "destructive",
      });
    },
  });

  const deleteContact = useMutation({
    mutationFn: async () => {
      if (!contactId) return;
      await apiRequest("DELETE", `/api/contacts/${contactId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      toast({ title: "Deleted", description: "Contact removed." });
      setDeleteConfirmOpen(false);
      onOpenChange(false);
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err?.message ?? "Could not delete contact.",
        variant: "destructive",
      });
    },
  });

  // Toggle a single tag — sends the full desired list so the backend can
  // diff against current. Reuses the existing `tags` field on PATCH.
  const toggleTag = (tag: string) => {
    const next = appliedTagSet.has(tag)
      ? appliedTags.filter((t) => t !== tag)
      : [...appliedTags, tag];
    patchContact.mutate({ tags: next });
  };

  // Persist a single field — guards against no-op writes so we don't fire
  // a useless PATCH on every blur.
  const saveField = (field: keyof typeof editing) => {
    const current = (detail?.[field] ?? "") as string;
    const next = (editing[field] ?? "").trim();
    if (current === next) return;
    patchContact.mutate({ [field]: next });
  };

  // ─── Derived display values ─────────────────────────────────────────
  const displayName =
    detail?.full_name ??
    [detail?.first_name, detail?.last_name].filter(Boolean).join(" ") ??
    contact?.displayName ??
    contact?.name ??
    "Unknown";
  const initials = String(displayName)
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const avatarColor = getAvatarColor(displayName);

  const counts = detail?.counts ?? { tasks: 0, bookings: 0, calls: 0, ad_clicks: null };
  const sidebarSections = [
    { id: "contacts", label: "CONTACTS", icon: User, count: 1 },
    { id: "tasks", label: "TASKS", icon: ClipboardList, count: counts.tasks ?? 0 },
    { id: "opportunities", label: "OPPORTUNITIES", icon: BarChart3, count: 0 },
    { id: "bookings", label: "BOOKINGS", icon: Calendar, count: counts.bookings ?? 0 },
    { id: "calls", label: "CALLS", icon: Phone, count: counts.calls ?? 0 },
    {
      id: "adclicks",
      label: "AD CLICKS",
      icon: MousePointerClick,
      count: counts.ad_clicks ?? null,
    },
  ];

  // Header copy — real created_at + source, no more "Uploaded from a file..."
  const createdAtText = detail?.created_at
    ? `Created on ${format(new Date(detail.created_at), "yyyy-MM-dd HH:mm")}`
    : null;
  const sourceText = detail?.source
    ? `${createdAtText ? " • " : ""}Source: ${String(detail.source).replace(/_/g, " ").toLowerCase()}`
    : "";

  if (!contact) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] h-[95vh] max-w-[95vw] flex flex-col p-0 gap-0 bg-background overflow-hidden border-none shadow-2xl">
        {/* Global Close Button */}
        <div className="absolute top-3 right-3 z-50">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 rounded-full hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-1 overflow-hidden h-full">
          {/* LEFT COLUMN — sidebar navigation */}
          <div className="w-[260px] border-r bg-muted/30 flex flex-col">
            <div className="p-6 pb-2">
              <div className="flex items-center gap-3 mb-6">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarFallback className={`text-sm font-medium ${avatarColor} text-white`}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                  <h2 className="text-sm font-semibold truncate">{displayName}</h2>
                  <p className="text-xs text-muted-foreground truncate">
                    {detail?.title ?? "Add description, URL..."}
                  </p>
                  {detail?.id && (
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground font-mono">
                      <Key className="h-3 w-3" /> {detail.id}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="px-3 space-y-0.5">
                {sidebarSections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <div key={section.id}>
                      <button
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-all ${
                          isActive
                            ? "bg-white dark:bg-accent shadow-sm font-medium text-foreground"
                            : "text-muted-foreground hover:bg-white/50 dark:hover:bg-accent/50"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon
                            className={`h-4 w-4 ${isActive ? "text-foreground" : "text-muted-foreground"}`}
                          />
                          <span>{section.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {section.count !== null && (
                            <span className="text-[10px] font-mono">{section.count}</span>
                          )}
                        </div>
                      </button>

                      {/* Nested current-contact entry under CONTACTS */}
                      {isActive && section.id === "contacts" && (
                        <div className="mt-1 ml-4 pl-3 border-l text-sm">
                          <div className="flex items-center justify-between py-1.5 px-2 bg-accent/50 rounded-md">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <Avatar className="h-5 w-5">
                                <AvatarFallback className={`text-[9px] ${avatarColor}`}>
                                  {initials}
                                </AvatarFallback>
                              </Avatar>
                              <span className="truncate">{displayName}</span>
                            </div>
                            <MoreHorizontal className="h-3 w-3 text-muted-foreground" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* MIDDLE COLUMN — profile data (only CONTACTS section rendered for now;
              other sidebar items show a coming-soon stub so the page doesn't
              white-screen when toggled). */}
          <div className="flex-1 flex flex-col border-r bg-background">
            <div className="h-14 border-b flex items-center justify-between px-8 bg-background">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  {createdAtText ?? "—"}
                  {sourceText}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 gap-1"
                  onClick={() => setDeleteConfirmOpen(true)}
                  disabled={!detail?.id}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete contact
                </Button>
                {detail?.id && (
                  <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                    <Key className="h-3.5 w-3.5" /> {detail.id}
                  </span>
                )}
              </div>
            </div>

            <ScrollArea className="flex-1">
              {detailLoading && !detail ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : !detail ? (
                <div className="flex items-center justify-center h-64 text-sm text-muted-foreground">
                  Could not load contact.
                </div>
              ) : activeSection !== "contacts" ? (
                <div className="px-8 py-12 text-center">
                  <p className="text-sm font-medium">{activeSection.toUpperCase()}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(counts as any)[activeSection] ?? 0} linked records. Detailed list coming soon.
                  </p>
                </div>
              ) : (
                <div className="px-8 py-6 space-y-0">
                  {/* Contact picture */}
                  <Row label="Contact picture">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className={avatarColor}>{initials}</AvatarFallback>
                      </Avatar>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </Row>

                  {/* Editable first / last name */}
                  <Row label="First Name">
                    <EditableInput
                      value={editing.first_name}
                      onChange={(v) => setEditing((s) => ({ ...s, first_name: v }))}
                      onBlur={() => saveField("first_name")}
                    />
                  </Row>
                  <Row label="Last Name">
                    <EditableInput
                      value={editing.last_name}
                      onChange={(v) => setEditing((s) => ({ ...s, last_name: v }))}
                      onBlur={() => saveField("last_name")}
                    />
                  </Row>

                  {/* Title + Gender */}
                  <Row label="Title">
                    <EditableInput
                      value={editing.title}
                      placeholder="—"
                      onChange={(v) => setEditing((s) => ({ ...s, title: v }))}
                      onBlur={() => saveField("title")}
                    />
                  </Row>
                  <Row label="Gender">
                    <Select
                      value={editing.gender || "unspecified"}
                      onValueChange={(v) => {
                        const next = v === "unspecified" ? "" : v;
                        setEditing((s) => ({ ...s, gender: next }));
                        patchContact.mutate({ gender: next });
                      }}
                    >
                      <SelectTrigger className="h-8 w-40 border-transparent shadow-none hover:border-input">
                        <SelectValue placeholder="—" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unspecified">—</SelectItem>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </Row>

                  {/* Phone section — renders from real contact_mobiles rows */}
                  <Row
                    label={
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center dark:bg-emerald-900/30 dark:text-emerald-400">
                          <Phone className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-sm font-semibold">Phone</span>
                      </div>
                    }
                    align="start"
                  >
                    <div className="space-y-2">
                      {detail.phones && detail.phones.length > 0 ? (
                        detail.phones.map((p: any) => (
                          <div key={p.id} className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium">
                              {p.full_mobile_number ?? `${p.country_code ?? ""} ${p.mobile_number ?? ""}`.trim()}
                            </span>
                            {p.is_primary && (
                              <Badge
                                variant="secondary"
                                className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-300 rounded-sm px-1.5 h-5 text-[10px]"
                              >
                                Primary
                              </Badge>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No phone numbers</p>
                      )}
                    </div>
                  </Row>

                  {/* WhatsApp */}
                  <Row
                    label={
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center dark:bg-emerald-900/30 dark:text-emerald-400">
                          <MessageSquare className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-sm font-semibold">WhatsApp</span>
                      </div>
                    }
                    align="start"
                  >
                    <div className="space-y-2">
                      {detail.whatsapps && detail.whatsapps.length > 0 ? (
                        detail.whatsapps.map((w: any) => (
                          <div key={w.id} className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium">
                              {w.full_mobile_number ?? `${w.country_code ?? ""} ${w.mobile_number ?? ""}`.trim()}
                            </span>
                            {w.is_primary && (
                              <Badge
                                variant="secondary"
                                className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-300 rounded-sm px-1.5 h-5 text-[10px]"
                              >
                                Primary
                              </Badge>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No WhatsApp numbers</p>
                      )}
                    </div>
                  </Row>

                  {/* Email */}
                  <Row
                    label={
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center dark:bg-purple-900/30 dark:text-purple-400">
                          <Mail className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-sm font-semibold">Email</span>
                      </div>
                    }
                    align="start"
                  >
                    <div className="space-y-2">
                      {detail.emails && detail.emails.length > 0 ? (
                        detail.emails.map((e: any) => (
                          <div key={e.id} className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium">{e.email}</span>
                            {e.is_primary && (
                              <Badge
                                variant="secondary"
                                className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-300 rounded-sm px-1.5 h-5 text-[10px]"
                              >
                                Primary
                              </Badge>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No email addresses</p>
                      )}
                    </div>
                  </Row>

                  {/* Applied tags — show what's currently linked. Picker lives
                      in the right panel. */}
                  <div className="grid grid-cols-[180px_1fr] py-6 items-start">
                    <label className="text-sm font-bold text-foreground pt-1">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {appliedTags.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No tags applied yet.</p>
                      ) : (
                        appliedTags.map((tag: string) => (
                          <div
                            key={tag}
                            className="text-[11px] font-medium px-2.5 py-1 rounded-md border bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 flex items-center gap-1.5 transition-colors"
                          >
                            {tag}
                            <X
                              className="h-3 w-3 cursor-pointer opacity-40 hover:opacity-100"
                              onClick={() => toggleTag(tag)}
                            />
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>
          </div>

          {/* RIGHT COLUMN — system fields, custom fields, tag picker */}
          <div className="w-[300px] bg-muted/10 border-l flex flex-col">
            <div className="h-14 border-b flex items-center justify-between px-4 bg-muted/20">
              <Button variant="ghost" size="sm" className="hidden">
                Back
              </Button>
              <div className="w-full text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground h-auto p-0"
                >
                  ← View contact history
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-6">
                {/* SYSTEM FIELDS — Language / Locale / Timezone editable */}
                <div>
                  <div className="flex items-center justify-between py-2 mb-2">
                    <h3 className="text-[11px] font-bold text-muted-foreground tracking-wider">
                      SYSTEM FIELDS
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <SystemFieldRow label="Title">
                      <EditableInput
                        compact
                        value={editing.title}
                        placeholder="—"
                        onChange={(v) => setEditing((s) => ({ ...s, title: v }))}
                        onBlur={() => saveField("title")}
                      />
                    </SystemFieldRow>
                    <SystemFieldRow label="Language">
                      <EditableInput
                        compact
                        value={editing.language}
                        placeholder="—"
                        onChange={(v) => setEditing((s) => ({ ...s, language: v }))}
                        onBlur={() => saveField("language")}
                      />
                    </SystemFieldRow>
                    <SystemFieldRow label="Locale">
                      <EditableInput
                        compact
                        value={editing.locale}
                        placeholder="—"
                        onChange={(v) => setEditing((s) => ({ ...s, locale: v }))}
                        onBlur={() => saveField("locale")}
                      />
                    </SystemFieldRow>
                    <SystemFieldRow label="Timezone">
                      <EditableInput
                        compact
                        value={editing.timezone}
                        placeholder="—"
                        onChange={(v) => setEditing((s) => ({ ...s, timezone: v }))}
                        onBlur={() => saveField("timezone")}
                      />
                    </SystemFieldRow>
                  </div>
                </div>

                <Separator className="bg-border/60" />

                {/* CUSTOM FIELDS — pulled from workspace definitions, values
                    overlaid from the contact's entity_values payload. */}
                <div>
                  <div className="flex items-center justify-between py-2 mb-2">
                    <h3 className="text-[11px] font-bold text-muted-foreground tracking-wider">
                      CUSTOM FIELDS{" "}
                      <span className="text-muted-foreground/50 font-normal ml-1">
                        {workspaceCustomFields.length}
                      </span>
                    </h3>
                    <Search className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <div className="space-y-3">
                    {workspaceCustomFields.length === 0 ? (
                      <p className="text-xs text-muted-foreground">
                        No custom fields configured.
                      </p>
                    ) : (
                      workspaceCustomFields.slice(0, 20).map((field: any) => {
                        const slug = field.slug ?? field.system_name ?? field.name;
                        const label = field.label ?? field.name ?? slug;
                        return (
                          <div key={slug} className="flex gap-2">
                            <div className="w-[110px] h-8 flex items-center bg-background border rounded px-2 text-xs text-muted-foreground shadow-sm truncate">
                              <span className="truncate">{label}</span>
                            </div>
                            <Input
                              value={cfValue(slug)}
                              readOnly
                              className="h-8 text-xs flex-1 bg-background shadow-sm"
                              placeholder="—"
                            />
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <Separator className="bg-border/60" />

                {/* TAGS picker — workspace tags + currently applied highlighted */}
                <div>
                  <div className="flex items-center justify-between py-2 mb-2">
                    <h3 className="text-[11px] font-bold text-muted-foreground tracking-wider">
                      TAGS{" "}
                      <span className="text-muted-foreground/50 font-normal ml-1">
                        {workspaceTags.length}
                      </span>
                    </h3>
                    <Search className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      {workspaceTags.length === 0 ? (
                        <p className="col-span-2 text-xs text-muted-foreground">
                          No tags in workspace.
                        </p>
                      ) : (
                        workspaceTags.slice(0, 30).map((t) => {
                          const isApplied = appliedTagSet.has(t);
                          return (
                            <Button
                              key={t}
                              onClick={() => toggleTag(t)}
                              variant="outline"
                              size="sm"
                              className={`h-7 text-xs justify-between bg-background font-normal shadow-sm ${
                                isApplied
                                  ? "border-primary/40 text-primary"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {t}
                              {isApplied ? (
                                <Check className="h-3 w-3 opacity-80" />
                              ) : (
                                <ChevronRight className="h-3 w-3 rotate-90 opacity-50" />
                              )}
                            </Button>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>

      {/* Delete confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete contact?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-semibold">{displayName}</span> will be permanently removed.
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteContact.mutate()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteContact.isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}

// ─── Small layout helpers — kept local since they only style this modal ─

function Row({
  label,
  children,
  align = "center",
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  align?: "center" | "start";
}) {
  return (
    <div
      className={`grid grid-cols-[180px_1fr] py-4 border-b border-border/50 ${
        align === "start" ? "items-start" : "items-center"
      }`}
    >
      {typeof label === "string" ? (
        <label className="text-sm font-medium text-muted-foreground">{label}</label>
      ) : (
        label
      )}
      <div>{children}</div>
    </div>
  );
}

function EditableInput({
  value,
  onChange,
  onBlur,
  placeholder,
  compact,
}: {
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  placeholder?: string;
  compact?: boolean;
}) {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      onKeyDown={(e) => {
        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
      }}
      placeholder={placeholder ?? "—"}
      className={
        compact
          ? "h-8 text-xs flex-1 bg-background shadow-sm"
          : "h-8 w-full max-w-xs border-transparent shadow-none hover:border-input focus:border-ring px-0 font-medium"
      }
    />
  );
}

function SystemFieldRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-2">
      <div className="w-[100px] h-8 flex items-center bg-background border rounded px-2 text-xs text-muted-foreground shadow-sm">
        <span className="truncate">{label}</span>
      </div>
      {children}
    </div>
  );
}
