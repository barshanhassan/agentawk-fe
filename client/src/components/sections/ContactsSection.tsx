import { useState, useRef, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Trash2, Edit2, Copy, Calendar, X, Download } from "react-feather";
import { ChevronsUpDown, ChevronDown, ChevronUp, Plus, Filter, ArrowUpDown, GripVertical, MoreVertical } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import CustomDropdown from "@/components/CustomDropdown";

type SortDirection = "asc" | "desc" | "default";

interface SortState {
  column: string | null;
  direction: SortDirection;
}

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

interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  tags: string[];
  createdAt: string;
  lastActive: string;
  updatedBy: string;
}

const initialContacts: Contact[] = [
  {
    id: "C001",
    name: "Alice Johnson",
    phoneNumber: "+1-555-0101",
    tags: ["VIP", "Active"],
    createdAt: "2024-10-15",
    lastActive: "2024-10-30",
    updatedBy: "John Smith",
  },
  {
    id: "C002",
    name: "Bob Smith",
    phoneNumber: "+1-555-0102",
    tags: ["Inactive"],
    createdAt: "2024-09-20",
    lastActive: "2024-10-25",
    updatedBy: "Sarah Johnson",
  },
  {
    id: "C003",
    name: "Carol White",
    phoneNumber: "+1-555-0103",
    tags: ["VIP"],
    createdAt: "2024-08-10",
    lastActive: "2024-10-28",
    updatedBy: "Mike Davis",
  },
];

