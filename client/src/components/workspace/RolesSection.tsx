import React, { useState } from "react";
import { ShieldCheck, UserCog, Shield, Archive, ExternalLink, Plus, ChevronDown, Bot, Calendar, Settings, Users, PenTool, MessageSquare, Building2, Radio, Scale, Share2, Layers, Search, User, Info, HelpCircle, Check, Inbox, AlertCircle } from "lucide-react";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const INITIAL_ROLES = [
  { 
    id: "1",
    name: "Super Agent", 
    description: "Has control of the entire account.",
    icon: UserCog,
    isArchived: false
  },
  { 
    id: "2",
    name: "Block Access to Done Folder", 
    description: "Block Access to Done Folder",
    icon: UserCog,
    isArchived: false
  },
  { 
    id: "3",
    name: "teste edilson", 
    description: "",
    icon: UserCog,
    isArchived: false
  },
  { 
    id: "4",
    name: "Mob users", 
    description: "",
    icon: UserCog,
    isArchived: false
  },
  { 
    id: "5",
    name: "Teste tiago delet", 
    description: "",
    icon: UserCog,
    isArchived: false
  }
];

interface Permission {
  id: string;
  title: string;
  description: string;
  hasInfo?: boolean;
}

interface PermissionCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  subPermissions?: Permission[];
}

