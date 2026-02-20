import { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useLocation } from "wouter";
import {
    Plus,
    Search,
    Folder,
    Edit2,
    Trash2,
    MoreVertical,
    ChevronDown,
    Copy as ClipboardCopy,
    ChevronsUpDown,
    ChevronUp,
    ArrowDownWideNarrow,
    ArrowUpWideNarrow,
    User,
    FolderTree,
    PlusCircle,
    Pencil,
    CircleArrowDown,
    FolderOpen,
    Gem,
    Plug,
    ChevronsLeft,
    ChevronLeft,
    ChevronRight,
    ChevronsRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import CustomDropdown from "@/components/CustomDropdown";

export default function SmartFlowsPage() {
    const [, setLocation] = useLocation();
    const [searchText, setSearchText] = useState("");
    const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState<string[]>(["all"]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showFolderModal, setShowFolderModal] = useState(false);
    const [newFlowName, setNewFlowName] = useState("");
    const [newFolderName, setNewFolderName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [selectedFlowIds, setSelectedFlowIds] = useState<number[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);


    // Initial data
    const initialFolders = [
        { id: 1, name: "Marketing Campaigns" },
        { id: 2, name: "Customer Support" },
        { id: 3, name: "Sales Automation" }
    ];

    const initialFlows = [
        {
            id: 1,
            name: "Welcome Flow",
            status: "active",
            total_runs: 1234,
            created_by: { id: 1, name: "John Doe", picture: "https://i.pravatar.cc/150?img=1" },
            last_updated: "2024-01-15",
            folder_id: null
        },
        {
            id: 2,
            name: "Follow-up Sequence",
            status: "draft",
            total_runs: 0,
            created_by: { id: 2, name: "Jane Smith", picture: "https://i.pravatar.cc/150?img=2" },
            last_updated: "2024-01-14",
            folder_id: 1
        },
        {
            id: 3,
            name: "Abandoned Cart Recovery",
            status: "active",
            total_runs: 128,
            created_by: { id: 1, name: "John Doe", picture: "https://i.pravatar.cc/150?img=1" },
            last_updated: "2024-01-13",
            folder_id: 2
        },
        {
            id: 4,
            name: "Product Launch Announcement",
            status: "unpublished",
            total_runs: 45,
            created_by: { id: 3, name: "Mike Johnson", picture: "https://i.pravatar.cc/150?img=3" },
            last_updated: "2024-01-12",
            folder_id: 1
        }
    ];

    // Load from localStorage or use initial data
    const [folders, setFolders] = useState(() => {
        const saved = localStorage.getItem('smartFlowFolders');
        return saved ? JSON.parse(saved) : initialFolders;
    });

    const [flows, setFlows] = useState(() => {
        const saved = localStorage.getItem('smartFlows');
        return saved ? JSON.parse(saved) : initialFlows;
    });

    // Save to localStorage whenever folders or flows change
    useEffect(() => {
        localStorage.setItem('smartFlowFolders', JSON.stringify(folders));
    }, [folders]);

    useEffect(() => {
        localStorage.setItem('smartFlows', JSON.stringify(flows));
    }, [flows]);

    // Mock users data
    const mockUsers = [
        { id: 1, name: "John Doe", picture: "https://i.pravatar.cc/150?img=1" },
        { id: 2, name: "Jane Smith", picture: "https://i.pravatar.cc/150?img=2" },
        { id: 3, name: "Mike Johnson", picture: "https://i.pravatar.cc/150?img=3" },
        { id: 4, name: "Sarah Williams", picture: "https://i.pravatar.cc/150?img=4" }
    ];

    const filteredFlows = useMemo(() => {
        let result = flows;

        // Filter by folder
        if (selectedFolders.length > 0 && !selectedFolders.includes("all")) {
            result = result.filter((flow: any) => {
                if (selectedFolders.includes("root") && !flow.folder_id) return true;
                return selectedFolders.includes(flow.folder_id?.toString());
            });
        }

        // Filter by search
        if (searchText) {
            result = result.filter((flow: any) =>
                flow.name.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        // Filter by Status
        if (statusFilter.length > 0 && !statusFilter.includes("all")) {
            result = result.filter((flow: any) => statusFilter.includes(flow.status));
        }

        // Filter by selected users
        if (selectedUsers.length > 0 && selectedUsers.length < mockUsers.length) {
            result = result.filter((flow: any) => selectedUsers.includes(flow.created_by.id.toString()));
        }

        // Sort (Default: Newest First)
        return result.sort((a: any, b: any) => {
            const dateA = new Date(a.last_updated).getTime();
            const dateB = new Date(b.last_updated).getTime();
            return dateB - dateA;
        });
    }, [selectedFolders, searchText, statusFilter, selectedUsers, flows]);


    const handleCreateFlow = () => {
        if (newFlowName.trim()) {
            setIsCreating(true);
            setTimeout(() => {
                const newFlow = {
                    id: flows.length + 1,
                    name: newFlowName,
                    status: "draft",
                    total_runs: 0,
                    created_by: mockUsers[0], // Default to first user
                    last_updated: new Date().toISOString().split('T')[0],
                    folder_id: selectedFolders.length === 1 && selectedFolders[0] !== "all" && selectedFolders[0] !== "root"
                        ? parseInt(selectedFolders[0])
                        : null
                };

                const updatedFlows = [...flows, newFlow];
                setFlows(updatedFlows);
                localStorage.setItem('smartFlows', JSON.stringify(updatedFlows));
                setShowCreateModal(false);
                setNewFlowName("");
                setIsCreating(false);

                setLocation(`/automations/${newFlow.id}`);
            }, 1000);
        }
    };

    const handleCreateFolder = () => {
        if (newFolderName.trim()) {
            const newFolder = {
                id: folders.length + 1,
                name: newFolderName
            };
            setFolders([...folders, newFolder]);
            setShowFolderModal(false);
            setNewFolderName("");
        }
    };

    const handleOpenFlow = (flowId: number) => {
        setLocation(`/automations/${flowId}`);
    };



    // Prepare dropdown options
    const userOptions = mockUsers.map(u => ({
        id: u.id.toString(),
        name: u.name,
        icon: <img src={u.picture} className="w-5 h-5 rounded-full" alt={u.name} />
    }));

    const folderOptions = [
        { id: "all", name: "All Folders" },
        { id: "root", name: "Root Folder" },
        ...folders.map((f: any) => ({ id: f.id.toString(), name: f.name }))
    ];

    const statusOptions = [
        { id: "all", name: "All Statuses" },
        { id: "active", name: "Published" },
        { id: "unpublished", name: "Unpublished" },
        { id: "draft", name: "Draft" }
    ];

    const totalPages = Math.ceil(filteredFlows.length / rowsPerPage);
    const paginatedFlows = filteredFlows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Smart Flows</h1>
                <Button
                    onClick={() => setShowCreateModal(true)}
                    className="gap-2 font-normal btn-outline-primary"
                    variant="outline"
                >
                    <Plus size={16} />
                    Create a Smart Flow
                </Button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 max-w-xs" style={{ height: "38px" }}>
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Search flows..."
                        className="pl-10 text-sm w-full h-full border border-input rounded-md bg-background focus:outline-none transition-colors"
                    />
                </div>

                {/* Folder Dropdown */}
                <CustomDropdown
                    options={folderOptions}
                    selected={selectedFolders}
                    onChange={setSelectedFolders}
                    placeholder="Folders"
                    width="200px"
                    showSearch={true}
                />

                {/* Create Folder Button */}
                <button
                    className="flex items-center justify-center h-[38px] w-[38px] rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                    onClick={() => setShowFolderModal(true)}
                    title="Create New Folder"
                >
                    <FolderTree size={16} className="text-muted-foreground" />
                </button>


                {/* Users Dropdown (styled as CustomDropdown) */}
                {/* Users Dropdown */}
                <CustomDropdown
                    options={userOptions}
                    selected={selectedUsers}
                    onChange={setSelectedUsers}
                    placeholder="All Users"
                    width="200px"
                    showSearch={true}
                />

                {/* Status Filter */}
                <CustomDropdown
                    options={statusOptions}
                    selected={statusFilter}
                    onChange={setStatusFilter}
                    placeholder="All Statuses"
                    width="180px"
                    showSearch={false}
                />
            </div>

            {/* Table */}
            <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
                <CardContent className="pt-2">
                    <div className="overflow-x-auto mt-3">
                        <table className="w-full text-xs">
                            <thead className="select-none">
                                <tr className="border-b">
                                    <th className="py-2 px-3 w-12">
                                        <Checkbox
                                            className="bg-white h-3.5 w-3.5"
                                            checked={paginatedFlows.length > 0 && paginatedFlows.every((f: any) => selectedFlowIds.includes(f.id))}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    const newSelected = Array.from(new Set([...selectedFlowIds, ...paginatedFlows.map((f: any) => f.id)]));
                                                    setSelectedFlowIds(newSelected);
                                                } else {
                                                    const pageIds = paginatedFlows.map((f: any) => f.id);
                                                    setSelectedFlowIds(selectedFlowIds.filter(id => !pageIds.includes(id)));
                                                }
                                            }}
                                        />
                                    </th>
                                    <th className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30">
                                        Name
                                    </th>
                                    <th className="text-center py-2 px-3 font-medium text-muted-foreground text-center">
                                        Runs
                                    </th>
                                    <th className="text-center py-2 px-3 font-medium text-muted-foreground text-center">
                                        Created By
                                    </th>
                                    <th className="text-center py-2 px-3 font-medium text-muted-foreground text-center">
                                        Updated
                                    </th>
                                    <th className="text-right py-2 px-3 font-medium text-muted-foreground">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedFlows.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-12 text-muted-foreground">
                                            No flows found. <Button variant="ghost" onClick={() => setShowCreateModal(true)} className="px-1 h-auto font-normal underline hover:bg-transparent">Create one</Button> to get started.
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedFlows.map((flow: any) => (
                                        <tr key={flow.id} className="border-b hover:bg-muted/50 transition-colors">
                                            <td className="py-2 px-3">
                                                <Checkbox
                                                    className="bg-white h-3.5 w-3.5"
                                                    checked={selectedFlowIds.includes(flow.id)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) setSelectedFlowIds([...selectedFlowIds, flow.id]);
                                                        else setSelectedFlowIds(selectedFlowIds.filter(id => id !== flow.id));
                                                    }}
                                                />
                                            </td>
                                            <td className="py-2 px-3">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleOpenFlow(flow.id)}
                                                        className="text-foreground hover:underline font-medium break-all text-left"
                                                    >
                                                        {flow.name}
                                                    </button>
                                                    <Badge variant="outline" className={`font-medium ml-2 ${flow.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" :
                                                        flow.status === "draft" ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" :
                                                            flow.status === "unpublished" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300" :
                                                                "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                                        }`}>
                                                        {flow.status}
                                                    </Badge>
                                                </div>
                                            </td>
                                            <td className="py-2 px-3 text-center">{flow.total_runs}</td>
                                            <td className="py-2 px-3 text-center">
                                                <div className="flex justify-center">
                                                    <img
                                                        src={flow.created_by.picture}
                                                        alt={flow.created_by.name}
                                                        className="w-6 h-6 rounded-full"
                                                        title={flow.created_by.name}
                                                    />
                                                </div>
                                            </td>
                                            <td className="py-2 px-3 text-center text-muted-foreground">
                                                {flow.last_updated}
                                            </td>
                                            <td className="py-2 px-3 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button className="p-1 hover:bg-muted rounded">
                                                            <MoreVertical size={14} className="text-muted-foreground" />
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-background border border-input">
                                                        <DropdownMenuItem onClick={() => handleOpenFlow(flow.id)}>
                                                            <Pencil size={14} className="mr-3" />
                                                            Edit flow
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Pencil size={14} className="mr-3" />
                                                            Rename
                                                        </DropdownMenuItem>
                                                        {flow.status === "active" ? (
                                                            <DropdownMenuItem>
                                                                <CircleArrowDown size={14} className="mr-3" />
                                                                Unpublish
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem className="text-destructive">
                                                                <Trash2 size={14} className="mr-3" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(flow.id.toString())}>
                                                            <ClipboardCopy size={14} className="mr-3" />
                                                            Copy ID
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <FolderOpen size={14} className="mr-3" />
                                                            Change Folder
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Gem size={14} className="mr-3" />
                                                            Add this to Clonekit(s)
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <div className="px-2 py-2 flex items-center justify-between cursor-pointer hover:bg-accent rounded-sm">
                                                            <div className="flex items-center gap-2">
                                                                <Plug size={14} className="mr-1" />
                                                                <span className="text-sm">AI Item</span>
                                                            </div>
                                                            <Switch defaultChecked={false} />
                                                        </div>
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
                        <span className="text-muted-foreground">{filteredFlows.length} results</span>
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Rows per page:</span>
                            <Select
                                value={rowsPerPage.toString()}
                                onValueChange={(value) => {
                                    setRowsPerPage(Number(value));
                                    setCurrentPage(1);
                                }}
                            >
                                <SelectTrigger className="w-[60px] h-8 text-xs">
                                    <SelectValue placeholder={rowsPerPage} />
                                </SelectTrigger>
                                <SelectContent>
                                    {[10, 25, 50].map((pageSize) => (
                                        <SelectItem key={pageSize} value={pageSize.toString()} className="text-xs">
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <span className="text-muted-foreground ml-2">
                                Page {currentPage} of {Math.max(1, totalPages)}
                            </span>

                            <div className="flex gap-1 ml-2">
                                <button
                                    className="p-1 hover:bg-muted rounded disabled:opacity-50 transition-colors"
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronsLeft size={16} />
                                </button>
                                <button
                                    className="p-1 hover:bg-muted rounded disabled:opacity-50 transition-colors"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button
                                    className="p-1 hover:bg-muted rounded disabled:opacity-50 transition-colors"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                >
                                    <ChevronRight size={16} />
                                </button>
                                <button
                                    className="p-1 hover:bg-muted rounded disabled:opacity-50 transition-colors"
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                >
                                    <ChevronsRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Create Flow Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-40 p-4">
                    <div className="bg-white dark:bg-background rounded-lg shadow-xl max-w-lg w-full transform transition-all">
                        <div className="px-6 pt-6 pb-4">
                            <h3 className="text-lg font-medium leading-6 mb-1">Create a Smart Flow</h3>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); handleCreateFlow(); }}>
                            <div className="px-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Flow Name</label>
                                    <Input
                                        type="text"
                                        value={newFlowName}
                                        onChange={(e) => setNewFlowName(e.target.value)}
                                        placeholder="Enter flow name..."
                                        className="w-full"
                                        maxLength={250}
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Select Folder</label>
                                    <select className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                                        <option value="">Root Folder</option>
                                        {folders.map((folder: any) => (
                                            <option key={folder.id} value={folder.id}>{folder.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="px-6 py-4 mt-5 flex gap-3 justify-end border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setNewFlowName("");
                                        setIsCreating(false);
                                    }}
                                    disabled={isCreating}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={!newFlowName.trim() || isCreating}
                                    className="min-w-[100px]"
                                >
                                    {isCreating ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating...
                                        </>
                                    ) : (
                                        "Create"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create Folder Modal */}
            {showFolderModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-40 p-4">
                    <div className="bg-white dark:bg-background rounded-lg shadow-xl max-w-lg w-full transform transition-all">
                        <div className="px-6 pt-6 pb-4">
                            <h3 className="text-lg font-medium leading-6 mb-1">Create New Folder</h3>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); handleCreateFolder(); }}>
                            <div className="px-6">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Folder Name</label>
                                    <Input
                                        type="text"
                                        value={newFolderName}
                                        onChange={(e) => setNewFolderName(e.target.value)}
                                        placeholder="Enter folder name..."
                                        className="w-full"
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <div className="px-6 py-4 mt-5 flex gap-3 justify-end border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowFolderModal(false);
                                        setNewFolderName("");
                                        setIsCreatingFolder(false); // Assuming a new state variable for folder creation
                                    }}
                                    disabled={isCreatingFolder}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={!newFolderName.trim() || isCreatingFolder}
                                    className="min-w-[100px]"
                                >
                                    {isCreatingFolder ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating...
                                        </>
                                    ) : (
                                        "Create"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
