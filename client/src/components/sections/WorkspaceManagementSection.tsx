import { useState, useRef, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Trash2, Edit2, PlusCircle, MinusCircle } from "react-feather";
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
import StatusBadge from "@/components/StatusBadge";

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

const allUsers: User[] = [
  { id: "U001", name: "Alice Johnson", email: "alice.j@example.com" },
  { id: "U002", name: "Bob Smith", email: "bob.s@example.com" },
  { id: "U003", name: "Carol White", email: "carol.w@example.com" },
  { id: "U004", name: "David Brown", email: "david.b@example.com" },
  { id: "U005", name: "Eve Davis", email: "eve.d@example.com" },
  { id: "U006", name: "Frank Miller", email: "frank.m@example.com" },
];

const initialWorkspaces: Workspace[] = [
  { id: "W001", name: "Main Workspace", status: "Active", users: ["U001", "U002", "U003"] },
  { id: "W002", name: "Development Env", status: "Active", users: ["U001", "U004"] },
  { id: "W003", name: "Marketing Team", status: "Active", users: ["U005"] },
  { id: "W004", name: "Archived Project", status: "Inactive", users: [] },
];


const statusOptions = [
  { id: "Active", name: "Active" },
  { id: "Inactive", name: "Inactive" },
];


export default function WorkspaceManagementSection() {
  const { toast } = useToast();
  const [workspaces, setWorkspaces] = useState<Workspace[]>(initialWorkspaces);
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
    const newWorkspace: Workspace = {
      id: `W${String(workspaces.length + 10).padStart(3, "0")}`,
      name: newWorkspaceName,
      status: "Active",
      users: newWorkspaceUsers,
    };
    setWorkspaces([...workspaces, newWorkspace]);
    toast({ title: "Workspace Created", description: `${newWorkspaceName} has been created successfully.` });
    setNewWorkspaceName("");
    setNewWorkspaceUsers([]);
    setShowCreateWorkspaceModal(false);
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
      setWorkspaces(
        workspaces.map(ws =>
          ws.id === editingWorkspace.id
            ? { ...ws, name: editWorkspaceName, status: editStatus, users: editAssignedUsers }
            : ws
        )
      );
      toast({ title: "Workspace Updated", description: `${editWorkspaceName} has been updated.` });
      setShowEditWorkspaceModal(false);
      setEditingWorkspace(null);
    }
  };

  const handleDeleteWorkspace = (workspace: Workspace) => {
    setWorkspaceToDelete(workspace);
    setShowDeleteWorkspaceModal(true);
  };

  const handleConfirmDelete = () => {
    if (workspaceToDelete) {
      setWorkspaces(workspaces.filter(ws => ws.id !== workspaceToDelete.id));
      toast({ title: "Workspace Deleted", description: `${workspaceToDelete.name} has been deleted.` });
      setShowDeleteWorkspaceModal(false);
      setWorkspaceToDelete(null);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Workspace Management</h1>
        <Button onClick={() => setShowCreateWorkspaceModal(true)} className="btn-outline-primary gap-2 h-9 font-normal" variant="outline">
          <Plus size={16} />
          Create Workspace
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs" style={{ height: "38px" }}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search workspaces..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 text-sm w-full h-full border border-input rounded-md bg-background focus:outline-none transition-colors"
          />
        </div>
        <CustomDropdown
          options={statusOptions}
          selected={filterStatus}
          onChange={(selectedIds) => setFilterStatus(selectedIds as WorkspaceStatus[])}
          placeholder="Status"
          width="120px"
        />
      </div>

      <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
        <CardContent className="pt-2">
          <div className="overflow-x-auto mt-6">
            <table className="w-full text-xs">
              <thead className="select-none">
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30" onClick={() => handleColumnSort("name")}>
                    <div className="flex items-center gap-2">Workspace Name{renderSortIcon("name")}</div>
                  </th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30" onClick={() => handleColumnSort("users")}>
                    <div className="flex items-center gap-2">Number of Users{renderSortIcon("users")}</div>
                  </th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30" onClick={() => handleColumnSort("status")}>
                    <div className="flex items-center gap-2">Status{renderSortIcon("status")}</div>
                  </th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredAndSortedData().length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-8 text-muted-foreground">No workspaces found.</td></tr>
                ) : (
                  getFilteredAndSortedData().map((ws) => (
                    <tr key={ws.id} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-3">{ws.name}</td>
                      <td className="py-2 px-3">{ws.users.length}</td>
                      <td className="py-2 px-3">
                        <StatusBadge status={ws.status} type={ws.status === "Active" ? "success" : "danger"} />
                      </td>
                      <td className="py-2 px-3">
                        <div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><button className="p-1 hover:bg-muted rounded"><MoreVertical size={14} className="text-muted-foreground" /></button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white dark:bg-background">
                              <DropdownMenuItem onClick={() => handleEditWorkspace(ws)}><Edit2 size={14} className="mr-2" />Edit</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteWorkspace(ws)} className="text-destructive"><Trash2 size={14} className="mr-2" />Delete</DropdownMenuItem>
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
            <span className="text-muted-foreground">{totalFilteredWorkspaces()} results</span>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Rows per page:</span>
              <div className="relative w-15" ref={dropdownRef}>
                <button type="button" className="flex items-center justify-between px-3 py-2 text-left bg-background border border-input rounded-md shadow-sm hover:bg-accent focus:outline-none text-foreground transition-colors" onClick={() => setRowsDropdownOpen(!rowsDropdownOpen)}>
                  <span className="truncate text-xs font-normal">{rowsPerPage}</span>
                  <ChevronDown className="h-3 w-3 ml-2 text-muted-foreground" />
                </button>
                {rowsDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-background rounded-md shadow-md border border-border">
                    <ul className="py-1">
                      {[10, 25, 50].map(option => (
                        <li key={option} className="px-3 py-2 text-xs cursor-pointer hover:bg-muted" onClick={() => { setRowsPerPage(option); setPage(1); setRowsDropdownOpen(false); }}>{option}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <span className="text-muted-foreground">Page {page} of {Math.ceil(totalFilteredWorkspaces() / rowsPerPage)}</span>
              <div className="flex gap-1">
                <button className="p-1 hover:bg-muted rounded disabled:opacity-50" onClick={() => setPage(1)} disabled={page === 1}><ChevronsLeft size={16} /></button>
                <button className="p-1 hover:bg-muted rounded disabled:opacity-50" onClick={() => setPage(prev => Math.max(1, prev - 1))} disabled={page === 1}><ChevronLeft size={16} /></button>
                <button className="p-1 hover:bg-muted rounded disabled:opacity-50" onClick={() => setPage(prev => Math.min(Math.ceil(totalFilteredWorkspaces() / rowsPerPage), prev + 1))} disabled={page === Math.ceil(totalFilteredWorkspaces() / rowsPerPage)}><ChevronRight size={16} /></button>
                <button className="p-1 hover:bg-muted rounded disabled:opacity-50" onClick={() => setPage(Math.ceil(totalFilteredWorkspaces() / rowsPerPage))} disabled={page === Math.ceil(totalFilteredWorkspaces() / rowsPerPage)}><ChevronsRight size={16} /></button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
          <DialogHeader className="mb-2"><DialogTitle>Edit</DialogTitle></DialogHeader>
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
