import React, { useState } from "react";
import { MoreVertical, Trash2, Plug, RefreshCw, X, Link as LinkIcon, ExternalLink, Zap, ChevronLeft, Menu, Plus, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstration
const mockMessengerPages = [
  {
    id: 1,
    name: "Byte Digital Internet & Marketing",
    page_id: "111251491894252",
    status: "ACTIVE",
    fail_reason: null,
    picture: {
      file_url: "/images/messenger-profile.jpg"
    },
    allow_in_feeder: true,
    auto_reply_automation_id: null,
  },
];

interface MenuItem {
  id: string;
  text: string;
  type: 'postback' | 'web_url';
  payload: string;
  error_message?: string;
  modelable_id?: string;
}

export default function MessengerSection() {
  const [view, setView] = useState<"list" | "manage">("list");
  const [hasPages, setHasPages] = useState(true);
  const [pages, setPages] = useState(mockMessengerPages);

  // Dialog states
  const [showDefaultReply, setShowDefaultReply] = useState(false);
  const [showQuickStarter, setShowQuickStarter] = useState(false);
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [showExtendedEngagements, setShowExtendedEngagements] = useState(false);
  const [selectedPage, setSelectedPage] = useState<typeof mockMessengerPages[0] | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<typeof mockMessengerPages[0] | null>(null);
  
  // Feature states
  const [autoReplyInterval, setAutoReplyInterval] = useState("0");
  const [defaultReplyConfigured, setDefaultReplyConfigured] = useState(true);
  const [quickStarterConfigured, setQuickStarterConfigured] = useState(false);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const { toast } = useToast();

  const toggleFeeder = (pageId: number) => {
    setPages(prev => prev.map(page => {
      if (page.id === pageId) {
        return { ...page, allow_in_feeder: !page.allow_in_feeder };
      }
      return page;
    }));
  };

  const handleSaveDefaultReply = () => {
    setDefaultReplyConfigured(true);
    toast({
      title: "Success",
      description: "Default reply settings saved successfully.",
    });
    setShowDefaultReply(false);
  };

  const handleDeleteDefaultReply = () => {
    setDefaultReplyConfigured(false);
    toast({
      title: "Success",
      description: "Default reply deleted successfully.",
    });
    setShowDefaultReply(false);
  };

  const handleSaveMainMenu = () => {
    let isValid = true;
    const newItems = menuItems.map(item => {
      let error = undefined;
      if (!item.text.trim()) {
        error = "Text is required";
        isValid = false;
      } else if (item.type === 'web_url' && !item.payload) {
        error = "Link is required";
        isValid = false;
      } else if (item.type === 'postback' && !item.payload) {
        error = "Automation is required";
        isValid = false;
      }
      return { ...item, error_message: error };
    });

    setMenuItems(newItems);

    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the menu items.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Persistent menu saved and published successfully.",
    });
    setShowMainMenu(false);
  };

  const handleAddMenuItem = () => {
    if (menuItems.length >= 20) {
      toast({
        title: "Limit Reached",
        description: "You can only add up to 20 menu items.",
        variant: "destructive"
      });
      return;
    }
    const newItem: MenuItem = {
      id: Math.random().toString(36).substr(2, 9),
      text: "",
      type: 'postback',
      payload: ''
    };
    setMenuItems([...menuItems, newItem]);
  };

  const handleDeleteMenuItem = (index: number) => {
    const newItems = [...menuItems];
    newItems.splice(index, 1);
    setMenuItems(newItems);
  };

  const handleUpdateMenuItem = (index: number, updates: Partial<MenuItem>) => {
    const newItems = [...menuItems];
    newItems[index] = { ...newItems[index], ...updates, error_message: undefined };
    setMenuItems(newItems);
  };

  const handleDeleteQuickStarter = () => {
    setQuickStarterConfigured(false);
    toast({
      title: "Success",
      description: "Quick Starter deleted successfully.",
    });
    setShowQuickStarter(false);
  };

  const handleCreateQuickStarter = (type: string) => {
    setQuickStarterConfigured(true);
    toast({
      title: "Success",
      description: `Quick Starter created using ${type} template.`,
    });
    setShowQuickStarter(false);
  };

  const handleSaveExtendedEngagements = () => {
     toast({
      title: "Success",
      description: "Extended engagements topics saved successfully.",
    });
    setShowExtendedEngagements(false);
  };

  const handleRefresh = (pageName: string) => {
    toast({
      title: "Refreshing",
      description: `Refreshing data for ${pageName}...`,
    });
  };

  const handleDeletePage = (page: typeof mockMessengerPages[0]) => {
    setPageToDelete(page);
    setShowDeleteConfirm(true);
  };

  const confirmDeletePage = () => {
    if (pageToDelete) {
      setPages(prev => prev.filter(p => p.id !== pageToDelete.id));
      toast({
        title: "Page Deleted",
        description: `${pageToDelete.name} has been removed.`,
      });
      setShowDeleteConfirm(false);
      setPageToDelete(null);
    }
  };

  const handleConversionsAPI = (pageName: string) => {
    toast({
      title: "Conversions API",
      description: `Configuring Meta Conversions API for ${pageName}...`,
    });
  };

  return (
    <div className="p-6">
      {view === "list" && (
        <div className="space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Messenger</h2>
              <img src="/images/automations/messenger.svg" alt="Messenger" className="h-5 w-5" />
            </div>
            <p className="text-sm text-muted-foreground">
              Connect your Facebook Page to automate conversations.
            </p>
          </div>
          <Separator className="bg-gray-200 dark:bg-slate-800" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card: Messenger Integration */}
          <div className="border rounded-lg p-6 shadow-sm bg-white dark:bg-slate-900 flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <img src="/images/automations/messenger.svg" alt="Messenger" className="h-6 w-6" />
                <h3 className="font-semibold text-sm">Messenger</h3>
              </div>
            </div>

            <div className="space-y-4 text-xs text-muted-foreground flex-grow">
              <p>
                The Messenger integration allows you to automate conversations on your Facebook Page.
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
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">Messenger</h3>
                    <img src="/images/automations/messenger.svg" alt="Messenger" className="h-6 w-6" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Integrate your Facebook Page to unlock 2-Way interactive dynamic conversations via Messenger
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  className="btn-outline-primary"
                  onClick={() => setHasPages(true)}
                >
                  + Add New
                </Button>
                <Button variant="outline" onClick={() => setView("list")}>
                  Back
                </Button>
              </div>
            </div>
            <Separator className="bg-gray-200 dark:bg-slate-800" />

            {/* Content */}
            {!hasPages ? (
              <div className="p-12 flex flex-col items-center justify-center text-center space-y-4 py-24">
                <div className="bg-gradient-to-tr from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-700 p-4 rounded-full">
                  <img src="/images/automations/messenger.svg" alt="Messenger" className="h-12 w-12" />
                </div>
                <h2 className="text-lg font-semibold">No integration found</h2>
                <p className="text-muted-foreground max-w-md text-sm">
                  Integrate this communication channel to automate conversations.
                </p>
                <div className="pt-2">
                  <Button 
                    className="btn-outline-primary min-w-[150px]"
                    variant="outline"
                    onClick={() => setHasPages(true)}
                  >
                    Connect now
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-6 divide-y">
            {pages.map((page) => (
              <div key={page.id} className="pb-6">
                {/* Page Name */}
                <div className="grid grid-cols-4 gap-4 items-center mb-5">
                  <label className="text-sm font-medium">Page name</label>
                  <div className="col-span-2">
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-md bg-slate-50 dark:bg-slate-800 text-sm"
                      value={page.name}
                      disabled
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    {page.status === "ACTIVE" ? (
                      <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                        {page.status}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs text-red-500 border-red-400">
                        {page.status}
                      </Badge>
                    )}
                    <Button 
                      variant="outline"
                      size="sm"
                      className="text-xs px-2 py-1 h-auto btn-outline-primary"
                      onClick={() => handleRefresh(page.name)}
                      title="Refresh page data"
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="ghost"
                      size="sm"
                      className="text-xs px-2 py-1 h-auto btn-soft-destructive transition-all hover:scale-110 active:scale-90"
                      onClick={() => handleDeletePage(page)}
                      title="Delete page"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                    {page.status === "ACTIVE" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toggleFeeder(page.id)}>
                            <div className="flex items-center justify-between w-full gap-3">
                              <div className="flex items-center gap-2">
                                <Plug className="h-4 w-4" />
                                <span>AI Feeder</span>
                              </div>
                              <Switch checked={page.allow_in_feeder} />
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>

                {/* Page ID */}
                {page.page_id && (
                  <div className="grid grid-cols-4 gap-4 items-center mb-5">
                    <label className="text-sm font-medium">Page ID</label>
                    <div className="col-span-2">
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-md bg-slate-50 dark:bg-slate-800 text-sm"
                        value={page.page_id}
                        disabled
                        readOnly
                      />
                    </div>
                    <div>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="text-xs px-2 py-1 h-auto btn-outline-primary"
                        onClick={() => handleConversionsAPI(page.name)}
                      >
                        <i className="fa-brands fa-meta mr-2"></i>
                        Conversions API
                      </Button>
                    </div>
                  </div>
                )}

                {/* Feature Buttons */}
                {page.status === "ACTIVE" && (
                  <div className="mt-5 flex gap-6">
                    <button 
                      className="flex-1 border border-dashed px-3 py-5 rounded-md flex justify-center items-center hover:bg-slate-50 dark:hover:bg-slate-800"
                      onClick={() => {
                        setSelectedPage(page);
                        setShowDefaultReply(true);
                      }}
                    >
                      <img src="/images/automations/messenger.svg" className="w-5 h-5 mr-2" alt="Messenger" />
                      <div className="text-sm">Default Reply</div>
                    </button>
                    <button 
                      className="flex-1 border border-dashed px-3 py-5 rounded-md flex justify-center items-center hover:bg-slate-50 dark:hover:bg-slate-800"
                      onClick={() => {
                        setSelectedPage(page);
                        setShowQuickStarter(true);
                      }}
                    >
                      <img src="/images/automations/messenger.svg" className="w-5 h-5 mr-2" alt="Messenger" />
                      <div className="text-sm">Quick starter</div>
                    </button>
                    <button 
                      className="flex-1 border border-dashed px-3 py-5 rounded-md flex justify-center items-center hover:bg-slate-50 dark:hover:bg-slate-800"
                      onClick={() => {
                        setSelectedPage(page);
                        setShowMainMenu(true);
                      }}
                    >
                      <img src="/images/automations/messenger.svg" className="w-5 h-5 mr-2" alt="Messenger" />
                      <div className="text-sm">Main Menu</div>
                    </button>
                    <button 
                      className="flex-1 border border-dashed px-3 py-5 rounded-md flex justify-center items-center hover:bg-slate-50 dark:hover:bg-slate-800"
                      onClick={() => {
                        setSelectedPage(page);
                        setShowExtendedEngagements(true);
                      }}
                    >
                      <img src="/images/automations/messenger.svg" className="w-5 h-5 mr-2" alt="Messenger" />
                      <div className="text-sm">Extended engagements topics</div>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
        </div>
      )}

      {/* Default Reply Dialog */}
      <Dialog open={showDefaultReply} onOpenChange={setShowDefaultReply}>
        <DialogContent className="max-w-4xl p-0">
          <div className="grid grid-cols-3">
            <div className="col-span-1 bg-slate-50 dark:bg-slate-900 p-5 flex justify-center items-center">
              <img src="/images/settings/messenger-chat.svg" className="w-full h-auto" alt="Messenger" />
            </div>
            <div className="col-span-2 p-6">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold">Help customers start a conversation with your business</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Default reply provide a way for interacting with your customers.
                </p>
              </DialogHeader>

              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Select a Smart Flow</Label>
                    <Select>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select a Smart Flow" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">image message2</SelectItem>
                        <SelectItem value="2">Welcome Flow</SelectItem>
                        <SelectItem value="3">Customer Support</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">trigger</Label>
                    <Select value={autoReplyInterval} onValueChange={setAutoReplyInterval}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Once per conversation</SelectItem>
                        <SelectItem value="24">Once every 24 hours</SelectItem>
                        <SelectItem value="247">Always</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
                  {autoReplyInterval === "0" && (
                    <p>The <strong>Once per conversation</strong> option will be triggered once per conversation.</p>
                  )}
                  {autoReplyInterval === "24" && (
                    <p>The <strong>Once every 24 hours</strong> option will be triggered once every 24 hours.</p>
                  )}
                  {autoReplyInterval === "247" && (
                    <p>The <strong>Always</strong> option will be triggered <strong>Every time</strong> the contact sends a message that is not a Smart Flow keyword trigger, whether you're collecting data or the AI is asking a question.</p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {defaultReplyConfigured && (
                    <Button 
                      variant="ghost"
                      className="btn-soft-destructive transition-all hover:scale-105 active:scale-95"
                      onClick={handleDeleteDefaultReply}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  )}
                  <Button 
                    variant="secondary" className="bg-slate-100 hover:bg-slate-200 text-slate-700"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Automation
                  </Button>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button 
                    variant="outline"
                    onClick={() => setShowDefaultReply(false)}
                  >
                    Close
                  </Button>
                  <Button 
                    className="btn-outline-primary"
                    variant="outline"
                    onClick={handleSaveDefaultReply}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Starter Dialog */}
      <Dialog open={showQuickStarter} onOpenChange={setShowQuickStarter}>
        <DialogContent className="max-w-4xl p-0">
          <div className="grid grid-cols-3">
            <div className="col-span-1 bg-slate-50 dark:bg-slate-900 p-5 flex justify-center items-center">
              <img src="/images/settings/messenger-chat.svg" className="w-full h-auto" alt="Messenger" />
            </div>
            <div className="col-span-2 p-6">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold">Help customers start a conversation with your business</DialogTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Quick Starter provides a way for customers to initiate a conversation with your business by presenting a list of frequently asked questions. The Quick Starter API allows you to set a maximum of 4 questions.
                </p>
              </DialogHeader>

              <div className="mt-6 space-y-6">
                {/* How does it work section */}
                {quickStarterConfigured ? (
                   <div className="grid grid-cols-1 gap-4">
                    <div className="border rounded-lg p-8 text-center bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 cursor-pointer">
                      <h3 className="font-semibold mb-2">Quick Start</h3>
                      <p className="text-sm text-muted-foreground">Existing Quick Start configuration</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <h3 className="font-semibold mb-3">How does it work?</h3>
                      <div className="space-y-3">
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-semibold">
                            1
                          </div>
                          <p className="text-sm">
                            When a new contact opens a chat with your Facebook account, they will see buttons with the most commonly asked questions.
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-semibold">
                            2
                          </div>
                          <p className="text-sm">
                            When contact clicks the button, they receive a predefined message immediately
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Template cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <div 
                        className="border rounded-lg p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                        onClick={() => handleCreateQuickStarter('scratch')}
                      >
                        <h3 className="font-semibold mb-2">Create from scratch</h3>
                        <p className="text-sm text-muted-foreground">Create a template from scratch</p>
                      </div>
                      <div 
                        className="border rounded-lg p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                        onClick={() => handleCreateQuickStarter('basic')}
                      >
                        <h3 className="font-semibold mb-2">Start basic</h3>
                        <p className="text-sm text-muted-foreground">Start with a simple message</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {quickStarterConfigured && (
                 <div className="flex justify-end pt-4 border-t mt-4">
                    <Button 
                      variant="ghost"
                      className="btn-soft-destructive transition-all hover:scale-105 active:scale-95"
                      onClick={handleDeleteQuickStarter}
                    >
                      Delete
                    </Button>
                 </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Menu Dialog */}
      <Dialog open={showMainMenu} onOpenChange={setShowMainMenu}>
        <DialogContent className="max-w-6xl p-0 max-h-[90vh] overflow-hidden">
          <div className="grid grid-cols-3 h-full">
            <div className="col-span-2 p-6 overflow-y-auto">
              <DialogHeader className="border-b pb-4 mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <DialogTitle className="text-lg font-semibold">The Persistent Menu</DialogTitle>
                    <p className="text-sm text-muted-foreground mt-2">
                      The Persistent Menu enables you to create and display a menu showcasing the key features of your business, including operating hours, store locations, and products. It remains visible at all times during a person's Messenger conversation with your business.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => setShowMainMenu(false)}
                    >
                      Go back
                    </Button>
                    <Button 
                      className="btn-outline-primary"
                      variant="outline"
                      onClick={handleSaveMainMenu}
                    >
                      Save & Publish
                    </Button>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4">
                {/* Info box */}
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    You can add up to 20 menu items
                  </p>
                </div>

                {/* Menu items list */}
                <div className="space-y-2">
                  {menuItems.map((item, index) => (
                    <div key={item.id} className={`border rounded-lg p-4 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group ${item.error_message ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'bg-white dark:bg-slate-900'}`}>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 btn-soft-destructive transition-all hover:scale-110 active:scale-90 opacity-0 group-hover:opacity-100"
                        onClick={() => handleDeleteMenuItem(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      
                      {/* Menu item text input */}
                      <div className="flex-grow space-y-1">
                        <input 
                          type="text" 
                          value={item.text}
                          onChange={(e) => handleUpdateMenuItem(index, { text: e.target.value })}
                          className={`w-full text-center px-3 py-2 border rounded-md bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${item.error_message ? 'border-red-500' : ''}`}
                          placeholder="Enter menu item text"
                          maxLength={30}
                        />
                        {item.error_message && (
                          <p className="text-xs text-red-500 text-center">{item.error_message}</p>
                        )}
                      </div>

                      {/* Automation/Link indicator */}
                      <div className="flex items-center gap-2">
                         {item.type === 'postback' && (
                           <>
                             {item.modelable_id ? (
                               <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded" title="View Automation">
                                 <ExternalLink className="h-4 w-4" />
                               </button>
                             ) : (
                               <span className="p-2 text-red-500" title="Automation required"><Zap className="h-4 w-4" /></span>
                             )}
                           </>
                        )}
                        {item.type === 'web_url' && (
                           <button className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-950 rounded" title="Web URL">
                             <ExternalLink className="h-4 w-4" />
                           </button>
                        )}
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleUpdateMenuItem(index, { type: 'postback', payload: 'automation_id', modelable_id: '123' })}>
                              <Zap className="h-4 w-4 mr-2" />
                              Select automation
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateMenuItem(index, { type: 'web_url', payload: 'https://', modelable_id: undefined })}>
                              <LinkIcon className="h-4 w-4 mr-2" />
                              {item.type === 'web_url' ? 'Update Link' : 'Change to Link'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add menu item button */}
                {menuItems.length < 20 && (
                  <button 
                    onClick={handleAddMenuItem}
                    className="w-full border border-dashed border-blue-500 rounded-lg p-3 text-center hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors flex items-center justify-center gap-2"
                  >
                     <span className="text-blue-600 font-medium">+ Menu item</span>
                  </button>
                )}
              </div>
            </div>
            
            {/* Mobile preview panel */}
            <div className="col-span-1 bg-slate-50 dark:bg-slate-900 p-5 flex justify-center items-center overflow-y-auto border-l">
              <div className="relative w-[280px] h-[580px] bg-white dark:bg-black rounded-[3rem] shadow-xl border-8 border-gray-900 overflow-hidden flex flex-col">
                {/* Notch/Status Bar */}
                <div className="absolute top-0 w-full h-8 bg-white dark:bg-black z-20 flex justify-between items-center px-6 pt-2">
                   <span className="text-[10px] font-semibold dark:text-white">9:41</span>
                   <div className="flex gap-1">
                      <div className="w-3 h-3 bg-black dark:bg-white rounded-full opacity-20"></div>
                      <div className="w-3 h-3 bg-black dark:bg-white rounded-full opacity-20"></div>
                   </div>
                </div>

                {/* App Header */}
                <div className="mt-8 px-4 py-3 border-b flex justify-between items-center bg-white dark:bg-black z-10 shadow-sm">
                   <ChevronLeft className="h-6 w-6 text-blue-500" />
                   <div className="flex flex-col items-center">
                     <span className="font-semibold text-sm dark:text-white">Byte Digital...</span>
                     <span className="text-[10px] text-gray-400">Typically replies instantly</span>
                   </div>
                   <div className="w-6"></div> 
                </div>

                {/* App Content */}
                <div className="flex-1 overflow-y-auto bg-white dark:bg-black p-4 flex flex-col justify-end pb-4">
                   {/* Mock Chat Bubbles */}
                   <div className="space-y-3 mb-6 opacity-50">
                      <div className="flex justify-end">
                         <div className="bg-blue-500 text-white rounded-2xl rounded-tr-sm px-4 py-2 text-xs max-w-[80%]">
                           Hi, verify my account?
                         </div>
                      </div>
                      <div className="flex justify-start">
                         <div className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-sm px-4 py-2 text-xs max-w-[80%]">
                           Hello! Please verify your email to continue.
                         </div>
                      </div>
                   </div>

                   {/* Persistent Menu List (Simulated as open/visible) */}
                   {menuItems.length > 0 && (
                     <div className="mb-2">
                       <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
                         {menuItems.map((item, idx) => (
                            <div key={idx} className="p-3 border-b last:border-0 border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer flex justify-between items-center bg-white dark:bg-gray-900">
                               <span className="text-sm font-medium text-blue-600 dark:text-blue-400 truncate max-w-[180px]">{item.text || "Menu Item"}</span>
                            </div>
                         ))}
                       </div>
                     </div>
                   )}
                </div>

                {/* Bottom Bar */}
                <div className="h-14 bg-white dark:bg-black border-t flex items-center px-3 gap-2">
                   <div className="h-8 w-8 rounded-full flex items-center justify-center">
                      <Menu className="h-6 w-6 text-blue-600" />
                   </div>
                   <div className="flex-1 h-9 bg-gray-100 dark:bg-gray-800 rounded-full px-3 flex items-center">
                      <span className="text-xs text-gray-400">Aa</span>
                   </div>
                   <div className="h-6 w-6">
                      <Smile className="h-6 w-6 text-blue-600" />
                   </div>
                </div>
                
                {/* Home Indicator */}
                <div className="absolute bottom-1 w-full flex justify-center">
                   <div className="w-32 h-1 bg-gray-900 dark:bg-gray-100 rounded-full opacity-20"></div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Extended Engagements Dialog */}
      <Dialog open={showExtendedEngagements} onOpenChange={setShowExtendedEngagements}>
        <DialogContent className="max-w-5xl p-0">
          <div className="grid grid-cols-3">
            <div className="col-span-1 bg-slate-50 dark:bg-slate-900 p-5 flex justify-center items-center">
              <img src="/images/settings/messenger-chat.svg" className="w-64 h-auto" alt="Messenger" />
            </div>
            <div className="col-span-2 p-6">
              <DialogHeader>
                <DialogTitle className="text-lg font-medium">Extended Engagements Topics</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Configure extended engagement topics for your Messenger bot
                </p>
              </DialogHeader>

              <div className="mt-6 space-y-6">
                <div className="border rounded-lg p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Extended engagements configuration will appear here
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button 
                    variant="outline"
                    onClick={() => setShowExtendedEngagements(false)}
                  >
                    Close
                  </Button>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleSaveExtendedEngagements}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Page Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-600 flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Delete Facebook Page
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Are you sure you want to delete the Facebook page <span className="font-bold text-slate-900 dark:text-white">"{pageToDelete?.name}"</span>? 
              This action cannot be undone and all associated automations will stop working.
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
              onClick={confirmDeletePage}
            >
              Yes, delete page
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
