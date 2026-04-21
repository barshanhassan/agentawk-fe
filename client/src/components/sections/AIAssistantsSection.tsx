import React, { useEffect } from 'react';
import { CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface AIAssistantSettings {
  agreeToTerms: boolean;
  contentPrompts: boolean;
}

const DEFAULT_SETTINGS: AIAssistantSettings = {
  agreeToTerms: false,
  contentPrompts: false,
};

const AIAssistantsSection = () => {
  const { toast } = useToast();
  const [settings, setSettings] = React.useState<AIAssistantSettings>(DEFAULT_SETTINGS);

  const { isLoading, data: fetchedData } = useQuery<AIAssistantSettings>({
    queryKey: ["/api/workspaces/ai-assistant-settings"],
  });

  useEffect(() => {
    if (fetchedData) setSettings(fetchedData);
  }, [fetchedData]);

  const mutation = useMutation({
    mutationFn: async (data: AIAssistantSettings) => {
      const res = await apiRequest("POST", "/api/workspaces/ai-assistant-settings", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces/ai-assistant-settings"] });
      toast({ title: "Settings Saved", description: "AI Assistants settings have been updated." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleTermsChange = (checked: boolean | 'indeterminate') => {
    const isChecked = checked === true;
    setSettings(prev => ({
      ...prev,
      agreeToTerms: isChecked,
      contentPrompts: isChecked ? prev.contentPrompts : false,
    }));
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
        <CardTitle className="text-lg">AI Assistants</CardTitle>
        <p className="text-sm text-muted-foreground">These settings will be applied to the entire account.</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <Separator />
        <div>
          <div className="flex items-center justify-between gap-2">
            <div>
              <h4 className="font-semibold text-base">Content Prompts</h4>
              <p className="text-sm text-muted-foreground">
                Content prompts enables agents to use AI to rewrite and refine responses in real time during customer conversations.
              </p>
            </div>
            <Switch
              aria-label="Enable Content Prompts"
              checked={settings.contentPrompts}
              onCheckedChange={(val) => setSettings(prev => ({ ...prev, contentPrompts: val }))}
              disabled={!settings.agreeToTerms}
            />
          </div>

          <div className="flex items-start space-x-1.5 mt-2">
            <Checkbox
              id="terms"
              checked={settings.agreeToTerms}
              onCheckedChange={handleTermsChange}
            />
            <label
              htmlFor="terms"
              className="text-xs font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              By using this tool, you agree to comply with Google's{" "}
              <a href="https://ai.google.dev/gemini-api/terms" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                Gemini API Additional Terms of Service
              </a>{" "}
              and{" "}
              <a href="https://policies.google.com/terms/generative-ai/use-policy" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                Generative AI Prohibited Use Policy
              </a>
              . Please avoid sharing any sensitive information in your prompts.
            </label>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between gap-2">
          <div>
            <h4 className="font-semibold text-base">Customer Analysis</h4>
            <p className="text-sm text-muted-foreground">
              Customer analysis enables agents to use AI to understand customer conversations to generate summaries, perform sentiment analysis and more.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="btn-outline-primary h-7 text-xs"
            onClick={() => {
              toast({
                title: "Request Sent",
                description: "Your request for access has been sent.",
              });
            }}
          >
            Request access
          </Button>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Agents will have access to AI assistants in the following modules:</p>
          <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 pl-4">
            <li>Chat Manager</li>
            <li>Insights</li>
          </ul>
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

export default AIAssistantsSection;
