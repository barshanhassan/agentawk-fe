import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Trash2, Edit2, Copy, X } from "react-feather";
import { ChevronsUpDown, ChevronDown, ChevronUp, Plus, MoreVertical, PlusCircle, MinusCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
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


type TeamStatus = "Active" | "Inactive";

interface Option {
  id: string;
  name: string;
}

const statusOptions: Option[] = [
  { id: "Active", name: "Active" },
  { id: "Inactive", name: "Inactive" },
];

interface Employee {
  id: string;
  name: string;
  email: string;
}

const initialEmployees: Employee[] = [
  { id: "EMP001", name: "Alice Johnson", email: "alice.j@example.com" },
  { id: "EMP002", name: "Bob Smith", email: "bob.s@example.com" },
  { id: "EMP003", name: "Carol White", email: "carol.w@example.com" },
  { id: "EMP004", name: "David Brown", email: "david.b@example.com" },
  { id: "EMP005", name: "Eve Davis", email: "eve.d@example.com" },
  { id: "EMP006", name: "Frank Miller", email: "frank.m@example.com" },
  { id: "EMP007", name: "Grace Wilson", email: "grace.w@example.com" },
  { id: "EMP008", name: "Henry Moore", email: "henry.m@example.com" },
];

const supervisorOptions: Option[] = initialEmployees.map(emp => ({
  id: emp.id,
  name: emp.name,
}));

interface Team {
  id: string;
  teamName: string;
  supervisorId: string; // ID of the employee who is supervisor
  agents: string[]; // Array of employee IDs who are agents
  status: TeamStatus;
}

const initialTeams: Team[] = [
  {
    id: "TEAM001",
    teamName: "Alpha Squad",
    supervisorId: "EMP001",
    agents: ["EMP002", "EMP003"],
    status: "Active",
  },
  {
    id: "TEAM002",
    teamName: "Beta Force",
    supervisorId: "EMP004",
    agents: ["EMP005"],
    status: "Inactive",
  },
  {
    id: "TEAM003",
    teamName: "Gamma Group",
    supervisorId: "EMP006",
    agents: ["EMP007", "EMP008"],
    status: "Active",
  },
];

export default function TeamManagementSection() {
  const { toast } = useToast();
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const currentUserName = "Demo User"; // TODO: Get from auth context
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sort, setSort] = useState<{ column: string; direction: "asc" | "desc" } | null>(null);
  const [filterSupervisor, setFilterSupervisor] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<TeamStatus[]>([]);
  const [isInvitedUserEditing, setIsInvitedUserEditing] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [rowsDropdownOpen, setRowsDropdownOpen] = useState(false);

  // Create Team Modal State
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newSupervisorId, setNewSupervisorId] = useState<string>("");
  const [newAgents, setNewAgents] = useState<string[]>([]);

  // Edit Team Modal State
  const [showEditTeamModal, setShowEditTeamModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [editTeamName, setEditTeamName] = useState("");
  const [editSupervisorId, setEditSupervisorId] = useState<string>("");
  const [editStatus, setEditStatus] = useState<TeamStatus>("Active");
  const [assignedAgents, setAssignedAgents] = useState<string[]>([]);

  // Delete Team Modal State
  const [showDeleteTeamModal, setShowDeleteTeamModal] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);



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
    let data = [...teams];

    // Apply search
    if (search) {
      data = data.filter(team => {
        const supervisor = initialEmployees.find(emp => emp.id === team.supervisorId);
        return (
          team.teamName.toLowerCase().includes(search.toLowerCase()) ||
          (supervisor?.name && supervisor.name.toLowerCase().includes(search.toLowerCase()))
        );
      });
    }

    // Apply supervisor filter
    if (filterSupervisor.length > 0) {
      data = data.filter(team => filterSupervisor.includes(team.supervisorId));
    }

    // Apply status filter
    if (filterStatus.length > 0) {
      data = data.filter(team => filterStatus.includes(team.status));
    }

    // Apply sorting
    if (sort) {
      data.sort((a, b) => {
        let aVal: any;
        let bVal: any;

        if (sort.column === "teamSupervisor") {
          aVal = initialEmployees.find(emp => emp.id === a.supervisorId)?.name || "";
          bVal = initialEmployees.find(emp => emp.id === b.supervisorId)?.name || "";
        } else if (sort.column === "numberOfAgents") {
          aVal = a.agents.length;
          bVal = b.agents.length;
        } else {
          aVal = a[sort.column as keyof Team];
          bVal = b[sort.column as keyof Team];
        }

        let comparison = 0;

        // Custom sort order for status
        if (sort.column === "status") {
          const statusOrder: Record<TeamStatus, number> = {
            "Active": 0,
            "Inactive": 1,
          };
          comparison = statusOrder[aVal as TeamStatus] - statusOrder[bVal as TeamStatus];
        } else if (typeof aVal === "string" && typeof bVal === "string") {
          comparison = aVal.localeCompare(bVal);
        } else if (typeof aVal === "number" && typeof bVal === "number") {
          comparison = aVal - bVal;
        }

        return sort.direction === "asc" ? comparison : -comparison;
      });
    }

    // Apply pagination
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const totalFilteredTeams = () => {
    let data = [...teams];

    // Apply search
    if (search) {
      data = data.filter(team => {
        const supervisor = initialEmployees.find(emp => emp.id === team.supervisorId);
        return (
          team.teamName.toLowerCase().includes(search.toLowerCase()) ||
          (supervisor?.name && supervisor.name.toLowerCase().includes(search.toLowerCase()))
        );
      });
    }
    // Apply supervisor filter
    if (filterSupervisor.length > 0) {
      data = data.filter(team => filterSupervisor.includes(team.supervisorId));
    }

    // Apply status filter
    if (filterStatus.length > 0) {
      data = data.filter(team => filterStatus.includes(team.status));
    }
    return data.length;
  };

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setEditTeamName(team.teamName);
    setEditSupervisorId(team.supervisorId);
    setEditStatus(team.status);
    setAssignedAgents(team.agents);
    setShowEditTeamModal(true);
  };

  const handleCopyTeam = (team: Team) => {
    const supervisor = initialEmployees.find(emp => emp.id === team.supervisorId);
    const teamText = `${team.teamName} - ${supervisor?.name || "N/A"} - ${team.agents.length} agents`;
    navigator.clipboard.writeText(teamText);
    toast({
      title: "Copied to clipboard",
      description: teamText,
    });
  };

  const handleDeleteTeam = (team: Team) => {
    setTeamToDelete(team);
    setShowDeleteTeamModal(true);
  };

  const handleConfirmDeleteTeam = () => {
    if (teamToDelete) {
      setTeams(teams.filter(t => t.id !== teamToDelete.id));
      toast({
        title: "Team Deleted",
        description: `${teamToDelete.teamName} has been deleted`,
      });
      setShowDeleteTeamModal(false);
      setTeamToDelete(null);
    }
  };





  const handleCreateTeam = () => {
    if (!newTeamName.trim() || !newSupervisorId || newAgents.length === 0) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields (Team Name, Supervisor, and at least one Agent)",
        variant: "destructive",
      });
      return;
    }
    const newTeam: Team = {
      id: `TEAM${String(teams.length + 1).padStart(3, "0")}`,
      teamName: newTeamName,
      supervisorId: newSupervisorId,
      agents: newAgents,
      status: "Active", // Default status for new teams
    };
    setTeams([...teams, newTeam]);
    toast({
      title: "Team Created",
      description: `${newTeamName} has been created successfully`,
    });
    // Reset form
    setNewTeamName("");
    setNewSupervisorId("");
    setNewAgents([]);
    setShowCreateTeamModal(false);
  };

  const handleSaveEditTeam = () => {
    if (!editTeamName.trim() || !editSupervisorId || assignedAgents.length === 0) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields (Team Name, Supervisor, and at least one Agent)",
        variant: "destructive",
      });
      return;
    }
    if (editingTeam) {
      setTeams(
        teams.map(t =>
          t.id === editingTeam.id
            ? {
              ...t,
              teamName: editTeamName,
              supervisorId: editSupervisorId,
              agents: assignedAgents,
              status: editStatus,
            }
            : t
        )
      );
      toast({
        title: "Team Updated",
        description: `${editTeamName} has been updated successfully`,
      });
      setShowEditTeamModal(false);
      setEditingTeam(null);
      setEditTeamName("");
      setEditSupervisorId("");
      setAssignedAgents([]);
      setEditStatus("Active");
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
            <div className="py-2 px-5 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between bg-blue-50/20 dark:bg-transparent">
                <div className="flex items-center gap-6">
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 border border-blue-500/10 shadow-inner">
                        <Users size={20} strokeWidth={2.5} />
                    </div>
                    <div className="space-y-0.5">
                        <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                            Team Management
                        </h1>
                        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                            Create and manage cross-functional teams and their supervisors
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button 
                        onClick={() => setShowCreateTeamModal(true)}
                        className="h-8 px-4 rounded-lg bg-blue-600 text-white font-semibold text-[11px] shadow-lg shadow-blue-500/20 transition-all duration-300 active:scale-95 flex items-center gap-2 border-0 hover:bg-blue-700"
                    >
                        <Plus size={14} strokeWidth={2.5} />
                        <span>Create Team</span>
                    </Button>
                </div>
            </div>

            {/* 2. Unified Filter Row Section */}
            <div className="px-3 py-1.5 border-b border-slate-200 dark:border-slate-800/80 bg-white dark:bg-transparent flex items-center gap-2 flex-wrap">
                {/* Search */}
                <div className="relative group flex-1 min-w-[240px] max-w-sm">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search teams..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-8 h-8.5 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 rounded-lg text-[12px] font-medium focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400 focus:ring-1 focus:ring-blue-500/20"
                    />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 ml-auto">
                    <CustomDropdown
                        options={supervisorOptions}
                        selected={filterSupervisor}
                        onChange={(selectedIds) => setFilterSupervisor(selectedIds)}
                        placeholder="Supervisor"
                        width="160px"
                    />
                    <CustomDropdown
                        options={statusOptions}
                        selected={filterStatus}
                        onChange={(selectedIds) => setFilterStatus(selectedIds as TeamStatus[])}
                        placeholder="Status"
                        width="120px"
                    />
                </div>
            </div>

            {/* 3. Table Content Area */}
            <div className="flex-1 overflow-auto min-h-[150px]">
                <table className="w-full text-left border-separate border-spacing-0">
                    <thead className="sticky top-0 z-10 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md">
                        <tr>
                            <th 
                                onClick={() => handleColumnSort("teamName")}
                                className="px-5 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-100/50 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    Team Name
                                    {renderSortIcon("teamName")}
                                </div>
                            </th>
                            <th 
                                onClick={() => handleColumnSort("teamSupervisor")}
                                className="px-5 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-100/50 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    Team Supervisor
                                    {renderSortIcon("teamSupervisor")}
                                </div>
                            </th>
                            <th 
                                onClick={() => handleColumnSort("numberOfAgents")}
                                className="px-5 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-100/50 transition-colors"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    Agents
                                    {renderSortIcon("numberOfAgents")}
                                </div>
                            </th>
                            <th 
                                onClick={() => handleColumnSort("status")}
                                className="px-5 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-100/50 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    Status
                                    {renderSortIcon("status")}
                                </div>
                            </th>
                            <th className="px-5 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 w-20">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {getFilteredAndSortedData().length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-20 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="p-4 rounded-full bg-slate-50 dark:bg-slate-800">
                                            <Search className="w-8 h-8 text-slate-300" />
                                        </div>
                                        <p className="text-sm font-medium text-slate-400">No teams found matching your criteria</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            getFilteredAndSortedData().map((team) => {
                                const supervisor = initialEmployees.find(emp => emp.id === team.supervisorId);
                                return (
                                    <tr 
                                        key={team.id} 
                                        className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/5 transition-all duration-200"
                                    >
                                        <td className="px-5 py-2.5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                    {team.teamName.substring(0, 2).toUpperCase()}
                                                </div>
                                                <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-200">
                                                    {team.teamName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-2.5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                    <Users size={12} className="text-slate-400" />
                                                </div>
                                                <span className="text-[13px] font-medium text-slate-600 dark:text-slate-300">
                                                    {supervisor?.name || "N/A"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-2.5">
                                            <div className="flex justify-center">
                                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-[12px] font-bold text-slate-600 dark:text-slate-400">
                                                    {team.agents.length}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-2.5">
                                            <span className={cn(
                                                "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase",
                                                team.status === "Active" 
                                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" 
                                                    : "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                                            )}>
                                                {team.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-2.5">
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
                                                        onClick={() => handleEditTeam(team)}
                                                        className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium rounded-lg cursor-pointer transition-colors"
                                                    >
                                                        <Edit2 size={13} className="text-blue-500" />
                                                        Edit Team
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        onClick={() => handleCopyTeam(team)}
                                                        className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium rounded-lg cursor-pointer transition-colors"
                                                    >
                                                        <Copy size={13} className="text-slate-400" />
                                                        Copy Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        onClick={() => handleDeleteTeam(team)}
                                                        className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-rose-600 rounded-lg cursor-pointer transition-colors hover:bg-rose-50 dark:hover:bg-rose-900/20"
                                                    >
                                                        <Trash2 size={13} />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* 4. Footer / Pagination Section */}
            <div className="px-5 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-transparent flex items-center justify-between">
                <div className="flex items-center gap-4 text-[11px] font-medium text-slate-500">
                    <span>{totalFilteredTeams()} teams total</span>
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
                        <span>{Math.ceil(totalFilteredTeams() / rowsPerPage)}</span>
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
                            onClick={() => setPage(prev => Math.min(Math.ceil(totalFilteredTeams() / rowsPerPage), prev + 1))}
                            disabled={page === Math.ceil(totalFilteredTeams() / rowsPerPage)}
                        >
                            <ChevronRight size={12} />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 rounded-md border-slate-200 dark:border-slate-800"
                            onClick={() => setPage(Math.ceil(totalFilteredTeams() / rowsPerPage))}
                            disabled={page === Math.ceil(totalFilteredTeams() / rowsPerPage)}
                        >
                            <ChevronsRight size={12} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
      {/* Create Team Modal */}
      <Dialog open={showCreateTeamModal} onOpenChange={setShowCreateTeamModal}>
        <DialogContent className="max-w-xl">
          <DialogHeader className="mb-2">
            <DialogTitle>Create Team</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Team Name Input */}
            <div>
              <label className="text-sm font-medium text-foreground">Team Name<span className="text-red-500 pl-0.5">*</span></label>
              <div className="relative">
                <Input
                  placeholder="Enter team name"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  maxLength={50}
                  className="pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {newTeamName.length}/50
                </span>
              </div>
            </div>

            {/* Team Supervisor Dropdown */}
            <div>
              <label className="text-sm font-medium text-foreground">Team Supervisor<span className="text-red-500 pl-0.5">*</span></label>
              <CustomDropdown
                options={initialEmployees.map(emp => ({ id: emp.id, name: emp.name }))}
                selected={newSupervisorId ? [newSupervisorId] : []}
                onChange={(selectedIds) => setNewSupervisorId(selectedIds[0] || "")}
                placeholder="Select a supervisor"
                showSelectedOption={true}
                width="100%"
              />
            </div>

            {/* Agent Assignment */}
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Available Agents</h4>
                  <div className="border rounded-md pl-3 pr-1 py-2 h-40 overflow-y-auto">
                    {initialEmployees
                      .filter(emp => emp.id !== newSupervisorId && !newAgents.includes(emp.id))
                      .map(emp => (
                        <div key={emp.id} className="flex items-center justify-between py-1">
                          <span className="text-sm">{emp.name}</span>
                          <Button
                            variant="ghost"
                            size="icon" // Changed from "default" to "icon"
                            onClick={() => setNewAgents([...newAgents, emp.id])}
                          >
                            <PlusCircle size={16} />
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Assigned Agents<span className="text-red-500 pl-0.5">*</span></h4>
                  <div className="border rounded-md pl-3 pr-1 py-2 h-40 overflow-y-auto">
                    {initialEmployees
                      .filter(emp => newAgents.includes(emp.id))
                      .map(emp => (
                        <div key={emp.id} className="flex items-center justify-between py-1">
                          <span className="text-sm">{emp.name}</span>
                          <Button
                            variant="ghost"
                            size="icon" // Changed from "default" to "icon"
                            onClick={() => setNewAgents(newAgents.filter(id => id !== emp.id))}
                          >
                            <MinusCircle size={16} />
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex gap-2 justify-end mt-2">
            <Button
              onClick={() => setShowCreateTeamModal(false)}
              variant="outline"
              className="border-input [border-color:hsl(var(--input))] font-normal"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateTeam}
              className="btn-outline-primary font-normal"
              variant="outline"
            >
              Create Team
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Edit Team Modal */}
      <Dialog open={showEditTeamModal} onOpenChange={setShowEditTeamModal}>
        <DialogContent className="max-w-xl">
          <DialogHeader className="mb-2">
            <DialogTitle>Edit Team</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Team Name Input */}
            <div>
              <label className="text-sm font-medium text-foreground">Team Name<span className="text-red-500 pl-0.5">*</span></label>
              <div className="relative">
                <Input
                  placeholder="Enter team name"
                  value={editTeamName}
                  onChange={(e) => setEditTeamName(e.target.value)}
                  maxLength={50}
                  className="pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {editTeamName.length}/50
                </span>
              </div>
            </div>

            {/* Team Supervisor Dropdown */}
            <div>
              <label className="text-sm font-medium text-foreground">Team Supervisor<span className="text-red-500 pl-0.5">*</span></label>
              <CustomDropdown
                options={initialEmployees.map(emp => ({ id: emp.id, name: emp.name }))}
                selected={editSupervisorId ? [editSupervisorId] : []}
                onChange={(selectedIds) => setEditSupervisorId(selectedIds[0] || "")}
                placeholder="Select a supervisor"
                showSelectedOption={true}
                width="100%"
              />
            </div>

            {/* Agent Assignment */}
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Available Agents</h4>
                  <div className="border rounded-md pl-3 pr-1 py-2 h-40 overflow-y-auto">
                    {initialEmployees
                      .filter(emp => emp.id !== editSupervisorId && !assignedAgents.includes(emp.id))
                      .map(emp => (
                        <div key={emp.id} className="flex items-center justify-between py-1">
                          <span className="text-sm">{emp.name}</span>
                          <Button
                            variant="ghost"
                            size="icon" // Changed from "default" to "icon"
                            onClick={() => setAssignedAgents([...assignedAgents, emp.id])}
                          >
                            <PlusCircle size={16} />
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Assigned Agents<span className="text-red-500 pl-0.5">*</span></h4>
                  <div className="border rounded-md pl-3 pr-1 py-2 h-40 overflow-y-auto">
                    {initialEmployees
                      .filter(emp => assignedAgents.includes(emp.id))
                      .map(emp => (
                        <div key={emp.id} className="flex items-center justify-between py-1">
                          <span className="text-sm">{emp.name}</span>
                          <Button
                            variant="ghost"
                            size="icon" // Changed from "default" to "icon"
                            onClick={() => setAssignedAgents(assignedAgents.filter(id => id !== emp.id))}
                          >
                            <MinusCircle size={16} />
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Status Select */}
            <div>
              <label className="text-sm font-medium text-foreground">Status<span className="text-red-500 pl-0.5">*</span></label>
              <Select value={editStatus} onValueChange={(value: TeamStatus) => setEditStatus(value)}>
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

          {/* Modal Footer */}
          <div className="flex gap-2 justify-end mt-2">
            <Button
              onClick={() => setShowEditTeamModal(false)}
              variant="outline"
              className="border-input [border-color:hsl(var(--input))] font-normal"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEditTeam}
              className="btn-outline-primary font-normal"
              variant="outline"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Delete Team Modal */}
      <Dialog open={showDeleteTeamModal} onOpenChange={setShowDeleteTeamModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader className="mb-2">
            <DialogTitle>Delete Team</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-foreground">
              Are you sure you want to delete <span className="font-semibold break-all">{teamToDelete?.teamName}</span>? This action cannot be undone.
            </p>
          </div>

          {/* Modal Footer */}
          <div className="flex gap-2 justify-end mt-2">
            <Button
              onClick={() => setShowDeleteTeamModal(false)}
              variant="outline"
              className="border-input [border-color:hsl(var(--input))]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDeleteTeam}
              className="btn-outline-destructive"
              variant="outline"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>



    </div>
  );
}