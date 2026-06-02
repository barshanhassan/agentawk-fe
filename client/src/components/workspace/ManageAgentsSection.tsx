import { useState } from "react";
import {
  Users, User, UserPlus, Settings, Phone, ShieldCheck,
  Info, MessageSquare, Users2, Smartphone,
  CheckCircle2, Zap, Plus, Search, ChevronLeft, Activity,
  Shield, LayoutGrid, Globe, Fingerprint, Lock,
  ShieldAlert, Check, Pencil, Mail, Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { phoneError } from "@/lib/phone";
import { PhoneInputWithFlag } from "@/components/PhoneInputWithFlag";

interface Agent {
  id: string;
  name: string;
  email: string;
  status: string;
  role: string;
  original: any;
}

const AVATAR_COLORS = [
  { bg: "bg-violet-500/15",  text: "text-violet-600 dark:text-violet-400" },
  { bg: "bg-blue-500/15",    text: "text-blue-600 dark:text-blue-400" },
  { bg: "bg-emerald-500/15", text: "text-emerald-600 dark:text-emerald-400" },
  { bg: "bg-amber-500/15",   text: "text-amber-600 dark:text-amber-400" },
  { bg: "bg-rose-500/15",    text: "text-rose-600 dark:text-rose-400" },
  { bg: "bg-cyan-500/15",    text: "text-cyan-600 dark:text-cyan-400" },
];

function nameHash(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h << 5) - h + name.charCodeAt(i);
  return Math.abs(h) % AVATAR_COLORS.length;
}

