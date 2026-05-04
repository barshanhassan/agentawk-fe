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
    timezone: initialData?.timezone || 'asia_karachi',
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
      "min-h-screen p-6 font-sans transition-colors duration-300",
      isDark ? "bg-[#020617] text-white" : "bg-slate-50 text-slate-900"
    )}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold">{initialData ? 'Edit workspace' : 'Create a workspace'}</h1>
        <p className={cn("text-sm mt-1", isDark ? "text-slate-400" : "text-slate-500")}>
          {initialData 
            ? `Editing settings for ${initialData.name}.`
            : "Create distinct sub-accounts, also known as workspaces, either for yourself or your clients."
          }
        </p>
      </div>

      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Workspace Name & Domain */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
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
                "h-12 border-slate-800",
                isDark ? "bg-[#0f172a] text-white" : "bg-white"
              )}
            />

          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              Domain <HelpCircle size={14} className="text-slate-500" />
            </label>
            <div className="flex">
              <div className={cn(
                "flex items-center px-3 border border-r-0 border-slate-800 rounded-l-md text-sm",
                isDark ? "bg-[#1e293b] text-slate-400" : "bg-slate-100 text-slate-500"
              )}>
                http://
              </div>
              <Input 
                placeholder="domain" 
                value={formData.subdomain}
                onChange={(e) => setFormData(prev => ({ ...prev, subdomain: e.target.value }))}
                disabled={!!initialData}
                className={cn(
                  "h-12 border-slate-800 rounded-none focus-visible:ring-0",
                  isDark ? "bg-[#0f172a] text-white" : "bg-white",
                  initialData && "opacity-50 cursor-not-allowed"
                )}
              />
              <div className={cn(
                "flex items-center px-3 border border-l-0 border-slate-800 rounded-r-md text-sm",
                isDark ? "bg-[#1e293b] text-slate-400" : "bg-slate-100 text-slate-500"
              )}>
                .domainemulator.com
              </div>
            </div>
          </div>
        </div>

        {/* Timezone & Agent */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              Timezone
            </label>
            <Select 
              value={formData.timezone} 
              onValueChange={(v) => setFormData(prev => ({ ...prev, timezone: v }))}
            >
              <SelectTrigger className={cn(
                "h-12 border-slate-800",
                isDark ? "bg-[#0f172a] text-white" : "bg-white"
              )}>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent className={isDark ? "bg-[#1e293b] border-slate-700 text-white" : ""}>
                <SelectItem value="asia_karachi">Islamabad, Karachi (Asia/Karachi)</SelectItem>
                <SelectItem value="america_new_york">New York (America/New_York)</SelectItem>
                <SelectItem value="europe_london">London (Europe/London)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              Assign an agency Agent to this workspace <HelpCircle size={14} className="text-slate-500" />
            </label>
            <Select 
              value={formData.agent}
              onValueChange={(v) => setFormData(prev => ({ ...prev, agent: v }))}
            >
              <SelectTrigger className={cn(
                "h-12 border-slate-800",
                isDark ? "bg-[#0f172a] text-white" : "bg-white"
              )}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-white">
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

        {/* Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={cn(
            "p-4 rounded-lg border border-slate-800 flex items-center justify-between",
            isDark ? "bg-[#0f172a]" : "bg-white"
          )}>
            <div className="flex items-center gap-3">
              <Switch 
                checked={formData.enableWhiteLabel}
                onCheckedChange={(v) => setFormData(prev => ({ ...prev, enableWhiteLabel: v }))}
              />
              <span className="text-sm font-medium flex items-center gap-2">
                Enable White Label for this workspace <HelpCircle size={14} className="text-slate-500" /> <Globe size={14} className="text-slate-500" />
              </span>
            </div>
          </div>
          <div className={cn(
            "p-4 rounded-lg border border-slate-800 flex items-center justify-between",
            isDark ? "bg-[#0f172a]" : "bg-white"
          )}>
            <div className="flex items-center gap-3">
              <Switch 
                checked={formData.allowSupport}
                onCheckedChange={(v) => setFormData(prev => ({ ...prev, allowSupport: v }))}
              />
              <span className="text-sm font-medium flex items-center gap-2">
                Allow support to login to workspace <HelpCircle size={14} className="text-slate-500" />
              </span>
            </div>
          </div>
        </div>

        {/* Limits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={cn(
            "p-4 rounded-lg border border-slate-800 flex items-center justify-between",
            isDark ? "bg-[#0f172a]" : "bg-white"
          )}>
            <div className="flex items-center gap-3">
              <Switch 
                checked={formData.limitContacts}
                onCheckedChange={(v) => setFormData(prev => ({ ...prev, limitContacts: v }))}
              />
              <span className="text-sm font-medium flex items-center gap-2">
                Limit of Active contacts <HelpCircle size={14} className="text-slate-500" /> <Users size={14} className="text-slate-500" />
              </span>
            </div>
            <Input 
              type="number" 
              value={formData.contactLimit}
              onChange={(e) => setFormData(prev => ({ ...prev, contactLimit: parseInt(e.target.value) || 0 }))}
              className={cn("w-20 h-8 text-center border-slate-700", isDark ? "bg-slate-900" : "")} 
            />
          </div>
          <div className={cn(
            "p-4 rounded-lg border border-slate-800 flex items-center justify-between",
            isDark ? "bg-[#0f172a]" : "bg-white"
          )}>
            <div className="flex items-center gap-3">
              <Switch 
                checked={formData.limitAgents}
                onCheckedChange={(v) => setFormData(prev => ({ ...prev, limitAgents: v }))}
              />
              <span className="text-sm font-medium flex items-center gap-2">
                Limit of Agents <HelpCircle size={14} className="text-slate-500" /> <User size={14} className="text-slate-500" />
              </span>
            </div>
            <Input 
              type="number" 
              value={formData.agentLimit}
              onChange={(e) => setFormData(prev => ({ ...prev, agentLimit: parseInt(e.target.value) || 0 }))}
              className={cn("w-20 h-8 text-center border-slate-700", isDark ? "bg-slate-900" : "")} 
            />
          </div>
        </div>

        {/* Features Table */}
        <div className={cn(
          "rounded-lg border border-slate-800 overflow-hidden",
          isDark ? "bg-[#0f172a]" : "bg-white"
        )}>
          <div className="divide-y divide-slate-800">
            {/* AI Assistants Row (Moved inside) */}
            <div className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-900 dark:text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
                    <path d="M12 8a4 4 0 1 0 4 4 4 4 0 0 0-4-4zm0 6a2 2 0 1 1 2-2 2 2 0 0 1-2 2z" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Maximum number of Active AI Chat Assistants</span>
              </div>
              <div className="flex items-center gap-12 text-xs text-slate-400">
                <span>Included in plan : 10</span>
                <span>Additional connections: $0 ea.</span>
                <div className="flex items-center gap-2">
                  <span>Connection Limit</span>
                  <HelpCircle size={14} className="text-slate-500" />
                  <Input 
                    type="number" 
                    value={formData.aiAssistantLimit}
                    onChange={(e) => setFormData(prev => ({ ...prev, aiAssistantLimit: parseInt(e.target.value) || 0 }))}
                    className={cn("w-16 h-8 text-center border-slate-700", isDark ? "bg-slate-900" : "")} 
                  />
                </div>
              </div>
            </div>
            {features.map((feature) => (
              <div key={feature.id} className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center gap-3">
                  {feature.icon}
                  <span className="text-sm font-medium">{feature.name}</span>
                </div>
                <div className="flex items-center gap-12 text-xs text-slate-400">
                  <span>{feature.info}</span>
                  <span>{feature.additional}</span>
                  <div className="flex items-center gap-2">
                    <span>Connection Limit</span>
                    <HelpCircle size={14} className="text-slate-500" />
                    <Input 
                      type="number" 
                      value={(formData.features as any)[feature.id]}
                      onChange={(e) => handleFeatureLimitChange(feature.id, parseInt(e.target.value) || 0)}
                      className={cn("w-16 h-8 text-center border-slate-700", isDark ? "bg-slate-900" : "")} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 mt-8">
          <Button 
            variant="ghost" 
            onClick={onCancel}
            className={cn(isDark ? "text-slate-400 hover:text-white hover:bg-slate-800" : "")}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90 text-white px-8"
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
