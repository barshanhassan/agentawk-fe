import React, { useState } from "react";
import { ChevronLeft, MoreVertical, Trash2, Plug, RefreshCw, X } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for demonstration
const mockInstagramAccounts = [
  {
    id: 1,
    name: "My Business Instagram",
    username: "@mybusiness",
    ig_user_id: "123456789",
    status: "ACTIVE",
    fail_reason: null,
    media_count: 245,
    followers_count: 12500,
    follows_count: 850,
    picture: {
      file_url: "https://via.placeholder.com/150"
    },
    allow_in_feeder: true,
    auto_reply_automation_id: null,
  },
];

export default function InstagramSection() {
  const [view, setView] = useState<"list" | "preferred_manage" | "old_manage">("list");
  const [hasAccounts, setHasAccounts] = useState(false);
  const [accounts, setAccounts] = useState(mockInstagramAccounts);
  
  // Dialog states
  const [showDefaultReply, setShowDefaultReply] = useState(false);
  const [showQuickStarter, setShowQuickStarter] = useState(false);
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<typeof mockInstagramAccounts[0] | null>(null);
  const [autoReplyInterval, setAutoReplyInterval] = useState("0");

  const toggleFeeder = (accountId: number) => {
    setAccounts(prev => prev.map(account => {
      if (account.id === accountId) {
        return { ...account, allow_in_feeder: !account.allow_in_feeder };
      }
      return account;
    }));
  };

  return (
    <div className="p-6">
      {view === "list" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Preferred Integration */}
          <div className="border rounded-lg p-6 shadow-sm bg-white dark:bg-slate-900 flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <img src="/images/automations/instagram.svg" alt="Instagram" className="h-6 w-6" />
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
                <img src="/images/automations/instagram.svg" alt="Instagram" className="h-6 w-6" />
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
          <div className="border rounded-lg p-4 shadow-sm bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/images/automations/instagram.svg" alt="Instagram" className="h-10 w-10 mr-2" />
                <div>
                  <h3 className="text-lg font-medium">Instagram</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Integrate your Instagram Business account to unlock 2-Way interactive dynamic conversations
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline"
                  className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600"
                  onClick={() => setHasAccounts(true)}
                >
                  Add new
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          {!hasAccounts ? (
            <div className="border rounded-lg p-12 shadow-sm bg-white dark:bg-slate-900 flex flex-col items-center justify-center text-center space-y-4 py-24">
              <div className="bg-gradient-to-tr from-pink-50 to-pink-100 dark:from-slate-800 dark:to-slate-700 p-4 rounded-full">
                <img src="/images/automations/instagram.svg" alt="Instagram" className="h-12 w-12" />
              </div>
              <h2 className="text-lg font-semibold">No integration found</h2>
              <p className="text-muted-foreground max-w-md text-sm">
                Integrate this communication channel to automate conversations.
              </p>
              <div className="pt-2">
                <Button 
                  className="bg-blue-600 text-white hover:bg-blue-700 min-w-[150px]"
                  onClick={() => setHasAccounts(true)}
                >
                  Connect now
                </Button>
              </div>
            </div>
          ) : (
            <div className="border rounded-lg shadow-sm bg-white dark:bg-slate-900 divide-y">
              {accounts.map((account) => (
                <div key={account.id} className="p-6">
                  {/* Profile Section */}
                  <div className="grid grid-cols-4 gap-4 items-center mb-5">
                    <label className="text-sm font-medium">Profile</label>
                    <div className="col-span-2">
                      <div className="flex gap-6">
                        {account.picture?.file_url && (
                          <img src={account.picture.file_url} alt={account.name} className="w-16 h-16 rounded-full" />
                        )}
                        <div className="flex gap-6 self-center">
                          {account.media_count > 0 && (
                            <div className="text-center">
                              <span className="font-bold text-lg block">{account.media_count}</span>
                              <span className="text-sm text-muted-foreground">Posts</span>
                            </div>
                          )}
                          {account.followers_count > 0 && (
                            <div className="text-center">
                              <span className="font-bold text-lg block">{account.followers_count.toLocaleString()}</span>
                              <span className="text-sm text-muted-foreground">Followers</span>
                            </div>
                          )}
                          {account.follows_count > 0 && (
                            <div className="text-center">
                              <span className="font-bold text-lg block">{account.follows_count}</span>
                              <span className="text-sm text-muted-foreground">Following</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Account Name */}
                  <div className="grid grid-cols-4 gap-4 items-center mb-5">
                    <label className="text-sm font-medium">Account Name</label>
                    <div className="col-span-2">
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-md bg-slate-50 dark:bg-slate-800 text-sm"
                        value={account.name}
                        disabled
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      {account.status === "ACTIVE" ? (
                        <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                          {account.status}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs text-red-500 border-red-400">
                          {account.status}
                        </Badge>
                      )}
                      <Button 
                        variant="outline"
                        size="sm"
                        className="text-xs px-2 py-1 h-auto bg-blue-600 text-white hover:bg-blue-700 border-blue-600 gap-2"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Refresh
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toggleFeeder(account.id)}>
                            <div className="flex items-center justify-between w-full gap-3">
                              <div className="flex items-center gap-2">
                                <Plug className="h-4 w-4" />
                                <span>AI Feeder</span>
                              </div>
                              <Switch checked={account.allow_in_feeder} />
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Username */}
                  {account.username && (
                    <div className="grid grid-cols-4 gap-4 items-center mb-5">
                      <label className="text-sm font-medium">Username</label>
                      <div className="col-span-2">
                        <input
                          type="text"
                          className="w-full px-3 py-2 border rounded-md bg-slate-50 dark:bg-slate-800 text-sm"
                          value={account.username}
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

                  {/* Instagram Page ID */}
                  {account.ig_user_id && (
                    <div className="grid grid-cols-4 gap-4 items-center mb-5">
                      <label className="text-sm font-medium">Instagram Page ID</label>
                      <div className="col-span-2">
                        <input
                          type="text"
                          className="w-full px-3 py-2 border rounded-md bg-slate-50 dark:bg-slate-800 text-sm"
                          value={account.ig_user_id}
                          disabled
                          readOnly
                        />
                      </div>
                    </div>
                  )}

                  {/* Feature Buttons */}
                  {account.status === "ACTIVE" && (
                    <div className="mt-5 flex gap-6">
                      <button 
                        className="flex-1 border border-dashed px-3 py-5 rounded-md flex justify-center items-center hover:bg-slate-50 dark:hover:bg-slate-800"
                        onClick={() => {
                          setSelectedAccount(account);
                          setShowDefaultReply(true);
                        }}
                      >
                        <img src="/images/automations/instagram.svg" className="w-5 h-5 mr-2" alt="Instagram" />
                        <div className="text-sm">Default Reply</div>
                      </button>
                      <button 
                        className="flex-1 border border-dashed px-3 py-5 rounded-md flex justify-center items-center hover:bg-slate-50 dark:hover:bg-slate-800"
                        onClick={() => {
                          setSelectedAccount(account);
                          setShowQuickStarter(true);
                        }}
                      >
                        <img src="/images/automations/instagram.svg" className="w-5 h-5 mr-2" alt="Instagram" />
                        <div className="text-sm">Quick Start</div>
                      </button>
                      <button 
                        className="flex-1 border border-dashed px-3 py-5 rounded-md flex justify-center items-center hover:bg-slate-50 dark:hover:bg-slate-800"
                        onClick={() => {
                          setSelectedAccount(account);
                          setShowMainMenu(true);
                        }}
                      >
                        <img src="/images/automations/instagram.svg" className="w-5 h-5 mr-2" alt="Instagram" />
                        <div className="text-sm">Main Menu</div>
                      </button>
                    </div>
                  )}

                  {/* Disconnected Status */}
                  {account.status === "DISCONNECTED" && (
                    <div className="grid grid-cols-4 gap-4 items-start mb-5">
                      <label className="text-sm font-medium">Status</label>
                      <div className="col-span-2">
                        <textarea
                          className="w-full px-3 py-2 border rounded-md bg-slate-50 dark:bg-slate-800 text-sm resize-none"
                          rows={4}
                          value="This Instagram account has been disconnected. Please reconnect to continue using this integration."
                          disabled
                          readOnly
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {view === "old_manage" && (
        <div className="space-y-6">
          {/* Header */}
          <div className="border rounded-lg p-4 shadow-sm bg-white dark:bg-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/images/automations/instagram.svg" alt="Instagram" className="h-10 w-10" />
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
              <img src="/images/automations/instagram.svg" alt="Instagram" className="h-12 w-12" />
            </div>
            <h2 className="text-lg font-semibold">Instagram account is not connected yet</h2>
            <p className="text-muted-foreground max-w-lg">
              This integration method is no longer supported. Please use the new Instagram integration method that only requires Instagram Login for authentication.
            </p>
          </div>
        </div>
      )}

      {/* Default Reply Dialog */}
      <Dialog open={showDefaultReply} onOpenChange={setShowDefaultReply}>
        <DialogContent className="max-w-5xl p-0">
          <div className="grid grid-cols-3">
            <div className="col-span-1 bg-slate-50 dark:bg-slate-900 p-5 flex justify-center items-center">
              <img src="/images/settings/instagram.svg" className="w-64 h-auto" alt="Instagram" />
            </div>
            <div className="col-span-2 p-6">
              <DialogHeader>
                <div className="flex justify-between items-center">
                  <DialogTitle className="text-lg font-medium">Instant Replies</DialogTitle>
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
              <img src="/images/settings/instagram.svg" className="w-64 h-auto" alt="Instagram" />
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
              <img src="/images/settings/instagram.svg" className="w-64 h-auto" alt="Instagram" />
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
                  Configure your Instagram main menu options
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
    </div>
  );
}
