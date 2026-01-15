import { useState, useRef, useEffect } from "react";
import { Plus, BarChart2, Edit2, Copy, Trash2, Send, Zap, Search, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Archive, Calendar, FileText, X, Download, Paperclip } from "react-feather";
import { ChartContainer } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, ChevronDown, ChevronsUpDown, ChevronUp, ChevronDown as ChevronDownIcon, ArrowLeft, Info } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import PreviewV2 from "@/components/PreviewV2";
import { useToast } from "@/hooks/use-toast";
import CustomDropdown from "@/components/CustomDropdown";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SortEntry {
  column: string;
  direction: "asc" | "desc";
}

interface Campaign {
  id: number;
  name: string;
  type: "Broadcast" | "API Triggered";
  messageType: string;
  sent: number;
  delivered: number;
  status: "draft" | "scheduled" | "delivered" | "archived";
  // New fields for API Triggered
  startDate?: Date;
  endDate?: Date;
  neverEnds?: boolean;
  whatsAppTemplateName: string;
  // New fields for Broadcast
  schedules?: Schedule[];
  recurringStartDate?: Date;
  recurringEndDate?: Date;
  recurringTime?: { hour: string; minute: string; period: string };
  repeatFrequency?: string;
  dailyRepeatInterval?: string;
  weeklyRepeatDays?: string[];
  monthlyRepeatDates?: number[];
  deliverInTimezone?: boolean;
  csvFileName?: string;
  csvContent?: any[];
  recipients?: Recipient[];
  engagementData?: EngagementData[];
}

interface Schedule {
  id: number;
  date: Date | undefined;
  hour: string;
  minute: string;
  period: string;
}

interface Recipient {
  id: number;
  name: string;
  phone: string;
  status: "Sent" | "Delivered" | "Viewed" | "Failed";
  time: string;
}

interface EngagementData {
  hour: string;
  delivered: number;
  viewed: number;
}

