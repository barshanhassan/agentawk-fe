
import React, { useState } from 'react';
import { CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const BotToAgentSection = () => {
  const { toast } = useToast();
  const [messageEnabled, setMessageEnabled] = useState(false);
  const [messageContent, setMessageContent] = useState('');

  return (
    <>
      <CardHeader>
        <CardTitle className="text-lg">Bot to Agent</CardTitle>
        <p className="text-sm text-muted-foreground">Set your bot-to-agent message here. This message is automatically sent to customers transferred from bot to agents.</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <Separator />

        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Enable bot-to-agent message</p>
          <Switch
            checked={messageEnabled}
            onCheckedChange={setMessageEnabled}
          />
        </div>

        <Textarea
          placeholder="Enter message here"
          rows={4}
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          disabled={!messageEnabled} // Disable textarea if message is not enabled
        />

      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          onClick={() => {
            console.log("Save Bot to Agent Settings");
            toast({
              title: "Settings Saved",
              description: "Bot to Agent settings have been updated.",
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

export default BotToAgentSection;
