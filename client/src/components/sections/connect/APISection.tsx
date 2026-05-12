import React, { useState } from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plug, Copy, Eye, EyeOff, RefreshCw, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function APISection() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showKey, setShowKey] = useState(false);

  const { data: apiKeys, isLoading } = useQuery({
    queryKey: ["/api/integrations/api-keys"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/integrations/api-keys");
      return res.json();
    }
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/integrations/api-keys", { name: "Default API Key" });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/integrations/api-keys"] });
      toast({ title: "Success", description: "API Key generated successfully." });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number | string) => {
      await apiRequest("DELETE", `/api/integrations/api-keys/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/integrations/api-keys"] });
      toast({ title: "Deleted", description: "API Key removed." });
    }
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "API Key copied to clipboard." });
  };

  const currentKey = apiKeys?.[0];

  return (
    <div className="p-6 h-full flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-6">
        <div className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 rounded-lg">
          <Plug className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        </div>
        <div className="space-y-1 flex-1">
          <CardTitle className="text-lg">API</CardTitle>
          <CardDescription>Manage your API credentials</CardDescription>
        </div>
      </CardHeader>
      <Separator className="bg-gray-200 dark:bg-slate-800 mb-6" />
      
      <div className="flex-1 flex flex-col items-center justify-center border rounded-lg bg-white dark:bg-slate-900 shadow-sm">
        {currentKey ? (
          <div className="flex flex-col items-center max-w-md w-full text-center space-y-6 p-6">
            <div className="p-4 bg-green-500/10 rounded-full">
              <Plug className="w-12 h-12 text-green-600 dark:text-green-500" />
            </div>
            <div className="space-y-2 w-full">
                <h3 className="text-xl font-semibold text-foreground">Your API Key</h3>
                <p className="text-sm text-muted-foreground">
                    Use this key to authenticate your requests to the Digital Connect API.
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <div className="relative flex-1">
                    <Input 
                      type={showKey ? "text" : "password"} 
                      value={currentKey.token} 
                      readOnly 
                      className="pr-10 font-mono text-xs"
                    />
                    <button 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowKey(!showKey)}
                    >
                      {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <Button variant="outline" size="icon" onClick={() => handleCopy(currentKey.token)}>
                    <Copy size={16} />
                  </Button>
                  <Button variant="outline" size="icon" className="text-red-500 hover:text-red-600" onClick={() => deleteMutation.mutate(currentKey.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
            </div>
            <Button 
                variant="outline"
                className="btn-outline-primary"
                onClick={() => generateMutation.mutate()}
                disabled={generateMutation.isPending}
            >
                <RefreshCw size={14} className={`mr-2 ${generateMutation.isPending ? "animate-spin" : ""}`} />
                Regenerate Key
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center max-w-md text-center space-y-6">
              <Plug className="w-16 h-16 text-gray-400" />
              <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">No API Key Found</h3>
                  <p className="text-muted-foreground">
                      Generate your API key to connect with external applications.
                  </p>
              </div>
              <Button 
                className="btn-outline-primary"
                variant="outline"
                onClick={() => generateMutation.mutate()}
                disabled={generateMutation.isPending}
              >
                  {generateMutation.isPending ? "Generating..." : "Generate key"}
              </Button>
          </div>
        )}
      </div>
    </div>
  );
}
