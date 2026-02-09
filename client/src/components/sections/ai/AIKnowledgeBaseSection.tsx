import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Book } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AIKnowledgeBaseSection() {
  const [creating, setCreating] = useState(false);

  return (
    <>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <Book className="w-8 h-8 text-blue-600" />
        <div className="space-y-1">
          <CardTitle className="text-lg">Knowledge Base</CardTitle>
          <CardDescription>OpenAI Knowledgebases</CardDescription>
        </div>
        <div className="ml-auto">
          <Button variant="outline" className="px-3 btn-outline-primary" onClick={() => setCreating(!creating)}>
            {creating ? "Close" : "Create new"}
          </Button>
        </div>
      </CardHeader>

      <Separator className="bg-gray-200 dark:bg-slate-800" />

      <CardContent className="space-y-6 pt-6">
        <div className="mt-6 pt-8 flex flex-col items-center justify-center min-h-[220px]">
          <div className="bg-emerald-50 p-4 rounded-full">
            <Book className="h-10 w-10 text-emerald-600" />
          </div>
          <h4 className="mt-4 font-semibold text-lg">Create a Knowledge base</h4>
          <p className="text-sm text-muted-foreground mt-2">Create a Knowledge Base for your AI Agents</p>
          <Button className="mt-4 btn-outline-primary" variant="outline" onClick={() => setCreating(true)}>
            Create new
          </Button>
        </div>
      </CardContent>
    </>
  );
}