const PERMISSION_CATEGORIES: PermissionCategory[] = [
  { 
    id: "ai-products", 
    name: "AI Products", 
    icon: Bot,
    subPermissions: [
      { id: "view", title: "View AI products", description: "Allow agents to view AI Products." },
      { id: "manage", title: "Manage AI Products", description: "Allow agents to create or edit AI products." },
      { id: "delete", title: "Delete AI products", description: "Allow agents to delete AI products." },
    ]
  },
  { 
    id: "bookings", 
    name: "Bookings", 
    icon: Calendar,
    subPermissions: [
      { id: "view", title: "View bookings", description: "Allow agents to view all bookings" },
      { id: "manage", title: "Manage bookings", description: "Enable agents to create, update, or cancel bookings." },
    ]
  },
  { 
    id: "ai-intelligence", 
    name: "AI - Artificial Intelligence", 
    icon: Bot,
    subPermissions: [
      { id: "manage_themes", title: "Manage AI themes", description: "Allow agents to create or edit AI themes." },
      { id: "manage_reports", title: "Manage AI reports", description: "Allow user to manage AI Reports." },
      { id: "delete_themes", title: "Delete AI themes", description: "Allow agents to delete AI themes." },
      { id: "create_kb", title: "Create Knowledgebase", description: "Allow agents to create knowledgebase for AI Voice Assistants." },
      { id: "delete_kb", title: "Delete knowledgebase", description: "Allow agents to delete knowledgebases." },
      { id: "view_voice", title: "View AI voice assistants", description: "Allow agents to view AI voice assistants." },
      { id: "manage_voice", title: "Manage AI voice assistants", description: "Allow agents to manage voice assistants." },
      { id: "delete_voice", title: "Delete AI voice assistants", description: "Allow agents to delete voice assistants." },
      { id: "create_item", title: "Create AI item", description: "Allow to create AI items." },
      { id: "edit_item", title: "Edit AI item", description: "Allow to edit AI items." },
      { id: "delete_item", title: "Delete AI item", description: "Allow to delete AI items." },
      { id: "create_chat", title: "Create an AI Chat Assistant", description: "Authorize agents to create an AI Chat Assistant." },
      { id: "edit_chat", title: "Edit an AI Chat Assistant", description: "Allow to update a Knowledge base." },
      { id: "delete_chat", title: "Delete AI Chat Assistants", description: "Allow to delete an AI Chat Assistant." },
      { id: "create_topics", title: "Create AI topics, questions and answers", description: "Allow to create AI topics and questions." },
      { id: "edit_topics", title: "Allow editing AI topics and Q&As", description: "Allow editing AI topics and Q&As." },
      { id: "delete_topics", title: "Delete AI topics and Q&As", description: "Allow deleting AI topics and Q&As." },
    ]
  },
  { 
    id: "workspace-settings", 
    name: "Workspace & Settings", 
    icon: Settings,
    subPermissions: [
      { id: "supervisor", title: "Supervisor Dashboard", description: "Grants access to Supervisor Dashboard for a comprehensive overview and comparison of all agent metrics." },
      { id: "management", title: "Workspace Management", description: "Activate agent access and grant the ability to modify workspace settings, such as name, timezone, and White Label." },
      { id: "media", title: "Media Gallery", description: "Authorize the agent to delete files from the media gallery.", hasInfo: true },
      { id: "pipelines", title: "Pipelines", description: "Grant agents access for managing pipelines within this workspace.", hasInfo: true },
      { id: "flows", title: "Smart Flows", description: "Grant agents access to view and manage smart flows." },
      { id: "channels", title: "Communication Channels", description: "Grant agents access to manage all communication channels." },
    ]
  },
  { 
    id: "collaborations", 
    name: "Collaborations", 
    icon: Share2,
    subPermissions: [
      { id: "agents", title: "Agents", description: "Enable the Agent to manage other agents within the workspace." },
      { id: "roles", title: "Roles & Permissions", description: "Empower agents with this role to modify and control all workspace permissions" },
      { id: "teams", title: "Team Managment", description: "Empower agents to manage teams within this workspace." },
    ]
  },
  { 
    id: "customizations", 
    name: "Customizations", 
    icon: PenTool,
    subPermissions: [
      { id: "custom_fields", title: "Custom fields", description: "Enable the Agent to create and delete custom fields." },
      { id: "tags", title: "Tags", description: "Empower agents role to create and delete tags." },
      { id: "iframe", title: "Iframe", description: "Grant agents access to manage iframes" },
      { id: "ai_chat", title: "AI Chat Assistants", description: "Allow agents to create, update and delete AI Chat Assistants." },
    ]
  },
  { 
    id: "live-chat", 
    name: "Live Chat conversations and tasks", 
    icon: Inbox,
    subPermissions: [
      { id: "send_unassigned", title: "Allow sending messages to unassigned conversations", description: "The Agent will be able to send a message to an unassigned conversation" },
      { id: "delete_qr", title: "Delete Whatsapp QR Code message", description: "Allow agents to delete a sent message from Whatsapp QR Code to a contact." },
      { id: "block_done", title: "Block access to \"Done\" folder", description: "The Agent will not have access to the \"Done\" folder" },
      { id: "hide_channel", title: "Hide all contacts communication channel information", description: "Hide all contact details, including phone number, Instagram, Messenger or Telegram information." },
      { id: "msg_without_assign", title: "Allow messaging without assignment", description: "The agent can send a message even if the conversation is not assigned to them." },
      { id: "block_profile", title: "Block Access to Contact profile", description: "Hides the profile access button" },
      { id: "block_queue", title: "Block access to the \"Queue\" folder", description: "Block Agent to view the conversation in the \"Queue\" folder." },
      { id: "block_delete_conv", title: "Block permission to delete conversations.", description: "Block Agent access to delete the conversation from Live Chat." },
      { id: "manage_live", title: "Manage Live Chat", description: "Can view and manage the live chat settings." },
      { id: "access_live", title: "Live Chat access", description: "Can view and access the Live Chat." },
      { id: "assign_conv", title: "Assign conversations", description: "Unassigned conversations can be assigned to oneself or to other agents." },
      { id: "conv_avail", title: "Conversation availability", description: "Open to receiving conversations assignment from other agents or Smart Flow." },
      { id: "task_avail", title: "Task availability", description: "Open to receiving tasks from other Agents and Smart Flows." },
    ]
  },
  { 
    id: "company-contacts", 
    name: "Company & Contacts", 
    icon: Building2,
    subPermissions: [
      { id: "block_search", title: "Block access to global contact search", description: "The Agent will not have access to search contacts globally" },
      { id: "merge", title: "Merge contacts", description: "Allow agents to merge contacts." },
      { id: "view", title: "View Contact & Companies", description: "View list of all contacts & company and allow agents to view profile" },
      { id: "manage", title: "Manage Companies & Contacts", description: "Allow agents to Create or Update Companies & contacts." },
      { id: "delete", title: "Delete Companies & Contacts", description: "Allow agents to delete Companies & Contacts" },
      { id: "import", title: "Import contacts", description: "Allow agents to import contacts through files." },
      { id: "export", title: "Export contacts", description: "Allow agents to export contacts." },
      { id: "export_psid", title: "Export PSID", description: "Allow agents to export Facebook PSID's." },
    ]
  },
  { 
    id: "broadcast", 
    name: "Broadcast", 
    icon: Radio,
    subPermissions: [
      { id: "view", title: "View broadcasts", description: "View all workspace broadcast" },
      { id: "create_edit", title: "Create/Edit broadcasts", description: "Allow Agent to Create/Edit broadcasts." },
      { id: "delete", title: "Delete broadcasts", description: "Allow agents to delete broadcasts." },
    ]
  },
  { 
    id: "legal", 
    name: "Legal", 
    icon: Scale,
    subPermissions: [
      { id: "view", title: "View Document", description: "View legal document" },
      { id: "create", title: "Create Legal Document", description: "Allow Agent to create new legal documents." },
      { id: "edit", title: "Edit Legal Document", description: "Allow Agent to edit legal document." },
    ]
  },
  { 
    id: "connect", 
    name: "Connect", 
    icon: Layers,
    subPermissions: [
      { id: "meta", title: "Meta Conversions API", description: "Authorize agents to access this integration." },
      { id: "woovi", title: "Woovi.com", description: "Authorize agent to access this integration." },
      { id: "baserow", title: "Baserow.io", description: "Authorize Agent to access this integration." },
      { id: "llmwhisperer", title: "LLMWhisperer", description: "Authorize Agent to access this integration." },
      { id: "cal", title: "Cal.com", description: "Integrate your Cal.com account and manage your calendar from the Smart flows." },
      { id: "dify", title: "Dify.ai", description: "Connect and manage dify.ai chatbots" },
      { id: "public_api", title: "Public API Access", description: "Authorize Agent to access and manage public API." },
      { id: "visual_api", title: "Visual API Access", description: "Authorize Agent to access and manage public API." },
      { id: "openai", title: "OpenAI Integration", description: "Authorize Agent to access this integration." },
      { id: "cloudinary", title: "Cloudinary Integration", description: "Authorize Agent to access this integration." },
      { id: "activecampaign", title: "ActiveCampaign Integration", description: "Authorize Agent to access this integration." },
      { id: "make", title: "Make.com Integration", description: "Authorize Agent to access this integration." },
      { id: "microsoft_tts", title: "Microsoft Text to Speech Integration", description: "Authorize Agent to access this integration." },
      { id: "elevenlabs", title: "ElevenLabs Integration", description: "Authorize Agent to access this integration." },
    ]
  },
  { 
    id: "clonekits", 
    name: "Clonekits", 
    icon: Bot,
    subPermissions: [
      { id: "view", title: "View Clonekit", description: "Allow agents to view Clonekit" },
      { id: "edit", title: "Edit Clonekit", description: "Allow agents to create and edit Clonekits" },
      { id: "delete", title: "Delete Clonekit", description: "Allow agents to delete the Clonekit" },
      { id: "download", title: "Download Clonekit", description: "Allow agents to download a Clonekit" },
    ]
  },
];