export default function CampaignManager() {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaigns, setSelectedCampaigns] = useState<number[]>([]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [activeDetailsTab, setActiveDetailsTab] = useState("details");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCampaignTypes, setSelectedCampaignTypes] = useState<string[]>([]);
  const [selectedMessageTypes, setSelectedMessageTypes] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowsDropdownOpen, setRowsDropdownOpen] = useState(false);
  const [sort, setSort] = useState<SortEntry | null>(null);
  const [csvSort, setCsvSort] = useState<{ column: string; direction: "asc" | "desc" } | null>(null);
  const [campaignCreationStep, setCampaignCreationStep] = useState<"selectType" | "apiTriggeredForm" | "broadcastForm">("selectType");
  const [editingCampaignId, setEditingCampaignId] = useState<number | null>(null);
  const [campaignName, setCampaignName] = useState("");
  const [campaignStartDate, setCampaignStartDate] = useState<Date | undefined>(undefined);
  const [campaignEndDate, setCampaignEndDate] = useState<Date | undefined>(undefined);
  const [selectedWhatsAppTemplate, setSelectedWhatsAppTemplate] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  const [startDatePickerOpen, setStartDatePickerOpen] = useState(false);
  const [endDatePickerOpen, setEndDatePickerOpen] = useState(false);
  const [neverEnds, setNeverEnds] = useState(false);
  const [broadcastCampaignType, setBroadcastCampaignType] = useState("");
  const [deliverInTimezone, setDeliverInTimezone] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [localCsvData, setLocalCsvData] = useState<any[]>([]);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [isViewCsvModalOpen, setIsViewCsvModalOpen] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([{ id: Date.now(), date: undefined, hour: "", minute: "", period: "" }]);

  // For Recurring Broadcast
  const [recurringStartDate, setRecurringStartDate] = useState<Date | undefined>(undefined);
  const [recurringEndDate, setRecurringEndDate] = useState<Date | undefined>(undefined);
  const [recurringTime, setRecurringTime] = useState({ hour: "", minute: "", period: "" });
  const [repeatFrequency, setRepeatFrequency] = useState(""); // "daily", "weekly", "monthly"
  const [dailyRepeatInterval, setDailyRepeatInterval] = useState("1"); // "1" for "Single Day", "2" for "2 Days" etc.
  const [weeklyRepeatDays, setWeeklyRepeatDays] = useState<string[]>([]); // e.g., ["mon", "tue"]
  const [monthlyRepeatDates, setMonthlyRepeatDates] = useState<number[]>([]); // e.g., [1, 15, 31]

  // For Popover states
  const [recurringStartPickerOpen, setRecurringStartPickerOpen] = useState(false);
  const [recurringEndPickerOpen, setRecurringEndPickerOpen] = useState(false);

  const whatsappTemplates = [
    {
      id: 1,
      name: "welcome_message",
      body: "Hi there! Welcome to our platform. We're excited to have you here! 🎉",
      header: "Welcome to {{company}}",
      footer: "Thank you for choosing us",
      variables: ["company"],
      buttons: [
        { id: 1, type: "visit-website", buttonText: "Visit Website", urlType: "dynamic", websiteUrl: "https://example.com" },
        { id: 2, type: "quick-reply", buttonText: "Learn More" }
      ],
      variableSamples: {
        company: "Acme Corp"
      }
    },
    {
      id: 2,
      name: "order_confirmation",
      body: "Your order #12345 has been confirmed! We'll send you tracking details once it ships. Thank you for your purchase! 📦",
    },
    {
      id: 3,
      name: "promotional_offer",
      body: "🔥 Special Offer! Get 25% off your next purchase with code SAVE25. Valid until midnight tonight! Shop now: link.com/shop",
    },
  ];

  // Modal states
  const [cloneDialogOpen, setCloneDialogOpen] = useState(false);
  const [cloneCampaignName, setCloneCampaignName] = useState("");
  const [campaignToCloneId, setCampaignToCloneId] = useState<number | null>(null);
  const [selectedCampaignForPerformance, setSelectedCampaignForPerformance] = useState<Campaign | null>(null);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [campaignToArchive, setCampaignToArchive] = useState<Campaign | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);
  const [showBulkArchiveModal, setShowBulkArchiveModal] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [recipientSort, setRecipientSort] = useState<{ column: string; direction: "asc" | "desc" } | null>(null);
  const [recipientSearchQuery, setRecipientSearchQuery] = useState("");
  const [recipientPage, setRecipientPage] = useState(1);
  const [recipientRowsPerPage, setRecipientRowsPerPage] = useState(10);
  const [selectedRecipientStatus, setSelectedRecipientStatus] = useState<string[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleColumnSort = (column: string) => {
    if (sort?.column === column) {
      // Toggle: asc -> desc -> unsorted
      if (sort.direction === "asc") {
        setSort({ column, direction: "desc" });
      } else {
        setSort(null);
      }
    } else {
      // New column, start with asc
      setSort({ column, direction: "asc" });
    }
  };

  const renderSortIcon = (column: string) => {
    const isActive = sort?.column === column;
    const color = isActive ? "text-foreground" : "text-muted-foreground";

    if (!isActive) {
      return <div className="w-4 h-4 flex items-center justify-center"><ChevronsUpDown size={14} className={color} /></div>;
    }
    if (sort?.direction === "asc") {
      return <div className="w-4 h-4 flex items-center justify-center"><ChevronUp size={14} className={color} /></div>;
    }
    return <div className="w-4 h-4 flex items-center justify-center"><ChevronDownIcon size={14} className={color} /></div>;
  };

  const getSortedCampaigns = () => {
    let data = [...campaigns];

    if (sort) {
      data.sort((a, b) => {
        const aVal = a[sort.column as keyof Campaign];
        const bVal = b[sort.column as keyof Campaign];

        let comparison = 0;
        if (typeof aVal === "string" && typeof bVal === "string") {
          comparison = sort.direction === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        } else if (typeof aVal === "number" && typeof bVal === "number") {
          comparison = sort.direction === "asc" ? aVal - bVal : bVal - aVal;
        }

        return comparison;
      });
    }

    return data;
  };

  // Initialize campaigns on first render
  useEffect(() => {
    if (campaigns.length === 0) {
      const generateEngagementData = () => Array.from({ length: 24 }, (_, i) => ({
        hour: `${i}:00`,
        delivered: Math.floor(Math.random() * 1000) + 500,
        viewed: Math.floor(Math.random() * 800) + 300,
      }));

      const generateRecipients = (count: number) => Array.from({ length: count }, (_, i) => {
        const statuses = ["Sent", "Delivered", "Viewed", "Failed"];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        return {
          id: i + 1,
          name: `Recipient ${i + 1}`,
          phone: `+1234567${(890 + i).toString().padStart(3, '0')}`,
          status: randomStatus as "Sent" | "Delivered" | "Viewed" | "Failed",
          time: `10:${(30 + i).toString().padStart(2, '0')} AM`,
        };
      });

      setCampaigns([
        {
          id: 1,
          name: "Summer Sale 2024",
          type: "Broadcast",
          messageType: "Immediate",
          sent: 15420,
          delivered: 14892,
          status: "delivered",
          whatsAppTemplateName: "promotional_offer",
          startDate: new Date('2024-07-01'),
          endDate: new Date('2024-07-31'),
          csvFileName: "summer_sale_contacts.csv",
          csvContent: [{ name: "Alice", number: "+1234567890" }],
          engagementData: generateEngagementData(),
          recipients: generateRecipients(20),
        },
        {
          id: 2,
          name: "Cart Abandonment",
          type: "API Triggered",
          messageType: "Recurring",
          sent: 8923,
          delivered: 8654,
          status: "delivered",
          whatsAppTemplateName: "promotional_offer",
          startDate: new Date('2024-01-01'),
          neverEnds: true,
          engagementData: generateEngagementData(),
          recipients: generateRecipients(15),
        },
        {
          id: 3,
          name: "Product Launch",
          type: "Broadcast",
          messageType: "Scheduled",
          sent: 0,
          delivered: 0,
          status: "scheduled",
          whatsAppTemplateName: "welcome_message",
          schedules: [{ id: 1, date: new Date('2025-01-15'), hour: '10', minute: '00', period: 'AM' }],
          deliverInTimezone: true,
          csvFileName: "product_launch_contacts.csv",
          csvContent: [{ name: "Bob", number: "+1987654321" }],
          engagementData: generateEngagementData(),
          recipients: generateRecipients(10),
        },
        {
          id: 4,
          name: "Draft Campaign",
          type: "Broadcast",
          messageType: "Immediate",
          sent: 0,
          delivered: 0,
          status: "draft",
          whatsAppTemplateName: "welcome_message",
          startDate: new Date('2025-02-01'),
          csvFileName: "draft_contacts.csv",
          csvContent: [{ name: "Charlie", number: "+1122334455" }],
          engagementData: generateEngagementData(),
          recipients: generateRecipients(5),
        },
        {
          id: 5,
          name: "Archived Campaign",
          type: "API Triggered",
          messageType: "Recurring",
          sent: 5000,
          delivered: 4800,
          status: "archived",
          whatsAppTemplateName: "order_confirmation",
          startDate: new Date('2023-01-01'),
          endDate: new Date('2023-12-31'),
          engagementData: generateEngagementData(),
          recipients: generateRecipients(25),
        },
      ]);
    }
  }, []);

  // Handle CSV column sorting
  const handleCsvColumnSort = (column: string) => {
    if (csvSort?.column === column) {
      // Toggle: asc -> desc -> unsorted
      if (csvSort.direction === "asc") {
        setCsvSort({ column, direction: "desc" });
      } else {
        setCsvSort(null);
      }
    } else {
      // New column, start with asc
      setCsvSort({ column, direction: "asc" });
    }
  };

  // Get sorted CSV data based on current sort state
  const getSortedCsvData = () => {
    if (!csvSort) return csvData;

    const sortedData = [...csvData].sort((a, b) => {
      const aVal = a[csvSort.column as keyof typeof a];
      const bVal = b[csvSort.column as keyof typeof b];

      let comparison = 0;
      if (typeof aVal === "string" && typeof bVal === "string") {
        comparison = csvSort.direction === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      } else if (typeof aVal === "number" && typeof bVal === "number") {
        comparison = csvSort.direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      return comparison;
    });

    return sortedData;
  };

  const getSortedLocalCsvData = () => {
    if (!csvSort) return localCsvData;

    const sortedData = [...localCsvData].sort((a, b) => {
      const aVal = a[csvSort.column as keyof typeof a];
      const bVal = b[csvSort.column as keyof typeof b];

      let comparison = 0;
      if (typeof aVal === "string" && typeof bVal === "string") {
        comparison = csvSort.direction === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      } else if (typeof aVal === "number" && typeof bVal === "number") {
        comparison = csvSort.direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      return comparison;
    });

    return sortedData;
  };

  // Render sort icon for CSV columns
  const renderCsvSortIcon = (column: string) => {
    const isActive = csvSort?.column === column;
    const color = isActive ? "text-foreground" : "text-muted-foreground";

    if (!isActive) {
      return <div className="w-4 h-4 flex items-center justify-center"><ChevronsUpDown size={14} className={color} /></div>;
    }
    if (csvSort?.direction === "asc") {
      return <div className="w-4 h-4 flex items-center justify-center"><ChevronUp size={14} className={color} /></div>;
    }
    return <div className="w-4 h-4 flex items-center justify-center"><ChevronDownIcon size={14} className={color} /></div>;
  };

  useEffect(() => {
    if (editingCampaignId !== null) {
      const campaignToEdit = campaigns.find(c => c.id === editingCampaignId);
      if (campaignToEdit) {
        setCampaignName(campaignToEdit.name);
        setSelectedWhatsAppTemplate(campaignToEdit.whatsAppTemplateName);
        // Set the selectedTemplate to match the pre-selected template name
        setSelectedTemplate(whatsappTemplates.find(t => t.name === campaignToEdit.whatsAppTemplateName) || null);

        if (campaignToEdit.type === "API Triggered") {
          setCampaignCreationStep("apiTriggeredForm");
          setCampaignStartDate(campaignToEdit.startDate);
          setCampaignEndDate(campaignToEdit.endDate);
          setNeverEnds(campaignToEdit.neverEnds || false);
        } else if (campaignToEdit.type === "Broadcast") {
          setCampaignCreationStep("broadcastForm");
          setBroadcastCampaignType(campaignToEdit.messageType);
          setDeliverInTimezone(campaignToEdit.deliverInTimezone || false);
          // For csvFile, we can't directly restore a File object from just its name and content
          // A dummy File object is created for display purposes, actual content is in csvData
          setCsvFile(campaignToEdit.csvFileName ? new File([], campaignToEdit.csvFileName) : null);
          setCsvData(campaignToEdit.csvContent || []);

          if (campaignToEdit.messageType === 'Scheduled') {
            setSchedules(campaignToEdit.schedules || [{ id: Date.now(), date: undefined, hour: "", minute: "", period: "" }]);
          } else if (campaignToEdit.messageType === 'Recurring') {
            setRecurringStartDate(campaignToEdit.recurringStartDate);
            setRecurringEndDate(campaignToEdit.recurringEndDate);
            setRecurringTime(campaignToEdit.recurringTime || { hour: "", minute: "", period: "" });
            setRepeatFrequency(campaignToEdit.repeatFrequency || "");
            setDailyRepeatInterval(campaignToEdit.dailyRepeatInterval || "1");
            setWeeklyRepeatDays(campaignToEdit.weeklyRepeatDays || []);
            setMonthlyRepeatDates(campaignToEdit.monthlyRepeatDates || []);
          }
        }
      }
    } else {
      // Reset form when not editing (e.g., creating a new campaign)
      resetCreateCampaignForm();
    }
  }, [editingCampaignId, campaigns]);



  const toggleCampaign = (id: number) => {
    setSelectedCampaigns((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    const filteredIds = getFilteredCampaigns().map(c => c.id);
    if (selectedCampaigns.length === filteredIds.length && filteredIds.every(id => selectedCampaigns.includes(id))) {
      setSelectedCampaigns([]);
    } else {
      setSelectedCampaigns(filteredIds);
    }
  };

  const getTypeBadgeClasses = (type: string) => {
    if (type === "Broadcast") return "bg-purple-100 text-purple-700";
    if (type === "API Triggered") return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-700";
  };

  // Filter campaigns by tab, search, and dropdowns
  const getFilteredCampaigns = () => {
    let filtered = campaigns;

    // Filter by status
    if (selectedStatus.length > 0) {
      filtered = filtered.filter(c => selectedStatus.includes(c.status));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by campaign type
    if (selectedCampaignTypes.length > 0) {
      filtered = filtered.filter(c => selectedCampaignTypes.includes(c.type));
    }

    // Filter by message type
    if (selectedMessageTypes.length > 0) {
      filtered = filtered.filter(c => selectedMessageTypes.includes(c.messageType));
    }

    return getSortedCampaigns().filter(c => filtered.includes(c));
  };

  // Clone handlers
  const handleOpenCloneDialog = (campaignId: number) => {
    const campaignToClone = campaigns.find(c => c.id === campaignId);
    if (!campaignToClone) return;

    setCampaignToCloneId(campaignId);
    setCloneCampaignName(campaignToClone.name);
    setCloneDialogOpen(true);
  };

  const handleCancelCloneDialog = () => {
    setCloneDialogOpen(false);
    setCloneCampaignName("");
    setCampaignToCloneId(null);
  };

  const handleCloneCampaign = () => {
    if (!campaignToCloneId || !cloneCampaignName.trim()) return;

    const campaignToClone = campaigns.find(c => c.id === campaignToCloneId);
    if (!campaignToClone) return;

    const clonedCampaign: Campaign = {
      ...campaignToClone,
      id: Date.now(),
      name: cloneCampaignName,
      status: "draft",
      sent: 0,
      delivered: 0,
    };

    setCampaigns([...campaigns, clonedCampaign]);
    toast({
      title: "Campaign Cloned",
      description: `${cloneCampaignName} has been cloned to Draft`,
    });
    handleCancelCloneDialog();
  };

  // Archive handlers
  const handleOpenArchiveModal = (campaign: Campaign) => {
    setCampaignToArchive(campaign);
    setShowArchiveModal(true);
  };

  const handleConfirmArchive = () => {
    if (!campaignToArchive) return;

    setCampaigns(campaigns.map(c =>
      c.id === campaignToArchive.id ? { ...c, status: "archived" } : c
    ));
    toast({
      title: "Campaign Archived",
      description: `${campaignToArchive.name} has been archived`,
    });
    setShowArchiveModal(false);
    setCampaignToArchive(null);
  };

  // Delete handlers
  const handleOpenDeleteModal = (campaign: Campaign) => {
    setCampaignToDelete(campaign);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (!campaignToDelete) return;

    setCampaigns(campaigns.filter(c => c.id !== campaignToDelete.id));
    toast({
      title: "Campaign Deleted",
      description: `${campaignToDelete.name} has been deleted`,
    });
    setShowDeleteModal(false);
    setCampaignToDelete(null);
  };

  // Get archivable campaigns (non-archived)
  const getArchivableCampaigns = () => {
    return selectedCampaigns.filter(id => {
      const campaign = campaigns.find(c => c.id === id);
      return campaign && campaign.status !== "archived";
    });
  };

  // Get deletable campaigns (archived only)
  const getDeletableCampaigns = () => {
    return selectedCampaigns.filter(id => {
      const campaign = campaigns.find(c => c.id === id);
      return campaign && campaign.status === "archived";
    });
  };

  // Bulk archive handler
  const handleBulkArchive = () => {
    const archivable = getArchivableCampaigns();
    setCampaigns(campaigns.map(c =>
      archivable.includes(c.id) ? { ...c, status: "archived" } : c
    ));
    toast({
      title: "Campaigns Archived",
      description: `${archivable.length} campaign(s) have been archived`,
    });
    setShowBulkArchiveModal(false);
    setSelectedCampaigns([]);
  };

  // Bulk delete handler
  const handleBulkDelete = () => {
    const deletable = getDeletableCampaigns();
    setCampaigns(campaigns.filter(c => !deletable.includes(c.id)));
    toast({
      title: "Campaigns Deleted",
      description: `${deletable.length} campaign(s) have been deleted`,
    });
    setShowBulkDeleteModal(false);
    setSelectedCampaigns([]);
  };

  const handleRecipientSort = (column: string) => {
    if (recipientSort?.column === column) {
      if (recipientSort.direction === "asc") {
        setRecipientSort({ column, direction: "desc" });
      } else {
        setRecipientSort(null);
      }
    } else {
      setRecipientSort({ column, direction: "asc" });
    }
  };

  const renderRecipientSortIcon = (column: string) => {
    const isActive = recipientSort?.column === column;
    const color = isActive ? "text-foreground" : "text-muted-foreground";

    if (!isActive) {
      return <div className="w-4 h-4 flex items-center justify-center"><ChevronsUpDown size={14} className={color} /></div>;
    }
    if (recipientSort?.direction === "asc") {
      return <div className="w-4 h-4 flex items-center justify-center"><ChevronUp size={14} className={color} /></div>;
    }
    return <div className="w-4 h-4 flex items-center justify-center"><ChevronDownIcon size={14} className={color} /></div>;
  };

  const getSortedRecipients = () => {
    let data = [...(selectedCampaignForPerformance?.recipients || [])];

    if (recipientSearchQuery) {
      data = data.filter(r => r.name.toLowerCase().includes(recipientSearchQuery.toLowerCase()) || r.phone.toLowerCase().includes(recipientSearchQuery.toLowerCase()));
    }

    if (recipientSort) {
      data.sort((a, b) => {
        const aVal = a[recipientSort.column as keyof typeof a];
        const bVal = b[recipientSort.column as keyof typeof b];

        let comparison = 0;
        if (recipientSort.column === "status") {
          const order = ["Viewed", "Delivered", "Sent", "Failed"];
          const aIndex = order.indexOf(aVal as string);
          const bIndex = order.indexOf(bVal as string);
          comparison = recipientSort.direction === "asc" ? aIndex - bIndex : bIndex - aIndex;
        } else if (typeof aVal === "string" && typeof bVal === "string") {
          comparison = recipientSort.direction === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        } else if (typeof aVal === "number" && typeof bVal === "number") {
          comparison = recipientSort.direction === "asc" ? aVal - bVal : bVal - aVal;
        }

        return comparison;
      });
    }

    if (selectedRecipientStatus.length > 0) {
      data = data.filter(r => selectedRecipientStatus.includes(r.status));
    }

    return data;
  };

  const resetCreateCampaignForm = () => {
    setCampaignCreationStep("selectType");
    setCampaignName("");
    setCampaignStartDate(undefined);
    setCampaignEndDate(undefined);
    setSelectedWhatsAppTemplate(null);
    setSelectedTemplate(null);
    setNeverEnds(false);
    setSchedules([{ id: Date.now(), date: undefined, hour: "", minute: "", period: "" }]);
    setBroadcastCampaignType("");
    setCsvFile(null);
    setCsvData([]);
    setCsvError(null);
    setDeliverInTimezone(false);
    setRecurringStartDate(undefined);
    setRecurringEndDate(undefined);
    setRecurringTime({ hour: "", minute: "", period: "" });
    setRepeatFrequency("");
    setDailyRepeatInterval("1");
    setWeeklyRepeatDays([]);
    setMonthlyRepeatDates([]);
    setCsvSort(null);
  };

  const handleCreateCampaign = (status: "draft" | "scheduled") => {
    const campaignData: Campaign = {
      id: editingCampaignId || Date.now(), // Preserve ID if editing, otherwise generate new
      name: campaignName,
      type: "API Triggered",
      messageType: "Recurring",
      sent: 0,
      delivered: 0,
      status: status,
      startDate: campaignStartDate,
      endDate: neverEnds ? undefined : campaignEndDate,
      neverEnds: neverEnds,
      whatsAppTemplateName: selectedWhatsAppTemplate!,
    };

    if (editingCampaignId) {
      setCampaigns(prev => prev.map(c => c.id === editingCampaignId ? { ...campaignData, sent: c.sent, delivered: c.delivered } : c));
      toast({
        title: "Campaign Updated",
        description: `${campaignName} has been updated.`,
      });
    } else {
      setCampaigns(prev => [...prev, campaignData]);
      toast({
        title: status === "draft" ? "Draft Saved" : "Campaign Set Live",
        description: `${campaignName} has been ${status === "draft" ? "saved as a draft" : "set live"}.`,
      });
    }
    setCreateOpen(false);
    setEditingCampaignId(null); // Reset editingCampaignId
    resetCreateCampaignForm();
  };

  const handleCreateBroadcastCampaign = (status: "draft" | "scheduled") => {
    if (broadcastCampaignType === 'Immediate') {
      setDeliverInTimezone(false);
    }

    const campaignData: Campaign = {
      id: editingCampaignId || Date.now(), // Preserve ID if editing, otherwise generate new
      name: campaignName,
      type: "Broadcast",
      messageType: broadcastCampaignType,
      sent: 0,
      delivered: 0,
      status: status,
      whatsAppTemplateName: selectedWhatsAppTemplate!,
      csvFileName: csvFile?.name,
      csvContent: csvData,
      schedules: broadcastCampaignType === 'Scheduled' ? schedules : undefined,
      recurringStartDate: broadcastCampaignType === 'Recurring' ? recurringStartDate : undefined,
      recurringEndDate: broadcastCampaignType === 'Recurring' ? recurringEndDate : undefined,
      recurringTime: broadcastCampaignType === 'Recurring' ? recurringTime : undefined,
      repeatFrequency: broadcastCampaignType === 'Recurring' ? repeatFrequency : undefined,
      dailyRepeatInterval: broadcastCampaignType === 'Recurring' ? dailyRepeatInterval : undefined,
      weeklyRepeatDays: broadcastCampaignType === 'Recurring' ? weeklyRepeatDays : undefined,
      monthlyRepeatDates: broadcastCampaignType === 'Recurring' ? monthlyRepeatDates : undefined,
      deliverInTimezone: deliverInTimezone,
    };

    if (editingCampaignId) {
      setCampaigns(prev => prev.map(c => c.id === editingCampaignId ? { ...campaignData, sent: c.sent, delivered: c.delivered } : c));
      toast({
        title: "Campaign Updated",
        description: `${campaignName} has been updated.`,
      });
    } else {
      setCampaigns(prev => [...prev, campaignData]);
      toast({
        title: status === "draft" ? "Draft Saved" : "Campaign Set Live",
        description: `${campaignName} has been ${status === "draft" ? "saved as a draft" : "set live"}.`,
      });
    }
    setCreateOpen(false);
    setEditingCampaignId(null); // Reset editingCampaignId
    resetCreateCampaignForm();
  };

  const handleScheduleChange = (index: number, field: keyof Schedule, value: any) => {
    const newSchedules = [...schedules];
    newSchedules[index] = { ...newSchedules[index], [field]: value };
    setSchedules(newSchedules);
  };

  const addSchedule = () => {
    if (schedules.length < 5) {
      setSchedules([...schedules, { id: Date.now(), date: undefined, hour: "", minute: "", period: "" }]);
    }
  };

  const removeSchedule = (id: number) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  const toggleWeeklyDay = (day: string) => {
    setWeeklyRepeatDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const toggleMonthlyDate = (date: number) => {
    setMonthlyRepeatDates(prev =>
      prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
    );
  };

  const isSchedulesInvalid = schedules.length === 0 || schedules.some(s => !s.date || !s.hour || !s.minute || !s.period);

  const isRecurringInvalid = !recurringStartDate || !recurringEndDate || !recurringTime.hour || !recurringTime.minute || !recurringTime.period || !repeatFrequency || (repeatFrequency === 'weekly' && weeklyRepeatDays.length === 0) || (repeatFrequency === 'monthly' && monthlyRepeatDates.length === 0);

  const hasAtLeastOneCompleteRow = localCsvData.some(row => row.name?.trim() && row.number?.trim());
  const hasPartiallyFilledRow = localCsvData.some(row => (row.name?.trim() && !row.number?.trim()) || (!row.name?.trim() && row.number?.trim()));
  const isCsvSaveDisabled = !hasAtLeastOneCompleteRow || hasPartiallyFilledRow;

  // Utility function to format tooltip names
  const formatTooltipName = (name: string): string => {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-md p-2 shadow-md">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-sm">{formatTooltipName(entry.name)}:</span>
              <span className="text-sm font-medium" style={{ color: entry.color }}>
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };


  return (
    <div className="p-6 space-y-6" data-testid="campaign-manager">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Campaign Manager</h1>
        <Button className="gap-2 font-normal btn-outline-primary" variant="outline" onClick={() => setCreateOpen(true)} data-testid="button-create-campaign">
          <Plus size={16} />
          Create Campaign
        </Button>
      </div>



      {/* WhatsApp Account Status */}
      {/* <div className="flex items-center space-x-5">
        <div className="flex items-center space-x-2 text-sm px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-md w-fit">
          <span className="text-sm font-medium text-foreground dark:text-blue-300">Message limit:</span>
          <span className="text-sm text-foreground dark:text-blue-300">1K Customers/24hr</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3 w-3 dark:text-blue-300" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="break-normal w-[16rem] whitespace-normal">The number of business-initiated conversations you can start in a 24 hour rolling period.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        {(() => {
          const isConnected = Math.random() < 0.5;
          const bgColor = isConnected ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30';
          const textColor = isConnected ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300';
          const statusText = isConnected ? 'Connected' : 'Disconnected';
          return (
            <div className={`flex items-center space-x-2 text-sm px-2 py-1 ${bgColor} rounded-md w-fit`}>
              <span className={`text-sm font-medium text-foreground ${textColor.split(' ').filter(c => c.startsWith('dark:')).join(' ')}`}>Account Status:</span>
              <span className={`text-sm ${textColor}`}>{statusText}</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className={`h-3 w-3 ${textColor.split(' ').filter(c => c.startsWith('dark:')).join(' ')}`} />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="break-normal w-[16rem] whitespace-normal">Phone number is associated with this account and working properly</p>
                </TooltipContent>
              </Tooltip>
            </div>
          );
        })()}
        {(() => {
          const health = Math.random();
          let healthStatus, bgColor, textColor;
          if (health < 0.33) {
            healthStatus = "Green";
            bgColor = "bg-green-100 dark:bg-green-900/30";
            textColor = "text-green-800 dark:text-green-300";
          } else if (health < 0.66) {
            healthStatus = "Yellow";
            bgColor = "bg-yellow-100 dark:bg-yellow-900/30";
            textColor = "text-yellow-800 dark:text-yellow-300";
          } else {
            healthStatus = "Red";
            bgColor = "bg-red-100 dark:bg-red-900/30";
            textColor = "text-red-800 dark:text-red-300";
          }
          return (
            <div className={`flex items-center space-x-2 text-sm px-2 py-1 ${bgColor} rounded-md w-fit`}>
              <span className={`text-sm font-medium text-foreground ${textColor.split(' ').filter(c => c.startsWith('dark:')).join(' ')}`}>Account Health:</span>
              <span className={`text-sm ${textColor}`}>{healthStatus}</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className={`h-3 w-3 ${textColor.split(' ').filter(c => c.startsWith('dark:')).join(' ')}`} />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="break-normal w-[16rem] whitespace-normal">Account health is based on how messages have been received by the recipients over the last 7 days. It is determined by a combination of quality signals from conversations between business and users. Examples include user feedback signals like blocks, reports and the reasons users provide when they block a business.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          );
        })()}
      </div> */}

      {/* Search and Filters Section */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs" style={{ height: "38px" }}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-sm w-full h-full border border-input rounded-md bg-background focus:outline-none transition-colors"
          />
        </div>

        {/* Status Dropdown */}
        <CustomDropdown
          options={[
            { id: "draft", name: "Draft" },
            { id: "scheduled", name: "Scheduled" },
            { id: "delivered", name: "Delivered" },
            { id: "archived", name: "Archived" },
          ]}
          selected={selectedStatus}
          onChange={setSelectedStatus}
          placeholder="Status"
          width="150px"
        />

        {/* Campaign Type Dropdown */}
        <CustomDropdown
          options={[
            { id: "Broadcast", name: "Broadcast" },
            { id: "API Triggered", name: "API Triggered" },
          ]}
          selected={selectedCampaignTypes}
          onChange={setSelectedCampaignTypes}
          placeholder="Campaign Type"
          width="182px"
        />

        {/* Message Type Dropdown */}
        <CustomDropdown
          options={[
            { id: "Immediate", name: "Immediate" },
            { id: "Scheduled", name: "Scheduled" },
            { id: "Recurring", name: "Recurring" },
          ]}
          selected={selectedMessageTypes}
          onChange={setSelectedMessageTypes}
          placeholder="Message Type"
          width="170px"
        />
      </div>

      {/* Table */}
      <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
        <CardContent className="pt-2">
          {/* Bulk Actions Toolbar */}
          {selectedCampaigns.length > 0 && (
            <div className="flex items-center gap-3 mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
              <span className="text-sm text-foreground">{selectedCampaigns.length} selected</span>
              <div className="flex gap-2 ml-auto">
                {getArchivableCampaigns().length > 0 && (
                  <button
                    className="p-1 hover:bg-accent dark:hover:bg-slate-700 rounded transition-colors"
                    title="Archive"
                    onClick={() => setShowBulkArchiveModal(true)}
                  >
                    <Archive size={14} className="text-blue-600 dark:text-blue-400" />
                  </button>
                )}
                {getDeletableCampaigns().length > 0 && (
                  <button
                    className="p-1 hover:bg-accent dark:hover:bg-slate-700 rounded transition-colors"
                    title="Delete"
                    onClick={() => setShowBulkDeleteModal(true)}
                  >
                    <Trash2 size={14} className="text-red-600 dark:text-red-400" />
                  </button>
                )}
              </div>
            </div>
          )}

          <div className={`overflow-x-auto ${selectedCampaigns.length > 0 ? 'mt-3' : 'mt-6'}`}>
            <table className="w-full text-xs">
              <thead className="select-none">
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">
                    <Checkbox
                      checked={getFilteredCampaigns().length > 0 && getFilteredCampaigns().every(c => selectedCampaigns.includes(c.id))}
                      onCheckedChange={toggleAll}
                      data-testid="checkbox-select-all"
                    />
                  </th>
                  <th
                    className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                    onClick={() => handleColumnSort("name")}
                  >
                    <div className="flex items-center gap-2">
                      Campaign Name
                      {renderSortIcon("name")}
                    </div>
                  </th>
                  <th
                    className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                    onClick={() => handleColumnSort("type")}
                  >
                    <div className="flex items-center gap-2">
                      Campaign Type
                      {renderSortIcon("type")}
                    </div>
                  </th>
                  <th
                    className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                    onClick={() => handleColumnSort("messageType")}
                  >
                    <div className="flex items-center gap-2">
                      Message Type
                      {renderSortIcon("messageType")}
                    </div>
                  </th>
                  <th
                    className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                    onClick={() => handleColumnSort("status")}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      {renderSortIcon("status")}
                    </div>
                  </th>
                  <th
                    className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                    onClick={() => handleColumnSort("sent")}
                  >
                    <div className="flex items-center gap-2">
                      Sent
                      {renderSortIcon("sent")}
                    </div>
                  </th>
                  <th
                    className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                    onClick={() => handleColumnSort("delivered")}
                  >
                    <div className="flex items-center gap-2">
                      Delivered
                      {renderSortIcon("delivered")}
                    </div>
                  </th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredCampaigns().length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-muted-foreground">
                      No results
                    </td>
                  </tr>
                ) : (
                  getFilteredCampaigns().map((campaign) => (
                    <tr key={campaign.id} className="border-b hover:bg-muted/50" data-testid={`campaign-row-${campaign.id}`}>
                      <td className="py-2 px-3">
                        <Checkbox
                          checked={selectedCampaigns.includes(campaign.id)}
                          onCheckedChange={() => toggleCampaign(campaign.id)}
                          data-testid={`checkbox-campaign-${campaign.id}`}
                        />
                      </td>
                      <td className="py-2 px-3 max-w-[10rem]">
                        <div className="break-all">
                          {campaign.name}
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <Badge variant="outline" className={`font-medium ${campaign.type === "Broadcast" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800" :
                          campaign.type === "API Triggered" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800" :
                            "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                          }`}>
                          {campaign.type}
                        </Badge>
                      </td>
                      <td className="py-2 px-3">{campaign.messageType}</td>
                      <td className="py-2 px-3 capitalize text-xs">
                        <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${campaign.status === "delivered" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" :
                          campaign.status === "scheduled" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300" :
                            "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          }`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="py-2 px-3">{campaign.sent.toLocaleString()}</td>
                      <td className="py-2 px-3">{campaign.delivered.toLocaleString()}</td>
                      <td className="py-2 px-3 flex justify-start">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1 hover:bg-muted rounded">
                              <MoreVertical size={14} className="text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white dark:bg-background">
                            <DropdownMenuItem onClick={() => {
                              setSelectedCampaignForPerformance(campaign);
                              setDetailsOpen(true);
                            }} data-testid={`button-performance-${campaign.id}`}>
                              <BarChart2 size={14} className="mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setEditingCampaignId(campaign.id);
                              setCreateOpen(true);
                            }} data-testid={`button-edit-${campaign.id}`}>
                              <Edit2 size={14} className="mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenCloneDialog(campaign.id)} data-testid={`button-clone-${campaign.id}`}>
                              <Copy size={14} className="mr-2" />
                              Clone
                            </DropdownMenuItem>
                            {campaign.status !== "archived" ? (
                              <DropdownMenuItem onClick={() => handleOpenArchiveModal(campaign)} data-testid={`button-archive-${campaign.id}`}>
                                <Archive size={14} className="mr-2" />
                                Archive
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem className="text-destructive" onClick={() => handleOpenDeleteModal(campaign)} data-testid={`button-delete-${campaign.id}`}>
                                <Trash2 size={14} className="mr-2" />
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 text-xs">
            <span className="text-muted-foreground">{getFilteredCampaigns().length} results</span>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Rows per page:</span>
              <div className="relative w-15" ref={dropdownRef}>
                <button
                  type="button"
                  className="flex items-center justify-between px-3 py-2 text-left bg-background dark:bg-background border border-input dark:border-slate-700 rounded-md shadow-sm hover:bg-accent dark:hover:bg-slate-700 focus:outline-none text-foreground transition-colors"
                  onClick={() => setRowsDropdownOpen(!rowsDropdownOpen)}
                >
                  <span className="truncate text-xs font-normal">{rowsPerPage}</span>
                  <ChevronDown className="h-3 w-3 ml-2 text-muted-foreground" />
                </button>
                {rowsDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-background dark:bg-background rounded-md shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border border-border dark:border-slate-700 overflow-hidden">
                    <ul className="py-1">
                      {[10, 25, 50].map(option => (
                        <li
                          key={option}
                          className="px-3 py-2 text-xs cursor-pointer hover:bg-muted dark:hover:bg-slate-700"
                          onClick={() => {
                            setRowsPerPage(option);
                            setRowsDropdownOpen(false);
                          }}
                        >
                          {option}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <span className="text-muted-foreground">Page 1 of 1</span>
              <div className="flex gap-1">
                <button className="p-1 hover:bg-muted dark:hover:bg-slate-700 rounded disabled:opacity-50 transition-colors" disabled>
                  <ChevronsLeft size={16} />
                </button>
                <button className="p-1 hover:bg-muted dark:hover:bg-slate-700 rounded disabled:opacity-50 transition-colors" disabled>
                  <ChevronLeft size={16} />
                </button>
                <button className="p-1 hover:bg-muted dark:hover:bg-slate-700 rounded disabled:opacity-50 transition-colors" disabled>
                  <ChevronRight size={16} />
                </button>
                <button className="p-1 hover:bg-muted dark:hover:bg-slate-700 rounded disabled:opacity-50 transition-colors" disabled>
                  <ChevronsRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Campaign Dialog */}
      <Dialog open={createOpen} onOpenChange={(isOpen) => {
        setCreateOpen(isOpen);
        if (!isOpen) {
          resetCreateCampaignForm();
          setEditingCampaignId(null); // Reset editingCampaignId when dialog Cancels
        }
      }}>
        <DialogContent className={campaignCreationStep === "apiTriggeredForm" || campaignCreationStep === "broadcastForm" ? "max-w-3xl" : "max-w-lg"} data-testid="dialog-create-campaign">
          {campaignCreationStep === "selectType" && (
            <>
              <DialogHeader className="mb-2">
                <DialogTitle>Create Campaign</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <Card className="cursor-pointer hover-elevate active-elevate-2 shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0" data-testid="card-api-triggered" onClick={() => setCampaignCreationStep("apiTriggeredForm")}>
                  <CardHeader className="text-center pb-2">
                    <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                      <Zap size={24} className="text-primary dark:text-primary/80" />
                    </div>
                    <CardTitle className="text-base">API Triggered</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground">Send messages based on API calls and user actions</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover-elevate active-elevate-2 shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0" data-testid="card-broadcast" onClick={() => setCampaignCreationStep("broadcastForm")}>
                  <CardHeader className="text-center pb-2">
                    <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                      <Send size={24} className="text-primary dark:text-primary/80" />
                    </div>
                    <CardTitle className="text-base">Broadcast</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground">Send bulk messages to a list of contacts</p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {campaignCreationStep === "apiTriggeredForm" && (
            <>
              <DialogHeader className="mb-2">
                <div className="flex items-center gap-3 mb-2">
                  {!editingCampaignId && (
                    <ArrowLeft size={18} className="cursor-pointer" onClick={() => setCampaignCreationStep("selectType")} />
                  )}
                  <DialogTitle>{editingCampaignId ? "Edit API Triggered Campaign" : "Create API Triggered Campaign"}</DialogTitle>
                </div>
              </DialogHeader>

              <div className="flex gap-4">
                {/* Left: Form */}
                <div className="flex-1 !max-h-[62vh] overflow-y-auto pr-2 -ml-1">
                  <div className="space-y-6 pl-1 pb-1">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Campaign Details</h3>
                      <p className="text-sm text-muted-foreground">Give your campaign a name and choose when you want to schedule your campaign.</p>
                    </div>

                    {/* Campaign Name */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-foreground">Campaign name<span className="text-red-500 pl-0.5">*</span></label>
                      </div>
                      <div className="relative">
                        <Input
                          placeholder="Enter campaign name..."
                          value={campaignName}
                          onChange={(e) => setCampaignName(e.target.value.slice(0, 512))}
                          className="pr-12 border border-input [border-color:hsl(var(--input))] hover-elevate"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                          {campaignName.length}/512
                        </span>
                      </div>
                    </div>

                    {/* Campaign Start and End Date */}
                    <div className="flex flex-col gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Campaign start date<span className="text-red-500 pl-0.5">*</span></label>
                        <Popover open={startDatePickerOpen} onOpenChange={setStartDatePickerOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className="w-full justify-between text-left font-normal border-input [border-color:hsl(var(--input))] hover-elevate"
                            >
                              <div className="flex items-center">
                                <Calendar size={14} className="mr-2" />
                                {campaignStartDate ? campaignStartDate.toLocaleDateString() : <span>Pick a date</span>}
                              </div>
                              <ChevronDown size={14} className="text-muted-foreground" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                              mode="single"
                              selected={campaignStartDate}
                              onSelect={(date) => {
                                setCampaignStartDate(date);
                                if (campaignEndDate && date && date > campaignEndDate) {
                                  setCampaignEndDate(undefined);
                                }
                                setStartDatePickerOpen(false);
                              }}
                              disabled={campaignEndDate ? { after: campaignEndDate } : undefined}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-foreground">Campaign end date<span className="text-red-500 pl-0.5">*</span></label>
                          <div className="flex items-end space-x-2 mt-2">
                            <Checkbox id="never-ends" checked={neverEnds} onCheckedChange={(checked) => {
                              setNeverEnds(checked as boolean);
                              if (checked) {
                                setCampaignEndDate(undefined);
                              }
                            }} />
                            <label
                              htmlFor="never-ends"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Never end
                            </label>
                          </div>
                        </div>
                        <Popover open={endDatePickerOpen} onOpenChange={setEndDatePickerOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className="w-full justify-between text-left font-normal border-input [border-color:hsl(var(--input))] hover-elevate"
                              disabled={neverEnds}
                            >
                              <div className="flex items-center">
                                <Calendar size={14} className="mr-2" />
                                {campaignEndDate ? campaignEndDate.toLocaleDateString() : <span>Pick a date</span>}
                              </div>
                              <ChevronDown size={14} className="text-muted-foreground" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                              mode="single"
                              selected={campaignEndDate}
                              onSelect={(date) => {
                                setCampaignEndDate(date);
                                if (campaignStartDate && date && date < campaignStartDate) {
                                  setCampaignStartDate(undefined);
                                }
                                setEndDatePickerOpen(false);
                              }}
                              disabled={campaignStartDate ? { before: campaignStartDate } : undefined}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    {/* WhatsApp Template Dropdown */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">WhatsApp Template<span className="text-red-500 pl-0.5">*</span></label>
                      <Select
                        value={selectedWhatsAppTemplate || ""}
                        onValueChange={(value) => {
                          setSelectedWhatsAppTemplate(value);
                          setSelectedTemplate(whatsappTemplates.find(t => t.name === value) || null);
                        }}
                      >
                        <SelectTrigger className="border border-input [border-color:hsl(var(--input))] hover-elevate">
                          <SelectValue placeholder="Select a template" />
                        </SelectTrigger>
                        <SelectContent>
                          {whatsappTemplates.map(template => (
                            <SelectItem key={template.id} value={template.name}>{template.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Right: Template Preview */}
                <div>
                  <h3 className="font-semibold text-lg mb-1">Template Preview</h3>
                  <div className="flex flex-col items-center h-full max-h-[62vh] w-full max-w-[31vh]">
                    <PreviewV2
                      mode="chat"
                      headerText={selectedTemplate?.header || ""}
                      bodyText={selectedTemplate?.body || ""}
                      footerText={selectedTemplate?.footer || ""}
                      selectedMediaFile={null}
                      templateButtons={selectedTemplate?.buttons || []}
                      variableSamples={selectedTemplate?.variableSamples || {}}
                    />
                    <p className="text-[10px] py-1">Preview may not reflect the exact WhatsApp interface</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                {editingCampaignId ? (
                  <Button
                    variant="outline"
                    onClick={() => { setCreateOpen(false); setEditingCampaignId(null); }}
                    className="border-input [border-color:hsl(var(--input))] font-normal"
                  >
                    Cancel
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setCampaignCreationStep("selectType")}
                    className="border-input [border-color:hsl(var(--input))] font-normal"
                  >
                    Back
                  </Button>
                )}
                <div className="flex gap-2">
                  {!editingCampaignId && (
                    <Button
                      variant="outline"
                      className="btn-outline-primary font-normal"
                      disabled={!campaignName}
                      onClick={() => handleCreateCampaign("draft")}
                    >
                      Save Draft
                    </Button>
                  )}
                  <Button
                    className="gap-2 font-normal btn-outline-primary"
                    variant="outline"
                    disabled={!campaignName || !campaignStartDate || (!campaignEndDate && !neverEnds) || !selectedWhatsAppTemplate}
                    onClick={() => handleCreateCampaign("scheduled")}
                  >
                    {editingCampaignId ? "Save Campaign" : "Set Live"}
                  </Button>
                </div>
              </div>
            </>
          )}

          {campaignCreationStep === "broadcastForm" && (
            <>
              <DialogHeader className="mb-2">
                <div className="flex items-center gap-3 mb-2">
                  {!editingCampaignId && (
                    <ArrowLeft size={18} className="cursor-pointer" onClick={() => setCampaignCreationStep("selectType")} />
                  )}
                  <DialogTitle>{editingCampaignId ? "Edit Broadcast Campaign" : "Create Broadcast Campaign"}</DialogTitle>
                </div>
              </DialogHeader>

              <div className="flex gap-4">
                {/* Left: Form */}
                <div className="flex-1 !max-h-[62vh] overflow-y-auto pr-2 -ml-1">
                  <div className="space-y-6 pl-1 pb-1">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Campaign Details</h3>
                      <p className="text-sm text-muted-foreground">Give your campaign a name and choose its type.</p>
                    </div>

                    {/* Campaign Name */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-foreground">Campaign name<span className="text-red-500 pl-0.5">*</span></label>
                      </div>
                      <div className="relative">
                        <Input
                          placeholder="Enter campaign name..."
                          value={campaignName}
                          onChange={(e) => setCampaignName(e.target.value.slice(0, 512))}
                          className="pr-12 border border-input [border-color:hsl(var(--input))] hover-elevate"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                          {campaignName.length}/512
                        </span>
                      </div>
                    </div>

                    {/* Campaign Type */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Campaign Type<span className="text-red-500 pl-0.5">*</span></label>
                      <Select value={broadcastCampaignType} onValueChange={setBroadcastCampaignType}>
                        <SelectTrigger className="border border-input [border-color:hsl(var(--input))] hover-elevate">
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Immediate">Immediate</SelectItem>
                          <SelectItem value="Scheduled">Scheduled</SelectItem>
                          <SelectItem value="Recurring">Recurring</SelectItem>
                        </SelectContent>
                      </Select>

                      {broadcastCampaignType === 'Scheduled' && (
                        <div className="space-y-4 pt-2">
                          {schedules.map((schedule, index) => (
                            <div key={schedule.id} className="flex flex-col gap-6 p-4 border rounded-lg border border-input [border-color:hsl(var(--input))]">
                              <div className="flex items-start justify-between">
                                <div className="space-y-2 flex-1">
                                  <div className="flex justify-between items-end">
                                    <label className="text-sm font-medium text-foreground">Campaign schedule date<span className="text-red-500 pl-0.5">*</span></label>
                                    {schedules.length > 1 && (
                                      <button onClick={() => removeSchedule(schedule.id)} className="text-muted-foreground hover:text-foreground transition-colors ml-4 mt-1">
                                        <X size={16} />
                                      </button>
                                    )}
                                  </div>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant={"outline"}
                                        className="w-full justify-between text-left font-normal border-input [border-color:hsl(var(--input))] hover-elevate"
                                      >
                                        <div className="flex items-center">
                                          <Calendar size={14} className="mr-2" />
                                          {schedule.date ? schedule.date.toLocaleDateString() : <span>Pick a date</span>}
                                        </div>
                                        <ChevronDown size={14} className="text-muted-foreground" />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                      <CalendarComponent
                                        mode="single"
                                        selected={schedule.date}
                                        onSelect={(date) => handleScheduleChange(index, 'date', date)}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Campaign schedule time<span className="text-red-500 pl-0.5">*</span></label>
                                <div className="flex gap-2">
                                  <Select value={schedule.hour} onValueChange={(value) => handleScheduleChange(index, 'hour', value)}>
                                    <SelectTrigger className="w-[80px] border border-input [border-color:hsl(var(--input))] hover-elevate">
                                      <SelectValue placeholder="HH" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Array.from({ length: 12 }, (_, i) => `${i + 1}`.padStart(2, '0')).map(hour => (
                                        <SelectItem key={hour} value={hour}>{hour}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <Select value={schedule.minute} onValueChange={(value) => handleScheduleChange(index, 'minute', value)}>
                                    <SelectTrigger className="w-[80px] border border-input [border-color:hsl(var(--input))] hover-elevate">
                                      <SelectValue placeholder="MM" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Array.from({ length: 60 }, (_, i) => `${i}`.padStart(2, '0')).map(minute => (
                                        <SelectItem key={minute} value={minute}>{minute}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <Select value={schedule.period} onValueChange={(value) => handleScheduleChange(index, 'period', value)}>
                                    <SelectTrigger className="w-[95px] border border-input [border-color:hsl(var(--input))] hover-elevate">
                                      <SelectValue placeholder="AM/PM" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="AM">AM</SelectItem>
                                      <SelectItem value="PM">PM</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                          ))}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 text-xs"
                            disabled={isSchedulesInvalid || schedules.length >= 5}
                            onClick={addSchedule}
                          >
                            <Plus size={14} className="mr-1" />
                            Add another schedule
                          </Button>

                          {/* Timezone Checkbox */}
                          <div className="flex items-center space-x-2">
                            <Checkbox id="timezone-delivery" checked={deliverInTimezone} onCheckedChange={(checked) => setDeliverInTimezone(checked as boolean)} />
                            <label htmlFor="timezone-delivery" className="text-sm font-medium leading-none">Deliver in user's timezone</label>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="break-normal w-[16rem] whitespace-normal">You can send campaign messages to the user as per their local time zone. i.e. If you schedule your campaign for 9:30 am Singapore time, we will deliver to users in Singapore at 9:30 am (UTC/GMT +8 hours) and to users in Dubai at 9:30 am (UTC/GMT +4 hours). Note that the Campaign Start Time is always the timezone of your Digital Connect Account.</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      )}

                      {broadcastCampaignType === 'Recurring' && (() => {
                        const weekDays = [
                          { display: 'M', value: 'mon' },
                          { display: 'T', value: 'tue' },
                          { display: 'W', value: 'wed' },
                          { display: 'T', value: 'thu' },
                          { display: 'F', value: 'fri' },
                          { display: 'S', value: 'sat' },
                          { display: 'S', value: 'sun' }
                        ];
                        return (
                          <div className="space-y-4 pt-2">
                            {/* Start and End Date */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground">Start date<span className="text-red-500 pl-0.5">*</span></label>
                              <Popover open={recurringStartPickerOpen} onOpenChange={setRecurringStartPickerOpen}>
                                <PopoverTrigger asChild>
                                  <Button variant={"outline"} className="w-full justify-between text-left font-normal border-input [border-color:hsl(var(--input))] hover-elevate">
                                    <div className="flex items-center">
                                      <Calendar size={14} className="mr-2" />
                                      {recurringStartDate ? recurringStartDate.toLocaleDateString() : <span>Pick a date</span>}
                                    </div>
                                    <ChevronDown size={14} className="text-muted-foreground" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <CalendarComponent
                                    mode="single"
                                    selected={recurringStartDate}
                                    onSelect={(date) => {
                                      setRecurringStartDate(date);
                                      if (recurringEndDate && date && date > recurringEndDate) setRecurringEndDate(undefined);
                                      setRecurringStartPickerOpen(false);
                                    }}
                                    disabled={recurringEndDate ? { after: recurringEndDate } : undefined}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground">End date<span className="text-red-500 pl-0.5">*</span></label>
                              <Popover open={recurringEndPickerOpen} onOpenChange={setRecurringEndPickerOpen}>
                                <PopoverTrigger asChild>
                                  <Button variant={"outline"} className="w-full justify-between text-left font-normal border-input [border-color:hsl(var(--input))] hover-elevate">
                                    <div className="flex items-center">
                                      <Calendar size={14} className="mr-2" />
                                      {recurringEndDate ? recurringEndDate.toLocaleDateString() : <span>Pick a date</span>}
                                    </div>
                                    <ChevronDown size={14} className="text-muted-foreground" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <CalendarComponent
                                    mode="single"
                                    selected={recurringEndDate}
                                    onSelect={(date) => {
                                      setRecurringEndDate(date);
                                      if (recurringStartDate && date && date < recurringStartDate) setRecurringStartDate(undefined);
                                      setRecurringEndPickerOpen(false);
                                    }}
                                    disabled={recurringStartDate ? { before: recurringStartDate } : undefined}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>

                            {/* Time Picker */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground">At<span className="text-red-500 pl-0.5">*</span></label>
                              <div className="flex gap-2">
                                <Select value={recurringTime.hour} onValueChange={(value) => setRecurringTime(t => ({ ...t, hour: value }))}>
                                  <SelectTrigger className="w-[80px] border border-input [border-color:hsl(var(--input))] hover-elevate">
                                    <SelectValue placeholder="HH" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Array.from({ length: 12 }, (_, i) => `${i + 1}`.padStart(2, '0')).map(hour => (
                                      <SelectItem key={hour} value={hour}>{hour}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Select value={recurringTime.minute} onValueChange={(value) => setRecurringTime(t => ({ ...t, minute: value }))}>
                                  <SelectTrigger className="w-[80px] border border-input [border-color:hsl(var(--input))] hover-elevate">
                                    <SelectValue placeholder="MM" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Array.from({ length: 60 }, (_, i) => `${i}`.padStart(2, '0')).map(minute => (
                                      <SelectItem key={minute} value={minute}>{minute}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Select value={recurringTime.period} onValueChange={(value) => setRecurringTime(t => ({ ...t, period: value }))}>
                                  <SelectTrigger className="w-[95px] border border-input [border-color:hsl(var(--input))] hover-elevate">
                                    <SelectValue placeholder="AM/PM" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="AM">AM</SelectItem>
                                    <SelectItem value="PM">PM</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            {/* Repeat Row */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground">Repeat<span className="text-red-500 pl-0.5">*</span></label>
                              <div className="flex items-center gap-2">
                                <Select value={repeatFrequency} onValueChange={setRepeatFrequency}>
                                  <SelectTrigger className="border border-input [border-color:hsl(var(--input))] hover-elevate flex-1">
                                    <SelectValue placeholder="Select frequency" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                  </SelectContent>
                                </Select>
                                {repeatFrequency && (
                                  <>
                                    <span className="text-sm text-muted-foreground">every</span>
                                    <Select
                                      value={repeatFrequency === 'daily' ? dailyRepeatInterval : ''}
                                      onValueChange={setDailyRepeatInterval}
                                      disabled={repeatFrequency !== 'daily'}
                                    >
                                      <SelectTrigger className="border border-input [border-color:hsl(var(--input))] hover-elevate flex-1">
                                        <SelectValue placeholder={
                                          repeatFrequency === 'weekly' ? "Single Week" :
                                            repeatFrequency === 'monthly' ? "Single Month" :
                                              "Select interval"
                                        } />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="1">Single Day</SelectItem>
                                        {Array.from({ length: 5 }, (_, i) => i + 2).map(day => (
                                          <SelectItem key={day} value={String(day)}>{day} Days</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Conditional Multi-select */}
                            {repeatFrequency === 'weekly' && (
                              <div className="space-y-2">
                                <div className="flex gap-1">
                                  {weekDays.map(day => (
                                    <Button
                                      key={day.value}
                                      variant={weeklyRepeatDays.includes(day.value) ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => toggleWeeklyDay(day.value)}
                                      className="flex-1"
                                    >
                                      {day.display}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {repeatFrequency === 'monthly' && (
                              <div className="space-y-2">
                                <div className="grid grid-cols-7 gap-1">
                                  {Array.from({ length: 31 }, (_, i) => i + 1).map(date => (
                                    <Button
                                      key={date}
                                      variant={monthlyRepeatDates.includes(date) ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => toggleMonthlyDate(date)}
                                      className="h-8 w-8 p-0"
                                    >
                                      {date}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Timezone Checkbox */}
                            <div className="flex items-center space-x-2 pt-2">
                              <Checkbox id="timezone-delivery-Recurring" checked={deliverInTimezone} onCheckedChange={(checked) => setDeliverInTimezone(checked as boolean)} />
                              <label htmlFor="timezone-delivery-Recurring" className="text-sm font-medium leading-none">Deliver in user's timezone</label>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-4 w-4" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="break-normal w-[16rem] whitespace-normal">You can send campaign messages to the user as per their local time zone. i.e. If you schedule your campaign for 9:30 am Singapore time, we will deliver to users in Singapore at 9:30 am (UTC/GMT +8 hours) and to users in Dubai at 9:30 am (UTC/GMT +4 hours). Note that the Campaign Start Time is always the timezone of your Digital Connect Account.</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                        )
                      })()}
                    </div>

                    {/* WhatsApp Template Dropdown */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">WhatsApp Template<span className="text-red-500 pl-0.5">*</span></label>
                      <Select
                        value={selectedWhatsAppTemplate || ""}
                        onValueChange={(value) => {
                          setSelectedWhatsAppTemplate(value);
                          setSelectedTemplate(whatsappTemplates.find(t => t.name === value) || null);
                        }}
                      >
                        <SelectTrigger className="border border-input [border-color:hsl(var(--input))] hover-elevate">
                          <SelectValue placeholder="Select a template" />
                        </SelectTrigger>
                        <SelectContent>
                          {whatsappTemplates.map(template => (
                            <SelectItem key={template.id} value={template.name}>{template.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* CSV Upload */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Contact List (CSV)<span className="text-red-500 pl-0.5">*</span></label>
                      <p className="text-xs text-muted-foreground">Upload a CSV with 'name' and 'number' columns.</p>
                      <input type="file" id="csv-upload" accept=".csv" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        setCsvFile(file);
                        setCsvData([]);
                        setCsvError(null);

                        if (!file.name.endsWith(".csv")) {
                          setCsvError("Invalid file type. Please upload a .csv file.");
                          setCsvFile(null);
                          return;
                        }

                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const text = event.target?.result as string;
                          if (!text) {
                            setCsvError("Could not read the file.");
                            setCsvFile(null);
                            return;
                          }

                          const lines = text.split(/\r\n|\n/).filter(line => line.trim() !== '');
                          if (lines.length < 2) {
                            setCsvError("CSV must have a header and at least one data row.");
                            setCsvFile(null);
                            return;
                          }

                          const header = lines[0].split(",").map(h => h.trim());
                          if (header.includes("name") && header.includes("number")) {
                            const data = lines.slice(1).map(line => {
                              const values = line.split(",");
                              const obj: { [key: string]: string } = {};
                              header.forEach((h, i) => {
                                obj[h] = values[i] || "";
                              });
                              return obj;
                            });
                            setCsvData(data);
                          } else {
                            setCsvError("Invalid CSV format. Header must include 'name' and 'number' columns.");
                            setCsvFile(null);
                            setCsvData([]);
                          }
                        };
                        reader.onerror = () => {
                          setCsvError("Error reading file.");
                          setCsvFile(null);
                          setCsvData([]);
                        };
                        reader.readAsText(file);

                        if (e.target) {
                          e.target.value = ''
                        }
                      }} />
                      {!csvFile ? (
                        <Button className="btn-outline-primary font-normal" variant="outline" onClick={() => document.getElementById('csv-upload')?.click()}>
                          Browse
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded border border-input [border-color:hsl(var(--input))]">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Paperclip size={14} className="text-muted-foreground flex-shrink-0" />
                            <span className="truncate text-foreground text-sm">{csvFile.name}</span>
                            <span className="text-xs text-muted-foreground flex-shrink-0">({(csvFile.size / 1024).toFixed(1)}KB)</span>
                          </div>
                          <button
                            onClick={() => {
                              setLocalCsvData(JSON.parse(JSON.stringify(csvData))); // Deep copy
                              setIsViewCsvModalOpen(true);
                            }}
                            className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => setCsvFile(null)}
                            className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                      {csvError && <p className="text-sm text-red-500">{csvError}</p>}
                    </div>
                  </div>
                </div>

                {/* Right: Template Preview */}
                <div>
                  <h3 className="font-semibold text-lg mb-1">Template Preview</h3>
                  <div className="h-full max-h-[62vh] w-full max-w-[31vh] flex flex-col items-center">
                    <PreviewV2
                      mode="chat"
                      headerText={selectedTemplate?.header || ""}
                      bodyText={selectedTemplate?.body || ""}
                      footerText={selectedTemplate?.footer || ""}
                      selectedMediaFile={null}
                      templateButtons={selectedTemplate?.buttons || []}
                      variableSamples={selectedTemplate?.variableSamples || {}}
                    />
                    <p className="text-[10px] py-1">Preview may not reflect the exact WhatsApp interface</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                {editingCampaignId ? (
                  <Button
                    variant="outline"
                    onClick={() => { setCreateOpen(false); setEditingCampaignId(null); }}
                    className="border-input [border-color:hsl(var(--input))] font-normal"
                  >
                    Cancel
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setCampaignCreationStep("selectType")}
                    className="border-input [border-color:hsl(var(--input))] font-normal"
                  >
                    Back
                  </Button>
                )}
                <div className="flex gap-2">
                  {!editingCampaignId && (
                    <Button
                      variant="outline"
                      className="btn-outline-primary font-normal"
                      disabled={!campaignName}
                      onClick={() => handleCreateBroadcastCampaign("draft")}
                    >
                      Save Draft
                    </Button>
                  )}
                  <Button
                    className="gap-2 font-normal btn-outline-primary"
                    variant="outline"
                    disabled={
                      !campaignName ||
                      !broadcastCampaignType ||
                      !selectedWhatsAppTemplate ||
                      !csvFile ||
                      (broadcastCampaignType === 'Scheduled' && isSchedulesInvalid) ||
                      (broadcastCampaignType === 'Recurring' && isRecurringInvalid)
                    }
                    onClick={() => handleCreateBroadcastCampaign("scheduled")}
                  >
                    {editingCampaignId ? "Save Campaign" : "Set Live"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* View CSV Modal */}
      <Dialog open={isViewCsvModalOpen} onOpenChange={(isOpen) => {
        if (!isOpen) {
          setCsvSort(null);
        }
        setIsViewCsvModalOpen(isOpen);
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>CSV Editor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="max-h-[60vh] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="select-none">
                  <tr className="border-b border-gray-300">
                    <th className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30" onClick={() => handleCsvColumnSort("name")}>
                      <div className="flex items-center gap-2">
                        Name
                        {renderCsvSortIcon("name")}
                      </div>
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30" onClick={() => handleCsvColumnSort("number")}>
                      <div className="flex items-center gap-2">
                        Number
                        {renderCsvSortIcon("number")}
                      </div>
                    </th>
                    <th className="w-10">
                      <Button variant="ghost" size="sm" onClick={() => setLocalCsvData([...localCsvData, { name: "", number: "" }])}><Plus /></Button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getSortedLocalCsvData().map((row, index) => (
                    <tr key={index} className="border-b border-gray-300">
                      <td>
                        <Input
                          value={row.name}
                          onChange={(e) => {
                            const newData = localCsvData.map(originalRow =>
                              originalRow === row ? { ...originalRow, name: e.target.value } : originalRow
                            );
                            setLocalCsvData(newData);
                          }}
                          className="border-none rounded-none focus-visible:ring-0"
                        />
                      </td>
                      <td>
                        <Input
                          value={row.number}
                          onChange={(e) => {
                            const newData = localCsvData.map(originalRow =>
                              originalRow === row ? { ...originalRow, number: e.target.value } : originalRow
                            );
                            setLocalCsvData(newData);
                          }}
                          className="border-none rounded-none focus-visible:ring-0"
                        />
                      </td>
                      <td>
                        <Button variant="ghost" size="sm" onClick={() => {
                          setLocalCsvData(localCsvData.filter(originalRow => originalRow !== row));
                        }}><X /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setIsViewCsvModalOpen(false)}
                className="border-input [border-color:hsl(var(--input))] font-normal"
              >
                Cancel
              </Button>
              <Button
                className="btn-outline-primary"
                variant="outline"
                onClick={() => {
                  const filteredData = localCsvData.filter(row => row.name?.trim() || row.number?.trim());
                  setCsvData(filteredData);
                  setIsViewCsvModalOpen(false);
                }}
                disabled={isCsvSaveDisabled}
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={(isOpen) => {
        setDetailsOpen(isOpen);
        if (!isOpen) {
          setSelectedCampaignForPerformance(null);
        }
      }}>
        <DialogContent className={`max-w-5xl ${activeDetailsTab === "details" ? "max-w-2xl" :
          activeDetailsTab === "performance" ? "max-w-4xl" :
            activeDetailsTab === "recipients" ? "max-w-3xl" : ""
          }`} data-testid="dialog-details">
          <DialogHeader className="mb-2">
            <DialogTitle>Campaign Performance - {selectedCampaignForPerformance?.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex items-center space-x-1 bg-slate-200/75 dark:bg-slate-800 rounded-lg p-1 w-fit">
              <button
                onClick={() => setActiveDetailsTab("details")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeDetailsTab === "details"
                  ? "bg-background text-foreground shadow-[0_-3px_6px_rgba(0,0,0,0.00),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.02)]"
                  : "text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                data-testid="tab-details"
              >
                Details
              </button>
              <button
                onClick={() => setActiveDetailsTab("performance")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeDetailsTab === "performance"
                  ? "bg-background text-foreground shadow-[0_-3px_6px_rgba(0,0,0,0.00),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.02)]"
                  : "text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                data-testid="tab-performance"
              >
                Performance
              </button>
              <button
                onClick={() => setActiveDetailsTab("recipients")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeDetailsTab === "recipients"
                  ? "bg-background text-foreground shadow-[0_-3px_6px_rgba(0,0,0,0.00),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.02)]"
                  : "text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                data-testid="tab-recipients"
              >
                Recipients
              </button>
            </div>

            {/* Details Tab */}
            {activeDetailsTab === "details" && (() => {
              const selectedTemplate = whatsappTemplates.find(t => t.name === selectedCampaignForPerformance?.whatsAppTemplateName);
              return (
                <div className="flex gap-4">
                  {/* Left: Details */}
                  <div className="flex-1 space-y-4 !max-h-[62vh] overflow-y-auto">
                    <div className="flex flex-col gap-x-4 gap-y-6">
                      <div>
                        <label className="text-sm font-medium text-foreground">Campaign Name</label>
                        <p className="mt-1 text-sm">{selectedCampaignForPerformance?.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Campaign Type</label>
                        <p className="mt-1 text-sm">{selectedCampaignForPerformance?.type}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Message Type</label>
                        <p className="mt-1 text-sm">{selectedCampaignForPerformance?.messageType}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Status</label>
                        <p className="mt-1 text-sm capitalize">{selectedCampaignForPerformance?.status}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">WhatsApp Template</label>
                        <p className="mt-1 text-sm">{selectedCampaignForPerformance?.whatsAppTemplateName}</p>
                      </div>

                      {/* API Triggered Fields */}
                      {selectedCampaignForPerformance?.type === 'API Triggered' && (
                        <>
                          {selectedCampaignForPerformance?.startDate && (
                            <div>
                              <label className="text-sm font-medium text-foreground">Start Date</label>
                              <p className="mt-1 text-sm">{new Date(selectedCampaignForPerformance.startDate).toLocaleDateString()}</p>
                            </div>
                          )}
                          {selectedCampaignForPerformance?.endDate ? (
                            <div>
                              <label className="text-sm font-medium text-foreground">End Date</label>
                              <p className="mt-1 text-sm">{new Date(selectedCampaignForPerformance.endDate).toLocaleDateString()}</p>
                            </div>
                          ) : selectedCampaignForPerformance?.neverEnds ? (
                            <div>
                              <label className="text-sm font-medium text-foreground">End Date</label>
                              <p className="mt-1 text-sm">Never</p>
                            </div>
                          ) : null}
                        </>
                      )}

                      {/* Broadcast Fields */}
                      {selectedCampaignForPerformance?.type === 'Broadcast' && (
                        <>
                          {selectedCampaignForPerformance?.csvContent && (
                            <div>
                              <label className="text-sm font-medium text-foreground">Number of contacts</label>
                              <p className="mt-1 text-sm">{selectedCampaignForPerformance.csvContent.length} contacts</p>
                            </div>
                          )}
                          {selectedCampaignForPerformance?.deliverInTimezone && (
                            <div>
                              <label className="text-sm font-medium text-foreground">Deliver in User's Timezone</label>
                              <p className="mt-1 text-sm">Yes</p>
                            </div>
                          )}
                          {selectedCampaignForPerformance?.schedules && selectedCampaignForPerformance.schedules.length > 0 && (
                            <div className="col-span-2">
                              <label className="text-sm font-medium text-foreground">Schedules</label>
                              <ul className="mt-1 space-y-1 text-sm">
                                {selectedCampaignForPerformance.schedules.map(s => (
                                  <li key={s.id}>{s.date ? new Date(s.date).toLocaleDateString() : ''} at {s.hour}:{s.minute} {s.period}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {selectedCampaignForPerformance?.recurringStartDate && (
                            <div>
                              <label className="text-sm font-medium text-foreground">Recurring Start Date</label>
                              <p className="mt-1 text-sm">{new Date(selectedCampaignForPerformance.recurringStartDate).toLocaleDateString()}</p>
                            </div>
                          )}
                          {selectedCampaignForPerformance?.recurringEndDate && (
                            <div>
                              <label className="text-sm font-medium text-foreground">Recurring End Date</label>
                              <p className="mt-1 text-sm">{new Date(selectedCampaignForPerformance.recurringEndDate).toLocaleDateString()}</p>
                            </div>
                          )}
                          {selectedCampaignForPerformance?.recurringTime && (
                            <div>
                              <label className="text-sm font-medium text-foreground">Recurring Time</label>
                              <p className="mt-1 text-sm">{selectedCampaignForPerformance.recurringTime.hour}:{selectedCampaignForPerformance.recurringTime.minute} {selectedCampaignForPerformance.recurringTime.period}</p>
                            </div>
                          )}
                          {selectedCampaignForPerformance?.repeatFrequency && (
                            <div>
                              <label className="text-sm font-medium text-foreground">Repeat Frequency</label>
                              <p className="mt-1 text-sm capitalize">{selectedCampaignForPerformance.repeatFrequency}</p>
                            </div>
                          )}
                          {selectedCampaignForPerformance?.dailyRepeatInterval && (
                            <div>
                              <label className="text-sm font-medium text-foreground">Daily Repeat Interval</label>
                              <p className="mt-1 text-sm">{selectedCampaignForPerformance.dailyRepeatInterval} days</p>
                            </div>
                          )}
                          {selectedCampaignForPerformance?.weeklyRepeatDays && selectedCampaignForPerformance.weeklyRepeatDays.length > 0 && (
                            <div>
                              <label className="text-sm font-medium text-foreground">Weekly Repeat Days</label>
                              <p className="mt-1 text-sm">{selectedCampaignForPerformance.weeklyRepeatDays.join(', ')}</p>
                            </div>
                          )}
                          {selectedCampaignForPerformance?.monthlyRepeatDates && selectedCampaignForPerformance.monthlyRepeatDates.length > 0 && (
                            <div>
                              <label className="text-sm font-medium text-foreground">Monthly Repeat Dates</label>
                              <p className="mt-1 text-sm">{selectedCampaignForPerformance.monthlyRepeatDates.join(', ')}</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right: Template Preview */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1">Template Preview</label>
                    <div className="h-full max-h-[62vh] w-full max-w-[31vh] flex flex-col items-center">
                      <PreviewV2
                        mode="chat"
                        headerText={selectedTemplate?.header || ""}
                        bodyText={selectedTemplate?.body || ""}
                        footerText={selectedTemplate?.footer || ""}
                        selectedMediaFile={null}
                        templateButtons={selectedTemplate?.buttons || []}
                        variableSamples={selectedTemplate?.variableSamples || {}}
                      />
                      <p className="text-[10px] py-1">Preview may not reflect the exact WhatsApp interface</p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Performance Tab */}
            {activeDetailsTab === "performance" && (
              <div className="space-y-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Sent</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-semibold">15,420</div>
                      <p className="text-xs text-muted-foreground mt-1">Total messages</p>
                    </CardContent>
                  </Card>
                  <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Delivered</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-semibold">14,892</div>
                      <p className="text-xs text-muted-foreground mt-1">96.6% delivery rate</p>
                    </CardContent>
                  </Card>
                  <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Failed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-semibold">528</div>
                      <p className="text-xs text-muted-foreground mt-1">3.4% failure rate</p>
                    </CardContent>
                  </Card>
                  <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Viewed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-semibold">12,453</div>
                      <p className="text-xs text-muted-foreground mt-1">83.6% view rate</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Chart */}
                <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-sm">Engagement Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        delivered: {
                          label: "Delivered",
                          color: "hsl(var(--primary))",
                        },
                        viewed: {
                          label: "Viewed",
                          color: "hsl(var(--chart-2))",
                        },
                      }}
                      className="h-[300px] w-full"
                    >
                      <AreaChart data={selectedCampaignForPerformance?.engagementData || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis dataKey="hour" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                        <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                        <RechartsTooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                        <Area type="monotone" dataKey="delivered" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={2} />
                        <Area type="monotone" dataKey="viewed" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.2} strokeWidth={2} />
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Recipients Tab */}
            {activeDetailsTab === "recipients" && (() => {
              const sortedRecipients = getSortedRecipients();
              const paginatedRecipients = sortedRecipients.slice((recipientPage - 1) * recipientRowsPerPage, recipientPage * recipientRowsPerPage);
              const totalRecipientPages = Math.ceil(sortedRecipients.length / recipientRowsPerPage);

              const recipientStatusOptions = [
                { id: "Sent", name: "Sent" },
                { id: "Delivered", name: "Delivered" },
                { id: "Viewed", name: "Viewed" },
                { id: "Failed", name: "Failed" },
              ];

              return (
                <div className="space-y-4">
                  <div className="flex items-center gap-3"> {/* New flex container */}
                    <div className="relative w-80">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search recipients..."
                        value={recipientSearchQuery}
                        onChange={(e) => {
                          setRecipientSearchQuery(e.target.value);
                          setRecipientPage(1); // Reset to first page on search
                        }}
                        className="pl-10 text-sm w-full border border-input rounded-md bg-background focus:outline-none transition-color"
                        data-testid="input-search-recipients"
                      />
                    </div>
                    <CustomDropdown
                      options={recipientStatusOptions}
                      selected={selectedRecipientStatus}
                      onChange={(values) => {
                        setSelectedRecipientStatus(values);
                        setRecipientPage(1); // Reset to first page on filter change
                      }}
                      placeholder="Status"
                      width="160px"
                    />
                  </div>
                  <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
                    <CardContent className="pt-2">
                      <ScrollArea className="h-104">
                        <div className="overflow-x-auto mt-6">
                          <table className="w-full text-xs">
                            <thead className="select-none">
                              <tr className="border-b">
                                <th className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30" onClick={() => handleRecipientSort('name')}>
                                  <div className="flex items-center gap-2">
                                    Name
                                    {renderRecipientSortIcon('name')}
                                  </div>
                                </th>
                                <th className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30" onClick={() => handleRecipientSort('phone')}>
                                  <div className="flex items-center gap-2">
                                    Phone
                                    {renderRecipientSortIcon('phone')}
                                  </div>
                                </th>
                                <th className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30" onClick={() => handleRecipientSort('status')}>
                                  <div className="flex items-center gap-2">
                                    Status
                                    {renderRecipientSortIcon('status')}
                                  </div>
                                </th>
                                <th className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30" onClick={() => handleRecipientSort('time')}>
                                  <div className="flex items-center gap-2">
                                    Time
                                    {renderRecipientSortIcon('time')}
                                  </div>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {paginatedRecipients.map((recipient) => (
                                <tr key={recipient.id} className="border-b hover:bg-muted/50" data-testid={`recipient-${recipient.id}`}>
                                  <td className="py-2 px-3 font-medium">{recipient.name}</td>
                                  <td className="py-2 px-3">{recipient.phone}</td>
                                  <td className="py-2 px-3">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${recipient.status === "Viewed" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" :
                                      recipient.status === "Delivered" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" :
                                        recipient.status === "Sent" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300" :
                                          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                      }`}>
                                      {recipient.status}
                                    </span>
                                  </td>
                                  <td className="py-2 px-3 text-muted-foreground">{recipient.time}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </ScrollArea>
                      {/* Pagination */}
                      <div className="flex items-center justify-between mt-4 text-xs">
                        <span className="text-muted-foreground">{sortedRecipients.length} results</span>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Rows per page:</span>
                          <Select value={String(recipientRowsPerPage)} onValueChange={(value) => {
                            setRecipientRowsPerPage(Number(value));
                            setRecipientPage(1);
                          }}>
                            <SelectTrigger className="w-16 h-7 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5">5</SelectItem>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="20">20</SelectItem>
                            </SelectContent>
                          </Select>
                          <span className="text-muted-foreground">Page {recipientPage} of {totalRecipientPages || 1}</span>
                          <div className="flex gap-1">
                            <button className="p-1 hover:bg-muted dark:hover:bg-slate-700 rounded disabled:opacity-50 transition-colors" disabled={recipientPage === 1} onClick={() => setRecipientPage(1)}>
                              <ChevronsLeft size={16} />
                            </button>
                            <button className="p-1 hover:bg-muted dark:hover:bg-slate-700 rounded disabled:opacity-50 transition-colors" disabled={recipientPage === 1} onClick={() => setRecipientPage(p => p - 1)}>
                              <ChevronLeft size={16} />
                            </button>
                            <button className="p-1 hover:bg-muted dark:hover:bg-slate-700 rounded disabled:opacity-50 transition-colors" disabled={recipientPage === totalRecipientPages} onClick={() => setRecipientPage(p => p + 1)}>
                              <ChevronRight size={16} />
                            </button>
                            <button className="p-1 hover:bg-muted dark:hover:bg-slate-700 rounded disabled:opacity-50 transition-colors" disabled={recipientPage === totalRecipientPages} onClick={() => setRecipientPage(totalRecipientPages)}>
                              <ChevronsRight size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            })()}
          </div>
        </DialogContent>
      </Dialog>

      {/* Clone Campaign Dialog */}
      <Dialog open={cloneDialogOpen} onOpenChange={handleCancelCloneDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Clone Campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Campaign Name<span className="text-red-500 pl-0.5">*</span></label>
              <div className="relative">
                <Input
                  placeholder="Enter campaign name..."
                  value={cloneCampaignName}
                  onChange={(e) => setCloneCampaignName(e.target.value.slice(0, 512))}
                  className="pr-12 border border-input [border-color:hsl(var(--input))] hover-elevate"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {cloneCampaignName.length}/512
                </span>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleCancelCloneDialog}>
                Cancel
              </Button>
              <Button
                className="btn-outline-primary"
                variant="outline"
                onClick={handleCloneCampaign}
                disabled={!cloneCampaignName.trim()}
              >
                Clone Campaign
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Archive Campaign Modal */}
      <Dialog open={showArchiveModal} onOpenChange={setShowArchiveModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader className="mb-2">
            <DialogTitle>Archive Campaign</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-foreground">
              Are you sure you want to archive <span className="font-semibold break-all">{campaignToArchive?.name}</span>? You can restore it from the Archived tab.
            </p>
          </div>

          {/* Modal Footer */}
          <div className="flex gap-2 justify-end mt-2">
            <Button
              onClick={() => setShowArchiveModal(false)}
              variant="outline"
              className="border-input [border-color:hsl(var(--input))]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmArchive}
              className="bg-orange-500 hover:bg-orange-600 border-orange-600 text-white"
            >
              Archive
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Campaign Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader className="mb-2">
            <DialogTitle>Delete Campaign</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-foreground">
              Are you sure you want to delete <span className="font-semibold break-all">{campaignToDelete?.name}</span>? This action cannot be undone.            </p>
          </div>

          {/* Modal Footer */}
          <div className="flex gap-2 justify-end mt-2">
            <Button
              onClick={() => setShowDeleteModal(false)}
              variant="outline"
              className="border-input [border-color:hsl(var(--input))]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600 border-red-600 text-white"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Archive Modal */}
      <Dialog open={showBulkArchiveModal} onOpenChange={setShowBulkArchiveModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader className="mb-2">
            <DialogTitle>Archive Campaigns</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-foreground">
              Are you sure you want to archive <span className="font-semibold">{getArchivableCampaigns().length} campaign(s)</span>? You can restore them from the Archived tab.
            </p>
          </div>

          {/* Modal Footer */}
          <div className="flex gap-2 justify-end mt-2">
            <Button
              onClick={() => setShowBulkArchiveModal(false)}
              variant="outline"
              className="border-input [border-color:hsl(var(--input))]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleBulkArchive}
              className="bg-orange-500 hover:bg-orange-600 border-orange-600 text-white"
            >
              Archive
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Modal */}
      <Dialog open={showBulkDeleteModal} onOpenChange={setShowBulkDeleteModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader className="mb-2">
            <DialogTitle>Delete Campaigns</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-foreground">
              Are you sure you want to delete <span className="font-semibold">{getDeletableCampaigns().length} campaign(s)</span>? This action cannot be undone.
            </p>
          </div>

          {/* Modal Footer */}
          <div className="flex gap-2 justify-end mt-2">
            <Button
              onClick={() => setShowBulkDeleteModal(false)}
              variant="outline"
              className="border-input [border-color:hsl(var(--input))]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleBulkDelete}
              className="bg-red-500 hover:bg-red-600 border-red-600 text-white"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
