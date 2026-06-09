import { useState, useEffect } from "react";
import {
  ChevronLeft,
  Instagram,
  Users,
  Plus,
  Trash2,
  Save,
  Link,
  Globe,
  MessageSquare,
  BookOpen,
  UserCog,
  Image,
  RefreshCw,
  ToggleLeft,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

interface Props {
  page: any;
  onBack: () => void;
}

// ── Automation selector ─────────────────────────────────────────────
function AutomationSelect({
  value,
  onChange,
  automations,
  dark,
  border,
  text,
  sub,
}: {
  value: string | null;
  onChange: (v: string | null) => void;
  automations: any[];
  dark: boolean;
  border: string;
  text: string;
  sub: string;
}) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value || null)}
      className={cn(
        "w-full h-10 px-3 rounded-xl border text-[12px] font-bold transition-all focus:outline-none focus:ring-2 focus:ring-primary/30",
        dark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900",
      )}
    >
      <option value="">— No automation —</option>
      {automations.map((a: any) => (
        <option key={a.id} value={String(a.id)}>
          {a.name}
        </option>
      ))}
    </select>
  );
}

export default function InstagramPageSettings({ page, onBack }: Props) {
  const { mode } = useTheme();
  const dark = mode === "dark";
  const { toast } = useToast();
  const qc = useQueryClient();

  const card       = dark ? "bg-[#0f1829]"    : "bg-white";
  const border     = dark ? "border-slate-800" : "border-slate-200";
  const text       = dark ? "text-white"       : "text-slate-900";
  const sub        = dark ? "text-slate-500"   : "text-slate-400";
  const softBg     = dark ? "bg-slate-950/40"  : "bg-slate-50/50";
  const softBorder = dark ? "border-slate-800" : "border-slate-100";
  const inputCls   = cn(
    "w-full h-10 px-3 rounded-xl border text-[12px] font-bold transition-all focus:outline-none focus:ring-2 focus:ring-primary/30",
    dark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900",
  );

  const outlineBtn = cn(
    "h-9 px-5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
    dark
      ? "border-slate-800 text-slate-300 hover:border-primary/40 hover:text-primary"
      : "border-slate-200 text-slate-700 hover:border-primary/40 hover:text-primary",
  );
  const primaryBtn = cn(
    "h-9 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
    "bg-primary text-white hover:bg-primary/90",
  );
  const igGradient = "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600";

  // ── Automations list (shared across tabs) ────────────────────────
  const { data: automationsData } = useQuery({
    queryKey: ["/api/automations"],
    queryFn: async () => (await apiRequest("GET", "/api/automations")).json(),
  });
  const automations: any[] = automationsData?.automations ?? automationsData?.data ?? [];

  // ── Workspace members (for Page Users tab) ───────────────────────
  const { data: membersData } = useQuery({
    queryKey: ["/api/workspaces/members"],
    queryFn: async () => (await apiRequest("GET", "/api/workspaces/members")).json(),
  });
  const members: any[] = membersData?.members ?? membersData ?? [];

  // ─────────────────────────────────────────────────────────────────
  // TAB: ICE BREAKERS
  // ─────────────────────────────────────────────────────────────────
  const { data: iceBreakersData, isLoading: ibLoading } = useQuery({
    queryKey: ["/api/instagram/pages", String(page.id), "ice-breakers"],
    queryFn: async () => (await apiRequest("GET", `/api/instagram/pages/${page.id}/ice-breakers`)).json(),
  });

  type IceItem = { text: string; automationId: string | null; _id?: string };
  const [iceItems, setIceItems] = useState<IceItem[]>([]);

  useEffect(() => {
    if (iceBreakersData) {
      setIceItems(
        iceBreakersData.map((f: any) => ({
          text: f.text ?? "",
          automationId: f.modelable_id ? String(f.modelable_id) : null,
          _id: String(f.id),
        })),
      );
    }
  }, [iceBreakersData]);

  const saveIbMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/instagram/pages/${page.id}/ice-breakers`, {
        items: iceItems.map((i) => ({ text: i.text, automationId: i.automationId })),
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/instagram/pages", String(page.id), "ice-breakers"] });
      toast({ title: "Saved", description: "Ice breakers updated." });
    },
    onError: () => toast({ title: "Error", description: "Failed to save.", variant: "destructive" }),
  });

  const deleteIbMutation = useMutation({
    mutationFn: async () => { await apiRequest("DELETE", `/api/instagram/pages/${page.id}/ice-breakers`); },
    onSuccess: () => { setIceItems([]); qc.invalidateQueries({ queryKey: ["/api/instagram/pages", String(page.id), "ice-breakers"] }); toast({ title: "Cleared", description: "All ice breakers removed." }); },
    onError: () => toast({ title: "Error", description: "Failed to clear.", variant: "destructive" }),
  });

  // ─────────────────────────────────────────────────────────────────
  // TAB: PERSISTENT MENU
  // ─────────────────────────────────────────────────────────────────
  const { data: menuData, isLoading: menuLoading } = useQuery({
    queryKey: ["/api/instagram/pages", String(page.id), "menu"],
    queryFn: async () => (await apiRequest("GET", `/api/instagram/pages/${page.id}/menu`)).json(),
  });

  type MenuItem = { text: string; payloadType: "postback" | "web_url"; payload: string; automationId: string | null; _id?: string };
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    if (menuData) {
      setMenuItems(
        menuData.map((f: any) => ({
          text: f.text ?? "",
          payloadType: (f.payload_type as "postback" | "web_url") ?? "postback",
          payload: f.payload ?? "",
          automationId: f.modelable_id ? String(f.modelable_id) : null,
          _id: String(f.id),
        })),
      );
    }
  }, [menuData]);

  const saveMenuMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/instagram/pages/${page.id}/menu`, {
        items: menuItems.map((i) => ({ text: i.text, payloadType: i.payloadType, payload: i.payload || null, automationId: i.automationId })),
      });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/instagram/pages", String(page.id), "menu"] }); toast({ title: "Saved", description: "Persistent menu updated." }); },
    onError: () => toast({ title: "Error", description: "Failed to save.", variant: "destructive" }),
  });

  const deleteMenuMutation = useMutation({
    mutationFn: async () => { await apiRequest("DELETE", `/api/instagram/pages/${page.id}/menu`); },
    onSuccess: () => { setMenuItems([]); qc.invalidateQueries({ queryKey: ["/api/instagram/pages", String(page.id), "menu"] }); toast({ title: "Cleared", description: "Persistent menu removed." }); },
    onError: () => toast({ title: "Error", description: "Failed to clear.", variant: "destructive" }),
  });

  // ─────────────────────────────────────────────────────────────────
  // TAB: AUTO REPLY
  // ─────────────────────────────────────────────────────────────────
  const { data: autoReplyData } = useQuery({
    queryKey: ["/api/instagram/pages", String(page.id), "auto-reply"],
    queryFn: async () => (await apiRequest("GET", `/api/instagram/pages/${page.id}/auto-reply`)).json(),
  });

  const [arEnabled, setArEnabled] = useState(false);
  const [arAutomationId, setArAutomationId] = useState<string | null>(null);
  const [arInterval, setArInterval] = useState("247");

  useEffect(() => {
    if (autoReplyData) {
      setArEnabled(!!autoReplyData.auto_reply_automation_id);
      setArAutomationId(autoReplyData.auto_reply_automation_id ?? null);
      setArInterval(autoReplyData.auto_reply_interval ?? "247");
    }
  }, [autoReplyData]);

  const saveArMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/instagram/pages/${page.id}/auto-reply`, {
        automation_id: arEnabled ? arAutomationId : null,
        interval: arInterval,
      });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/instagram/pages", String(page.id), "auto-reply"] }); toast({ title: "Saved", description: "Auto reply settings updated." }); },
    onError: () => toast({ title: "Error", description: "Failed to save.", variant: "destructive" }),
  });

  // ─────────────────────────────────────────────────────────────────
  // TAB: STORY MENTION
  // ─────────────────────────────────────────────────────────────────
  const { data: storyData } = useQuery({
    queryKey: ["/api/instagram/pages", String(page.id), "story-mention"],
    queryFn: async () => (await apiRequest("GET", `/api/instagram/pages/${page.id}/story-mention`)).json(),
  });

  const [smEnabled, setSmEnabled] = useState(false);
  const [smAutomationId, setSmAutomationId] = useState<string | null>(null);

  useEffect(() => {
    if (storyData) {
      setSmEnabled(!!storyData.modelable_id);
      setSmAutomationId(storyData.modelable_id ? String(storyData.modelable_id) : null);
    }
  }, [storyData]);

  const saveSmMutation = useMutation({
    mutationFn: async () => {
      if (!smEnabled) {
        await apiRequest("DELETE", `/api/instagram/pages/${page.id}/story-mention`);
      } else {
        await apiRequest("POST", `/api/instagram/pages/${page.id}/story-mention`, { automation_id: smAutomationId });
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/instagram/pages", String(page.id), "story-mention"] }); toast({ title: "Saved", description: "Story mention settings updated." }); },
    onError: () => toast({ title: "Error", description: "Failed to save.", variant: "destructive" }),
  });

  // ─────────────────────────────────────────────────────────────────
  // TAB: PAGE USERS
  // ─────────────────────────────────────────────────────────────────
  const { data: pageUsersData } = useQuery({
    queryKey: ["/api/instagram/pages", String(page.id), "users"],
    queryFn: async () => (await apiRequest("GET", `/api/instagram/pages/${page.id}/users`)).json(),
  });

  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (pageUsersData) {
      setSelectedUserIds(new Set(pageUsersData.map((u: any) => String(u.user_id))));
    }
  }, [pageUsersData]);

  const saveUsersMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/instagram/pages/${page.id}/users`, {
        user_ids: Array.from(selectedUserIds),
      });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/instagram/pages", String(page.id), "users"] }); toast({ title: "Saved", description: "Page users updated." }); },
    onError: () => toast({ title: "Error", description: "Failed to save.", variant: "destructive" }),
  });

  function toggleUser(id: string) {
    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────
  return (
    <Card className={cn("rounded-[2rem] border overflow-hidden shadow-sm", card, border)}>
      <CardContent className="p-0">
        {/* ── Header ── */}
        <div className={cn("px-8 py-5 border-b flex items-center justify-between", border)}>
          <div className="flex items-center gap-4">
            <div className={cn("p-2.5 rounded-xl shadow-sm", dark ? "bg-pink-500/15" : "bg-pink-500/10")}>
              {page.picture?.file_url ? (
                <img src={page.picture.file_url} alt={page.name} className="w-5 h-5 rounded-full object-cover" />
              ) : (
                <Instagram className="w-5 h-5 text-pink-500" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={cn("text-[15px] font-black tracking-widest uppercase", text)}>
                  {page.name || "Instagram Account"}
                </h1>
                {page.username && (
                  <Badge variant="outline" className="h-5 px-2 rounded-md border-pink-500/20 bg-pink-500/5 text-pink-600 dark:text-pink-400 text-[9px] font-black uppercase tracking-widest">
                    @{page.username}
                  </Badge>
                )}
              </div>
              <p className={cn("text-[11px] font-bold mt-0.5 opacity-60", sub)}>
                Instagram Page Settings
              </p>
            </div>
          </div>
          <button onClick={onBack} className={cn(
            "h-11 px-6 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
            dark ? "border-slate-800 text-slate-300 hover:border-primary/40 hover:text-primary" : "border-slate-200 text-slate-700 hover:border-primary/40 hover:text-primary",
          )}>
            <ChevronLeft size={12} /> Back
          </button>
        </div>

        {/* ── Tabs ── */}
        <Tabs defaultValue="ice-breakers" className="p-8">
          <TabsList className="h-auto p-0 gap-6 bg-transparent border-none flex justify-start rounded-none mb-8">
            {[
              { value: "ice-breakers",    label: "Ice Breakers",     icon: MessageSquare },
              { value: "menu",            label: "Persistent Menu",  icon: BookOpen },
              { value: "auto-reply",      label: "Auto Reply",       icon: RefreshCw },
              { value: "story-mention",   label: "Story Mention",    icon: Image },
              { value: "page-users",      label: "Page Users",       icon: UserCog },
            ].map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className={cn(
                  "pb-3 px-0 rounded-none border-b-2 border-transparent text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all bg-transparent",
                  "data-[state=active]:border-primary data-[state=active]:text-primary",
                  dark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600",
                )}
              >
                <Icon size={11} /> {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ─── ICE BREAKERS ─── */}
          <TabsContent value="ice-breakers" className="space-y-6">
            <div className={cn("rounded-[1.5rem] border p-6 space-y-5", softBg, softBorder)}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={cn("text-[13px] font-black", text)}>Quick Starter Questions</h3>
                  <p className={cn("text-[11px] opacity-60 mt-0.5", sub)}>
                    Add up to 4 questions shown when a user first messages you. Each can trigger an automation.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {iceItems.length > 0 && (
                    <button onClick={() => deleteIbMutation.mutate()} disabled={deleteIbMutation.isPending} className={outlineBtn}>
                      <Trash2 size={11} /> Clear all
                    </button>
                  )}
                  {iceItems.length < 4 && (
                    <button
                      onClick={() => setIceItems((p) => [...p, { text: "", automationId: null }])}
                      className={cn(
                        "h-9 px-5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-white",
                      )}
                    >
                      <Plus size={11} /> Add Question
                    </button>
                  )}
                </div>
              </div>

              {ibLoading ? (
                <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" /></div>
              ) : iceItems.length === 0 ? (
                <div className={cn("rounded-xl border py-10 flex flex-col items-center justify-center text-center gap-3", softBorder)}>
                  <MessageSquare size={24} className="opacity-30" />
                  <p className={cn("text-[11px] opacity-50 font-medium", sub)}>No quick starter questions yet. Add up to 4.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {iceItems.map((item, i) => (
                    <div key={i} className={cn("rounded-xl border p-4 space-y-3", dark ? "bg-slate-900/60 border-slate-700" : "bg-white border-slate-200")}>
                      <div className="flex items-center gap-2">
                        <span className={cn("text-[9px] font-black uppercase tracking-widest opacity-40 w-6 shrink-0", sub)}>Q{i + 1}</span>
                        <input
                          value={item.text}
                          maxLength={60}
                          onChange={(e) => setIceItems((p) => p.map((it, idx) => idx === i ? { ...it, text: e.target.value } : it))}
                          placeholder="Question text (max 60 chars)"
                          className={cn(inputCls, "flex-1")}
                        />
                        <button
                          onClick={() => setIceItems((p) => p.filter((_, idx) => idx !== i))}
                          className={cn("w-9 h-9 rounded-xl border flex items-center justify-center transition-all text-rose-500", dark ? "border-slate-700 hover:bg-rose-500/10" : "border-slate-200 hover:bg-rose-500/10")}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <div className="pl-8">
                        <label className={cn("text-[10px] font-black uppercase tracking-widest opacity-50 mb-1 block", sub)}>
                          Trigger automation
                        </label>
                        <AutomationSelect
                          value={item.automationId}
                          onChange={(v) => setIceItems((p) => p.map((it, idx) => idx === i ? { ...it, automationId: v } : it))}
                          automations={automations}
                          dark={dark} border={border} text={text} sub={sub}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {iceItems.length > 0 && (
                <div className="flex justify-end">
                  <button onClick={() => saveIbMutation.mutate()} disabled={saveIbMutation.isPending} className={cn("h-9 px-6 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-primary/90 transition-all")}>
                    <Save size={11} /> {saveIbMutation.isPending ? "Saving…" : "Save"}
                  </button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ─── PERSISTENT MENU ─── */}
          <TabsContent value="menu" className="space-y-6">
            <div className={cn("rounded-[1.5rem] border p-6 space-y-5", softBg, softBorder)}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={cn("text-[13px] font-black", text)}>Persistent Menu</h3>
                  <p className={cn("text-[11px] opacity-60 mt-0.5", sub)}>
                    Add up to 20 menu items. Each can trigger an automation or open a URL.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {menuItems.length > 0 && (
                    <button onClick={() => deleteMenuMutation.mutate()} disabled={deleteMenuMutation.isPending} className={outlineBtn}>
                      <Trash2 size={11} /> Clear all
                    </button>
                  )}
                  {menuItems.length < 20 && (
                    <button
                      onClick={() => setMenuItems((p) => [...p, { text: "", payloadType: "postback", payload: "", automationId: null }])}
                      className="h-9 px-5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      <Plus size={11} /> Add Item
                    </button>
                  )}
                </div>
              </div>

              {menuLoading ? (
                <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" /></div>
              ) : menuItems.length === 0 ? (
                <div className={cn("rounded-xl border py-10 flex flex-col items-center justify-center text-center gap-3", softBorder)}>
                  <BookOpen size={24} className="opacity-30" />
                  <p className={cn("text-[11px] opacity-50 font-medium", sub)}>No menu items yet. Add up to 20.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {menuItems.map((item, i) => (
                    <div key={i} className={cn("rounded-xl border p-4 space-y-3", dark ? "bg-slate-900/60 border-slate-700" : "bg-white border-slate-200")}>
                      <div className="flex items-center gap-2">
                        <span className={cn("text-[9px] font-black uppercase tracking-widest opacity-40 w-6 shrink-0", sub)}>{i + 1}</span>
                        <input
                          value={item.text}
                          maxLength={30}
                          onChange={(e) => setMenuItems((p) => p.map((it, idx) => idx === i ? { ...it, text: e.target.value } : it))}
                          placeholder="Menu item label (max 30 chars)"
                          className={cn(inputCls, "flex-1")}
                        />
                        <select
                          value={item.payloadType}
                          onChange={(e) => setMenuItems((p) => p.map((it, idx) => idx === i ? { ...it, payloadType: e.target.value as "postback" | "web_url" } : it))}
                          className={cn("h-10 px-3 rounded-xl border text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-primary/30 w-28 shrink-0", dark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900")}
                        >
                          <option value="postback">Automation</option>
                          <option value="web_url">Web URL</option>
                        </select>
                        <button
                          onClick={() => setMenuItems((p) => p.filter((_, idx) => idx !== i))}
                          className={cn("w-9 h-9 rounded-xl border flex items-center justify-center transition-all text-rose-500 shrink-0", dark ? "border-slate-700 hover:bg-rose-500/10" : "border-slate-200 hover:bg-rose-500/10")}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <div className="pl-8">
                        {item.payloadType === "postback" ? (
                          <>
                            <label className={cn("text-[10px] font-black uppercase tracking-widest opacity-50 mb-1 block", sub)}>Trigger automation</label>
                            <AutomationSelect
                              value={item.automationId}
                              onChange={(v) => setMenuItems((p) => p.map((it, idx) => idx === i ? { ...it, automationId: v } : it))}
                              automations={automations}
                              dark={dark} border={border} text={text} sub={sub}
                            />
                          </>
                        ) : (
                          <>
                            <label className={cn("text-[10px] font-black uppercase tracking-widest opacity-50 mb-1 block", sub)}>URL</label>
                            <input
                              value={item.payload}
                              onChange={(e) => setMenuItems((p) => p.map((it, idx) => idx === i ? { ...it, payload: e.target.value } : it))}
                              placeholder="https://example.com"
                              className={inputCls}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {menuItems.length > 0 && (
                <div className="flex justify-end">
                  <button onClick={() => saveMenuMutation.mutate()} disabled={saveMenuMutation.isPending} className="h-9 px-6 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-primary/90 transition-all">
                    <Save size={11} /> {saveMenuMutation.isPending ? "Saving…" : "Save"}
                  </button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ─── AUTO REPLY ─── */}
          <TabsContent value="auto-reply" className="space-y-6">
            <div className={cn("rounded-[1.5rem] border p-6 space-y-6", softBg, softBorder)}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={cn("text-[13px] font-black", text)}>Default Auto Reply</h3>
                  <p className={cn("text-[11px] opacity-60 mt-0.5 max-w-xl", sub)}>
                    Automatically trigger an automation when someone messages this account for the first time (within the auto-reply interval window).
                  </p>
                </div>
                <Switch
                  checked={arEnabled}
                  onCheckedChange={setArEnabled}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              {arEnabled && (
                <div className="space-y-4">
                  <div>
                    <label className={cn("text-[10px] font-black uppercase tracking-widest opacity-60 mb-2 block", sub)}>
                      Automation to trigger
                    </label>
                    <AutomationSelect
                      value={arAutomationId}
                      onChange={setArAutomationId}
                      automations={automations}
                      dark={dark} border={border} text={text} sub={sub}
                    />
                  </div>
                  <div>
                    <label className={cn("text-[10px] font-black uppercase tracking-widest opacity-60 mb-2 block", sub)}>
                      Auto-reply interval (hours)
                    </label>
                    <input
                      value={arInterval}
                      onChange={(e) => setArInterval(e.target.value)}
                      placeholder="247"
                      type="number"
                      min={1}
                      className={cn(inputCls, "w-40")}
                    />
                    <p className={cn("text-[10px] mt-1.5 opacity-50", sub)}>
                      Default 247 hrs. Auto reply will not re-fire within this window.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button onClick={() => saveArMutation.mutate()} disabled={saveArMutation.isPending} className="h-9 px-6 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-primary/90 transition-all">
                  <Save size={11} /> {saveArMutation.isPending ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          </TabsContent>

          {/* ─── STORY MENTION ─── */}
          <TabsContent value="story-mention" className="space-y-6">
            <div className={cn("rounded-[1.5rem] border p-6 space-y-6", softBg, softBorder)}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={cn("text-[13px] font-black", text)}>Story Mention Automation</h3>
                  <p className={cn("text-[11px] opacity-60 mt-0.5 max-w-xl", sub)}>
                    Trigger an automation whenever someone mentions this Instagram account in their story.
                  </p>
                </div>
                <Switch
                  checked={smEnabled}
                  onCheckedChange={setSmEnabled}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              {smEnabled && (
                <div>
                  <label className={cn("text-[10px] font-black uppercase tracking-widest opacity-60 mb-2 block", sub)}>
                    Automation to trigger on story mention
                  </label>
                  <AutomationSelect
                    value={smAutomationId}
                    onChange={setSmAutomationId}
                    automations={automations}
                    dark={dark} border={border} text={text} sub={sub}
                  />
                </div>
              )}

              <div className="flex justify-end">
                <button onClick={() => saveSmMutation.mutate()} disabled={saveSmMutation.isPending} className="h-9 px-6 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-primary/90 transition-all">
                  <Save size={11} /> {saveSmMutation.isPending ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          </TabsContent>

          {/* ─── PAGE USERS ─── */}
          <TabsContent value="page-users" className="space-y-6">
            <div className={cn("rounded-[1.5rem] border p-6 space-y-5", softBg, softBorder)}>
              <div>
                <h3 className={cn("text-[13px] font-black", text)}>Page Access Control</h3>
                <p className={cn("text-[11px] opacity-60 mt-0.5", sub)}>
                  Select which workspace agents have access to manage and respond from this Instagram page.
                </p>
              </div>

              {members.length === 0 ? (
                <div className={cn("rounded-xl border py-10 flex flex-col items-center justify-center text-center gap-3", softBorder)}>
                  <Users size={24} className="opacity-30" />
                  <p className={cn("text-[11px] opacity-50 font-medium", sub)}>No workspace members found.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {members.map((m: any) => {
                    const uid = String(m.id);
                    const checked = selectedUserIds.has(uid);
                    return (
                      <div
                        key={uid}
                        onClick={() => toggleUser(uid)}
                        className={cn(
                          "flex items-center gap-4 px-4 py-3 rounded-xl border cursor-pointer transition-all",
                          checked
                            ? dark ? "border-primary/40 bg-primary/10" : "border-primary/30 bg-primary/5"
                            : dark ? "border-slate-800 hover:border-slate-700" : "border-slate-200 hover:border-slate-300",
                        )}
                      >
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black shrink-0", igGradient, "text-white")}>
                          {(m.name || m.email || "?")[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-[12px] font-black truncate", text)}>{m.name || "—"}</p>
                          <p className={cn("text-[10px] opacity-50 truncate", sub)}>{m.email}</p>
                        </div>
                        <div className={cn("w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all", checked ? "bg-primary border-primary" : dark ? "border-slate-600" : "border-slate-300")}>
                          {checked && (
                            <svg viewBox="0 0 10 8" fill="none" className="w-3 h-3">
                              <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {members.length > 0 && (
                <div className="flex justify-end">
                  <button onClick={() => saveUsersMutation.mutate()} disabled={saveUsersMutation.isPending} className="h-9 px-6 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-primary/90 transition-all">
                    <Save size={11} /> {saveUsersMutation.isPending ? "Saving…" : "Save"}
                  </button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
