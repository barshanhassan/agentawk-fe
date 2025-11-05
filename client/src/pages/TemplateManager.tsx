import { useState, useRef, useEffect } from "react";
import { Plus, RefreshCw, Edit2, Eye, Copy, Trash2, Download, Calendar, Search, Filter, Send, X } from "react-feather";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, ChevronsUpDown, ChevronDown, ChevronUp, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, ArrowUpDown, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import CustomDropdown from "@/components/CustomDropdown";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type SortDirection = "asc" | "desc" | "default";

interface SortEntry {
  id: string;
  column: string;
  direction: "asc" | "desc";
}

interface FilterEntry {
  id: string;
  column: string;
  operator: string;
  value: string;
}

export default function TemplateManager() {
  const [selectedTemplates, setSelectedTemplates] = useState<number[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTemplateId, setPreviewTemplateId] = useState<number | null>(null);
  const [dateRangePreset, setDateRangePreset] = useState("last-7-days");
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>(undefined);
  const [isCustomDateOpen, setIsCustomDateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowsDropdownOpen, setRowsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [sorts, setSorts] = useState<SortEntry[]>([]);
  const [filters, setFilters] = useState<FilterEntry[]>([]);
  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const [draggedSortId, setDraggedSortId] = useState<string | null>(null);
  const [openSortColumnDropdown, setOpenSortColumnDropdown] = useState<string | null>(null);
  const [openSortDirectionDropdown, setOpenSortDirectionDropdown] = useState<string | null>(null);
  const [draggedFilterId, setDraggedFilterId] = useState<string | null>(null);
  const [openFilterColumnDropdown, setOpenFilterColumnDropdown] = useState<string | null>(null);
  const [openFilterOperatorDropdown, setOpenFilterOperatorDropdown] = useState<string | null>(null);

  const whatsappTemplates = [
    {
      id: 1,
      name: "Welcome Message",
      category: "Marketing",
      language: "EN",
      status: "Active - HQ",
      statusType: "success" as const,
      topBlockReason: "Reported as Spam",
      lastEdited: "2025-11-03",
      content: "Hi there! Welcome to our platform. We're excited to have you here! 🎉",
    },
    {
      id: 2,
      name: "Order Confirmation",
      category: "Utility",
      language: "EN",
      status: "Active - HQ",
      statusType: "success" as const,
      topBlockReason: "",
      lastEdited: "2025-11-01",
      content: "Your order #12345 has been confirmed! We'll send you tracking details once it ships. Thank you for your purchase! 📦",
    },
    {
      id: 3,
      name: "Promotional Offer",
      category: "Marketing",
      language: "EN",
      status: "Quality Pending",
      statusType: "success" as const,
      topBlockReason: "Blocked Business",
      lastEdited: "2025-10-28",
      content: "🔥 Special Offer! Get 25% off your next purchase with code SAVE25. Valid until midnight tonight! Shop now: link.com/shop",
    },
    {
      id: 4,
      name: "Cart Abandonment",
      category: "Marketing",
      language: "EN",
      status: "Pending",
      statusType: "warning" as const,
      topBlockReason: "",
      lastEdited: "2025-10-25",
      content: "You left something in your cart! 🛒 Complete your purchase now and get free shipping on orders over $50. Don't miss out!",
    },
    {
      id: 5,
      name: "Shipping Update",
      category: "Utility",
      language: "EN",
      status: "Active - HQ",
      statusType: "success" as const,
      topBlockReason: "",
      lastEdited: "2025-10-20",
      content: "📦 Your package is on its way! Track your order with code ABC123. Expected delivery: Tomorrow by 6 PM.",
    },
    {
      id: 6,
      name: "Payment Reminder",
      category: "Utility",
      language: "ES",
      status: "Approved",
      statusType: "success" as const,
      topBlockReason: "Sent Too Frequently",
      lastEdited: "2025-10-15",
      content: "Recordatorio de pago: Su factura de $150 vence mañana. Pague ahora para evitar cargos adicionales. Gracias! 💳",
    },
    {
      id: 7,
      name: "Flash Sale Alert",
      category: "Marketing",
      language: "EN",
      status: "Rejected",
      statusType: "danger" as const,
      topBlockReason: "",
      lastEdited: "2025-10-10",
      content: "⚡ FLASH SALE ALERT! 50% OFF everything for the next 2 hours only! Use code FLASH50. Hurry, limited time!",
    },
    {
      id: 8,
      name: "Account Verification",
      category: "Authentication",
      language: "EN",
      status: "Active - HQ",
      statusType: "success" as const,
      topBlockReason: "Reported as Suspicious",
      lastEdited: "2025-10-05",
      content: "Please verify your account by clicking this link: verify.com/abc123. This link expires in 24 hours. 🔐",
    },
    {
      id: 9,
      name: "Password Reset",
      category: "Authentication",
      language: "EN",
      status: "Quality Pending",
      statusType: "success" as const,
      topBlockReason: "",
      lastEdited: "2025-09-30",
      content: "Reset your password by clicking here: reset.com/xyz789. If you didn't request this, please ignore this message. 🔑",
    },
    {
      id: 10,
      name: "Appointment Reminder",
      category: "Utility",
      language: "FR",
      status: "Active - HQ",
      statusType: "success" as const,
      topBlockReason: "",
      lastEdited: "2025-09-25",
      content: "Rappel de rendez-vous: Votre rendez-vous est demain à 14h00. Confirmez votre présence en répondant OUI. 📅",
    },
    {
      id: 11,
      name: "Survey Request",
      category: "Marketing",
      language: "EN",
      status: "Pending",
      statusType: "warning" as const,
      topBlockReason: "",
      lastEdited: "2025-09-20",
      content: "Help us improve! Take our 2-minute survey and get a 10% discount on your next order. Your feedback matters! 📝",
    },
    {
      id: 12,
      name: "Delivery Notification",
      category: "Utility",
      language: "EN",
      status: "Approved",
      statusType: "success" as const,
      topBlockReason: "Blocked Business",
      lastEdited: "2025-09-15",
      content: "📦 Package delivered! Your order has been successfully delivered to your address. Thank you for choosing us!",
    },
    {
      id: 13,
      name: "Limited Time Offer",
      category: "Marketing",
      language: "DE",
      status: "Rejected",
      statusType: "danger" as const,
      topBlockReason: "",
      lastEdited: "2025-09-10",
      content: "🎯 Zeitlich begrenztes Angebot! 30% Rabatt auf alle Artikel. Code: SAVE30DE. Nur heute gültig!",
    },
    {
      id: 14,
      name: "Support Ticket Update",
      category: "Utility",
      language: "EN",
      status: "Quality Pending",
      statusType: "success" as const,
      topBlockReason: "Irrelevant Content",
      lastEdited: "2025-08-30",
      content: "Support Update: Your ticket #12345 has been resolved. If you need further assistance, please reply to this message. 🎧",
    },
    {
      id: 15,
      name: "New Feature Announcement",
      category: "Marketing",
      language: "EN",
      status: "Active - HQ",
      statusType: "success" as const,
      topBlockReason: "",
      lastEdited: "2025-08-25",
      content: "🚀 New Feature Alert! We've just launched dark mode! Update your app now to try this exciting new feature.",
    },
  ];

  const toggleTemplate = (id: number) => {
    setSelectedTemplates((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedTemplates.length === whatsappTemplates.length) {
      setSelectedTemplates([]);
    } else {
      setSelectedTemplates(whatsappTemplates.map((t) => t.id));
    }
  };

  const getStatusBadgeClasses = (statusType: string) => {
    switch (statusType) {
      case "success":
        return "bg-green-100 text-green-700";
      case "warning":
        return "bg-yellow-100 text-yellow-700";
      case "danger":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setRowsDropdownOpen(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setShowSort(false);
      }
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setShowFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Sort functions
  const addSort = () => {
    const availableColumns = ["name", "category", "language", "status", "topBlockReason", "lastEdited"];
    const usedColumns = sorts.map(s => s.column);
    const nextColumn = availableColumns.find(col => !usedColumns.includes(col)) || "name";
    setSorts([...sorts, { id: Date.now().toString(), column: nextColumn, direction: "asc" }]);
  };

  const removeSort = (id: string) => {
    setSorts(sorts.filter(s => s.id !== id));
  };

  const updateSort = (id: string, column: string, direction: "asc" | "desc") => {
    if (sorts.some(s => s.id !== id && s.column === column)) {
      return;
    }
    setSorts(sorts.map(s => s.id === id ? { ...s, column, direction } : s));
  };

  const handleSortDragStart = (id: string) => {
    setDraggedSortId(id);
  };

  const handleSortDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSortDrop = (targetId: string) => {
    if (!draggedSortId || draggedSortId === targetId) return;

    const draggedIndex = sorts.findIndex(s => s.id === draggedSortId);
    const targetIndex = sorts.findIndex(s => s.id === targetId);

    const newSorts = [...sorts];
    [newSorts[draggedIndex], newSorts[targetIndex]] = [newSorts[targetIndex], newSorts[draggedIndex]];
    setSorts(newSorts);
    setDraggedSortId(null);
  };

  const canAddSort = (column: string) => {
    return !sorts.some(s => s.column === column);
  };

  // Filter functions
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

  // Sorting functions
  const handleColumnSort = (column: string) => {
    const existingSort = sorts.find(s => s.column === column);
    if (existingSort) {
      if (existingSort.direction === "asc") {
        setSorts(sorts.map(s => s.id === existingSort.id ? { ...s, direction: "desc" } : s));
      } else {
        setSorts(sorts.filter(s => s.id !== existingSort.id));
      }
    } else {
      setSorts([...sorts, { id: Date.now().toString(), column, direction: "asc" }]);
    }
  };

  const renderSortIcon = (column: string) => {
    const sort = sorts.find(s => s.column === column);
    const isActive = !!sort;
    const color = isActive ? "text-foreground" : "text-muted-foreground";

    if (!sort) {
      return <div className="w-4 h-4 flex items-center justify-center"><ChevronsUpDown size={14} className={color} /></div>;
    }
    if (sort.direction === "asc") {
      return <div className="w-4 h-4 flex items-center justify-center"><ChevronUp size={14} className={color} /></div>;
    }
    return <div className="w-4 h-4 flex items-center justify-center"><ChevronDown size={14} className={color} /></div>;
  };

  // Get filtered and sorted templates
  const getFilteredAndSortedTemplates = () => {
    let data = [...whatsappTemplates];

    // Apply search filter
    if (searchQuery) {
      data = data.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply date range filter
    if (dateRangePreset !== "all-time") {
      const now = new Date();
      let startDate: Date;

      if (dateRangePreset === "custom" && customDateRange?.from) {
        startDate = customDateRange.from;
      } else {
        switch (dateRangePreset) {
          case "last-7-days":
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case "last-30-days":
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case "last-90-days":
            startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
          default:
            startDate = new Date(0);
        }
      }

      data = data.filter(item => {
        const itemDate = new Date(item.lastEdited);
        return itemDate >= startDate;
      });
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      data = data.filter(item => {
        // Map category IDs to actual category names
        const categoryMap: { [key: string]: string } = {
          "marketing": "Marketing",
          "utility": "Utility",
          "authentication": "Authentication"
        };
        return selectedCategories.some(id => categoryMap[id] === item.category);
      });
    }

    // Apply language filter
    if (selectedLanguages.length > 0) {
      data = data.filter(item => {
        // Map language IDs to actual language codes
        const languageMap: { [key: string]: string } = {
          "en": "EN",
          "es": "ES",
          "fr": "FR",
          "de": "DE"
        };
        return selectedLanguages.some(id => languageMap[id] === item.language);
      });
    }

    // Apply status filter
    if (selectedStatuses.length > 0) {
      // Map status IDs to actual status names
      const statusMap: { [key: string]: string } = {
        "active-hq": "Active - HQ",
        "quality-pending": "Quality Pending",
        "approved": "Approved",
        "pending": "Pending",
        "rejected": "Rejected"
      };
      const mappedStatuses = selectedStatuses.map(id => statusMap[id]);
      data = data.filter(item => mappedStatuses.includes(item.status));
    }

    // Apply advanced filters (from Sort/Filter buttons)
    data = data.filter(item => {
      return filters.every(filter => {
        const itemValue = item[filter.column as keyof typeof item];
        if (typeof itemValue !== "string") return true;

        switch (filter.operator) {
          case "contains":
            return itemValue.toLowerCase().includes(filter.value.toLowerCase());
          case "does not contain":
            return !itemValue.toLowerCase().includes(filter.value.toLowerCase());
          case "is":
            return itemValue.toLowerCase() === filter.value.toLowerCase();
          case "is not":
            return itemValue.toLowerCase() !== filter.value.toLowerCase();
          case "is empty":
            return itemValue === "";
          case "is not empty":
            return itemValue !== "";
          default:
            return true;
        }
      });
    });

    // Apply sorting - Excel-style multi-level sort
    if (sorts.length > 0) {
      // Define custom sort order for status
      const statusOrder = {
        "Active - HQ": 0,
        "Quality Pending": 1,
        "Approved": 2,
        "Pending": 3,
        "Rejected": 4
      };

      data.sort((a, b) => {
        for (const sort of sorts) {
          const aVal = a[sort.column as keyof typeof a];
          const bVal = b[sort.column as keyof typeof b];

          let comparison = 0;
          
          // Special handling for status column
          if (sort.column === "status" && typeof aVal === "string" && typeof bVal === "string") {
            const aOrder = statusOrder[aVal as keyof typeof statusOrder] ?? 999;
            const bOrder = statusOrder[bVal as keyof typeof statusOrder] ?? 999;
            comparison = sort.direction === "asc" ? aOrder - bOrder : bOrder - aOrder;
          } else if (typeof aVal === "string" && typeof bVal === "string") {
            comparison = sort.direction === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
          }

          // If values are different, return the comparison result
          if (comparison !== 0) {
            return comparison;
          }
          // If values are equal, continue to next sort criterion
        }
        return 0; // All criteria are equal
      });
    }

    return data;
  };

  // Pagination logic
  const filteredAndSortedTemplates = getFilteredAndSortedTemplates();
  const totalPages = Math.ceil(filteredAndSortedTemplates.length / rowsPerPage);
  const paginatedTemplates = filteredAndSortedTemplates.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="p-6 space-y-6" data-testid="template-manager">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Template Manager</h1>
        <div className="flex items-center gap-3">
          <Button className="gap-2 font-normal h-10 text-sm" data-testid="button-create-template">
            <Plus size={16} />
            Create Template
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-10 w-10 p-0 border hover-elevate [border-color:hsl(var(--input))]"
                data-testid="button-refresh"
              >
                <RefreshCw size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Refresh</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Dashboard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Templates</p>
              <p className="text-2xl font-bold">44</p>
              <p className="text-xs text-muted-foreground">Templates</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Approved Templates</p>
              <p className="text-2xl font-bold">40</p>
              <p className="text-xs text-muted-foreground">Approved</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">2</p>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Messages Delivered</p>
              <p className="text-2xl font-bold">24,343</p>
              <p className="text-xs text-muted-foreground">Total sent</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Average Read Rate</p>
              <p className="text-2xl font-bold">89.9%</p>
              <p className="text-xs text-muted-foreground">Across templates</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Estimated Cost</p>
              <p className="text-2xl font-bold">$213.70</p>
              <p className="text-xs text-muted-foreground">Total messaging cost</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* WhatsApp Templates Content */}
      <div className="space-y-6">
            {/* Search and Filtering Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Search Input */}
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 text-sm"
                  data-testid="input-search"
                />
              </div>

              {/* Date Filter */}
              <Select value={dateRangePreset} onValueChange={setDateRangePreset}>
                <SelectTrigger className="w-[160px] h-10 hover-elevate" data-testid="select-date-filter" style={{ height: "38px" }}>
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)]">
                  <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                  <SelectItem value="last-14-days">Last 14 Days</SelectItem>
                  <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="this-quarter">This Quarter</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>

              {/* Custom Date Range */}
              {dateRangePreset === "custom" && (
                <Popover open={isCustomDateOpen} onOpenChange={setIsCustomDateOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="gap-2 font-normal h-10 hover-elevate [border-color:hsl(var(--input))]">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {customDateRange
                          ? customDateRange.to
                            ? `${customDateRange.from?.toLocaleDateString() || ""} - ${customDateRange.to?.toLocaleDateString() || ""}`
                            : customDateRange.from?.toLocaleDateString() || ""
                          : "Select Date"}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <CalendarComponent
                      initialFocus
                      mode="range"
                      defaultMonth={customDateRange?.from}
                      selected={customDateRange}
                      onSelect={setCustomDateRange}
                      numberOfMonths={1}
                    />
                  </PopoverContent>
                </Popover>
              )}

              {/* Category Filter */}
              <CustomDropdown
                options={[
                  { id: "marketing", name: "Marketing" },
                  { id: "utility", name: "Utility" },
                  { id: "authentication", name: "Authentication" },
                ]}
                selected={selectedCategories}
                onChange={setSelectedCategories}
                placeholder="Categories"
                width="170px"
              />

              {/* Language Filter */}
              <CustomDropdown
                options={[
                  { id: "en", name: "English" },
                  { id: "es", name: "Spanish" },
                  { id: "fr", name: "French" },
                  { id: "de", name: "German" },
                ]}
                selected={selectedLanguages}
                onChange={setSelectedLanguages}
                placeholder="Languages"
                width="150px"
              />

              {/* Status Filter */}
              <CustomDropdown
                options={[
                  { id: "active-hq", name: "Active - HQ" },
                  { id: "quality-pending", name: "Quality Pending" },
                  { id: "approved", name: "Approved" },
                  { id: "pending", name: "Pending" },
                  { id: "rejected", name: "Rejected" },
                ]}
                selected={selectedStatuses}
                onChange={setSelectedStatuses}
                placeholder="Status"
                width="180px"
              />

              <div className="flex gap-3 ml-auto">
                {/* Sort Button */}
                <div className="relative" ref={sortDropdownRef}>
                  <button
                    onClick={() => setShowSort(!showSort)}
                    className="px-3 py-2 text-sm border border-input rounded-md hover:bg-accent focus:outline-none  flex items-center gap-2 transition-colors"
                  >
                    <ArrowUpDown size={14} />
                    <span>Sort {sorts.length > 0 && `(${sorts.length})`}</span>
                  </button>

                  {/* Sort Popover */}
                  {showSort && (
                    <div className="absolute z-50 bg-white border border-border rounded-md shadow-lg p-3 top-full mt-2 right-0" style={{
                      minWidth: '320px'
                    }}>
                      {sorts.length === 0 ? (
                        <div className="text-center py-6">
                          <h3 className="font-semibold text-sm mb-1">No sorting applied</h3>
                          <p className="text-xs text-muted-foreground mb-4">Add sorting to organize your rows.</p>
                          <Button onClick={addSort} className="bg-blue-500 hover:bg-blue-600 text-white">Add sort</Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {sorts.map((sort) => (
                            <div
                              key={sort.id}
                              className="flex gap-2 items-center"
                              draggable
                              onDragStart={() => handleSortDragStart(sort.id)}
                              onDragOver={handleSortDragOver}
                              onDrop={() => handleSortDrop(sort.id)}
                            >
                              <div className="relative flex-1">
                                <button
                                  type="button"
                                  onClick={() => setOpenSortColumnDropdown(openSortColumnDropdown === sort.id ? null : sort.id)}
                                  className="w-[160px] flex items-center justify-between px-3 py-2 text-left bg-white border border-input rounded-md shadow-sm hover:bg-accent focus:outline-none text-foreground transition-colors w-full"
                                >
                                  <span className="truncate text-sm font-normal">
                                    {sort.column === "name" ? "Template Name" :
                                     sort.column === "category" ? "Category" :
                                     sort.column === "language" ? "Language" :
                                     sort.column === "status" ? "Status" :
                                     sort.column === "topBlockReason" ? "Top Block Reason" :
                                     "Last Edited"}
                                  </span>
                                  <ChevronDown className="h-3 w-3 ml-2 text-muted-foreground" />
                                </button>
                                {openSortColumnDropdown === sort.id && (
                                  <div className="absolute z-10 w-full mt-2 bg-white rounded-md shadow-md border border-border">
                                    <ul className="py-1">
                                      {["name", "category", "language", "status", "topBlockReason", "lastEdited"].map(option => {
                                        const isCurrentOption = option === sort.column;
                                        const isDisabled = !canAddSort(option) && option !== sort.column;
                                        return (
                                          <li
                                            key={option}
                                            className={`px-3 py-2 text-sm ${isCurrentOption || isDisabled ? "opacity-40 text-muted-foreground cursor-not-allowed" : "cursor-pointer hover:bg-muted"}`}
                                            onClick={() => {
                                              if (!isDisabled && !isCurrentOption) {
                                                updateSort(sort.id, option, sort.direction);
                                                setOpenSortColumnDropdown(null);
                                              }
                                            }}
                                          >
                                            {option === "name" ? "Template Name" :
                                             option === "category" ? "Category" :
                                             option === "language" ? "Language" :
                                             option === "status" ? "Status" :
                                             option === "topBlockReason" ? "Top Block Reason" :
                                             "Last Edited"}
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
                                  onClick={() => setOpenSortDirectionDropdown(openSortDirectionDropdown === sort.id ? null : sort.id)}
                                  className="w-[90px] flex items-center justify-between px-3 py-2 text-left bg-white border border-input rounded-md shadow-sm hover:bg-accent focus:outline-none text-foreground transition-colors"
                                >
                                  <span className="truncate text-sm font-normal">{sort.direction === "asc" ? "Asc" : "Desc"}</span>
                                  <ChevronDown className="h-3 w-3 ml-2 text-muted-foreground" />
                                </button>
                                {openSortDirectionDropdown === sort.id && (
                                  <div className="absolute z-10 w-full mt-2 bg-white rounded-md shadow-md border border-border">
                                    <ul className="py-1">
                                      {["asc", "desc"].map(option => (
                                        <li
                                          key={option}
                                          className="px-3 py-2 text-sm cursor-pointer hover:bg-muted"
                                          onClick={() => {
                                            updateSort(sort.id, sort.column, option as "asc" | "desc");
                                            setOpenSortDirectionDropdown(null);
                                          }}
                                        >
                                          {option === "asc" ? "Asc" : "Desc"}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                              <button onClick={() => removeSort(sort.id)} className="p-2 hover:bg-muted rounded"><Trash2 size={14} /></button>
                              <GripVertical size={14} className="text-muted-foreground cursor-grab" />
                            </div>
                          ))}
                          <div className="flex gap-2 pt-2 border-t">
                            <Button
                              onClick={addSort}
                              disabled={sorts.length >= 6}
                              className="bg-blue-500 hover:bg-blue-600 text-white flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Add sort
                            </Button>
                            <Button onClick={() => setSorts([])} variant="outline" className="flex-1 border-input [border-color:hsl(var(--input))]">Reset sorts</Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Filter Button */}
                <div className="relative" ref={filterDropdownRef}>
                  <button
                    onClick={() => setShowFilter(!showFilter)}
                    className="px-3 py-2 text-sm border border-input rounded-md hover:bg-accent focus:outline-none  flex items-center gap-2 transition-colors"
                  >
                    <Filter size={14} />
                    <span>Filter {filters.length > 0 && `(${filters.length})`}</span>
                  </button>

                  {/* Filter Popover */}
                  {showFilter && (
                    <div className="absolute z-50 bg-white border border-border rounded-md shadow-lg p-3 top-full mt-2 right-0" style={{
                      minWidth: '320px'
                    }}>
                      {filters.length === 0 ? (
                        <div className="text-center py-6">
                          <h3 className="font-semibold text-sm mb-1">No filters applied</h3>
                          <p className="text-xs text-muted-foreground mb-4">Add filters to refine your rows.</p>
                          <Button onClick={addFilter} className="bg-blue-500 hover:bg-blue-600 text-white">Add filter</Button>
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
                                  className="w-[160px] flex items-center justify-between px-3 py-2 text-left bg-white border border-input rounded-md shadow-sm hover:bg-accent focus:outline-none text-foreground transition-colors w-full"
                                >
                                  <span className="truncate text-sm font-normal">
                                    {filter.column === "name" ? "Template Name" :
                                     filter.column === "category" ? "Category" :
                                     filter.column === "language" ? "Language" :
                                     filter.column === "status" ? "Status" :
                                     filter.column === "topBlockReason" ? "Top Block Reason" :
                                     "Last Edited"}
                                  </span>
                                  <ChevronDown className="h-3 w-3 ml-2 text-muted-foreground" />
                                </button>
                                {openFilterColumnDropdown === filter.id && (
                                  <div className="absolute z-10 w-full mt-2 bg-white rounded-md shadow-md border border-border">
                                    <ul className="py-1">
                                      {["name", "category", "language", "status", "topBlockReason", "lastEdited"].map(option => {
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
                                            {option === "name" ? "Template Name" :
                                             option === "category" ? "Category" :
                                             option === "language" ? "Language" :
                                             option === "status" ? "Status" :
                                             option === "topBlockReason" ? "Top Block Reason" :
                                             "Last Edited"}
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
                                  className="w-[170px] flex items-center justify-between px-3 py-2 text-left bg-white border border-input rounded-md shadow-sm hover:bg-accent focus:outline-none text-foreground transition-colors"
                                >
                                  <span className="truncate text-sm font-normal">{filter.operator}</span>
                                  <ChevronDown className="h-3 w-3 ml-2 text-muted-foreground" />
                                </button>
                                {openFilterOperatorDropdown === filter.id && (
                                  <div className="absolute z-10 w-full mt-2 bg-white rounded-md shadow-md border border-border">
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
                                className="px-3 py-2 text-sm border border-input rounded-md flex-1 focus:outline-none  transition-colors"
                              />
                              <button onClick={() => removeFilter(filter.id)} className="p-2 hover:bg-muted rounded"><Trash2 size={14} /></button>
                              <GripVertical size={14} className="text-muted-foreground cursor-grab" />
                            </div>
                          ))}
                          <div className="flex gap-2 pt-2 border-t">
                            <Button onClick={addFilter} className="bg-blue-500 hover:bg-blue-600 text-white flex-1">Add filter</Button>
                            <Button onClick={() => setFilters([])} variant="outline" className="flex-1 border-input [border-color:hsl(var(--input))]">Reset filters</Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Table */}
            <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
              <CardContent className="pt-2">
                {/* Bulk Actions Toolbar */}
                {selectedTemplates.length > 0 && (
                  <div className="flex items-center gap-3 mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
                    <span className="text-sm text-foreground">{selectedTemplates.length} selected</span>
                    <div className="flex gap-2 ml-auto">
                      <button className="p-1 hover:bg-blue-100 rounded" title="Delete">
                        <Trash2 size={14} className="text-blue-600" />
                      </button>
                    </div>
                  </div>
                )}

                <div className={`overflow-x-auto ${selectedTemplates.length > 0 ? 'mt-3' : 'mt-6'}`}>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">
                          <Checkbox
                            checked={selectedTemplates.length === whatsappTemplates.length}
                            onCheckedChange={toggleAll}
                            data-testid="checkbox-select-all"
                          />
                        </th>
                        <th
                          className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                          onClick={() => handleColumnSort("name")}
                        >
                          <div className="flex items-center gap-2">
                            Template Name
                            {renderSortIcon("name")}
                          </div>
                        </th>
                        <th
                          className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                          onClick={() => handleColumnSort("category")}
                        >
                          <div className="flex items-center gap-2">
                            Category
                            {renderSortIcon("category")}
                          </div>
                        </th>
                        <th
                          className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                          onClick={() => handleColumnSort("language")}
                        >
                          <div className="flex items-center gap-2">
                            Language
                            {renderSortIcon("language")}
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
                          onClick={() => handleColumnSort("topBlockReason")}
                        >
                          <div className="flex items-center gap-2">
                            Top Block Reason
                            {renderSortIcon("topBlockReason")}
                          </div>
                        </th>
                        <th
                          className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                          onClick={() => handleColumnSort("lastEdited")}
                        >
                          <div className="flex items-center gap-2">
                            Last Edited
                            {renderSortIcon("lastEdited")}
                          </div>
                        </th>
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedTemplates.map((template) => (
                        <tr key={template.id} className="border-b hover:bg-muted/50" data-testid={`template-row-${template.id}`}>
                          <td className="py-2 px-3">
                            <Checkbox
                              checked={selectedTemplates.includes(template.id)}
                              onCheckedChange={() => toggleTemplate(template.id)}
                              data-testid={`checkbox-template-${template.id}`}
                            />
                          </td>
                          <td className="py-2 px-3">{template.name}</td>
                          <td className="py-2 px-3">{template.category}</td>
                          <td className="py-2 px-3">{template.language}</td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClasses(template.statusType)}`}>
                              {template.status}
                            </span>
                          </td>
                          <td className="py-2 px-3">
                            {template.topBlockReason || "No blocks!"}
                          </td>
                          <td className="py-2 px-3">{template.lastEdited}</td>
                          <td className="py-2 px-3 flex justify-start">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="p-1 hover:bg-muted rounded">
                                  <MoreVertical size={14} className="text-muted-foreground" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem data-testid={`button-edit-${template.id}`}>
                                  <Edit2 size={14} className="mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  setPreviewTemplateId(template.id);
                                  setPreviewOpen(true);
                                }} data-testid={`button-preview-${template.id}`}>
                                  <Eye size={14} className="mr-2" />
                                  Preview
                                </DropdownMenuItem>
                                <DropdownMenuItem data-testid={`button-clone-${template.id}`}>
                                  <Copy size={14} className="mr-2" />
                                  Clone
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" data-testid={`button-delete-${template.id}`}>
                                  <Trash2 size={14} className="mr-2" />
                                  Delete
                                </DropdownMenuItem>
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
                  <span className="text-muted-foreground">{whatsappTemplates.length} results</span>
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
                                  setPage(1);
                                }}
                              >
                                {option}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <span className="text-muted-foreground">Page {page} of {totalPages || 1}</span>
                    <div className="flex gap-1">
                      <button
                        className="p-1 hover:bg-muted rounded disabled:opacity-50"
                        disabled={page === 1}
                        onClick={() => setPage(1)}
                      >
                        <ChevronsLeft size={16} />
                      </button>
                      <button
                        className="p-1 hover:bg-muted rounded disabled:opacity-50"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        className="p-1 hover:bg-muted rounded disabled:opacity-50"
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                      >
                        <ChevronRight size={16} />
                      </button>
                      <button
                        className="p-1 hover:bg-muted rounded disabled:opacity-50"
                        disabled={page === totalPages}
                        onClick={() => setPage(totalPages)}
                      >
                        <ChevronsRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-md" data-testid="dialog-preview">
          <DialogHeader className="mb-2">
            <DialogTitle>Template Preview</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            <div className="flex-1 flex items-center justify-center">
              {/* Phone mockup */}
              <div className="aspect-[9/18] bg-black rounded-3xl p-3 shadow-lg flex flex-col overflow-hidden">
                {/* Phone header - WhatsApp green */}
                <div className="bg-[#075E54] rounded-t-2xl px-4 py-2 flex items-center justify-between" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#25D366] rounded-full"></div>
                    <div>
                      <p className="text-xs font-semibold text-white">WhatsApp</p>
                      <p className="text-xs text-[#DCF8C6]">Online</p>
                    </div>
                  </div>
                </div>

                {/* Chat area - WhatsApp light background */}
                <div className="flex-1 bg-[#ECE5DD] px-4 pt-4 pb-4 overflow-y-auto flex flex-col justify-end space-y-3" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
                  {/* Customer message (left side) - incoming message */}
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl rounded-bl-none px-3 py-2 max-w-xs shadow-sm" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
                      <p className="text-sm text-[#111B21] leading-relaxed">
                        {previewTemplateId ? 
                          whatsappTemplates.find(t => t.id === previewTemplateId)?.content || "Template content not found" :
                          "Select a template to preview"
                        }
                      </p>
                      <p className="text-xs text-[#999999] mt-1">9:41 AM</p>
                    </div>
                  </div>
                </div>

                {/* Input area */}
                <div className="bg-[#E8E8E8] rounded-b-2xl px-4 py-2 flex items-center gap-2" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
                  <div className="h-8 flex flex-1 bg-white rounded-full px-3 py-1 items-center border border-[#E5E5EA]">
                    <p className="text-sm text-[#999999]">Type a message...</p>
                  </div>
                  <button className="w-8 h-8 bg-[#25D366] rounded-full flex items-center justify-center hover:bg-[#20BA5A] transition-colors">
                    <Send size={16} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
