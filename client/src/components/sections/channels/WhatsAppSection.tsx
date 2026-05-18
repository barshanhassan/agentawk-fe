import { useState } from "react";
import { useLocation } from "wouter";
import {
  ChevronLeft, MoreVertical, Trash2, Copy, Plus,
  Phone, Bot, Activity, AlertCircle, X, Smartphone, Zap, ExternalLink,
  QrCode, Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { RadioGroup } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

export default function WhatsAppSection() {
  const { mode } = useTheme();
  const dark = mode === "dark";
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [view, setView] = useState<"list" | "coex_manage" | "api_manage" | "qr_manage">("list");
  const queryClient = useQueryClient();

  const card       = dark ? "bg-[#0f1829]"    : "bg-white";
  const border     = dark ? "border-slate-800" : "border-slate-200";
  const text       = dark ? "text-white"      : "text-slate-900";
  const sub        = dark ? "text-slate-500"  : "text-slate-400";
  const softBg     = dark ? "bg-slate-950/40" : "bg-slate-50/50";
  const softBorder = dark ? "border-slate-800" : "border-slate-100";

  const inputCls = cn(
    "h-11 rounded-xl text-[13px] font-bold transition-all px-4",
    "focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/50",
    dark ? "bg-slate-950/50 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
  );

  const outlineBtn = cn(
    "h-11 px-6 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
    dark ? "border-slate-800 text-slate-300 hover:border-primary/40 hover:text-primary" : "border-slate-200 text-slate-700 hover:border-primary/40 hover:text-primary"
  );

  const { data: channels, isLoading } = useQuery({
    queryKey: ["/api/integrations/channels"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/integrations/channels");
      return res.json();
    },
  });

  const accounts = channels?.whatsapp || [];
  const hasAccounts = accounts.length > 0;
  const hasApiAccounts = false;

  const deleteMutation = useMutation({
    mutationFn: async (id: number | string) => {
      await apiRequest("DELETE", `/api/integrations/channels/whatsapp/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/integrations/channels"] });
      toast({ title: "Deleted", description: "WhatsApp account removed." });
    },
  });

  const [showAddNumberDialog, setShowAddNumberDialog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [newNumberData, setNewNumberData] = useState({
    phoneNumber: "",
    purposeType: "automated" as "automated" | "notification",
  });
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<any>(null);
  const [showDeleteNumberDialog, setShowDeleteNumberDialog] = useState(false);
  const [numberToDelete, setNumberToDelete] = useState<any>(null);

  const handleConnect = () => {
    toast({ title: "Connecting...", description: "Starting Meta onboarding flow." });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Card className={cn("rounded-[2rem] border overflow-hidden shadow-sm transition-all duration-300", card, border)}>
        <CardContent className="p-0">
          {/* Header — dynamic per view */}
          <div className={cn("px-8 py-5 border-b flex items-center justify-between", border)}>
            <div className="flex items-center gap-4">
              <div className={cn("p-2.5 rounded-xl shadow-sm bg-emerald-500/10")}>
                <img src="/images/automations/whatsapp.svg" alt="WhatsApp" className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className={cn("text-[15px] font-black tracking-widest uppercase", text)}>
                    {view === "list"        && "WhatsApp"}
                    {view === "coex_manage" && "WhatsApp Business Apps"}
                    {view === "api_manage"  && "WhatsApp Business API"}
                    {view === "qr_manage"   && "WhatsApp QR Code"}
                  </h1>
                  {view === "coex_manage" && (
                    <Badge variant="outline" className="h-5 px-2 rounded-md border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                      Beta
                    </Badge>
                  )}
                </div>
                <p className={cn("text-[11px] font-bold mt-0.5 opacity-60 max-w-2xl", sub)}>
                  {view === "list"        && "Connect your WhatsApp accounts to the platform."}
                  {view === "coex_manage" && 'WhatsApp Coexistence "Coex" allows a single WhatsApp number to be used simultaneously with WhatsApp Business Mobile App and Official API.'}
                  {view === "api_manage"  && "Integrate your WhatsApp Business account to unlock 2-Way interactive dynamic conversations"}
                  {view === "qr_manage"   && "Connect your WhatsApp number in seconds by scanning a QR code — no technical setup needed."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {view === "coex_manage" && hasAccounts && (
                <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                  {accounts.length} Connected
                </span>
              )}
              {(view === "api_manage" || view === "qr_manage") && (
                <button onClick={handleConnect} className="h-10 px-5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-white">
                  <Plus size={12} /> Add New
                </button>
              )}
              {view !== "list" && (
                <button onClick={() => setView("list")} className={outlineBtn}>
                  <ChevronLeft size={12} /> Back
                </button>
              )}
            </div>
          </div>

          {/* ── LIST VIEW (Coex/API selector) ── */}
          {view === "list" && (
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {/* Coex Card */}
              <div className={cn("group p-6 rounded-[1.5rem] border transition-all hover:shadow-md hover:border-emerald-500/40 flex flex-col", softBg, softBorder)}>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Smartphone size={20} />
                  </div>
                  <Badge variant="outline" className="h-6 px-2.5 rounded-md border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                    Beta
                  </Badge>
                </div>

                <div className="space-y-2 mb-5 flex-1">
                  <h3 className={cn("text-[14px] font-black tracking-tight", text)}>WhatsApp Business App "Coex"</h3>
                  <p className={cn("text-[11px] font-medium opacity-70 leading-relaxed", sub)}>
                    Link your existing WhatsApp Business App phone number and continue using it on your mobile while managing conversations in real-time in our platform.
                  </p>
                  <div className={cn("pt-3 mt-3 border-t space-y-2", softBorder)}>
                    <p className={cn("text-[11px] font-black", text)}>Before you connect...</p>
                    <ul className="space-y-1.5">
                      <li className={cn("text-[11px] font-medium opacity-70 leading-relaxed flex gap-2", sub)}>
                        <span className="text-emerald-500 mt-0.5">•</span>
                        <span>You should be using WhatsApp Business App already for your business i.e. your number is connected to the WhatsApp Business App.</span>
                      </li>
                      <li className={cn("text-[11px] font-medium opacity-70 leading-relaxed flex gap-2", sub)}>
                        <span className="text-emerald-500 mt-0.5">•</span>
                        <span>You must be using the latest version of WhatsApp mobile application in your phone.</span>
                      </li>
                      <li className={cn("text-[11px] font-medium opacity-70 leading-relaxed flex gap-2", sub)}>
                        <span className="text-emerald-500 mt-0.5">•</span>
                        <span>
                          Currently, Meta is not allowing businesses to onboard via Coex from select countries. Check that your country is NOT listed in <a href="https://developers.facebook.com/docs/whatsapp/cloud-api/get-started/coex#countries-where-the-onboarding-is-not-available" target="_blank" rel="noopener noreferrer" className="text-primary font-black underline-offset-2 hover:underline">this list</a>.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => setView("coex_manage")}
                  className={cn(
                    "self-end h-10 px-6 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                    "border-primary text-primary hover:bg-primary hover:text-white"
                  )}
                >
                  Manage
                </button>
              </div>

              {/* API Card */}
              <div className={cn("group p-6 rounded-[1.5rem] border transition-all hover:shadow-md hover:border-blue-500/40 flex flex-col", softBg, softBorder)}>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Zap size={20} />
                  </div>
                  <a
                    href="https://business.whatsapp.com/products/business-platform"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-all", dark ? "hover:bg-slate-800 text-slate-400 hover:text-primary" : "hover:bg-slate-100 text-slate-500 hover:text-primary")}
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>

                <div className="space-y-2 mb-5 flex-1">
                  <h3 className={cn("text-[14px] font-black tracking-tight", text)}>WhatsApp Business API</h3>
                  <p className={cn("text-[11px] font-medium opacity-70 leading-relaxed", sub)}>
                    The WhatsApp Business API is a platform provided by WhatsApp that enables medium and large businesses to communicate with their customers at scale.
                  </p>
                </div>

                <button
                  onClick={() => setView("api_manage")}
                  className={cn(
                    "self-end h-10 px-6 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                    "border-primary text-primary hover:bg-primary hover:text-white"
                  )}
                >
                  Manage
                </button>
              </div>

              {/* QR Code Card */}
              <div className={cn("group p-6 rounded-[1.5rem] border transition-all hover:shadow-md hover:border-primary/40 flex flex-col", softBg, softBorder)}>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <QrCode size={20} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className="h-6 px-2.5 rounded-md border-primary/20 bg-primary/5 text-primary text-[9px] font-black uppercase tracking-widest">
                      Popular
                    </Badge>
                    <Badge variant="outline" className="h-6 px-2.5 rounded-md border-primary/20 bg-primary/5 text-primary text-[9px] font-black uppercase tracking-widest">
                      Quickest
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 mb-5 flex-1">
                  <h3 className={cn("text-[14px] font-black tracking-tight", text)}>QR Code</h3>
                  <p className={cn("text-[11px] font-medium opacity-70 leading-relaxed", sub)}>
                    Our native QR Code integration makes it easy and intuitive to connect your WhatsApp number in seconds.
                  </p>
                  <div className={cn("pt-3 mt-3 border-t space-y-2", softBorder)}>
                    <ul className="space-y-1.5">
                      {[
                        "Connect in under 60 seconds",
                        "Scan QR code from your phone",
                        "No technical knowledge needed",
                      ].map((feat) => (
                        <li key={feat} className={cn("text-[11px] font-medium opacity-70 leading-relaxed flex gap-2", sub)}>
                          <Check size={13} className="text-primary mt-0.5 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => setView("qr_manage")}
                  className={cn(
                    "self-end h-10 px-6 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                    "border-primary text-primary hover:bg-primary hover:text-white"
                  )}
                >
                  Manage
                </button>
              </div>
            </div>
          )}

          {/* ── COEX MANAGE VIEW ── */}
          {view === "coex_manage" && (
            <div className="p-8 space-y-5">
              {!hasAccounts ? (
                <EmptyIntegrationState dark={dark} text={text} sub={sub} softBg={softBg} softBorder={softBorder} onConnect={handleConnect} />
              ) : (
                <div className="space-y-4">
                  {accounts.map((account: any) => (
                    <div key={account.id} className={cn("rounded-[1.5rem] border overflow-hidden", softBorder, softBg)}>
                      {/* Account Header */}
                      <div className={cn("px-6 py-4 border-b flex items-center justify-between gap-4", softBorder, dark ? "bg-slate-900/40" : "bg-white/60")}>
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                            <img src="/images/automations/whatsapp.svg" alt="WA" className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <p className={cn("text-[13px] font-black truncate", text)}>{account.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge variant="outline" className="h-5 px-2 rounded-md border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                                Coexistence
                              </Badge>
                              <span className={cn("text-[10px] font-bold opacity-50", sub)}>ID #{account.id}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => setLocation("/templates")} className={outlineBtn}>
                            Templates
                          </button>
                          <button
                            onClick={() => { setAccountToDelete(account); setShowDeleteAccountDialog(true); }}
                            className={cn("h-11 px-5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2", "border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white hover:border-rose-500")}
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      </div>

                      {/* Phone Numbers */}
                      <div className="p-5 space-y-3">
                        <h4 className={cn("text-[10px] font-black uppercase tracking-widest ml-1", sub)}>Phone Numbers</h4>
                        {account.phone_numbers.map((number: any) => (
                          <div
                            key={number.id}
                            className={cn("p-4 rounded-[1rem] border flex items-center justify-between gap-4", card, border)}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="relative shrink-0">
                                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                  <Phone size={16} />
                                </div>
                                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2" style={{ borderColor: dark ? "#0f1829" : "white" }} />
                              </div>
                              <div className="min-w-0">
                                <p className={cn("text-[13px] font-black", text)}>{number.display_phone_number}</p>
                                <p className={cn("text-[10px] font-medium opacity-60 truncate", sub)}>{number.verified_name}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 shrink-0">
                              <div className="flex items-center gap-2">
                                <span className={cn("text-[9px] font-black uppercase tracking-widest hidden sm:inline", sub)}>AI Feeder</span>
                                <Switch
                                  checked={number.allow_in_feeder}
                                  onCheckedChange={() => toast({ title: "Updated", description: "AI Feeder setting saved." })}
                                  className="data-[state=checked]:bg-emerald-500"
                                />
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-all", dark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500")}>
                                    <MoreVertical size={14} />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className={cn("rounded-xl p-1.5 min-w-[160px]", dark ? "bg-[#0f1829] border-slate-800" : "")}>
                                  <DropdownMenuItem onClick={() => setLocation("/templates")} className="rounded-lg py-2 cursor-pointer gap-2 font-bold text-[11px]">
                                    <Copy size={12} /> Templates
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => { setNumberToDelete({ number, account }); setShowDeleteNumberDialog(true); }}
                                    className="rounded-lg py-2 cursor-pointer gap-2 font-bold text-[11px] text-rose-500"
                                  >
                                    <Trash2 size={12} /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))}

                        <button
                          onClick={() => { setSelectedAccount(account); setShowAddNumberDialog(true); }}
                          className={cn(
                            "w-full h-11 rounded-xl border-2 border-dashed transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:border-emerald-500/50 hover:bg-emerald-500/5",
                            softBorder
                          )}
                        >
                          <Plus size={12} /> Add Phone Number
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── API MANAGE VIEW ── */}
          {view === "api_manage" && (
            <div className="p-8">
              {!hasApiAccounts ? (
                <EmptyIntegrationState dark={dark} text={text} sub={sub} softBg={softBg} softBorder={softBorder} onConnect={handleConnect} />
              ) : (
                <div className={cn("p-8 text-center rounded-[1.5rem] border", softBorder, softBg)}>
                  <p className={cn("text-[11px] font-bold opacity-50 italic", sub)}>API accounts loading...</p>
                </div>
              )}
            </div>
          )}

          {/* ── QR MANAGE VIEW ── */}
          {view === "qr_manage" && (
            <div className="p-8">
              <div className={cn("rounded-[1.5rem] border py-16 px-8 flex flex-col items-center justify-center text-center space-y-5", softBg, softBorder)}>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <QrCode size={32} />
                </div>
                <div className="space-y-1.5 max-w-sm">
                  <h3 className={cn("text-[14px] font-black tracking-tight", text)}>Scan to connect</h3>
                  <p className={cn("text-[11px] font-medium opacity-60 leading-relaxed", sub)}>
                    Start a QR connection, then scan the code from WhatsApp on your phone to link your number in seconds.
                  </p>
                </div>
                <button
                  onClick={handleConnect}
                  className={cn(
                    "h-10 px-6 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                    "border-primary text-primary hover:bg-primary hover:text-white"
                  )}
                >
                  <QrCode size={12} /> Generate QR Code
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Add Number Dialog ── */}
      <Dialog open={showAddNumberDialog} onOpenChange={setShowAddNumberDialog}>
        <DialogContent className={cn("rounded-[2rem] border p-0 max-w-lg overflow-hidden", card, border)}>
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Plus size={16} />
              </div>
              <div>
                <h2 className={cn("text-[13px] font-black uppercase tracking-widest", text)}>Add Phone Number</h2>
                <p className={cn("text-[11px] font-medium opacity-60 mt-0.5", sub)}>
                  Account: {selectedAccount?.name}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className={cn("text-[10px] font-black uppercase tracking-widest pl-1 block", sub)}>
                  Phone Number (International Format)
                </label>
                <Input
                  placeholder="e.g. +1 555 000 0000"
                  value={newNumberData.phoneNumber}
                  onChange={(e) => setNewNumberData({ ...newNumberData, phoneNumber: e.target.value })}
                  className={inputCls}
                />
              </div>

              <div className="space-y-2">
                <label className={cn("text-[10px] font-black uppercase tracking-widest pl-1 block", sub)}>
                  Purpose
                </label>
                <RadioGroup
                  value={newNumberData.purposeType}
                  onValueChange={(v: any) => setNewNumberData({ ...newNumberData, purposeType: v })}
                  className="grid grid-cols-2 gap-3"
                >
                  {([
                    { v: "automated",    label: "Automated",    desc: "AI & flow processing", icon: <Bot size={16} /> },
                    { v: "notification", label: "Notification", desc: "System alerts only",   icon: <Activity size={16} /> },
                  ] as const).map((opt) => {
                    const active = newNumberData.purposeType === opt.v;
                    return (
                      <button
                        key={opt.v}
                        onClick={() => setNewNumberData({ ...newNumberData, purposeType: opt.v })}
                        className={cn(
                          "p-4 rounded-[1rem] border text-left transition-all",
                          active
                            ? "border-emerald-500 bg-emerald-500/5 shadow-md shadow-emerald-500/10"
                            : cn(softBorder, softBg, "hover:border-emerald-500/30")
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center mb-2 transition-all",
                          active ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" : "bg-emerald-500/10 text-emerald-500"
                        )}>
                          {opt.icon}
                        </div>
                        <p className={cn("text-[12px] font-black tracking-tight", text)}>{opt.label}</p>
                        <p className={cn("text-[10px] font-medium opacity-60 mt-0.5", sub)}>{opt.desc}</p>
                      </button>
                    );
                  })}
                </RadioGroup>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowAddNumberDialog(false)} className={outlineBtn}>
                Cancel
              </button>
              <button
                onClick={() => toast({ title: "Verifying...", description: "Phone number verification started." })}
                className="h-11 px-7 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
              >
                <Plus size={12} /> Add Number
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete Account Dialog ── */}
      <AlertDialog open={showDeleteAccountDialog} onOpenChange={setShowDeleteAccountDialog}>
        <AlertDialogContent className={cn("rounded-[2rem] border p-0 max-w-md overflow-hidden", card, border)}>
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                <AlertCircle size={18} />
              </div>
              <div>
                <h2 className={cn("text-[13px] font-black uppercase tracking-widest", text)}>Delete WhatsApp Account?</h2>
                <p className={cn("text-[11px] font-medium opacity-60 mt-0.5 leading-relaxed", sub)}>
                  Target: <span className="text-rose-500 font-black">{accountToDelete?.name}</span>. All phone numbers and associated data will be permanently removed.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <AlertDialogCancel className={cn(outlineBtn, "m-0")}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteMutation.mutate(accountToDelete.id)}
                className="h-11 px-7 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-rose-500/20 flex items-center gap-2"
              >
                <Trash2 size={12} /> Delete
              </AlertDialogAction>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Delete Number Dialog ── */}
      <AlertDialog open={showDeleteNumberDialog} onOpenChange={setShowDeleteNumberDialog}>
        <AlertDialogContent className={cn("rounded-[2rem] border p-0 max-w-md overflow-hidden", card, border)}>
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                <X size={18} />
              </div>
              <div>
                <h2 className={cn("text-[13px] font-black uppercase tracking-widest", text)}>Delete Phone Number?</h2>
                <p className={cn("text-[11px] font-medium opacity-60 mt-0.5 leading-relaxed", sub)}>
                  Number: <span className="text-rose-500 font-black">{numberToDelete?.number?.display_phone_number}</span>. This number will be permanently disconnected.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <AlertDialogCancel className={cn(outlineBtn, "m-0")}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => toast({ title: "Deleted", description: "Phone number removed." })}
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

/* ── Empty Integration State (shared) ── */
function EmptyIntegrationState({
  dark,
  text,
  sub,
  softBg,
  softBorder,
  onConnect,
}: {
  dark: boolean;
  text: string;
  sub: string;
  softBg: string;
  softBorder: string;
  onConnect: () => void;
}) {
  return (
    <div className={cn("rounded-[1.5rem] border py-16 px-8 flex flex-col items-center justify-center text-center space-y-5", softBg, softBorder)}>
      <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
        <img src="/images/automations/whatsapp.svg" alt="WhatsApp" className="w-8 h-8" />
      </div>
      <div className="space-y-1.5 max-w-sm">
        <h3 className={cn("text-[14px] font-black tracking-tight", text)}>No integration found</h3>
        <p className={cn("text-[11px] font-medium opacity-60 leading-relaxed", sub)}>
          Connect your WhatsApp Business account now to get started.
        </p>
      </div>
      <button
        onClick={onConnect}
        className={cn(
          "h-10 px-6 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
          "border-primary text-primary hover:bg-primary hover:text-white"
        )}
      >
        Connect now
      </button>
    </div>
  );
}
