import { useState, useRef, useEffect } from "react";
import { Plus, RefreshCw, Edit2, Eye, Copy, Trash2, Download, Calendar, Search, Filter, Send, FileText, BookOpen, ArrowLeft, ShoppingCart, Bell, Shield } from "react-feather";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
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
import { MoreVertical, ChevronsUpDown, ChevronDown, ChevronUp, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, ArrowUpDown, GripVertical, Bold, Italic, Strikethrough, Smile } from "lucide-react";
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
  // Add style to hide scrollbar
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const [selectedTemplates, setSelectedTemplates] = useState<number[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTemplateId, setPreviewTemplateId] = useState<number | null>(null);
  const [createTemplateOpen, setCreateTemplateOpen] = useState(false);
  const [templateCreationStep, setTemplateCreationStep] = useState<"choice" | "category" | "form" | "content">("choice");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("english");
  const [templateName, setTemplateName] = useState<string>("");
  const [templateType, setTemplateType] = useState<string>("");
  const [mediaSample, setMediaSample] = useState<string>("none");
  const [headerText, setHeaderText] = useState<string>("");
  const [bodyText, setBodyText] = useState<string>("");
  const [footerText, setFooterText] = useState<string>("");
  const [variableSamples, setVariableSamples] = useState<{[key: string]: string}>({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [templateButtons, setTemplateButtons] = useState<Array<{
    id: number;
    type: string;
    buttonText?: string;
    urlType?: string;
    websiteUrl?: string;
    trackAppConversion?: boolean;
    enableMetaTracking?: boolean;
    activeFor?: string;
    country?: string;
    phoneNumber?: string;
    flowButton?: string;
    flowId?: string;
    offerCode?: string;
  }>>([]);
  const [draggedButtonId, setDraggedButtonId] = useState<number | null>(null);
  const bodyTextareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Helper functions for template creation flow
  const handleBlankTemplateClick = () => {
    setTemplateCreationStep("category");
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleBackToChoice = () => {
    setTemplateCreationStep("choice");
    setSelectedCategory(null);
  };

  const handleBackToCategory = () => {
    setTemplateCreationStep("category");
  };

  const handleNextFromCategory = () => {
    if (selectedCategory) {
      setTemplateCreationStep("form");
    }
  };

  const handleNextFromForm = () => {
    if (templateName.trim() && templateType.trim()) {
      setTemplateCreationStep("content");
    }
  };

  const handleBackToForm = () => {
    setTemplateCreationStep("form");
  };

  // Helper function to get the next variable number
  const getNextVariableNumber = () => {
    const allText = headerText + " " + bodyText;
    const variableMatches = allText.match(/\{\{(\d+)\}\}/g);

    if (!variableMatches) return 1;

    const numbers = variableMatches.map(match => {
      const numberMatch = match.match(/\{\{(\d+)\}\}/);
      return numberMatch ? parseInt(numberMatch[1]) : 0;
    });

    const maxNumber = Math.max(...numbers);
    return maxNumber + 1;
  };

  // Helper function to get all variables used in header and body (both numeric and text)
  const getAllVariables = () => {
    const allText = headerText + " " + bodyText;
    // Match both numeric {{1}} and text {{name}} variables
    const variableMatches = allText.match(/\{\{[^}]+\}\}/g);

    if (!variableMatches) return [];

    const uniqueVariables = Array.from(new Set(variableMatches));
    return uniqueVariables.sort((a, b) => {
      // Extract content inside braces
      const aContent = a.match(/\{\{([^}]+)\}\}/)?.[1] || "";
      const bContent = b.match(/\{\{([^}]+)\}\}/)?.[1] || "";

      // Check if both are numeric
      const aIsNumeric = /^\d+$/.test(aContent);
      const bIsNumeric = /^\d+$/.test(bContent);

      if (aIsNumeric && bIsNumeric) {
        return parseInt(aContent) - parseInt(bContent);
      } else if (aIsNumeric && !bIsNumeric) {
        return -1; // Numeric variables come first
      } else if (!aIsNumeric && bIsNumeric) {
        return 1; // Text variables come after numeric
      } else {
        return aContent.localeCompare(bContent); // Alphabetical for text variables
      }
    });
  };

  // Helper function to check if the template form is valid
  const isTemplateFormValid = () => {
    // Body is required
    if (!bodyText.trim()) return false;

    // If variables exist, all must have samples
    const variables = getAllVariables();
    if (variables.length > 0) {
      return variables.every(variable => {
        const variableKey = variable.match(/\{\{([^}]+)\}\}/)?.[1] || "";
        return variableSamples[variableKey]?.trim();
      });
    }

    return true;
  };

  const handleCloseCreateTemplate = () => {
    setCreateTemplateOpen(false);
    setTemplateCreationStep("choice");
    setSelectedCategory(null);
    setSelectedLanguage("english");
    setTemplateName("");
    setTemplateType("");
    setMediaSample("none");
    setHeaderText("");
    setBodyText("");
    setFooterText("");
    setVariableSamples({});
    setShowEmojiPicker(false);
    setTemplateButtons([]);
  };

  // Button drag handlers
  const handleButtonDragStart = (id: number) => {
    setDraggedButtonId(id);
  };

  const handleButtonDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleButtonDrop = (targetId: number) => {
    if (!draggedButtonId || draggedButtonId === targetId) return;

    const draggedIndex = templateButtons.findIndex(b => b.id === draggedButtonId);
    const targetIndex = templateButtons.findIndex(b => b.id === targetId);

    const newButtons = [...templateButtons];
    [newButtons[draggedIndex], newButtons[targetIndex]] = [newButtons[targetIndex], newButtons[draggedIndex]];
    setTemplateButtons(newButtons);
    setDraggedButtonId(null);
  };

  const updateButtonConfig = (buttonId: number, field: string, value: any) => {
    setTemplateButtons(templateButtons.map(btn =>
      btn.id === buttonId ? { ...btn, [field]: value } : btn
    ));
  };

  // Text formatting functions
  const applyFormatting = (formatChar: string) => {
    const textarea = bodyTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = bodyText.substring(start, end);

    if (selectedText) {
      // Check if the selected text is already formatted
      const beforeSelection = bodyText.substring(Math.max(0, start - formatChar.length), start);
      const afterSelection = bodyText.substring(end, Math.min(bodyText.length, end + formatChar.length));

      const isAlreadyFormatted = beforeSelection === formatChar && afterSelection === formatChar;

      if (isAlreadyFormatted) {
        // Remove formatting
        const newText =
          bodyText.substring(0, start - formatChar.length) +
          selectedText +
          bodyText.substring(end + formatChar.length);
        setBodyText(newText);

        // Restore cursor position after removing formatting
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start - formatChar.length, end - formatChar.length);
        }, 0);
      } else {
        // Add formatting
        const formattedText = `${formatChar}${selectedText}${formatChar}`;
        const newText = bodyText.substring(0, start) + formattedText + bodyText.substring(end);
        setBodyText(newText);

        // Restore cursor position after formatting
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + formatChar.length, end + formatChar.length);
        }, 0);
      }
    } else {
      // No selection - check if cursor is between formatting characters
      const beforeCursor = bodyText.substring(Math.max(0, start - formatChar.length), start);
      const afterCursor = bodyText.substring(start, Math.min(bodyText.length, start + formatChar.length));

      if (beforeCursor === formatChar && afterCursor === formatChar) {
        // Remove the formatting characters
        const newText =
          bodyText.substring(0, start - formatChar.length) +
          bodyText.substring(start + formatChar.length);
        setBodyText(newText);

        // Place cursor where it was (adjusted for removed characters)
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start - formatChar.length, start - formatChar.length);
        }, 0);
      } else {
        // Insert formatting characters at cursor position
        const formattedText = `${formatChar}${formatChar}`;
        const newText = bodyText.substring(0, start) + formattedText + bodyText.substring(end);
        setBodyText(newText);

        // Place cursor between formatting characters
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + formatChar.length, start + formatChar.length);
        }, 0);
      }
    }
  };

  const handleBold = () => applyFormatting("*");
  const handleItalic = () => applyFormatting("_");
  const handleStrikethrough = () => applyFormatting("~");

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

  // Handle emoji selection from emoji-mart
  const handleEmojiSelect = (emoji: any) => {
    const textarea = bodyTextareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const emojiChar = emoji.native;
      const newText = bodyText.substring(0, start) + emojiChar + bodyText.substring(end);
      setBodyText(newText);
      setShowEmojiPicker(false);

      // Restore cursor position after emoji
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + emojiChar.length, start + emojiChar.length);
      }, 0);
    }
  };

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
          "english": "EN",
          "spanish": "ES",
          "french": "FR",
          "german": "DE",
          "portuguese": "PT",
          "italian": "IT"
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
          <Button className="gap-2 font-normal h-10 text-sm" onClick={() => setCreateTemplateOpen(true)} data-testid="button-create-template">
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
                  { id: "english", name: "English" },
                  { id: "spanish", name: "Spanish" },
                  { id: "french", name: "French" },
                  { id: "german", name: "German" },
                  { id: "portuguese", name: "Portuguese" },
                  { id: "italian", name: "Italian" },
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
              <div className="flex-1 flex items-center justify-center min-h-0">
                {/* Phone mockup */}
                <div className="h-full max-h-[80vh] aspect-[9/18] bg-black rounded-3xl p-3 shadow-lg flex flex-col overflow-hidden">
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
                  <div
                    className="flex-1 bg-[#ECE5DD] px-4 pt-4 pb-4 overflow-y-auto overflow-x-hidden flex flex-col space-y-3 scrollbar-hide"
                    style={{
                      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none'
                    }}
                  >
                    {/* Spacer to push message to bottom */}
                    <div className="flex-1 min-h-0"></div>
                    {/* Template message preview */}
                    <div className="flex justify-start flex-shrink-0">
                      <div className="bg-white rounded-2xl rounded-bl-none px-3 py-2 max-w-xs shadow-sm overflow-hidden" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
                        {/* Header */}
                        {headerText && (
                          <div className="mb-2">
                            <p className="text-sm font-semibold text-[#111B21] leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">
                              {headerText.split(/(\{\{[^}]+\}\})/).map((part, idx) => {
                                const variableMatch = part.match(/\{\{([^}]+)\}\}/);
                                if (variableMatch) {
                                  const variableKey = variableMatch[1];
                                  const value = variableSamples[variableKey];
                                  return (
                                    <span key={idx} className={value ? "text-[#111B21]" : "text-[#0084FF] font-medium"}>
                                      {value || part}
                                    </span>
                                  );
                                }
                                return <span key={idx}>{part}</span>;
                              })}
                            </p>
                          </div>
                        )}

                        {/* Body */}
                        {bodyText && (
                          <p className="text-sm text-[#111B21] leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">
                            {bodyText.split(/(\{\{[^}]+\}\})/).map((part, idx) => {
                              const variableMatch = part.match(/\{\{([^}]+)\}\}/);
                              if (variableMatch) {
                                const variableKey = variableMatch[1];
                                const value = variableSamples[variableKey];
                                return (
                                  <span key={idx} className={value ? "text-[#111B21]" : "text-[#0084FF] font-medium"}>
                                    {value || part}
                                  </span>
                                );
                              }
                              return <span key={idx}>{formatWhatsAppText(part)}</span>;
                            })}
                          </p>
                        )}

                        {/* Footer */}
                        {footerText && (
                          <div className="mt-2">
                            <p className="text-xs text-[#666666] leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">
                              {footerText}
                            </p>
                          </div>
                        )}

                        {/* Placeholder when no content */}
                        {!headerText && !bodyText && !footerText && (
                          <p className="text-sm text-[#999999] italic">
                            Start typing to see your template preview...
                          </p>
                        )}

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
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Template Dialog */}
      <Dialog open={createTemplateOpen} onOpenChange={handleCloseCreateTemplate}>
        <DialogContent className={
          templateCreationStep === "content" ? "max-w-4xl" : "max-w-3xl"
        } data-testid="dialog-create-template">
          {templateCreationStep === "choice" && (
            <>
              <DialogHeader className="mb-2">
                <DialogTitle>Create Template</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <Card className="cursor-pointer hover-elevate active-elevate-2 shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0" onClick={handleBlankTemplateClick} data-testid="card-blank-template">
                  <CardHeader className="text-center pb-2">
                    <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText size={24} className="text-primary" />
                    </div>
                    <CardTitle className="text-base">Use Blank Template</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground">Create your template from scratch. Once you finish creating your template, it must be submitted for review.</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover-elevate active-elevate-2 shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0" data-testid="card-template-library">
                  <CardHeader className="text-center pb-2">
                    <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <BookOpen size={24} className="text-blue-600" />
                    </div>
                    <CardTitle className="text-base">Browse our template library</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground">Get started faster with pre-written templates. Use a template as is and it will be available to send immediately.</p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {templateCreationStep === "category" && (
            <>
              <DialogHeader className="mb-2">
                <div className="flex items-center gap-3 mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToChoice}
                    className="font-normal p-1 h-8 w-8"
                  >
                    <ArrowLeft size={16} />
                  </Button>
                  <DialogTitle>Use Blank Template</DialogTitle>
                </div>
                <div className="space-y-3">
                  {/* 3-segment progress bar */}
                  <div className="flex gap-1">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={index}
                        className={`flex-1 h-2 rounded-full transition-colors ${
                          index < 1 ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Choose template category</h3>
                    <p className="text-sm text-muted-foreground">Select the category that best describes your message purpose. Each category has specific types and approval requirements.</p>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* Category Cards */}
                <div className="grid grid-cols-3 gap-4">
                  <Card
                    className={`cursor-pointer hover-elevate active-elevate-2 shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0 ${selectedCategory === "marketing" ? "ring-2 ring-primary" : ""}`}
                    onClick={() => handleCategorySelect("marketing")}
                    data-testid="card-category-marketing"
                  >
                    <CardHeader className="text-center pb-2">
                      <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                        <ShoppingCart size={24} className="text-orange-600" />
                      </div>
                      <CardTitle className="text-base">Marketing</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-sm text-muted-foreground">Send promotional content, product updates, and offers</p>
                    </CardContent>
                  </Card>

                  <Card
                    className={`cursor-pointer hover-elevate active-elevate-2 shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0 ${selectedCategory === "utility" ? "ring-2 ring-primary" : ""}`}
                    onClick={() => handleCategorySelect("utility")}
                    data-testid="card-category-utility"
                  >
                    <CardHeader className="text-center pb-2">
                      <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Bell size={24} className="text-blue-600" />
                      </div>
                      <CardTitle className="text-base">Utility</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-sm text-muted-foreground">Send account updates, alerts, and service notifications</p>
                    </CardContent>
                  </Card>

                  <Card
                    className={`cursor-pointer hover-elevate active-elevate-2 shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0 ${selectedCategory === "authentication" ? "ring-2 ring-primary" : ""}`}
                    onClick={() => handleCategorySelect("authentication")}
                    data-testid="card-category-authentication"
                  >
                    <CardHeader className="text-center pb-2">
                      <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                        <Shield size={24} className="text-green-600" />
                      </div>
                      <CardTitle className="text-base">Authentication</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-sm text-muted-foreground">Send OTP codes, login confirmations, and security alerts</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Category Guidelines Banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-base text-blue-800 mb-2">Category Guidelines:</h4>
                  <ul className="text-sm text-blue-800 space-y-1 list-disc pl-5">
                    <li><strong>Marketing:</strong> Requires opt-in from customers and has a 24-hour messaging window</li>
                    <li><strong>Utility:</strong> For transactional messages like confirmations, alerts, and updates</li>
                    <li><strong>Authentication:</strong> For security codes, login verifications, and account alerts</li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between pt-2">
                  <Button
                    variant="outline"
                    onClick={handleBackToChoice}
                    className="border-input [border-color:hsl(var(--input))] font-normal"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleNextFromCategory}
                    disabled={!selectedCategory}
                    className="gap-2 font-normal"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}

          {templateCreationStep === "form" && (
            <>
              <DialogHeader className="mb-2">
                <div className="flex items-center gap-3 mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToCategory}
                    className="font-normal p-1 h-8 w-8"
                  >
                    <ArrowLeft size={16} />
                  </Button>
                  <DialogTitle>Use Blank Template</DialogTitle>
                </div>
                <div className="space-y-3">
                  {/* 3-segment progress bar */}
                  <div className="flex gap-1">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={index}
                        className={`flex-1 h-2 rounded-full transition-colors ${
                          index < 2 ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Template Details</h3>
                    <p className="text-sm text-muted-foreground">Fill in the template information and type.</p>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* Template Form */}
                <div className="space-y-4">
                  {/* Template Name and Language - Side by Side */}
                  <div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Template Name */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Template Name<span className="text-red-500 pl-0.5">*</span>
                        </label>
                        <Input
                          id="template-name"
                          placeholder="my_template"
                          value={templateName}
                          onChange={(e) => {
                            // Auto-decapitalize and allow only lowercase, numbers, underscores
                            const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                            setTemplateName(value);
                          }}
                        />
                      </div>

                      {/* Language Selection */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Language<span className="text-red-500 pl-0.5">*</span>
                        </label>
                        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="spanish">Spanish</SelectItem>
                            <SelectItem value="french">French</SelectItem>
                            <SelectItem value="german">German</SelectItem>
                            <SelectItem value="portuguese">Portuguese</SelectItem>
                            <SelectItem value="italian">Italian</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    
                    </div>
                      {/* Template Name Guidelines */}
                      <p className="text-xs text-muted-foreground mt-1">
                        Lowercase letters, numbers and underscores only.
                      </p>
                  </div>

                  {/* Template Type */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">
                      Template Type<span className="text-red-500 pl-0.5">*</span>
                    </label>

                    {/* Template Type Cards */}
                    <div>
                      <div className="max-h-[calc(100vh-30rem)] overflow-y-auto space-y-2">
                      {selectedCategory === "utility" && (
                        <>
                          <div
                            onClick={() => setTemplateType("utility-default")}
                            className={`px-4 py-2 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                              templateType === "utility-default"
                                ? "border-primary bg-primary/10"
                                : "border-input"
                            }`}
                          >
                            <div>
                              <h4 className="font-semibold text-sm mb-1">Default</h4>
                              <p className="text-xs text-muted-foreground">Send messages with media and customized buttons to engage your customers.</p>
                            </div>
                          </div>

                          <div
                            onClick={() => setTemplateType("utility-appointment")}
                            className={`px-4 py-2 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                              templateType === "utility-appointment"
                                ? "border-primary bg-primary/10"
                                : "border-input"
                            }`}
                          >
                            <div>
                              <h4 className="font-semibold text-sm mb-1">Appointment Update</h4>
                              <p className="text-xs text-muted-foreground">Appointment confirmations and reminders.</p>
                            </div>
                          </div>

                          <div
                            onClick={() => setTemplateType("utility-issue")}
                            className={`px-4 py-2 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                              templateType === "utility-issue"
                                ? "border-primary bg-primary/10"
                                : "border-input"
                            }`}
                          >
                            <div>
                              <h4 className="font-semibold text-sm mb-1">Issue Resolution</h4>
                              <p className="text-xs text-muted-foreground">Support and issue updates.</p>
                            </div>
                          </div>

                          <div
                            onClick={() => setTemplateType("utility-payment")}
                            className={`px-4 py-2 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                              templateType === "utility-payment"
                                ? "border-primary bg-primary/10"
                                : "border-input"
                            }`}
                          >
                            <div>
                              <h4 className="font-semibold text-sm mb-1">Payment Update</h4>
                              <p className="text-xs text-muted-foreground">Payment confirmations and receipts.</p>
                            </div>
                          </div>

                          <div
                            onClick={() => setTemplateType("utility-shipping")}
                            className={`px-4 py-2 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                              templateType === "utility-shipping"
                                ? "border-primary bg-primary/10"
                                : "border-input"
                            }`}
                          >
                            <div>
                              <h4 className="font-semibold text-sm mb-1">Shipping Update</h4>
                              <p className="text-xs text-muted-foreground">Delivery and shipping notifications.</p>
                            </div>
                          </div>

                          <div
                            onClick={() => setTemplateType("utility-reservation")}
                            className={`px-4 py-2 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                              templateType === "utility-reservation"
                                ? "border-primary bg-primary/10"
                                : "border-input"
                            }`}
                          >
                            <div>
                              <h4 className="font-semibold text-sm mb-1">Reservation Update</h4>
                              <p className="text-xs text-muted-foreground">Booking confirmations and changes.</p>
                            </div>
                          </div>

                          <div
                            onClick={() => setTemplateType("utility-account")}
                            className={`px-4 py-2 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                              templateType === "utility-account"
                                ? "border-primary bg-primary/10"
                                : "border-input"
                            }`}
                          >
                            <div>
                              <h4 className="font-semibold text-sm mb-1">Account Update</h4>
                              <p className="text-xs text-muted-foreground">Account changes and notifications.</p>
                            </div>
                          </div>
                        </>
                      )}

                      {selectedCategory === "marketing" && (
                        <>
                          <div
                            onClick={() => setTemplateType("marketing-default")}
                            className={`px-4 py-2 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                              templateType === "marketing-default"
                                ? "border-primary bg-primary/10"
                                : "border-input"
                            }`}
                          >
                            <div>
                              <h4 className="font-semibold text-sm mb-1">Default</h4>
                              <p className="text-xs text-muted-foreground">Send messages with media and customized buttons to engage your customers.</p>
                            </div>
                          </div>

                          <div
                            onClick={() => setTemplateType("marketing-catalog")}
                            className={`px-4 py-2 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                              templateType === "marketing-catalog"
                                ? "border-primary bg-primary/10"
                                : "border-input"
                            }`}
                          >
                            <div>
                              <h4 className="font-semibold text-sm mb-1">Catalog</h4>
                              <p className="text-xs text-muted-foreground">Send messages that drive sales by connecting your product catalog.</p>
                            </div>
                          </div>

                          <div
                            onClick={() => setTemplateType("marketing-flows")}
                            className={`px-4 py-2 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                              templateType === "marketing-flows"
                                ? "border-primary bg-primary/10"
                                : "border-input"
                            }`}
                          >
                            <div>
                              <h4 className="font-semibold text-sm mb-1">Flows</h4>
                              <p className="text-xs text-muted-foreground">Send a form to capture customer interests, appointment requests, or run surveys.</p>
                            </div>
                          </div>

                          <div
                            onClick={() => setTemplateType("marketing-calling")}
                            className={`px-4 py-2 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                              templateType === "marketing-calling"
                                ? "border-primary bg-primary/10"
                                : "border-input"
                            }`}
                          >
                            <div>
                              <h4 className="font-semibold text-sm mb-1">Calling permissions request</h4>
                              <p className="text-xs text-muted-foreground">Ask customers if you can call them on WhatsApp.</p>
                            </div>
                          </div>
                        </>
                      )}

                      {selectedCategory === "authentication" && (
                        <>
                          <div
                            onClick={() => setTemplateType("auth-default")}
                            className={`px-4 py-2 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                              templateType === "auth-default"
                                ? "border-primary bg-primary/10"
                                : "border-input"
                            }`}
                          >
                            <div>
                              <h4 className="font-semibold text-sm mb-1">Default</h4>
                              <p className="text-xs text-muted-foreground">Send messages with media and customized buttons to engage your customers.</p>
                            </div>
                          </div>

                          <div
                            onClick={() => setTemplateType("auth-account")}
                            className={`px-4 py-2 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                              templateType === "auth-account"
                                ? "border-primary bg-primary/10"
                                : "border-input"
                            }`}
                          >
                            <div>
                              <h4 className="font-semibold text-sm mb-1">Account Update</h4>
                              <p className="text-xs text-muted-foreground">Security and account notifications.</p>
                            </div>
                          </div>

                          <div
                            onClick={() => setTemplateType("auth-alert")}
                            className={`px-4 py-2 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                              templateType === "auth-alert"
                                ? "border-primary bg-primary/10"
                                : "border-input"
                            }`}
                          >
                            <div>
                              <h4 className="font-semibold text-sm mb-1">Alert Update</h4>
                              <p className="text-xs text-muted-foreground">Security alerts and warnings.</p>
                            </div>
                          </div>
                        </>
                      )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between pt-2">
                  <Button
                    variant="outline"
                    onClick={handleBackToCategory}
                    className="border-input [border-color:hsl(var(--input))] font-normal"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleNextFromForm}
                    disabled={!templateName.trim() || !templateType.trim()}
                    className="gap-2 font-normal"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}

          {templateCreationStep === "content" && (
            <>
              <DialogHeader className="mb-2">
                <div className="flex items-center gap-3 mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToForm}
                    className="font-normal p-1 h-8 w-8"
                  >
                    <ArrowLeft size={16} />
                  </Button>
                  <DialogTitle>Use Blank Template</DialogTitle>
                </div>
                <div className="space-y-3">
                  {/* 3-segment progress bar */}
                  <div className="flex gap-1">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={index}
                        className={`flex-1 h-2 rounded-full transition-colors ${
                          index < 3 ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Template Content</h3>
                    <p className="text-sm text-muted-foreground">Create engaging content that connects with your customers and drives meaningful interactions.</p>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="flex gap-4">
                {/* Left: Template Form */}
                <div className="flex-1 max-h-[55vh] overflow-y-auto pr-2 -ml-1">
                  <div className="space-y-6 pl-1">
                    {/* Header */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium text-foreground">Header</label>
                          <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">Optional</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs gap-1"
                          onClick={() => setHeaderText(headerText + `{{${getNextVariableNumber()}}}`)}
                        >
                          <Plus size={12} />
                          Add variable
                        </Button>
                      </div>
                      <div className="relative">
                        <Input
                          placeholder="Add header text..."
                          value={headerText}
                          onChange={(e) => setHeaderText(e.target.value.slice(0, 60))}
                          className="pr-12 border border-input [border-color:hsl(var(--input))] hover-elevate"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                          {headerText.length}/60
                        </span>
                      </div>
                    </div>

                    {/* Media Sample */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-foreground">Media Sample</label>
                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">Optional</span>
                      </div>
                      <div className="flex gap-2">
                        <Select value={mediaSample} onValueChange={setMediaSample}>
                          <SelectTrigger className="w-[160px] border border-input [border-color:hsl(var(--input))] hover-elevate">
                            <SelectValue placeholder="Select media type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="image">Image</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="document">Document</SelectItem>
                            <SelectItem value="location">Location</SelectItem>
                          </SelectContent>
                        </Select>
                        {/* Browse Button - Show for browsable media types */}
                        {(mediaSample === "image" || mediaSample === "video" || mediaSample === "document") && (
                          <Button
                            className="font-normal"
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = mediaSample === 'image' ? 'image/*' :
                                            mediaSample === 'video' ? 'video/*' :
                                            mediaSample === 'document' ? '.pdf,.doc,.docx,.txt' : '*/*';
                              input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0];
                                if (file) {
                                  console.log('Selected file:', file.name);
                                  // Handle file upload here
                                }
                              };
                              input.click();
                            }}
                          >
                            Browse {mediaSample.charAt(0).toUpperCase() + mediaSample.slice(1)}
                          </Button>
                        )}
                        {/* Coordinates Input - Show for location */}
                        {mediaSample === "location" && (
                          <Input
                            placeholder="Enter latitude, longitude (e.g., 40.7128, -74.0060)"
                            className="border border-input [border-color:hsl(var(--input))] hover-elevate flex-1"
                          />
                        )}
                      </div>
                    </div>

                    {/* Body */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-foreground">
                          Body<span className="text-red-500 pl-0.5">*</span>
                        </label>
                        <div className="flex gap-1 items-center">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={handleBold}
                              >
                                <Bold size={14} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Bold</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={handleItalic}
                              >
                                <Italic size={14} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Italic</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={handleStrikethrough}
                              >
                                <Strikethrough size={14} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Strikethrough</TooltipContent>
                          </Tooltip>
                          <div className="relative">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                >
                                  <Smile size={14} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Add emoji</TooltipContent>
                            </Tooltip>
                            {showEmojiPicker && (
                              <div
                                ref={emojiPickerRef}
                                className="absolute top-8 right-0 z-50"
                              >
                                <Picker
                                  data={data}
                                  onEmojiSelect={handleEmojiSelect}
                                  theme="light"
                                  previewPosition="none"
                                  skinTonePosition="top"
                                  maxFrequentRows={1}
                                  perLine={8}
                                  set="native"
                                />
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs gap-1"
                            onClick={() => setBodyText(bodyText + `{{${getNextVariableNumber()}}}`)}
                          >
                            <Plus size={12} />
                            Add variable
                          </Button>
                        </div>
                      </div>
                      <div className="relative">
                        <textarea
                          ref={bodyTextareaRef}
                          placeholder="Add body text..."
                          value={bodyText}
                          onChange={(e) => setBodyText(e.target.value.slice(0, 1024))}
                          className="w-full min-h-[120px] p-3 pr-16 pb-8 border border-input [border-color:hsl(var(--input))] rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-[0.90rem] hover-elevate"
                        />
                        <span className="absolute bottom-4 right-2 text-xs text-muted-foreground">
                          {bodyText.length}/1024
                        </span>
                      </div>
                    </div>

                    {/* Variable Samples */}
                    {getAllVariables().length > 0 && (
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-1">
                            Variable Samples<span className="text-red-500 pl-0.5">*</span>
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            Include samples of all variables in your message to help Meta review your template.
                            Remember not to include any customer information to protect your customer's privacy.
                          </p>
                        </div>
                        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 items-center">
                          {getAllVariables().map((variable) => {
                            // Extract the content inside the braces (could be number or text)
                            const variableKey = variable.match(/\{\{([^}]+)\}\}/)?.[1] || "";
                            return (
                              <>
                                <div key={`${variable}-label`} className="font-medium text-sm">{variable}</div>
                                <Input
                                  key={`${variable}-input`}
                                  placeholder={`Sample text for ${variable}`}
                                  value={variableSamples[variableKey] || ""}
                                  onChange={(e) => setVariableSamples({...variableSamples, [variableKey]: e.target.value})}
                                  className="border border-input [border-color:hsl(var(--input))] hover-elevate"
                                />
                              </>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-foreground">Footer</label>
                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">Optional</span>
                      </div>
                      <div className="relative">
                        <Input
                          placeholder="Add footer text..."
                          value={footerText}
                          onChange={(e) => setFooterText(e.target.value.slice(0, 60))}
                          className="pr-12 border border-input [border-color:hsl(var(--input))] hover-elevate"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                          {footerText.length}/60
                        </span>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-foreground">Buttons</label>
                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">Optional</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Add up to 10 buttons for customer actions or responses. More than 3 buttons will appear in a list.
                      </p>
                      <Select onValueChange={(value) => {
                        if (value) {
                          // Add button to list instead of selecting
                          setTemplateButtons([...templateButtons, { id: Date.now(), type: value }]);
                        }
                      }} value="">
                        <SelectTrigger className="border border-input [border-color:hsl(var(--input))] hover-elevate">
                          <SelectValue placeholder="Add button" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="quick-reply">
                            <div>
                              <div className="font-medium">Quick reply</div>
                              <div className="text-xs text-muted-foreground">Simple response buttons for customer replies</div>
                            </div>
                          </SelectItem>
                          <SelectItem value="visit-website">
                            <div>
                              <div className="font-medium">Visit website</div>
                              <div className="text-xs text-muted-foreground">Direct customers to your website or URL</div>
                            </div>
                          </SelectItem>
                          <SelectItem value="call-whatsapp">
                            <div>
                              <div className="font-medium">Call on WhatsApp</div>
                              <div className="text-xs text-muted-foreground">Enable voice calls through WhatsApp</div>
                            </div>
                          </SelectItem>
                          <SelectItem value="call-phone">
                            <div>
                              <div className="font-medium">Call phone number</div>
                              <div className="text-xs text-muted-foreground">Direct customers to call a phone number</div>
                            </div>
                          </SelectItem>
                          <SelectItem value="complete-flow">
                            <div>
                              <div className="font-medium">Complete Flow</div>
                              <div className="text-xs text-muted-foreground">Trigger a WhatsApp Flow for interactive experiences</div>
                            </div>
                          </SelectItem>
                          <SelectItem value="copy-offer">
                            <div>
                              <div className="font-medium">Copy offer code</div>
                              <div className="text-xs text-muted-foreground">Allow customers to copy promotional codes</div>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Added Buttons List */}
                      {templateButtons.length > 0 && (
                        <div className="space-y-4 mt-4">
                          {templateButtons.map((button) => {
                            const buttonLabels: Record<string, { label: string; description: string }> = {
                              "quick-reply": { label: "Quick reply", description: "Simple response buttons for customer replies" },
                              "visit-website": { label: "Visit website", description: "Direct customers to your website or URL" },
                              "call-whatsapp": { label: "Call on WhatsApp", description: "Enable voice calls through WhatsApp" },
                              "call-phone": { label: "Call phone number", description: "Direct customers to call a phone number" },
                              "complete-flow": { label: "Complete Flow", description: "Trigger a WhatsApp Flow for interactive experiences" },
                              "copy-offer": { label: "Copy offer code", description: "Allow customers to copy promotional codes" }
                            };
                            const buttonInfo = buttonLabels[button.type];
                            return (
                              <div
                                key={button.id}
                                className="border border-input rounded-lg bg-muted/30 overflow-hidden"
                                draggable
                                onDragStart={() => handleButtonDragStart(button.id)}
                                onDragOver={handleButtonDragOver}
                                onDrop={() => handleButtonDrop(button.id)}
                              >
                                {/* Button Header */}
                                <div className="flex gap-2 items-center p-3 border-b border-input">
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">{buttonInfo?.label}</p>
                                    <p className="text-xs text-muted-foreground">{buttonInfo?.description}</p>
                                  </div>
                                  <button onClick={() => setTemplateButtons(templateButtons.filter(b => b.id !== button.id))} className="p-2 hover:bg-muted rounded"><Trash2 size={14} /></button>
                                  <GripVertical size={14} className="text-muted-foreground cursor-grab" />
                                </div>

                                {/* Button Configuration */}
                                <div className="p-4 space-y-3">
                                  {/* Quick Reply */}
                                  {button.type === "quick-reply" && (
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-foreground">Button Text</label>
                                      <div className="relative">
                                        <Input
                                          placeholder="Enter button text..."
                                          value={button.buttonText || ""}
                                          onChange={(e) => updateButtonConfig(button.id, "buttonText", e.target.value.slice(0, 25))}
                                          className="pr-12 border border-input [border-color:hsl(var(--input))] hover-elevate"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                          {(button.buttonText || "").length}/25
                                        </span>
                                      </div>
                                    </div>
                                  )}

                                  {/* Visit Website */}
                                  {button.type === "visit-website" && (
                                    <div className="space-y-3">
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Button Text</label>
                                        <div className="relative">
                                          <Input
                                            placeholder="Enter button text..."
                                            value={button.buttonText || ""}
                                            onChange={(e) => updateButtonConfig(button.id, "buttonText", e.target.value.slice(0, 25))}
                                            className="pr-12 border border-input [border-color:hsl(var(--input))] hover-elevate"
                                          />
                                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                            {(button.buttonText || "").length}/25
                                          </span>
                                        </div>
                                      </div>
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">URL Type</label>
                                        <Select value={button.urlType || ""} onValueChange={(value) => updateButtonConfig(button.id, "urlType", value)}>
                                          <SelectTrigger className="border border-input [border-color:hsl(var(--input))] hover-elevate">
                                            <SelectValue placeholder="Select URL type" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="static">Static</SelectItem>
                                            <SelectItem value="dynamic">Dynamic</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Website URL</label>
                                        <div className="relative">
                                          <Input
                                            placeholder="Enter website URL..."
                                            value={button.websiteUrl || ""}
                                            onChange={(e) => updateButtonConfig(button.id, "websiteUrl", e.target.value.slice(0, 2000))}
                                            className="pr-12 border border-input [border-color:hsl(var(--input))] hover-elevate"
                                          />
                                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                            {(button.websiteUrl || "").length}/2000
                                          </span>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Checkbox
                                          id={`track-conversion-${button.id}`}
                                          checked={button.trackAppConversion || false}
                                          onCheckedChange={(checked) => updateButtonConfig(button.id, "trackAppConversion", checked)}
                                        />
                                        <label htmlFor={`track-conversion-${button.id}`} className="text-sm font-medium text-foreground cursor-pointer">
                                          Track app conversion (Marketing Messages Lite API only)
                                        </label>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Checkbox
                                          id={`enable-meta-${button.id}`}
                                          checked={button.enableMetaTracking || false}
                                          onCheckedChange={(checked) => updateButtonConfig(button.id, "enableMetaTracking", checked)}
                                        />
                                        <label htmlFor={`enable-meta-${button.id}`} className="text-sm font-medium text-foreground cursor-pointer">
                                          Enable Meta to track and report website clicks
                                        </label>
                                      </div>
                                    </div>
                                  )}

                                  {/* Call on WhatsApp */}
                                  {button.type === "call-whatsapp" && (
                                    <div className="space-y-3">
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Button Text</label>
                                        <div className="relative">
                                          <Input
                                            placeholder="Enter button text..."
                                            value={button.buttonText || ""}
                                            onChange={(e) => updateButtonConfig(button.id, "buttonText", e.target.value.slice(0, 25))}
                                            className="pr-12 border border-input [border-color:hsl(var(--input))] hover-elevate"
                                          />
                                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                            {(button.buttonText || "").length}/25
                                          </span>
                                        </div>
                                      </div>
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Active for</label>
                                        <Select value={button.activeFor || ""} onValueChange={(value) => updateButtonConfig(button.id, "activeFor", value)}>
                                          <SelectTrigger className="border border-input [border-color:hsl(var(--input))] hover-elevate">
                                            <SelectValue placeholder="Select duration" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                                              <SelectItem key={day} value={`${day}`}>
                                                {day} day{day > 1 ? "s" : ""}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                  )}

                                  {/* Call Phone Number */}
                                  {button.type === "call-phone" && (
                                    <div className="space-y-3">
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Button Text</label>
                                        <div className="relative">
                                          <Input
                                            placeholder="Enter button text..."
                                            value={button.buttonText || ""}
                                            onChange={(e) => updateButtonConfig(button.id, "buttonText", e.target.value.slice(0, 25))}
                                            className="pr-12 border border-input [border-color:hsl(var(--input))] hover-elevate"
                                          />
                                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                            {(button.buttonText || "").length}/25
                                          </span>
                                        </div>
                                      </div>
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Country</label>
                                        <Select value={button.country || ""} onValueChange={(value) => updateButtonConfig(button.id, "country", value)}>
                                          <SelectTrigger className="border border-input [border-color:hsl(var(--input))] hover-elevate">
                                            <SelectValue placeholder="Select country" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="+1">+1 (US/Canada)</SelectItem>
                                            <SelectItem value="+44">+44 (UK)</SelectItem>
                                            <SelectItem value="+33">+33 (France)</SelectItem>
                                            <SelectItem value="+49">+49 (Germany)</SelectItem>
                                            <SelectItem value="+39">+39 (Italy)</SelectItem>
                                            <SelectItem value="+34">+34 (Spain)</SelectItem>
                                            <SelectItem value="+91">+91 (India)</SelectItem>
                                            <SelectItem value="+86">+86 (China)</SelectItem>
                                            <SelectItem value="+81">+81 (Japan)</SelectItem>
                                            <SelectItem value="+55">+55 (Brazil)</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Phone number</label>
                                        <div className="relative">
                                          <Input
                                            placeholder="Enter phone number..."
                                            value={button.phoneNumber || ""}
                                            onChange={(e) => {
                                              const numbersOnly = e.target.value.replace(/[^0-9]/g, "").slice(0, 20);
                                              updateButtonConfig(button.id, "phoneNumber", numbersOnly);
                                            }}
                                            className="pr-12 border border-input [border-color:hsl(var(--input))] hover-elevate"
                                          />
                                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                            {(button.phoneNumber || "").length}/20
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Complete Flow */}
                                  {button.type === "complete-flow" && (
                                    <div className="space-y-3">
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Button Text</label>
                                        <div className="relative">
                                          <Input
                                            placeholder="Enter button text..."
                                            value={button.buttonText || ""}
                                            onChange={(e) => updateButtonConfig(button.id, "buttonText", e.target.value.slice(0, 25))}
                                            className="pr-12 border border-input [border-color:hsl(var(--input))] hover-elevate"
                                          />
                                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                            {(button.buttonText || "").length}/25
                                          </span>
                                        </div>
                                      </div>
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Button</label>
                                        <Select value={button.flowButton || ""} onValueChange={(value) => updateButtonConfig(button.id, "flowButton", value)}>
                                          <SelectTrigger className="border border-input [border-color:hsl(var(--input))] hover-elevate">
                                            <SelectValue placeholder="Select button type" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="default">Default</SelectItem>
                                            <SelectItem value="document">Document</SelectItem>
                                            <SelectItem value="promotion">Promotion</SelectItem>
                                            <SelectItem value="review">Review</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Flow</label>
                                        <Select value={button.flowId || ""} onValueChange={(value) => updateButtonConfig(button.id, "flowId", value)}>
                                          <SelectTrigger className="border border-input [border-color:hsl(var(--input))] hover-elevate">
                                            <SelectValue placeholder="Select flow" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="product-inquiry">
                                              <div>
                                                <div className="font-medium">Product Inquiry Form</div>
                                                <div className="text-xs text-muted-foreground">Collect customers product inquires</div>
                                              </div>
                                            </SelectItem>
                                            <SelectItem value="support-request">
                                              <div>
                                                <div className="font-medium">Support Request</div>
                                                <div className="text-xs text-muted-foreground">Handle customer support requests</div>
                                              </div>
                                            </SelectItem>
                                            <SelectItem value="promotional-survey">
                                              <div>
                                                <div className="font-medium">Promotional Survey</div>
                                                <div className="text-xs text-muted-foreground">Gather feedback on promotions</div>
                                              </div>
                                            </SelectItem>
                                            <SelectItem value="review-collection">
                                              <div>
                                                <div className="font-medium">Review Collection</div>
                                                <div className="text-xs text-muted-foreground">Collect customer reviews</div>
                                              </div>
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                  )}

                                  {/* Copy Offer */}
                                  {button.type === "copy-offer" && (
                                    <div className="space-y-3">
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Button Text</label>
                                        <div className="relative">
                                          <Input
                                            placeholder="Enter button text..."
                                            value={button.buttonText || ""}
                                            onChange={(e) => updateButtonConfig(button.id, "buttonText", e.target.value.slice(0, 25))}
                                            className="pr-12 border border-input [border-color:hsl(var(--input))] hover-elevate"
                                          />
                                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                            {(button.buttonText || "").length}/25
                                          </span>
                                        </div>
                                      </div>
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Offer code</label>
                                        <div className="relative">
                                          <Input
                                            placeholder="Enter offer code..."
                                            value={button.offerCode || ""}
                                            onChange={(e) => updateButtonConfig(button.id, "offerCode", e.target.value.slice(0, 15))}
                                            className="pr-12 border border-input [border-color:hsl(var(--input))] hover-elevate"
                                          />
                                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                            {(button.offerCode || "").length}/15
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Template Preview */}
                <div className="max-h-[55vh] flex-shrink-0 w-[27.5vh]">
                  <div className="flex flex-col h-full">
                    <label className="text-sm font-medium mb-3 block flex-shrink-0 mt-1">Template Preview</label>
                    <div className="flex-1 flex items-center justify-center min-h-0">
                      {/* Phone mockup */}
                      <div className="h-full aspect-[9/18] bg-black rounded-3xl p-3 shadow-lg flex flex-col overflow-hidden">
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
                        <div
                          className="flex-1 bg-[#ECE5DD] px-4 pt-4 pb-4 overflow-y-auto overflow-x-hidden flex flex-col space-y-3 scrollbar-hide"
                          style={{
                            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none'
                          }}
                        >
                          {/* Spacer to push message to bottom */}
                          <div className="flex-1 min-h-0"></div>
                          {/* Template message preview */}
                          <div className="flex justify-start flex-shrink-0">
                            <div className="bg-white rounded-2xl rounded-bl-none px-3 py-2 max-w-xs shadow-sm overflow-hidden" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
                              {/* Header */}
                              {headerText && (
                                <div className="mb-2">
                                  <p className="text-sm font-semibold text-[#111B21] leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">
                                    {headerText.split(/(\{\{[^}]+\}\})/).map((part, idx) => {
                                      const variableMatch = part.match(/\{\{([^}]+)\}\}/);
                                      if (variableMatch) {
                                        const variableKey = variableMatch[1];
                                        const value = variableSamples[variableKey];
                                        return (
                                          <span key={idx} className={value ? "text-[#111B21]" : "text-[#0084FF] font-medium"}>
                                            {value || part}
                                          </span>
                                        );
                                      }
                                      return <span key={idx}>{part}</span>;
                                    })}
                                  </p>
                                </div>
                              )}

                              {/* Body */}
                              {bodyText && (
                                <p className="text-sm text-[#111B21] leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">
                                  {bodyText.split(/(\{\{[^}]+\}\})/).map((part, idx) => {
                                    const variableMatch = part.match(/\{\{([^}]+)\}\}/);
                                    if (variableMatch) {
                                      const variableKey = variableMatch[1];
                                      const value = variableSamples[variableKey];
                                      return (
                                        <span key={idx} className={value ? "text-[#111B21]" : "text-[#0084FF] font-medium"}>
                                          {value || part}
                                        </span>
                                      );
                                    }
                                    return <span key={idx}>{formatWhatsAppText(part)}</span>;
                                  })}
                                </p>
                              )}

                              {/* Footer */}
                              {footerText && (
                                <div className="mt-2">
                                  <p className="text-xs text-[#666666] leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">
                                    {footerText}
                                  </p>
                                </div>
                              )}

                              {/* Placeholder when no content */}
                              {!headerText && !bodyText && !footerText && (
                                <p className="text-sm text-[#999999] italic">
                                  Start typing to see your template preview...
                                </p>
                              )}

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
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handleBackToForm}
                  className="border-input [border-color:hsl(var(--input))] font-normal"
                >
                  Back
                </Button>
                <Button
                  className="gap-2 font-normal"
                  disabled={!isTemplateFormValid()}
                >
                  Create Template
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
