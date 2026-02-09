import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

export default function AIChatAssistant() {
  const [creating, setCreating] = useState(false);
  const totalActive = 0;
  const limit = 15;

  return (
    <div className="p-6">
      <div className="border rounded-lg shadow-sm bg-white dark:bg-slate-900 p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-md">
              <Bot className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">AI Chat Assistants</h3>
              <p className="text-sm text-muted-foreground">Feed your assistant with custom data.</p>
            </div>
          </div>

          <div className="text-sm text-muted-foreground flex items-center gap-4">
            <span>Total Active : {totalActive}</span>
            <span>Limit : {limit}</span>
            <Button variant="outline" onClick={() => setCreating(!creating)}>
              {creating ? "Close" : "Create new"}
            </Button>
          </div>
        </div>

        <div className="mt-6 border-t pt-8 flex flex-col items-center justify-center min-h-[220px]">
          <div className="bg-emerald-50 p-4 rounded-full">
            <Bot className="h-10 w-10 text-emerald-600" />
          </div>
          <h4 className="mt-4 font-semibold text-lg">Create an AI Chat Assistant</h4>
          <p className="text-sm text-muted-foreground mt-2">Feed the AI Chat Assistant with custom data.</p>
          <Button className="mt-4" onClick={() => setCreating(true)}>
            Create new
          </Button>
        </div>
      </div>
    </div>
  );
}
