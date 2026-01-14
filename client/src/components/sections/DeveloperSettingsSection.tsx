
import React, { useState, useEffect } from 'react';
import { CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye, EyeOff, Copy, RefreshCw, Trash2 } from "react-feather"; // Added Trash2
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // Added Dialog components
import { Checkbox } from "@/components/ui/checkbox"; // Added Checkbox
import { Label } from "@/components/ui/label"; // Added Label

// Function to generate a random API key
const generateApiKey = (length = 40) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0987654321';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

type WebhookEvent = "Sent Message" | "Delivered Message" | "Read Message" | "Failed Message";

interface Webhook {
  id: string;
  url: string;
  events: WebhookEvent[];
}

const DeveloperSettingsSection = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false); // State for webhook modal
  const [webhookUrl, setWebhookUrl] = useState(''); // State for webhook URL input
  const [selectedEvents, setSelectedEvents] = useState<WebhookEvent[]>([]); // State for selected events
  const [webhooks, setWebhooks] = useState<Webhook[]>([]); // State for configured webhooks

  useEffect(() => {
    setApiKey(generateApiKey());
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    toast({
      title: "Copied to clipboard",
      description: "The API Key has been copied to your clipboard.",
    });
  };

  const handleRegenerate = () => {
    setApiKey(generateApiKey());
    toast({
      title: "API Key Regenerated",
      description: "A new API Key has been generated.",
    });
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
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newWebhook: Webhook = {
      id: `webhook-${Date.now()}`, // Simple unique ID
      url: webhookUrl,
      events: selectedEvents,
    };

    setWebhooks([...webhooks, newWebhook]);
    toast({
      title: "Webhook Created",
      description: "Your webhook has been successfully configured.",
    });
    setWebhookUrl('');
    setSelectedEvents([]);
    setShowWebhookModal(false);
  };

  const handleDeleteWebhook = (id: string) => {
    setWebhooks(webhooks.filter(webhook => webhook.id !== id));
    toast({
      title: "Webhook Deleted",
      description: "The webhook has been successfully deleted.",
    });
  };

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
            Use our <span className="text-blue-500">API Documentation</span> to start understanding our API capabilities.
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
                value={apiKey}
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
                  <Button variant="ghost" size="icon" onClick={handleRegenerate}>
                    <RefreshCw size={16} />
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

        {webhooks.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-base">Configured Webhooks</h4>
            <div className="border rounded-md p-4 space-y-3 max-h-[20rem] overflow-y-auto">
              {webhooks.map((webhook) => (
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
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          onClick={() => {
            console.log("Save Developer Settings");
            toast({
              title: "Settings Saved",
              description: "Developer settings have been updated.",
            });
          }}
          className="btn-outline-primary font-normal"
          variant="outline"
        >
          Save
        </Button>
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
                  onChange={(e) => {
                    setWebhookUrl(e.target.value);
                  }}
                  maxLength={2000}
                  className={`pr-12`}
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
                {["Sent Message", "Delivered Message", "Read Message", "Failed Message"].map((event) => (
                  <div key={event} className="flex items-center space-x-2">
                    <Checkbox
                      id={event}
                      checked={selectedEvents.includes(event as WebhookEvent)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedEvents([...selectedEvents, event as WebhookEvent]);
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
            <Button onClick={() => setShowWebhookModal(false)} variant="outline" className="border-input [border-color:hsl(var(--input))] font-normal">Cancel</Button>
            <Button onClick={handleCreateWebhook} className="btn-outline-primary font-normal" variant="outline">Create Webhook</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeveloperSettingsSection;
