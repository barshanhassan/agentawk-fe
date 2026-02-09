import React, { useState } from "react";
import { Instagram, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function InstagramSection() {
  const [view, setView] = useState<"list" | "preferred_manage" | "old_manage">("list");

  return (
    <div className="p-6">
      {view === "list" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Preferred Integration */}
          <div className="border rounded-lg p-6 shadow-sm bg-white dark:bg-slate-900 flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Instagram className="h-6 w-6 text-pink-500" />
                <h3 className="font-semibold text-sm">Instagram</h3>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-600 text-[10px] px-1 py-0 h-5">Preferred</Badge>
            </div>

            <div className="space-y-4 text-xs text-muted-foreground flex-grow">
              <p>
                Our Preferred integration method is the new Instagram API, which is easier to setup since it doesn't require linking a Facebook Page.
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                variant="outline"
                className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600"
                onClick={() => setView("preferred_manage")}
              >
                Manage
              </Button>
            </div>
          </div>

          {/* Card 2: Old Integration */}
          <div className="border rounded-lg p-6 shadow-sm bg-white dark:bg-slate-900 flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Instagram className="h-6 w-6 text-pink-500" />
                <h3 className="font-semibold text-sm">Instagram</h3>
              </div>
              <Badge variant="outline" className="text-gray-500 border-gray-300 text-[10px] px-1 py-0 h-5">Old</Badge>
            </div>

            <div className="space-y-4 text-xs text-muted-foreground flex-grow">
              <p>
                Users with an existing integration through the previous Instagram method will retain full management access.
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                variant="outline"
                className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600"
                onClick={() => setView("old_manage")}
              >
                Manage
              </Button>
            </div>
          </div>
        </div>
      )}

      {view === "preferred_manage" && (
        <div className="space-y-6">
          {/* Header */}
          <div className="border rounded-lg p-4 shadow-sm bg-white dark:bg-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Instagram className="h-10 w-10 text-pink-500" />
              <div>
                <h3 className="font-semibold text-lg">Instagram</h3>
                <p className="text-sm text-muted-foreground">
                  Integrate your Instagram account and unlock 2-Way interactive dynamic conversations
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setView("list")}>
              Back
            </Button>
          </div>

          {/* Content */}
          <div className="border rounded-lg p-12 shadow-sm bg-white dark:bg-slate-900 flex flex-col items-center justify-center text-center space-y-4 py-24">
            <div className="bg-gradient-to-tr from-pink-50 to-pink-100 dark:from-slate-800 dark:to-slate-700 p-4 rounded-full">
              <Instagram className="h-12 w-12 text-pink-500" />
            </div>
            <h2 className="text-lg font-semibold">Instagram account is not connected yet</h2>
             <p className="text-muted-foreground max-w-md">
              Integrate this communication channel to automate conversations.
            </p>
            <div className="pt-2">
              <Button className="bg-blue-600 text-white hover:bg-blue-700 min-w-[150px]">
                Connect now
              </Button>
            </div>
          </div>
        </div>
      )}

      {view === "old_manage" && (
        <div className="space-y-6">
          {/* Header */}
          <div className="border rounded-lg p-4 shadow-sm bg-white dark:bg-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Instagram className="h-10 w-10 text-pink-500" />
              <div>
                <h3 className="font-semibold text-lg">Instagram</h3>
                <p className="text-sm text-muted-foreground">
                  Integrate your Instagram account and unlock 2-Way interactive dynamic conversations
                </p>
              </div>
            </div>
             <Button variant="outline" onClick={() => setView("list")}>
              Back
            </Button>
          </div>

          {/* Content */}
          <div className="border rounded-lg p-12 shadow-sm bg-white dark:bg-slate-900 flex flex-col items-center justify-center text-center space-y-4 py-24">
             <div className="bg-gradient-to-tr from-pink-50 to-pink-100 dark:from-slate-800 dark:to-slate-700 p-4 rounded-full">
              <Instagram className="h-12 w-12 text-pink-500" />
            </div>
            <h2 className="text-lg font-semibold">Instagram account is not connected yet</h2>
            <p className="text-muted-foreground max-w-lg">
              This integration method is no longer supported. Please use the new Instagram integration method that only requires Instagram Login for authentication.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
