import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  RefreshCw, 
  Trash2, 
  MoreVertical, 
  Plug, 
  Eye, 
  EyeOff, 
  CornerUpLeft, 
  Pen, 
  MessageSquare,
  X
} from "lucide-react";
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

// Mock data
const mockTelegramBots = [
  {
    id: 1,
    name: "My Business Bot",
    username: "my_business_bot",
    token: "123456789:ABCdefGHIjklMNOpqrsTUVwxyz",
    status: "ACTIVE",
    allow_in_feeder: true,
    auto_reply_automation_id: null,
    avatar: null
  },
];

export default function TelegramSection() {
  const [view, setView] = useState<"list" | "manage">("list");
  const [hasBots, setHasBots] = useState(true);
  const [bots, setBots] = useState(mockTelegramBots);
  const [showToken, setShowToken] = useState<Record<number, boolean>>({});

  // Dialog states
  const [showDefaultReply, setShowDefaultReply] = useState(false);
  const [selectedBot, setSelectedBot] = useState<typeof mockTelegramBots[0] | null>(null);
  const [autoReplyInterval, setAutoReplyInterval] = useState("0");

  const { toast } = useToast();

  const toggleTokenVisibility = (id: number) => {
    setShowToken(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSaveDefaultReply = () => {
    toast({
      title: "Success",
      description: "Default reply settings saved successfully.",
    });
    setShowDefaultReply(false);
  };

  const toggleFeeder = (botId: number) => {
    setBots(prev => prev.map(bot => {
      if (bot.id === botId) {
        return { ...bot, allow_in_feeder: !bot.allow_in_feeder };
      }
      return bot;
    }));
  };

  return (
    <div className="p-6">
      {view === "list" && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Telegram</h2>
            <p className="text-sm text-muted-foreground">
              Connect your Telegram Bot to automate conversations.
            </p>
          </div>
          <Separator className="bg-gray-200 dark:bg-slate-800" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6 shadow-sm bg-white dark:bg-slate-900 flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <img src="/images/automations/telegram.svg" alt="Telegram" className="h-6 w-6" />
                <h3 className="font-semibold text-sm">Telegram</h3>
              </div>
            </div>

            <div className="space-y-4 text-xs text-muted-foreground flex-grow">
              <p>
                The Telegram integration allows you to automate conversations on your Telegram Bot.
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
                <img src="/images/automations/telegram.svg" alt="Telegram" className="h-10 w-10 mr-2" />
                <div>
                  <h3 className="text-lg font-medium">Telegram</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Integrate your Telegram Bot to unlock 2-Way interactive dynamic conversations
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600"
                  onClick={() => setHasBots(true)}
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
            {!hasBots ? (
              <div className="p-12 flex flex-col items-center justify-center text-center space-y-4 py-24">
                <div className="bg-gradient-to-tr from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-700 p-4 rounded-full">
                  <img src="/images/automations/telegram.svg" alt="Telegram" className="h-12 w-12" />
                </div>
                <h2 className="text-lg font-semibold">Telegram is not integrated yet</h2>
                <p className="text-muted-foreground max-w-md text-sm">
                  Integrate this communication channel to automate conversations.
                </p>
                <div className="pt-2">
                  <Button 
                    className="bg-blue-600 text-white hover:bg-blue-700 min-w-[150px]"
                    onClick={() => setHasBots(true)}
                  >
                    Connect now
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-6 divide-y">
                {bots.map((bot) => (
                  <div key={bot.id} className="pb-6">
                    <div className="flex items-start py-5">
                      {/* Avatar */}
                      <div className="mr-6 text-center">
                        <div className="relative group cursor-pointer inline-block">
                          <div className="p-4 bg-white dark:bg-slate-800 border rounded-full w-[100px] h-[100px] flex items-center justify-center">
                            <img src="/images/automations/telegram.svg" className="w-10 h-10" alt="Bot Avatar" />
                          </div>
                          <div className="absolute inset-0 flex justify-center items-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <RefreshCw className="text-white h-5 w-5" />
                          </div>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grow space-y-5">
                        {/* Token Name Row */}
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label className="text-sm font-medium">Token Name</label>
                          <div className="col-span-2">
                            <input
                              type="text"
                              className="w-full px-3 py-2 border rounded-md bg-slate-50 dark:bg-slate-800 text-sm"
                              value={bot.name}
                              disabled
                            />
                          </div>
                          <div>
                            <ul className="flex space-x-4 items-center">
                              <li>
                                {bot.status === "ACTIVE" ? (
                                  <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                                    {bot.status}
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-xs text-red-500 border-red-400">
                                    {bot.status}
                                  </Badge>
                                )}
                              </li>
                              <li>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                                      <MoreVertical className="h-4 w-4" />
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-56">
                                    {bot.status === "ACTIVE" && (
                                      <DropdownMenuItem onClick={() => { setSelectedBot(bot); setShowDefaultReply(true); }}>
                                        <div className="flex items-center gap-3">
                                          <CornerUpLeft className="h-4 w-4" />
                                          <span>Auto Reply</span>
                                        </div>
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem>
                                      <div className="flex items-center gap-3">
                                        <Pen className="h-4 w-4" />
                                        <span>Edit</span>
                                      </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <div className="flex items-center gap-3 text-red-600">
                                        <Trash2 className="h-4 w-4" />
                                        <span>Delete</span>
                                      </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => { e.preventDefault(); toggleFeeder(bot.id); }}>
                                      <div className="flex items-center justify-between w-full gap-3">
                                        <div className="flex items-center gap-2">
                                          <Plug className="h-4 w-4" />
                                          <span>AI Feeder</span>
                                        </div>
                                        <Switch checked={bot.allow_in_feeder} />
                                      </div>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </li>
                            </ul>
                          </div>
                        </div>

                        {/* Telegram Code Row */}
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label className="text-sm font-medium">Telegram Code</label>
                          <div className="col-span-2">
                            <input
                              type="text"
                              className="w-full px-3 py-2 border rounded-md bg-slate-50 dark:bg-slate-800 text-sm"
                              value={`@${bot.username}`}
                              readOnly
                            />
                          </div>
                        </div>

                        {/* Token Label Row */}
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label className="text-sm font-medium">Token Label</label>
                          <div className="col-span-2 flex items-center gap-2">
                            <input
                              type={showToken[bot.id] ? "text" : "password"}
                              className="w-full px-3 py-2 border rounded-md bg-slate-50 dark:bg-slate-800 text-sm"
                              value={bot.token}
                              disabled
                            />
                          </div>
                          <div>
                            <button 
                              className="text-blue-500 hover:text-blue-600"
                              onClick={() => toggleTokenVisibility(bot.id)}
                            >
                              {showToken[bot.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Feature Buttons (Auto Reply) */}
                        {bot.status === "ACTIVE" && (
                          <div className="pt-2">
                            <button 
                              className="min-w-[15rem] border border-dashed px-3 py-5 rounded-md flex justify-center items-center hover:bg-slate-50 dark:hover:bg-slate-800 group"
                              onClick={() => {
                                setSelectedBot(bot);
                                setShowDefaultReply(true);
                              }}
                            >
                              <img src="/images/automations/telegram.svg" className="w-6 h-6 mr-3" alt="Telegram" />
                              <div className="text-sm">Auto Reply</div>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
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
              <img src="/images/settings/telegram-chat.png" className="w-full h-auto" alt="Telegram" />
            </div>
            <div className="col-span-2 p-6">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold">Send instant replies to incoming Messages</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Default Reply gets triggered when your contact sends you a message and it doesn't match any Keywords.
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
                        <SelectItem value="1">Welcome Message</SelectItem>
                        <SelectItem value="2">Customer Support</SelectItem>
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

                <div className="text-sm">
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

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button 
                    variant="outline"
                    onClick={() => setShowDefaultReply(false)}
                  >
                    Close
                  </Button>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
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
    </div>
  );
}
