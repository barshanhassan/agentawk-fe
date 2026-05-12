import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Copy, Edit2, Trash2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function WebchatSection() {
  const [view, setView] = useState<"list" | "manage">("list");
  const queryClient = useQueryClient();
  
  const { data: channels, isLoading } = useQuery({
    queryKey: ["/api/integrations/channels"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/integrations/channels");
      return res.json();
    }
  });

  const webchatInstances = channels?.webchat || [];
  const hasInstances = webchatInstances.length > 0;

  const deleteMutation = useMutation({
    mutationFn: async (id: number | string) => {
      await apiRequest("DELETE", `/api/integrations/channels/webchat/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/integrations/channels"] });
      toast({
        title: "Deleted",
        description: "Webchat instance removed successfully.",
      });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete instance.", variant: "destructive" });
    }
  });

  const handleConnect = () => {
    toast({
      title: "Connecting...",
      description: "Starting Webchat setup flow.",
    });
  };

  const { toast } = useToast();

  const handleExternalLink = (name: string) => {
    toast({
      title: "Opening",
      description: `Opening ${name} in a new tab...`,
    });
  };

  const handleCopy = (name: string) => {
    navigator.clipboard.writeText(`https://webchat.example.com/${name}`);
    toast({
      title: "Copied",
      description: "Webchat widget code copied to clipboard.",
    });
  };

  const handleEdit = (name: string) => {
    toast({
      title: "Edit",
      description: `Opening editor for ${name}...`,
    });
  };

  const handleDelete = (id: number | string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-6">
      {view === "list" && (
        <div className="space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Webchat</h2>
              <img src="/images/automations/webchat.svg" alt="Webchat" className="h-5 w-5" />
            </div>
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
                className="btn-outline-primary"
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
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">Webchat</h3>
                    <img src="/images/automations/webchat.svg" alt="Webchat" className="h-6 w-6" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Create a Webchat interface that allows visitors to communicate with your business in real-time directly from a website.
                  </p>
                </div>
              </div>

                  <Button 
                    variant="outline" 
                    className="btn-outline-primary"
                    onClick={handleConnect}
                  >
                    + Add New
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
                      className="btn-outline-primary min-w-[150px]"
                      variant="outline"
                      onClick={handleConnect}
                    >
                      + Create Now
                    </Button>
                  </div>
                </div>
              ) : (
                <ul>
                  {webchatInstances.map((inst: { id: number; name: string }) => (
                    <li key={inst.id} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md border mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-md flex items-center justify-center font-medium">{inst.name.charAt(0)}</div>
                        <div>
                          <div className="text-sm font-medium">{inst.name}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 hover:text-blue-600"
                          onClick={() => handleExternalLink(inst.name)}
                          title="View live"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 hover:text-blue-600"
                          onClick={() => handleCopy(inst.name)}
                          title="Copy snippet"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 hover:text-blue-600"
                          onClick={() => handleEdit(inst.name)}
                          title="Edit settings"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 btn-soft-destructive transition-all hover:scale-110 active:scale-90"
                          onClick={() => handleDelete(inst.id, inst.name)}
                          title="Delete instance"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
      )}
    </div>
  );
}