function MemberAvatar({ name, size = "sm" }: { name: string; size?: "sm" | "md" }) {
  const idx = nameHash(name);
  const { bg, text } = AVATAR_COLORS[idx];
  const dim = size === "sm" ? "w-8 h-8 text-[11px]" : "w-10 h-10 text-[13px]";
  return (
    <div className={cn("rounded-xl flex items-center justify-center font-black flex-shrink-0", dim, bg, text)}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export default function ManageAgentSection() {
  const { mode } = useTheme();
  const dark = mode === "dark";
  const { toast } = useToast();

  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [activeTab, setActiveTab] = useState("agent");
  const [mobileAccess, setMobileAccess] = useState(false);
  const [limitIp, setLimitIp] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // Login policy: per-weekday hours + ip (replyagent user_login_policies)
  const [loginPolicy, setLoginPolicy] = useState<Record<string, string>>({});
  const setPolicyField = (k: string, v: string) => setLoginPolicy((p) => ({ ...p, [k]: v }));

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

  const primaryBtn =
    "h-11 px-7 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20 flex items-center gap-2";

  const outlineBtn = cn(
    "h-11 px-6 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
    dark ? "border-slate-800 text-slate-300 hover:border-primary/40 hover:text-primary" : "border-slate-200 text-slate-700 hover:border-primary/40 hover:text-primary"
  );

  const { data: membersData, isLoading } = useQuery<any>({
    queryKey: ["/api/workspaces/members"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/workspaces/members");
      return res.json();
    },
  });

  const { data: tagsApiData } = useQuery<any>({
    queryKey: ["/api/tags/list"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/tags/list");
      return res.json();
    },
  });

  // Real workspace roles (replyagent: role dropdown lists the workspace's acl_roles)
  const { data: rolesApiData } = useQuery<any>({
    queryKey: ["/api/workspaces/all-roles"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/workspaces/all-roles");
      return res.json();
    },
  });
  const roles: { id: string; name: string }[] = (rolesApiData?.roles || rolesApiData || [])
    .map((r: any) => ({ id: String(r.id), name: r.name || "Role" }));

  // Real data for the agent access-scope tabs (replyagent user_accesses)
  const { data: systemFieldsApi } = useQuery<any>({
    queryKey: ["/api/system-fields"],
    queryFn: async () => (await apiRequest("GET", "/api/system-fields")).json(),
  });
  const { data: customFieldsApi } = useQuery<any>({
    queryKey: ["/api/custom-fields"],
    queryFn: async () => (await apiRequest("GET", "/api/custom-fields")).json(),
  });

  const agents: Agent[] = (membersData?.members || membersData || []).map((m: any) => ({
    id: m.id.toString(),
    name: m.full_name || `${m.first_name || ""} ${m.last_name || ""}`.trim(),
    email: m.email,
    status: m.status || "Active",
    role: m.role || "Agent",
    original: m,
  }));

  const filteredAgents = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/workspaces/members", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces/members"] });
      toast({ title: "Saved", description: "Agent created successfully." });
      resetForm();
      setView("list");
    },
    onError: (err: any) => {
      // Friendlier title for the agents_limit cap (backend throws "Reached the limit").
      const msg: string = err?.message ?? "";
      const isLimit = /reached the limit/i.test(msg);
      toast({
        title: isLimit ? "Agent limit reached" : "Error",
        description: isLimit
          ? "This workspace has hit its maximum number of agents. Increase the limit in the agency edit screen or remove an existing agent first."
          : msg,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string | number; data: any }) => {
      const res = await apiRequest("PATCH", `/api/workspaces/members/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces/members"] });
      toast({ title: "Saved", description: "Agent updated successfully." });
      resetForm();
      setView("list");
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string | number) => {
      const res = await apiRequest("DELETE", `/api/workspaces/members/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces/members"] });
      toast({ title: "Deleted", description: "Agent removed." });
    },
  });

  const [selectedSystemFields, setSelectedSystemFields] = useState<string[]>([]);
  const [selectedCustomFields, setSelectedCustomFields] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedChatAgents, setSelectedChatAgents] = useState<string[]>([]);
  const [selectedChatChannels, setSelectedChatChannels] = useState<string[]>([]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [language, setLanguage] = useState("pt-br");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  // Default country = US (replyagent parity — country_id 204 = United States).
  const [phoneCountry, setPhoneCountry] = useState("US");
  const [whatsappCountry, setWhatsappCountry] = useState("US");
  const [phoneNotifications, setPhoneNotifications] = useState(false);
  const [whatsappNotifications, setWhatsappNotifications] = useState(false);
  const [twoFA, setTwoFA] = useState(false);

  // Real {id,label} lists for the scope tabs (ids saved into user_accesses)
  const systemFieldsList = (systemFieldsApi?.fields || []).map((f: any) => ({ id: String(f.id), label: f.name || f.slug || "Field" }));
  const customFieldsList = (customFieldsApi?.fields || []).map((f: any) => ({ id: String(f.id), label: f.name || f.system_name || "Field" }));
  const tagsList = (tagsApiData?.tags || []).map((t: any) => ({ id: String(t.id), label: t.name || "Tag" }));
  const agentsList = agents.map((a) => ({ id: a.id, label: a.name || a.email }));

  const CHAT_CHANNELS = [
    { name: "Reply Agen Stage One", type: "telegram" },
    { name: "lag one", type: "telegram" },
    { name: "Test Stage", type: "telegram" },
    { name: "Bytedigital Bot", type: "telegram" },
    { name: "Byte Digital & Marketing - +1 407-621-1216", type: "whatsapp" },
    { name: "ReplyAgent.com Brasil - +55 11 91672-5044", type: "whatsapp" },
    { name: "EZAUQ - +923099077900", type: "whatsapp" },
    { name: "Byte Digital Internet & Marketing", type: "messenger" },
    { name: "Rogerio Cardoso", type: "instagram" },
    { name: "Twilio - +13203357944", type: "twilio" },
  ];

  const toggleAll = (
    checked: boolean,
    list: string[],
    setter: (v: string[]) => void
  ) => setter(checked ? list : []);

  const toggleItem = (item: string, list: string[], setter: (v: string[]) => void) =>
    setter(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setRole("");
    setLanguage("pt-br");
    setPhoneNumber("");
    setWhatsappNumber("");
    setPhoneCountry("US");
    setWhatsappCountry("US");
    setPhoneNotifications(false);
    setWhatsappNotifications(false);
    setMobileAccess(false);
    setLimitIp(false);
    setLoginPolicy({});
    setTwoFA(false);
    setSelectedSystemFields([]);
    setSelectedCustomFields([]);
    setSelectedTags([]);
    setSelectedChatAgents([]);
    setSelectedChatChannels([]);
    setEditingId(null);
    setActiveTab("agent");
  };

  const handleEdit = (agent: Agent) => {
    setEditingId(agent.id);
    const o = agent.original || {};
    const names = agent.name.split(" ");
    setFirstName(o.first_name || names[0] || "");
    setLastName(o.last_name || names.slice(1).join(" ") || "");
    setEmail(agent.email);
    // real role id from the member (no more fragile name-matching)
    setRole(o.role_id ? String(o.role_id) : "");
    setLanguage(o.locale || "pt-br");
    setTwoFA(!!o.tfa_required);
    setMobileAccess(o.mobile_access == 1 || o.mobile_access === true);
    setPhoneNumber(o.phone || "");
    setPhoneCountry(o.phone_country || "US");
    setWhatsappNumber(o.whatsapp || "");
    setWhatsappCountry(o.whatsapp_country || "US");
    setPhoneNotifications(!!o.receive_sms_notification);
    setWhatsappNotifications(!!o.receive_whatsapp_notification);
    // Login policy prefill (normalize "HH:MM:SS" → "HH:MM" for the time selects)
    const lp = o.login_policy || {};
    const normalized: Record<string, string> = { ip: lp.ip || "" };
    ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].forEach((d) => {
      normalized[`${d}_login`] = (lp[`${d}_login`] || "").slice(0, 5);
      normalized[`${d}_logout`] = (lp[`${d}_logout`] || "").slice(0, 5);
    });
    setLoginPolicy(normalized);
    setLimitIp(!!lp.limit_by_ip);
    // Access scopes prefill (ids as strings)
    setSelectedSystemFields(Array.isArray(o.systemFields) ? o.systemFields.map(String) : []);
    setSelectedCustomFields(Array.isArray(o.customFields) ? o.customFields.map(String) : []);
    setSelectedTags(Array.isArray(o.tags) ? o.tags.map(String) : []);
    setSelectedChatAgents(Array.isArray(o.agents) ? o.agents.map(String) : []);
    setView("edit");
  };

  const handleSave = () => {
    if (!firstName.trim() || !email.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in First Name and Email.",
        variant: "destructive",
      });
      return;
    }
    // Block save if a phone/whatsapp number is too short/long (replyagent parity)
    const pErr = phoneError(phoneNumber, phoneCountry);
    const wErr = phoneError(whatsappNumber, whatsappCountry);
    if (pErr || wErr) {
      toast({ title: "Validation Error", description: pErr || wErr, variant: "destructive" });
      return;
    }
    const payload: any = {
      first_name: firstName,
      last_name: lastName,
      email,
      role_id: role || undefined, // real workspace role id (omitted if none picked)
      locale: language,
      tfa_required: twoFA,
      mobile_access: mobileAccess,
      phone: phoneNumber,
      phone_country: phoneCountry,
      whatsapp: whatsappNumber,
      whatsapp_country: whatsappCountry,
      receive_sms_notification: phoneNotifications,
      receive_whatsapp_notification: whatsappNotifications,
      loginPolicy: { ...loginPolicy, limit_by_ip: limitIp },
      // access scopes (channels deferred to the Channels module)
      systemFields: selectedSystemFields,
      customFields: selectedCustomFields,
      tags: selectedTags,
      agents: selectedChatAgents,
    };
    if (view === "edit" && editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const TIME_OPTIONS = Array.from({ length: 96 }, (_, i) => {
    const h = Math.floor(i / 4).toString().padStart(2, "0");
    const m = ((i % 4) * 15).toString().padStart(2, "0");
    return `${h}:${m}`;
  });

  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  /* ── ADD / EDIT VIEW ─────────────────────────────────────────── */
  if (view === "add" || view === "edit") {
    return (
      <Card className={cn("rounded-[2rem] border overflow-hidden shadow-sm transition-all duration-300", card, border)}>
        <CardContent className="p-0">
          {/* Header */}
          <div className={cn("px-8 py-5 border-b flex items-center justify-between", border)}>
            <div className="flex items-center gap-4">
              <button
                onClick={() => { resetForm(); setView("list"); }}
                className={cn("w-10 h-10 rounded-xl border flex items-center justify-center transition-all", dark ? "border-slate-800 hover:border-primary/40 hover:text-primary" : "border-slate-200 hover:border-primary/40 hover:text-primary")}
              >
                <ChevronLeft size={16} />
              </button>
              <div className={cn("p-2.5 rounded-xl shadow-sm", dark ? "bg-primary/15" : "bg-primary/10")}>
                <UserPlus className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className={cn("text-[15px] font-black tracking-widest uppercase", text)}>
                  {view === "add" ? "Add Agent" : "Edit Agent"}
                </h1>
                <p className={cn("text-[11px] font-bold mt-0.5 opacity-60", sub)}>
                  Add or edit agent details
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setView("list"); resetForm(); }} className={outlineBtn}>
                Discard
              </button>
              <button
                onClick={handleSave}
                disabled={createMutation.isPending || updateMutation.isPending}
                className={primaryBtn}
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <Activity className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5" />
                )}
                Save
              </button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex">
              {/* Sidebar */}
              <div className={cn("w-60 shrink-0 border-r p-4 space-y-1", border, softBg)}>
                <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 gap-1">
                  {[
                    { value: "agent", label: "Identity", icon: User },
                    { value: "2fa", label: "Security", icon: ShieldCheck },
                    { value: "mobile", label: "Mobility", icon: Smartphone },
                    { value: "login", label: "Policies", icon: Lock },
                    { value: "system", label: "System Fields", icon: LayoutGrid },
                    { value: "custom", label: "Custom Fields", icon: Settings },
                    { value: "tags", label: "Tags", icon: MessageSquare },
                    { value: "chat-agents", label: "Squad", icon: Users2 },
                    { value: "chat-channels", label: "Channels", icon: Globe },
                  ].map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all text-left justify-start bg-transparent",
                        "data-[state=active]:!bg-primary data-[state=active]:!text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20",
                        "data-[state=inactive]:hover:bg-primary/5 data-[state=inactive]:hover:text-primary",
                        dark ? "text-slate-400" : "text-slate-500"
                      )}
                    >
                      <tab.icon size={14} />
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <div className="flex-1 p-8 min-w-0">
                {/* Identity */}
                <TabsContent value="agent" className="m-0 outline-none space-y-8">
                  <SectionHeading dark={dark} title="Identity" description="Basic information about this agent." />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
                    <Field dark={dark} label="First Name" required>
                      <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputCls} placeholder="e.g. Jonathan" />
                    </Field>
                    <Field dark={dark} label="Last Name">
                      <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputCls} placeholder="e.g. Wick" />
                    </Field>
                    <Field dark={dark} label="Email Address" required>
                      <Input value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="wick@hightable.com" />
                    </Field>
                    <Field dark={dark} label="Role">
                      <Select value={role} onValueChange={setRole}>
                        <SelectTrigger className={inputCls}>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent className={cn("rounded-xl border shadow-2xl", dark ? "bg-[#0f1829] border-slate-800 text-white" : "bg-white border-slate-200")}>
                          {roles.length === 0 ? (
                            <div className="px-3 py-2 text-[11px] font-medium opacity-60">No roles yet</div>
                          ) : (
                            roles.map((r) => (
                              <SelectItem key={r.id} value={r.id} className="text-[12px] font-bold">{r.name}</SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field dark={dark} label="Interface Language">
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className={inputCls}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className={cn("rounded-xl border shadow-2xl", dark ? "bg-[#0f1829] border-slate-800 text-white" : "bg-white border-slate-200")}>
                          <SelectItem value="pt-br" className="text-[12px] font-bold">Portuguese (Brazil)</SelectItem>
                          <SelectItem value="en-us" className="text-[12px] font-bold">English (US)</SelectItem>
                          <SelectItem value="es" className="text-[12px] font-bold">Spanish</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>

                  <div className="pt-6 border-t space-y-4 max-w-3xl" style={{ borderColor: dark ? "rgb(30 41 59)" : "rgb(241 245 249)" }}>
                    <h4 className={cn("text-[11px] font-black uppercase tracking-widest", text)}>Contact</h4>

                    {[
                      { label: "Phone Number", icon: Phone, value: phoneNumber, setter: setPhoneNumber, country: phoneCountry, countrySetter: setPhoneCountry, notify: phoneNotifications, notifySetter: setPhoneNotifications },
                      { label: "WhatsApp Number", icon: MessageSquare, value: whatsappNumber, setter: setWhatsappNumber, country: whatsappCountry, countrySetter: setWhatsappCountry, notify: whatsappNotifications, notifySetter: setWhatsappNotifications },
                    ].map((row) => (
                      <div key={row.label} className={cn("p-5 rounded-[1.25rem] border flex items-center gap-4", softBg, softBorder)}>
                        <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                          <row.icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <FieldLabel dark={dark}>{row.label}</FieldLabel>
                          <PhoneInputWithFlag
                            country={row.country}
                            onCountryChange={row.countrySetter}
                            value={row.value}
                            onChange={row.setter}
                            inputClassName={inputCls}
                            isDark={dark}
                          />
                          {phoneError(row.value, row.country) && (
                            <p className="text-[11px] text-rose-500 mt-1">{phoneError(row.value, row.country)}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-3 pl-4 border-l" style={{ borderColor: dark ? "rgb(30 41 59)" : "rgb(226 232 240)" }}>
                          <div className="text-right">
                            <p className={cn("text-[11px] font-black uppercase tracking-widest", text)}>Notify</p>
                            <p className={cn("text-[9px] font-bold opacity-50", sub)}>Push & SMS</p>
                          </div>
                          <Switch checked={row.notify} onCheckedChange={row.notifySetter} className="data-[state=checked]:bg-primary" />
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Security */}
                <TabsContent value="2fa" className="m-0 outline-none space-y-6 max-w-3xl">
                  <SectionHeading dark={dark} title="2-Factor Authentication" description="Strengthen this agent's account security." />

                  <div className={cn("p-6 rounded-[1.5rem] border flex items-start gap-4", softBg, softBorder)}>
                    <Switch checked={twoFA} onCheckedChange={setTwoFA} className="data-[state=checked]:bg-primary mt-0.5" />
                    <div className="space-y-3 flex-1">
                      <div>
                        <p className={cn("text-[13px] font-black tracking-tight", text)}>Mandatory 2FA Enrollment</p>
                        <p className={cn("text-[11px] font-medium opacity-60 mt-1 leading-relaxed", sub)}>
                          When enabled, the agent will be blocked from dashboard access until a 2FA method (Google Authenticator, Authy, or Duo) is linked to their profile.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <Info size={12} className="text-blue-500 shrink-0" />
                        <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                          Recommended: <span className="underline cursor-pointer">Authy</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Mobility */}
                <TabsContent value="mobile" className="m-0 outline-none space-y-6 max-w-3xl">
                  <SectionHeading dark={dark} title="Mobility" description="Control access from the native mobile application." />

                  <div className="space-y-4">
                    {[
                      { title: "Real-time Mobility", desc: "Interact with customers on-the-go across WhatsApp, Messenger, and SMS.", icon: Zap },
                      { title: "Push Notifications", desc: "High-priority device alerts for unassigned messages.", icon: Activity },
                    ].map((f) => (
                      <div key={f.title} className="flex items-start gap-3">
                        <div className="p-1.5 rounded-lg bg-primary/10 text-primary mt-0.5 shrink-0">
                          <f.icon size={14} />
                        </div>
                        <div>
                          <p className={cn("text-[12px] font-black uppercase tracking-widest", text)}>{f.title}</p>
                          <p className={cn("text-[11px] font-medium opacity-60 mt-1 leading-relaxed", sub)}>{f.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={cn("p-6 rounded-[1.5rem] border flex items-center justify-between", softBg, softBorder)}>
                    <div className="flex items-center gap-4">
                      <div className={cn("p-2.5 rounded-xl", mobileAccess ? "bg-emerald-500/15 text-emerald-500" : "bg-slate-500/10 text-slate-400")}>
                        <Smartphone size={16} />
                      </div>
                      <div>
                        <p className={cn("text-[13px] font-black tracking-tight", text)}>Mobile App Access</p>
                        <p className={cn("text-[11px] font-medium opacity-60 mt-0.5", sub)}>Toggle access from the mobile client</p>
                      </div>
                    </div>
                    <Switch checked={mobileAccess} onCheckedChange={setMobileAccess} className="data-[state=checked]:bg-emerald-500" />
                  </div>

                  <div className={cn(
                    "flex items-center gap-3 p-4 rounded-[1.25rem] border",
                    mobileAccess ? "bg-emerald-500/5 border-emerald-500/20" : "bg-rose-500/5 border-rose-500/20"
                  )}>
                    {mobileAccess ? <CheckCircle2 size={16} className="text-emerald-500" /> : <ShieldAlert size={16} className="text-rose-500" />}
                    <div>
                      <p className={cn("text-[12px] font-black uppercase tracking-widest", mobileAccess ? "text-emerald-600" : "text-rose-600")}>
                        {mobileAccess ? "Access Authorized" : "Access Restricted"}
                      </p>
                      <p className={cn("text-[10px] font-bold opacity-70 mt-0.5", mobileAccess ? "text-emerald-500" : "text-rose-500")}>
                        {mobileAccess ? "Agent can authenticate via mobile app." : "Agent cannot log in from mobile."}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Policies */}
                <TabsContent value="login" className="m-0 outline-none space-y-6">
                  <div className="flex items-center justify-between">
                    <SectionHeading dark={dark} title="Login Policies" description="Specify allowed login hours for this agent." />
                    <div className={cn("px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest", dark ? "bg-slate-950/50 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-600")}>
                      <Globe className="inline w-3 h-3 mr-1" /> America/Fortaleza
                    </div>
                  </div>

                  <div className={cn("rounded-[1.5rem] border overflow-hidden", softBg, softBorder)}>
                    <Table>
                      <TableHeader>
                        <TableRow className={cn("border-b hover:bg-transparent", softBorder)}>
                          <TableHead className={cn("py-4 px-6 text-[10px] font-black uppercase tracking-widest", sub)}>Day</TableHead>
                          <TableHead className={cn("py-4 px-6 text-[10px] font-black uppercase tracking-widest", sub)}>From</TableHead>
                          <TableHead className={cn("py-4 px-6 text-[10px] font-black uppercase tracking-widest", sub)}>Until</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {DAYS.map((day) => {
                          const k = day.toLowerCase();
                          return (
                          <TableRow key={day} className={cn("border-b last:border-0 hover:bg-transparent", softBorder)}>
                            <TableCell className={cn("py-3 px-6 text-[12px] font-black", text)}>{day}</TableCell>
                            <TableCell className="py-3 px-6">
                              <Select value={loginPolicy[`${k}_login`] || ""} onValueChange={(v) => setPolicyField(`${k}_login`, v)}>
                                <SelectTrigger className={cn(inputCls, "h-9")}>
                                  <SelectValue placeholder="00:00" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px] rounded-xl">
                                  {TIME_OPTIONS.map((t) => <SelectItem key={t} value={t} className="text-[12px] font-bold">{t}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="py-3 px-6">
                              <Select value={loginPolicy[`${k}_logout`] || ""} onValueChange={(v) => setPolicyField(`${k}_logout`, v)}>
                                <SelectTrigger className={cn(inputCls, "h-9")}>
                                  <SelectValue placeholder="23:59" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px] rounded-xl">
                                  {TIME_OPTIONS.map((t) => <SelectItem key={t} value={t} className="text-[12px] font-bold">{t}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  <div className={cn("p-5 rounded-[1.25rem] border flex items-center justify-between gap-4", softBg, softBorder)}>
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={cn("p-2 rounded-xl shrink-0", limitIp ? "bg-primary/10 text-primary" : "bg-slate-500/10 text-slate-400")}>
                        <Globe size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-[12px] font-black uppercase tracking-widest", text)}>IP Restriction</p>
                        {limitIp && <Input value={loginPolicy.ip || ""} onChange={(e) => setPolicyField("ip", e.target.value)} placeholder="Enter static IP address..." className={cn(inputCls, "h-9 mt-2 max-w-xs")} />}
                      </div>
                    </div>
                    <Switch checked={limitIp} onCheckedChange={setLimitIp} className="data-[state=checked]:bg-primary" />
                  </div>
                </TabsContent>

                {/* List selection tabs */}
                {[
                  { key: "system",        title: "System Fields",  desc: "Standard fields the agent can manage.",         list: systemFieldsList, selected: selectedSystemFields,  setter: setSelectedSystemFields },
                  { key: "custom",        title: "Custom Fields",  desc: "Workspace-defined fields the agent can access.", list: customFieldsList, selected: selectedCustomFields,  setter: setSelectedCustomFields },
                  { key: "tags",          title: "Tags",           desc: "Tags the agent can apply to contacts.",          list: tagsList,         selected: selectedTags,         setter: setSelectedTags },
                  { key: "chat-agents",   title: "Squad",          desc: "Other agents this person can view in chat.",    list: agentsList,       selected: selectedChatAgents,    setter: setSelectedChatAgents },
                  { key: "chat-channels", title: "Channels",       desc: "Conversation gateways the agent can access.",    list: CHAT_CHANNELS.map((c) => ({ id: c.name, label: c.name, type: c.type })), selected: selectedChatChannels, setter: setSelectedChatChannels },
                ].map((cfg) => (
                  <TabsContent key={cfg.key} value={cfg.key} className="m-0 outline-none space-y-5">
                    <div className="flex items-start justify-between gap-4">
                      <SectionHeading dark={dark} title={cfg.title} description={cfg.desc} />
                      <div className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest shrink-0">
                        {cfg.selected.length} / {cfg.list.length}
                      </div>
                    </div>

                    <div className={cn("rounded-[1.5rem] border overflow-hidden", softBg, softBorder)}>
                      <div className={cn("flex items-center gap-3 px-5 py-3 border-b", softBorder, dark ? "bg-slate-900/30" : "bg-white/60")}>
                        <Checkbox
                          checked={cfg.selected.length === cfg.list.length && cfg.list.length > 0}
                          onCheckedChange={(c) => toggleAll(c as boolean, cfg.list.map((i: any) => i.id), cfg.setter)}
                        />
                        <span className={cn("text-[10px] font-black uppercase tracking-widest", sub)}>Select All</span>
                      </div>
                      <div>
                        {cfg.list.length === 0 && (
                          <div className="px-5 py-4 text-[11px] font-medium opacity-60">No items</div>
                        )}
                        {cfg.list.map((item: any) => {
                          const checked = cfg.selected.includes(item.id);
                          return (
                            <div
                              key={item.id}
                              onClick={() => toggleItem(item.id, cfg.selected, cfg.setter)}
                              className={cn(
                                "flex items-center justify-between px-5 py-3 transition-colors cursor-pointer border-b last:border-0",
                                softBorder,
                                checked ? "bg-primary/5" : dark ? "hover:bg-slate-900/40" : "hover:bg-white/60"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <Checkbox checked={checked} className="pointer-events-none" />
                                {cfg.key === "chat-agents" && <MemberAvatar name={item.label} />}
                                {cfg.key === "chat-channels" && item.type && (
                                  <div className={cn(
                                    "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                                    item.type === "telegram" ? "bg-blue-500" :
                                    item.type === "whatsapp" ? "bg-emerald-500" :
                                    item.type === "messenger" ? "bg-blue-600" :
                                    item.type === "instagram" ? "bg-pink-500" :
                                    "bg-primary"
                                  )}>
                                    <Globe size={12} className="text-white" />
                                  </div>
                                )}
                                <span className={cn("text-[12px] font-bold", text)}>{item.label}</span>
                              </div>
                              {checked && <Check size={14} className="text-primary" />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </div>
            </Tabs>
        </CardContent>
      </Card>
    );
  }

  /* ── LIST VIEW ─────────────────────────────────────────────── */
  return (
    <Card className={cn("rounded-[2rem] border overflow-hidden shadow-sm transition-all duration-300", card, border)}>
      <CardContent className="p-0">
        {/* Header */}
        <div className={cn("px-8 py-5 border-b flex items-center justify-between", border)}>
          <div className="flex items-center gap-4">
            <div className={cn("p-2.5 rounded-xl shadow-sm", dark ? "bg-primary/15" : "bg-primary/10")}>
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className={cn("text-[15px] font-black tracking-widest uppercase", text)}>Manage Agents</h1>
              <p className={cn("text-[11px] font-bold mt-0.5 opacity-60", sub)}>
                Add or edit agent details
              </p>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
            <Shield size={11} /> {agents.length} Agents
          </span>
        </div>

          <div className={cn("px-6 py-4 border-b flex items-center gap-3", softBorder)}>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <Input
                placeholder="Search agents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(inputCls, "pl-9 h-10")}
              />
            </div>
            <button onClick={() => { resetForm(); setView("add"); }} className={primaryBtn}>
              <Plus size={12} /> Add Agent
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-primary"></div>
            </div>
          ) : filteredAgents.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-14 h-14 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <p className={cn("text-[12px] font-medium opacity-60", sub)}>No agents found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className={cn("border-b hover:bg-transparent", softBorder)}>
                  <TableHead className={cn("py-4 px-6 text-[10px] font-black uppercase tracking-widest text-left", sub)}>Agent</TableHead>
                  <TableHead className={cn("py-4 px-6 text-[10px] font-black uppercase tracking-widest", sub)}>Status</TableHead>
                  <TableHead className={cn("py-4 px-6 text-[10px] font-black uppercase tracking-widest", sub)}>Role</TableHead>
                  <TableHead className={cn("py-4 px-6 text-[10px] font-black uppercase tracking-widest text-right", sub)}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgents.map((agent) => (
                  <TableRow key={agent.id} className={cn("border-b last:border-0 transition-colors", softBorder, dark ? "hover:bg-slate-900/30" : "hover:bg-slate-50/60")}>
                    <TableCell className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <MemberAvatar name={agent.name} size="md" />
                        <div className="flex flex-col min-w-0">
                          <span className={cn("text-[12px] font-black truncate", text)}>{agent.name || agent.email}</span>
                          <span className={cn("text-[11px] font-medium opacity-60 truncate flex items-center gap-1", sub)}>
                            <Mail size={10} /> {agent.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-6">
                      <Badge variant="outline" className="h-6 px-2.5 border-emerald-500/30 text-emerald-600 bg-emerald-500/5 text-[10px] font-black uppercase tracking-widest rounded-md">
                        {agent.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 px-6">
                      <Badge variant="outline" className={cn("h-6 px-2.5 text-[10px] font-black uppercase tracking-widest rounded-md", dark ? "bg-slate-900/50 border-slate-700 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-600")}>
                        {agent.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 px-6 text-right">
                      <button
                        onClick={() => handleEdit(agent)}
                        className={cn("inline-flex items-center justify-center w-8 h-8 rounded-lg transition-all", dark ? "hover:bg-primary/10 hover:text-primary text-slate-400" : "hover:bg-primary/10 hover:text-primary text-slate-500")}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
      </CardContent>
    </Card>
  );
}

/* ── Helpers ── */

function SectionHeading({ dark, title, description }: { dark: boolean; title: string; description?: string }) {
  const text = dark ? "text-white" : "text-slate-900";
  const sub  = dark ? "text-slate-500" : "text-slate-400";
  return (
    <div className="space-y-1.5">
      <h3 className={cn("text-[13px] font-black uppercase tracking-widest", text)}>{title}</h3>
      {description && (
        <p className={cn("text-[11px] font-medium leading-relaxed opacity-60 max-w-2xl", sub)}>{description}</p>
      )}
    </div>
  );
}

function FieldLabel({ dark, children }: { dark: boolean; children: React.ReactNode }) {
  const sub = dark ? "text-slate-400" : "text-slate-500";
  return (
    <label className={cn("text-[10px] font-black uppercase tracking-widest pl-1 block", sub)}>{children}</label>
  );
}

function Field({
  dark,
  label,
  required,
  children,
}: {
  dark: boolean;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 pl-1">
        <FieldLabel dark={dark}>{label}</FieldLabel>
        {required && <span className="text-rose-500 text-xs leading-none -mt-0.5">*</span>}
      </div>
      {children}
    </div>
  );
}
