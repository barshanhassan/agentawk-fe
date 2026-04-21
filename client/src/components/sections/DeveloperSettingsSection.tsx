import React, { useState, useEffect } from 'react';
import { CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye, EyeOff, Copy, RefreshCw, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

type WebhookEvent = "Sent Message" | "Delivered Message" | "Read Message" | "Failed Message";

interface Webhook {
  id: string;
  url: string;
  events: WebhookEvent[];
}

interface DeveloperSettings {
  apiKey: string;
  webhooks: Webhook[];
}

const DeveloperSettingsSection = () => {
  const { toast } = useToast();
  const [showApiKey, setShowApiKey] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<WebhookEvent[]>([]);

  const { data: settings, isLoading } = useQuery<DeveloperSettings>({
    queryKey: ["/api/workspaces/developer-settings"],
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/workspaces/developer-settings", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces/developer-settings"] });
      toast({ title: "Settings Updated", description: "Your changes have been saved." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleCopy = () => {
    if (settings?.apiKey) {
      navigator.clipboard.writeText(settings.apiKey);
      toast({
        title: "Copied to clipboard",
        description: "The API Key has been copied to your clipboard.",
      });
    }
  };

  const handleRegenerate = () => {
    mutation.mutate({ regenerateKey: true });
  };

  const handleCreateWebhook = () => {
    let isValid = true;
    if (!webhookUrl.trim()) {
      isValid = false;
    } else {
      try {
        new URL(webhookUrl);
      } catch (_) {
        isValid = false;
      }
    }

    if (selectedEvents.length === 0) {
      isValid = false;
    }

    if (!isValid) {
      toast({
        title: "Invalid Input",
        description: "Please provide a valid URL and select at least one event.",
        variant: "destructive",
      });
      return;
    }

    const newWebhook: Webhook = {
      id: `webhook-${Date.now()}`,
      url: webhookUrl,
      events: selectedEvents,
    };

    const updatedWebhooks = [...(settings?.webhooks || []), newWebhook];
    mutation.mutate({ webhooks: updatedWebhooks });
    
    setWebhookUrl('');
    setSelectedEvents([]);
    setShowWebhookModal(false);
  };

  const handleDeleteWebhook = (id: string) => {
    const updatedWebhooks = (settings?.webhooks || []).filter(webhook => webhook.id !== id);
    mutation.mutate({ webhooks: updatedWebhooks });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-lg">Developer Settings</CardTitle>
        <p className="text-sm text-muted-foreground">Here's everything you need to start connecting your application with Digital Connect APIs.</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <Separator />

        <div>
          <h4 className="font-semibold text-base">API Docs</h4>
          <p className="text-sm text-muted-foreground">
            Use our <span className="text-blue-500 cursor-pointer hover:underline">API Documentation</span> to start understanding our API capabilities.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-base">API Key</h4>
          <p className="text-sm text-muted-foreground">Use this API Key when using our API for authentication.</p>
          <div className="flex items-center gap-2">
            <div className="relative max-w-[450px] w-full">
              <Input
                readOnly
                type={showApiKey ? "text" : "password"}
                value={settings?.apiKey || ''}
                className="pr-12 w-full"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-1.5">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="h-8 w-8"
                      >
                        {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{showApiKey ? "Hide" : "Show"} key</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleCopy}>
                    <Copy size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleRegenerate}
                    disabled={mutation.isPending}
                  >
                    <RefreshCw size={16} className={mutation.isPending ? "animate-spin" : ""} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Regenerate key</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div>
            <h4 className="font-semibold text-base">Webhooks</h4>
            <p className="text-sm text-muted-foreground">Configure webhooks to receive delivery reports of your WhatsApp template messages.</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="btn-outline-primary h-7 text-xs"
            onClick={() => setShowWebhookModal(true)}
          >
            Configure
          </Button>
        </div>

        {settings?.webhooks && settings.webhooks.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-base">Configured Webhooks</h4>
            <div className="border rounded-md p-4 space-y-3 max-h-[20rem] overflow-y-auto">
              {settings.webhooks.map((webhook) => (
                <div key={webhook.id} className="flex items-center justify-between bg-muted/50 p-2 rounded-md gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium break-all">{webhook.url}</p>
                    <p className="text-xs text-muted-foreground">{webhook.events.join(', ')}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteWebhook(webhook.id)}
                    disabled={mutation.isPending}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

      </CardContent>
      <CardFooter className="flex justify-end p-0 mt-4">
        {/* Save button removed as changes are immediate via mutation */}
      </CardFooter>

      {/* Webhook Configuration Modal */}
      <Dialog open={showWebhookModal} onOpenChange={setShowWebhookModal}>
        <DialogContent className="max-w-md">
          <DialogHeader className="mb-2">
            <DialogTitle>Configure Webhook</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="webhook-url" className="text-sm font-medium text-foreground">Webhook URL<span className="text-red-500 pl-0.5">*</span></Label>
              <div className="relative">
                <Input
                  id="webhook-url"
                  placeholder="https://example.com/api/webhook"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  maxLength={2000}
                  className="pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {webhookUrl.length}/2000
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Events<span className="text-red-500 pl-0.5">*</span></h4>
              <p className="text-sm text-muted-foreground mb-2">Select events to retrieve message status update.</p>
              <div className="space-y-2">
                {(["Sent Message", "Delivered Message", "Read Message", "Failed Message"] as WebhookEvent[]).map((event) => (
                  <div key={event} className="flex items-center space-x-2">
                    <Checkbox
                      id={event}
                      checked={selectedEvents.includes(event)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedEvents([...selectedEvents, event]);
                        } else {
                          setSelectedEvents(selectedEvents.filter((e) => e !== event));
                        }
                      }}
                    />
                    <Label htmlFor={event} className="text-sm font-medium">{event}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <Button onClick={() => setShowWebhookModal(false)} variant="outline">Cancel</Button>
            <Button 
                onClick={handleCreateWebhook} 
                className="btn-outline-primary" 
                variant="outline"
                disabled={mutation.isPending}
            >
                {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Create Webhook
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeveloperSettingsSection;
