import React, { useState } from "react";
import { MoreVertical, Trash2, Plug, RefreshCw, X } from "lucide-react";
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

// Mock data for demonstration
const mockMessengerPages = [
  {
    id: 1,
    name: "Byte Digital Internet & Marketing",
    page_id: "111251491894252",
    status: "ACTIVE",
    fail_reason: null,
    allow_in_feeder: true,
    auto_reply_automation_id: null,
  },
];

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
  const [autoReplyInterval, setAutoReplyInterval] = useState("0");

  const toggleFeeder = (pageId: number) => {
    setPages(prev => prev.map(page => {
      if (page.id === pageId) {
        return { ...page, allow_in_feeder: !page.allow_in_feeder };
      }
      return page;
    }));
  };

  return (
    <div className="p-6">
      {view === "list" && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Messenger</h2>
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
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/images/automations/messenger.svg" alt="Messenger" className="h-10 w-10 mr-2" />
                <div>
                  <h3 className="text-lg font-medium">Messenger</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Integrate your Facebook Page to unlock 2-Way interactive dynamic conversations via Messenger
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600"
                  onClick={() => setHasPages(true)}
                >
                  Add new
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
                    className="bg-blue-600 text-white hover:bg-blue-700 min-w-[150px]"
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
                      className="text-xs px-2 py-1 h-auto"
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="text-xs px-2 py-1 h-auto text-red-500 hover:text-red-600"
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
                        className="text-xs px-2 py-1 h-auto"
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
        <DialogContent className="max-w-5xl p-0">
          <div className="grid grid-cols-3">
            <div className="col-span-1 bg-slate-50 dark:bg-slate-900 p-5 flex justify-center items-center">
              <img src="/images/settings/messenger.svg" className="w-64 h-auto" alt="Messenger" />
            </div>
            <div className="col-span-2 p-6">
              <DialogHeader>
                <div className="flex justify-between items-center">
                  <DialogTitle className="text-lg font-medium">Quick Start - Help your customers get started</DialogTitle>
                  <button onClick={() => setShowDefaultReply(false)} className="p-2">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Trigger an automation to send an instant reply when someone sends you a message
                </p>
              </DialogHeader>

              <div className="mt-6 space-y-6">
                <div className="flex gap-3">
                  <div className="flex-grow">
                    <Label className="text-sm font-medium">Select Automation</Label>
                    <Select>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select an automation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Welcome Message</SelectItem>
                        <SelectItem value="2">Customer Support</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-1/3">
                    <Label className="text-sm font-medium">Trigger</Label>
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

                <div className="text-sm text-muted-foreground">
                  {autoReplyInterval === "0" && (
                    <p>This automation will trigger only once per conversation</p>
                  )}
                  {autoReplyInterval === "24" && (
                    <p>This automation will trigger once every 24 hours</p>
                  )}
                  {autoReplyInterval === "247" && (
                    <p>This automation will trigger every time a message is received</p>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button 
                    variant="outline"
                    onClick={() => setShowDefaultReply(false)}
                  >
                    Close
                  </Button>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
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
        <DialogContent className="max-w-5xl p-0">
          <div className="grid grid-cols-3">
            <div className="col-span-1 bg-slate-50 dark:bg-slate-900 p-5 flex justify-center items-center">
              <img src="/images/settings/messenger.svg" className="w-64 h-auto" alt="Messenger" />
            </div>
            <div className="col-span-2 p-6">
              <DialogHeader>
                <div className="flex justify-between items-center">
                  <DialogTitle className="text-lg font-medium">Quick Start - Help your customers get started</DialogTitle>
                  <button onClick={() => setShowQuickStarter(false)} className="p-2">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Quick Replies are suggested actions that help your customers get started with your bot
                </p>
              </DialogHeader>

              <div className="mt-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-1 flex flex-col border rounded-lg text-center hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                    <div className="flex flex-1 flex-col p-8">
                      <h3 className="text-sm font-medium">Start from scratch</h3>
                      <p className="mt-2 text-sm text-muted-foreground">Create your own quick replies from scratch</p>
                    </div>
                  </div>
                  <div className="col-span-1 flex flex-col border rounded-lg text-center hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                    <div className="flex flex-1 flex-col p-8">
                      <h3 className="text-sm font-medium">Assistant</h3>
                      <p className="mt-2 text-sm text-muted-foreground">Basic template to get started quickly</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Menu Dialog */}
      <Dialog open={showMainMenu} onOpenChange={setShowMainMenu}>
        <DialogContent className="max-w-5xl p-0">
          <div className="grid grid-cols-3">
            <div className="col-span-1 bg-slate-50 dark:bg-slate-900 p-5 flex justify-center items-center">
              <img src="/images/settings/messenger.svg" className="w-64 h-auto" alt="Messenger" />
            </div>
            <div className="col-span-2 p-6">
              <DialogHeader>
                <div className="flex justify-between items-center">
                  <DialogTitle className="text-lg font-medium">Main Menu</DialogTitle>
                  <button onClick={() => setShowMainMenu(false)} className="p-2">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Configure your Messenger main menu options
                </p>
              </DialogHeader>

              <div className="mt-6 space-y-6">
                <div className="border rounded-lg p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Main menu configuration options will appear here
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button 
                    variant="outline"
                    onClick={() => setShowMainMenu(false)}
                  >
                    Close
                  </Button>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Save
                  </Button>
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
              <img src="/images/settings/messenger.svg" className="w-64 h-auto" alt="Messenger" />
            </div>
            <div className="col-span-2 p-6">
              <DialogHeader>
                <div className="flex justify-between items-center">
                  <DialogTitle className="text-lg font-medium">Extended Engagements Topics</DialogTitle>
                  <button onClick={() => setShowExtendedEngagements(false)} className="p-2">
                    <X className="h-4 w-4" />
                  </button>
                </div>
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
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
