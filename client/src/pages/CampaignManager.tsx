import { useState, useRef, useEffect } from "react";
import { Plus, BarChart2, Edit2, Copy, Trash2, Send, Zap, Search, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Archive, Calendar, FileText, X, Download, Paperclip } from "react-feather";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import TemplatePreview from "@/components/TemplatePreview";
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
}

interface Schedule {
  id: number;
  date: Date | undefined;
  hour: string;
  minute: string;
  period: string;
}

export default function CampaignManager() {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaigns, setSelectedCampaigns] = useState<number[]>([]);
  const [performanceOpen, setPerformanceOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [activePerformanceTab, setActivePerformanceTab] = useState("performance");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCampaignTypes, setSelectedCampaignTypes] = useState<string[]>([]);
  const [selectedMessageTypes, setSelectedMessageTypes] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowsDropdownOpen, setRowsDropdownOpen] = useState(false);
  const [sort, setSort] = useState<SortEntry | null>(null);
  const [campaignCreationStep, setCampaignCreationStep] = useState<"selectType" | "apiTriggeredForm" | "broadcastForm">("selectType");
  const [apiCampaignName, setApiCampaignName] = useState("");
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
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [campaignToArchive, setCampaignToArchive] = useState<Campaign | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);
  const [showBulkArchiveModal, setShowBulkArchiveModal] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

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
      setCampaigns([
        {
          id: 1,
          name: "Summer Sale 2024",
          type: "Broadcast",
          messageType: "Immediate",
          sent: 15420,
          delivered: 14892,
          status: "delivered",
        },
        {
          id: 2,
          name: "Cart Abandonment",
          type: "API Triggered",
          messageType: "Recurring",
          sent: 8923,
          delivered: 8654,
          status: "delivered",
        },
        {
          id: 3,
          name: "Product Launch",
          type: "Broadcast",
          messageType: "Scheduled",
          sent: 0,
          delivered: 0,
          status: "scheduled",
        },
        {
          id: 4,
          name: "Draft Campaign",
          type: "Broadcast",
          messageType: "Immediate",
          sent: 0,
          delivered: 0,
          status: "draft",
        },
        {
          id: 5,
          name: "Archived Campaign",
          type: "API Triggered",
          messageType: "Recurring",
          sent: 5000,
          delivered: 4800,
          status: "archived",
        },
      ]);
    }
  }, []);

  const engagementData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    delivered: Math.floor(Math.random() * 1000) + 500,
    viewed: Math.floor(Math.random() * 800) + 300,
  }));

  const recipients = [
    { id: 1, name: "John Doe", phone: "+1234567890", status: "Delivered", time: "10:30 AM" },
    { id: 2, name: "Jane Smith", phone: "+1234567891", status: "Delivered", time: "10:32 AM" },
    { id: 3, name: "Bob Johnson", phone: "+1234567892", status: "Failed", time: "10:35 AM" },
  ];

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

    // Filter by tab
    if (activeTab === "draft") {
      filtered = campaigns.filter(c => c.status === "draft");
    } else if (activeTab === "scheduled") {
      filtered = campaigns.filter(c => c.status === "scheduled");
    } else if (activeTab === "delivered") {
      filtered = campaigns.filter(c => c.status === "delivered");
    } else if (activeTab === "archived") {
      filtered = campaigns.filter(c => c.status === "archived");
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

  const handleCloseCloneDialog = () => {
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
    handleCloseCloneDialog();
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

  const resetCreateCampaignForm = () => {
    setCampaignCreationStep("selectType");
    setApiCampaignName("");
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
  };

  const handleCreateCampaign = (status: "draft" | "scheduled") => {
    const newCampaign: Campaign = {
      id: Date.now(),
      name: apiCampaignName,
      type: "API Triggered",
      messageType: "Recurring", // Default for API Triggered
      sent: 0,
      delivered: 0,
      status: status,
    };

    setCampaigns(prev => [...prev, newCampaign]);
    toast({
      title: status === "draft" ? "Draft Saved" : "Campaign Set Live",
      description: `${apiCampaignName} has been ${status === "draft" ? "saved as a draft" : "set live"}.`,
    });
    setCreateOpen(false);
    resetCreateCampaignForm();
  };

  const handleCreateBroadcastCampaign = (status: "draft" | "scheduled") => {
    if (broadcastCampaignType === 'immediate')
    {
      setDeliverInTimezone(false);
    }
    
    const newCampaign: Campaign = {
      id: Date.now(),
      name: apiCampaignName,
      type: "Broadcast",
      messageType: broadcastCampaignType,
      sent: 0,
      delivered: 0,
      status: status,
    };

    setCampaigns(prev => [...prev, newCampaign]);
    toast({
      title: status === "draft" ? "Draft Saved" : "Campaign Set Live",
      description: `${apiCampaignName} has been ${status === "draft" ? "saved as a draft" : "set live"}.`,
    });
    setCreateOpen(false);
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


  return (
    <div className="p-6 space-y-6" data-testid="campaign-manager">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Campaign Manager</h1>
        <Button className="gap-2 font-normal" onClick={() => setCreateOpen(true)} data-testid="button-create-campaign">
          <Plus size={16} />
          Create Campaign
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1 bg-slate-200/75 rounded-lg p-1 w-fit">
        {[
          { label: "All Campaigns", value: "all" },
          { label: "Draft", value: "draft" },
          { label: "Scheduled", value: "scheduled" },
          { label: "Delivered", value: "delivered" },
          { label: "Archived", value: "archived" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.value
                ? "bg-background text-foreground shadow-[0_-3px_6px_rgba(0,0,0,0.00),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.02)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
            data-testid={`tab-${tab.value}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

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
                    className="p-1 hover:bg-blue-100 rounded"
                    title="Archive"
                    onClick={() => setShowBulkArchiveModal(true)}
                  >
                    <Archive size={14} className="text-blue-600" />
                  </button>
                )}
                {getDeletableCampaigns().length > 0 && (
                  <button
                    className="p-1 hover:bg-blue-100 rounded"
                    title="Delete"
                    onClick={() => setShowBulkDeleteModal(true)}
                  >
                    <Trash2 size={14} className="text-blue-600" />
                  </button>
                )}
              </div>
            </div>
          )}

          <div className={`overflow-x-auto ${selectedCampaigns.length > 0 ? 'mt-3' : 'mt-6'}`}>
            <table className="w-full text-xs">
              <thead>
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
                  {activeTab === "all" && (
                    <th
                      className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                      onClick={() => handleColumnSort("status")}
                    >
                      <div className="flex items-center gap-2">
                        Status
                        {renderSortIcon("status")}
                      </div>
                    </th>
                  )}
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
                {getFilteredCampaigns().map((campaign) => (
                  <tr key={campaign.id} className="border-b hover:bg-muted/50" data-testid={`campaign-row-${campaign.id}`}>
                    <td className="py-2 px-3">
                      <Checkbox
                        checked={selectedCampaigns.includes(campaign.id)}
                        onCheckedChange={() => toggleCampaign(campaign.id)}
                        data-testid={`checkbox-campaign-${campaign.id}`}
                      />
                    </td>
                    <td className="py-2 px-3 font-medium">{campaign.name}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeBadgeClasses(campaign.type)}`}>
                        {campaign.type}
                      </span>
                    </td>
                    <td className="py-2 px-3">{campaign.messageType}</td>
                    {activeTab === "all" && (
                      <td className="py-2 px-3 capitalize text-xs">{campaign.status}</td>
                    )}
                    <td className="py-2 px-3">{campaign.sent.toLocaleString()}</td>
                    <td className="py-2 px-3">{campaign.delivered.toLocaleString()}</td>
                    <td className="py-2 px-3 flex justify-start">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 hover:bg-muted rounded">
                            <MoreVertical size={14} className="text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setPerformanceOpen(true)} data-testid={`button-performance-${campaign.id}`}>
                            <BarChart2 size={14} className="mr-2" />
                            View Performance
                          </DropdownMenuItem>
                          <DropdownMenuItem data-testid={`button-edit-${campaign.id}`}>
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
                ))}
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
                  className="flex items-center justify-between px-3 py-2 text-left bg-white border border-input rounded-md shadow-sm hover:bg-accent focus:outline-none text-foreground transition-colors"
                  onClick={() => setRowsDropdownOpen(!rowsDropdownOpen)}
                >
                  <span className="truncate text-xs font-normal">{rowsPerPage}</span>
                  <ChevronDown className="h-3 w-3 ml-2 text-muted-foreground" />
                </button>
                {rowsDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white rounded-md shadow-md border border-border">
                    <ul className="py-1">
                      {[10, 25, 50].map(option => (
                        <li
                          key={option}
                          className="px-3 py-2 text-xs cursor-pointer hover:bg-muted"
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
                <button className="p-1 hover:bg-muted rounded disabled:opacity-50" disabled>
                  <ChevronsLeft size={16} />
                </button>
                <button className="p-1 hover:bg-muted rounded disabled:opacity-50" disabled>
                  <ChevronLeft size={16} />
                </button>
                <button className="p-1 hover:bg-muted rounded disabled:opacity-50" disabled>
                  <ChevronRight size={16} />
                </button>
                <button className="p-1 hover:bg-muted rounded disabled:opacity-50" disabled>
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
                    <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Zap size={24} className="text-primary" />
                    </div>
                    <CardTitle className="text-base">API Triggered</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground">Send messages based on API calls and user actions</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover-elevate active-elevate-2 shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0" data-testid="card-broadcast" onClick={() => setCampaignCreationStep("broadcastForm")}>
                  <CardHeader className="text-center pb-2">
                    <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Send size={24} className="text-blue-600" />
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
                  <ArrowLeft size={18} className="cursor-pointer" onClick={() => setCampaignCreationStep("selectType")} />
                  <DialogTitle>Create API Triggered Campaign</DialogTitle>
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
                          value={apiCampaignName}
                          onChange={(e) => setApiCampaignName(e.target.value.slice(0, 100))}
                          className="pr-12 border border-input [border-color:hsl(var(--input))] hover-elevate"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                          {apiCampaignName.length}/100
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
                <div className="!max-h-[62vh] flex-shrink-0 !max-w-[31vh] w-full">
                  <div className="flex flex-col h-full">
                    <h3 className="font-semibold text-lg mb-1">Template Preview</h3>
                    <TemplatePreview
                      headerText={selectedTemplate?.header || ""}
                      bodyText={selectedTemplate?.body || ""}
                      footerText={selectedTemplate?.footer || ""}
                      selectedMediaFile={null}
                      templateButtons={selectedTemplate?.buttons || []}
                      variableSamples={selectedTemplate?.variableSamples || {}}
                      containerClassName="flex-1 flex items-center justify-center min-h-0"
                      phoneClassName="h-full aspect-[9/18] bg-black rounded-3xl p-3 shadow-lg flex flex-col overflow-hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setCampaignCreationStep("selectType")}
                  className="border-input [border-color:hsl(var(--input))] font-normal"
                >
                  Back
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="border-input [border-color:hsl(var(--input))] font-normal"
                    disabled={!apiCampaignName}
                    onClick={() => handleCreateCampaign("draft")}
                  >
                    Save Draft
                  </Button>
                  <Button
                    className="gap-2 font-normal bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!apiCampaignName || !campaignStartDate || (!campaignEndDate && !neverEnds) || !selectedWhatsAppTemplate}
                    onClick={() => handleCreateCampaign("scheduled")}
                  >
                    Set Live
                  </Button>
                </div>
              </div>
            </>
          )}

          {campaignCreationStep === "broadcastForm" && (
            <>
              <DialogHeader className="mb-2">
                <div className="flex items-center gap-3 mb-2">
                  <ArrowLeft size={18} className="cursor-pointer" onClick={() => setCampaignCreationStep("selectType")} />
                  <DialogTitle>Create Broadcast Campaign</DialogTitle>
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
                          value={apiCampaignName}
                          onChange={(e) => setApiCampaignName(e.target.value.slice(0, 100))}
                          className="pr-12 border border-input [border-color:hsl(var(--input))] hover-elevate"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                          {apiCampaignName.length}/100
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
                          <SelectItem value="immediate">Immediate</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="recurring">Recurring</SelectItem>
                        </SelectContent>
                      </Select>

                      {broadcastCampaignType === 'scheduled' && (
                        <div className="space-y-4 pt-2">
                          {schedules.map((schedule, index) => (
                            <div key={schedule.id} className="flex flex-col gap-6 p-4 border rounded-lg">
                              <div className="flex items-start justify-between">
                                <div className="space-y-2 flex-1">
                                  <label className="text-sm font-medium text-foreground">Campaign schedule date<span className="text-red-500 pl-0.5">*</span></label>
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
                                {schedules.length > 1 && (
                                  <button onClick={() => removeSchedule(schedule.id)} className="text-muted-foreground hover:text-foreground transition-colors ml-4 mt-1">
                                    <X size={16} />
                                  </button>
                                )}
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

                      {broadcastCampaignType === 'recurring' && (() => {
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
                            <Checkbox id="timezone-delivery-recurring" checked={deliverInTimezone} onCheckedChange={(checked) => setDeliverInTimezone(checked as boolean)} />
                            <label htmlFor="timezone-delivery-recurring" className="text-sm font-medium leading-none">Deliver in user's timezone</label>
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
                      )})()}
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
                        
                        if(e.target) {
                          e.target.value = ''
                        }
                      }} />
                      {!csvFile ? (
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => document.getElementById('csv-upload')?.click()}>
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
                            onClick={() => setIsViewCsvModalOpen(true)}
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
                <div className="!max-h-[62vh] flex-shrink-0 !max-w-[31vh] w-full">
                  <div className="flex flex-col h-full">
                    <h3 className="font-semibold text-lg mb-1">Template Preview</h3>
                    <TemplatePreview
                      headerText={selectedTemplate?.header || ""}
                      bodyText={selectedTemplate?.body || ""}
                      footerText={selectedTemplate?.footer || ""}
                      selectedMediaFile={null}
                      templateButtons={selectedTemplate?.buttons || []}
                      variableSamples={selectedTemplate?.variableSamples || {}}
                      containerClassName="flex-1 flex items-center justify-center min-h-0"
                      phoneClassName="h-full aspect-[9/18] bg-black rounded-3xl p-3 shadow-lg flex flex-col overflow-hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setCampaignCreationStep("selectType")}
                  className="border-input [border-color:hsl(var(--input))] font-normal"
                >
                  Back
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="border-input [border-color:hsl(var(--input))] font-normal"
                    disabled={!apiCampaignName}
                    onClick={() => handleCreateBroadcastCampaign("draft")}
                  >
                    Save Draft
                  </Button>
                  <Button
                    className="gap-2 font-normal bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={
                      !apiCampaignName || 
                      !broadcastCampaignType || 
                      !selectedWhatsAppTemplate || 
                      !csvFile || 
                      (broadcastCampaignType === 'scheduled' && isSchedulesInvalid) ||
                      (broadcastCampaignType === 'recurring' && isRecurringInvalid)
                    }
                    onClick={() => handleCreateBroadcastCampaign("scheduled")}
                  >
                    Set Live
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* View CSV Modal */}
      <Dialog open={isViewCsvModalOpen} onOpenChange={setIsViewCsvModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>CSV Editor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="max-h-[60vh] overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium text-muted-foreground">Name</th>
                    <th className="text-left p-2 font-medium text-muted-foreground">Number</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {csvData.map((row, index) => (
                    <tr key={index} className="border-b">
                      <td>
                        <Input
                          value={row.name}
                          onChange={(e) => {
                            const newData = [...csvData];
                            newData[index].name = e.target.value;
                            setCsvData(newData);
                          }}
                          className="border-0 rounded-none focus-visible:ring-0"
                        />
                      </td>
                      <td>
                        <Input
                          value={row.number}
                          onChange={(e) => {
                            const newData = [...csvData];
                            newData[index].number = e.target.value;
                            setCsvData(newData);
                          }}
                          className="border-0 rounded-none focus-visible:ring-0"
                        />
                      </td>
                      <td>
                        <Button variant="ghost" size="sm" onClick={() => {
                          const newData = [...csvData];
                          newData.splice(index, 1);
                          setCsvData(newData);
                        }}>X</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" className="border-input [border-color:hsl(var(--input))]" onClick={() => setCsvData([...csvData, { name: "", number: "" }])}>Add Row</Button>
              <Button onClick={() => setIsViewCsvModalOpen(false)}>Done</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Performance Dialog */}
      <Dialog open={performanceOpen} onOpenChange={setPerformanceOpen}>
        <DialogContent className="max-w-5xl" data-testid="dialog-performance">
          <DialogHeader className="mb-2">
            <DialogTitle>Campaign Performance - Summer Sale 2024</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex items-center space-x-1 bg-slate-200/75 rounded-lg p-1 w-fit">
              <button
                onClick={() => setActivePerformanceTab("performance")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activePerformanceTab === "performance"
                    ? "bg-background text-foreground shadow-[0_-3px_6px_rgba(0,0,0,0.00),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.02)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-testid="tab-performance"
              >
                Performance
              </button>
              <button
                onClick={() => setActivePerformanceTab("recipients")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activePerformanceTab === "recipients"
                    ? "bg-background text-foreground shadow-[0_-3px_6px_rgba(0,0,0,0.00),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.02)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-testid="tab-recipients"
              >
                Recipients
              </button>
            </div>

            {/* Performance Tab */}
            {activePerformanceTab === "performance" && (
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
                      className="h-[300px]"
                    >
                      <AreaChart data={engagementData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis dataKey="hour" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                        <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area type="monotone" dataKey="delivered" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={2} />
                        <Area type="monotone" dataKey="viewed" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.2} strokeWidth={2} />
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Recipients Tab */}
            {activePerformanceTab === "recipients" && (
              <div className="space-y-4">
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search recipients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 text-sm w-full border border-input rounded-md bg-background focus:outline-none transition-color"
                    data-testid="input-search-recipients"
                  />
                </div>
                <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
                  <CardContent className="pt-2">
                    <ScrollArea className="h-96">
                      <div className="overflow-x-auto mt-6">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 px-3 font-medium text-muted-foreground">Name</th>
                              <th className="text-left py-2 px-3 font-medium text-muted-foreground">Phone</th>
                              <th className="text-left py-2 px-3 font-medium text-muted-foreground">Status</th>
                              <th className="text-left py-2 px-3 font-medium text-muted-foreground">Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recipients.map((recipient) => (
                              <tr key={recipient.id} className="border-b hover:bg-muted/50" data-testid={`recipient-${recipient.id}`}>
                                <td className="py-2 px-3 font-medium">{recipient.name}</td>
                                <td className="py-2 px-3">{recipient.phone}</td>
                                <td className="py-2 px-3">
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    recipient.status === "Delivered" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
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
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Clone Campaign Dialog */}
      <Dialog open={cloneDialogOpen} onOpenChange={handleCloseCloneDialog}>
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
                  onChange={(e) => setCloneCampaignName(e.target.value.slice(0, 100))}
                  className="pr-12 border border-input [border-color:hsl(var(--input))] hover-elevate"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {cloneCampaignName.length}/100
                </span>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleCloseCloneDialog}>
                Cancel
              </Button>
              <Button
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
              Are you sure you want to archive <span className="font-semibold">{campaignToArchive?.name}</span>? You can restore it from the Archived tab.
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
              Are you sure you want to delete <span className="font-semibold">{campaignToDelete?.name}</span>? This action cannot be undone.
            </p>
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