const ICONS = [
  { name: "fa-person-military-pointing", icon: UserCog },
  { name: "fa-user", icon: User },
  { name: "fa-user-tie", icon: UserCog },
  { name: "fa-user-group", icon: Users },
  { name: "fa-scale-balanced", icon: Scale },
  { name: "fa-user-doctor", icon: User },
  { name: "fa-circle-info", icon: Info },
  { name: "fa-circle-question", icon: HelpCircle },
];

export default function RolesSection() {
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [activeTab, setActiveTab] = useState("active");
  const [enableAll, setEnableAll] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>({});
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [editingRole, setEditingRole] = useState<any>(null);
  
  const [alertOpen, setAlertOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ id: string, type: 'archive' | 'activate' } | null>(null);

  const { toast } = useToast();

  const confirmAction = (id: string, type: 'archive' | 'activate') => {
    setPendingAction({ id, type });
    setAlertOpen(true);
  };

  const executeAction = () => {
    if (!pendingAction) return;
    
    setRoles(prev => prev.map(role => 
      role.id === pendingAction.id 
        ? { ...role, isArchived: pendingAction.type === 'archive' } 
        : role
    ));
    
    setAlertOpen(false);
    setPendingAction(null);
  };

  const togglePermission = (categoryId: string, permissionId: string) => {
    setPermissions(prev => ({
      ...prev,
      [categoryId]: {
        ...(prev[categoryId] || {}),
        [permissionId]: !(prev[categoryId]?.[permissionId])
      }
    }));
  };

  const handleEnableAll = (checked: boolean) => {
    setEnableAll(checked);
    const newPermissions: Record<string, Record<string, boolean>> = {};
    PERMISSION_CATEGORIES.forEach(category => {
      if (category.subPermissions) {
        newPermissions[category.id] = {};
        category.subPermissions.forEach(sub => {
          newPermissions[category.id][sub.id] = checked;
        });
      }
    });
    setPermissions(newPermissions);
  };

  const handleManage = (role: any) => {
    setEditingRole(role);
    setRoleName(role.name);
    setRoleDescription(role.description || "");
    const iconObj = ICONS.find(i => i.icon === role.icon) || ICONS[0];
    setSelectedIcon(iconObj);
    setView("edit");
  };

  const resetForm = () => {
    setRoleName("");
    setRoleDescription("");
    setEditingRole(null);
    setSelectedIcon(ICONS[0]);
    setPermissions({});
    setEnableAll(false);
  };

  const handleSave = () => {
    // Validate
    if (!roleName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a role name",
        variant: "destructive",
      });
      return;
    }

    const newRole = {
      id: Date.now().toString(),
      name: roleName,
      description: roleDescription,
      icon: selectedIcon.icon,
      isArchived: false,
      permissions: permissions
    };

    setRoles(prev => [...prev, newRole]);
    console.log("Saving new role:", newRole);
    toast({
      title: "Success",
      description: "Role created successfully!",
    });
    setView("list");
    resetForm();
  };

  const handleUpdate = () => {
    if (!editingRole) return;

    // Validate
    if (!roleName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a role name",
        variant: "destructive",
      });
      return;
    }

    const updatedRole = {
      ...editingRole,
      name: roleName,
      description: roleDescription,
      icon: selectedIcon.icon,
      permissions: permissions
    };

    setRoles(prev => prev.map(role => 
      role.id === editingRole.id ? updatedRole : role
    ));
    
    console.log("Updating role:", updatedRole);
    toast({
      title: "Success",
      description: "Role updated successfully!",
    });
    setView("list");
    resetForm();
  };

  if (view === "add" || view === "edit") {
    return (
      <div className="flex flex-col min-h-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg text-left overflow-hidden">
        <CardHeader className="flex flex-col p-6 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-black dark:text-white" />
            </div>
            <div className="text-left">
              <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">Roles and permissions</CardTitle>
              <CardDescription className="text-sm font-medium text-gray-400 dark:text-gray-500">Manage roles and permissions</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-8">
          {/* Top Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Name</Label>
              <Input 
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                className="h-10 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Select Icon</Label>
              
              <Popover open={iconPickerOpen} onOpenChange={setIconPickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full h-10 px-3 justify-start gap-3 bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-700 font-normal text-gray-900 dark:text-white hover:bg-white"
                  >
                    <selectedIcon.icon className="w-4 h-4 text-black dark:text-white" />
                    <span>{selectedIcon.name}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 shadow-lg border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden rounded-md" align="start">
                  <div className="flex flex-col max-h-[300px] overflow-y-auto pt-1">
                    {ICONS.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => {
                          setSelectedIcon(item);
                          setIconPickerOpen(false);
                        }}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-slate-800 w-full text-left transition-colors",
                          selectedIcon.name === item.name ? "bg-gray-50 dark:bg-slate-800" : ""
                        )}
                      >
                        <item.icon className="w-4 h-4 text-black dark:text-white" />
                        <span className="flex-1 font-medium text-gray-900 dark:text-white">{item.name}</span>
                        {selectedIcon.name === item.name && (
                          <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                             <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Description</Label>
            <Textarea 
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
              className="min-h-[100px] border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950" 
            />
          </div>

          {/* Permissions Header */}
          <div className="flex items-center justify-between py-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Permissions</h3>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-gray-500">Enable / Disable all</span>
              <Switch checked={enableAll} onCheckedChange={handleEnableAll} className="data-[state=checked]:bg-blue-600" />
            </div>
          </div>

          {/* Permissions Accordion */}
          <Accordion type="single" collapsible className="w-full space-y-0 border-t border-gray-100 dark:border-slate-800">
            {PERMISSION_CATEGORIES.map((category) => (
              <AccordionItem key={category.id} value={category.id} className="border-b border-gray-100 dark:border-slate-800 px-0">
                <AccordionTrigger className="hover:no-underline py-4 px-2 hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center gap-3 text-gray-900 dark:text-white">
                    <category.icon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-bold">{category.name}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-10 py-4 bg-white dark:bg-slate-900/50">
                  <div className="space-y-6">
                    {category.subPermissions ? (
                      category.subPermissions.map((sub) => (
                        <div key={sub.id} className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-none">{sub.title}</h4>
                              {sub.hasInfo && <Info className="w-3.5 h-3.5 text-black dark:text-white opacity-60" />}
                            </div>
                            <p className="text-xs text-gray-400 dark:text-gray-500">{sub.description}</p>
                          </div>
                          <Switch 
                            checked={permissions[category.id]?.[sub.id] || false}
                            onCheckedChange={() => togglePermission(category.id, sub.id)}
                            className="data-[state=checked]:bg-blue-600" 
                          />
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500">
                        Configuration options for {category.name} will appear here.
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>

        <Separator className="bg-gray-100 dark:bg-slate-800" />

        <div className="p-6 flex justify-end gap-3 bg-white dark:bg-slate-900">
          <Button 
            variant="outline" 
            onClick={() => {
              setView("list");
              resetForm();
            }} 
            className="h-10 px-6 border-gray-200 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 font-bold"
          >
            Cancel
          </Button>
          {view === "add" ? (
            <Button 
              variant="outline"
              onClick={handleSave}
              className="h-10 px-8 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors font-bold"
            >
              Save
            </Button>
          ) : (
            <Button 
              variant="outline"
              onClick={handleUpdate}
              className="h-10 px-8 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors font-bold"
            >
              Update
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg text-left overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between p-6 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-black dark:text-white" />
          </div>
          <div className="text-left">
            <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">Roles and permissions</CardTitle>
            <CardDescription className="text-sm font-medium text-gray-400 dark:text-gray-500">Manage roles and permissions</CardDescription>
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={() => {
            resetForm();
            setView("add");
          }}
          className="h-9 px-4 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors text-sm font-bold"
        >
          Add role
        </Button>
      </CardHeader>

      <Separator className="bg-gray-100 dark:bg-slate-800" />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800/50">
          <TabsList className="flex items-center justify-start gap-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-lg h-auto w-fit">
            <TabsTrigger
              value="active"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-black dark:data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md px-6 py-2 text-xs font-bold whitespace-nowrap transition-all border-none"
            >
              Active
            </TabsTrigger>
            <TabsTrigger
              value="archived"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-black dark:data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md px-6 py-2 text-xs font-bold whitespace-nowrap transition-all border-none"
            >
              Archived
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="active" className="m-0 p-0">
          <div className="divide-y divide-gray-50 dark:divide-slate-800/50">
            {roles.filter(r => !r.isArchived).map((role) => (
              <div key={role.id} className="flex items-center justify-between p-6 hover:bg-gray-50/30 dark:hover:bg-slate-800/20 transition-colors">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-gray-50 dark:bg-slate-800/50">
                    <role.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{role.name}</span>
                    {role.description && (
                      <span className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-1">{role.description}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => confirmAction(role.id, 'archive')}
                    className="h-9 px-4 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-2"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    Archive
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleManage(role)}
                    className="h-9 px-4 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors text-xs font-bold"
                  >
                    Manage
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="archived" className="m-0 p-0">
          {roles.filter(r => r.isArchived).length > 0 ? (
            <div className="divide-y divide-gray-50 dark:divide-slate-800/50">
              {roles.filter(r => r.isArchived).map((role) => (
                <div key={role.id} className="flex items-center justify-between p-6 hover:bg-gray-50/30 dark:hover:bg-slate-800/20 transition-colors">
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-gray-50 dark:bg-slate-800/50">
                      <role.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{role.name}</span>
                      {role.description && (
                        <span className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-1">{role.description}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => confirmAction(role.id, 'activate')}
                      className="h-9 px-4 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors text-xs font-bold"
                    >
                      Activate
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-3 py-20">
              <Archive className="w-12 h-12 text-gray-200 dark:text-slate-700" />
              <p className="text-sm font-medium text-gray-400 dark:text-gray-500">No archived roles found</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent className="max-w-[400px] p-6 bg-white dark:bg-slate-900 border-none shadow-2xl rounded-xl">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/40 rounded-full flex items-center justify-center relative">
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[26px] border-b-orange-200 dark:border-b-orange-800/60 translate-y-[-2px]"></div>
                 </div>
                 <AlertCircle className="w-10 h-10 text-orange-600 relative z-10" strokeWidth={2.5} />
              </div>
            </div>
            
            <div className="space-y-2">
              <AlertDialogTitle className="text-xl font-bold text-[#1e293b] dark:text-white">Are you sure</AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Are you sure you want to continue?
              </AlertDialogDescription>
            </div>

            <AlertDialogFooter className="flex items-center justify-center gap-3 w-full sm:justify-center">
              <AlertDialogCancel asChild>
                <Button variant="outline" className="h-11 px-8 border-slate-200 text-slate-600 hover:bg-slate-50 font-bold min-w-[100px]">
                  Close
                </Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button 
                  onClick={executeAction}
                  className="h-11 px-10 bg-[#f97316] hover:bg-orange-600 text-white font-bold border-none min-w-[100px]"
                >
                  Yes
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
