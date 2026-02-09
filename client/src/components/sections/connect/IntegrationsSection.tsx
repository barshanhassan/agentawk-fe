import React from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plug } from "lucide-react";

export default function IntegrationsSection() {
  return (
    <div className="p-6 h-full flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-6">
        <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
          <Plug className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="space-y-1 flex-1">
          <CardTitle className="text-lg">Integrations</CardTitle>
          <CardDescription>Manage your integrations</CardDescription>
        </div>
      </CardHeader>
      <Separator className="bg-gray-200 dark:bg-slate-800 mb-6" />
      <div className="flex-1 flex flex-col items-center justify-center border rounded-lg bg-white dark:bg-slate-900 border-dashed border-slate-300 dark:border-slate-700">
          <p className="text-muted-foreground">Content coming soon...</p>
      </div>
    </div>
  );
}