export default function ContactsSection() {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const currentUserName = "Admin User"; // TODO: Get from auth context
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sorts, setSorts] = useState<SortEntry[]>([]);
  const [filters, setFilters] = useState<FilterEntry[]>([]);
  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [createdAtRange, setCreatedAtRange] = useState<DateRange | undefined>(undefined);
  const [lastActiveRange, setLastActiveRange] = useState<DateRange | undefined>(undefined);
  const [createdAtOpen, setCreatedAtOpen] = useState(false);
  const [lastActiveOpen, setLastActiveOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const [rowsDropdownOpen, setRowsDropdownOpen] = useState(false);

  // Add Contact Modal State
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [newContactTags, setNewContactTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState("");

  // Edit Contact Modal State
  const [showEditContactModal, setShowEditContactModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editContactName, setEditContactName] = useState("");
  const [editContactPhone, setEditContactPhone] = useState("");
  const [editContactTags, setEditContactTags] = useState<string[]>([]);
  const [editTagInput, setEditTagInput] = useState("");

  // Delete Contact Modal State
  const [showDeleteContactModal, setShowDeleteContactModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  // Bulk Edit Modal State
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);
  const [bulkEditTags, setBulkEditTags] = useState<string[]>([]);
  const [bulkTagInput, setBulkTagInput] = useState("");

  // Bulk Delete Modal State
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);



  const allTags = Array.from(new Set(contacts.flatMap((c: Contact) => c.tags)));

  const [draggedSortId, setDraggedSortId] = useState<string | null>(null);
  const [openSortColumnDropdown, setOpenSortColumnDropdown] = useState<string | null>(null);
  const [openSortDirectionDropdown, setOpenSortDirectionDropdown] = useState<string | null>(null);
  const [draggedFilterId, setDraggedFilterId] = useState<string | null>(null);
  const [openFilterColumnDropdown, setOpenFilterColumnDropdown] = useState<string | null>(null);
  const [openFilterOperatorDropdown, setOpenFilterOperatorDropdown] = useState<string | null>(null);

  const addSort = () => {
    const availableColumns = ["name", "phoneNumber", "createdAt", "lastActive", "updatedBy"];
    const usedColumns = sorts.map(s => s.column);
    const nextColumn = availableColumns.find(col => !usedColumns.includes(col)) || "name";
    setSorts([...sorts, { id: Date.now().toString(), column: nextColumn, direction: "asc" }]);
  };

  const removeSort = (id: string) => {
    setSorts(sorts.filter(s => s.id !== id));
  };

  const updateSort = (id: string, column: string, direction: "asc" | "desc") => {
    // Check if this column is already used by another sort entry
    if (sorts.some(s => s.id !== id && s.column === column)) {
      return; // Don't allow duplicate columns
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



  const addFilter = () => {
    setFilters([...filters, { id: Date.now().toString(), column: "name", operator: "contains", value: "" }]);
  };

  const removeFilter = (id: string) => {
    setFilters(filters.filter(f => f.id !== id));
  };

  const updateFilter = (id: string, column: string, operator: string, value: string) => {
    setFilters(filters.map(f => f.id === id ? { ...f, column, operator, value } : f));
  };

  const getFilteredAndSortedData = () => {
    let data = [...contacts];

    // Apply search
    if (search) {
      data = data.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.phoneNumber.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      data = data.filter(item => selectedTags.some(tag => item.tags.includes(tag)));
    }

    // Apply date range filters
    if (createdAtRange?.from || createdAtRange?.to) {
      data = data.filter(item => {
        const itemDate = new Date(item.createdAt);
        if (createdAtRange.from && itemDate < createdAtRange.from) return false;
        if (createdAtRange.to) {
          const endDate = new Date(createdAtRange.to);
          endDate.setHours(23, 59, 59, 999);
          if (itemDate > endDate) return false;
        }
        return true;
      });
    }

    if (lastActiveRange?.from || lastActiveRange?.to) {
      data = data.filter(item => {
        const itemDate = new Date(item.lastActive);
        if (lastActiveRange.from && itemDate < lastActiveRange.from) return false;
        if (lastActiveRange.to) {
          const endDate = new Date(lastActiveRange.to);
          endDate.setHours(23, 59, 59, 999);
          if (itemDate > endDate) return false;
        }
        return true;
      });
    }

    // Apply custom filters
    data = data.filter(item => {
      return filters.every(filter => {
        const itemValue = item[filter.column as keyof Contact];
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
      data.sort((a, b) => {
        for (const sort of sorts) {
          const aVal = a[sort.column as keyof Contact];
          const bVal = b[sort.column as keyof Contact];

          let comparison = 0;
          if (typeof aVal === "string" && typeof bVal === "string") {
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

  const toggleRowSelection = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const toggleAllRows = () => {
    const data = getFilteredAndSortedData();
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(data.map(c => c.id)));
    }
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setEditContactName(contact.name);
    setEditContactPhone(contact.phoneNumber);
    setEditContactTags([...contact.tags]);
    setEditTagInput("");
    setShowEditContactModal(true);
  };

  const handleCopyContact = (contact: Contact) => {
    const contactText = `${contact.name} - ${contact.phoneNumber}`;
    navigator.clipboard.writeText(contactText);
    toast({
      title: "Copied to clipboard",
      description: contactText,
    });
  };

  const handleDeleteContact = (contact: Contact) => {
    setContactToDelete(contact);
    setShowDeleteContactModal(true);
  };

  const handleConfirmDelete = () => {
    if (contactToDelete) {
      setContacts(contacts.filter(c => c.id !== contactToDelete.id));
      toast({
        title: "Contact Deleted",
        description: `${contactToDelete.name} has been deleted`,
      });
      setShowDeleteContactModal(false);
      setContactToDelete(null);
    }
  };

  const handleOpenBulkEdit = () => {
    setBulkEditTags([]);
    setBulkTagInput("");
    setShowBulkEditModal(true);
  };

  const handleAddBulkTag = () => {
    if (bulkTagInput.trim() && !bulkEditTags.includes(bulkTagInput.trim())) {
      setBulkEditTags([...bulkEditTags, bulkTagInput.trim()]);
      setBulkTagInput("");
    }
  };

  const handleRemoveBulkTag = (tag: string) => {
    setBulkEditTags(bulkEditTags.filter(t => t !== tag));
  };

  const handleToggleBulkTag = (tag: string) => {
    if (bulkEditTags.includes(tag)) {
      setBulkEditTags(bulkEditTags.filter(t => t !== tag));
    } else {
      setBulkEditTags([...bulkEditTags, tag]);
    }
  };

  const handleSaveBulkEdit = () => {
    const selectedContactIds = Array.from(selectedRows);
    setContacts(contacts.map(contact => {
      if (selectedContactIds.includes(contact.id)) {
        return {
          ...contact,
          tags: bulkEditTags,
        };
      }
      return contact;
    }));
    toast({
      title: "Contacts Updated",
      description: `Tags updated for ${selectedContactIds.length} contact(s)`,
    });
    setShowBulkEditModal(false);
    setSelectedRows(new Set());
  };

  const handleOpenBulkDelete = () => {
    setShowBulkDeleteModal(true);
  };

  const handleConfirmBulkDelete = () => {
    const selectedContactIds = Array.from(selectedRows);
    setContacts(contacts.filter(c => !selectedContactIds.includes(c.id)));
    toast({
      title: "Contacts Deleted",
      description: `${selectedContactIds.length} contact(s) have been deleted`,
    });
    setShowBulkDeleteModal(false);
    setSelectedRows(new Set());
  };

  const handleAddTag = () => {
    if (newTagInput.trim() && !newContactTags.includes(newTagInput.trim())) {
      setNewContactTags([...newContactTags, newTagInput.trim()]);
      setNewTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setNewContactTags(newContactTags.filter(t => t !== tag));
  };

  const handleToggleTag = (tag: string) => {
    if (newContactTags.includes(tag)) {
      handleRemoveTag(tag);
    } else {
      setNewContactTags([...newContactTags, tag]);
    }
  };

  const handleAddEditTag = () => {
    if (editTagInput.trim() && !editContactTags.includes(editTagInput.trim())) {
      setEditContactTags([...editContactTags, editTagInput.trim()]);
      setEditTagInput("");
    }
  };

  const handleRemoveEditTag = (tag: string) => {
    setEditContactTags(editContactTags.filter(t => t !== tag));
  };

  const handleToggleEditTag = (tag: string) => {
    if (editContactTags.includes(tag)) {
      handleRemoveEditTag(tag);
    } else {
      setEditContactTags([...editContactTags, tag]);
    }
  };

  const handleSaveContact = () => {
    if (!newContactName.trim() || !newContactPhone.trim()) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    const newContact: Contact = {
      id: `C${String(contacts.length + 1).padStart(3, "0")}`,
      name: newContactName,
      phoneNumber: newContactPhone,
      tags: newContactTags,
      createdAt: new Date().toISOString().split("T")[0],
      lastActive: new Date().toISOString().split("T")[0],
      updatedBy: currentUserName,
    };
    setContacts([...contacts, newContact]);
    toast({
      title: "Contact Created",
      description: `${newContactName} has been added successfully`,
    });
    // Reset form
    setNewContactName("");
    setNewContactPhone("");
    setNewContactTags([]);
    setNewTagInput("");
    setShowAddContactModal(false);
  };

  const handleSaveEditContact = () => {
    if (!editContactName.trim() || !editContactPhone.trim()) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    if (editingContact) {
      setContacts(
        contacts.map(c =>
          c.id === editingContact.id
            ? {
                ...c,
                name: editContactName,
                phoneNumber: editContactPhone,
                tags: editContactTags,
                updatedBy: currentUserName,
              }
            : c
        )
      );
      toast({
        title: "Contact Updated",
        description: `${editContactName} has been updated successfully`,
      });
      setShowEditContactModal(false);
      setEditingContact(null);
      setEditContactName("");
      setEditContactPhone("");
      setEditContactTags([]);
      setEditTagInput("");
    }
  };

  const handleExportSelectedAsCSV = () => {
    if (selectedRows.size === 0) {
      toast({
        title: "No Contacts Selected",
        description: "Please select at least one contact to export",
        variant: "destructive",
      });
      return;
    }

    const selectedContacts = contacts.filter(c => selectedRows.has(c.id));

    // Helper function to escape CSV values
    const escapeCSV = (value: string) => {
      if (value.includes(",") || value.includes('"') || value.includes("\n")) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    // CSV headers
    const headers = ["ID", "Name", "Phone Number", "Tags", "Created At", "Last Active", "Updated By"];

    // CSV rows
    const rows = selectedContacts.map(contact => [
      escapeCSV(contact.id),
      escapeCSV(contact.name),
      escapeCSV(contact.phoneNumber.replace(/^\+/, "")), // Remove + prefix
      escapeCSV(contact.tags.join(", ")),
      escapeCSV(contact.createdAt),
      escapeCSV(contact.lastActive),
      escapeCSV(contact.updatedBy),
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(",")),
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `contacts_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: `${selectedContacts.length} contact(s) exported as CSV`,
    });
  };

  const handleColumnSort = (column: string) => {
    const existingSort = sorts.find(s => s.column === column);
    if (existingSort) {
      if (existingSort.direction === "asc") {
        updateSort(existingSort.id, column, "desc");
      } else {
        removeSort(existingSort.id);
      }
    } else {
      addSort();
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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setRowsDropdownOpen(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setShowSort(false);
      }
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setShowFilter(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Section - Outside Card */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Contacts</h2>
        <Button
          onClick={() => setShowAddContactModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white gap-2 h-9 font-normal"
        >
          <Plus size={16} />
          Add Contact
        </Button>
      </div>

      {/* Search and Filters Section - Outside Card */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs" style={{ height: "38px" }}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search names..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 text-sm w-full h-full border border-input rounded-md bg-background focus:outline-none transition-colors"
          />
        </div>

        {/* Tags Dropdown */}
        <CustomDropdown
          options={allTags.map(tag => ({ id: tag, name: tag }))}
          selected={selectedTags}
          onChange={setSelectedTags}
          placeholder="Tags"
          width="130px"
        />

        {/* Created At Calendar */}
        <Popover open={createdAtOpen} onOpenChange={setCreatedAtOpen}>
          <PopoverTrigger asChild>
            <button className="px-3 py-2 text-sm border border-input rounded-md hover:bg-accent focus:outline-none  flex items-center gap-2 transition-colors">
              <Calendar size={14} />
              <span>
                {createdAtRange?.from && createdAtRange?.to
                  ? `Created At: ${createdAtRange.from.toLocaleDateString()} - ${createdAtRange.to.toLocaleDateString()}`
                  : createdAtRange?.from
                  ? `Created At: ${createdAtRange.from.toLocaleDateString()}`
                  : "Created At"}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              initialFocus
              mode="range"
              defaultMonth={createdAtRange?.from}
              selected={createdAtRange}
              onSelect={(range) => {
                // If both from and to are the same date, clear the range
                if (
                  range?.from &&
                  range?.to &&
                  range.from.toDateString() === range.to.toDateString()
                ) {
                  setCreatedAtRange(undefined);
                } else {
                  setCreatedAtRange(range);
                }
              }}
              numberOfMonths={1}
            />
          </PopoverContent>
        </Popover>

        {/* Last Active Calendar */}
        <Popover open={lastActiveOpen} onOpenChange={setLastActiveOpen}>
          <PopoverTrigger asChild>
            <button className="px-3 py-2 text-sm border border-input rounded-md hover:bg-accent focus:outline-none  flex items-center gap-2 transition-colors">
              <Calendar size={14} />
              <span>
                {lastActiveRange?.from && lastActiveRange?.to
                  ? `Last Active: ${lastActiveRange.from.toLocaleDateString()} - ${lastActiveRange.to.toLocaleDateString()}`
                  : lastActiveRange?.from
                  ? `Last Active: ${lastActiveRange.from.toLocaleDateString()}`
                  : "Last Active"}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              initialFocus
              mode="range"
              defaultMonth={lastActiveRange?.from}
              selected={lastActiveRange}
              onSelect={(range) => {
                // If both from and to are the same date, clear the range
                if (
                  range?.from &&
                  range?.to &&
                  range.from.toDateString() === range.to.toDateString()
                ) {
                  setLastActiveRange(undefined);
                } else {
                  setLastActiveRange(range);
                }
              }}
              numberOfMonths={1}
            />
          </PopoverContent>
        </Popover>

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
                            <span className="truncate text-sm font-normal">{sort.column === "name" ? "Name" : sort.column === "phoneNumber" ? "Phone Number" : sort.column === "createdAt" ? "Created At" : sort.column === "lastActive" ? "Last Active" : "Updated by"}</span>
                            <ChevronDown className="h-3 w-3 ml-2 text-muted-foreground" />
                          </button>
                          {openSortColumnDropdown === sort.id && (
                            <div className="absolute z-10 w-full mt-2 bg-white rounded-md shadow-md border border-border">
                              <ul className="py-1">
                                {["name", "phoneNumber", "createdAt", "lastActive", "updatedBy"].map(option => {
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
                                      {option === "name" ? "Name" : option === "phoneNumber" ? "Phone Number" : option === "createdAt" ? "Created At" : option === "lastActive" ? "Last Active" : "Updated by"}
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
                        disabled={sorts.length >= 5}
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
                            <span className="truncate text-sm font-normal">{filter.column === "name" ? "Name" : filter.column === "phoneNumber" ? "Phone Number" : filter.column === "createdAt" ? "Created At" : filter.column === "lastActive" ? "Last Active" : "Updated by"}</span>
                            <ChevronDown className="h-3 w-3 ml-2 text-muted-foreground" />
                          </button>
                          {openFilterColumnDropdown === filter.id && (
                            <div className="absolute z-10 w-full mt-2 bg-white rounded-md shadow-md border border-border">
                              <ul className="py-1">
                                {["name", "phoneNumber", "createdAt", "lastActive", "updatedBy"].map(option => {
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
                                      {option === "name" ? "Name" : option === "phoneNumber" ? "Phone Number" : option === "createdAt" ? "Created At" : option === "lastActive" ? "Last Active" : "Updated by"}
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

      {/* Table Card */}
      <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
        <CardContent className="pt-2">
          {/* Bulk Actions Toolbar */}
          {selectedRows.size > 0 && (
            <div className="flex items-center gap-3 mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
              <span className="text-sm text-foreground">{selectedRows.size} selected</span>
              <div className="flex gap-2 ml-auto">
                <button onClick={handleOpenBulkEdit} className="p-1 hover:bg-blue-100 rounded" title="Edit">
                  <Edit2 size={14} className="text-blue-600" />
                </button>
                <button onClick={handleExportSelectedAsCSV} className="p-1 hover:bg-blue-100 rounded" title="Export as CSV">
                  <Download size={14} className="text-blue-600" />
                </button>
                <button onClick={handleOpenBulkDelete} className="p-1 hover:bg-blue-100 rounded" title="Delete">
                  <Trash2 size={14} className="text-red-600" />
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className={`overflow-x-auto ${selectedRows.size > 0 ? 'mt-3' : 'mt-6'}`}>
            <table className="w-full text-xs">
              <thead className="select-none">
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">
                    <Checkbox
                      checked={selectedRows.size > 0 && selectedRows.size === getFilteredAndSortedData().length}
                      onCheckedChange={toggleAllRows}
                    />
                  </th>
                  <th
                    className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                    onClick={() => handleColumnSort("name")}
                  >
                    <div className="flex items-center gap-2">
                      Name
                      {renderSortIcon("name")}
                    </div>
                  </th>
                  <th
                    className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                    onClick={() => handleColumnSort("phoneNumber")}
                  >
                    <div className="flex items-center gap-2">
                      Phone Number
                      {renderSortIcon("phoneNumber")}
                    </div>
                  </th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Tags</th>
                  <th
                    className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                    onClick={() => handleColumnSort("createdAt")}
                  >
                    <div className="flex items-center gap-2">
                      Created At
                      {renderSortIcon("createdAt")}
                    </div>
                  </th>
                  <th
                    className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                    onClick={() => handleColumnSort("lastActive")}
                  >
                    <div className="flex items-center gap-2">
                      Last Active
                      {renderSortIcon("lastActive")}
                    </div>
                  </th>
                  <th
                    className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                    onClick={() => handleColumnSort("updatedBy")}
                  >
                    <div className="flex items-center gap-2">
                      Updated by
                      {renderSortIcon("updatedBy")}
                    </div>
                  </th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredAndSortedData().length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-muted-foreground">
                      No results
                    </td>
                  </tr>
                ) : (
                  getFilteredAndSortedData().map((contact) => (
                    <tr key={contact.id} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-3">
                        <Checkbox
                          checked={selectedRows.has(contact.id)}
                          onCheckedChange={() => toggleRowSelection(contact.id)}
                        />
                      </td>
                      <td className="py-2 px-3">{contact.name}</td>
                      <td className="py-2 px-3">{contact.phoneNumber}</td>
                      <td className="py-2 px-3">
                        <div className="flex gap-1">
                          {contact.tags.map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-muted rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-2 px-3">{contact.createdAt}</td>
                      <td className="py-2 px-3">{contact.lastActive}</td>
                      <td className="py-2 px-3">{contact.updatedBy}</td>
                      <td className="py-2 px-3">
                        <div className={`${selectedRows.size > 0 ? 'opacity-50 pointer-events-none' : ''}`}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1 hover:bg-muted rounded">
                                <MoreVertical size={14} className="text-muted-foreground" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditContact(contact)}>
                                <Edit2 size={14} className="mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleCopyContact(contact)}>
                                <Copy size={14} className="mr-2" />
                                Copy
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteContact(contact)} className="text-destructive">
                                <Trash2 size={14} className="mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 text-xs">
            <span className="text-muted-foreground">{getFilteredAndSortedData().length} results</span>
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

      {/* Add Contact Modal */}
      <Dialog open={showAddContactModal} onOpenChange={setShowAddContactModal}>
        <DialogContent className="max-w-md">
          <DialogHeader className="mb-2">
            <DialogTitle>Add New Contact</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="text-sm font-medium text-foreground">Name<span className="text-red-500 pl-0.5">*</span></label>
              <input
                type="text"
                placeholder="Enter contact name"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none transition-colors"
              />
            </div>

            {/* Phone Input */}
            <div>
              <label className="text-sm font-medium text-foreground">Phone Number<span className="text-red-500 pl-0.5">*</span></label>
              <input
                type="tel"
                placeholder="Enter phone number"
                value={newContactPhone}
                onChange={(e) => setNewContactPhone(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none transition-colors"
              />
            </div>

            {/* Tags Section */}
            <div>
              <label className="text-sm font-medium text-foreground">Tags</label>

              {/* Selected Tags */}
              {newContactTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 mb-3">
                  {newContactTags.map(tag => (
                    <div
                      key={tag}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-blue-900"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Tag Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Create or select tag"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  className="flex-1 px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none transition-colors"
                />
                <Button
                  onClick={handleAddTag}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 h-9 font-normal"
                >
                  Add
                </Button>
              </div>

              {/* Available Tags */}
              {allTags.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground mb-2">Available tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => handleToggleTag(tag)}
                        className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                          newContactTags.includes(tag)
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-white text-foreground border-input hover:bg-muted"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex gap-2 justify-end mt-2">
            <Button
              onClick={() => setShowAddContactModal(false)}
              variant="outline"
              className="border-input [border-color:hsl(var(--input))] font-normal"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveContact}
              className="bg-blue-500 hover:bg-blue-600 text-white font-normal"
            >
              Save Contact
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Contact Modal */}
      <Dialog open={showEditContactModal} onOpenChange={setShowEditContactModal}>
        <DialogContent className="max-w-md">
          <DialogHeader className="mb-2">
            <DialogTitle>Edit Contact</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="text-sm font-medium text-foreground">Name<span className="text-red-500 pl-0.5">*</span></label>
              <input
                type="text"
                placeholder="Enter contact name"
                value={editContactName}
                onChange={(e) => setEditContactName(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none transition-colors"
              />
            </div>

            {/* Phone Input */}
            <div>
              <label className="text-sm font-medium text-foreground">Phone Number<span className="text-red-500 pl-0.5">*</span></label>
              <input
                type="tel"
                placeholder="Enter phone number"
                value={editContactPhone}
                onChange={(e) => setEditContactPhone(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none transition-colors"
              />
            </div>

            {/* Tags Section */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Tags</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Add or select tag"
                  value={editTagInput}
                  onChange={(e) => setEditTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddEditTag();
                    }
                  }}
                  className="flex-1 px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none transition-colors"
                />
                <Button
                  onClick={handleAddEditTag}
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Add
                </Button>
              </div>

              {/* Selected Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {editContactTags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs flex items-center gap-1">
                    {tag}
                    <button
                      onClick={() => handleRemoveEditTag(tag)}
                      className="hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {/* Available Tags */}
              {allTags.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Available tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleToggleEditTag(tag)}
                        className={`px-2 py-1 rounded text-xs transition-colors ${
                          editContactTags.includes(tag)
                            ? "bg-blue-500 text-white"
                            : "bg-muted text-foreground hover:bg-muted/80"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex gap-2 justify-end mt-2">
            <Button
              onClick={() => setShowEditContactModal(false)}
              variant="outline"
              className="border-input [border-color:hsl(var(--input))]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEditContact}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Contact Modal */}
      <Dialog open={showDeleteContactModal} onOpenChange={setShowDeleteContactModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader className="mb-2">
            <DialogTitle>Delete Contact</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-foreground">
              Are you sure you want to delete <span className="font-semibold">{contactToDelete?.name}</span>? This action cannot be undone.
            </p>
          </div>

          {/* Modal Footer */}
          <div className="flex gap-2 justify-end mt-2">
            <Button
              onClick={() => setShowDeleteContactModal(false)}
              variant="outline"
              className="border-input [border-color:hsl(var(--input))]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Edit Modal */}
      <Dialog open={showBulkEditModal} onOpenChange={setShowBulkEditModal}>
        <DialogContent className="max-w-md">
          <DialogHeader className="mb-2">
            <DialogTitle>Edit Tags for {selectedRows.size} Contact(s)</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Tags Section */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Tags</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Add or select tag"
                  value={bulkTagInput}
                  onChange={(e) => setBulkTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddBulkTag();
                    }
                  }}
                  className="flex-1 px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none transition-colors"
                />
                <Button
                  onClick={handleAddBulkTag}
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Add
                </Button>
              </div>

              {/* Selected Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {bulkEditTags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs flex items-center gap-1">
                    {tag}
                    <button
                      onClick={() => handleRemoveBulkTag(tag)}
                      className="hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {/* Available Tags */}
              {allTags.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Available tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleToggleBulkTag(tag)}
                        className={`px-2 py-1 rounded text-xs transition-colors ${
                          bulkEditTags.includes(tag)
                            ? "bg-blue-500 text-white"
                            : "bg-muted text-foreground hover:bg-muted/80"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex gap-2 justify-end mt-2">
            <Button
              onClick={() => setShowBulkEditModal(false)}
              variant="outline"
              className="border-input [border-color:hsl(var(--input))]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveBulkEdit}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Modal */}
      <Dialog open={showBulkDeleteModal} onOpenChange={setShowBulkDeleteModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader className="mb-2">
            <DialogTitle>Delete Contacts</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-foreground">
              Are you sure you want to delete <span className="font-semibold">{selectedRows.size} contact(s)</span>? This action cannot be undone.
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
              onClick={handleConfirmBulkDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

