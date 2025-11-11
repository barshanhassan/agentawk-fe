
import React, { useState, useEffect } from 'react';
import { CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye, EyeOff, Copy, RefreshCw } from "react-feather";
import { useToast } from "@/hooks/use-toast";

// Function to generate a random API key
const generateApiKey = (length = 40) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0987654321';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const DeveloperSettingsSection = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

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
            <Input
              readOnly
              type={showApiKey ? "text" : "password"}
              value={apiKey}
              className="flex-1 max-w-[300px]"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => setShowApiKey(!showApiKey)}>
                    {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{showApiKey ? "Hide" : "Show"} key</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-base">Webhooks</h4>
            <p className="text-sm text-muted-foreground">Configure webhooks to receive delivery reports of your WhatsApp template messages.</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="hover-elevate h-7 text-xs [border-color:hsl(var(--input))]"
          >
            Configure
          </Button>
        </div>

      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={() => console.log("Save Developer Settings")} className="bg-blue-500 hover:bg-blue-600 text-white font-normal">
          Save
        </Button>
      </CardFooter>
    </>
  );
};

export default DeveloperSettingsSection;
