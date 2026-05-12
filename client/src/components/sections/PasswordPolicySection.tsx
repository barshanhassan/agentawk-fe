import React, { useEffect } from 'react';
import { CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

interface PasswordPolicySettings {
  policyEnabled: boolean;
  policyName: string;
  expirationDays: number;
  reuseCount: number;
  lockoutThreshold: number;
}

const DEFAULT_SETTINGS: PasswordPolicySettings = {
  policyEnabled: false,
  policyName: '',
  expirationDays: 90,
  reuseCount: 5,
  lockoutThreshold: 5,
};

const PasswordPolicySection = () => {
  const { toast } = useToast();
  const [settings, setSettings] = React.useState<PasswordPolicySettings>(DEFAULT_SETTINGS);

  const { isLoading, data: fetchedData } = useQuery<PasswordPolicySettings>({
    queryKey: ["/api/workspaces/password-policy"],
  });

  useEffect(() => {
    if (fetchedData) setSettings(fetchedData);
  }, [fetchedData]);

  const mutation = useMutation({
    mutationFn: async (data: PasswordPolicySettings) => {
      const res = await apiRequest("POST", "/api/workspaces/password-policy", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces/password-policy"] });
      toast({ title: "Settings Saved", description: "Password policy settings have been updated." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

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
        <CardTitle className="text-lg">Password Policy</CardTitle>
        <p className="text-sm text-muted-foreground">Configure password policy settings for your user accounts here.</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <Separator />

        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium">Enable Password Policy</p>
          <Switch
            checked={settings.policyEnabled}
            onCheckedChange={(val) => setSettings(prev => ({ ...prev, policyEnabled: val }))}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="policy-name" className="text-sm font-semibold">Policy Name</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info size={16} className="text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Provide a unique name to your password policy.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="policy-name"
            value={settings.policyName}
            onChange={(e) => setSettings(prev => ({ ...prev, policyName: e.target.value }))}
            disabled={!settings.policyEnabled}
            placeholder="e.g. Corporate Standard Policy"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="expiration-days" className="text-sm font-semibold">Password Expiration Period (Days)</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info size={16} className="text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Configure user passwords to expire after a certain number of days. By default, passwords are set to expire after 90 days for your organization.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="expiration-days"
            type="number"
            value={settings.expirationDays}
            onChange={(e) => setSettings(prev => ({ ...prev, expirationDays: Number(e.target.value) }))}
            min="1"
            disabled={!settings.policyEnabled}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="reuse-count" className="text-sm font-semibold">Password Reuse Count</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info size={16} className="text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Configure the number of times a previous password can be reused before it is no longer accepted.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="reuse-count"
            type="number"
            value={settings.reuseCount}
            onChange={(e) => setSettings(prev => ({ ...prev, reuseCount: Number(e.target.value) }))}
            min="0"
            disabled={!settings.policyEnabled}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="lockout-threshold" className="text-sm font-semibold">Account Lockout Threshold</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info size={16} className="text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Configure the number of unsuccessful login attempts allowed before the lockout occurs.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="lockout-threshold"
            type="number"
            value={settings.lockoutThreshold}
            onChange={(e) => setSettings(prev => ({ ...prev, lockoutThreshold: Number(e.target.value) }))}
            min="1"
            disabled={!settings.policyEnabled}
          />
        </div>

      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          onClick={() => mutation.mutate(settings)}
          disabled={mutation.isPending}
          className="btn-outline-primary font-normal flex items-center gap-2"
          variant="outline"
        >
          {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          Save
        </Button>
      </CardFooter>
    </>
  );
};

export default PasswordPolicySection;
