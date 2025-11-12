
import React, { useState } from 'react';
import { CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const AIAssistantsSection = () => {
  const { toast } = useToast();
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [contentPrompts, setContentPrompts] = useState(false);

  const handleTermsChange = (checked: boolean | 'indeterminate') => {
    const isChecked = checked === true;
    setAgreeToTerms(isChecked);
    if (!isChecked) {
      setContentPrompts(false);
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-lg">AI Assistants</CardTitle>
        <p className="text-sm text-muted-foreground">These settings will be applied to the entire account.</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <Separator />
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-base">Content Prompts</h4>
              <p className="text-sm text-muted-foreground">Content prompts enables agents to use AI to rewrite and refine responses in real time during customer conversations.</p>
            </div>
            <Switch
              aria-label="Enable Content Prompts"
              checked={contentPrompts}
              onCheckedChange={setContentPrompts}
              disabled={!agreeToTerms}
            />
          </div>

          <div className="flex items-start space-x-1.5 mt-2">
            <Checkbox id="terms" checked={agreeToTerms} onCheckedChange={handleTermsChange} />
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

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-base">Customer Analysis</h4>
            <p className="text-sm text-muted-foreground">Customer analysis enables agents to use AI to understand customer conversations to generate summaries, perform sentiment analysis and more.</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="hover-elevate h-7 text-xs [border-color:hsl(var(--input))]"
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
          onClick={() => {
            console.log("Save AI Assistants Settings");
            toast({
              title: "Settings Saved",
              description: "AI Assistants settings have been updated.",
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

export default AIAssistantsSection;
