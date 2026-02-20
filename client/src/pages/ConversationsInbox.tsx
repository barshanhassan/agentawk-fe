import React, { useState, useRef, useEffect } from "react";
import { Search, RefreshCw, Eye, EyeOff, Download, Send, Phone, Mail, Plus, Filter, ArrowUp, X, Image, Mic, MicOff, Paperclip, XCircle, Smile, Trash2 } from "react-feather";
import { GripVertical, MoreVertical, ChevronDown, User, ListFilter, CheckCircle, AlertOctagon, UserX } from "lucide-react";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatConversationTime, formatMessageDate, formatMessageTime } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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

import { Separator } from "@/components/ui/separator";
import Breadcrumb from "@/components/Breadcrumb";
import CustomDropdown from "@/components/CustomDropdown";
import { AlertCircle } from "lucide-react";
import PreviewV2 from "@/components/PreviewV2";
import { Textarea } from "@/components/ui/textarea";
import { getAvatarColor } from "@/lib/avatar-utils";
import ContactProfileSidebar from "@/components/ContactProfileSidebar";


// Helper function to get display name - defaults to phone number if displayName not set
const getDisplayName = (conversation: any): string => {
  return conversation.displayName?.trim() || conversation.phoneNumber || conversation.name || "Unknown";
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
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Filter State
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<any[]>([]);
  const [draggedFilterId, setDraggedFilterId] = useState<string | null>(null);
  const [openFilterColumnDropdown, setOpenFilterColumnDropdown] = useState<string | null>(null);
  const [openFilterOperatorDropdown, setOpenFilterOperatorDropdown] = useState<string | null>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // New Header Dropdowns State
  const [selectedFilterAgents, setSelectedFilterAgents] = useState<string[]>([]);
  const [selectedFilterChannels, setSelectedFilterChannels] = useState<string[]>([]);

  const channelOptions = [
    { id: "whatsapp", name: "Whatsapp", icon: React.createElement("img", { src: "/images/automations/whatsapp.svg", alt: "WhatsApp", className: "w-3.5 h-3.5" }) },
    { id: "instagram", name: "Instagram", icon: React.createElement("img", { src: "/images/automations/instagram.svg", alt: "Instagram", className: "w-3.5 h-3.5" }) },
    { id: "messenger", name: "Messenger", icon: React.createElement("img", { src: "/images/automations/messenger.svg", alt: "Messenger", className: "w-3.5 h-3.5" }) },
  ];

  // Filter Handlers
  const addFilter = () => {
    setFilters([...filters, { id: Date.now().toString(), column: "name", operator: "contains", value: "" }]);
  };

  const removeFilter = (id: string) => {
    setFilters(filters.filter(f => f.id !== id));
  };

  const updateFilter = (id: string, column: string, operator: string, value: string) => {
    setFilters(filters.map(f => f.id === id ? { ...f, column, operator, value } : f));
  };

  const handleFilterDragStart = (id: string) => {
    setDraggedFilterId(id);
  };

  const handleFilterDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleFilterDrop = (targetId: string) => {
    if (!draggedFilterId || draggedFilterId === targetId) return;

    const draggedIndex = filters.findIndex(f => f.id === draggedFilterId);
    const targetIndex = filters.findIndex(f => f.id === targetId);

    const newFilters = [...filters];
    [newFilters[draggedIndex], newFilters[targetIndex]] = [newFilters[targetIndex], newFilters[draggedIndex]];
    setFilters(newFilters);
    setDraggedFilterId(null);
  };

  // Current user
  const currentUser = { id: "self", name: "Demo User" };

  // Mock agent list
  const agentOptions = [
    {
      id: "self",
      name: currentUser.name,
      icon: React.createElement("div", { className: "w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-semibold text-white" }, "DU")
    },
    {
      id: "agent-1",
      name: "Sarah Johnson",
      icon: React.createElement("div", { className: "w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-semibold text-white" }, "SJ")
    },
    {
      id: "agent-2",
      name: "Mike Chen",
      icon: React.createElement("div", { className: "w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-[10px] font-semibold text-white" }, "MC")
    },
    {
      id: "agent-3",
      name: "Emma Davis",
      icon: React.createElement("div", { className: "w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-[10px] font-semibold text-white" }, "ED")
    },
    {
      id: "agent-4",
      name: "Alex Rodriguez",
      icon: React.createElement("div", { className: "w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-[10px] font-semibold text-white" }, "AR")
    },
  ];

  // Helper function to get agent name by ID
  const getAgentName = (agentId: string | null) => {
    if (!agentId) return "";
    const agent = agentOptions.find(a => a.id === agentId);
    return agent?.name || agentId;
  };

  // Toggle contact panel visibility
  const handleToggleContactPanel = () => {
    const newShowState = !showContactPanel;
    setShowContactPanel(newShowState);

    if (selectedConversation) {
      const closedProfiles = JSON.parse(localStorage.getItem('closed_contact_profiles') || '[]');
      if (!newShowState) {
        // User closed it, remember this
        if (!closedProfiles.includes(selectedConversation)) {
          closedProfiles.push(selectedConversation);
          localStorage.setItem('closed_contact_profiles', JSON.stringify(closedProfiles));
        }
      } else {
        // User opened it, remove from closed list
        const newClosedProfiles = closedProfiles.filter((id: any) => id !== selectedConversation);
        localStorage.setItem('closed_contact_profiles', JSON.stringify(newClosedProfiles));
      }
    }
  };

  // Restore profile state when conversation changes
  useEffect(() => {
    if (selectedConversation) {
      const closedProfiles = JSON.parse(localStorage.getItem('closed_contact_profiles') || '[]');
      // Default is OPEN (true), so if it's in the closed list, set to false.
      setShowContactPanel(!closedProfiles.includes(selectedConversation));
    } else {
      setShowContactPanel(false);
    }
  }, [selectedConversation]);

  // Get the actual last message from conversation messages
  const getLastMessage = (convId: number): string => {
    const messages = conversationMessagesData[convId] || [];
    if (messages.length === 0) return "";
    return messages[messages.length - 1].text;
  };

  // Calculate pending messages count
  const getPendingMessagesCount = (convId: number): number => {
    const conv = conversations.find(c => c.id === convId);
    // Don't show pending for completed or spam chats
    if (conv?.status === "completed" || conv?.status === "spam") {
      return 0;
    }

    const messages = conversationMessagesData[convId] || [];
    if (messages.length === 0) return 0;

    // Find the last agent message
    let lastAgentMessageIndex = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].from === "agent") {
        lastAgentMessageIndex = i;
        break;
      }
    }

    // If no agent message, all user messages are pending
    if (lastAgentMessageIndex === -1) {
      return messages.filter(m => m.from === "user").length;
    }

    // Count user messages after the last agent message
    return messages.slice(lastAgentMessageIndex + 1).filter(m => m.from === "user").length;
  };

  // Filter and sort conversations
  const getFilteredConversations = () => {
    let filtered = conversations;

    // Filter by tab
    if (activeTab !== "all") {
      if (activeTab === "active") {
        // Only show active chats assigned to me
        filtered = filtered.filter(conv => conv.status === "active" && conv.assignedAgent === "self");
      } else {
        filtered = filtered.filter(conv => conv.status === activeTab);
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(conv =>
        getDisplayName(conv).toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by Select Agents Dropdown
    if (selectedFilterAgents.length > 0) {
      filtered = filtered.filter(conv => selectedFilterAgents.includes(conv.assignedAgent || ""));
    }

    // Filter by Select Channels Dropdown
    if (selectedFilterChannels.length > 0) {
      filtered = filtered.filter(conv => selectedFilterChannels.includes(conv.channel || ""));
    }

    // Advanced Filters
    if (filters.length > 0) {
      filtered = filtered.filter(conv => {
        return filters.every(filter => {
          let itemValue = "";
          if (filter.column === "name") {
            itemValue = getDisplayName(conv);
          } else if (filter.column === "phoneNumber") {
            itemValue = conv.phoneNumber || "";
          } else if (filter.column === "tags") {
            const tags = tagsByConv[conv.id] || [];
            itemValue = tags.join(" ");
          }

          const filterValue = (filter.value || "").toLowerCase();
          const checkValue = itemValue.toLowerCase();

          switch (filter.operator) {
            case "contains": return checkValue.includes(filterValue);
            case "does not contain": return !checkValue.includes(filterValue);
            case "is": return checkValue === filterValue;
            case "is not": return checkValue !== filterValue;
            case "is empty": return !itemValue || itemValue.trim() === "";
            case "is not empty": return itemValue && itemValue.trim() !== "";
            default: return true;
          }
        });
      });
    }

    // Filter by teams (Legacy/Existing)
    if (filterTeams.length > 0) {
      filtered = filtered.filter(conv => {
        const convTeams = involvedTeamsByConv[conv.id] || [];
        return filterTeams.some(teamId => convTeams.includes(teamId));
      });
    }

    // Filter by agents (Legacy/Existing - usually superceded by Select Agents above)
    if (filterAgents.length > 0) {
      filtered = filtered.filter(conv => {
        return filterAgents.includes(conv.assignedAgent || "");
      });
    }

    // Sort by time
    filtered.sort((a, b) => {
      // Get dynamic time from messages if available, relative to NOW.
      // Note: We use the *latest* message time.
      const getLastTime = (convId: number, defaultTime: string) => {
        const msgs = conversationMessagesData[convId];
        if (msgs && msgs.length > 0) {
          return msgs[msgs.length - 1].time;
        }
        return defaultTime;
      };

      const timeA = getLastTime(a.id, a.time);
      const timeB = getLastTime(b.id, b.time);

      return sortOrder === "desc"
        ? new Date(timeB).getTime() - new Date(timeA).getTime()
        : new Date(timeA).getTime() - new Date(timeB).getTime();
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
      setConversations(conversations.map(c =>
        c.id === selectedConversation ? { ...c, assignedAgent: agentId, status: "active" } : c
      ));
      setAssignedAgent(agentId);
    }
  };

  const handleExportConversations = () => {
    // Mock data for conversations
    const mockMessages = [
      { number: 1, status: "Completed", direction: "Inbound", senderName: "John Doe", content: "Hello, I need help", messageStatus: "Delivered" },
      { number: 2, status: "Completed", direction: "Outbound", senderName: "Agent Smith", content: "Hi! How can I assist?", messageStatus: "Delivered" },
      { number: 3, status: "Completed", direction: "Inbound", senderName: "John Doe", content: "I have a billing issue", messageStatus: "Delivered" },
    ];

    // Create CSV
    const headers = ["Number", "Status", "Inbound/Outbound", "Sender Name", "Messages Content", "Messages Status"];
    const rows = mockMessages.map(msg => [
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
  const [customAttributesByConv, setCustomAttributesByConv] = useState<Record<number, Record<string, string>>>({
    1: { "Customer Type": "Premium", "Last Purchase": "2024-01-15" },
    2: { "Order Status": "Pending" },
    3: {},
    4: { "VIP": "Yes" },
    5: {},
    6: { "Refund Status": "Processing" },
    7: {},
    8: {},
    9: {},
    10: {},
    11: {},
  });

  // Basic details state per conversation
  const [basicDetailsByConv, setBasicDetailsByConv] = useState<Record<number, any>>({
    1: { displayName: "John Doe", number: "+1 234 567 8900", email: "john@example.com", gender: "Male", whatsappOptOut: "No", address: "123 Main St" },
    2: { displayName: "Jane Smith", number: "+1 234 567 8901", email: "jane@example.com", gender: "Female", whatsappOptOut: "No", address: "" },
    3: { displayName: "Michael Chen", number: "+1 234 567 8902", email: "", gender: "", whatsappOptOut: "No", address: "" },
    4: { displayName: "Sarah Wilson", number: "+1 234 567 8903", email: "sarah@example.com", gender: "Female", whatsappOptOut: "No", address: "" },
    5: { displayName: "Bob Johnson", number: "+1 234 567 8904", email: "bob@example.com", gender: "Male", whatsappOptOut: "No", address: "" },
    6: { displayName: "Emma Davis", number: "+1 234 567 8905", email: "emma@example.com", gender: "Female", whatsappOptOut: "No", address: "" },
    7: { displayName: "Alex Rodriguez", number: "+1 234 567 8906", email: "alex@example.com", gender: "Male", whatsappOptOut: "No", address: "" },
    8: { displayName: "Lisa Anderson", number: "+1 234 567 8907", email: "lisa@example.com", gender: "Female", whatsappOptOut: "No", address: "" },
    9: { displayName: "David Martinez", number: "+1 234 567 8908", email: "david@example.com", gender: "Male", whatsappOptOut: "No", address: "" },
    10: { displayName: "", number: "", email: "", gender: "", whatsappOptOut: "No", address: "" },
    11: { displayName: "", number: "", email: "", gender: "", whatsappOptOut: "No", address: "" },
  });

  // Involved teams state per conversation
  const [involvedTeamsByConv, setInvolvedTeamsByConv] = useState<Record<number, string[]>>({
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: [],
  });

  // Team options
  const teamOptions = [
    { id: "team-1", name: "Sales Team" },
    { id: "team-2", name: "Support Team" },
    { id: "team-3", name: "Technical Team" },
    { id: "team-4", name: "Marketing Team" },
  ];

  // Tags state per conversation
  const [tagsByConv, setTagsByConv] = useState<Record<number, string[]>>({
    1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [],
  });

  // Tag options
  const tagOptions = [
    { id: "tag-1", name: "VIP" },
    { id: "tag-2", name: "Lead" },
    { id: "tag-3", name: "Complaint" },
    { id: "tag-4", name: "Billing Issue" },
  ];

  // Notes state per conversation
  const [notesByConv, setNotesByConv] = useState<Record<number, string[]>>({
    1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [],
  });

  // Update handlers for ContactProfileSidebar
  const handleUpdateBasicDetails = (details: any) => {
    if (selectedConversation) {
      setBasicDetailsByConv({ ...basicDetailsByConv, [selectedConversation]: details });

      // Update the conversation's displayName if it was changed
      if (details.displayName !== undefined) {
        setConversations(conversations.map(conv =>
          conv.id === selectedConversation
            ? { ...conv, displayName: details.displayName }
            : conv
        ));
      }
    }
  };

  const handleUpdateInvolvedTeams = (teams: string[]) => {
    if (selectedConversation) {
      setInvolvedTeamsByConv({ ...involvedTeamsByConv, [selectedConversation]: teams });
    }
  };

  const handleUpdateTags = (tags: string[]) => {
    if (selectedConversation) {
      setTagsByConv({ ...tagsByConv, [selectedConversation]: tags });
    }
  };

  const handleUpdateCustomAttributes = (attributes: Record<string, string>) => {
    if (selectedConversation) {
      setCustomAttributesByConv({ ...customAttributesByConv, [selectedConversation]: attributes });
    }
  };

  const handleUpdateNotes = (notes: string[]) => {
    if (selectedConversation) {
      setNotesByConv({ ...notesByConv, [selectedConversation]: notes });
    }
  };

  // Filter modal state
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterTeams, setFilterTeams] = useState<string[]>([]);
  const [filterAgents, setFilterAgents] = useState<string[]>([]);
  const [selectedTeamsForModal, setSelectedTeamsForModal] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string[]>([]);

  // Image Preview State
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Add conversation modals
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isMakeCallModalOpen, setIsMakeCallModalOpen] = useState(false);
  const [isTemplateMessageModalOpen, setIsTemplateMessageModalOpen] = useState(false);
  const [makeCallTab, setMakeCallTab] = useState<"make-call" | "search-contacts">("make-call");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [callPermissionChecked, setCallPermissionChecked] = useState(false);
  const [hasCallPermission, setHasCallPermission] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);

  const [searchContactsQuery, setSearchContactsQuery] = useState("");
  const [limitReached, setLimitReached] = useState(false);

  // Template message state
  const [templatePhoneNumbers, setTemplatePhoneNumbers] = useState<string[]>([""]); // Start with just one empty input

  // Message input state
  const [messageText, setMessageText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showEmojiPicker]);

  // Close filter popout when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setShowFilter(false);
      }
    };

    if (showFilter) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showFilter]);

  // Handle emoji selection from emoji-mart
  const handleEmojiSelect = (emoji: any) => {
    setMessageText(messageText + emoji.native);
    setShowEmojiPicker(false);
  };

  // Handle file attachment
  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files) {
      setAttachedFiles([...attachedFiles, ...Array.from(files)]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Handle image attachment
  const handleImageAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files) {
      setAttachedFiles([...attachedFiles, ...Array.from(files)]);
    }
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  // Handle voice recording
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setRecordedAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  // Handle stop recording
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Handle send message
  const handleSendMessage = async () => {
    if (!selectedConversation) return;

    // Create file data URLs for images and audio
    const imageFiles: any[] = [];
    const otherFiles: any[] = [];

    // Process all attached files
    for (const file of attachedFiles) {
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });

      if (file.type.startsWith("image/")) {
        imageFiles.push({
          name: file.name,
          size: file.size,
          type: file.type,
          url: dataUrl
        });
      } else {
        otherFiles.push({
          name: file.name,
          size: file.size,
          type: file.type,
          url: dataUrl
        });
      }
    }

    // Create audio data URL
    let audioUrl: string | undefined;
    if (recordedAudio) {
      audioUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.readAsDataURL(recordedAudio);
      });
    }

    // Create message object
    const newMessage: any = {
      id: Math.random(),
      from: "agent",
      text: messageText,
      time: new Date().toISOString(),
      images: imageFiles.length > 0 ? imageFiles : undefined,
      attachments: otherFiles.length > 0 ? otherFiles : undefined,
      audio: recordedAudio ? {
        url: audioUrl,
        size: recordedAudio.size,
        duration: "0:05"
      } : undefined
    };

    // Add message to conversation
    const updatedMessages = [...(conversationMessagesData[selectedConversation] || []), newMessage];
    setConversationMessagesData({ ...conversationMessagesData, [selectedConversation]: updatedMessages });

    // Update last message in conversation list
    setConversations(conversations.map(conv =>
      conv.id === selectedConversation
        ? { ...conv, lastMessage: messageText || (imageFiles.length > 0 ? "📷 Photo" : otherFiles.length > 0 ? "📎 Attachment" : "🎤 Voice message"), time: new Date().toISOString() }
        : conv
    ));

    // Reset form
    setMessageText("");
    setAttachedFiles([]);
    setRecordedAudio(null);
  };

  // Remove attached file
  const removeAttachedFile = (index: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };

  // Call UI state
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callPhoneNumber, setCallPhoneNumber] = useState("");
  const [callContactName, setCallContactName] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);

  // Call timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  // Format call duration
  const formatCallDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Dummy templates for testing
  const dummyTemplates = [
    {
      id: 1,
      name: "Welcome Message",
      category: "Marketing",
      header: "Welcome to {{company}}",
      body: "Hello {{name}}, welcome to our service! We're excited to have you on board.",
      footer: "Thank you for choosing us",
      variables: ["name", "company"],
      buttons: [
        { id: 1, type: "visit-website", buttonText: "Visit Website", websiteUrl: "https://example.com" },
        { id: 2, type: "quick-reply", buttonText: "Learn More" }
      ]
    },
    {
      id: 2,
      name: "Order Confirmation",
      category: "Transactional",
      header: "Order #{{order_id}}",
      body: "Your order has been confirmed. Total: {{amount}}. Delivery in {{days}} days.",
      footer: "Track your order anytime",
      variables: ["order_id", "amount", "days"],
      buttons: [
        { id: 1, type: "visit-website", buttonText: "Track Order", websiteUrl: "https://example.com/track" },
        { id: 2, type: "call-phone", buttonText: "Call Support", country: "US", phoneNumber: "1234567890" }
      ]
    },
    {
      id: 3,
      name: "Appointment Reminder",
      category: "Reminder",
      header: "Appointment Reminder",
      body: "Hi {{name}}, reminder: your appointment is on {{date}} at {{time}}.",
      footer: "Reply CONFIRM to confirm",
      variables: ["name", "date", "time"],
      buttons: [
        { id: 1, type: "quick-reply", buttonText: "Confirm" },
        { id: 2, type: "quick-reply", buttonText: "Reschedule" }
      ]
    }
  ];

  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [templateVariables, setTemplateVariables] = useState<Record<string, string>>({});

  // Helper to split text by newlines and insert <br /> tags
  const splitByNewlines = (text: string, startKey: number) => {
    const lines = text.split('\n');
    const result: React.ReactNode[] = [];

    lines.forEach((line, index) => {
      // Check if line starts with "- " for bullet points
      if (line.trim().startsWith('- ')) {
        const bulletText = line.replace(/^\s*-\s/, '');
        result.push(
          <span key={startKey + index * 2}>
            <span className="inline-block mr-1">•</span>
            {bulletText}
          </span>
        );
      } else {
        result.push(<span key={startKey + index * 2}>{line}</span>);
      }

      if (index < lines.length - 1) {
        result.push(<br key={startKey + index * 2 + 1} />);
      }
    });

    return result;
  };

  // WhatsApp-style text formatter with nested formatting support
  const formatWhatsAppText = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let currentIndex = 0;
    let key = 0;

    // Process text character by character to handle WhatsApp formatting
    // WhatsApp uses: *bold*, _italic_, ~strikethrough~
    const regex = /(\*[^*]+\*|_[^_]+_|~[^~]+~)/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > currentIndex) {
        const beforeText = text.substring(currentIndex, match.index);
        parts.push(...splitByNewlines(beforeText, key));
        key += beforeText.split('\n').length;
      }

      const matchedText = match[0];
      const innerText = matchedText.substring(1, matchedText.length - 1);
      const formatChar = matchedText[0];

      // Recursively format the inner text to support nested formatting
      const formattedInner = formatWhatsAppText(innerText);

      // Apply formatting based on WhatsApp syntax
      if (formatChar === '*') {
        parts.push(<strong key={key++}>{formattedInner}</strong>);
      } else if (formatChar === '_') {
        parts.push(<em key={key++}>{formattedInner}</em>);
      } else if (formatChar === '~') {
        parts.push(<s key={key++}>{formattedInner}</s>);
      }

      currentIndex = match.index + matchedText.length;
    }

    // Add remaining text
    if (currentIndex < text.length) {
      const remainingText = text.substring(currentIndex);
      parts.push(...splitByNewlines(remainingText, key));
    }

    return parts.length > 0 ? parts : text;
  };

  // Handle sending template message
  const handleSendTemplateMessage = () => {
    if (!selectedTemplate || templatePhoneNumbers.filter(p => p.trim()).length === 0) {
      return;
    }

    // Check if all variables are filled
    if (selectedTemplate.variables && selectedTemplate.variables.length > 0) {
      const allVariablesFilled = selectedTemplate.variables.every(
        (variable: string) => templateVariables[variable]?.trim()
      );
      if (!allVariablesFilled) {
        return;
      }
    }

    // Get valid phone numbers
    const validPhoneNumbers = templatePhoneNumbers.filter(p => p.trim());

    // Create a new conversation for each phone number
    const newConversations = validPhoneNumbers.map((phoneNumber, index) => {
      const newId = Math.max(...conversations.map(c => c.id), 0) + index + 1;

      // Replace variables in template body
      let messageText = selectedTemplate.body;
      selectedTemplate.variables.forEach((variable: string) => {
        messageText = messageText.replace(`{{${variable}}}`, templateVariables[variable] || `{{${variable}}}`);
      });

      return {
        id: newId,
        phoneNumber: phoneNumber,
        displayName: "", // Will default to phoneNumber via getDisplayName()
        lastMessage: messageText,
        time: new Date().toISOString(),
        unread: 0,
        channel: "whatsapp",
        status: "queued",
        assignedAgent: null
      };
    });

    // Add phone numbers to basic details
    const newBasicDetails = { ...basicDetailsByConv };
    newConversations.forEach(conv => {
      newBasicDetails[conv.id] = { number: conv.phoneNumber, email: "", gender: "", whatsappOptOut: "No", address: "" };
    });
    setBasicDetailsByConv(newBasicDetails);

    // Add messages for each conversation
    const newMessagesData = { ...conversationMessagesData };
    newConversations.forEach(conv => {
      // Replace variables in template body for the message
      let messageText = selectedTemplate.body;
      selectedTemplate.variables.forEach((variable: string) => {
        messageText = messageText.replace(`{{${variable}}}`, templateVariables[variable] || `{{${variable}}}`);
      });

      newMessagesData[conv.id] = [
        {
          id: 1,
          from: "agent",
          text: messageText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
    });
    setConversationMessagesData(newMessagesData);

    // Add new conversations to the list
    setConversations([...newConversations, ...conversations]);

    // Reset form and close modal
    setTemplatePhoneNumbers([""]);
    setSelectedTemplate(null);
    setTemplateVariables({});
    setIsTemplateMessageModalOpen(false);

    // Select the first new conversation
    if (newConversations.length > 0) {
      setSelectedConversation(newConversations[0].id);
    }
  };

  // Mock contacts with WhatsApp call consent data
  const mockContacts = [
    {
      id: 1,
      name: "John Doe",
      number: "+1 (555) 000-0000",
      pfp: "JD",
      callConsent: "Active",
      callsUsed: 2,
      callsMax: 5,
      renewsIn: "24h",
      expiryDays: 3,
      expiryHours: 12
    },
    {
      id: 2,
      name: "Jane Smith",
      number: "+1 (555) 000-0001",
      pfp: "JS",
      callConsent: "Expired",
      callsUsed: 5,
      callsMax: 5,
      renewsIn: "0h",
      expiryDays: 0,
      expiryHours: 0
    },
    {
      id: 3,
      name: "Michael Chen",
      number: "+1 (555) 000-0002",
      pfp: "MC",
      callConsent: "Active",
      callsUsed: 0,
      callsMax: 5,
      renewsIn: "18h",
      expiryDays: 2,
      expiryHours: 8
    },
    {
      id: 4,
      name: "Sarah Wilson",
      number: "+1 (555) 000-0003",
      pfp: "SW",
      callConsent: "Active",
      callsUsed: 4,
      callsMax: 5,
      renewsIn: "6h",
      expiryDays: 1,
      expiryHours: 18
    },
    {
      id: 5,
      name: "Bob Johnson",
      number: "+1 (555) 000-0004",
      pfp: "BJ",
      callConsent: "Expired",
      callsUsed: 5,
      callsMax: 5,
      renewsIn: "12h",
      expiryDays: 0,
      expiryHours: 0
    },
  ];

  const handleCheckPermission = () => {
    setCallPermissionChecked(true);

    // Check if number is in contacts
    const contact = mockContacts.find(c => c.number === phoneNumber);

    if (contact) {
      // Use data from contact
      setHasCallPermission(contact.callConsent === "Active");
      setSelectedContact({
        name: contact.name,
        number: phoneNumber,
        callConsent: contact.callConsent,
        callsUsed: contact.callsUsed,
        callsMax: contact.callsMax,
        renewsIn: contact.renewsIn,
        expiryDays: contact.expiryDays
      });
    } else {
      // Number not in contacts - random chance
      const hasPermission = Math.random() > 0.5;
      setHasCallPermission(hasPermission);
      setSelectedContact({
        name: "Unknown Contact",
        number: phoneNumber,
        callConsent: hasPermission ? "Active" : "Denied",
        callsUsed: hasPermission ? 0 : undefined,
        callsMax: hasPermission ? 5 : undefined,
        renewsIn: hasPermission ? "24h" : undefined,
        expiryDays: hasPermission ? 3 : undefined,
        expiryHours: hasPermission ? 12 : undefined
      });
    }
  };

  // Helper function to get display name (defaults to phone number if no display name)
  const getDisplayName = (conversation: any): string => {
    return conversation.displayName || conversation.phoneNumber || conversation.name || "Unknown";
  };

  const { toast } = useToast();
  // State to trigger re-renders every minute for time updates
  const [_, setTimeUpdateTrigger] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUpdateTrigger(prev => prev + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const [conversations, setConversations] = useState([
    // queued (Unassigned)
    { id: 1, phoneNumber: "+1 234 567 8900", displayName: "John Doe", lastMessage: "Hi, I need help with my order", time: new Date(Date.now() - 2 * 60000).toISOString(), unread: 2, channel: "whatsapp", status: "queued", assignedAgent: null },
    { id: 2, phoneNumber: "+1 234 567 8901", displayName: "Jane Smith", lastMessage: "Can you send me the invoice?", time: new Date(Date.now() - 5 * 60000).toISOString(), unread: 3, channel: "whatsapp", status: "queued", assignedAgent: null },
    { id: 3, phoneNumber: "+1 234 567 8902", displayName: "Michael Chen", lastMessage: "I have a billing question", time: new Date(Date.now() - 8 * 60000).toISOString(), unread: 1, channel: "whatsapp", status: "queued", assignedAgent: null },

    // Active (Assigned)
    { id: 4, phoneNumber: "+1 234 567 8903", displayName: "Sarah Wilson", lastMessage: "Thank you for resolving this!", time: new Date(Date.now() - 1 * 60000).toISOString(), unread: 0, channel: "whatsapp", status: "active", assignedAgent: "agent-1" },
    { id: 5, phoneNumber: "+1 234 567 8904", displayName: "Bob Johnson", lastMessage: "Order received, thank you!", time: new Date(Date.now() - 3 * 60000).toISOString(), unread: 0, channel: "whatsapp", status: "active", assignedAgent: "agent-2" },
    { id: 6, phoneNumber: "+1 234 567 8905", displayName: "Emma Davis", lastMessage: "When will my refund be processed?", time: new Date(Date.now() - 12 * 60000).toISOString(), unread: 0, channel: "whatsapp", status: "active", assignedAgent: "agent-3" },

    // Completed (No assignments)
    { id: 7, phoneNumber: "+1 234 567 8906", displayName: "Alex Rodriguez", lastMessage: "Issue resolved successfully", time: new Date(Date.now() - 45 * 60000).toISOString(), unread: 0, channel: "whatsapp", status: "completed", assignedAgent: null },
    { id: 8, phoneNumber: "+1 234 567 8907", displayName: "Lisa Anderson", lastMessage: "Thanks for your help!", time: new Date(Date.now() - 2 * 3600000).toISOString(), unread: 0, channel: "whatsapp", status: "completed", assignedAgent: null },
    { id: 9, phoneNumber: "+1 234 567 8908", displayName: "David Martinez", lastMessage: "Perfect, all set!", time: new Date(Date.now() - 3 * 3600000).toISOString(), unread: 0, channel: "whatsapp", status: "completed", assignedAgent: null },

    // Spam (No assignments)
    { id: 10, phoneNumber: "+1 234 567 8909", displayName: "", lastMessage: "Click here for free money!!!", time: new Date(Date.now() - 30 * 60000).toISOString(), unread: 0, channel: "whatsapp", status: "spam", assignedAgent: null },
    { id: 11, phoneNumber: "+1 234 567 8910", displayName: "", lastMessage: "Limited time offer - 90% off!", time: new Date(Date.now() - 24 * 3600000).toISOString(), unread: 0, channel: "whatsapp", status: "spam", assignedAgent: null },
  ]);

  // Messages per conversation
  const [conversationMessagesData, setConversationMessagesData] = useState<Record<number, any[]>>({
    1: [
      { id: 1, from: "user", text: "Hi, I need help with my order", time: new Date(Date.now() - 60 * 60000).toISOString() },
      { id: 2, from: "agent", text: "Hello! I'd be happy to help. What's your order number?", time: new Date(Date.now() - 59 * 60000).toISOString() },
      { id: 3, from: "user", text: "It's #ORD-12345", time: new Date(Date.now() - 58 * 60000).toISOString() },
      { id: 4, from: "agent", text: "Let me check that for you...", time: new Date(Date.now() - 57 * 60000).toISOString() },
      { id: 5, from: "user", text: "", time: new Date(Date.now() - 56 * 60000).toISOString(), images: [{ name: "issue.jpg", url: "https://images.unsplash.com/photo-1575936123452-b67c3203c357?auto=format&fit=crop&w=1000&q=80", size: 1024 * 500 }] },
      { id: 6, from: "user", text: "", time: new Date(Date.now() - 55 * 60000).toISOString(), audio: { url: "https://index-tts.github.io/examples_part2/IndexTTS/Speaker_2.wav", duration: "0:15", size: 1024 * 200 } },
      { id: 7, from: "agent", text: "I see, here is a guide.", time: new Date(Date.now() - 54 * 60000).toISOString(), attachments: [{ name: "guide.pdf", url: "https://pdfobject.com/pdf/sample.pdf", size: 1024 * 1024 }] },
      { id: 8, from: "user", text: "", time: new Date(Date.now() - 53 * 60000).toISOString(), video: { url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", thumbnail: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg", name: "screen_recording.mp4", size: 1024 * 5000 } },
      { id: 9, from: "user", text: "Thanks for the help!", time: new Date(Date.now() - 50 * 60000).toISOString() },
    ],
    2: [
      { id: 1, from: "user", text: "Can you send me the invoice?", time: new Date(Date.now() - 125 * 60000).toISOString() },
      { id: 2, from: "agent", text: "Of course! Let me find that for you.", time: new Date(Date.now() - 122 * 60000).toISOString() },
      { id: 3, from: "agent", text: "", time: new Date(Date.now() - 121 * 60000).toISOString(), attachments: [{ name: "invoice_2024.pdf", url: "https://pdfobject.com/pdf/sample.pdf", size: 1024 * 850 }] },
      { id: 4, from: "user", text: "", time: new Date(Date.now() - 120 * 60000).toISOString(), images: [{ name: "receipt.jpg", url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1000&q=80", size: 1024 * 420 }] },
      { id: 5, from: "user", text: "Thank you!", time: new Date(Date.now() - 119 * 60000).toISOString() },
    ],
    3: [
      { id: 1, from: "user", text: "I have a billing question", time: new Date(Date.now() - 365 * 60000).toISOString() },
      { id: 2, from: "user", text: "Are you there?", time: new Date(Date.now() - 360 * 60000).toISOString() },
    ],
    4: [
      { id: 1, from: "user", text: "This is amazing!", time: new Date(Date.now() - 5 * 60000).toISOString() },
      { id: 2, from: "user", text: "", time: new Date(Date.now() - 4 * 60000).toISOString(), images: [{ name: "product.jpg", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80", size: 1024 * 650 }] },
      { id: 3, from: "agent", text: "Glad I could help!", time: new Date(Date.now() - 3 * 60000).toISOString() },
      { id: 4, from: "user", text: "Thank you for resolving this!", time: new Date(Date.now() - 1 * 60000).toISOString() },
    ],
    5: [
      { id: 1, from: "user", text: "Order received, thank you!", time: new Date(Date.now() - 3 * 60000).toISOString() },
      { id: 2, from: "user", text: "", time: new Date(Date.now() - 2 * 60000).toISOString(), video: { url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", thumbnail: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg", name: "unboxing.mp4", size: 1024 * 3500 } },
    ],
    6: [
      { id: 1, from: "user", text: "When will my refund be processed?", time: new Date(Date.now() - 15 * 60000).toISOString() },
      { id: 2, from: "agent", text: "It should be processed within 3-5 business days.", time: new Date(Date.now() - 12 * 60000).toISOString() },
      { id: 3, from: "user", text: "", time: new Date(Date.now() - 11 * 60000).toISOString(), audio: { url: "https://index-tts.github.io/examples_part2/IndexTTS/Speaker_3.wav", duration: "0:12", size: 1024 * 180 } },
    ],
    7: [
      { id: 1, from: "user", text: "Great service!", time: new Date(Date.now() - 48 * 60000).toISOString() },
      { id: 2, from: "agent", text: "Thank you! We appreciate your business.", time: new Date(Date.now() - 47 * 60000).toISOString() },
      { id: 3, from: "user", text: "Issue resolved successfully", time: new Date(Date.now() - 45 * 60000).toISOString() },
    ],
    8: [
      { id: 1, from: "user", text: "Thanks for your help!", time: new Date(Date.now() - 3 * 3600000).toISOString() },
      { id: 2, from: "agent", text: "You're welcome! Have a great day.", time: new Date(Date.now() - 2 * 3600000).toISOString() },
    ],
    9: [
      { id: 1, from: "user", text: "Perfect, all set!", time: new Date(Date.now() - 3 * 3600000).toISOString() },
    ],
    10: [
      { id: 1, from: "user", text: "Click here for free money!!!", time: new Date(Date.now() - 35 * 60000).toISOString() },
      { id: 2, from: "user", text: "Limited offer - act now!", time: new Date(Date.now() - 30 * 60000).toISOString() },
    ],
    11: [
      { id: 1, from: "user", text: "Limited time offer - 90% off!", time: new Date(Date.now() - 25 * 3600000).toISOString() },
      { id: 2, from: "user", text: "Don't miss out!", time: new Date(Date.now() - 24 * 3600000).toISOString() },
    ],
  });

  // Quick replies state
  const [quickReplies, setQuickReplies] = useState([
    "Hi, how can I help you?",
    "What is your order number?",
    "Can I assist you with anything else?",
    "Thank you for contacting us.",
  ]);

  // Helper to handle file downloads
  const handleDownload = async (url: string, filename: string) => {
    toast({
      description: "Downloading...",
      duration: 2000,
    });

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback
      window.open(url, '_blank');
    }
  };

  // Function to check if there are any agent messages in the current conversation
  const hasAgentMessages = (convId: number) => {
    const messages = conversationMessagesData[convId] || [];
    return messages.some((msg: any) => msg.from === "agent");
  };

  // Handle scroll to message from Contact Profile Sidebar
  const handleScrollToMessage = (messageId: number) => {
    // Find the message element
    const element = document.getElementById(`message-${messageId}`);

    if (element) {
      // Try standard scrollIntoView first
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Additional fallback/refinement: target the specific scroll container
      // We look for the ScrollArea's viewport or the nearest scrollable ancestor
      const container = element.closest('[data-radix-scroll-area-viewport]') || element.closest('.overflow-y-auto');

      if (container && container instanceof HTMLElement) {
        // Calculate position to center the element
        const elementRect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const relativeTop = elementRect.top - containerRect.top;
        const currentScroll = container.scrollTop;

        // Center the element: newScrollTop = currentScroll + relativeTop - (containerHeight / 2) + (elementHeight / 2)
        const targetScroll = currentScroll + relativeTop - (container.clientHeight / 2) + (element.clientHeight / 2);

        container.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        });
      }

      // Optional: Add a highlight effect
      element.style.transition = 'background-color 0.5s';

      // Add a temporary highlight class or inline style
      element.classList.add('ring-2', 'ring-primary', 'ring-offset-2');

      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
      }, 2000);
    } else {
      console.warn(`Message with ID message-${messageId} not found`);
    }
  };

  return (
    <div className="h-full flex flex-col font-sans" data-testid="conversations-inbox">

      <div className="flex-1 flex gap-0 px-6 py-6 max-h-full">
        {/* Left Sidebar */}
        <div className="relative group h-full" data-sidebar>
          <Card className="flex flex-col border-r rounded-r-none h-full" style={{ width: `${sidebarWidth}px` }}>
            <CardHeader className="px-3 space-y-3 pb-3 flex-shrink-0">
              {/* Tabs */}
              <div className="px-3 flex justify-between border-b pb-0 w-full">
                {["All", "Queued", "Active", "Completed", "Spam"].map((tab) => {
                  const tabKey = tab.toLowerCase();
                  const count = tabKey === "all"
                    ? conversations.length
                    : tabKey === "active"
                      ? conversations.filter(c => c.status === "active" && c.assignedAgent === "self").length
                      : conversations.filter(c => c.status === tabKey).length;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tabKey)}
                      className={`flex flex-col items-center flex-1 px-2 py-2 text-xs font-medium border-b-2 transition-colors ${activeTab === tabKey
                        ? "border-b-primary text-foreground"
                        : "border-b-transparent text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-slate-200"
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
                    placeholder="Search"
                    className="pl-10 border-input h-9 text-xs"
                    data-testid="input-search"
                    onFocus={() => setIsSearchFocused(true)}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {!isSearchFocused && (
                  <>
                    {/* Select Agents Dropdown */}
                    <div className="relative">
                      <CustomDropdown
                        options={agentOptions.map(a => ({ id: a.id, name: a.name, icon: a.icon }))}
                        selected={selectedFilterAgents}
                        onChange={setSelectedFilterAgents}
                        placeholder="Agents"
                        width="auto"
                        className="h-9 w-9 px-[0.5rem] justify-center bg-white dark:bg-background border border-input dark:border-slate-700 hover:bg-accent dark:hover:bg-slate-700"
                        triggerContent={<User size={16} />}
                        popoutWidth="200px"
                        popoutAlign="left"
                      />
                    </div>

                    {/* Select Channels Dropdown */}
                    <div className="relative">
                      <CustomDropdown
                        options={channelOptions}
                        selected={selectedFilterChannels}
                        onChange={setSelectedFilterChannels}
                        placeholder="Channels"
                        width="auto"
                        className="h-9 w-9 px-[0.5rem] justify-center bg-white dark:bg-background border border-input dark:border-slate-700 hover:bg-accent dark:hover:bg-slate-700"
                        triggerContent={<ListFilter size={16} />}
                        popoutWidth="200px"
                        popoutAlign="right"
                      />
                    </div>

                    {/* Advanced Filter Popout */}
                    <div className="relative" ref={filterDropdownRef}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-9 w-9 bg-white dark:bg-background border border-input dark:border-slate-700 hover:bg-accent dark:hover:bg-slate-700 ${showFilter ? 'bg-accent dark:bg-slate-700' : ''}`}
                            onClick={() => setShowFilter(!showFilter)}
                          >
                            <Filter size={16} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Filter</TooltipContent>
                      </Tooltip>

                      {/* Filter Popover Content */}
                      {showFilter && (
                        <div className="absolute z-[10] bg-white dark:bg-background border border-border dark:border-slate-700 rounded-md shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] p-3 top-full mt-2 left-0" style={{
                          minWidth: '320px',
                          marginLeft: '-140px' // Center align somewhat or adjust to keep on screen
                        }}>
                          {filters.length === 0 ? (
                            <div className="text-center py-6">
                              <h3 className="font-semibold text-sm mb-1">No filters applied</h3>
                              <p className="text-xs text-muted-foreground mb-4">Add filters to refine your rows.</p>
                              <Button onClick={addFilter} className="btn-outline-primary" variant="outline">Add filter</Button>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {filters.map((filter) => (
                                <div
                                  key={filter.id}
                                  className="flex gap-2 items-center"
                                  draggable
                                  onDragStart={() => handleFilterDragStart(filter.id)}
                                  onDragOver={handleFilterDragOver}
                                  onDrop={() => handleFilterDrop(filter.id)}
                                >
                                  <div className="relative flex-1">
                                    <button
                                      type="button"
                                      onClick={() => setOpenFilterColumnDropdown(openFilterColumnDropdown === filter.id ? null : filter.id)}
                                      className="w-[140px] flex items-center justify-between px-3 py-2 text-left bg-white dark:bg-background border border-input dark:border-slate-700 rounded-md shadow-sm hover:bg-accent dark:hover:bg-slate-700 focus:outline-none text-foreground dark:text-white transition-colors w-full"
                                    >
                                      <span className="truncate text-sm font-normal">{filter.column === "name" ? "Name" : filter.column === "phoneNumber" ? "Phone" : "Tags"}</span>
                                      <ChevronDown className="h-3 w-3 ml-2 text-muted-foreground" />
                                    </button>
                                    {openFilterColumnDropdown === filter.id && (
                                      <div className="absolute z-10 w-full mt-2 bg-white dark:bg-background rounded-md shadow-md border border-border dark:border-slate-700">
                                        <ul className="py-1">
                                          {["name", "phoneNumber", "tags"].map(option => {
                                            const isCurrentOption = option === filter.column;
                                            return (
                                              <li
                                                key={option}
                                                className={`px-3 py-2 text-sm ${isCurrentOption ? "opacity-40 text-muted-foreground cursor-not-allowed" : "cursor-pointer hover:bg-muted"}`}
                                                onClick={() => {
                                                  if (!isCurrentOption) {
                                                    updateFilter(filter.id, option, filter.operator, filter.value);
                                                    setOpenFilterColumnDropdown(null);
                                                  }
                                                }}
                                              >
                                                {option === "name" ? "Name" : option === "phoneNumber" ? "Phone" : "Tags"}
                                              </li>
                                            );
                                          })}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                  <div className="relative">
                                    <button
                                      type="button"
                                      onClick={() => setOpenFilterOperatorDropdown(openFilterOperatorDropdown === filter.id ? null : filter.id)}
                                      className="w-[170px] flex items-center justify-between px-3 py-2 text-left bg-white dark:bg-background border border-input dark:border-slate-700 rounded-md shadow-sm hover:bg-accent dark:hover:bg-slate-700 focus:outline-none text-foreground dark:text-white transition-colors"
                                    >
                                      <span className="truncate text-sm font-normal">{filter.operator}</span>
                                      <ChevronDown className="h-3 w-3 ml-2 text-muted-foreground" />
                                    </button>
                                    {openFilterOperatorDropdown === filter.id && (
                                      <div className="absolute z-10 w-full mt-2 bg-white dark:bg-background rounded-md shadow-md border border-border dark:border-slate-700">
                                        <ul className="py-1">
                                          {["contains", "does not contain", "is", "is not", "is empty", "is not empty"].map(option => (
                                            <li
                                              key={option}
                                              className="px-3 py-2 text-sm cursor-pointer hover:bg-muted"
                                              onClick={() => {
                                                updateFilter(filter.id, filter.column, option, filter.value);
                                                setOpenFilterOperatorDropdown(null);
                                              }}
                                            >
                                              {option}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                  <input
                                    type="text"
                                    placeholder="Value..."
                                    value={filter.value}
                                    onChange={(e) => updateFilter(filter.id, filter.column, filter.operator, e.target.value)}
                                    className="px-3 py-2 text-sm border border-input rounded-md flex-1 focus:outline-none transition-colors bg-card"
                                  />
                                  <button onClick={() => removeFilter(filter.id)} className="p-2 hover:bg-muted rounded"><Trash2 size={14} /></button>
                                  <GripVertical size={14} className="text-muted-foreground cursor-grab" />
                                </div>
                              ))}
                              <div className="flex gap-2 pt-2 border-t">
                                <Button onClick={addFilter} className="btn-outline-primary flex-1" variant="outline">Add filter</Button>
                                <Button onClick={() => setFilters([])} variant="outline" className="flex-1 border-input [border-color:hsl(var(--input))]">Reset</Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 bg-white dark:bg-background border border-input dark:border-slate-700 hover:bg-accent dark:hover:bg-slate-700"
                          onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                        >
                          <ArrowUp size={16} style={{ transform: sortOrder === "asc" ? "rotate(0deg)" : "rotate(180deg)" }} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Sort by time</TooltipContent>
                    </Tooltip>
                  </>
                )}

                {isSearchFocused ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 bg-white dark:bg-background border border-input dark:border-slate-700 hover:bg-accent dark:hover:bg-slate-700"
                        onClick={() => {
                          setSearchQuery("");
                          setIsSearchFocused(false);
                        }}
                      >
                        <X size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Clear Search</TooltipContent>
                  </Tooltip>
                ) : (
                  <DropdownMenu open={isAddMenuOpen} onOpenChange={setIsAddMenuOpen}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9 bg-white dark:bg-background border border-input dark:border-slate-700 hover:bg-accent dark:hover:bg-slate-700">
                            <Plus size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <TooltipContent>Call or Message</TooltipContent>
                    </Tooltip>
                    <DropdownMenuContent align="end" className="bg-white dark:bg-background">
                      <DropdownMenuItem onClick={() => {
                        setIsMakeCallModalOpen(true);
                        setIsAddMenuOpen(false);
                      }}>
                        Make Call
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setIsTemplateMessageModalOpen(true);
                        setIsAddMenuOpen(false);
                      }}>
                        Send Template Message
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
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
                      className={`p-3 rounded-md cursor-pointer transition-colors ${selectedConversation === conv.id ? "bg-accent" : "hover:bg-muted/50"
                        }`}
                      onClick={() => handleSelectConversation(conv.id)}
                      data-testid={`conversation-${conv.id}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 relative">
                          <Avatar className="absolute">
                            <AvatarFallback className={getAvatarColor(getDisplayName(conv))}>
                              {(() => {
                                const displayName = getDisplayName(conv);
                                const parts = displayName.trim().split(/\s+/).filter((p: string) => p.length > 0);
                                if (parts.length === 0) return "U";
                                if (parts.length === 1) return parts[0][0].toUpperCase();
                                return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                              })()}
                            </AvatarFallback>
                          </Avatar>
                          {/* Channel Icon Badge */}
                          <span className="absolute bottom-0 -right-1 block">
                            {conv.channel === "whatsapp" && (
                              <img src="/images/automations/whatsapp.svg" alt="WhatsApp" className="w-4 h-4" />
                            )}
                            {conv.channel === "instagram" && (
                              <img src="/images/automations/instagram.svg" alt="Instagram" className="w-4 h-4" />
                            )}
                            {conv.channel === "messenger" && (
                              <img src="/images/automations/messenger.svg" alt="Messenger" className="w-4 h-4" />
                            )}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1 gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className={`text-sm truncate ${getPendingMessagesCount(conv.id) > 0 ? "font-bold" : " font-semibold"}`}>{getDisplayName(conv)}</span>
                              {activeTab === "all" && (
                                <Badge
                                  variant="outline"
                                  className={`text-xs flex-shrink-0 ${conv.status === "queued" ? "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800" :
                                    conv.status === "active" ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800" :
                                      conv.status === "completed" ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800" :
                                        "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
                                    }`}
                                // className={`text-xs flex-shrink-0 ${conv.status === "queued" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800" :
                                //   conv.status === "active" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800" :
                                //     conv.status === "completed" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800" :
                                //       "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
                                //   }`}
                                >
                                  {conv.status}
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground flex-shrink-0">{formatConversationTime(conversationMessagesData[conv.id]?.slice(-1)[0]?.time || conv.time)}</span>
                          </div>
                          <p className="text-sm truncate mb-1 font-normal text-muted-foreground" style={{ maxWidth: `${sidebarWidth - 96}px` }}>{getLastMessage(conv.id)}</p>
                          {conv.assignedAgent && conv.assignedAgent !== "self" && (
                            <p className="text-xs text-muted-foreground">Assigned to: <span className="font-medium">{getAgentName(conv.assignedAgent)}</span></p>
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
            className={`absolute top-1/2 flex items-center justify-center py-3 rounded-full transition-all z-10 ${isDragging
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
        {
          selectedConversation ? (
            <Card className="flex-1 flex flex-col border-l-0 rounded-none">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className={getAvatarColor(getDisplayName(conversations.find(c => c.id === selectedConversation) || {}))}>
                      {(() => {
                        const name = getDisplayName(conversations.find(c => c.id === selectedConversation) || {});
                        const parts = name.trim().split(/\s+/).filter((p: string) => p.length > 0);
                        if (parts.length === 0) return "U";
                        if (parts.length === 1) return parts[0][0].toUpperCase();
                        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                      })()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-sm font-semibold">{getDisplayName(conversations.find(c => c.id === selectedConversation) || {})}</h3>
                    <p className="text-xs text-muted-foreground">Active now</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="hover-elevate" data-testid="button-refresh">
                        <RefreshCw size={18} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Refresh chat</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="hover-elevate" onClick={handleToggleContactPanel} data-testid="button-view-contact">
                        {showContactPanel ? <EyeOff size={18} /> : <Eye size={18} />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{showContactPanel ? "Hide" : "Show"} contact profile</TooltipContent>
                  </Tooltip>
                  <DropdownMenu>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="hover-elevate" data-testid="button-export">
                            <Download size={18} />
                          </Button>
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <TooltipContent>Export</TooltipContent>
                    </Tooltip>
                    <DropdownMenuContent align="end" className="bg-white dark:bg-background">
                      <DropdownMenuItem onClick={handleExportConversations}>Export as CSV</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {selectedConversation && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover-elevate" data-testid="button-more-options">
                          <MoreVertical size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white dark:bg-background">
                        <DropdownMenuItem
                          onClick={() => {
                            const conv = conversations.find(c => c.id === selectedConversation);
                            if (conv) {
                              setConversations(conversations.map(c =>
                                c.id === selectedConversation ? { ...c, assignedAgent: null, status: "queued" } : c
                              ));
                              setAssignedAgent(null);
                            }
                          }}
                          disabled={conversations.find(c => c.id === selectedConversation)?.assignedAgent !== "self"}
                          className={conversations.find(c => c.id === selectedConversation)?.assignedAgent !== "self" ? "opacity-50 cursor-not-allowed" : ""}
                        >
                          <UserX size={16} className="mr-2" />
                          Unassign Chat
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
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
                          disabled={conversations.find(c => c.id === selectedConversation)?.status === "completed"}
                          className={conversations.find(c => c.id === selectedConversation)?.status === "completed" ? "opacity-50 cursor-not-allowed" : ""}
                        >
                          <CheckCircle size={16} className="mr-2" />
                          Mark as Completed
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
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
                          disabled={conversations.find(c => c.id === selectedConversation)?.status === "spam"}
                          className={conversations.find(c => c.id === selectedConversation)?.status === "spam" ? "opacity-50 cursor-not-allowed" : ""}
                        >
                          <AlertOctagon size={16} className="mr-2" />
                          Mark as Spam
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </CardHeader>
              <Separator />



              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {(conversationMessagesData[selectedConversation!] || []).map((msg: any, index: number, allMessages: any[]) => {
                    const showDateDivider = index === 0 || formatMessageDate(msg.time) !== formatMessageDate(allMessages[index - 1].time);
                    return (
                      <React.Fragment key={msg.id}>
                        {showDateDivider && (
                          <div className="flex justify-center my-4">
                            <span className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full">{formatMessageDate(msg.time)}</span>
                          </div>
                        )}
                        <div className={`flex ${msg.from === "agent" ? "justify-end" : "justify-start"}`}>
                          <div id={`message-${msg.id}`} className={`max-w-[70%] rounded-lg p-3 ${msg.from === "user" ? "bg-blue-100 dark:bg-blue-900/30 dark:text-blue-100" : "bg-gray-200 text-gray-900 dark:bg-slate-700 dark:text-slate-100"}`} data-testid={`message-${msg.id}`}>
                            {msg.text && <p className="text-sm">{msg.text}</p>}

                            {/* Images */}
                            {msg.images && msg.images.length > 0 && (
                              <div className="mt-2 space-y-2">
                                {msg.images.map((image: any, idx: number) => (
                                  <div key={idx} className="space-y-1">
                                    <img
                                      src={image.url}
                                      alt={image.name}
                                      className="max-w-full h-auto rounded max-h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                      onClick={() => setPreviewImage(image.url)}
                                    />
                                    <div className="flex items-center justify-between gap-2 text-xs bg-black/10 dark:bg-white/10 rounded p-2">
                                      <div className="flex items-center gap-1 flex-1 min-w-0">
                                        <span className="truncate">{image.name}</span>
                                        <span className="opacity-70 flex-shrink-0">({(image.size / 1024).toFixed(1)}KB)</span>
                                      </div>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDownload(image.url, image.name);
                                        }}
                                        className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                                        title="Download image"
                                      >
                                        <Download size={14} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Attachments */}
                            {msg.attachments && msg.attachments.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {msg.attachments.map((attachment: any, idx: number) => (
                                  <div key={idx} className="flex items-center justify-between gap-2 text-xs bg-black/10 dark:bg-white/10 rounded p-2">
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                      <Paperclip size={12} className="flex-shrink-0" />
                                      <span className="truncate">{attachment.name}</span>
                                      <span className="opacity-70 flex-shrink-0">({(attachment.size / 1024).toFixed(1)}KB)</span>
                                    </div>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDownload(attachment.url, attachment.name);
                                      }}
                                      className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                                      title="Download file"
                                    >
                                      <Download size={14} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Video */}
                            {msg.video && (
                              <div className="mt-2 text-xs bg-black/10 dark:bg-white/10 rounded overflow-hidden">
                                <video src={msg.video.url} controls className="p-1 w-full max-h-64 object-contain bg-black/5" poster={msg.video.thumbnail} />
                                <div className="flex items-center gap-2 p-2">
                                  <div className="flex items-center gap-1 flex-1 min-w-0">
                                    <div className="p-1 bg-black/10 rounded-full">
                                      <div className="ml-0.5 w-0 h-0 border-t-[3px] border-t-transparent border-l-[6px] border-l-current border-b-[3px] border-b-transparent"></div>
                                    </div>
                                    <span className="truncate">{msg.video.name}</span>
                                    <span className="opacity-70 flex-shrink-0">({(msg.video.size / 1024 / 1024).toFixed(1)}MB)</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Voice message */}
                            {msg.audio && (
                              <div className="mt-2 space-y-2">
                                <div className="bg-black/10 dark:bg-white/10 rounded p-3 max-w-sm">
                                  <audio
                                    controls
                                    className="h-12 rounded"
                                    style={{
                                      accentColor: "hsl(var(--primary))",
                                    }}
                                    controlsList="nodownload"
                                  >
                                    <source src={msg.audio.url} type="audio/webm" />
                                    Your browser does not support the audio element.
                                  </audio>
                                  <div className="flex items-center justify-between mt-2">
                                    <p className="text-xs font-medium">Voice message</p>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDownload(msg.audio.url, `voice-message-${msg.id}.webm`);
                                      }}
                                      className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                                      title="Download voice message"
                                    >
                                      <Download size={14} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}

                            <p className={`text-xs mt-1 ${msg.from === "user" ? "flex justify-end" : "text-gray-700 dark:text-slate-400"}`}>{formatMessageTime(msg.time)}</p>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                  {/* Invisible div to scroll to */}
                  <div id="scroll-target" />
                </div>
              </ScrollArea>
              <Separator />

              {/* Message Input or Assignment Prompt */}
              {assignedAgent === "self" ? (
                <div className="p-4 flex-shrink-0 relative">
                  {/* Attached files preview */}
                  {(attachedFiles.length > 0 || recordedAudio) && (
                    <div className="mb-3 p-3 bg-muted rounded-lg space-y-2">
                      {attachedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between gap-2 text-sm">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Paperclip size={14} className="text-muted-foreground flex-shrink-0" />
                            <span className="truncate text-foreground">{file.name}</span>
                            <span className="text-xs text-muted-foreground flex-shrink-0">({(file.size / 1024).toFixed(1)}KB)</span>
                          </div>
                          <button
                            onClick={() => removeAttachedFile(index)}
                            className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                      {recordedAudio && (
                        <div className="flex items-center justify-between gap-2 text-sm">
                          <div className="flex items-center gap-2 flex-1">
                            <Mic size={14} className="text-muted-foreground" />
                            <span className="text-foreground">Voice message</span>
                            <span className="text-xs text-muted-foreground">({(recordedAudio.size / 1024).toFixed(1)}KB)</span>
                          </div>
                          <button
                            onClick={() => setRecordedAudio(null)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quick Replies */}
                  {selectedConversation && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {quickReplies.map((reply, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="rounded-full text-xs h-7 bg-slate-200/75 dark:bg-slate-800"
                          onClick={() => setMessageText(reply)}
                        >
                          {reply}
                        </Button>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 items-center">
                    <Input
                      placeholder="Type a message..."
                      className="flex-1"
                      data-testid="input-message"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 [border-color:hsl(var(--input))]"
                        title="Add emoji"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      >
                        <Smile size={18} />
                      </Button>
                      {showEmojiPicker && (
                        <div
                          ref={emojiPickerRef}
                          className="absolute bottom-12 right-0 z-50"
                        >
                          <Picker
                            data={data}
                            onEmojiSelect={handleEmojiSelect}
                            theme="light"
                            previewPosition="none"
                            skinTonePosition="none"
                            maxFrequentRows={1}
                            perLine={8}
                            set="native"
                          />
                        </div>
                      )}
                    </div>

                    {/* File attachment */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileAttach}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 [border-color:hsl(var(--input))]"
                      title="Attach file"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Paperclip size={18} />
                    </Button>

                    {/* Image attachment */}
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageAttach}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 [border-color:hsl(var(--input))]"
                      title="Send picture"
                      onClick={() => imageInputRef.current?.click()}
                    >
                      <Image size={18} />
                    </Button>

                    {/* Voice message */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-9 w-9 [border-color:hsl(var(--input))] ${isRecording ? "bg-red-100 text-red-600" : ""}`}
                      title={isRecording ? "Stop recording" : "Send voice message"}
                      onClick={isRecording ? handleStopRecording : handleStartRecording}
                    >
                      <Mic size={18} />
                    </Button>

                    {/* Send button */}
                    <Button
                      size="icon"
                      data-testid="button-send"
                      onClick={handleSendMessage}
                      disabled={!messageText.trim() && attachedFiles.length === 0 && !recordedAudio}
                    >
                      <Send size={18} color="white" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-6 flex-shrink-0 bg-muted/30 flex flex-col items-center justify-center gap-3">
                  <AlertCircle className="w-6 h-6 text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">Assign this chat to start messaging</p>
                    <p className="text-xs text-muted-foreground mt-1">Use the assignment options in the contact profile to get started</p>
                  </div>
                </div>
              )}
            </Card>
          ) : (
            <Card className="flex-1 flex flex-col items-center justify-center border-l-0 rounded-none">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                <p className="text-sm text-muted-foreground">Choose a conversation from the list to start messaging</p>
              </div>
            </Card>
          )
        }

        {/* Image Preview Modal */}
        <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
          <DialogContent className="[&>button]:hidden w-auto h-auto max-w-none p-0 overflow-hidden bg-transparent border-none shadow-none flex items-center justify-center">
            {previewImage && (
              <div className="relative">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="max-w-[80vw] max-h-[80vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
                />
                <button
                  onClick={() => setPreviewImage(null)}
                  className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {
          showContactPanel && (
            <ContactProfileSidebar
              conversation={conversations.find(c => c.id === selectedConversation)}
              conversations={conversations}
              basicDetails={basicDetailsByConv[selectedConversation || 0]}
              onUpdateBasicDetails={handleUpdateBasicDetails}
              assignedAgent={assignedAgent}
              onAssignAgent={handleAssignAgent}
              agentOptions={agentOptions}
              involvedTeams={involvedTeamsByConv[selectedConversation || 0]}
              onUpdateInvolvedTeams={handleUpdateInvolvedTeams}
              teamOptions={teamOptions}
              tags={tagsByConv[conversations.find(c => c.id === selectedConversation)?.id || 0] || []}
              onUpdateTags={handleUpdateTags}
              tagOptions={tagOptions}
              customAttributes={customAttributesByConv[conversations.find(c => c.id === selectedConversation)?.id || 0] || {}}
              onUpdateCustomAttributes={handleUpdateCustomAttributes}
              notes={notesByConv[conversations.find(c => c.id === selectedConversation)?.id || 0] || []}
              onUpdateNotes={handleUpdateNotes}
              messages={conversationMessagesData[selectedConversation!] || []}
              onScrollToMessage={handleScrollToMessage}
            />
          )
        }







        {/* Filter Modal */}
        <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="mb-2">
              <DialogTitle>Filter Conversations</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Team</label>
                <CustomDropdown
                  options={teamOptions}
                  selected={filterTeams}
                  onChange={setFilterTeams}
                  placeholder="Select teams"
                  width="100%"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Agent</label>
                <CustomDropdown
                  options={agentOptions}
                  selected={filterAgents}
                  onChange={setFilterAgents}
                  placeholder="Select agents"
                  width="100%"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <CustomDropdown
                  options={[]}
                  selected={filterStatus}
                  onChange={setFilterStatus}
                  placeholder="Select status"
                  width="100%"
                />
              </div>
            </div>

            <DialogFooter className="mt-2">
              <Button variant="ghost" onClick={() => setIsFilterModalOpen(false)} className="bg-white dark:bg-background border border-input dark:border-slate-700 hover:bg-accent dark:hover:bg-slate-700 font-normal">
                Cancel
              </Button>
              <Button onClick={() => setIsFilterModalOpen(false)} className="btn-outline-primary font-normal" variant="outline">
                Apply Filters
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Make Outbound Call Modal */}
        <Dialog open={isMakeCallModalOpen} onOpenChange={setIsMakeCallModalOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader className="mb-2">
              <DialogTitle>Make Outbound Call</DialogTitle>
            </DialogHeader>

            {/* Tabs */}
            <div className="flex gap-4 border-b">
              <button
                onClick={() => {
                  setMakeCallTab("make-call");
                }}
                className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${makeCallTab === "make-call"
                  ? "border-b-primary text-foreground"
                  : "border-b-transparent text-muted-foreground hover:text-foreground"
                  }`}
              >
                Make Call
              </button>
              <button
                onClick={() => setMakeCallTab("search-contacts")}
                className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${makeCallTab === "search-contacts"
                  ? "border-b-primary text-foreground"
                  : "border-b-transparent text-muted-foreground hover:text-foreground"
                  }`}
              >
                Search Contacts
              </button>
            </div>

            {/* Make Call Tab */}
            {makeCallTab === "make-call" && (
              <div>
                <div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Search for a customer or enter a phone number to place an outbound call using the WhatsApp Business API. Please note that outbound calls are chargeable as per{" "}
                    <a href="https://developers.facebook.com/docs/whatsapp/cloud-api/calling/pricing" target="_blank" rel="noopener noreferrer" className="underline text-primary hover:text-primary/80">
                      Meta's pricing policies
                    </a>
                  </p>
                </div>

                {!(hasCallPermission && selectedContact) && (
                  <div>
                    <label className="text-sm font-medium">Enter phone number</label>
                    <div className="flex gap-2 mt-1 mb-4">
                      <Input
                        placeholder="+1 (555) 000-0000"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="border-input w-full"
                      />

                      <Button onClick={handleCheckPermission} className="h-9 btn-outline-primary font-normal" variant="outline" disabled={!phoneNumber.trim()}>
                        Check Permission
                      </Button>
                    </div>
                  </div>
                )}

                {callPermissionChecked && (
                  <div className="space-y-4">
                    {hasCallPermission && selectedContact ? (
                      <div className="border border-input rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className={getAvatarColor(selectedContact.name)}>
                                {selectedContact.name.split(" ").map((n: string) => n[0]).join("").toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{selectedContact.name}</p>
                              <p className="text-xs text-muted-foreground">{selectedContact.number}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-medium text-green-600">Call Consent: Active</p>
                            <p className="text-xs text-muted-foreground">Expires in {selectedContact.expiryDays}d {selectedContact.expiryHours}h</p>
                          </div>
                        </div>

                        <div className="git statusborder-t pt-4 space-y-2">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium">Tries {selectedContact.callsUsed}/{selectedContact.callsMax}</span>
                            <span className="text-xs text-muted-foreground">Renews in {selectedContact.renewsIn}</span>
                          </div>
                          <div className="flex gap-1">
                            {Array.from({ length: selectedContact.callsMax }).map((_, index) => (
                              <div
                                key={index}
                                className={`flex-1 h-2 rounded-full transition-colors ${index < selectedContact.callsUsed ? "bg-primary" : "bg-muted"
                                  }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (

                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/30 dark:border-red-800">
                        <p className="text-sm text-red-800 dark:text-red-300">
                          <strong>Permission Denied</strong> - Call consent not enabled for this contact.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <Button variant="outline" onClick={() => {
                    setPhoneNumber("");
                    setCallPermissionChecked(false);
                    setHasCallPermission(false);
                    setSelectedContact(null);
                    setLimitReached(false);
                  }} className="[border-color:hsl(var(--input))]">
                    Clear
                  </Button>
                  <Button
                    disabled={!hasCallPermission || !callPermissionChecked || limitReached}
                    onClick={() => {
                      setIsCallActive(true);
                      setCallPhoneNumber(selectedContact?.number || phoneNumber);
                      setCallContactName(selectedContact?.name || "");
                      setCallDuration(0);
                      setIsMuted(false);
                      setIsSpeakerOn(false);
                      setIsMakeCallModalOpen(false);
                    }}
                    className="btn-outline-primary font-normal" variant="outline"
                  >
                    Call
                  </Button>
                </div>
              </div>
            )}

            {/* Search Contacts Tab */}
            {makeCallTab === "search-contacts" && (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search contacts..."
                    value={searchContactsQuery}
                    onChange={(e) => setSearchContactsQuery(e.target.value)}
                    className="border-input pl-9"
                  />
                </div>

                <ScrollArea className="h-64 border border-input rounded-lg">
                  <div className="space-y-2 p-3">
                    {mockContacts
                      .filter(contact =>
                        contact.name.toLowerCase().includes(searchContactsQuery.toLowerCase()) ||
                        contact.number.includes(searchContactsQuery)
                      )
                      .map(contact => (
                        <div
                          key={contact.id}
                          onClick={() => {
                            setSelectedContact(contact);
                            setPhoneNumber(contact.number);
                            setCallPermissionChecked(true);
                            setHasCallPermission(contact.callConsent === "Active");
                          }}
                          className={`p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${selectedContact?.id === contact.id
                            ? "border-primary bg-primary/10"
                            : "border-input"
                            }`}
                        >
                          <div className="flex gap-2">
                            {/* Left: Avatar */}
                            <Avatar className="h-11 w-11 flex-shrink-0">
                              <AvatarFallback className={getAvatarColor(contact.name)}>
                                {contact.pfp}
                              </AvatarFallback>
                            </Avatar>

                            {/* Right: Name/Badge and Tries/Expires */}
                            <div className="flex-1 space-y-1">
                              {/* Row 1: Name and Badge */}
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-sm">{contact.name}</p>
                                <div className={`px-2 py-1 rounded text-xs font-medium ${contact.callConsent === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                  {contact.callConsent === "Active" ? "Active" : "Expired"}
                                </div>
                              </div>

                              {/* Row 2: Tries/Renews and Expires */}
                              {contact.callConsent === "Active" ? (
                                <div className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-1">
                                    <span className="font-medium">{contact.callsUsed}/{contact.callsMax} tries</span>
                                    <span className="text-muted-foreground">•</span>
                                    <span className="text-muted-foreground">Renews in {contact.renewsIn}</span>
                                  </div>
                                  <span className="text-muted-foreground">Expires {contact.expiryDays}d {contact.expiryHours}h</span>
                                </div>
                              ) : (
                                <p className="text-xs text-muted-foreground italic">Request consent again to enable calling</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </ScrollArea>

                <div className="flex items-center justify-between pt-4 border-t">
                  <Button variant="outline" onClick={() => {
                    setPhoneNumber("");
                    setCallPermissionChecked(false);
                    setHasCallPermission(false);
                    setSelectedContact(null);
                    setSearchContactsQuery("");
                    setLimitReached(false);
                  }} className="[border-color:hsl(var(--input))]">
                    Clear
                  </Button>
                  <Button
                    disabled={!selectedContact}
                    onClick={() => {
                      if (selectedContact) {
                        setIsCallActive(true);
                        setCallPhoneNumber(selectedContact.number);
                        setCallContactName(selectedContact.name);
                        setCallDuration(0);
                        setIsMuted(false);
                        setIsSpeakerOn(false);
                        setIsMakeCallModalOpen(false);
                      }
                    }}
                    className="btn-outline-primary font-normal" variant="outline"
                  >
                    Call
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Send Template Message Modal */}
        <Dialog open={isTemplateMessageModalOpen} onOpenChange={setIsTemplateMessageModalOpen}>
          <DialogContent className="sm:max-w-3xl flex flex-col">
            <DialogHeader className="mb-2">
              <DialogTitle>Send Template Message</DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto -ml-1">
              <div className="grid grid-cols-2 gap-6">
                {/* Left: Phone Numbers and Template Selection */}
                <div className="space-y-4 pl-1">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Recipients (up to 5)<span className="text-red-500 pl-0.5">*</span></label>
                    <div className="space-y-2">
                      {templatePhoneNumbers.map((phone, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <Input
                            placeholder={`+1 (555) 000-${String(index).padStart(4, "0")}`}
                            value={phone}
                            onChange={(e) => {
                              const newNumbers = [...templatePhoneNumbers];
                              newNumbers[index] = e.target.value;
                              setTemplatePhoneNumbers(newNumbers);
                            }}
                            className="border-input flex-1"
                          />
                          {templatePhoneNumbers.length > 1 && (
                            <button
                              onClick={() => {
                                const newNumbers = templatePhoneNumbers.filter((_, i) => i !== index);
                                setTemplatePhoneNumbers(newNumbers);
                              }}
                              className="text-muted-foreground hover:text-foreground transition-colors border-[]"
                            >
                              <X size={18} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Add another recipient button */}
                    {templatePhoneNumbers.length < 5 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-xs"
                        disabled={templatePhoneNumbers.some(p => p.trim() === "")}
                        onClick={() => {
                          setTemplatePhoneNumbers([...templatePhoneNumbers, ""]);
                        }}
                      >
                        <Plus size={14} className="mr-1" />
                        Add another recipient
                      </Button>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">WhatsApp Template<span className="text-red-500 pl-0.5">*</span></label>
                    <div className="space-y-3">
                      <CustomDropdown
                        options={dummyTemplates.map(t => ({ id: String(t.id), name: t.name }))}
                        selected={selectedTemplate ? [String(selectedTemplate.id)] : []}
                        onChange={(selected) => {
                          if (selected.length > 0) {
                            const template = dummyTemplates.find(t => String(t.id) === selected[0]);
                            if (template) {
                              setSelectedTemplate(template);
                              setTemplateVariables({});
                            }
                          }
                        }}
                        placeholder="Select a template"
                        width="100%"
                        showSelectedOption={true}
                      />
                      {dummyTemplates.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          You don't have any templates yet. Create one to send messages.{" "}
                          <a
                            href="/template-manager"
                            className="text-primary underline hover:no-underline"
                          >
                            Go to Template Manager
                          </a>
                          {" "}to create one.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Variable inputs */}
                  {selectedTemplate && selectedTemplate.variables && selectedTemplate.variables.length > 0 && (
                    <div>
                      <label className="text-sm font-medium block pt-2">Customize Variables</label>
                      <div className="space-y-2">
                        {selectedTemplate.variables.map((variable: string, index: number) => (
                          <div key={index} className="space-y-1">
                            <label className="text-xs font-medium text-gray-600">{variable}</label>
                            <Input
                              placeholder={`Enter ${variable}...`}
                              value={templateVariables[variable] || ""}
                              onChange={(e) => {
                                setTemplateVariables({
                                  ...templateVariables,
                                  [variable]: e.target.value
                                });
                              }}
                              className="border-input text-sm h-9"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Template Preview */}
                <div className="flex flex-col items-center">
                  <label className="text-sm font-medium mb-3 block self-start">Template Preview</label>
                  <div className="h-full max-h-[62vh] w-full max-w-[31vh]">
                    <PreviewV2
                      mode="chat"
                      headerText={selectedTemplate?.header || ""}
                      bodyText={selectedTemplate?.body || ""}
                      footerText={selectedTemplate?.footer || ""}
                      templateButtons={selectedTemplate?.buttons || []}
                      variableSamples={templateVariables}
                      placeholderText="Select a template to see preview..."
                    />
                  </div>
                  <p className="text-[10px] py-1">Preview may not reflect the exact WhatsApp interface</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 px-4 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Message rates apply. See{" "}
                <a
                  href="https://developers.facebook.com/docs/whatsapp/cloud-api/calling/pricing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  WhatsApp pricing
                </a>
                {" "}for details.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsTemplateMessageModalOpen(false);
                    setTemplatePhoneNumbers([""]);
                    setSelectedTemplate(null);
                    setTemplateVariables({});
                  }}
                  className="[border-color:hsl(var(--input))]"
                >
                  Cancel
                </Button>
                <Button
                  disabled={
                    !selectedTemplate ||
                    templatePhoneNumbers.some(p => p.trim() === "") ||
                    (selectedTemplate?.variables && selectedTemplate.variables.length > 0 &&
                      !selectedTemplate.variables.every((v: string) => templateVariables[v]?.trim()))
                  }
                  onClick={handleSendTemplateMessage}
                  className="btn-outline-primary font-normal" variant="outline"
                >
                  Send Message
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Call UI Overlay */}
        {
          isCallActive && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 space-y-6">
                {/* Avatar */}
                <div className="flex justify-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                    <Phone size={48} className="text-white" />
                  </div>
                </div>

                {/* Contact Info */}
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Calling</p>
                  {callContactName && <p className="text-2xl font-bold">{callContactName}</p>}
                  <p className="text-lg font-semibold text-muted-foreground">{callPhoneNumber}</p>
                </div>

                {/* Call Duration */}
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary font-mono">{formatCallDuration(callDuration)}</p>
                </div>

                {/* Call Controls */}
                <div className="flex items-center justify-center gap-4">
                  {/* Mute Button */}
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${isMuted
                      ? "bg-red-100 hover:bg-red-200"
                      : "bg-muted hover:bg-muted/80"
                      }`}
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? (
                      <MicOff size={20} className={isMuted ? "text-red-600" : "text-foreground"} />
                    ) : (
                      <Mic size={20} className="text-foreground" />
                    )}
                  </button>

                  {/* Speaker Button */}
                  <button
                    onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${isSpeakerOn
                      ? "bg-blue-100 hover:bg-blue-200"
                      : "bg-muted hover:bg-muted/80"
                      }`}
                    title={isSpeakerOn ? "Speaker off" : "Speaker on"}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={isSpeakerOn ? "text-blue-600" : "text-foreground"}>
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                      <path d="M15.54 8.46a6.5 6.5 0 0 1 0 9.07"></path>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                    </svg>
                  </button>

                  {/* End Call Button */}
                  <button
                    onClick={() => {
                      setIsCallActive(false);
                      setCallDuration(0);
                      setCallPhoneNumber("");
                      setCallContactName("");
                      setIsMuted(false);
                      setIsSpeakerOn(false);
                      setIsMakeCallModalOpen(false);
                    }}
                    className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors"
                    title="End call"
                  >
                    <Phone size={20} className="text-white rotate-135" />
                  </button>
                </div>

                {/* Call Status */}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Connected</p>
                </div>
              </div>
            </div>
          )
        }




      </div>
    </div >
  );
}
