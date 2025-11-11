
import React, { useState } from 'react';
import { CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "react-feather";

const PasswordPolicySection = () => {
  const [policyEnabled, setPolicyEnabled] = useState(false); // New state for the toggle switch
  const [policyName, setPolicyName] = useState('');
  const [expirationDays, setExpirationDays] = useState(90);
  const [reuseCount, setReuseCount] = useState(5);
  const [lockoutThreshold, setLockoutThreshold] = useState(5);

  return (
    <>
      <CardHeader>
        <CardTitle className="text-lg">Password Policy</CardTitle>
        <p className="text-sm text-muted-foreground">Configure password policy settings for your user accounts here.</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <Separator />

        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Enable Password Policy</p>
          <Switch
            checked={policyEnabled}
            onCheckedChange={setPolicyEnabled}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="policy-name" className="text-sm font-semibold">Policy Name</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info size={16} className="text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Provide a unique name to your password policy.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="policy-name"
            value={policyName}
            onChange={(e) => setPolicyName(e.target.value)}
            disabled={!policyEnabled}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="expiration-days" className="text-sm font-semibold">Password Expiration Period (Days)</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info size={16} className="text-muted-foreground" />
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
            value={expirationDays}
            onChange={(e) => setExpirationDays(Number(e.target.value))}
            min="1"
            disabled={!policyEnabled}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="reuse-count" className="text-sm font-semibold">Password Reuse Count</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info size={16} className="text-muted-foreground" />
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
            value={reuseCount}
            onChange={(e) => setReuseCount(Number(e.target.value))}
            min="0"
            disabled={!policyEnabled}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="lockout-threshold" className="text-sm font-semibold">Account Lockout Threshold</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info size={16} className="text-muted-foreground" />
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
            value={lockoutThreshold}
            onChange={(e) => setLockoutThreshold(Number(e.target.value))}
            min="1"
            disabled={!policyEnabled}
          />
        </div>

      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={() => console.log("Save Password Policy Settings")} className="bg-blue-500 hover:bg-blue-600 text-white font-normal">
          Save
        </Button>
      </CardFooter>
    </>
  );
};

export default PasswordPolicySection;
