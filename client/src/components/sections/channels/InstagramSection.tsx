import { useState } from "react";
import {
  ChevronLeft,
  MoreVertical,
  Plus,
  Instagram,
  ExternalLink,
  RefreshCw,
  Bot,
  ShieldCheck,
  Trash2,
  AlertCircle,
  Users,
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

export default function InstagramSection() {
  const { mode } = useTheme();
  const dark = mode === "dark";
  const { toast } = useToast();
  const [view, setView] = useState<"list" | "manage">("list");
  const queryClient = useQueryClient();

  const card       = dark ? "bg-[#0f1829]"    : "bg-white";
  const border     = dark ? "border-slate-800" : "border-slate-200";
  const text       = dark ? "text-white"      : "text-slate-900";
  const sub        = dark ? "text-slate-500"  : "text-slate-400";
  const softBg     = dark ? "bg-slate-950/40" : "bg-slate-50/50";
  const softBorder = dark ? "border-slate-800" : "border-slate-100";

  const outlineBtn = cn(
    "h-11 px-6 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
    dark ? "border-slate-800 text-slate-300 hover:border-primary/40 hover:text-primary" : "border-slate-200 text-slate-700 hover:border-primary/40 hover:text-primary"
  );

  const primaryOutlineBtn = cn(
    "h-10 px-6 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
    "border-primary text-primary hover:bg-primary hover:text-white"
  );

  const { data: channels, isLoading } = useQuery({
    queryKey: ["/api/integrations/channels"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/integrations/channels");
      return res.json();
    },
  });

  const accounts = channels?.instagram || [];
  const hasAccounts = accounts.length > 0;

  const deleteMutation = useMutation({
    mutationFn: async (id: number | string) => {
      await apiRequest("DELETE", `/api/integrations/channels/instagram/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/integrations/channels"] });
      toast({ title: "Deleted", description: "Instagram account removed." });
    },
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<any>(null);

  const handleConnect = () => {
    toast({ title: "Connecting...", description: "Starting Instagram authentication flow." });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Pink/Instagram brand gradient
  const igGradient = "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600";

  return (
    <>
      <Card className={cn("rounded-[2rem] border overflow-hidden shadow-sm transition-all duration-300", card, border)}>
        <CardContent className="p-0">
          {/* Header — dynamic per view */}
          <div className={cn("px-8 py-5 border-b flex items-center justify-between", border)}>
            <div className="flex items-center gap-4">
              <div className={cn("p-2.5 rounded-xl shadow-sm", dark ? "bg-pink-500/15" : "bg-pink-500/10")}>
                <Instagram className="w-5 h-5 text-pink-500" />
              </div>
              <div>
                <h1 className={cn("text-[15px] font-black tracking-widest uppercase", text)}>Instagram</h1>
                <p className={cn("text-[11px] font-bold mt-0.5 opacity-60 max-w-2xl", sub)}>
                  {view === "list"
                    ? "Connect your Instagram Business account to automate conversations."
                    : "Integrate your Instagram Business account to unlock 2-Way interactive dynamic conversations"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {view === "manage" && (
                <>
                  <button onClick={handleConnect} className={primaryOutlineBtn}>
                    <Plus size={12} /> Add New
                  </button>
                  <button onClick={() => setView("list")} className={outlineBtn}>
                    <ChevronLeft size={12} /> Back
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ── LIST VIEW ── */}
          {view === "list" && (
            <div className="p-8">
              <div className={cn("p-6 rounded-[1.5rem] border transition-all hover:shadow-md hover:border-pink-500/40 flex flex-col", softBg, softBorder)}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
                      <Instagram size={18} className="text-pink-500" />
                    </div>
                    <h3 className={cn("text-[14px] font-black tracking-tight", text)}>Instagram</h3>
                  </div>
                  <a
                    href="https://business.instagram.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-all", dark ? "hover:bg-slate-800 text-slate-400 hover:text-primary" : "hover:bg-slate-100 text-slate-500 hover:text-primary")}
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>

                <p className={cn("text-[11px] font-medium opacity-70 leading-relaxed mb-5 flex-1", sub)}>
                  The Instagram integration allows you to automate conversations on your Instagram Business account.
                </p>

                <button onClick={() => setView("manage")} className={cn(primaryOutlineBtn, "self-end")}>
                  Manage
                </button>
              </div>
            </div>
          )}

          {/* ── MANAGE VIEW ── */}
          {view === "manage" && (
            <div className="p-8 space-y-5">
              {!hasAccounts ? (
                <div className={cn("rounded-[1.5rem] border py-16 px-8 flex flex-col items-center justify-center text-center space-y-5", softBg, softBorder)}>
                  <div className={cn("w-16 h-16 rounded-full flex items-center justify-center", igGradient)}>
                    <Instagram className="w-8 h-8 text-white" />
                  </div>
                  <div className="space-y-1.5 max-w-sm">
                    <h3 className={cn("text-[14px] font-black tracking-tight", text)}>No integration found</h3>
                    <p className={cn("text-[11px] font-medium opacity-60 leading-relaxed", sub)}>
                      Integrate this communication channel to automate conversations.
                    </p>
                  </div>
                  <button onClick={handleConnect} className={primaryOutlineBtn}>
                    Connect now
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {accounts.map((account: any) => (
                    <div key={account.id} className={cn("rounded-[1.5rem] border overflow-hidden", softBorder, softBg)}>
                      {/* Account Header */}
                      <div className={cn("px-6 py-4 border-b flex items-center justify-between gap-4", softBorder, dark ? "bg-slate-900/40" : "bg-white/60")}>
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative shrink-0">
                            {account.picture?.file_url ? (
                              <img
                                src={account.picture.file_url}
                                alt={account.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", igGradient)}>
                                <Users className="w-5 h-5 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className={cn("text-[13px] font-black truncate", text)}>{account.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge variant="outline" className="h-5 px-2 rounded-md border-pink-500/20 bg-pink-500/5 text-pink-600 dark:text-pink-400 text-[9px] font-black uppercase tracking-widest">
                                @{account.username}
                              </Badge>
                              <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => toast({ title: "Syncing...", description: "Account data refreshed." })}
                            className={outlineBtn}
                          >
                            <RefreshCw size={12} /> Sync
                          </button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className={cn("w-10 h-10 rounded-xl border flex items-center justify-center transition-all", dark ? "border-slate-800 hover:border-primary/40 hover:text-primary" : "border-slate-200 hover:border-primary/40 hover:text-primary")}>
                                <MoreVertical size={14} />
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
                                  checked={account.allow_in_feeder}
                                  onCheckedChange={() => toast({ title: "Updated", description: "AI Feeder setting saved." })}
                                  className="data-[state=checked]:bg-primary"
                                />
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => toast({ title: "Activated", description: "Meta Conversions API enabled." })}
                                className="rounded-lg py-2 cursor-pointer gap-2 font-bold text-[11px]"
                              >
                                <ShieldCheck size={12} className="text-primary" /> Conversions API
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
                          { label: "Posts", value: account.media_count?.toLocaleString() || "0" },
                          { label: "Followers", value: account.followers_count?.toLocaleString() || "0" },
                          { label: "Following", value: account.follows_count?.toLocaleString() || "0" },
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
          )}
        </CardContent>
      </Card>

      {/* ── Delete Dialog ── */}
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
