import React, { useState } from "react";
import { Search, RefreshCw, Eye, EyeOff, Download, Send, Phone, Mail, Plus, Filter, ArrowUp, Calendar, X, Image, Mic, Paperclip } from "react-feather";
import { GripVertical, MoreVertical } from "lucide-react";
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import Breadcrumb from "@/components/Breadcrumb";
import CustomDropdown from "@/components/CustomDropdown";
import { DateRange } from "react-day-picker";
import { AlertCircle } from "lucide-react";

// Generate a color based on the hash of a name
const getAvatarColor = (name: string) => {
  const colors = [
    "bg-red-100 text-red-700",
    "bg-blue-100 text-blue-700",
    "bg-green-100 text-green-700",
    "bg-yellow-100 text-yellow-700",
    "bg-purple-100 text-purple-700",
    "bg-pink-100 text-pink-700",
    "bg-indigo-100 text-indigo-700",
    "bg-cyan-100 text-cyan-700",
    "bg-orange-100 text-orange-700",
    "bg-teal-100 text-teal-700",
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }

  return colors[Math.abs(hash) % colors.length];
};

export default function ConversationsInbox() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [showContactPanel, setShowContactPanel] = useState(false); // Always start minimized by default
  const [activeTab, setActiveTab] = useState("all");
  const [agentStatus, setAgentStatus] = useState<"available" | "away">("available");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sidebarWidth, setSidebarWidth] = useState(384); // w-96 = 384px
  const [isDragging, setIsDragging] = useState(false);
  const [assignedAgent, setAssignedAgent] = useState<string | null>(null);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock agent list
  const agentOptions = [
    { id: "self", name: "Assign to Me" },
    { id: "agent-1", name: "Sarah Johnson" },
    { id: "agent-2", name: "Mike Chen" },
    { id: "agent-3", name: "Emma Davis" },
    { id: "agent-4", name: "Alex Rodriguez" },
  ];

  // Toggle contact panel visibility
  const handleToggleContactPanel = () => {
    setShowContactPanel(!showContactPanel);
  };

  // Filter and sort conversations
  const getFilteredConversations = () => {
    let filtered = conversations;

    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter(conv => conv.status === activeTab);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(conv =>
        conv.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by time
    filtered.sort((a, b) => {
      const timeA = parseInt(a.time.match(/\d+/)?.[0] || "0");
      const timeB = parseInt(b.time.match(/\d+/)?.[0] || "0");
      return sortOrder === "desc" ? timeB - timeA : timeA - timeB;
    });

    return filtered;
  };

  // Mark messages as read when conversation is selected
  const handleSelectConversation = (convId: number) => {
    setSelectedConversation(convId);
    setAssignedAgent(conversations.find(c => c.id === convId)?.assignedAgent || null);

    // Mark unread messages as read
    setConversations(conversations.map(conv =>
      conv.id === convId ? { ...conv, unread: 0 } : conv
    ));
  };

  // Handle assignment - changes status to active and assigns agent
  const handleAssignAgent = (agentId: string) => {
    if (selectedConversation) {
      const displayName = agentId === "self" ? "Self" : agentId;
      setConversations(conversations.map(c =>
        c.id === selectedConversation ? { ...c, assignedAgent: displayName, status: "active" } : c
      ));
      setAssignedAgent(displayName);
    }
  };

  // Export modal state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportDateRange, setExportDateRange] = useState<DateRange | undefined>(undefined);
  const [isExportDateOpen, setIsExportDateOpen] = useState(false);

  const handleExportConversations = () => {
    // Mock data for conversations
    const mockMessages = [
      { number: 1, status: "Completed", direction: "Inbound", senderName: "John Doe", content: "Hello, I need help", messageStatus: "Delivered" },
      { number: 2, status: "Completed", direction: "Outbound", senderName: "Agent Smith", content: "Hi! How can I assist?", messageStatus: "Delivered" },
      { number: 3, status: "Completed", direction: "Inbound", senderName: "John Doe", content: "I have a billing issue", messageStatus: "Delivered" },
    ];

    // Filter by date range if selected
    let dataToExport = mockMessages;
    if (exportDateRange?.from && exportDateRange?.to) {
      // In a real scenario, you'd filter based on message timestamps
      dataToExport = mockMessages;
    }

    // Create CSV
    const headers = ["Number", "Status", "Inbound/Outbound", "Sender Name", "Messages Content", "Messages Status"];
    const rows = dataToExport.map(msg => [
      msg.number,
      msg.status,
      msg.direction,
      msg.senderName,
      `"${msg.content}"`, // Wrap in quotes to handle commas
      msg.messageStatus,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(",")),
    ].join("\n");

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `conversations-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsExportModalOpen(false);
    setExportDateRange(undefined);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const newWidth = e.clientX - (document.querySelector('[data-sidebar]')?.getBoundingClientRect().left || 0);
    const minWidth = 345;
    const maxWidth = 600;

    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setSidebarWidth(newWidth);
    }
  };

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging]);
  const [customAttributes, setCustomAttributes] = useState<Record<string, string>>({
    "Customer Type": "Premium",
    "Last Purchase": "2024-01-15",
  });

  // Basic details state
  const [basicDetails, setBasicDetails] = useState({
    number: "+1 234 567 8900",
    email: "",
    gender: "",
    whatsappOptOut: "No",
    address: "",
  });

  // Edit basic details modal state
  const [isEditBasicDetailsOpen, setIsEditBasicDetailsOpen] = useState(false);
  const [editedBasicDetails, setEditedBasicDetails] = useState(basicDetails);

  const handleSaveBasicDetails = () => {
    setBasicDetails(editedBasicDetails);
    setIsEditBasicDetailsOpen(false);
  };

  const handleClearField = (field: keyof typeof basicDetails) => {
    setEditedBasicDetails({ ...editedBasicDetails, [field]: "" });
  };

  // Add custom attribute modal state
  const [isAddAttributeModalOpen, setIsAddAttributeModalOpen] = useState(false);
  const [newAttributeKey, setNewAttributeKey] = useState("");
  const [newAttributeValue, setNewAttributeValue] = useState("");

  const handleAddAttribute = () => {
    if (newAttributeKey.trim() && newAttributeValue.trim()) {
      setCustomAttributes({ ...customAttributes, [newAttributeKey]: newAttributeValue });
      setNewAttributeKey("");
      setNewAttributeValue("");
      setIsAddAttributeModalOpen(false);
    }
  };

  const [conversations, setConversations] = useState([
    // Queue (Unassigned)
    { id: 1, name: "John Doe", lastMessage: "Hi, I need help with my order", time: "2m ago", unread: 2, channel: "whatsapp", status: "queue", assignedAgent: null },
    { id: 2, name: "Jane Smith", lastMessage: "Can you send me the invoice?", time: "5m ago", unread: 3, channel: "whatsapp", status: "queue", assignedAgent: null },
    { id: 3, name: "Michael Chen", lastMessage: "I have a billing question", time: "8m ago", unread: 1, channel: "whatsapp", status: "queue", assignedAgent: null },

    // Active (Assigned)
    { id: 4, name: "Sarah Wilson", lastMessage: "Thank you for resolving this!", time: "1m ago", unread: 0, channel: "whatsapp", status: "active", assignedAgent: "Sarah Johnson" },
    { id: 5, name: "Bob Johnson", lastMessage: "Order received, thank you!", time: "3m ago", unread: 0, channel: "whatsapp", status: "active", assignedAgent: "Mike Chen" },
    { id: 6, name: "Emma Davis", lastMessage: "When will my refund be processed?", time: "12m ago", unread: 0, channel: "whatsapp", status: "active", assignedAgent: "Emma Davis" },

    // Completed (No assignments)
    { id: 7, name: "Alex Rodriguez", lastMessage: "Issue resolved successfully", time: "45m ago", unread: 0, channel: "whatsapp", status: "completed", assignedAgent: null },
    { id: 8, name: "Lisa Anderson", lastMessage: "Thanks for your help!", time: "2h ago", unread: 0, channel: "whatsapp", status: "completed", assignedAgent: null },
    { id: 9, name: "David Martinez", lastMessage: "Perfect, all set!", time: "3h ago", unread: 0, channel: "whatsapp", status: "completed", assignedAgent: null },

    // Spam (No assignments)
    { id: 10, name: "Unknown", lastMessage: "Click here for free money!!!", time: "30m ago", unread: 0, channel: "whatsapp", status: "spam", assignedAgent: null },
    { id: 11, name: "Promo Bot", lastMessage: "Limited time offer - 90% off!", time: "1h ago", unread: 0, channel: "whatsapp", status: "spam", assignedAgent: null },
  ]);

  // Messages per conversation
  const conversationMessagesData: Record<number, any[]> = {
    1: [
      { id: 1, from: "user", text: "Hi, I need help with my order", time: "10:30 AM", read: false },
      { id: 2, from: "agent", text: "Hello! I'd be happy to help. What's your order number?", time: "10:31 AM", read: false },
      { id: 3, from: "user", text: "It's #ORD-12345", time: "10:32 AM", read: false },
      { id: 4, from: "agent", text: "Let me check that for you...", time: "10:33 AM", read: false },
      { id: 5, from: "user", text: "Thanks for the help!", time: "10:35 AM", read: false },
    ],
    2: [
      { id: 1, from: "user", text: "Can you send me the invoice?", time: "2:15 PM", read: false },
      { id: 2, from: "agent", text: "Of course! Let me find that for you.", time: "2:16 PM", read: false },
      { id: 3, from: "user", text: "Thank you!", time: "2:17 PM", read: false },
    ],
    3: [
      { id: 1, from: "user", text: "I have a billing question", time: "3:45 PM", read: false },
      { id: 2, from: "user", text: "Are you there?", time: "3:50 PM", read: false },
    ],
    4: [
      { id: 1, from: "user", text: "This is amazing!", time: "11:00 AM", read: true },
      { id: 2, from: "agent", text: "Glad I could help!", time: "11:01 AM", read: true },
      { id: 3, from: "user", text: "Thank you for resolving this!", time: "11:02 AM", read: true },
    ],
    5: [
      { id: 1, from: "user", text: "Order received, thank you!", time: "9:30 AM", read: true },
    ],
    6: [
      { id: 1, from: "user", text: "When will my refund be processed?", time: "1:20 PM", read: true },
      { id: 2, from: "agent", text: "It should be processed within 3-5 business days.", time: "1:21 PM", read: true },
    ],
    7: [
      { id: 1, from: "user", text: "Great service!", time: "10:00 AM", read: true },
      { id: 2, from: "agent", text: "Thank you! We appreciate your business.", time: "10:01 AM", read: true },
      { id: 3, from: "user", text: "Issue resolved successfully", time: "10:02 AM", read: true },
    ],
    8: [
      { id: 1, from: "user", text: "Thanks for your help!", time: "4:30 PM", read: true },
      { id: 2, from: "agent", text: "You're welcome! Have a great day.", time: "4:31 PM", read: true },
    ],
    9: [
      { id: 1, from: "user", text: "Perfect, all set!", time: "2:00 PM", read: true },
    ],
    10: [
      { id: 1, from: "user", text: "Click here for free money!!!", time: "3:15 PM", read: false },
      { id: 2, from: "user", text: "Limited offer - act now!", time: "3:16 PM", read: false },
    ],
    11: [
      { id: 1, from: "user", text: "Limited time offer - 90% off!", time: "5:45 PM", read: false },
      { id: 2, from: "user", text: "Don't miss out!", time: "5:46 PM", read: false },
    ],
  };



  return (
    <div className="h-full flex flex-col" data-testid="conversations-inbox">
      <div className="p-6 pb-2">
        <h1 className="text-3xl font-bold">Conversations</h1>
        <Breadcrumb items={["Conversations", "Inbox"]} />
      </div>

      <div className="flex-1 flex gap-4 px-6 pb-6 max-h-[calc(100vh-10.5rem)]">
        {/* Left Sidebar */}
        <div className="relative group h-full" data-sidebar>
          <Card className="flex flex-col overflow-hidden shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0 h-full" style={{ width: `${sidebarWidth}px` }}>
          <CardHeader className="space-y-3 pb-3 flex-shrink-0">
            {/* Tabs */}
            <div className="flex justify-between border-b pb-0 w-full">
              {["All", "Queue", "Active", "Completed", "Spam"].map((tab) => {
                const tabKey = tab.toLowerCase();
                const count = tabKey === "all"
                  ? conversations.length
                  : conversations.filter(c => c.status === tabKey).length;
                return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tabKey)}
                  className={`flex flex-col items-center flex-1 px-2 py-2 text-xs font-medium border-b-2 transition-colors ${
                    activeTab === tabKey
                      ? "border-b-primary text-foreground"
                      : "border-b-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{tab}</span>
                  <span className="text-[10px] opacity-60">{count}</span>
                </button>
                );
              })}
            </div>

            {/* Search and Action Buttons */}
            <div className="flex gap-1 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  placeholder="Search name..."
                  className="pl-10 border-input h-9 text-xs"
                  data-testid="input-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="ghost" size="icon" className="h-9 w-9 [border-color:hsl(var(--input))]" title="Filter">
                <Filter size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 [border-color:hsl(var(--input))]"
                title="Sort by time"
                onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
              >
                <ArrowUp size={16} style={{ transform: sortOrder === "asc" ? "rotate(0deg)" : "rotate(180deg)" }} />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 [border-color:hsl(var(--input))]" title="Add conversation">
                <Plus size={16} />
              </Button>
            </div>
          </CardHeader>

          <ScrollArea className="flex-1 overflow-auto">
            <div className="space-y-1 px-2 pb-4">
              {getFilteredConversations().length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Search className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No conversations found</p>
                </div>
              ) : (
                getFilteredConversations().map((conv: any) => (
                  <div
                    key={conv.id}
                    className={`p-3 rounded-md cursor-pointer transition-colors ${
                      selectedConversation === conv.id ? "bg-accent" : "hover:bg-muted/50"
                    }`}
                    onClick={() => handleSelectConversation(conv.id)}
                    data-testid={`conversation-${conv.id}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 relative">
                        <Avatar className="absolute">
                          <AvatarFallback className={getAvatarColor(conv.name)}>
                            {(() => {
                              const parts = conv.name.trim().split(/\s+/).filter(p => p.length > 0);
                              if (parts.length === 0) return "U";
                              if (parts.length === 1) return parts[0][0].toUpperCase();
                              return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                            })()}
                          </AvatarFallback>
                        </Avatar>
                        {conv.unread > 0 && (
                          <Badge variant="default" className="absolute h-5 w-5 -top-1.5 left-7 flex items-center justify-center p-0 text-xs rounded-full">
                            {conv.unread}
                          </Badge>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1 gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-semibold text-sm truncate">{conv.name}</span>
                            {activeTab === "all" && (
                              <Badge
                                variant="outline"
                                className={`text-xs flex-shrink-0 ${
                                  conv.status === "queue" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                                  conv.status === "active" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                  conv.status === "completed" ? "bg-green-50 text-green-700 border-green-200" :
                                  "bg-red-50 text-red-700 border-red-200"
                                }`}
                              >
                                {conv.status}
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground flex-shrink-0">{conv.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate mb-1">{conv.lastMessage}</p>
                        {conv.assignedAgent && (
                          <p className="text-xs text-muted-foreground">Assigned to: <span className="font-medium">{conv.assignedAgent}</span></p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </Card>

        {/* Resize Handle Pill */}
        <button
          onMouseDown={handleMouseDown}
          className={`absolute top-1/2 flex items-center justify-center py-3 rounded-full transition-all z-10 ${
            isDragging
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground"
          }`}
          style={{ cursor: "col-resize", right: "-8px", top: "50%", transform: "translateY(-50%)" }}
          title="Drag to resize sidebar"
        >
          <GripVertical size={16} />
        </button>
        </div>

        {/* Main Content Area */}
        {selectedConversation ? (
          <Card className="flex-1 flex flex-col shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
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
                <Button variant="ghost" size="icon" className="hover-elevate" onClick={handleToggleContactPanel} data-testid="button-view-contact">
                  {showContactPanel ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover-elevate" data-testid="button-export">
                      <Download size={18} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsExportModalOpen(true)}>Export as CSV</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {selectedConversation && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="hover-elevate" data-testid="button-more-options">
                        <MoreVertical size={18} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {assignedAgent && (
                        <DropdownMenuItem
                          onClick={() => {
                            const conv = conversations.find(c => c.id === selectedConversation);
                            if (conv) {
                              setConversations(conversations.map(c =>
                                c.id === selectedConversation ? { ...c, status: "completed", assignedAgent: null } : c
                              ));
                              setAssignedAgent(null);
                            }
                          }}
                        >
                          Mark as Complete
                        </DropdownMenuItem>
                      )}
                      {assignedAgent && (
                        <DropdownMenuSeparator />
                      )}
                      <DropdownMenuItem
                        onClick={() => {
                          const conv = conversations.find(c => c.id === selectedConversation);
                          if (conv) {
                            setConversations(conversations.map(c =>
                              c.id === selectedConversation ? { ...c, status: "spam", assignedAgent: null } : c
                            ));
                            setAssignedAgent(null);
                          }
                        }}
                      >
                        Mark as Spam
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardHeader>
            <Separator />

            {/* Chat Status Notification */}
            {selectedConversation && (() => {
              const selectedConv = conversations.find(c => c.id === selectedConversation);
              const status = selectedConv?.status;

              if (status === "spam") {
                return (
                  <div className="bg-red-50 border-b border-red-200 px-4 py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                      <p className="text-sm text-red-800">
                        <strong>Chat marked as Spam!</strong>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        onClick={() => handleAssignAgent("self")}
                      >
                        Reassign to Me
                      </Button>
                      <CustomDropdown
                        options={agentOptions.filter(a => a.id !== "self")}
                        selected={selectedAgents}
                        onChange={(selected) => {
                          if (selected.length > 0) {
                            handleAssignAgent(selected[0]);
                            setSelectedAgents([]);
                          }
                        }}
                        placeholder="Reassign to Agent"
                        width="180px"
                      />
                    </div>
                  </div>
                );
              }

              if (status === "completed") {
                return (
                  <div className="bg-green-50 border-b border-green-200 px-4 py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <AlertCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <p className="text-sm text-green-800">
                        <strong>Chat marked as Completed!</strong>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        onClick={() => handleAssignAgent("self")}
                      >
                        Reassign to Me
                      </Button>
                      <CustomDropdown
                        options={agentOptions.filter(a => a.id !== "self")}
                        selected={selectedAgents}
                        onChange={(selected) => {
                          if (selected.length > 0) {
                            handleAssignAgent(selected[0]);
                            setSelectedAgents([]);
                          }
                        }}
                        placeholder="Reassign to Agent"
                        width="180px"
                      />
                    </div>
                  </div>
                );
              }

              if (!assignedAgent) {
                return (
                  <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <p className="text-sm text-amber-800">
                        <strong>Chat not assigned!</strong>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        onClick={() => handleAssignAgent("self")}
                      >
                        Assign to Me
                      </Button>
                      <CustomDropdown
                        options={agentOptions.filter(a => a.id !== "self")}
                        selected={selectedAgents}
                        onChange={(selected) => {
                          if (selected.length > 0) {
                            handleAssignAgent(selected[0]);
                            setSelectedAgents([]);
                          }
                        }}
                        placeholder="Assign to Agent"
                        width="180px"
                      />
                    </div>
                  </div>
                );
              }

              return null;
            })()}

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {(conversationMessagesData[selectedConversation!] || []).map((msg: any) => (
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

            {/* Message Input or Assignment Prompt */}
            {assignedAgent ? (
              <div className="p-4 flex-shrink-0">
                <div className="flex gap-2 items-center">
                  <Input placeholder="Type a message..." className="flex-1" data-testid="input-message" />
                  <Button variant="ghost" size="icon" className="h-9 w-9 [border-color:hsl(var(--input))]" title="Attach file">
                    <Paperclip size={18} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 [border-color:hsl(var(--input))]" title="Send picture">
                    <Image size={18} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 [border-color:hsl(var(--input))]" title="Send voice message">
                    <Mic size={18} />
                  </Button>
                  <Button size="icon" data-testid="button-send">
                    <Send size={18} />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-6 flex-shrink-0 bg-muted/30 flex flex-col items-center justify-center gap-3">
                <AlertCircle className="w-6 h-6 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">Assign this chat to start messaging</p>
                  <p className="text-xs text-muted-foreground mt-1">Use the assignment options above to get started</p>
                </div>
              </div>
            )}
          </Card>
        ) : (
          <Card className="flex-1 flex flex-col items-center justify-center shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
              <p className="text-sm text-muted-foreground">Choose a conversation from the list to start messaging</p>
            </div>
          </Card>
        )}

        {showContactPanel && (
          <Card className="w-72 shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0" data-testid="contact-panel">
            <CardHeader>
              <CardTitle>Contact Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center gap-3">
                {selectedConversation && (() => {
                  const selectedConv = conversations.find(c => c.id === selectedConversation);
                  const getInitials = (name: string) => {
                    const parts = name.trim().split(/\s+/).filter((p: string) => p.length > 0);
                    if (parts.length === 0) return "U";
                    if (parts.length === 1) return parts[0][0].toUpperCase();
                    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                  };
                  const initials = getInitials(selectedConv?.name || "");
                  return (
                    <>
                      <Avatar className="h-20 w-20">
                        <AvatarFallback className={`text-2xl ${getAvatarColor(selectedConv?.name || "")}`}>{initials}</AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <h3 className="font-semibold text-lg">{selectedConv?.name}</h3>
                        <p className="text-sm text-muted-foreground">Customer</p>
                      </div>
                    </>
                  );
                })()}
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-sm">Basic Details</h4>
                    <Button variant="ghost" size="sm" onClick={() => {
                      setEditedBasicDetails(basicDetails);
                      setIsEditBasicDetailsOpen(true);
                    }} className="hover-elevate h-7 text-xs [border-color:hsl(var(--input))]" data-testid="button-edit-basic-details">
                      Edit
                    </Button>
                  </div>
                  <div className="space-y-1 text-sm">
                    {basicDetails.number && (
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs text-muted-foreground">Number</span>
                        <span className="text-sm font-semibold truncate">{basicDetails.number}</span>
                      </div>
                    )}
                    {basicDetails.email && (
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs text-muted-foreground">Email</span>
                        <span className="text-sm font-semibold truncate">{basicDetails.email}</span>
                      </div>
                    )}
                    {basicDetails.gender && (
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs text-muted-foreground">Gender</span>
                        <span className="text-sm font-semibold truncate">{basicDetails.gender}</span>
                      </div>
                    )}
                    {basicDetails.whatsappOptOut && (
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs text-muted-foreground">WhatsApp Opt-out</span>
                        <span className="text-sm font-semibold truncate">{basicDetails.whatsappOptOut}</span>
                      </div>
                    )}
                    {basicDetails.address && (
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs text-muted-foreground">Address</span>
                        <span className="text-sm font-semibold truncate">{basicDetails.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-sm">Customer Profile</h4>
                    <Button variant="ghost" size="sm" onClick={() => setIsAddAttributeModalOpen(true)} className="hover-elevate h-7 text-xs [border-color:hsl(var(--input))]" data-testid="button-add-attribute">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(customAttributes).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs max-w-full"
                      >
                        <span className="truncate max-w-[calc(100%-20px)]">{key}: {value}</span>
                        <button
                          onClick={() => setCustomAttributes(Object.fromEntries(Object.entries(customAttributes).filter(([k]) => k !== key)))}
                          className="hover:text-blue-900 flex-shrink-0 border rounded"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Edit Basic Details Modal */}
        <Dialog open={isEditBasicDetailsOpen} onOpenChange={setIsEditBasicDetailsOpen}>
          <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
            <DialogHeader className="px-1">
              <DialogTitle>Edit Basic Details</DialogTitle>
            </DialogHeader>

            <div className="px-1 space-y-4 py-4 overflow-y-auto flex-1">
              {/* Number */}
              <div>
                <label className="text-sm font-medium mb-2 block">Number</label>
                <div className="flex gap-2">
                  <Input
                    value={editedBasicDetails.number}
                    onChange={(e) => setEditedBasicDetails({ ...editedBasicDetails, number: e.target.value })}
                    placeholder="Enter number"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleClearField("number")}
                    className="h-9 w-10 [border-color:hsl(var(--input))]"
                  >
                    ✕
                  </Button>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <div className="flex gap-2">
                  <Input
                    value={editedBasicDetails.email}
                    onChange={(e) => setEditedBasicDetails({ ...editedBasicDetails, email: e.target.value })}
                    placeholder="Enter email"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleClearField("email")}
                    className="h-9 w-10 [border-color:hsl(var(--input))]"
                  >
                    ✕
                  </Button>
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="text-sm font-medium mb-2 block">Gender</label>
                <div className="flex gap-2">
                  <Select value={editedBasicDetails.gender} onValueChange={(value) => setEditedBasicDetails({ ...editedBasicDetails, gender: value })}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleClearField("gender")}
                    className="h-9 w-9 [border-color:hsl(var(--input))]"
                  >
                    ✕
                  </Button>
                </div>
              </div>

              {/* WhatsApp Opt-out */}
              <div>
                <label className="text-sm font-medium mb-2 block">WhatsApp Opt-out</label>
                <div className="flex gap-2">
                  <Select value={editedBasicDetails.whatsappOptOut} onValueChange={(value) => setEditedBasicDetails({ ...editedBasicDetails, whatsappOptOut: value })}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleClearField("whatsappOptOut")}
                    className="h-9 w-9 [border-color:hsl(var(--input))]"
                  >
                    ✕
                  </Button>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="text-sm font-medium mb-2 block">Address</label>
                <div className="flex gap-2">
                  <Input
                    value={editedBasicDetails.address}
                    onChange={(e) => setEditedBasicDetails({ ...editedBasicDetails, address: e.target.value })}
                    placeholder="Enter address"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleClearField("address")}
                    className="h-9 w-10 [border-color:hsl(var(--input))]"
                  >
                    ✕
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter className="px-1">
              <Button variant="outline" onClick={() => setIsEditBasicDetailsOpen(false)} className="[border-color:hsl(var(--input))]">
                Close
              </Button>
              <Button onClick={handleSaveBasicDetails}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Custom Attribute Modal */}
        <Dialog open={isAddAttributeModalOpen} onOpenChange={setIsAddAttributeModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Custom Attribute</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Attribute Name</label>
                <Input
                  placeholder="e.g., Loyalty Status"
                  value={newAttributeKey}
                  onChange={(e) => setNewAttributeKey(e.target.value)}
                  data-testid="input-attribute-key"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Attribute Value</label>
                <Input
                  placeholder="e.g., Gold Member"
                  value={newAttributeValue}
                  onChange={(e) => setNewAttributeValue(e.target.value)}
                  data-testid="input-attribute-value"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddAttributeModalOpen(false)} className="[border-color:hsl(var(--input))]">
                Close
              </Button>
              <Button onClick={handleAddAttribute} disabled={!newAttributeKey || !newAttributeValue}>
                Add Attribute
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Export Modal */}
        <Dialog open={isExportModalOpen} onOpenChange={setIsExportModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Export Conversations</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Select Date Range</label>
                <Popover open={isExportDateOpen} onOpenChange={setIsExportDateOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="gap-2 w-full justify-start">
                      <Calendar size={16} />
                      <span>
                        {exportDateRange?.from && exportDateRange?.to
                          ? `${exportDateRange.from.toLocaleDateString()} - ${exportDateRange.to.toLocaleDateString()}`
                          : exportDateRange?.from
                          ? exportDateRange.from.toLocaleDateString()
                          : "Select Date Range"}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      initialFocus
                      mode="range"
                      defaultMonth={exportDateRange?.from}
                      selected={exportDateRange}
                      onSelect={(range) => {
                        // If both from and to are the same date, clear the range
                        if (
                          range?.from &&
                          range?.to &&
                          range.from.toDateString() === range.to.toDateString()
                        ) {
                          setExportDateRange(undefined);
                        } else {
                          setExportDateRange(range);
                        }
                      }}
                      numberOfMonths={1}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Export fields: Number, Status, Inbound/Outbound, Sender Name, Messages Content, Messages Status
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsExportModalOpen(false)} className="[border-color:hsl(var(--input))]">
                Cancel
              </Button>
              <Button onClick={handleExportConversations}>
                Export CSV
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
