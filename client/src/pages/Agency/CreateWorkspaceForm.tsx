import React from 'react';
import { ChevronLeft, Info, HelpCircle, Save, X, MessageSquare, Globe, Clock, User, Shield, Users, Bot, MessageCircle, Send, Phone, Monitor } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";


interface CreateWorkspaceFormProps {
  onCancel: () => void;
  initialData?: any;
}

const CreateWorkspaceForm: React.FC<CreateWorkspaceFormProps> = ({ onCancel, initialData }) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const userInfo = JSON.parse(localStorage.getItem("user_info") || "{}");
  const agencyId = userInfo.modelable_id || "7";

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    subdomain: initialData?.subdomain || '',
    timezone: initialData?.timezone || 'Asia/Karachi',
    agent: initialData?.agent || 'firoula',
    enableWhiteLabel: initialData?.allow_branding || false,
    allowSupport: initialData?.allow_support || false,
    limitContacts: initialData?.limited_contacts || false,
    contactLimit: initialData?.maximum_contacts || 0,
    limitAgents: initialData?.allow_agents || true,
    agentLimit: initialData?.agents_limit || 4,
    aiAssistantLimit: initialData?.chatgpt_assistant_limit || 10,
    features: {
      whatsapp_api: initialData?.whatsapp_channels_limit || 1,
      instagram: initialData?.instagram_channels_limit || 1,
      messenger: initialData?.facebook_channels_limit || 1,
      telegram: initialData?.telegram_channels_limit || 1,
      whatsapp_qr: initialData?.zapi_channels_limit || 1,
      twilio: initialData?.twilio_channels_limit || 1,
      webchat: initialData?.webchat_channels_limit || 1,
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const endpoint = initialData 
        ? `/api/agencies/${agencyId}/workspaces/${initialData.id}` 
        : `/api/agencies/${agencyId}/workspaces`;
      const method = initialData ? "PATCH" : "POST";
      const res = await apiRequest(method, endpoint, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/agencies/${agencyId}/workspaces`] });
      toast({ 
        title: initialData ? "Workspace Updated" : "Workspace Created", 
        description: `Successfully ${initialData ? "updated" : "created"} the workspace.` 
      });
      onCancel();
    },
    onError: (err: any) => {
      toast({ title: "Error", description: "Failed to save workspace.", variant: "destructive" });
    }
  });

  const handleSave = () => {
    if (!formData.name) {
      toast({ title: "Error", description: "Workspace name is required.", variant: "destructive" });
      return;
    }
    
    const payload = {
      name: formData.name,
      slug: formData.subdomain,
      timezone: formData.timezone,
      allow_branding: formData.enableWhiteLabel,
      allow_support: formData.allowSupport,
      limited_contacts: formData.limitContacts,
      maximum_contacts: formData.contactLimit,
      allow_agents: formData.limitAgents,
      agents_limit: formData.agentLimit,
      chatgpt_assistant_limit: formData.aiAssistantLimit,
      whatsapp_channels_limit: formData.features.whatsapp_api,
      instagram_channels_limit: formData.features.instagram,
      facebook_channels_limit: formData.features.messenger,
      telegram_channels_limit: formData.features.telegram,
      zapi_channels_limit: formData.features.whatsapp_qr,
      twilio_channels_limit: formData.features.twilio,
      webchat_channels_limit: formData.features.webchat,
    };

    createMutation.mutate(payload);
  };

  const handleFeatureLimitChange = (id: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [id]: value
      }
    }));
  };

  const features = [
    { 
      id: 'whatsapp_api', 
      name: 'WhatsApp Business API', 
      icon: (
        <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center shadow-sm">
          <MessageCircle className="w-5 h-5 text-white fill-white" />
        </div>
      ), 
      info: 'Pilot connection: FREE', 
      additional: 'Additional connections: $4 ea.', 
    },
    { 
      id: 'instagram', 
      name: 'Instagram', 
      icon: (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center shadow-sm">
          <div className="w-4 h-4 border-2 border-white rounded-[4px] relative flex items-center justify-center">
             <div className="w-1.5 h-1.5 border-2 border-white rounded-full" />
             <div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 bg-white rounded-full" />
          </div>
        </div>
      ), 
      info: 'Pilot connection: FREE', 
      additional: 'Additional connections: $10 ea.', 
    },
    { 
      id: 'messenger', 
      name: 'Messenger', 
      icon: (
        <div className="w-8 h-8 rounded-full bg-[#00B2FF] flex items-center justify-center shadow-sm">
          <MessageSquare className="w-5 h-5 text-white fill-white" />
        </div>
      ), 
      info: 'Pilot connection: FREE', 
      additional: 'Additional connections: $10 ea.', 
    },
    { 
      id: 'telegram', 
      name: 'Telegram', 
      icon: (
        <div className="w-8 h-8 rounded-full bg-[#229ED9] flex items-center justify-center shadow-sm p-1.5">
          <Send className="w-5 h-5 text-white fill-white -translate-x-0.5" />
        </div>
      ), 
      info: 'Pilot connection: FREE', 
      additional: 'Additional connections: $10 ea.', 
    },
    { 
      id: 'whatsapp_qr', 
      name: 'WhatsApp QR', 
      icon: (
        <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center shadow-sm">
          <MessageCircle className="w-5 h-5 text-white fill-white" />
        </div>
      ), 
      info: 'Pilot connection: $24', 
      additional: 'Additional connections: $24 ea.', 
    },
    { 
      id: 'twilio', 
      name: 'Twilio - SMS & Calls', 
      icon: (
        <div className="w-8 h-8 rounded-full bg-[#F22F46] flex items-center justify-center shadow-sm">
          <div className="grid grid-cols-2 gap-0.5">
             <div className="w-1.5 h-1.5 bg-white rounded-full" />
             <div className="w-1.5 h-1.5 bg-white rounded-full" />
             <div className="w-1.5 h-1.5 bg-white rounded-full" />
             <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
        </div>
      ), 
      info: 'Pilot connection: FREE', 
      additional: 'Additional connections: $10 ea.', 
    },
    { 
      id: 'webchat', 
      name: 'Webchat', 
      icon: (
        <div className="w-8 h-8 rounded-full bg-[#8E24AA] flex items-center justify-center shadow-sm">
          <MessageSquare className="w-4 h-4 text-white fill-white" />
        </div>
      ), 
      info: 'Pilot connection: FREE', 
      additional: 'Additional connections: $10 ea.', 
    },
  ];

  return (
    <div className={cn(
      "p-6 font-sans transition-all duration-300",
      isDark ? "text-white" : "text-slate-900"
    )}>
      {/* Header */}
      <div className="mb-6">
        <h1 className={cn("text-[16px] font-bold", isDark ? "text-white" : "text-slate-900")}>{initialData ? 'Edit workspace' : 'Add a workspace'}</h1>
        <p className={cn("text-[12px] mt-1 font-medium", isDark ? "text-slate-300" : "text-slate-600")}>
          {initialData 
            ? `Editing settings for ${initialData.name}.`
            : "Create distinct sub-accounts, also known as workspaces, either for yourself or for your clients."
          }
        </p>
      </div>

      <div className="space-y-4 max-w-7xl">
        {/* Top Info Card */}
        <div className={cn(
          "p-4 rounded-lg border space-y-4",
          isDark ? "bg-[#0f172a] border-slate-600" : "bg-white border-slate-300"
        )}>
          {/* Workspace Name & Domain */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={cn("text-[11px] font-bold flex items-center gap-1", isDark ? "text-white" : "text-slate-900")}>
                Workspace name
              </label>
              <Input 
                placeholder="Workspace name" 
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setFormData(prev => ({
                    ...prev,
                    name,
                    subdomain: initialData ? prev.subdomain : name.toLowerCase().replace(/[^a-z0-9]/g, '')
                  }));
                }}
                className={cn(
                  "h-10 text-[12px] font-medium border-slate-300 focus-visible:ring-1 focus-visible:ring-blue-500",
                  isDark ? "bg-[#1e293b] text-white border-slate-600" : "bg-white text-slate-900"
                )}
              />
            </div>
            <div className="space-y-1.5">
              <label className={cn("text-[11px] font-bold flex items-center gap-1", isDark ? "text-white" : "text-slate-900")}>
                Domain <Info size={12} className="text-slate-500" />
              </label>
              <div className="flex h-10">
                <div className={cn(
                  "flex items-center px-3 border border-r-0 rounded-l text-[12px] font-bold h-full",
                  isDark ? "bg-[#334155] text-slate-200 border-slate-600" : "bg-slate-100 text-slate-700 border-slate-300"
                )}>
                  https://
                </div>
                <Input 
                  placeholder="domain" 
                  value={formData.subdomain}
                  onChange={(e) => setFormData(prev => ({ ...prev, subdomain: e.target.value }))}
                  disabled={!!initialData}
                  className={cn(
                    "h-full text-[12px] font-medium border-slate-300 rounded-none focus-visible:ring-1 focus-visible:ring-blue-500 flex-1",
                    isDark ? "bg-[#1e293b] text-white border-slate-600" : "bg-white text-slate-900",
                    initialData && "opacity-50 cursor-not-allowed"
                  )}
                />
                <div className={cn(
                  "flex items-center px-3 border border-l-0 rounded-r text-[12px] font-bold h-full",
                  isDark ? "bg-[#334155] text-slate-200 border-slate-600" : "bg-slate-100 text-slate-700 border-slate-300"
                )}>
                  .domainemulator.com
                </div>
              </div>
            </div>
          </div>

          {/* Timezone & Agent */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={cn("text-[11px] font-bold", isDark ? "text-white" : "text-slate-900")}>
                Timezone
              </label>
              <Select 
                value={formData.timezone} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, timezone: v }))}
              >
                <SelectTrigger className={cn(
                  "h-10 text-[12px] border-slate-200 focus-visible:ring-1 focus-visible:ring-blue-500",
                  isDark ? "bg-[#1e293b] text-white border-slate-700" : "bg-white"
                )}>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent className={cn("max-h-80 overflow-y-auto", isDark ? "bg-[#1e293b] border-slate-700 text-white" : "")}>
                  {/* Africa */}
                  <SelectItem value="Africa/Abidjan">Abidjan (Africa/Abidjan) UTC+0</SelectItem>
                  <SelectItem value="Africa/Accra">Accra (Africa/Accra) UTC+0</SelectItem>
                  <SelectItem value="Africa/Addis_Ababa">Addis Ababa (Africa/Addis_Ababa) UTC+3</SelectItem>
                  <SelectItem value="Africa/Algiers">Algiers (Africa/Algiers) UTC+1</SelectItem>
                  <SelectItem value="Africa/Cairo">Cairo (Africa/Cairo) UTC+2</SelectItem>
                  <SelectItem value="Africa/Casablanca">Casablanca (Africa/Casablanca) UTC+1</SelectItem>
                  <SelectItem value="Africa/Johannesburg">Johannesburg (Africa/Johannesburg) UTC+2</SelectItem>
                  <SelectItem value="Africa/Lagos">Lagos (Africa/Lagos) UTC+1</SelectItem>
                  <SelectItem value="Africa/Nairobi">Nairobi (Africa/Nairobi) UTC+3</SelectItem>
                  <SelectItem value="Africa/Tripoli">Tripoli (Africa/Tripoli) UTC+2</SelectItem>
                  <SelectItem value="Africa/Tunis">Tunis (Africa/Tunis) UTC+1</SelectItem>
                  {/* America */}
                  <SelectItem value="America/Anchorage">Anchorage (America/Anchorage) UTC-9</SelectItem>
                  <SelectItem value="America/Argentina/Buenos_Aires">Buenos Aires (America/Argentina/Buenos_Aires) UTC-3</SelectItem>
                  <SelectItem value="America/Bogota">Bogota (America/Bogota) UTC-5</SelectItem>
                  <SelectItem value="America/Caracas">Caracas (America/Caracas) UTC-4</SelectItem>
                  <SelectItem value="America/Chicago">Chicago (America/Chicago) UTC-6</SelectItem>
                  <SelectItem value="America/Denver">Denver (America/Denver) UTC-7</SelectItem>
                  <SelectItem value="America/Godthab">Godthab (America/Godthab) UTC-2</SelectItem>
                  <SelectItem value="America/Guatemala">Guatemala (America/Guatemala) UTC-6</SelectItem>
                  <SelectItem value="America/Halifax">Halifax (America/Halifax) UTC-4</SelectItem>
                  <SelectItem value="America/Havana">Havana (America/Havana) UTC-5</SelectItem>
                  <SelectItem value="America/Lima">Lima (America/Lima) UTC-5</SelectItem>
                  <SelectItem value="America/Los_Angeles">Los Angeles (America/Los_Angeles) UTC-8</SelectItem>
                  <SelectItem value="America/Manaus">Manaus (America/Manaus) UTC-4</SelectItem>
                  <SelectItem value="America/Mexico_City">Mexico City (America/Mexico_City) UTC-6</SelectItem>
                  <SelectItem value="America/Montevideo">Montevideo (America/Montevideo) UTC-3</SelectItem>
                  <SelectItem value="America/New_York">New York (America/New_York) UTC-5</SelectItem>
                  <SelectItem value="America/Phoenix">Phoenix (America/Phoenix) UTC-7</SelectItem>
                  <SelectItem value="America/Regina">Regina (America/Regina) UTC-6</SelectItem>
                  <SelectItem value="America/Santiago">Santiago (America/Santiago) UTC-3</SelectItem>
                  <SelectItem value="America/Sao_Paulo">Sao Paulo (America/Sao_Paulo) UTC-3</SelectItem>
                  <SelectItem value="America/St_Johns">St. Johns (America/St_Johns) UTC-3:30</SelectItem>
                  <SelectItem value="America/Toronto">Toronto (America/Toronto) UTC-5</SelectItem>
                  <SelectItem value="America/Vancouver">Vancouver (America/Vancouver) UTC-8</SelectItem>
                  {/* Asia */}
                  <SelectItem value="Asia/Almaty">Almaty (Asia/Almaty) UTC+6</SelectItem>
                  <SelectItem value="Asia/Amman">Amman (Asia/Amman) UTC+3</SelectItem>
                  <SelectItem value="Asia/Baghdad">Baghdad (Asia/Baghdad) UTC+3</SelectItem>
                  <SelectItem value="Asia/Baku">Baku (Asia/Baku) UTC+4</SelectItem>
                  <SelectItem value="Asia/Bangkok">Bangkok (Asia/Bangkok) UTC+7</SelectItem>
                  <SelectItem value="Asia/Beirut">Beirut (Asia/Beirut) UTC+3</SelectItem>
                  <SelectItem value="Asia/Colombo">Colombo (Asia/Colombo) UTC+5:30</SelectItem>
                  <SelectItem value="Asia/Dhaka">Dhaka (Asia/Dhaka) UTC+6</SelectItem>
                  <SelectItem value="Asia/Dubai">Dubai (Asia/Dubai) UTC+4</SelectItem>
                  <SelectItem value="Asia/Hong_Kong">Hong Kong (Asia/Hong_Kong) UTC+8</SelectItem>
                  <SelectItem value="Asia/Irkutsk">Irkutsk (Asia/Irkutsk) UTC+8</SelectItem>
                  <SelectItem value="Asia/Jakarta">Jakarta (Asia/Jakarta) UTC+7</SelectItem>
                  <SelectItem value="Asia/Jerusalem">Jerusalem (Asia/Jerusalem) UTC+2</SelectItem>
                  <SelectItem value="Asia/Kabul">Kabul (Asia/Kabul) UTC+4:30</SelectItem>
                  <SelectItem value="Asia/Karachi">Islamabad, Karachi (Asia/Karachi) UTC+5</SelectItem>
                  <SelectItem value="Asia/Kathmandu">Kathmandu (Asia/Kathmandu) UTC+5:45</SelectItem>
                  <SelectItem value="Asia/Kolkata">Mumbai, Kolkata (Asia/Kolkata) UTC+5:30</SelectItem>
                  <SelectItem value="Asia/Krasnoyarsk">Krasnoyarsk (Asia/Krasnoyarsk) UTC+7</SelectItem>
                  <SelectItem value="Asia/Kuala_Lumpur">Kuala Lumpur (Asia/Kuala_Lumpur) UTC+8</SelectItem>
                  <SelectItem value="Asia/Kuwait">Kuwait (Asia/Kuwait) UTC+3</SelectItem>
                  <SelectItem value="Asia/Magadan">Magadan (Asia/Magadan) UTC+11</SelectItem>
                  <SelectItem value="Asia/Manila">Manila (Asia/Manila) UTC+8</SelectItem>
                  <SelectItem value="Asia/Muscat">Muscat (Asia/Muscat) UTC+4</SelectItem>
                  <SelectItem value="Asia/Novosibirsk">Novosibirsk (Asia/Novosibirsk) UTC+7</SelectItem>
                  <SelectItem value="Asia/Rangoon">Rangoon/Yangon (Asia/Rangoon) UTC+6:30</SelectItem>
                  <SelectItem value="Asia/Riyadh">Riyadh (Asia/Riyadh) UTC+3</SelectItem>
                  <SelectItem value="Asia/Seoul">Seoul (Asia/Seoul) UTC+9</SelectItem>
                  <SelectItem value="Asia/Shanghai">Beijing, Shanghai (Asia/Shanghai) UTC+8</SelectItem>
                  <SelectItem value="Asia/Singapore">Singapore (Asia/Singapore) UTC+8</SelectItem>
                  <SelectItem value="Asia/Taipei">Taipei (Asia/Taipei) UTC+8</SelectItem>
                  <SelectItem value="Asia/Tashkent">Tashkent (Asia/Tashkent) UTC+5</SelectItem>
                  <SelectItem value="Asia/Tbilisi">Tbilisi (Asia/Tbilisi) UTC+4</SelectItem>
                  <SelectItem value="Asia/Tehran">Tehran (Asia/Tehran) UTC+3:30</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tokyo (Asia/Tokyo) UTC+9</SelectItem>
                  <SelectItem value="Asia/Vladivostok">Vladivostok (Asia/Vladivostok) UTC+10</SelectItem>
                  <SelectItem value="Asia/Yakutsk">Yakutsk (Asia/Yakutsk) UTC+9</SelectItem>
                  <SelectItem value="Asia/Yekaterinburg">Yekaterinburg (Asia/Yekaterinburg) UTC+5</SelectItem>
                  <SelectItem value="Asia/Yerevan">Yerevan (Asia/Yerevan) UTC+4</SelectItem>
                  {/* Atlantic */}
                  <SelectItem value="Atlantic/Azores">Azores (Atlantic/Azores) UTC-1</SelectItem>
                  <SelectItem value="Atlantic/Cape_Verde">Cape Verde (Atlantic/Cape_Verde) UTC-1</SelectItem>
                  <SelectItem value="Atlantic/Reykjavik">Reykjavik (Atlantic/Reykjavik) UTC+0</SelectItem>
                  {/* Australia */}
                  <SelectItem value="Australia/Adelaide">Adelaide (Australia/Adelaide) UTC+9:30</SelectItem>
                  <SelectItem value="Australia/Brisbane">Brisbane (Australia/Brisbane) UTC+10</SelectItem>
                  <SelectItem value="Australia/Darwin">Darwin (Australia/Darwin) UTC+9:30</SelectItem>
                  <SelectItem value="Australia/Hobart">Hobart (Australia/Hobart) UTC+10</SelectItem>
                  <SelectItem value="Australia/Melbourne">Melbourne (Australia/Melbourne) UTC+10</SelectItem>
                  <SelectItem value="Australia/Perth">Perth (Australia/Perth) UTC+8</SelectItem>
                  <SelectItem value="Australia/Sydney">Sydney (Australia/Sydney) UTC+10</SelectItem>
                  {/* Europe */}
                  <SelectItem value="Europe/Amsterdam">Amsterdam (Europe/Amsterdam) UTC+1</SelectItem>
                  <SelectItem value="Europe/Athens">Athens (Europe/Athens) UTC+2</SelectItem>
                  <SelectItem value="Europe/Belgrade">Belgrade (Europe/Belgrade) UTC+1</SelectItem>
                  <SelectItem value="Europe/Berlin">Berlin (Europe/Berlin) UTC+1</SelectItem>
                  <SelectItem value="Europe/Brussels">Brussels (Europe/Brussels) UTC+1</SelectItem>
                  <SelectItem value="Europe/Bucharest">Bucharest (Europe/Bucharest) UTC+2</SelectItem>
                  <SelectItem value="Europe/Budapest">Budapest (Europe/Budapest) UTC+1</SelectItem>
                  <SelectItem value="Europe/Copenhagen">Copenhagen (Europe/Copenhagen) UTC+1</SelectItem>
                  <SelectItem value="Europe/Dublin">Dublin (Europe/Dublin) UTC+0</SelectItem>
                  <SelectItem value="Europe/Helsinki">Helsinki (Europe/Helsinki) UTC+2</SelectItem>
                  <SelectItem value="Europe/Istanbul">Istanbul (Europe/Istanbul) UTC+3</SelectItem>
                  <SelectItem value="Europe/Kaliningrad">Kaliningrad (Europe/Kaliningrad) UTC+2</SelectItem>
                  <SelectItem value="Europe/Kiev">Kiev (Europe/Kiev) UTC+2</SelectItem>
                  <SelectItem value="Europe/Lisbon">Lisbon (Europe/Lisbon) UTC+0</SelectItem>
                  <SelectItem value="Europe/London">London (Europe/London) UTC+0</SelectItem>
                  <SelectItem value="Europe/Madrid">Madrid (Europe/Madrid) UTC+1</SelectItem>
                  <SelectItem value="Europe/Minsk">Minsk (Europe/Minsk) UTC+3</SelectItem>
                  <SelectItem value="Europe/Moscow">Moscow (Europe/Moscow) UTC+3</SelectItem>
                  <SelectItem value="Europe/Oslo">Oslo (Europe/Oslo) UTC+1</SelectItem>
                  <SelectItem value="Europe/Paris">Paris (Europe/Paris) UTC+1</SelectItem>
                  <SelectItem value="Europe/Prague">Prague (Europe/Prague) UTC+1</SelectItem>
                  <SelectItem value="Europe/Rome">Rome (Europe/Rome) UTC+1</SelectItem>
                  <SelectItem value="Europe/Samara">Samara (Europe/Samara) UTC+4</SelectItem>
                  <SelectItem value="Europe/Sofia">Sofia (Europe/Sofia) UTC+2</SelectItem>
                  <SelectItem value="Europe/Stockholm">Stockholm (Europe/Stockholm) UTC+1</SelectItem>
                  <SelectItem value="Europe/Vienna">Vienna (Europe/Vienna) UTC+1</SelectItem>
                  <SelectItem value="Europe/Warsaw">Warsaw (Europe/Warsaw) UTC+1</SelectItem>
                  <SelectItem value="Europe/Zurich">Zurich (Europe/Zurich) UTC+1</SelectItem>
                  {/* Pacific */}
                  <SelectItem value="Pacific/Auckland">Auckland (Pacific/Auckland) UTC+12</SelectItem>
                  <SelectItem value="Pacific/Fiji">Fiji (Pacific/Fiji) UTC+12</SelectItem>
                  <SelectItem value="Pacific/Guam">Guam (Pacific/Guam) UTC+10</SelectItem>
                  <SelectItem value="Pacific/Honolulu">Honolulu (Pacific/Honolulu) UTC-10</SelectItem>
                  <SelectItem value="Pacific/Midway">Midway Island (Pacific/Midway) UTC-11</SelectItem>
                  <SelectItem value="Pacific/Port_Moresby">Port Moresby (Pacific/Port_Moresby) UTC+10</SelectItem>
                  <SelectItem value="Pacific/Tongatapu">Nuku'alofa (Pacific/Tongatapu) UTC+13</SelectItem>
                  {/* UTC */}
                  <SelectItem value="UTC">UTC+0</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className={cn("text-[11px] font-bold flex items-center gap-1", isDark ? "text-white" : "text-slate-900")}>
                Assign an agency Agent to this workspace <Info size={12} className="text-slate-500" />
              </label>
              <Select 
                value={formData.agent}
                onValueChange={(v) => setFormData(prev => ({ ...prev, agent: v }))}
              >
                <SelectTrigger className={cn(
                  "h-10 text-[12px] border-slate-200 focus-visible:ring-1 focus-visible:ring-blue-500",
                  isDark ? "bg-[#1e293b] text-white border-slate-700" : "bg-white"
                )}>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[9px] text-white">
                      {formData.agent.slice(0, 2).toUpperCase()}
                    </div>
                    <SelectValue placeholder="Select agent" />
                  </div>
                </SelectTrigger>
                <SelectContent className={isDark ? "bg-[#1e293b] border-slate-700 text-white" : ""}>
                  <SelectItem value="firoula">Firoula Berham</SelectItem>
                  <SelectItem value="admin">Admin User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={cn(
            "px-4 py-3 rounded-lg border flex items-center justify-between",
            isDark ? "bg-[#0f172a] border-slate-600" : "bg-white border-slate-300"
          )}>
            <div className="flex items-center gap-3">
              <Switch 
                checked={formData.enableWhiteLabel}
                onCheckedChange={(v) => setFormData(prev => ({ ...prev, enableWhiteLabel: v }))}
              />
              <span className={cn("text-[12px] font-bold flex items-center gap-1.5", isDark ? "text-white" : "text-slate-900")}>
                Enable White Label for this workspace <Info size={12} className="text-slate-500" /> <Globe size={12} className="text-slate-500" />
              </span>
            </div>
          </div>
          <div className={cn(
            "px-4 py-3 rounded-lg border flex items-center justify-between",
            isDark ? "bg-[#0f172a] border-slate-600" : "bg-white border-slate-300"
          )}>
            <div className="flex items-center gap-3">
              <Switch 
                checked={formData.allowSupport}
                onCheckedChange={(v) => setFormData(prev => ({ ...prev, allowSupport: v }))}
              />
              <span className={cn("text-[12px] font-bold flex items-center gap-1.5", isDark ? "text-white" : "text-slate-900")}>
                Allow support to login to workspace <Info size={12} className="text-slate-500" />
              </span>
            </div>
          </div>
        </div>

        {/* Limits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={cn(
            "px-4 py-3 rounded-lg border flex items-center justify-between",
            isDark ? "bg-[#0f172a] border-slate-600" : "bg-white border-slate-300"
          )}>
            <div className="flex items-center gap-3">
              <Switch 
                checked={formData.limitContacts}
                onCheckedChange={(v) => setFormData(prev => ({ ...prev, limitContacts: v }))}
              />
              <span className={cn("text-[12px] font-bold flex items-center gap-1.5", isDark ? "text-white" : "text-slate-900")}>
                Limit of Active contacts <Info size={12} className="text-slate-500" /> <Users size={12} className="text-slate-500" />
              </span>
            </div>
            <Input 
              type="number" 
              value={formData.contactLimit}
              onChange={(e) => setFormData(prev => ({ ...prev, contactLimit: parseInt(e.target.value) || 0 }))}
              className={cn("w-16 h-8 text-[12px] font-bold text-center border-slate-300", isDark ? "bg-slate-900 border-slate-600" : "bg-white text-slate-900")} 
            />
          </div>
          <div className={cn(
            "px-4 py-3 rounded-lg border flex items-center justify-between",
            isDark ? "bg-[#0f172a] border-slate-600" : "bg-white border-slate-300"
          )}>
            <div className="flex items-center gap-3">
              <Switch 
                checked={formData.limitAgents}
                onCheckedChange={(v) => setFormData(prev => ({ ...prev, limitAgents: v }))}
              />
              <span className={cn("text-[12px] font-bold flex items-center gap-1.5", isDark ? "text-white" : "text-slate-900")}>
                Limit of Agents <Info size={12} className="text-slate-500" /> <User size={12} className="text-slate-500" />
              </span>
            </div>
            <Input 
              type="number" 
              value={formData.agentLimit}
              onChange={(e) => setFormData(prev => ({ ...prev, agentLimit: parseInt(e.target.value) || 0 }))}
              className={cn("w-16 h-8 text-[12px] font-bold text-center border-slate-300", isDark ? "bg-slate-900 border-slate-600" : "bg-white text-slate-900")} 
            />
          </div>
        </div>

        {/* Features Cards (Individual) */}
        <div className="space-y-2">
          {/* AI Assistants Card */}
          <div className={cn(
            "p-3 rounded-lg border flex items-center justify-between transition-colors",
            isDark ? "bg-[#0f172a] border-slate-600 hover:bg-[#1e293b]" : "bg-white border-slate-300 hover:bg-slate-50"
          )}>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-300 dark:border-slate-600">
                 <Bot className="w-4 h-4 text-slate-900 dark:text-white" />
              </div>
              <span className={cn("text-[12px] font-bold", isDark ? "text-white" : "text-slate-900")}>Maximum number of Active AI Chat Assistants</span>
            </div>
            <div className="flex items-center gap-8">
              <span className="text-[11px] text-slate-600 dark:text-slate-300 font-bold">Included in plan : 10</span>
              <span className="text-[11px] text-slate-600 dark:text-slate-300 font-bold">Additional connections: $0 ea.</span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-600 dark:text-slate-300 font-bold whitespace-nowrap">Connection Limit</span>
                <Info size={11} className="text-slate-500" />
                <Input 
                  type="number" 
                  value={formData.aiAssistantLimit}
                  onChange={(e) => setFormData(prev => ({ ...prev, aiAssistantLimit: parseInt(e.target.value) || 0 }))}
                  className={cn("w-14 h-7 text-[11px] font-bold text-center border-slate-300", isDark ? "bg-slate-900 border-slate-600" : "bg-white text-slate-900")} 
                />
              </div>
            </div>
          </div>

          {features.map((feature) => (
            <div key={feature.id} className={cn(
              "p-3 rounded-lg border flex items-center justify-between transition-colors",
              isDark ? "bg-[#0f172a] border-slate-600 hover:bg-[#1e293b]" : "bg-white border-slate-300 hover:bg-slate-50"
            )}>
              <div className="flex items-center gap-4">
                {feature.icon}
                <span className={cn("text-[12px] font-bold", isDark ? "text-white" : "text-slate-900")}>{feature.name}</span>
              </div>
              <div className="flex items-center gap-8">
                <span className="text-[11px] text-slate-600 dark:text-slate-300 font-bold whitespace-nowrap">{feature.info}</span>
                <span className="text-[11px] text-slate-600 dark:text-slate-300 font-bold whitespace-nowrap">{feature.additional}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-600 dark:text-slate-300 font-bold whitespace-nowrap">Connection Limit</span>
                  <Info size={11} className="text-slate-500" />
                  <Input 
                    type="number" 
                    value={(formData.features as any)[feature.id]}
                    onChange={(e) => handleFeatureLimitChange(feature.id, parseInt(e.target.value) || 0)}
                    className={cn("w-14 h-7 text-[11px] font-bold text-center border-slate-300", isDark ? "bg-slate-900 border-slate-600" : "bg-white text-slate-900")} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 mt-4 pt-2">
          <Button 
            variant="ghost" 
            onClick={onCancel}
            className={cn("text-[12px] font-bold h-9 px-6", isDark ? "text-slate-300 hover:text-white hover:bg-slate-800" : "text-slate-700 hover:bg-slate-100")}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className={cn("px-8 h-9 text-[12px] font-bold transition-colors border",
              mode === "dark" ? "bg-[#1e293b] hover:bg-[#00e55e] text-[#00e55e] hover:text-white border-[#00e55e]" : "bg-white hover:bg-[#00e55e] hover:text-white text-[#00e55e] border-[#00e55e]")}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Saving..." : (initialData ? 'Update' : 'Save')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkspaceForm;
