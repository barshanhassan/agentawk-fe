
import React, { useState } from 'react';
import { CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const AgentChatsSection = () => {
  const { toast } = useToast();
  const [autoAssign, setAutoAssign] = useState(false);
  const [agentStatus, setAgentStatus] = useState(false);
  const [autoAssignCapacity, setAutoAssignCapacity] = useState(false);
  const [capacity, setCapacity] = useState(5);

  return (
    <>
      <CardHeader>
        <CardTitle className="text-lg">Agent Chats</CardTitle>
        <p className="text-sm text-muted-foreground">Configure how agents are assigned.</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <Separator />

        <div className="flex items-center justify-between gap-2">
          <div>
            <h4 className="font-semibold text-base">Auto Assign Conversations</h4>
            <p className="text-sm text-muted-foreground">Assign conversations to your agents automatically using round-robin mechanism.</p>
          </div>
          <Switch
            aria-label="Toggle Auto Assign Conversations"
            checked={autoAssign}
            onCheckedChange={setAutoAssign}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between gap-2">
          <div>
            <h4 className="font-semibold text-base">Agent Status</h4>
            <p className="text-sm text-muted-foreground">Enable or disable agents to set status as available/away.</p>
          </div>
          <Switch
            aria-label="Toggle Agent Status"
            checked={agentStatus}
            onCheckedChange={setAgentStatus}
          />
        </div>

        <Separator />

        <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
                <div>
                    <h4 className="font-semibold text-base">Auto-Assign Capacity</h4>
                    <p className="text-sm text-muted-foreground">Set the default number of maximum conversations an agent can have at a time. New conversations stay unassigned if an agent reach their limit until an agent becomes available.</p>
                </div>
                <Switch
                    aria-label="Toggle Auto-Assign Capacity"
                    checked={autoAssignCapacity}
                    onCheckedChange={setAutoAssignCapacity}
                />
            </div>
            {autoAssignCapacity && (
              <div>
                  <Label htmlFor="capacity-input" className="text-sm font-medium">Maximum Conversations</Label>
                  <Input
                      id="capacity-input"
                      type="number"
                      value={capacity}
                      onChange={(e) => setCapacity(Number(e.target.value))}
                      className="mt-1.5 w-20"
                      min="1"
                  />
              </div>
            )}
        </div>

      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          onClick={() => {
            console.log("Save Agent Chats Settings");
            toast({
              title: "Settings Saved",
              description: "Agent chat settings have been updated.",
            });
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white font-normal"
        >
          Save
        </Button>
      </CardFooter>
    </>
  );
};

export default AgentChatsSection;
