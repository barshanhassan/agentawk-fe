import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getUserInfo } from "@/lib/auth";
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Trash2, Edit2, PlusCircle, MinusCircle } from "react-feather";
import { ChevronsUpDown, ChevronDown, ChevronUp, Plus, MoreVertical, LayoutGrid } from "lucide-react";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// --- Data Structures ---

type WorkspaceStatus = "Active" | "Inactive";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Workspace {
  id: string;
  name: string;
  status: WorkspaceStatus;
  users: string[]; // Array of user IDs
}

const statusOptions = [
  { id: "Active", name: "Active" },
  { id: "Inactive", name: "Inactive" },
];

export default function WorkspaceManagementSection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get Agency ID from localStorage (set during login)
  const userInfo = getUserInfo();
  const agencyId = userInfo.modelable_id; // Fallback to 7 as seen in Postman test

  // --- API Fetching ---

  // Fetch Workspaces
  const { data: workspacesResponse, isLoading: isLoadingWorkspaces } = useQuery({
    queryKey: [`/api/agencies/${agencyId}/workspaces`],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/agencies/${agencyId}/workspaces`);
      return res.json();
    }
  });

  // Fetch Agency Members (for user assignment)
  const { data: membersResponse } = useQuery({
    queryKey: [`/api/agencies/${agencyId}/members`],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/agencies/${agencyId}/members`);
      return res.json();
    }
  });

  const allUsers: User[] = (membersResponse?.members || []).map((m: any) => ({
    id: m.id.toString(),
    name: `${m.first_name || ''} ${m.last_name || ''}`.trim() || m.email,
    email: m.email
  }));

  const workspaces: Workspace[] = (workspacesResponse?.workspaces || []).map((ws: any) => ({
    id: ws.id.toString(),
    name: ws.name,
    status: ws.status === 'active' ? 'Active' : 'Inactive',
    users: (ws.workspace_users || []).map((wu: any) => wu.user_id.toString())
  }));

  // --- Mutations ---

  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await apiRequest("POST", `/api/agencies/${agencyId}/workspaces`, { name });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/agencies/${agencyId}/workspaces`] });
      toast({ title: "Workspace Created", description: "The workspace has been created successfully." });
      setShowCreateWorkspaceModal(false);
      setNewWorkspaceName("");
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const res = await apiRequest("PATCH", `/api/agencies/${agencyId}/workspaces/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/agencies/${agencyId}/workspaces`] });
      toast({ title: "Workspace Updated", description: "The workspace has been updated successfully." });
      setShowEditWorkspaceModal(false);
      setEditingWorkspace(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/agencies/${agencyId}/workspaces/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/agencies/${agencyId}/workspaces`] });
      toast({ title: "Workspace Deleted", description: "The workspace has been deleted." });
      setShowDeleteWorkspaceModal(false);
      setWorkspaceToDelete(null);
    }
  });

  // --- Local UI State ---
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sort, setSort] = useState<{ column: string; direction: "asc" | "desc" } | null>(null);
  const [filterStatus, setFilterStatus] = useState<WorkspaceStatus[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [rowsDropdownOpen, setRowsDropdownOpen] = useState(false);

  // --- Modal States ---
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [newWorkspaceUsers, setNewWorkspaceUsers] = useState<string[]>([]);

  const [showEditWorkspaceModal, setShowEditWorkspaceModal] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null);
  const [editWorkspaceName, setEditWorkspaceName] = useState("");
  const [editStatus, setEditStatus] = useState<WorkspaceStatus>("Active");
  const [editAssignedUsers, setEditAssignedUsers] = useState<string[]>([]);

  const [showDeleteWorkspaceModal, setShowDeleteWorkspaceModal] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] = useState<Workspace | null>(null);

  // --- Sorting and Filtering ---

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
    if (!isActive) return <ChevronsUpDown size={14} className={color} />;
    return sort?.direction === 'asc' ? <ChevronUp size={14} className={color} /> : <ChevronDown size={14} className={color} />;
  };

  const getFilteredAndSortedData = () => {
    let data = [...workspaces];
    if (search) {
      data = data.filter(ws => ws.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (filterStatus.length > 0) {
      data = data.filter(ws => filterStatus.includes(ws.status));
    }
    if (sort) {
      data.sort((a, b) => {
        const aVal = sort.column === 'users' ? a.users.length : a[sort.column as keyof Omit<Workspace, 'users'>];
        const bVal = sort.column === 'users' ? b.users.length : b[sort.column as keyof Omit<Workspace, 'users'>];
        const comparison = typeof aVal === 'number' && typeof bVal === 'number' ? aVal - bVal : String(aVal).localeCompare(String(bVal));
        return sort.direction === "asc" ? comparison : -comparison;
      });
    }
    const startIndex = (page - 1) * rowsPerPage;
    return data.slice(startIndex, startIndex + rowsPerPage);
  };

  const totalFilteredWorkspaces = () => {
    let data = [...workspaces];
    if (search) data = data.filter(ws => ws.name.toLowerCase().includes(search.toLowerCase()));
    if (filterStatus.length > 0) data = data.filter(ws => filterStatus.includes(ws.status));
    return data.length;
  };

  // --- CRUD Handlers ---

  const handleCreateWorkspace = () => {
    if (!newWorkspaceName.trim()) {
      toast({ title: "Missing Name", description: "Please enter a workspace name.", variant: "destructive" });
      return;
    }
    createMutation.mutate(newWorkspaceName);
  };

  const handleEditWorkspace = (workspace: Workspace) => {
    setEditingWorkspace(workspace);
    setEditWorkspaceName(workspace.name);
    setEditStatus(workspace.status);
    setEditAssignedUsers(workspace.users);
    setShowEditWorkspaceModal(true);
  };

  const handleSaveEditWorkspace = () => {
    if (!editWorkspaceName.trim()) {
      toast({ title: "Missing Name", description: "Please enter a workspace name.", variant: "destructive" });
      return;
    }
    if (editingWorkspace) {
      updateMutation.mutate({
        id: editingWorkspace.id,
        data: {
          name: editWorkspaceName,
          status: editStatus.toLowerCase()
        }
      });
    }
  };

  const handleDeleteWorkspace = (workspace: Workspace) => {
    setWorkspaceToDelete(workspace);
    setShowDeleteWorkspaceModal(true);
  };

  const handleConfirmDelete = () => {
    if (workspaceToDelete) {
      deleteMutation.mutate(workspaceToDelete.id);
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
    <div className="animate-in fade-in duration-700">
        {/* Unified Main Card */}
        <div className="bg-white dark:bg-slate-900/50 rounded-[20px] border border-slate-300 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden flex flex-col">
            
            {/* 1. Branded Header Section */}
            <div className="py-1.5 px-5 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between bg-blue-50/20 dark:bg-transparent">
                <div className="flex items-center gap-6">
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 border border-blue-500/10 shadow-inner">
                        <LayoutGrid size={20} strokeWidth={2.5} />
                    </div>
                    <div className="space-y-0.5">
                        <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                            Workspace Management
                        </h1>
                        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                            Organize and oversee your multi-tenant workspaces and user assignments
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button 
                        onClick={() => setShowCreateWorkspaceModal(true)}
                        className="h-8 px-4 rounded-lg bg-blue-600 text-white font-semibold text-[11px] shadow-lg shadow-blue-500/20 transition-all duration-300 active:scale-95 flex items-center gap-2 border-0 hover:bg-blue-700"
                    >
                        <Plus size={14} strokeWidth={2.5} />
                        <span>Create Workspace</span>
                    </Button>
                </div>
            </div>

            {/* 2. Unified Filter Row Section */}
            <div className="px-5 py-2.5 bg-slate-50/50 dark:bg-transparent border-b border-slate-200 dark:border-slate-800/80 flex items-center gap-3 flex-wrap">
                {/* Search Bar - Modernized */}
                <div className="relative group flex-1 min-w-[300px] max-w-sm">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Search className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500 group-focus-within:scale-110 transition-all duration-300" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search workspaces by name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 h-9 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[12px] font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all shadow-sm"
                    />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2">
                    <CustomDropdown
                        options={statusOptions}
                        selected={filterStatus}
                        onChange={(selectedIds) => setFilterStatus(selectedIds as WorkspaceStatus[])}
                        placeholder="Status Filter"
                        width="140px"
                    />
                </div>
            </div>

            {/* 3. Table Content Area */}
            <div className="flex-1 overflow-auto min-h-[150px]">
                <table className="w-full text-left border-separate border-spacing-0">
                    <thead className="sticky top-0 z-10 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md">
                        <tr>
                            <th 
                                onClick={() => handleColumnSort("name")}
                                className="px-5 py-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-100/50 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    Workspace Name
                                    {renderSortIcon("name")}
                                </div>
                            </th>
                            <th 
                                onClick={() => handleColumnSort("users")}
                                className="px-5 py-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-100/50 transition-colors text-center"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    Users
                                    {renderSortIcon("users")}
                                </div>
                            </th>
                            <th 
                                onClick={() => handleColumnSort("status")}
                                className="px-5 py-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-100/50 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    Status
                                    {renderSortIcon("status")}
                                </div>
                            </th>
                            <th className="px-5 py-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 w-20">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {getFilteredAndSortedData().length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-20 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="p-4 rounded-full bg-slate-50 dark:bg-slate-800">
                                            <Search className="w-8 h-8 text-slate-300" />
                                        </div>
                                        <p className="text-sm font-medium text-slate-400">No workspaces found matching your criteria</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            getFilteredAndSortedData().map((ws) => (
                                <tr 
                                    key={ws.id} 
                                    className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/5 transition-all duration-200"
                                >
                                    <td className="px-5 py-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                {ws.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-200">
                                                {ws.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-2">
                                        <div className="flex justify-center">
                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-[12px] font-bold text-slate-600 dark:text-slate-400">
                                                {ws.users.length}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-2">
                                        <span className={cn(
                                            "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase",
                                            ws.status === "Active" 
                                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" 
                                                : "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                                        )}>
                                            {ws.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button 
                                                    variant="ghost" 
                                                    className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                                                >
                                                    <MoreVertical size={14} className="text-slate-400" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-36 p-1 rounded-xl shadow-xl border-slate-200 dark:border-slate-800">
                                                <DropdownMenuItem 
                                                    onClick={() => handleEditWorkspace(ws)}
                                                    className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium rounded-lg cursor-pointer transition-colors"
                                                >
                                                    <Edit2 size={13} className="text-blue-500" />
                                                    Edit Workspace
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    onClick={() => handleDeleteWorkspace(ws)}
                                                    className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-rose-600 rounded-lg cursor-pointer transition-colors hover:bg-rose-50 dark:hover:bg-rose-900/20"
                                                >
                                                    <Trash2 size={13} />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* 4. Footer / Pagination Section */}
            <div className="px-5 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-transparent flex items-center justify-between">
                <div className="flex items-center gap-4 text-[11px] font-medium text-slate-500">
                    <span>{totalFilteredWorkspaces()} results total</span>
                    <div className="h-4 w-px bg-slate-300 dark:bg-slate-700" />
                    <div className="flex items-center gap-2">
                        <span>Show</span>
                        <div className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 transition-colors"
                                onClick={() => setRowsDropdownOpen(!rowsDropdownOpen)}
                            >
                                <span className="font-bold text-slate-700 dark:text-slate-200">{rowsPerPage}</span>
                                <ChevronDown size={10} className="text-slate-400" />
                            </button>
                            {rowsDropdownOpen && (
                                <div className="absolute bottom-full left-0 mb-1 z-50 w-16 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden animate-in slide-in-from-bottom-1">
                                    {[10, 25, 50].map(option => (
                                        <button
                                            key={option}
                                            className="w-full px-3 py-1.5 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-600 dark:text-slate-300 transition-colors"
                                            onClick={() => {
                                                setRowsPerPage(option);
                                                setPage(1);
                                                setRowsDropdownOpen(false);
                                            }}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 mr-2">
                        <span>Page</span>
                        <span className="text-slate-900 dark:text-white">{page}</span>
                        <span>of</span>
                        <span>{Math.ceil(totalFilteredWorkspaces() / rowsPerPage)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 rounded-md border-slate-200 dark:border-slate-800"
                            onClick={() => setPage(1)}
                            disabled={page === 1}
                        >
                            <ChevronsLeft size={12} />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 rounded-md border-slate-200 dark:border-slate-800"
                            onClick={() => setPage(prev => Math.max(1, prev - 1))}
                            disabled={page === 1}
                        >
                            <ChevronLeft size={12} />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 rounded-md border-slate-200 dark:border-slate-800"
                            onClick={() => setPage(prev => Math.min(Math.ceil(totalFilteredWorkspaces() / rowsPerPage), prev + 1))}
                            disabled={page === Math.ceil(totalFilteredWorkspaces() / rowsPerPage)}
                        >
                            <ChevronRight size={12} />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 rounded-md border-slate-200 dark:border-slate-800"
                            onClick={() => setPage(Math.ceil(totalFilteredWorkspaces() / rowsPerPage))}
                            disabled={page === Math.ceil(totalFilteredWorkspaces() / rowsPerPage)}
                        >
                            <ChevronsRight size={12} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>

      {/* --- Modals --- */}
      <Dialog open={showCreateWorkspaceModal} onOpenChange={setShowCreateWorkspaceModal}>
        <DialogContent className="max-w-xl">
          <DialogHeader className="mb-2"><DialogTitle>Create Workspace</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Workspace Name<span className="text-red-500 pl-0.5">*</span></label>
              <div className="relative">
                <Input
                  placeholder="Enter workspace name"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  maxLength={50}
                  className="pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {newWorkspaceName.length}/50
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <h4 className="text-sm font-medium mb-2">Available Users</h4>
                <div className="border rounded-md pl-3 pr-1 py-2 h-40 overflow-y-auto">
                  {allUsers.filter(user => !newWorkspaceUsers.includes(user.id)).map(user => (
                    <div key={user.id} className="flex items-center justify-between py-1">
                      <span className="text-sm">{user.name}</span>
                      <Button variant="ghost" size="icon" onClick={() => setNewWorkspaceUsers([...newWorkspaceUsers, user.id])}><PlusCircle size={16} /></Button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Assigned Users</h4>
                <div className="border rounded-md pl-3 pr-1 py-2 h-40 overflow-y-auto">
                  {allUsers.filter(user => newWorkspaceUsers.includes(user.id)).map(user => (
                    <div key={user.id} className="flex items-center justify-between py-1">
                      <span className="text-sm">{user.name}</span>
                      <Button variant="ghost" size="icon" onClick={() => setNewWorkspaceUsers(newWorkspaceUsers.filter(id => id !== user.id))}><MinusCircle size={16} /></Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <Button onClick={() => setShowCreateWorkspaceModal(false)} variant="outline" className="border-input [border-color:hsl(var(--input))] font-normal">Cancel</Button>
            <Button onClick={handleCreateWorkspace} className="btn-outline-primary font-normal" variant="outline">Create Workspace</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditWorkspaceModal} onOpenChange={setShowEditWorkspaceModal}>
        <DialogContent className="max-w-xl">
          <DialogHeader className="mb-2"><DialogTitle>Edit Workspace</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Workspace Name<span className="text-red-500 pl-0.5">*</span></label>
              <div className="relative">
                <Input
                  placeholder="Enter workspace name"
                  value={editWorkspaceName}
                  onChange={(e) => setEditWorkspaceName(e.target.value)}
                  maxLength={50}
                  className="pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {editWorkspaceName.length}/50
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Status<span className="text-red-500 pl-0.5">*</span></label>
              <Select value={editStatus} onValueChange={(value: WorkspaceStatus) => setEditStatus(value)}><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger><SelectContent><SelectItem value="Active">Active</SelectItem><SelectItem value="Inactive">Inactive</SelectItem></SelectContent></Select>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <h4 className="text-sm font-medium mb-2">Available Users</h4>
                <div className="border rounded-md pl-3 pr-1 py-2 h-40 overflow-y-auto">
                  {allUsers.filter(user => !editAssignedUsers.includes(user.id)).map(user => (
                    <div key={user.id} className="flex items-center justify-between py-1">
                      <span className="text-sm">{user.name}</span>
                      <Button variant="ghost" size="icon" onClick={() => setEditAssignedUsers([...editAssignedUsers, user.id])}><PlusCircle size={16} /></Button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Assigned Users</h4>
                <div className="border rounded-md pl-3 pr-1 py-2 h-40 overflow-y-auto">
                  {allUsers.filter(user => editAssignedUsers.includes(user.id)).map(user => (
                    <div key={user.id} className="flex items-center justify-between py-1">
                      <span className="text-sm">{user.name}</span>
                      <Button variant="ghost" size="icon" onClick={() => setEditAssignedUsers(editAssignedUsers.filter(id => id !== user.id))}><MinusCircle size={16} /></Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <Button onClick={() => setShowEditWorkspaceModal(false)} variant="outline" className="border-input [border-color:hsl(var(--input))] font-normal">Cancel</Button>
            <Button onClick={handleSaveEditWorkspace} className="btn-outline-primary font-normal" variant="outline">Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteWorkspaceModal} onOpenChange={setShowDeleteWorkspaceModal}><DialogContent className="max-w-sm"><DialogHeader className="mb-2"><DialogTitle>Delete Workspace</DialogTitle></DialogHeader><div className="space-y-4"><p className="text-sm text-foreground">Are you sure you want to delete <span className="font-semibold break-all">{workspaceToDelete?.name}</span>? This action cannot be undone.</p></div><div className="flex gap-2 justify-end mt-2"><Button onClick={() => setShowDeleteWorkspaceModal(false)} variant="outline" className="border-input [border-color:hsl(var(--input))]">Cancel</Button><Button onClick={handleConfirmDelete} className="btn-outline-destructive" variant="outline">Delete</Button></div></DialogContent></Dialog>
    </div>
  );
}
