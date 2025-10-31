import { useState } from "react";
import { Search, RefreshCw, Eye, Download, Send, Phone, Mail } from "react-feather";
import { SiWhatsapp } from "react-icons/si";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import Breadcrumb from "@/components/Breadcrumb";

export default function ConversationsInbox() {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [showContactPanel, setShowContactPanel] = useState(true);
  const [customAttributes, setCustomAttributes] = useState<Record<string, string>>({
    "Customer Type": "Premium",
    "Last Purchase": "2024-01-15",
  });

  const mockConversations = [
    { id: 1, name: "John Doe", lastMessage: "Thanks for the help!", time: "2m ago", unread: 2, channel: "whatsapp" },
  { id: 2, name: "Jane Smith", lastMessage: "Can you send me the invoice?", time: "15m ago", unread: 0, channel: "whatsapp" },
  { id: 3, name: "Bob Johnson", lastMessage: "Order received, thank you!", time: "1h ago", unread: 1, channel: "whatsapp" },
  ];

  const mockMessages = [
    { id: 1, from: "user", text: "Hi, I need help with my order", time: "10:30 AM" },
    { id: 2, from: "agent", text: "Hello! I'd be happy to help. What's your order number?", time: "10:31 AM" },
    { id: 3, from: "user", text: "It's #ORD-12345", time: "10:32 AM" },
    { id: 4, from: "agent", text: "Let me check that for you...", time: "10:33 AM" },
    { id: 5, from: "user", text: "Thanks for the help!", time: "10:35 AM" },
  ];

  const addAttribute = () => {
    const key = prompt("Attribute key:");
    const value = prompt("Attribute value:");
    if (key && value) {
      setCustomAttributes({ ...customAttributes, [key]: value });
    }
  };

  return (
    <div className="h-full flex flex-col" data-testid="conversations-inbox">
      <div className="p-6 pb-4">
        <h1 className="text-3xl font-bold">Conversations</h1>
        <Breadcrumb items={["Conversations", "Inbox"]} />
      </div>

      <div className="flex-1 flex gap-4 px-6 pb-6 max-h-[calc(100vh-11rem)]">
        <Card className="w-80 flex flex-col border-t-4 border-t-primary overflow-hidden">
          <CardHeader className="space-y-4 pb-4 flex-shrink-0">
            <Tabs defaultValue="active">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="active" data-testid="tab-active">Active</TabsTrigger>
                <TabsTrigger value="expired" data-testid="tab-expired">Expired</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input placeholder="Search conversations..." className="pl-10 border-input focus:ring-2 focus:ring-ring" data-testid="input-search" />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="newest">
                <SelectTrigger className="flex-1" data-testid="select-sort">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <ScrollArea className="flex-1 overflow-auto">
            <div className="space-y-1 px-4 pb-4">
              {mockConversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`p-3 rounded-md cursor-pointer hover-elevate ${selectedConversation === conv.id ? "bg-accent" : ""}`}
                  onClick={() => setSelectedConversation(conv.id)}
                  data-testid={`conversation-${conv.id}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarFallback>{conv.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 bg-card rounded-full p-0.5">
                        <SiWhatsapp size={12} className="text-chart-2" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm">{conv.name}</span>
                        <span className="text-xs text-muted-foreground">{conv.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                    </div>
                    {conv.unread > 0 && (
                      <Badge variant="default" className="h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {conv.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        <Card className="flex-1 flex flex-col border-t-4 border-t-primary">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">John Doe</h3>
                <p className="text-sm text-muted-foreground">Active now</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="hover-elevate" data-testid="button-refresh">
                <RefreshCw size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="hover-elevate" onClick={() => setShowContactPanel(!showContactPanel)} data-testid="button-view-contact">
                <Eye size={18} />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover-elevate" data-testid="button-export">
                    <Download size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                  <DropdownMenuItem>Export as CSV</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <Separator />
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {mockMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.from === "agent" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] rounded-lg p-3 ${msg.from === "user" ? "bg-primary/10" : "bg-muted"}`} data-testid={`message-${msg.id}`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <Separator />
          <div className="p-4 flex-shrink-0">
            <div className="flex gap-2">
              <Input placeholder="Type a message..." className="flex-1" data-testid="input-message" />
              <Button size="icon" data-testid="button-send">
                <Send size={18} />
              </Button>
            </div>
          </div>
        </Card>

        {showContactPanel && (
          <Card className="w-72 border-t-4 border-t-primary" data-testid="contact-panel">
            <CardHeader>
              <CardTitle>Contact Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center gap-3">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-2xl">JD</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">John Doe</h3>
                  <p className="text-sm text-muted-foreground">Customer</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-3">Basic Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone size={14} />
                      <span>+1 234 567 8900</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail size={14} />
                      <span>john.doe@email.com</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-sm">Customer Profile</h4>
                    <Button variant="ghost" size="sm" onClick={addAttribute} className="hover-elevate h-7 text-xs" data-testid="button-add-attribute">
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(customAttributes).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between text-sm p-2 rounded-md bg-muted">
                        <span className="font-medium">{key}</span>
                        <span className="text-muted-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
