import { useState, useRef, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Trash2, Edit2, Copy, X } from "react-feather";
import { ChevronsUpDown, ChevronDown, ChevronUp, Plus, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomDropdown from "../CustomDropdown";

type TagStatus = "Active" | "Inactive";

interface Option {
  id: string;
  name: string;
}

const statusOptions: Option[] = [
  { id: "Active", name: "Active" },
  { id: "Inactive", name: "Inactive" },
];

interface Tag {
  id: string;
  name: string;
  status: TagStatus;
  lastEdited: string;
}

const initialTags: Tag[] = [
  { id: "TAG001", name: "Sales", status: "Active", lastEdited: "2025-11-12" },
  { id: "TAG002", name: "Support", status: "Active", lastEdited: "2025-11-11" },
  { id: "TAG003", name: "Billing", status: "Inactive", lastEdited: "2025-11-10" },
];

export default function TagsSection() {
  const { toast } = useToast();
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sort, setSort] = useState<{ column: string; direction: "asc" | "desc" } | null>(null);
  const [filterStatus, setFilterStatus] = useState<TagStatus[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [rowsDropdownOpen, setRowsDropdownOpen] = useState(false);

  // Create Tag Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState("");

  // Edit Tag Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Tag | null>(null);
  const [editName, setEditName] = useState("");
  const [editStatus, setEditStatus] = useState<TagStatus>("Active");

  // Delete Tag Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Tag | null>(null);

  const handleColumnSort = (column: string) => {
    if (sort?.column === column) {
      if (sort.direction === "asc") {
        setSort({ column, direction: "desc" });
      } else {
        setSort(null); // Unsort
      }
    } else {
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
    return <div className="w-4 h-4 flex items-center justify-center"><ChevronDown size={14} className={color} /></div>;
  };

  const getFilteredAndSortedData = () => {
    let data = [...tags];

    if (search) {
      data = data.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterStatus.length > 0) {
      data = data.filter(item => filterStatus.includes(item.status));
    }

    if (sort) {
      data.sort((a, b) => {
        const aVal = a[sort.column as keyof Tag];
        const bVal = b[sort.column as keyof Tag];
        let comparison = 0;
        if (typeof aVal === "string" && typeof bVal === "string") {
          comparison = aVal.localeCompare(bVal);
        }
        return sort.direction === "asc" ? comparison : -comparison;
      });
    }

    const startIndex = (page - 1) * rowsPerPage;
    return data.slice(startIndex, startIndex + rowsPerPage);
  };

  const totalFilteredItems = tags.length;

  const handleEdit = (item: Tag) => {
    setEditingItem(item);
    setEditName(item.name);
    setEditStatus(item.status);
    setShowEditModal(true);
  };

  const handleDelete = (item: Tag) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setTags(tags.filter(item => item.id !== itemToDelete.id));
      toast({
        title: "Tag Deleted",
        description: `${itemToDelete.name} has been deleted.`,
      });
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const handleCreate = () => {
    if (!newName.trim()) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    const newItem: Tag = {
      id: `TAG${String(tags.length + 1).padStart(3, "0")}`,
      name: newName,
      status: "Active",
      lastEdited: new Date().toISOString().slice(0, 10), // Set current date
    };
    setTags([...tags, newItem]);
    toast({
      title: "Tag Created",
      description: `${newName} has been created successfully.`,
    });
    setNewName("");
    setShowCreateModal(false);
  };

  const handleSaveEdit = () => {
    if (!editName.trim()) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    if (editingItem) {
      setTags(
        tags.map(item =>
          item.id === editingItem.id
            ? { ...item, name: editName, status: editStatus, lastEdited: new Date().toISOString().slice(0, 10) } // Update lastEdited
            : item
        )
      );
      toast({
        title: "Tag Updated",
        description: `${editName} has been updated successfully.`,
      });
      setShowEditModal(false);
      setEditingItem(null);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setRowsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold mb-1">Tags</h2>
          <p className="text-sm text-muted-foreground">You can create tags here to categorize your conversations.</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white gap-2 h-9 font-normal"
        >
          <Plus size={16} />
          Create Tag
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs" style={{ height: "38px" }}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 text-sm w-full h-full border border-input rounded-md bg-background focus:outline-none transition-colors"
          />
        </div>
        <CustomDropdown
          options={statusOptions}
          selected={filterStatus}
          onChange={(selectedIds) => setFilterStatus(selectedIds as TagStatus[])}
          placeholder="Status"
          width="120px"
        />
      </div>

      <Card className="border-0">
        <CardContent className="p-0 px-1 mt-1">
          <div className="overflow-x-auto mt-6">
            <table className="w-full text-xs">
              <thead className="select-none">
                <tr className="border-b">
                  <th
                    className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                    onClick={() => handleColumnSort("name")}
                  >
                    <div className="flex items-center gap-2 max-w-[15rem]" style={{width: "100vw"}}>
                      Name
                      {renderSortIcon("name")}
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
                {getFilteredAndSortedData().length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-muted-foreground">
                      No tags found.
                    </td>
                  </tr>
                ) : (
                  getFilteredAndSortedData().map((item) => (
                    <tr key={item.id} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-3 max-w-[15rem]">
                        <div className="break-all">
                          {item.name}
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          item.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-2 px-3">{item.lastEdited}</td>
                      <td className="py-2 px-3">
                        <div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1 hover:bg-muted rounded">
                                <MoreVertical size={14} className="text-muted-foreground" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(item)}>
                                <Edit2 size={14} className="mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(item)} className="text-destructive">
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

          <div className="flex items-center justify-between mt-4 text-xs">
            <span className="text-muted-foreground">{totalFilteredItems} results</span>
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
                            setPage(1);
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
              <span className="text-muted-foreground">Page {page} of {Math.ceil(totalFilteredItems / rowsPerPage)}</span>
              <div className="flex gap-1">
                <button
                  className="p-1 hover:bg-muted rounded disabled:opacity-50"
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                >
                  <ChevronsLeft size={16} />
                </button>
                <button
                  className="p-1 hover:bg-muted rounded disabled:opacity-50"
                  onClick={() => setPage(prev => Math.max(1, prev - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  className="p-1 hover:bg-muted rounded disabled:opacity-50"
                  onClick={() => setPage(prev => Math.min(Math.ceil(totalFilteredItems / rowsPerPage), prev + 1))}
                  disabled={page === Math.ceil(totalFilteredItems / rowsPerPage)}
                >
                  <ChevronRight size={16} />
                </button>
                <button
                  className="p-1 hover:bg-muted rounded disabled:opacity-50"
                  onClick={() => setPage(Math.ceil(totalFilteredItems / rowsPerPage))}
                  disabled={page === Math.ceil(totalFilteredItems / rowsPerPage)}
                >
                  <ChevronsRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-md">
          <DialogHeader className="mb-2">
            <DialogTitle>Create Tag</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Name<span className="text-red-500 pl-0.5">*</span></label>
              <div className="relative">
                <Input
                  placeholder="Enter tag name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value.slice(0, 100))}
                  className="pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {newName.length}/100
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <Button onClick={() => setShowCreateModal(false)} variant="outline" className="border-input">Cancel</Button>
            <Button onClick={handleCreate} className="bg-blue-500 hover:bg-blue-600 text-white">Create</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-md">
          <DialogHeader className="mb-2">
            <DialogTitle>Edit Tag</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Name<span className="text-red-500 pl-0.5">*</span></label>
              <div className="relative">
                <Input
                  placeholder="Enter tag name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value.slice(0, 100))}
                  className="pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {editName.length}/100
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Status<span className="text-red-500 pl-0.5">*</span></label>
              <Select value={editStatus} onValueChange={(value: TagStatus) => setEditStatus(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <Button onClick={() => setShowEditModal(false)} variant="outline" className="border-input">Cancel</Button>
            <Button onClick={handleSaveEdit} className="bg-blue-500 hover:bg-blue-600 text-white">Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader className="mb-2">
            <DialogTitle>Delete Tag</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-foreground">
              Are you sure you want to delete <span className="font-semibold break-all">{itemToDelete?.name}</span>? This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <Button onClick={() => setShowDeleteModal(false)} variant="outline" className="border-input">Cancel</Button>
            <Button onClick={handleConfirmDelete} className="bg-red-500 hover:bg-red-600 border-red-600 text-white">Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
