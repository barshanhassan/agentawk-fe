import React, { useState } from "react";
import { 
  Network, 
  Plus, 
  MoreVertical, 
  Trash2, 
  Eye, 
  EyeOff,
  RefreshCcw, 
  Settings, 
  ChevronLeft,
  Copy
} from "lucide-react";
import { format } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function VisualAPISection() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"LIST" | "MANAGE" | "LOGS">("LIST");
  const [activeTrigger, setActiveTrigger] = useState<any | null>(null);
  
  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<any | null>(null);
  const [newTriggerName, setNewTriggerName] = useState("");

  const { data: triggers, isLoading } = useQuery({
    queryKey: ["/api/integrations/api-triggers"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/integrations/api-triggers");
      return res.json();
    }
  });

  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await apiRequest("POST", "/api/integrations/api-triggers", { name });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/integrations/api-triggers"] });
      toast({ title: "Created", description: "API Trigger created successfully." });
      setIsCreateModalOpen(false);
      setNewTriggerName("");
      setActiveTrigger(data);
      setViewMode("MANAGE");
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("PATCH", `/api/integrations/api-triggers/${data.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/integrations/api-triggers"] });
      toast({ title: "Updated", description: "Trigger settings saved." });
      setViewMode("LIST");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number | string) => {
      await apiRequest("DELETE", `/api/integrations/api-triggers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/integrations/api-triggers"] });
      toast({ title: "Deleted", description: "Trigger removed successfully." });
      setDeleteConfirmation(null);
    }
  });

  const handleCreateTrigger = () => {
    if (!newTriggerName.trim()) return;
    createMutation.mutate(newTriggerName);
  };

  const handleDeleteTrigger = () => {
    if (deleteConfirmation) {
      deleteMutation.mutate(deleteConfirmation.id);
    }
  };

  const handleManage = (trigger: any) => {
    setActiveTrigger(trigger);
    setViewMode("MANAGE");
  };

  const handleLogs = (trigger: any) => {
    setActiveTrigger(trigger);
    setViewMode("LOGS");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "URL copied to clipboard." });
  };

  const getWebhookUrl = (slug: string) => {
    return `${window.location.origin}/v1/api-trigger/${slug}`;
  };

  // Views
  const renderListView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20 rounded-lg">
            <Network className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium">Visual API Triggers</h3>
            <p className="text-sm text-muted-foreground">Configure triggers to start visual workflows from external API calls.</p>
          </div>
        </div>
        <Button 
          variant="outline"
          onClick={() => setIsCreateModalOpen(true)} 
          className="gap-2 btn-outline-primary"
        >
          <Plus size={16} />
          Add Trigger
        </Button>
      </div>

      <Separator />

      {triggers && triggers.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {triggers.map((trigger: any) => (
                <TableRow key={trigger.id}>
                  <TableCell className="font-medium">{trigger.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="truncate max-w-[300px]">{getWebhookUrl(trigger.slug)}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(getWebhookUrl(trigger.slug))}>
                        <Copy size={12} />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    {trigger.live ? (
                      <Badge className="bg-green-500 hover:bg-green-600">Live Mode</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-200">Test Mode</Badge>
                    )}
                  </TableCell>
                  <TableCell>{format(new Date(trigger.created_at), "PP p")}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleManage(trigger)}>
                          <Settings className="mr-2 h-4 w-4" /> Manage
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleLogs(trigger)}>
                          <RefreshCcw className="mr-2 h-4 w-4" /> View Logs
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => setDeleteConfirmation(trigger)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 border rounded-lg border-dashed bg-slate-50 dark:bg-slate-900/50">
          <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-4">
            <Network className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No Triggers Found</h3>
          <p className="text-muted-foreground mb-6 text-center max-w-sm">
            Create your first API trigger to start automating your visual workflows using external webhooks.
          </p>
          <Button 
            variant="outline"
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-outline-primary"
          >
            <Plus size={16} className="mr-2" />
            Add Trigger
          </Button>
        </div>
      )}
    </div>
  );

  const renderManageView = () => {
    if (!activeTrigger) return null;
    return (
      <div className="space-y-6 h-full flex flex-col">
        <div className="flex justify-between items-center pb-6 border-b">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setViewMode("LIST")}>
              <ChevronLeft size={20} />
            </Button>
            <div>
              <h3 className="text-lg font-medium">Manage Trigger</h3>
              <p className="text-sm text-muted-foreground">{activeTrigger.name}</p>
            </div>
          </div>
          <div className="flex gap-2">
             <Button variant="outline" onClick={() => setViewMode("LIST")}>
              Cancel
            </Button>
            <Button 
              variant="outline" 
              className="btn-outline-primary h-9 px-6 font-medium"
              onClick={() => updateMutation.mutate(activeTrigger)}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-8 pr-4">
          {/* General Settings */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider">General Settings</h4>
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="grid gap-2">
                  <Label>Trigger URL</Label>
                  <div className="flex gap-2">
                    <Input readOnly value={getWebhookUrl(activeTrigger.slug)} className="bg-muted font-mono text-sm" />
                    <Button variant="outline" onClick={() => copyToClipboard(getWebhookUrl(activeTrigger.slug))}>
                      <Copy size={14} className="mr-2" /> Copy
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Make a POST request to this URL to trigger the workflow.</p>
                </div>

                 <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50 dark:bg-slate-900/50">
                  <div className="space-y-0.5">
                    <Label className="text-base">Live Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle between Test and Live modes.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${!activeTrigger.live ? "font-semibold text-yellow-600" : "text-muted-foreground"}`}>Test</span>
                    <Switch 
                      checked={activeTrigger.live} 
                      onCheckedChange={(checked) => setActiveTrigger({...activeTrigger, live: checked})}
                    />
                    <span className={`text-sm ${activeTrigger.live ? "font-semibold text-green-600" : "text-muted-foreground"}`}>Live</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mapping (Simplified for UI parity) */}
          <div className="space-y-4">
             <h4 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider">Field Mapping</h4>
             <Card>
               <CardContent className="p-6">
                 <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-4 rounded-md mb-6 flex gap-3 text-sm">
                   <div className="mt-0.5"><Settings size={16} /></div>
                   <div>
                     <p className="font-medium">Mapping Configuration</p>
                     <p>Map fields from your API payload to system variables. Currently showing standard fields.</p>
                   </div>
                 </div>

                 <div className="space-y-6">
                    {/* Placeholder for mapping fields */}
                    <div className="grid grid-cols-2 gap-4 items-center pb-4 border-b last:border-0 last:pb-0">
                       <div className="font-medium text-sm">First Name <span className="text-red-500">*</span></div>
                       <div className="flex gap-2">
                         <Input placeholder="Prefix" className="w-20" />
                         <div className="flex-1 flex items-center px-3 border rounded-md bg-muted text-muted-foreground text-sm cursor-not-allowed">
                           first_name
                         </div>
                         <Input placeholder="Postfix" className="w-20" />
                       </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4 items-center pb-4 border-b last:border-0 last:pb-0">
                       <div className="font-medium text-sm">Last Name</div>
                       <div className="flex gap-2">
                         <Input placeholder="Prefix" className="w-20" />
                         <div className="flex-1 flex items-center px-3 border rounded-md bg-white dark:bg-slate-950 text-sm cursor-pointer hover:bg-slate-50">
                           Select payload key...
                         </div>
                         <Input placeholder="Postfix" className="w-20" />
                       </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4 items-center pb-4 border-b last:border-0 last:pb-0">
                       <div className="font-medium text-sm">Email</div>
                       <div className="flex gap-2">
                         <Input placeholder="Prefix" className="w-20" />
                         <div className="flex-1 flex items-center px-3 border rounded-md bg-white dark:bg-slate-950 text-sm cursor-pointer hover:bg-slate-50">
                           Select payload key...
                         </div>
                         <Input placeholder="Postfix" className="w-20" />
                       </div>
                    </div>
                 </div>
               </CardContent>
             </Card>
          </div>

          {/* Duplicate Strategy */}
          <div className="space-y-4">
             <h4 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider">Duplicate Handling</h4>
             <Card>
               <CardContent className="p-6 space-y-4">
                 <div className="flex items-start gap-3">
                   <input type="radio" id="update_dup" name="msg_dup" className="mt-1" checked={activeTrigger.update_duplicates} onChange={() => setActiveTrigger({...activeTrigger, update_duplicates: true})} />
                   <label htmlFor="update_dup" className="text-sm">
                     <span className="font-semibold block text-foreground">Update duplicates</span>
                     <span className="text-muted-foreground">If a record exists, update its information with the new payload.</span>
                   </label>
                 </div>
                 <div className="flex items-start gap-3">
                   <input type="radio" id="skip_dup" name="msg_dup" className="mt-1" checked={!activeTrigger.update_duplicates} onChange={() => setActiveTrigger({...activeTrigger, update_duplicates: false})} />
                   <label htmlFor="skip_dup" className="text-sm">
                     <span className="font-semibold block text-foreground">Skip duplicates</span>
                     <span className="text-muted-foreground">If a record exists, ignore this request.</span>
                   </label>
                 </div>
               </CardContent>
             </Card>
          </div>
        </div>
      </div>
    );
  };

  const { data: logs, refetch: refetchLogs } = useQuery({
    queryKey: ["/api/integrations/api-triggers", activeTrigger?.id, "logs"],
    queryFn: async () => {
      if (!activeTrigger) return [];
      const res = await apiRequest("GET", `/api/integrations/api-triggers/${activeTrigger.id}/logs`);
      return res.json();
    },
    enabled: !!activeTrigger && viewMode === "LOGS"
  });

  const renderLogsView = () => {
     if (!activeTrigger) return null;
     return (
       <div className="space-y-6">
         <div className="flex justify-between items-center pb-6 border-b">
           <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" onClick={() => setViewMode("LIST")}>
               <ChevronLeft size={20} />
             </Button>
             <div>
               <h3 className="text-lg font-medium">Trigger Logs</h3>
               <p className="text-sm text-muted-foreground">Displaying recent execution logs for {activeTrigger.name}</p>
             </div>
           </div>
           <Button variant="outline" size="sm" onClick={() => refetchLogs()}>
             <RefreshCcw size={14} className="mr-2" /> Refresh
           </Button>
         </div>

         <div className="border rounded-md">
           <Table>
             <TableHeader>
               <TableRow>
                 <TableHead>Time</TableHead>
                 <TableHead>Status</TableHead>
                 <TableHead>Error Code</TableHead>
                 <TableHead>Details</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {logs && logs.length > 0 ? logs.map((log: any) => (
                 <TableRow key={log.id}>
                   <TableCell className="font-mono text-xs">{format(new Date(log.created_at), "PP p")}</TableCell>
                   <TableCell>
                      {log.status === "SUCCESS" || log.status === "processed" ? (
                        <Badge className="bg-green-500">Success</Badge>
                      ) : (
                        <Badge variant="destructive">Failed</Badge>
                      )}
                   </TableCell>
                   <TableCell className="font-mono text-xs">{log.error_code || "-"}</TableCell>
                   <TableCell className="text-sm text-muted-foreground">{log.error || "Request processed successfully"}</TableCell>
                 </TableRow>
               )) : (
                 <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No logs found for this trigger.
                    </TableCell>
                 </TableRow>
               )}
             </TableBody>
           </Table>
         </div>
       </div>
     );
  };

  return (
    <div className="p-6 h-full flex flex-col bg-gray-50/50 dark:bg-slate-950/50">
      <Card className="flex-1 border-0 shadow-none bg-transparent">
        <CardContent className="p-0 h-full">
           {viewMode === "LIST" && renderListView()}
           {viewMode === "MANAGE" && renderManageView()}
           {viewMode === "LOGS" && renderLogsView()}
        </CardContent>
      </Card>

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Trigger</DialogTitle>
            <DialogDescription>
              Enter a name for your new API trigger. This will generate a unique webhook URL.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>Trigger Name</Label>
            <Input 
              placeholder="e.g. Lead Form Submission" 
              value={newTriggerName}
              onChange={(e) => setNewTriggerName(e.target.value)}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button variant="outline" className="btn-outline-primary h-9 px-6 font-medium" onClick={handleCreateTrigger} disabled={!newTriggerName.trim()}>Add Trigger</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirmation} onOpenChange={(open) => !open && setDeleteConfirmation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User Trigger?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this trigger? This action cannot be undone and any external systems using this webhook URL will fail.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmation(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteTrigger}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
