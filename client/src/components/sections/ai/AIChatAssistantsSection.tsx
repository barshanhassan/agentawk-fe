import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Bot, 
  MoreVertical, 
  Pencil, 
  FileText, 
  Trash2, 
  Plug, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Settings, 
  Globe, 
  Sparkles, 
  Info,
  RotateCcw,
  Zap,
  Plus
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock Data
const mockAgents = [
  {
    id: 1,
    name: "Customer Support Bot",
    reference_id: "asst_123456789",
    model: "gpt-4o",
    total_quries: 1250,
    status: "ACTIVE",
    allow_in_feeder: true,
  },
  {
    id: 2,
    name: "Sales Assistant",
    reference_id: "asst_987654321",
    model: "gpt-3.5-turbo",
    total_quries: 450,
    status: "PAUSED",
    allow_in_feeder: false,
  },
];

const gptModels = [
  { name: "gpt-4o", value: "gpt-4o" },
  { name: "gpt-4-turbo", value: "gpt-4-turbo" },
  { name: "gpt-3.5-turbo", value: "gpt-3.5-turbo" },
];

export default function AIChatAssistantsSection() {
  const [viewMode, setViewMode] = useState<"list" | "edit" | "logs">("list");
  const [agents, setAgents] = useState(mockAgents);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<any>(null);
  const { toast } = useToast();
  
  // Edit Form State
  const [activeTab, setActiveTab] = useState<"personality" | "configurations" | "knowledge" | "functions">("personality");
  const [formData, setFormData] = useState({
    name: "",
    instructions: "",
    model: "gpt-4o",
    prompt_strategy: "fixed",
    creativity: 1.0, // Temperature
    diversity: 0.5, // Top P
    max_chunk_size_tokens: 1000,
    chunk_overlap_tokens: 200,
    response_tokens: 1000,
    history_limit: 10,
    source_type: "pdf",
  });

  const totalActive = agents.filter(a => a.status === "ACTIVE").length;
  const limit = 15;

  const handleEdit = (agent: any) => {
    setSelectedAgent(agent);
    if (agent) {
      setFormData({
        ...formData,
        name: agent.name,
        model: agent.model,
        // Populate other fields as needed from agent data
      });
    } else {
      // Reset form for new agent
      setFormData({
        name: "",
        instructions: "",
        model: "gpt-4o",
        prompt_strategy: "fixed",
        creativity: 1.0,
        diversity: 0.5,
        max_chunk_size_tokens: 1000,
        chunk_overlap_tokens: 200,
        response_tokens: 1000,
        history_limit: 10,
        source_type: "pdf",
      });
    }
    setViewMode("edit");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      if (selectedAgent) {
        setAgents(prev => prev.map(a => a.id === selectedAgent.id ? { ...a, name: formData.name, model: formData.model } : a));
        toast({ title: "Success", description: "Assistant updated successfully." });
      } else {
        const newAgent = {
          id: Date.now(),
          name: formData.name,
          reference_id: `asst_${Math.random().toString(36).substr(2, 9)}`,
          model: formData.model,
          total_quries: 0,
          status: "ACTIVE",
          allow_in_feeder: true,
        };
        setAgents([...agents, newAgent]);
        toast({ title: "Success", description: "Assistant created successfully." });
      }
      setViewMode("list");
    }
  };

  const handleStatusToggle = (id: number) => {
    setAgents(prevAgents => prevAgents.map(agent => 
      agent.id === id 
        ? { ...agent, status: agent.status === "ACTIVE" ? "PAUSED" : "ACTIVE" }
        : agent
    ));
  };

  const handleDeleteRequest = (agent: any) => {
    setAgentToDelete(agent);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAgent = () => {
    if (agentToDelete) {
      setAgents(prev => prev.filter(a => a.id !== agentToDelete.id));
      toast({
        title: "Assistant Deleted",
        description: `${agentToDelete.name} has been successfully removed.`,
      });
      setShowDeleteConfirm(false);
      setAgentToDelete(null);
    }
  };

  return (
    <div className="p-6">
      {/* Header Page Alerts (Placeholder) */}

      {viewMode === "list" && (
        <div className="space-y-6">
          <div className="border rounded-lg shadow-sm bg-white dark:bg-slate-900 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md">
                   <img src="/images/integrations/chat_gpt.svg" className="h-8 w-8" alt="AI" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">AI Chat Assistants</h3>
                  <p className="text-sm text-muted-foreground">Feed your assistant with custom data.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                       <div className="flex items-center gap-3 text-sm font-medium border px-3 py-1.5 rounded-md bg-slate-50 dark:bg-slate-800">
                          <span>Total Active: {totalActive}</span>
                          <Separator orientation="vertical" className="h-4" />
                          <span>Limit: {limit}</span>
                          <Info className="h-4 w-4 text-muted-foreground" />
                       </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Your current workspace limit for AI Assistants.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Button onClick={() => handleEdit(null)} className="btn-outline-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Assistant
                </Button>
              </div>
            </div>
          </div>

          <div className="border rounded-lg shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
             {agents.length > 0 ? (
               <table className="w-full text-sm text-left">
                 <thead className="bg-slate-50 dark:bg-slate-800 border-b">
                   <tr>
                     <th className="px-6 py-3 font-medium text-muted-foreground">Name</th>
                     <th className="px-6 py-3 font-medium text-muted-foreground">Model</th>
                     <th className="px-6 py-3 font-medium text-muted-foreground">AI Calls</th>
                     <th className="px-6 py-3 font-medium text-muted-foreground">Status</th>
                     <th className="px-6 py-3 font-medium text-muted-foreground text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y">
                   {agents.map((agent) => (
                     <tr key={agent.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                       <td className="px-6 py-4">
                         <div className="font-medium text-slate-900 dark:text-slate-100">{agent.name}</div>
                         <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                           <Info className="h-3 w-3" />
                           {agent.reference_id}
                         </div>
                       </td>
                       <td className="px-6 py-4">{agent.model}</td>
                       <td className="px-6 py-4">{agent.total_quries}</td>
                       <td className="px-6 py-4">
                         <Switch 
                           checked={agent.status === "ACTIVE"} 
                           onCheckedChange={() => handleStatusToggle(agent.id)}
                         />
                       </td>
                       <td className="px-6 py-4 text-right">
                         <div className="flex items-center justify-end gap-2">
                           <Button variant="ghost" size="icon" onClick={() => handleEdit(agent)}>
                             <Pencil className="h-4 w-4 text-slate-500" />
                           </Button>
                           <Button 
                             variant="ghost" 
                             size="icon"
                             onClick={() => toast({ title: "View Logs", description: `Opening activity logs for ${agent.name}...` })}
                           >
                             <FileText className="h-4 w-4 text-slate-500" />
                           </Button>
                           <DropdownMenu>
                             <DropdownMenuTrigger asChild>
                               <Button variant="ghost" size="icon">
                                 <MoreVertical className="h-4 w-4 text-slate-500" />
                               </Button>
                             </DropdownMenuTrigger>
                             <DropdownMenuContent align="end">
                               <DropdownMenuItem onClick={() => toast({ title: "AI Feeder", description: `Opening AI Feeder for ${agent.name}...` })}>
                                 <Plug className="h-4 w-4 mr-2" />
                                 AI Feeder
                               </DropdownMenuItem>
                               <DropdownMenuItem 
                                 className="text-red-600"
                                 onClick={() => handleDeleteRequest(agent)}
                               >
                                 <Trash2 className="h-4 w-4 mr-2" />
                                 Delete
                               </DropdownMenuItem>
                             </DropdownMenuContent>
                           </DropdownMenu>
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             ) : (
                <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full">
                     <img src="/images/integrations/chat_gpt.svg" className="h-12 w-12 opacity-50" alt="AI" />
                  </div>
                  <h3 className="font-semibold text-lg">Create your first AI Assistant</h3>
                  <p className="text-muted-foreground max-w-md">
                    Get started by creating a new AI assistant to help automate your conversations.
                  </p>
                  <Button onClick={() => handleEdit(null)} className="mt-4 btn-outline-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Create Assistant
                  </Button>
                </div>
             )}
          </div>
        </div>
      )}

      {viewMode === "edit" && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="border rounded-lg shadow-sm bg-white dark:bg-slate-900 p-4 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md">
                   <img src="/images/integrations/chat_gpt.svg" className="h-8 w-8" alt="AI" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">{selectedAgent ? "Edit Assistant" : "Create New Assistant"}</h3>
                  <p className="text-sm text-muted-foreground">Configure your AI assistant settings.</p>
                </div>
             </div>
             <div className="flex items-center gap-3">
               <Button type="button" variant="outline" onClick={() => setViewMode("list")}>
                 Back
               </Button>
               <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                 Publish
               </Button>
             </div>
          </div>

          <div className="border rounded-lg shadow-sm bg-white dark:bg-slate-900">
             {/* Tabs Header */}
              <Tabs value={activeTab} onValueChange={(val: any) => setActiveTab(val)} className="w-full">
                <div className="px-6 pt-6">
                  <TabsList className="w-full justify-start h-auto p-1 bg-slate-100 dark:bg-slate-800">
                    <TabsTrigger value="personality" className="flex-1">
                      <User className="h-4 w-4 mr-2" />
                      Personality
                    </TabsTrigger>
                    <TabsTrigger value="configurations" className="flex-1">
                      <Settings className="h-4 w-4 mr-2" />
                      Configurations
                    </TabsTrigger>
                    <TabsTrigger value="knowledge" className="flex-1">
                      <Globe className="h-4 w-4 mr-2" />
                      Assistants
                    </TabsTrigger>
                    <TabsTrigger value="functions" className="flex-1">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Functions
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-8">
                  {/* Personality Tab */}
                  <TabsContent value="personality" className="mt-0 outline-none">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                      <div className="md:col-span-2 space-y-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Assistant Name</label>
                          <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Sales Helper"
                            maxLength={250}
                          />
                          <p className="text-xs text-muted-foreground text-right">{formData.name.length}/250</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Instructions</label>
                          <Textarea
                            rows={12}
                            value={formData.instructions}
                            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                            placeholder="You are a helpful assistant..."
                            className="resize-none"
                          />
                          <p className="text-xs text-muted-foreground text-right">0/100000</p>
                        </div>
                      </div>

                      <div className="space-y-8">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Select Model</label>
                          <Select
                            value={formData.model}
                            onValueChange={(val) => setFormData({ ...formData, model: val })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Model" />
                            </SelectTrigger>
                            <SelectContent>
                              {gptModels.map(model => (
                                <SelectItem key={model.value} value={model.value}>{model.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Model Strategy</label>
                          <div className="grid grid-cols-2 gap-3">
                            <div
                              className={`border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-all ${formData.prompt_strategy === 'fixed' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500' : 'bg-transparent'}`}
                              onClick={() => setFormData({ ...formData, prompt_strategy: 'fixed' })}
                            >
                              <div className="mb-2">
                                <RotateCcw className={`h-6 w-6 ${formData.prompt_strategy === 'fixed' ? 'text-blue-600' : 'text-slate-400'}`} />
                              </div>
                              <p className="font-semibold text-sm">Fixed</p>
                              <p className="text-xs text-muted-foreground mt-1">Uses a static predefined prompt.</p>
                            </div>
                            <div
                              className={`border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-all ${formData.prompt_strategy === 'dynamic' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500' : 'bg-transparent'}`}
                              onClick={() => setFormData({ ...formData, prompt_strategy: 'dynamic' })}
                            >
                              <div className="mb-2">
                                <Sparkles className={`h-6 w-6 ${formData.prompt_strategy === 'dynamic' ? 'text-blue-600' : 'text-slate-400'}`} />
                              </div>
                              <p className="font-semibold text-sm">Dynamic</p>
                              <p className="text-xs text-muted-foreground mt-1">Allows variable injection.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Configurations Tab */}
                  <TabsContent value="configurations" className="mt-0 outline-none">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-8">
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <label className="text-sm font-medium flex items-center gap-2">
                              Temperature (Creativity)
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </label>
                            <span className="text-sm font-bold text-blue-600">{formData.creativity}</span>
                          </div>
                          <input
                            type="range"
                            min="0" max="2" step="0.01"
                            value={formData.creativity}
                            onChange={(e) => setFormData({ ...formData, creativity: parseFloat(e.target.value) })}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>More Precise</span>
                            <span>More Creative</span>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <label className="text-sm font-medium flex items-center gap-2">
                              Top P (Diversity)
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </label>
                            <span className="text-sm font-bold text-blue-600">{formData.diversity}</span>
                          </div>
                          <input
                            type="range"
                            min="0" max="1" step="0.01"
                            value={formData.diversity}
                            onChange={(e) => setFormData({ ...formData, diversity: parseFloat(e.target.value) })}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Less Diversity</span>
                            <span>More Diversity</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Response Tokens</label>
                          <Input
                            type="number"
                            value={formData.response_tokens}
                            onChange={(e) => setFormData({ ...formData, response_tokens: parseInt(e.target.value) })}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Conversation History Limit</label>
                          <div className="flex gap-2">
                            {[0, 5, 10, 20].map((val) => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => setFormData({ ...formData, history_limit: val })}
                                className={`flex-1 py-2 px-3 border rounded-md text-sm transition-colors ${formData.history_limit === val ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700'}`}
                              >
                                {val === 0 ? 'Auto' : val}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Knowledge Tab */}
                  <TabsContent value="knowledge" className="mt-0 outline-none">
                    <div className="space-y-6">
                      <h4 className="font-medium text-sm">Add Assistant Files</h4>

                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant={formData.source_type === 'pdf' ? 'default' : 'outline'}
                          onClick={() => setFormData({ ...formData, source_type: 'pdf' })}
                          className={formData.source_type === 'pdf' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                        >
                          PDF Files
                        </Button>
                        <Button
                          type="button"
                          variant={formData.source_type === 'website' ? 'default' : 'outline'}
                          onClick={() => setFormData({ ...formData, source_type: 'website' })}
                          className={formData.source_type === 'website' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                        >
                          Website / URL
                        </Button>
                        <Button
                          type="button"
                          variant={formData.source_type === 'text' ? 'default' : 'outline'}
                          onClick={() => setFormData({ ...formData, source_type: 'text' })}
                          className={formData.source_type === 'text' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                        >
                          Text Input
                        </Button>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg border border-dashed text-center">
                        {formData.source_type === 'pdf' && (
                          <div className="space-y-4">
                            <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600">
                              <FileText className="h-6 w-6" />
                            </div>
                            <h3 className="font-medium">Upload PDF Files</h3>
                            <p className="text-sm text-muted-foreground">Upload your PDF knowledge base files here.</p>
                            <Button 
                              type="button"
                              variant="outline" 
                              className="mt-2"
                              onClick={() => toast({ title: "Upload PDF", description: "File selection dialog would open here." })}
                            >
                              Select Files
                            </Button>
                          </div>
                        )}

                        {formData.source_type === 'website' && (
                          <div className="space-y-4 max-w-lg mx-auto">
                            <div className="flex gap-2">
                              <span className="flex items-center px-3 border rounded-l-md bg-slate-100 dark:bg-slate-800 text-muted-foreground">https://</span>
                              <Input placeholder="example.com" className="rounded-l-none" />
                              <Button 
                                type="button"
                                variant="secondary"
                                onClick={() => toast({ title: "Fetching Pages", description: "Crawling website for knowledge base content..." })}
                              >
                                Fetch Pages
                              </Button>
                            </div>
                          </div>
                        )}

                        {formData.source_type === 'text' && (
                          <div className="space-y-4">
                            <Textarea rows={8} placeholder="Enter text content..." />
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Functions Tab (Placeholder) */}
                  <TabsContent value="functions" className="mt-0 outline-none">
                    <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
                      <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-2">
                        <Zap className="h-8 w-8 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-medium">Function Calling</h3>
                      <p className="text-sm text-muted-foreground max-w-md">
                        Define custom functions that the AI can call to interact with your business logic or external APIs.
                      </p>
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => toast({ title: "Functions", description: "Custom function creator coming soon." })}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Function
                      </Button>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>

             {/* Footer Actions */}
             <div className="p-4 border-t bg-slate-50 dark:bg-slate-800 flex justify-end gap-3">
               <Button type="button" variant="ghost" onClick={() => setViewMode("list")}>
                 Cancel
               </Button>
               <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                 Publish
               </Button>
             </div>
          </div>
        </form>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-600 flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Delete Assistant
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Are you sure you want to delete the assistant <span className="font-bold text-slate-900 dark:text-white">"{agentToDelete?.name}"</span>? 
              This action cannot be undone and all active conversations with this assistant will stop.
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmDeleteAgent}
            >
              Yes, delete assistant
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
