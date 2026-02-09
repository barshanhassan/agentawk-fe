import React from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plug } from "lucide-react";

export default function APISection() {
  return (
    <div className="p-6 h-full flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-6">
        <div className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 rounded-lg">
          <Plug className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        </div>
        <div className="space-y-1 flex-1">
          <CardTitle className="text-lg">API</CardTitle>
          <CardDescription>Manage your API credential</CardDescription>
        </div>
      </CardHeader>
      <Separator className="bg-gray-200 dark:bg-slate-800 mb-6" />
      
      <div className="flex-1 flex flex-col items-center justify-center border rounded-lg bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex flex-col items-center max-w-md text-center space-y-6">
            <Plug className="w-16 h-16 text-green-600 dark:text-green-500" />
            <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">API key</h3>
                <p className="text-muted-foreground">
                    Generate your API key to connect with external application
                </p>
            </div>
            <button className="px-6 py-2 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-md text-sm font-medium transition-colors">
                Generate key
            </button>
        </div>
      </div>
    </div>
  );
}
