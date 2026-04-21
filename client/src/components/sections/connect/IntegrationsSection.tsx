import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Plug, 
  ExternalLink, 
  ArrowLeftRight, 
  Flame,
  Loader2
} from "lucide-react";

export default function IntegrationsSection() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  const { data: integrationsData, isLoading } = useQuery({
    queryKey: ["/api/integrations"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/integrations");
      return res.json();
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/integrations", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/integrations"] });
      toast({ title: "Connected", description: "Integration connected successfully." });
      setConnectingId(null);
      setFormData({});
    },
    onError: (err: any) => {
      toast({ title: "Error", description: "Failed to connect. Please check your credentials.", variant: "destructive" });
    }
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string | number, status: string }) => {
      await apiRequest("PATCH", `/api/integrations/${id}`, { action: status === "ACTIVE" ? "activate" : "pause" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/integrations"] });
      toast({ title: "Updated", description: "Integration status changed successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update integration.", variant: "destructive" });
    }
  });

  const staticIntegrations = [
    {
      id: "MICROSOFT",
      name: "Microsoft Text-To-Speech",
      description: "Seamlessly link your Azure Text-To-Speech application to create lifelike voices for pre-recorded calls, audio messages across channels, and pre-recorded voice files or canned responses.",
      icon: (
        <div className="border rounded-lg p-2 bg-white dark:bg-slate-950 inline-block">
          <img src="/images/integrations/tts.png" alt="Microsoft TTS" className="h-12 w-auto object-contain" />
        </div>
      ),
      hasToggle: true,
      actionLabel: "Connect",
      fields: [
        { key: "key", label: "Azure API Key" },
        { key: "region", label: "Region (e.g. eastus)" }
      ]
    },
    {
      id: "CLOUDINARY",
      name: "Cloudinary",
      description: "Integrate Cloudinary for streamlined image uploads to Cloudinary folders. Organize and optimize your visual marketing with ease, delivering captivating content to your audience and enhancing engagement.",
      icon: (
        <div className="border rounded-lg p-2 bg-white dark:bg-slate-950 inline-block">
          <img src="/images/integrations/cloudinary.svg" alt="Cloudinary" className="h-12 w-auto object-contain" />
        </div>
      ),
      hasToggle: true,
      actionLabel: "Connect",
      fields: [
        { key: "cloud_name", label: "Cloud Name" },
        { key: "api_key", label: "API Key" },
        { key: "api_secret", label: "API Secret" }
      ]
    },
    {
      id: "ACTIVECAMPAIGN",
      name: "ActiveCampaign",
      description: "Integrate ActiveCampaign to add contacts to ActiveCampaign.",
      icon: (
        <div className="border rounded-lg p-2 bg-white dark:bg-slate-950 inline-block">
          <img src="/images/integrations/activecampaign.svg" alt="ActiveCampaign" className="h-12 w-auto object-contain" />
        </div>
      ),
      hasToggle: true,
      actionLabel: "Connect",
      fields: [
        { key: "api_url", label: "API URL" },
        { key: "api_key", label: "API Key" }
      ]
    },
    {
      id: "CHATGPT",
      name: "OpenAI",
      description: "Enter your OpenAI API to provide more tailored and accurate responses about your business, product and services. Automatically convert speech to text using Whisper Voice to Text technology.",
      icon: (
        <div className="border rounded-lg p-2 bg-white dark:bg-slate-950 inline-block">
          <img src="/images/integrations/chat_gpt.svg" alt="OpenAI" className="h-12 w-auto object-contain" />
        </div>
      ),
      hasToggle: true,
      actionLabel: "Connect",
      fields: [
        { key: "api_key", label: "OpenAI API Key" }
      ]
    },
    {
      id: "MAKE",
      name: "Make.com",
      description: "Integrate with over 1600 external apps and effortlessly create and automate tasks using one robust visual platform, Make.com.",
      icon: (
        <div className="border rounded-lg p-2 bg-white dark:bg-slate-950 inline-block">
          <img src="/images/integrations/make.png" alt="Make.com" className="h-12 w-auto object-contain" />
        </div>
      ),
      hasToggle: false,
      actionLabel: "More info",
      externalUrl: "https://make.com"
    },
    {
      id: "ELEVENLABS",
      name: "ElevenLabs",
      description: "Integrate to quickly generate AI voices in multiple languages.",
      icon: (
        <div className="border rounded-lg p-2 bg-white dark:bg-slate-950 inline-block">
          <img src="/images/integrations/elevenlabs.png" alt="ElevenLabs" className="h-12 w-auto object-contain" />
        </div>
      ),
      hasToggle: true,
      actionLabel: "Connect",
      fields: [
        { key: "api_key", label: "ElevenLabs API Key" }
      ]
    },
    {
      id: "CAL",
      name: "Cal.com",
      description: "Integrate your Cal.com account and manage your calendar from the Smart flows.",
      icon: (
        <div className="border rounded-lg p-2 bg-white dark:bg-slate-950 inline-block">
          <img src="/images/integrations/cal_dot_com.png" alt="Cal.com" className="h-12 w-auto object-contain" />
        </div>
      ),
      hasToggle: false,
      actionLabel: "Manage Account",
      fields: [
        { key: "api_key", label: "Cal.com API Key" }
      ]
    },
    {
      id: "BASEROW",
      name: "Baserow.io",
      description: "Integrate external database for data manipulation",
      icon: (
        <div className="border rounded-lg p-2 bg-white dark:bg-slate-950 inline-block">
          <img src="/images/integrations/baserow.png" alt="Baserow" className="h-12 w-auto object-contain" />
        </div>
      ),
      hasToggle: false,
      actionLabel: "Manage",
      fields: [
        { key: "token", label: "Baserow API Token" }
      ]
    }
  ];

  const handleConnect = (item: any) => {
    if (item.externalUrl) {
      window.open(item.externalUrl, "_blank");
      return;
    }
    
    const existing = integrationsData?.integrations?.find((i: any) => i.type === item.id);
    if (existing) {
      toast({ title: "Already Connected", description: `${item.name} is already connected.` });
      return;
    }

    setConnectingId(item.id);
  };

  const submitConnection = () => {
    if (!connectingId) return;
    createMutation.mutate({ type: connectingId, ...formData });
  };

  const toggleIntegration = (type: string, checked: boolean) => {
    const integration = integrationsData?.integrations?.find((i: any) => i.type === type);
    if (integration) {
      toggleMutation.mutate({ id: integration.id, status: checked ? "ACTIVE" : "PAUSED" });
    } else {
      toast({ title: "Info", description: "Please connect this integration first.", variant: "default" });
    }
  };

  const isConnected = (type: string) => {
    return integrationsData?.integrations?.some((i: any) => i.type === type && i.status === "ACTIVE");
  };

  const currentConnecting = staticIntegrations.find(i => i.id === connectingId);

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex flex-row items-center gap-4 pb-6">
        <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
          <Plug className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Integrations</h2>
          <p className="text-sm text-muted-foreground">Unlock the full potential of your account by seamlessly integrating with external application.</p>
        </div>
      </div>
      
      <Separator className="bg-gray-200 dark:bg-slate-800 mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-6">
        {staticIntegrations.map((item) => {
          const connected = isConnected(item.id);
          return (
            <Card key={item.id} className="flex flex-col shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
                <div className="">
                  {item.icon}
                </div>
                <ExternalLink className="w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer" onClick={() => handleConnect(item)} />
              </CardHeader>
              <CardContent className="flex-1 space-y-3 pt-4">
                <CardTitle className="text-base font-semibold">{item.name}</CardTitle>
                <CardDescription className="text-sm line-clamp-4 leading-relaxed">
                  {item.description}
                </CardDescription>
              </CardContent>
              <CardFooter className="border-t pt-4 flex items-center justify-between">
                <div>
                   <Switch 
                    checked={connected} 
                    onCheckedChange={(c) => toggleIntegration(item.id, c)} 
                    disabled={!integrationsData?.integrations?.some((i: any) => i.type === item.id)}
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={`gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground group ${connected ? "bg-primary/5 cursor-default hover:bg-primary/5" : ""}`}
                  onClick={() => handleConnect(item)}
                >
                  {connected ? (
                    <><Plug className="w-4 h-4" /> Connected</>
                  ) : (
                    <><ArrowLeftRight className="w-4 h-4 transition-transform group-hover:scale-110" /> {item.actionLabel}</>
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Connection Modal */}
      <Dialog open={!!connectingId} onOpenChange={(open) => !open && setConnectingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect {currentConnecting?.name}</DialogTitle>
            <DialogDescription>
              Please enter your credentials to link your {currentConnecting?.name} account.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {currentConnecting?.fields?.map((field: any) => (
              <div key={field.key} className="space-y-2">
                <Label>{field.label}</Label>
                <Input 
                  value={formData[field.key] || ""} 
                  onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                  placeholder={`Enter ${field.label}...`}
                />
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setConnectingId(null)}>Cancel</Button>
            <Button 
              className="btn-outline-primary"
              variant="outline"
              onClick={submitConnection}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Connect Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
