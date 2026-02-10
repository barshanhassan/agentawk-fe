import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  PhoneIncoming,
  PhoneOutgoing,
  AppWindow,
  MoreVertical,
  Pencil,
  FileText,
  Trash2,
  Play,
  Pause,
  Info,
  ChevronRight,
  User,
  Settings,
  PhoneForwarded,
  Wand2,
  ListChecks,
  Palette,
  Code,
  AlertTriangle,
  Plus
} from "lucide-react";

// Mock Data
const mockAgents = [
  {
    id: 1,
    name: "Support Voice Bot",
    model: "gpt-4o",
    phone_number: "+1234567890",
    type: "incoming",
    status: "ACTIVE",
    allow_in_feeder: true,
  },
  {
    id: 2,
    name: "Sales Outbound",
    model: "gpt-3.5-turbo",
    phone_number: "+0987654321",
    type: "outgoing",
    status: "PAUSED",
    allow_in_feeder: false,
  },
];

const mockVoices = [
  { name: "Alloy", id: "alloy" },
  { name: "Echo", id: "echo" },
  { name: "Fable", id: "fable" },
  { name: "Onyx", id: "onyx" },
  { name: "Nova", id: "nova" },
  { name: "Shimmer", id: "shimmer" },
];

const mockPhones = [
  { id: 1, number: "+1 (555) 123-4567" },
  { id: 2, number: "+1 (555) 987-6543" },
];

const gptModels = [
  { name: "gpt-4o", value: "gpt-4o" },
  { name: "gpt-4-turbo", value: "gpt-4-turbo" },
  { name: "gpt-3.5-turbo", value: "gpt-3.5-turbo" },
];

