import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Copy, Edit2, Trash2, ExternalLink } from "lucide-react";

const instances = [{ id: 1, name: "TestTiagoStage" }];

export default function WebchatSection() {
  const [view, setView] = useState<"list" | "manage">("list");
  const [hasInstances, setHasInstances] = useState(true);

  return (
    <div className="p-6">
      {view === "list" && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Webchat</h2>
            <p className="text-sm text-muted-foreground">
              Create a Webchat interface for your website.
            </p>
          </div>
          <Separator className="bg-gray-200 dark:bg-slate-800" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6 shadow-sm bg-white dark:bg-slate-900 flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <img src="/images/automations/webchat.svg" alt="Webchat" className="h-6 w-6" />
                <h3 className="font-semibold text-sm">Webchat</h3>
              </div>
            </div>

            <div className="space-y-4 text-xs text-muted-foreground flex-grow">
              <p>
                Create a Webchat interface that allows visitors to communicate with your business in real-time.
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                variant="outline"
                className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600"
                onClick={() => setView("manage")}
              >
                Manage
              </Button>
            </div>
          </div>
        </div>
        </div>
      )}

      {view === "manage" && (
        <div className="space-y-6">
          <div className="border rounded-lg shadow-sm bg-white dark:bg-slate-900">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/images/automations/webchat.svg" alt="Webchat" className="h-10 w-10 mr-2" />
                <div>
                  <h3 className="text-lg font-medium">Webchat</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Create a Webchat interface that allows visitors to communicate with your business in real-time directly from a website.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                 <Button 
                  variant="outline" 
                  className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600"
                  onClick={() => setHasInstances(true)}
                >
                  Add new
                </Button>
                <Button variant="outline" onClick={() => setView("list")}>
                  Back
                </Button>
              </div>
            </div>
            <Separator className="bg-gray-200 dark:bg-slate-800" />

            <div className="p-4">
              {!hasInstances ? (
                 <div className="p-12 flex flex-col items-center justify-center text-center space-y-4 py-24">
                  <div className="bg-gradient-to-tr from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-700 p-4 rounded-full">
                    <img src="/images/automations/webchat.svg" alt="Webchat" className="h-12 w-12" />
                  </div>
                  <h2 className="text-lg font-semibold">No webchat instances found</h2>
                  <p className="text-muted-foreground max-w-md text-sm">
                    Create a webchat widget to get started.
                  </p>
                  <div className="pt-2">
                    <Button 
                      className="bg-blue-600 text-white hover:bg-blue-700 min-w-[150px]"
                      onClick={() => setHasInstances(true)}
                    >
                      Create now
                    </Button>
                  </div>
                </div>
              ) : (
                <ul>
                  {instances.map((inst) => (
                    <li key={inst.id} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md border mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-md flex items-center justify-center font-medium">{inst.name.charAt(0)}</div>
                        <div>
                          <div className="text-sm font-medium">{inst.name}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-600">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-600">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-600">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
