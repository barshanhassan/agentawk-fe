import { useState } from "react";
import {
  ChevronLeft,
  MoreVertical,
  Plus,
  Instagram,
  RefreshCw,
  Bot,
  Trash2,
  AlertCircle,
  Users,
  Settings,
  Sparkles,
  History,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import InstagramPageSettings from "./InstagramPageSettings";

type View = "list" | "preferred" | "old" | "page";

const IG_SCOPES = [
  "instagram_basic",
  "instagram_manage_messages",
  "instagram_manage_comments",
  "pages_show_list",
  "pages_read_engagement",
].join(",");

const FB_SCOPES = [
  "pages_show_list",
  "instagram_basic",
  "instagram_manage_messages",
  "pages_read_engagement",
].join(",");

function buildIgAuthUrl(appId: string): string {
  const redirectUri = encodeURIComponent(`${window.location.origin}/instagram-callback`);
  return `https://api.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=${redirectUri}&scope=${encodeURIComponent(IG_SCOPES)}&response_type=code`;
}

function buildFbAuthUrl(appId: string, version: string): string {
  const redirectUri = encodeURIComponent(`${window.location.origin}/instagram-pages`);
  return `https://www.facebook.com/${version}/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${encodeURIComponent(FB_SCOPES)}&response_type=token`;
}

function statusBadge(status: string) {
  const map: Record<string, { label: string; color: string }> = {
    ACTIVE:       { label: "Active",        color: "text-emerald-600 dark:text-emerald-400" },
    PENDING:      { label: "Pending",       color: "text-amber-600 dark:text-amber-400" },
    FAILED:       { label: "Failed",        color: "text-rose-600 dark:text-rose-400" },
    DISCONNECTED: { label: "Disconnected",  color: "text-slate-500" },
    ERROR:        { label: "Error",         color: "text-rose-600 dark:text-rose-400" },
    NOT_CONNECTED:{ label: "Not connected", color: "text-slate-500" },
    DELETING:     { label: "Deleting…",     color: "text-slate-400" },
    DELETED:      { label: "Deleted",       color: "text-slate-400" },
  };
  const info = map[status] ?? { label: status, color: "text-slate-500" };
  const dot: Record<string, string> = {
    ACTIVE:       "bg-emerald-500",
    PENDING:      "bg-amber-500",
    FAILED:       "bg-rose-500",
    DISCONNECTED: "bg-slate-400",
    ERROR:        "bg-rose-500",
  };
  return (
    <span className={cn("flex items-center gap-1 text-[10px] font-black uppercase tracking-widest", info.color)}>
      <div className={cn("w-1.5 h-1.5 rounded-full", dot[status] ?? "bg-slate-400")} />
      {info.label}
    </span>
  );
}

export default function InstagramSection() {
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

  const outlineBtn = cn(
    "h-11 px-6 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
    dark
      ? "border-slate-800 text-slate-300 hover:border-primary/40 hover:text-primary"
      : "border-slate-200 text-slate-700 hover:border-primary/40 hover:text-primary",
  );
  const primaryOutlineBtn = cn(
    "h-10 px-6 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
    "border-primary text-primary hover:bg-primary hover:text-white",
  );
  const igGradient = "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600";

  const [view, setView] = useState<View>("list");
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<any>(null);

  const { data: channels, isLoading } = useQuery({
    queryKey: ["/api/integrations/channels"],
    queryFn: async () => (await apiRequest("GET", "/api/integrations/channels")).json(),
  });

  const allAccounts: any[] = channels?.instagram || [];
  const preferredAccounts = allAccounts.filter((a) => a.platform === "instagram" || !a.platform);
  const oldAccounts = allAccounts.filter((a) => a.platform === "facebook");
  const activeAccounts = view === "preferred" ? preferredAccounts : oldAccounts;

  const deleteMutation = useMutation({
    mutationFn: async (id: string | number) => {
      await apiRequest("DELETE", `/api/integrations/channels/instagram/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/integrations/channels"] });
      toast({ title: "Deleted", description: "Instagram account removed." });
    },
    onError: () => toast({ title: "Error", description: "Failed to delete.", variant: "destructive" }),
  });

  const feederMutation = useMutation({
    mutationFn: async ({ id, enabled }: { id: string | number; enabled: boolean }) => {
      await apiRequest("POST", `/api/instagram/pages/${id}/toggle-feeder`, { enabled });
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["/api/integrations/channels"] });
      toast({ title: "Updated", description: `AI Feeder ${vars.enabled ? "enabled" : "disabled"}.` });
    },
    onError: () => toast({ title: "Error", description: "Failed to update feeder.", variant: "destructive" }),
  });

  const syncMutation = useMutation({
    mutationFn: async (id: string | number) => {
      await apiRequest("POST", `/api/instagram/pages/${id}/sync`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/integrations/channels"] });
      toast({ title: "Synced", description: "Account stats refreshed from Instagram." });
    },
    onError: () => toast({ title: "Sync failed", description: "Could not refresh stats.", variant: "destructive" }),
  });

  function handleAddNew() {
    const appId = "979553311024998";
    const version = "v22.0";
    if (view === "preferred") {
      window.location.href = buildIgAuthUrl(appId);
    } else {
      window.location.href = buildFbAuthUrl(appId, version);
    }
  }

  function openPageSettings(account: any) {
    setSelectedPage(account);
    setView("page");
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // ── Page Settings view ──────────────────────────────────────────────
  if (view === "page" && selectedPage) {
    return (
      <InstagramPageSettings
        page={selectedPage}
        onBack={() => {
          setView(selectedPage.platform === "facebook" ? "old" : "preferred");
          setSelectedPage(null);
        }}
      />
    );
  }

  // ── Manage view (preferred | old) ───────────────────────────────────
  if (view === "preferred" || view === "old") {
    const isPreferred = view === "preferred";
    return (
      <>
        <Card className={cn("rounded-[2rem] border overflow-hidden shadow-sm", card, border)}>
          <CardContent className="p-0">
            {/* Header */}
            <div className={cn("px-8 py-5 border-b flex items-center justify-between", border)}>
              <div className="flex items-center gap-4">
                <div className={cn("p-2.5 rounded-xl shadow-sm", dark ? "bg-pink-500/15" : "bg-pink-500/10")}>
                  <Instagram className="w-5 h-5 text-pink-500" />
                </div>
                <div>
                  <h1 className={cn("text-[15px] font-black tracking-widest uppercase", text)}>
                    Instagram{isPreferred ? "" : " — Facebook Managed"}
                  </h1>
                  <p className={cn("text-[11px] font-bold mt-0.5 opacity-60", sub)}>
                    {isPreferred
                      ? "Instagram Business accounts using the new Instagram API."
                      : "Instagram accounts linked through a Facebook Business Page."}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {isPreferred && (
                  <button onClick={handleAddNew} className={primaryOutlineBtn}>
                    <Plus size={12} /> Add New
                  </button>
                )}
                <button onClick={() => setView("list")} className={outlineBtn}>
                  <ChevronLeft size={12} /> Back
                </button>
              </div>
            </div>

            {/* Accounts */}
            <div className="p-8 space-y-5">
              {activeAccounts.length === 0 ? (
                <div className={cn("rounded-[1.5rem] border py-16 px-8 flex flex-col items-center justify-center text-center space-y-5", softBg, softBorder)}>
                  <div className={cn("w-16 h-16 rounded-full flex items-center justify-center", igGradient)}>
                    <Instagram className="w-8 h-8 text-white" />
                  </div>
                  <div className="space-y-1.5 max-w-sm">
                    <h3 className={cn("text-[14px] font-black tracking-tight", text)}>
                      {isPreferred ? "No integration found" : "Instagram account is not connected yet"}
                    </h3>
                    <p className={cn("text-[11px] font-medium opacity-60 leading-relaxed", sub)}>
                      {isPreferred
                        ? "Connect an Instagram Business account to start automating conversations."
                        : "This integration method is no longer supported. Please use the new Instagram integration method that only requires Instagram Login for authentication."}
                    </p>
                  </div>
                  {isPreferred && (
                    <button onClick={handleAddNew} className={primaryOutlineBtn}>
                      Connect now
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {activeAccounts.map((account: any) => (
                    <div key={account.id} className={cn("rounded-[1.5rem] border overflow-hidden", softBorder, softBg)}>
                      {/* Account header */}
                      <div className={cn("px-6 py-4 border-b flex items-center justify-between gap-4", softBorder, dark ? "bg-slate-900/40" : "bg-white/60")}>
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative shrink-0">
                            {account.picture?.file_url ? (
                              <img src={account.picture.file_url} alt={account.name} className="w-12 h-12 rounded-full object-cover" />
                            ) : (
                              <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", igGradient)}>
                                <Users className="w-5 h-5 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className={cn("text-[13px] font-black truncate", text)}>{account.name || "Instagram Account"}</p>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              {account.username && (
                                <Badge variant="outline" className="h-5 px-2 rounded-md border-pink-500/20 bg-pink-500/5 text-pink-600 dark:text-pink-400 text-[9px] font-black uppercase tracking-widest">
                                  @{account.username}
                                </Badge>
                              )}
                              {statusBadge(account.status ?? "ACTIVE")}
                              {account.fail_reason && (
                                <span className={cn("text-[9px] font-medium truncate max-w-[200px]", sub)}>{account.fail_reason}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => openPageSettings(account)}
                            className={cn(outlineBtn, "h-9 px-4")}
                          >
                            <Settings size={11} /> Settings
                          </button>
                          <button
                            onClick={() => syncMutation.mutate(account.id)}
                            disabled={syncMutation.isPending}
                            className={cn(outlineBtn, "h-9 px-4")}
                          >
                            <RefreshCw size={11} className={syncMutation.isPending ? "animate-spin" : ""} /> Sync
                          </button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className={cn("w-9 h-9 rounded-xl border flex items-center justify-center transition-all", dark ? "border-slate-800 hover:border-primary/40 hover:text-primary" : "border-slate-200 hover:border-primary/40 hover:text-primary")}>
                                <MoreVertical size={13} />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className={cn("rounded-xl p-1.5 min-w-[200px]", dark ? "bg-[#0f1829] border-slate-800" : "")}>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="rounded-lg py-2 cursor-pointer gap-2 font-bold text-[11px] flex justify-between"
                              >
                                <span className="flex items-center gap-2">
                                  <Bot size={12} className="text-primary" /> AI Feeder
                                </span>
                                <Switch
                                  checked={!!account.allow_in_feeder}
                                  onCheckedChange={(v) => feederMutation.mutate({ id: account.id, enabled: v })}
                                  className="data-[state=checked]:bg-primary"
                                />
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openPageSettings(account)}
                                className="rounded-lg py-2 cursor-pointer gap-2 font-bold text-[11px]"
                              >
                                <Settings size={12} className="text-primary" /> Page Settings
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => { setAccountToDelete(account); setShowDeleteConfirm(true); }}
                                className="rounded-lg py-2 cursor-pointer gap-2 font-bold text-[11px] text-rose-500"
                              >
                                <Trash2 size={12} /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 divide-x" style={{ borderColor: dark ? "rgb(30 41 59)" : "rgb(241 245 249)" }}>
                        {[
                          { label: "Posts",     value: account.media_count?.toLocaleString()    || "0" },
                          { label: "Followers", value: account.followers_count?.toLocaleString() || "0" },
                          { label: "Following", value: account.follows_count?.toLocaleString()   || "0" },
                        ].map((stat) => (
                          <div key={stat.label} className="px-6 py-4 text-center" style={{ borderColor: dark ? "rgb(30 41 59)" : "rgb(241 245 249)" }}>
                            <p className={cn("text-[18px] font-black", text)}>{stat.value}</p>
                            <p className={cn("text-[9px] font-black uppercase tracking-widest opacity-60 mt-0.5", sub)}>{stat.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Delete dialog */}
        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <AlertDialogContent className={cn("rounded-[2rem] border p-0 max-w-md overflow-hidden", card, border)}>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                  <AlertCircle size={18} />
                </div>
                <div>
                  <h2 className={cn("text-[13px] font-black uppercase tracking-widest", text)}>Delete Instagram Account?</h2>
                  <p className={cn("text-[11px] font-medium opacity-60 mt-0.5 leading-relaxed", sub)}>
                    <span className="text-rose-500 font-black">{accountToDelete?.name}</span> will be permanently disconnected.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <AlertDialogCancel className={cn(outlineBtn, "m-0")}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => { deleteMutation.mutate(accountToDelete.id); setShowDeleteConfirm(false); }}
                  className="h-11 px-7 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-rose-500/20 flex items-center gap-2"
                >
                  <Trash2 size={12} /> Delete
                </AlertDialogAction>
              </div>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  // ── List view: 2 cards (Preferred + Old) ────────────────────────────
  return (
    <Card className={cn("rounded-[2rem] border overflow-hidden shadow-sm transition-all duration-300", card, border)}>
      <CardContent className="p-0">
        {/* Header */}
        <div className={cn("px-8 py-5 border-b flex items-center gap-4", border)}>
          <div className={cn("p-2.5 rounded-xl shadow-sm", dark ? "bg-pink-500/15" : "bg-pink-500/10")}>
            <Instagram className="w-5 h-5 text-pink-500" />
          </div>
          <div>
            <h1 className={cn("text-[15px] font-black tracking-widest uppercase", text)}>Instagram</h1>
            <p className={cn("text-[11px] font-bold mt-0.5 opacity-60", sub)}>
              Connect your Instagram Business account to automate conversations.
            </p>
          </div>
        </div>

        {/* 2 cards */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Preferred card */}
          <div className={cn("p-6 rounded-[1.5rem] border transition-all hover:shadow-md hover:border-pink-500/30 flex flex-col", softBg, softBorder)}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
                  <Instagram size={18} className="text-pink-500" />
                </div>
                <div>
                  <h3 className={cn("text-[13px] font-black tracking-tight", text)}>Instagram</h3>
                  {preferredAccounts.length > 0 && (
                    <span className={cn("text-[10px] font-black", sub)}>{preferredAccounts.length} connected</span>
                  )}
                </div>
              </div>
              <Badge className="h-5 px-2.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[9px] font-black uppercase tracking-widest border">
                Preferred
              </Badge>
            </div>
            <p className={cn("text-[11px] font-medium opacity-70 leading-relaxed mb-5 flex-1", sub)}>
              Our Preferred integration method is the new Instagram API, which is easier to setup since it doesn't require linking a Facebook Page.
            </p>
            <button onClick={() => setView("preferred")} className={cn(primaryOutlineBtn, "self-end")}>
              Manage
            </button>
          </div>

          {/* Old card */}
          <div className={cn("p-6 rounded-[1.5rem] border transition-all hover:shadow-md hover:border-slate-400/30 flex flex-col", softBg, softBorder)}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
                  <Instagram size={18} className="text-pink-500" />
                </div>
                <div>
                  <h3 className={cn("text-[13px] font-black tracking-tight", text)}>Instagram</h3>
                  {oldAccounts.length > 0 && (
                    <span className={cn("text-[10px] font-black", sub)}>{oldAccounts.length} connected</span>
                  )}
                </div>
              </div>
              <span className={cn("text-[11px] font-black", sub)}>Old</span>
            </div>
            <p className={cn("text-[11px] font-medium opacity-70 leading-relaxed mb-5 flex-1", sub)}>
              Users with an existing integration through the previous Instagram method will retain full management access.
            </p>
            <button onClick={() => setView("old")} className={cn(primaryOutlineBtn, "self-end")}>
              Manage
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