export default function AIVoiceAssistantsSection() {
  const [viewMode, setViewMode] = useState<"list" | "edit">("list");
  const [agents, setAgents] = useState(mockAgents);
  const [formData, setFormData] = useState<any>(null);
  const [editStep, setEditStep] = useState<"type_selection" | "form">("type_selection");
  const [activeTab, setActiveTab] = useState<"personality" | "configurations" | "transfer" | "functions" | "summary" | "design" | "embed">("personality");
  
  // Audio Player State Simulation
  const [isPlaying, setIsPlaying] = useState(false);

  const availableCredits = "1645:59";

  const handleEdit = (agent: any) => {
    if (agent) {
      setFormData({ 
        ...agent, 
        voice: "Alloy",
        temperature: 0.7,
        confidence: 0.7,
        record_calls: true,
        allowed_minutes_enabled: false,
        automation_enabled: false,
        call_transfer_config: [],
        design: { type: 'page', bg_type: 'color', bg_color: '#ffffff', title: '', subtitle: '' }
      });
      setEditStep("form");
    } else {
      setFormData({
        name: "",
        model: "gpt-4o",
        type: null,
        voice: "Alloy",
        temperature: 0.7,
        confidence: 0.7,
        greeting: "",
        instructions: "",
        record_calls: false,
        call_limit: 0,
        allowed_minutes_enabled: false,
        automation_enabled: false,
        call_transfer_config: [],
        design: { type: 'page', bg_type: 'color', bg_color: '#ffffff', title: '', subtitle: '' }
      });
      setEditStep("type_selection");
    }
    setViewMode("edit");
    setActiveTab("personality");
  };

  const handleSetType = (type: string) => {
    setFormData({ ...formData, type });
    setEditStep("form");
  };

  const handleStatusToggle = (id: number) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, status: a.status === "ACTIVE" ? "PAUSED" : "ACTIVE" } : a));
  };



  return (
    <div className="p-6">
      {viewMode === "list" && (
        <div className="space-y-6">
           {/* Header */}
          <div className="border rounded-lg shadow-sm bg-white dark:bg-slate-900 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md">
                   <img src="/images/integrations/chat_gpt.svg" className="h-8 w-8" alt="AI" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">AI Voice Assistants</h3>
                  <p className="text-sm text-muted-foreground">Manage your voice assistants.</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-sm">
                  <span className="text-muted-foreground">Available credits: </span>
                  <span className="font-semibold">{availableCredits}</span>
                  <span className="text-muted-foreground"> mins/secs</span>
                </div>
                <Button onClick={() => handleEdit(null)} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Create new
                </Button>
              </div>
            </div>
          </div>

          {/* List Table */}
          <div className="border rounded-lg shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
             {agents.length > 0 ? (
               <table className="w-full text-sm text-left">
                 <thead className="bg-slate-50 dark:bg-slate-800 border-b">
                   <tr>
                     <th className="px-6 py-3 font-medium text-muted-foreground">Name</th>
                     <th className="px-6 py-3 font-medium text-muted-foreground">Model</th>
                     <th className="px-6 py-3 font-medium text-muted-foreground">Phone</th>
                     <th className="px-6 py-3 font-medium text-muted-foreground">Type</th>
                     <th className="px-6 py-3 font-medium text-muted-foreground">Status</th>
                     <th className="px-6 py-3 font-medium text-muted-foreground text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y">
                   {agents.map((agent) => (
                     <tr key={agent.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                       <td className="px-6 py-4 font-medium">{agent.name}</td>
                       <td className="px-6 py-4">{agent.model}</td>
                       <td className="px-6 py-4">{agent.phone_number}</td>
                       <td className="px-6 py-4">
                         <div className="flex items-center gap-2">
                            {agent.type === 'incoming' && <PhoneIncoming className="h-4 w-4 text-blue-500" />}
                            {agent.type === 'outgoing' && <PhoneOutgoing className="h-4 w-4 text-green-500" />}
                            {agent.type === 'widget' && <AppWindow className="h-4 w-4 text-purple-500" />}
                            <span className="capitalize">{agent.type}</span>
                         </div>
                       </td>
                       <td className="px-6 py-4">
                          <Switch checked={agent.status === "ACTIVE"} onCheckedChange={() => handleStatusToggle(agent.id)} />
                       </td>
                       <td className="px-6 py-4 text-right">
                         <div className="flex items-center justify-end gap-2">
                           <Button variant="ghost" size="icon" onClick={() => handleEdit(agent)}>
                             <Pencil className="h-4 w-4 text-slate-500" />
                           </Button>
                           <Button variant="ghost" size="icon">
                             <FileText className="h-4 w-4 text-slate-500" />
                           </Button>
                           <DropdownMenu>
                             <DropdownMenuTrigger asChild>
                               <Button variant="ghost" size="icon">
                                 <MoreVertical className="h-4 w-4 text-slate-500" />
                               </Button>
                             </DropdownMenuTrigger>
                             <DropdownMenuContent align="end">
                               <DropdownMenuItem>
                                 <Plus className="h-4 w-4 mr-2" />
                                 AI Feeder
                               </DropdownMenuItem>
                               <DropdownMenuItem className="text-red-600">
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
                  <h3 className="font-semibold text-lg">Create your first AI Voice Assistant</h3>
                  <Button onClick={() => handleEdit(null)} className="mt-4">
                    Create new
                  </Button>
                </div>
             )}
          </div>
        </div>
      )}

      {viewMode === "edit" && editStep === "type_selection" && (
        <div className="space-y-6">
           <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Select Assistant Type</h3>
                <p className="text-sm text-muted-foreground">Choose how this agent will interact.</p>
              </div>
              <Button variant="outline" onClick={() => setViewMode('list')}>Back</Button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { type: 'incoming', icon: PhoneIncoming, title: 'Incoming Call', desc: 'Handles incoming calls to your phone number.' },
                { type: 'outgoing', icon: PhoneOutgoing, title: 'Outgoing Call', desc: 'Makes outgoing calls to leads or customers.' },
                { type: 'widget', icon: AppWindow, title: 'Web Widget', desc: 'Embeds a voice assistant on your website.' },
              ].map((item) => (
                <div key={item.type} className="border rounded-lg p-6 bg-white dark:bg-slate-900 flex flex-col items-center text-center hover:border-blue-500 transition-all">
                   <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                      <item.icon className="h-8 w-8 text-slate-600 dark:text-slate-400" />
                   </div>
                   <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                   <p className="text-muted-foreground text-sm mb-6">{item.desc}</p>
                   <Button variant="secondary" className="w-full mt-auto" onClick={() => handleSetType(item.type)}>
                     Select
                   </Button>
                </div>
              ))}
           </div>
        </div>
      )}

      {viewMode === "edit" && editStep === "form" && (
        <div className="space-y-6">
          {/* Form Header */}
          <div className="border rounded-lg shadow-sm bg-white dark:bg-slate-900 p-4 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md">
                   <img src="/images/integrations/chat_gpt.svg" className="h-8 w-8" alt="AI" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">{formData.id ? "Edit Voice Assistant" : "New Voice Assistant"}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{formData.type} Assistant</p>
                </div>
             </div>
             <div className="flex items-center gap-3">
               <Button variant="outline" onClick={() => setViewMode("list")}>Cancel</Button>
               <Button className="bg-blue-600 hover:bg-blue-700 text-white">Publish</Button>
             </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border rounded-lg shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
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
                      
                      {formData.type !== 'widget' && (
                         <TabsTrigger value="transfer" className="flex-1">
                            <PhoneForwarded className="h-4 w-4 mr-2" />
                            Call Transfer
                         </TabsTrigger>
                      )}
                      
                      <TabsTrigger value="functions" className="flex-1">
                         <Wand2 className="h-4 w-4 mr-2" />
                         Functions
                      </TabsTrigger>

                      {formData.type !== 'widget' ? (
                         <TabsTrigger value="summary" className="flex-1">
                            <ListChecks className="h-4 w-4 mr-2" />
                            Summary
                         </TabsTrigger>
                      ) : (
                         <>
                            <TabsTrigger value="design" className="flex-1">
                               <Palette className="h-4 w-4 mr-2" />
                               Design
                            </TabsTrigger>
                            <TabsTrigger value="embed" className="flex-1">
                               <Code className="h-4 w-4 mr-2" />
                               Install
                            </TabsTrigger>
                         </>
                      )}
                   </TabsList>
                </div>

                <div className="p-8 min-h-[500px]">
                   {/* Personality Tab */}
                   <TabsContent value="personality" className="mt-0 outline-none">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-6">
                            <div className="space-y-2">
                               <label className="text-sm font-medium">Assistant Name</label>
                               <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} maxLength={250} />
                               <p className="text-xs text-right text-muted-foreground">{formData.name.length}/250</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Select Model</label>
                                <Select value={formData.model} onValueChange={(val) => setFormData({...formData, model: val})}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select model" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {gptModels.map(m => <SelectItem key={m.value} value={m.value}>{m.name}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="space-y-2">
                               <label className="text-sm font-medium">Select Voice</label>
                               <div className="flex gap-2">
                                  <Select value={formData.voice} onValueChange={(val) => setFormData({...formData, voice: val})}>
                                    <SelectTrigger className="flex-1">
                                      <SelectValue placeholder="Select voice" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {mockVoices.map(v => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                  <Button variant="outline" size="icon" onClick={() => setIsPlaying(!isPlaying)}>
                                     {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                  </Button>
                               </div>
                            </div>

                            <div className="space-y-4">
                               <div className="flex justify-between">
                                  <label className="text-sm font-medium flex items-center gap-1">
                                    Temperature <Info className="h-3 w-3 text-muted-foreground" />
                                  </label>
                                  <span className="text-sm font-bold text-blue-600">{formData.temperature}</span>
                               </div>
                               <input 
                                 type="range" 
                                 min="0" max="1" step="0.1" 
                                 value={formData.temperature} 
                                 onChange={(e) => setFormData({...formData, temperature: parseFloat(e.target.value)})}
                                 className="w-full accent-blue-600"
                               />
                               <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>Precise</span>
                                  <span>Creative</span>
                               </div>
                            </div>
                         </div>

                         <div className="space-y-6">
                            <div className="space-y-2">
                               <label className="text-sm font-medium">
                                 {formData.type === 'outgoing' ? "Outgoing Call Greeting" : "Incoming Call Greeting"}
                               </label>
                               <Textarea 
                                 rows={4} 
                                 value={formData.greeting} 
                                 onChange={(e) => setFormData({...formData, greeting: e.target.value})}
                                 maxLength={2500}
                                 placeholder="Hello, how can I help you today?" 
                               />
                               <p className="text-xs text-right text-muted-foreground">{formData.greeting?.length || 0}/2500</p>
                            </div>

                            <div className="space-y-2">
                               <label className="text-sm font-medium">Instructions</label>
                               <Textarea 
                                 rows={8} 
                                 value={formData.instructions} 
                                 onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                                 maxLength={250000}
                                 placeholder="You are a helpful assistant..." 
                               />
                            </div>
                         </div>
                      </div>
                   </TabsContent>

                   {/* Configurations Tab */}
                   <TabsContent value="configurations" className="mt-0 outline-none">
                      <div className="space-y-8 max-w-4xl">
                         {formData.type !== 'widget' && (
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-6 border-b">
                              <div className="space-y-2">
                                 <label className="text-sm font-medium">Select Phone Number</label>
                                 <Select value={formData.twilio_number_id} onValueChange={(val) => setFormData({...formData, twilio_number_id: val})}>
                                    <SelectTrigger>
                                       <SelectValue placeholder="Select number" />
                                    </SelectTrigger>
                                    <SelectContent>
                                       {mockPhones.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.number}</SelectItem>)}
                                    </SelectContent>
                                 </Select>
                              </div>
                              <div className="flex items-center gap-4">
                                 <Switch checked={formData.record_calls} onCheckedChange={(val) => setFormData({...formData, record_calls: val})} />
                                 <span className="text-sm font-medium">Record Calls</span>
                              </div>
                           </div>
                         )}

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-6 border-b">
                             <div className="space-y-2">
                                <label className="text-sm font-medium">Call Duration Limit (seconds)</label>
                                <Input type="number" value={formData.call_limit} onChange={(e) => setFormData({...formData, call_limit: e.target.value})} />
                             </div>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-6 border-b">
                             <div className="space-y-2">
                                <label className="text-sm font-medium">Call Ending Message</label>
                                <Textarea rows={3} value={formData.call_ending_message} onChange={(e) => setFormData({...formData, call_ending_message: e.target.value})} />
                             </div>
                         </div>

                         <div className="space-y-2 pb-6 border-b">
                             <label className="text-sm font-medium">Select Knowledge Bases</label>
                             <Select>
                                <SelectTrigger>
                                   <SelectValue placeholder="Select knowledge bases" />
                                </SelectTrigger>
                                <SelectContent>
                                   <SelectItem value="kb1">Marketing Docs</SelectItem>
                                   <SelectItem value="kb2">Support FAQs</SelectItem>
                                </SelectContent>
                             </Select>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                  <label className="text-sm font-medium">Confidence Threshold</label>
                                  <span className="font-bold text-blue-600">{formData.confidence}</span>
                                </div>
                                <input 
                                 type="range" 
                                 min="0" max="1" step="0.1" 
                                 value={formData.confidence} 
                                 onChange={(e) => setFormData({...formData, confidence: parseFloat(e.target.value)})}
                                 className="w-full accent-blue-600"
                               />
                            </div>
                         </div>
                      </div>
                   </TabsContent>

                   {/* Call Transfer Tab */}
                   <TabsContent value="transfer" className="mt-0 outline-none">
                      <div className="space-y-6">
                         <div className="flex justify-between items-center">
                            <div>
                               <h4 className="font-medium">Call Transfer Rules</h4>
                               <p className="text-sm text-muted-foreground">Define when to transfer calls to a human agent.</p>
                            </div>
                            <Button onClick={() => setFormData({
                              ...formData, 
                              call_transfer_config: [...(formData.call_transfer_config || []), { description: '', number: '' }]
                            })}>
                               Add Transfer Rule
                            </Button>
                         </div>

                         <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex gap-3 text-amber-800">
                            <AlertTriangle className="h-5 w-5 shrink-0" />
                            <div>
                               <p className="font-medium">Attention Needed</p>
                               <p className="text-sm mt-1">Ensure your Twilio account is configured to handle SIP transfers if required.</p>
                            </div>
                         </div>

                         {formData.call_transfer_config?.length > 0 ? (
                           <div className="space-y-4">
                              {formData.call_transfer_config.map((conf: any, index: number) => (
                                <div key={index} className="flex gap-4 items-start border p-4 rounded-md bg-slate-50 dark:bg-slate-800/50">
                                   <div className="flex-1 space-y-2">
                                      <label className="text-xs font-medium uppercase text-muted-foreground">Description</label>
                                      <Textarea 
                                        placeholder="e.g. User asks to speak to a manager" 
                                        rows={1}
                                        value={conf.description}
                                        onChange={(e) => {
                                           const newConf = [...formData.call_transfer_config];
                                           newConf[index].description = e.target.value;
                                           setFormData({...formData, call_transfer_config: newConf});
                                        }}
                                      />
                                   </div>
                                   <div className="w-1/3 space-y-2">
                                      <label className="text-xs font-medium uppercase text-muted-foreground">Destination</label>
                                      <Select value={conf.number} onValueChange={(val) => {
                                         const newConf = [...formData.call_transfer_config];
                                         newConf[index].number = val;
                                         setFormData({...formData, call_transfer_config: newConf});
                                      }}>
                                         <SelectTrigger>
                                            <SelectValue placeholder="Select agent" />
                                         </SelectTrigger>
                                         <SelectContent>
                                            <SelectItem value="+15550001111">Agent Smith (+15550001111)</SelectItem>
                                            <SelectItem value="+15550002222">Support Desk (+15550002222)</SelectItem>
                                         </SelectContent>
                                      </Select>
                                   </div>
                                   <Button variant="ghost" size="icon" className="mt-6 text-red-500 hover:text-red-600" onClick={() => {
                                      const newConf = formData.call_transfer_config.filter((_: any, i: number) => i !== index);
                                      setFormData({...formData, call_transfer_config: newConf});
                                   }}>
                                      <Trash2 className="h-4 w-4" />
                                   </Button>
                                </div>
                              ))}
                           </div>
                         ) : (
                           <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                              No transfer rules configured.
                           </div>
                         )}
                      </div>
                   </TabsContent>
                   
                   {/* Functions Tab - Placeholder */}
                   <TabsContent value="functions" className="mt-0 outline-none">
                      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                         <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-2">
                           <Wand2 className="h-8 w-8 text-purple-600" />
                         </div>
                         <h3 className="text-lg font-medium">Function Calling</h3>
                         <p className="text-sm text-muted-foreground max-w-md">
                           Define custom functions that the AI can call to interact with your business logic or external APIs.
                         </p>
                         <Button variant="outline">
                           <Plus className="h-4 w-4 mr-2" />
                           Add Function
                         </Button>
                      </div>
                   </TabsContent>

                    {/* Summary Tab */}
                    <TabsContent value="summary" className="mt-0 outline-none">
                      <div className="space-y-6 max-w-3xl">
                         <div className="flex items-center gap-4 p-4 border rounded-lg">
                             <Switch checked={formData.generate_summary} onCheckedChange={(val) => setFormData({...formData, generate_summary: val})} />
                             <div>
                                <h4 className="font-medium">Generate Call Summary</h4>
                                <p className="text-sm text-muted-foreground">Automatically generate a summary after the call ends.</p>
                             </div>
                         </div>

                         {formData.generate_summary && (
                            <div className="space-y-6 p-4 border rounded-lg bg-slate-50 dark:bg-slate-800/50">
                               <div className="space-y-2">
                                  <label className="text-sm font-medium">Summary Model</label>
                                  <Select value={formData.summary_model} onValueChange={(val) => setFormData({...formData, summary_model: val})}>
                                     <SelectTrigger>
                                        <SelectValue placeholder="Select model" />
                                     </SelectTrigger>
                                     <SelectContent>
                                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                                        <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                                     </SelectContent>
                                  </Select>
                               </div>
                               <div className="space-y-2">
                                  <label className="text-sm font-medium">Summary Prompt / Instructions</label>
                                  <Textarea 
                                    rows={6}
                                    placeholder="Summarize the call focusing on action items..."
                                    value={formData.summary_prompt}
                                    onChange={(e) => setFormData({...formData, summary_prompt: e.target.value})}
                                  />
                               </div>
                            </div>
                         )}
                      </div>
                    </TabsContent>

                    {/* Design Tab (Widget Only) */}
                    <TabsContent value="design" className="mt-0 outline-none">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-6">
                             <h4 className="font-medium border-b pb-2">Widget Appearance</h4>
                             <div className="space-y-4">
                                <div className="space-y-2">
                                   <label className="text-sm font-medium">Title</label>
                                   <Input value={formData.design.title} onChange={(e) => setFormData({...formData, design: {...formData.design, title: e.target.value}})} placeholder="AI Assistant" />
                                </div>
                                <div className="space-y-2">
                                   <label className="text-sm font-medium">Subtitle</label>
                                   <Input value={formData.design.subtitle} onChange={(e) => setFormData({...formData, design: {...formData.design, subtitle: e.target.value}})} placeholder="How can I help you?" />
                                </div>
                                <div className="space-y-2">
                                   <label className="text-sm font-medium">Background Type</label>
                                   <div className="flex gap-4">
                                      {['color', 'image', 'video', 'transparent'].map(t => (
                                         <div 
                                           key={t}
                                           onClick={() => setFormData({...formData, design: {...formData.design, bg_type: t}})}
                                           className={`cursor-pointer px-3 py-1.5 rounded-md border text-sm capitalize ${formData.design.bg_type === t ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-white'}`}
                                         >
                                           {t}
                                         </div>
                                      ))}
                                   </div>
                                </div>
                                {formData.design.bg_type === 'color' && (
                                   <div className="space-y-2">
                                      <label className="text-sm font-medium">Background Color</label>
                                      <div className="flex gap-2 items-center">
                                         <div className="w-10 h-10 rounded-full border shadow-sm" style={{ backgroundColor: formData.design.bg_color }} />
                                         <Input value={formData.design.bg_color} onChange={(e) => setFormData({...formData, design: {...formData.design, bg_color: e.target.value}})} className="w-32" />
                                      </div>
                                   </div>
                                )}
                             </div>
                          </div>
                          
                          {/* Preview Placeholder */}
                          <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-8 flex items-center justify-center">
                             <div className="w-[300px] h-[500px] bg-white dark:bg-slate-900 rounded-2xl shadow-xl flex flex-col overflow-hidden border">
                                <div className="h-32 bg-blue-600 flex items-center justify-center text-white p-4 text-center" style={{ backgroundColor: formData.design.bg_type === 'color' ? formData.design.bg_color : undefined }}>
                                   <div>
                                      <h3 className="font-bold">{formData.design.title || "AI Assistant"}</h3>
                                      <p className="text-sm opacity-90">{formData.design.subtitle || "How can I help you?"}</p>
                                   </div>
                                </div>
                                <div className="flex-1 p-4 bg-slate-50 dark:bg-slate-950/50 flex flex-col items-center justify-center text-slate-400">
                                   <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 animate-pulse">
                                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                                   </div>
                                   <p className="text-sm">Listening...</p>
                                </div>
                                <div className="p-4 border-t flex justify-center">
                                   <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white shadow-lg">
                                      <PhoneIncoming className="h-6 w-6 rotate-135" />
                                   </div>
                                </div>
                             </div>
                          </div>
                       </div>
                    </TabsContent>

                    {/* Embed Tab (Widget Only) */}
                    <TabsContent value="embed" className="mt-0 outline-none">
                       <div className="space-y-6">
                          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border">
                             <h4 className="font-medium mb-2">Embed Code</h4>
                             <code className="block text-xs bg-slate-900 text-slate-50 p-4 rounded mb-4 font-mono whitespace-pre-wrap">
   {`<script>
     window.voiceWidgetSettings = {
       agentId: "123456789",
       primaryColor: "${formData.design.bg_color || '#2563eb'}"
     };
   </script>
   <script src="https://cdn.example.com/voice-widget.js" async></script>`}
                             </code>
                             <Button variant="outline" size="sm">Copy Code</Button>
                          </div>
                       </div>
                    </TabsContent>
                </div>
             </Tabs>
          </div>
        </div>
      )}
    </div>
  );
}
