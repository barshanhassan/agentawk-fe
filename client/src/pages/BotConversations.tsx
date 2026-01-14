import React, { useState, useRef, useEffect } from "react";
import { Search, RefreshCw, Eye, EyeOff, Download, ArrowUp, X, Paperclip } from "react-feather";
import { GripVertical, MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Badge } from "@/components/ui/badge";
import CustomDropdown from "@/components/CustomDropdown";
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

// Helper function to get display name - defaults to phone number if displayName not set
const getDisplayName = (conversation: any): string => {
  return conversation.displayName?.trim() || conversation.phoneNumber || conversation.name || "Unknown";
};

export default function BotConversations() {
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

  // Current user
  const currentUser = { id: "self", name: "Admin User" };

  // Mock agent list
  const agentOptions = [
    { id: "self", name: currentUser.name },
    { id: "agent-1", name: "Sarah Johnson" },
    { id: "agent-2", name: "Mike Chen" },
    { id: "agent-3", name: "Emma Davis" },
    { id: "agent-4", name: "Alex Rodriguez" },
  ];

  // Toggle contact panel visibility
  const handleToggleContactPanel = () => {
    setShowContactPanel(!showContactPanel);
  };

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

    // Filter by tab (all, active, and expired)
    if (activeTab === "active") {
      filtered = filtered.filter(conv => conv.status === "active");
    } else if (activeTab === "expired") {
      filtered = filtered.filter(conv => conv.status === "expired");
    }
    // "all" tab shows all conversations

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(conv =>
        getDisplayName(conv).toLowerCase().includes(searchQuery.toLowerCase())
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

  // Handle assignment - removes conversation from bot conversations when assigned to an agent
  const handleAssignAgent = (agentId: string) => {
    if (selectedConversation) {
      // Remove the conversation from the list
      setConversations(conversations.filter(c => c.id !== selectedConversation));
      setSelectedConversation(null);
      setAssignedAgent(null);
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

  // Edit basic details modal state
  const [isEditBasicDetailsOpen, setIsEditBasicDetailsOpen] = useState(false);
  const [editedBasicDetails, setEditedBasicDetails] = useState(basicDetailsByConv[selectedConversation || 1] || {});

  const handleSaveBasicDetails = () => {
    if (selectedConversation) {
      setBasicDetailsByConv({ ...basicDetailsByConv, [selectedConversation]: editedBasicDetails });

      // Update the conversation's displayName if it was changed
      if (editedBasicDetails.displayName !== undefined) {
        setConversations(conversations.map(conv =>
          conv.id === selectedConversation
            ? { ...conv, displayName: editedBasicDetails.displayName }
            : conv
        ));
      }
    }
    setIsEditBasicDetailsOpen(false);
  };

  const handleClearField = (field: string) => {
    setEditedBasicDetails({ ...editedBasicDetails, [field]: "" });
  };

  // Add custom attribute modal state
  const [isAddAttributeModalOpen, setIsAddAttributeModalOpen] = useState(false);
  const [newAttributeKey, setNewAttributeKey] = useState("");
  const [newAttributeValue, setNewAttributeValue] = useState("");

  const handleAddAttribute = () => {
    if (newAttributeKey.trim() && newAttributeValue.trim() && selectedConversation) {
      const currentAttrs = customAttributesByConv[selectedConversation] || {};
      setCustomAttributesByConv({ ...customAttributesByConv, [selectedConversation]: { ...currentAttrs, [newAttributeKey]: newAttributeValue } });
      setNewAttributeKey("");
      setNewAttributeValue("");
      setIsAddAttributeModalOpen(false);
    }
  };

  // Add teams modal state
  const [isAddTeamsModalOpen, setIsAddTeamsModalOpen] = useState(false);
  const [selectedTeamsForModal, setSelectedTeamsForModal] = useState<string[]>([]);

  const handleOpenTeamsModal = () => {
    setSelectedTeamsForModal(involvedTeamsByConv[selectedConversation || 1] || []);
    setIsAddTeamsModalOpen(true);
  };

  const handleSaveTeams = () => {
    if (selectedConversation) {
      setInvolvedTeamsByConv({ ...involvedTeamsByConv, [selectedConversation]: selectedTeamsForModal });
    }
    setIsAddTeamsModalOpen(false);
  };

  // Filter modal state
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterTeams, setFilterTeams] = useState<string[]>([]);
  const [filterAgents, setFilterAgents] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string[]>([]);

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
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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
        ? { ...conv, lastMessage: messageText || (imageFiles.length > 0 ? "📷 Photo" : otherFiles.length > 0 ? "📎 Attachment" : "🎤 Voice message"), time: "now" }
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
      id: "1",
      name: "Welcome Message",
      category: "Marketing",
      body: "Hello {{name}}, welcome to our service! We're excited to have you on board.",
      variables: ["name"]
    },
    {
      id: "2",
      name: "Order Confirmation",
      category: "Transactional",
      body: "Your order #{{order_id}} has been confirmed. Total: {{amount}}. Delivery in {{days}} days.",
      variables: ["order_id", "amount", "days"]
    },
    {
      id: "3",
      name: "Appointment Reminder",
      category: "Reminder",
      body: "Hi {{name}}, reminder: your appointment is on {{date}} at {{time}}.",
      variables: ["name", "date", "time"]
    }
  ];

  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [templateVariables, setTemplateVariables] = useState<Record<string, string>>({});

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
        time: "now",
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

  const [conversations, setConversations] = useState<Array<{
    id: number;
    phoneNumber: string;
    displayName: string;
    lastMessage: string;
    time: string;
    unread: number;
    channel: string;
    status: string;
    assignedAgent: null;
  }>>([
    // Active Bot Conversations
    { id: 1, phoneNumber: "+1 234 567 8900", displayName: "John Doe", lastMessage: "Hi, I need help with my order", time: "2m ago", unread: 0, channel: "whatsapp", status: "active", assignedAgent: null },
    { id: 2, phoneNumber: "+1 234 567 8901", displayName: "Jane Smith", lastMessage: "Can you send me the invoice?", time: "5m ago", unread: 0, channel: "whatsapp", status: "active", assignedAgent: null },
    { id: 3, phoneNumber: "+1 234 567 8902", displayName: "Michael Chen", lastMessage: "I have a billing question", time: "8m ago", unread: 0, channel: "whatsapp", status: "active", assignedAgent: null },
    { id: 4, phoneNumber: "+1 234 567 8903", displayName: "Sarah Wilson", lastMessage: "Thank you for resolving this!", time: "1m ago", unread: 0, channel: "whatsapp", status: "active", assignedAgent: null },

    // Expired Bot Conversations
    { id: 5, phoneNumber: "+1 234 567 8904", displayName: "Bob Johnson", lastMessage: "Order received, thank you!", time: "3m ago", unread: 0, channel: "whatsapp", status: "expired", assignedAgent: null },
    { id: 6, phoneNumber: "+1 234 567 8905", displayName: "Emma Davis", lastMessage: "When will my refund be processed?", time: "12m ago", unread: 0, channel: "whatsapp", status: "expired", assignedAgent: null },
    { id: 7, phoneNumber: "+1 234 567 8906", displayName: "Alex Rodriguez", lastMessage: "Issue resolved successfully", time: "45m ago", unread: 0, channel: "whatsapp", status: "expired", assignedAgent: null },
  ]);

  // Messages per conversation
  const [conversationMessagesData, setConversationMessagesData] = useState<Record<number, any[]>>({
    1: [
      { id: 1, from: "user", text: "Hi, I need help with my order", time: "10:30 AM" },
      { id: 2, from: "agent", text: "Hello! I'd be happy to help. What's your order number?", time: "10:31 AM" },
      { id: 3, from: "user", text: "It's #ORD-12345", time: "10:32 AM" },
      { id: 4, from: "agent", text: "Let me check that for you...", time: "10:33 AM" },
      { id: 5, from: "user", text: "Thanks for the help!", time: "10:35 AM" },
    ],
    2: [
      { id: 1, from: "user", text: "Can you send me the invoice?", time: "2:15 PM" },
      { id: 2, from: "agent", text: "Of course! Let me find that for you.", time: "2:16 PM" },
      { id: 3, from: "user", text: "Thank you!", time: "2:17 PM" },
    ],
    3: [
      { id: 1, from: "user", text: "I have a billing question", time: "3:45 PM" },
      { id: 2, from: "user", text: "Are you there?", time: "3:50 PM" },
    ],
    4: [
      { id: 1, from: "user", text: "This is amazing!", time: "11:00 AM" },
      { id: 2, from: "agent", text: "Glad I could help!", time: "11:01 AM" },
      { id: 3, from: "user", text: "Thank you for resolving this!", time: "11:02 AM" },
    ],
    5: [
      { id: 1, from: "user", text: "Order received, thank you!", time: "9:30 AM" },
    ],
    6: [
      { id: 1, from: "user", text: "When will my refund be processed?", time: "1:20 PM" },
      { id: 2, from: "agent", text: "It should be processed within 3-5 business days.", time: "1:21 PM" },
    ],
    7: [
      { id: 1, from: "user", text: "Great service!", time: "10:00 AM" },
      { id: 2, from: "agent", text: "Thank you! We appreciate your business.", time: "10:01 AM" },
      { id: 3, from: "user", text: "Issue resolved successfully", time: "10:02 AM" },
    ],
  });



  return (
    <div className="h-full flex flex-col font-sans" data-testid="conversations-inbox">
      <div className="flex-1 flex gap-4 px-6 py-6 max-h-full">
        {/* Left Sidebar */}
        <div className="relative group h-full" data-sidebar>
          <Card className="flex flex-col overflow-hidden shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0 h-full" style={{ width: `${sidebarWidth}px` }}>
            <CardHeader className="space-y-3 pb-3 flex-shrink-0">
              {/* Tabs */}
              <div className="flex justify-between border-b pb-0 w-full">
                {["All", "Active", "Expired"].map((tab) => {
                  const tabKey = tab.toLowerCase();
                  const count = tabKey === "all"
                    ? conversations.length
                    : tabKey === "active"
                      ? conversations.filter(c => c.status === "active").length
                      : conversations.filter(c => c.status === "expired").length;
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

              {/* Search and Sort Only */}
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
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1 gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className={`text-sm truncate ${getPendingMessagesCount(conv.id) > 0 ? "font-bold" : " font-semibold"}`}>{getDisplayName(conv)}</span>
                              {activeTab === "all" && (
                                <Badge
                                  variant="outline"
                                  className={`text-xs flex-shrink-0 ${conv.status === "active" ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800" :
                                    conv.status === "expired" ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800" :
                                      "bg-gray-50 text-gray-700 border-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600"
                                    }`}
                                >
                                  {conv.status}
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground flex-shrink-0">{conv.time}</span>
                          </div>
                          <p className="text-sm truncate mb-1 font-normal text-muted-foreground" style={{ maxWidth: `${sidebarWidth - 96}px` }}>{getLastMessage(conv.id)}</p>
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
        {selectedConversation ? (
          <Card className="flex-1 flex flex-col shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
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
                  <h3 className="font-semibold">{getDisplayName(conversations.find(c => c.id === selectedConversation) || {})}</h3>
                  <p className="text-sm text-muted-foreground">Active now</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 bg-white dark:bg-background hover:bg-accent dark:hover:bg-slate-700 hover-elevate" data-testid="button-refresh">
                      <RefreshCw size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Refresh chat</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 bg-white dark:bg-background hover:bg-accent dark:hover:bg-slate-700 hover-elevate" onClick={handleToggleContactPanel} data-testid="button-view-contact">
                      {showContactPanel ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{showContactPanel ? "Hide" : "Show"} contact profile</TooltipContent>
                </Tooltip>
                <DropdownMenu>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 bg-white dark:bg-background hover:bg-accent dark:hover:bg-slate-700 hover-elevate" data-testid="button-export">
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
                              c.id === selectedConversation ? { ...c, status: "active" } : c
                            ));
                          }
                        }}
                        disabled={conversations.find(c => c.id === selectedConversation)?.status === "active"}
                        className={conversations.find(c => c.id === selectedConversation)?.status === "active" ? "opacity-50 cursor-not-allowed" : ""}
                      >
                        Mark as Active
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          const conv = conversations.find(c => c.id === selectedConversation);
                          if (conv) {
                            setConversations(conversations.map(c =>
                              c.id === selectedConversation ? { ...c, status: "expired" } : c
                            ));
                          }
                        }}
                        disabled={conversations.find(c => c.id === selectedConversation)?.status === "expired"}
                        className={conversations.find(c => c.id === selectedConversation)?.status === "expired" ? "opacity-50 cursor-not-allowed" : ""}
                      >
                        Mark as Expired
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardHeader>
            <Separator />

            {/* Bot Conversation Banner and Assignment UI */}
            <div className="bg-gray-50 dark:bg-slate-900/20 border-b border-gray-200 dark:border-slate-800/50 px-4 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <AlertCircle className="w-4 h-4 text-gray-600 dark:text-slate-400 flex-shrink-0" />
                <p className="text-sm text-gray-800 dark:text-slate-200">
                  <strong>This is a bot conversation!</strong>
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  onClick={() => handleAssignAgent("self")}
                  className="btn-outline-primary font-normal"
                  variant="outline"
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

            {/* Chat Status Notification - Removed for bot conversations */}

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {(conversationMessagesData[selectedConversation!] || []).map((msg: any) => (
                  <div key={msg.id} className={`flex ${msg.from === "agent" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] rounded-lg p-3 ${msg.from === "user" ? "bg-blue-100 dark:bg-blue-900/30 dark:text-blue-100" : "bg-gray-200 text-gray-900 dark:bg-slate-700 dark:text-slate-100"}`} data-testid={`message-${msg.id}`}>
                      {msg.text && <p className="text-sm">{msg.text}</p>}

                      {/* Images */}
                      {msg.images && msg.images.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {msg.images.map((image: any, idx: number) => (
                            <div key={idx} className="space-y-1">
                              <img
                                src={image.url}
                                alt={image.name}
                                className="max-w-full h-auto rounded max-h-64 object-cover"
                              />
                              <div className="flex items-center justify-between gap-2 text-xs bg-black/10 dark:bg-white/10 rounded p-2">
                                <div className="flex items-center gap-1 flex-1 min-w-0">
                                  <span className="truncate">{image.name}</span>
                                  <span className="opacity-70 flex-shrink-0">({(image.size / 1024).toFixed(1)}KB)</span>
                                </div>
                                <button
                                  onClick={() => {
                                    const link = document.createElement("a");
                                    link.href = image.url;
                                    link.download = image.name;
                                    link.click();
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
                                onClick={() => {
                                  const link = document.createElement("a");
                                  link.href = attachment.url;
                                  link.download = attachment.name;
                                  link.click();
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
                                onClick={() => {
                                  const link = document.createElement("a");
                                  link.href = msg.audio.url;
                                  link.download = `voice-message-${msg.id}.webm`;
                                  link.click();
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

                      <p className={`text-xs mt-1 ${msg.from === "user" ? "flex justify-end" : "text-gray-700 dark:text-slate-400"}`}>{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Separator />

            {/* Message Input or Assignment Prompt */}
            <div className="p-6 flex-shrink-0 bg-muted/30 flex flex-col items-center justify-center gap-3">
              <AlertCircle className="w-6 h-6 text-muted-foreground" />
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Assign this chat to start messaging</p>
                <p className="text-xs text-muted-foreground mt-1">Use the assignment options above to get started</p>
              </div>
            </div>
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
                  const displayName = getDisplayName(selectedConv || {});
                  const getInitials = (name: string) => {
                    const parts = name.trim().split(/\s+/).filter((p: string) => p.length > 0);
                    if (parts.length === 0) return "U";
                    if (parts.length === 1) return parts[0][0].toUpperCase();
                    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                  };
                  const initials = getInitials(displayName);
                  return (
                    <>
                      <Avatar className="h-20 w-20">
                        <AvatarFallback className={`text-2xl ${getAvatarColor(displayName)}`}>{initials}</AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <h3 className="font-semibold text-lg">{displayName}</h3>
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
                      setEditedBasicDetails(basicDetailsByConv[selectedConversation || 1] || {});
                      setIsEditBasicDetailsOpen(true);
                    }} className="hover-elevate h-7 text-xs [border-color:hsl(var(--input))]" data-testid="button-edit-basic-details">
                      Edit
                    </Button>
                  </div>
                  <div className="space-y-1 text-sm">
                    {(() => {
                      const details = basicDetailsByConv[selectedConversation || 1] || {};
                      return (
                        <>
                          {details.displayName && (
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-xs text-muted-foreground">Name</span>
                              <span className="text-sm font-semibold truncate">{details.displayName}</span>
                            </div>
                          )}
                          {details.number && (
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-xs text-muted-foreground">Number</span>
                              <span className="text-sm font-semibold truncate">{details.number}</span>
                            </div>
                          )}
                          {details.email && (
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-xs text-muted-foreground">Email</span>
                              <span className="text-sm font-semibold truncate">{details.email}</span>
                            </div>
                          )}
                          {details.gender && (
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-xs text-muted-foreground">Gender</span>
                              <span className="text-sm font-semibold truncate">{details.gender}</span>
                            </div>
                          )}
                          {details.whatsappOptOut && (
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-xs text-muted-foreground">WhatsApp Opt-out</span>
                              <span className="text-sm font-semibold truncate">{details.whatsappOptOut}</span>
                            </div>
                          )}
                          {details.address && (
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-xs text-muted-foreground">Address</span>
                              <span className="text-sm font-semibold truncate">{details.address}</span>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-sm">Customer Tags</h4>
                    <Button variant="ghost" size="sm" onClick={() => setIsAddAttributeModalOpen(true)} className="h-7 bg-white dark:bg-background border border-input dark:border-slate-700 hover:bg-accent dark:hover:bg-slate-700 hover-elevate text-xs" data-testid="button-add-attribute">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      const attrs = customAttributesByConv[selectedConversation || 1] || {};
                      return Object.entries(attrs).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs max-w-full"
                        >
                          <span className="truncate max-w-[calc(100%-20px)]">{key}: {value}</span>
                          <button
                            onClick={() => {
                              const newAttrs = { ...attrs };
                              delete newAttrs[key];
                              setCustomAttributesByConv({ ...customAttributesByConv, [selectedConversation || 1]: newAttrs });
                            }}
                            className="hover:text-blue-900 flex-shrink-0 border rounded"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-sm">Involved Teams</h4>
                    <Button variant="ghost" size="sm" onClick={handleOpenTeamsModal} className="h-7 bg-white dark:bg-background border border-input dark:border-slate-700 hover:bg-accent dark:hover:bg-slate-700 hover-elevate text-xs" data-testid="button-add-teams">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      const teams = involvedTeamsByConv[selectedConversation || 1] || [];
                      return teams.map((teamId) => {
                        const team = teamOptions.find(t => t.id === teamId);
                        return (
                          <div
                            key={teamId}
                            className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs max-w-full"
                          >
                            <span className="truncate max-w-[calc(100%-20px)]">{team?.name}</span>
                            <button
                              onClick={() => {
                                const newTeams = teams.filter(t => t !== teamId);
                                setInvolvedTeamsByConv({ ...involvedTeamsByConv, [selectedConversation || 1]: newTeams });
                              }}
                              className="hover:text-purple-900 flex-shrink-0 border rounded"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Edit Basic Details Modal */}
        <Dialog open={isEditBasicDetailsOpen} onOpenChange={setIsEditBasicDetailsOpen}>
          <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
            <DialogHeader className="px-1 mb-2">
              <DialogTitle>Edit Basic Details</DialogTitle>
            </DialogHeader>

            <div className="px-1 space-y-4 overflow-y-auto flex-1">
              {/* Name */}
              <div>
                <label className="text-sm font-medium mb-2 block">Name</label>
                <div className="flex gap-2 items-center">
                  <Input
                    value={editedBasicDetails.displayName || ""}
                    onChange={(e) => setEditedBasicDetails({ ...editedBasicDetails, displayName: e.target.value })}
                    placeholder="Enter name"
                  />
                  <button
                    onClick={() => handleClearField("displayName")}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Number */}
              <div>
                <label className="text-sm font-medium mb-2 block">Number</label>
                <div className="flex gap-2">
                  <Input
                    value={editedBasicDetails.number}
                    disabled
                    placeholder="Enter number"
                    className="bg-muted text-muted-foreground cursor-not-allowed mr-6"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <div className="flex gap-2 items-center">
                  <Input
                    value={editedBasicDetails.email}
                    onChange={(e) => setEditedBasicDetails({ ...editedBasicDetails, email: e.target.value })}
                    placeholder="Enter email"
                  />
                  <button
                    onClick={() => handleClearField("email")}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="text-sm font-medium mb-2 block">Gender</label>
                <div className="flex gap-2 items-center">
                  <Select value={editedBasicDetails.gender} onValueChange={(value) => setEditedBasicDetails({ ...editedBasicDetails, gender: value })}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <button
                    onClick={() => handleClearField("gender")}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* WhatsApp Opt-out */}
              <div>
                <label className="text-sm font-medium mb-2 block">WhatsApp Opt-out</label>
                <div className="flex gap-2 items-center">
                  <Select value={editedBasicDetails.whatsappOptOut} onValueChange={(value) => setEditedBasicDetails({ ...editedBasicDetails, whatsappOptOut: value })}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                  <button
                    onClick={() => handleClearField("whatsappOptOut")}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="text-sm font-medium mb-2 block">Address</label>
                <div className="flex gap-2 items-center">
                  <Input
                    value={editedBasicDetails.address}
                    onChange={(e) => setEditedBasicDetails({ ...editedBasicDetails, address: e.target.value })}
                    placeholder="Enter address"
                  />
                  <button
                    onClick={() => handleClearField("address")}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            </div>

            <DialogFooter className="px-1 mt-2">
              <Button variant="outline" onClick={() => setIsEditBasicDetailsOpen(false)} className="[border-color:hsl(var(--input))]">
                Close
              </Button>
              <Button onClick={handleSaveBasicDetails} className="btn-outline-primary font-normal" variant="outline">
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Custom Attribute Modal */}
        <Dialog open={isAddAttributeModalOpen} onOpenChange={setIsAddAttributeModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="mb-2">
              <DialogTitle>Add Custom Attribute</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
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

            <DialogFooter className="mt-2">
              <Button variant="outline" onClick={() => setIsAddAttributeModalOpen(false)} className="[border-color:hsl(var(--input))]">
                Close
              </Button>
              <Button onClick={handleAddAttribute} disabled={!newAttributeKey || !newAttributeValue} className="btn-outline-primary font-normal" variant="outline">
                Add Attribute
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>



        {/* Add Teams Modal */}
        <Dialog open={isAddTeamsModalOpen} onOpenChange={setIsAddTeamsModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="mb-2">
              <DialogTitle>Add Teams</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Select Teams</label>
                <CustomDropdown
                  options={teamOptions}
                  selected={selectedTeamsForModal}
                  onChange={setSelectedTeamsForModal}
                  placeholder="Select teams"
                  width="100%"
                />
              </div>
            </div>

            <DialogFooter className="mt-2">
              <Button variant="outline" onClick={() => setIsAddTeamsModalOpen(false)} className="[border-color:hsl(var(--input))]">
                Cancel
              </Button>
              <Button onClick={handleSaveTeams} className="btn-outline-primary font-normal" variant="outline">
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
