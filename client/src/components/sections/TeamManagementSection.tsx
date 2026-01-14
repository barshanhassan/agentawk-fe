import { useState, useRef, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Trash2, Edit2, Copy, X } from "react-feather";
import { ChevronsUpDown, ChevronDown, ChevronUp, Plus, MoreVertical, PlusCircle, MinusCircle } from "lucide-react";
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
  const currentUserName = "Admin User"; // TODO: Get from auth context
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
    <div className="space-y-6">
      {/* Header Section - Outside Card */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Team Management</h1>
        <Button
          onClick={() => setShowCreateTeamModal(true)}
          className="btn-outline-primary gap-2 h-9 font-normal"
          variant="outline"
        >
          <Plus size={16} />
          Create Team
        </Button>
      </div>

      {/* Search Section */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs" style={{ height: "38px" }}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search teams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 text-sm w-full h-full border border-input rounded-md bg-background focus:outline-none transition-colors"
          />
        </div>
        <CustomDropdown
          options={supervisorOptions}
          selected={filterSupervisor}
          onChange={(selectedIds) => setFilterSupervisor(selectedIds)}
          placeholder="Supervisor"
          width="190px"
        />
        <CustomDropdown
          options={statusOptions}
          selected={filterStatus}
          onChange={(selectedIds) => setFilterStatus(selectedIds as TeamStatus[])}
          placeholder="Status"
          width="120px"
        />
      </div>

      {/* Table Card */}
      <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
        <CardContent className="pt-2">
          {/* Table */}
          <div className="overflow-x-auto mt-6">
            <table className="w-full text-xs">
              <thead className="select-none">
                <tr className="border-b">
                  <th
                    className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                    onClick={() => handleColumnSort("teamName")}
                  >
                    <div className="flex items-center gap-2">
                      Team Name
                      {renderSortIcon("teamName")}
                    </div>
                  </th>
                  <th
                    className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                    onClick={() => handleColumnSort("teamSupervisor")}
                  >
                    <div className="flex items-center gap-2">
                      Team Supervisor
                      {renderSortIcon("teamSupervisor")}
                    </div>
                  </th>
                  <th
                    className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                    onClick={() => handleColumnSort("numberOfAgents")}
                  >
                    <div className="flex items-center gap-2">
                      Number of Agents
                      {renderSortIcon("numberOfAgents")}
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
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredAndSortedData().length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-muted-foreground">
                      No teams found.
                    </td>
                  </tr>
                ) : (
                  getFilteredAndSortedData().map((team) => {
                    const supervisor = initialEmployees.find(emp => emp.id === team.supervisorId);
                    return (
                      <tr key={team.id} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-3">{team.teamName}</td>
                        <td className="py-2 px-3">{supervisor?.name || "N/A"}</td>
                        <td className="py-2 px-3">{team.agents.length}</td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${team.status === "Active" ? "bg-green-100 text-green-700" :
                            "bg-red-100 text-red-700"
                            }`}>
                            {team.status}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="p-1 hover:bg-muted rounded">
                                  <MoreVertical size={14} className="text-muted-foreground" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-white dark:bg-background">
                                <DropdownMenuItem onClick={() => handleEditTeam(team)}>
                                  <Edit2 size={14} className="mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleCopyTeam(team)}>
                                  <Copy size={14} className="mr-2" />
                                  Copy
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteTeam(team)} className="text-destructive">
                                  <Trash2 size={14} className="mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 text-xs">
            <span className="text-muted-foreground">{totalFilteredTeams()} results</span>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Rows per page:</span>
              <div className="relative w-15" ref={dropdownRef}>
                <button
                  type="button"
                  className="flex items-center justify-between px-3 py-2 text-left bg-background border border-input rounded-md shadow-sm hover:bg-accent focus:outline-none text-foreground transition-colors"
                  onClick={() => setRowsDropdownOpen(!rowsDropdownOpen)}
                >
                  <span className="truncate text-xs font-normal">{rowsPerPage}</span>
                  <ChevronDown className="h-3 w-3 ml-2 text-muted-foreground" />
                </button>
                {rowsDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-background rounded-md shadow-md border border-border">
                    <ul className="py-1">
                      {[10, 25, 50].map(option => (
                        <li
                          key={option}
                          className="px-3 py-2 text-xs cursor-pointer hover:bg-muted"
                          onClick={() => {
                            setRowsPerPage(option);
                            setPage(1); // Reset to first page when rows per page changes
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
              <span className="text-muted-foreground">Page {page} of {Math.ceil(totalFilteredTeams() / rowsPerPage)}</span>
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
                  onClick={() => setPage(prev => Math.min(Math.ceil(totalFilteredTeams() / rowsPerPage), prev + 1))}
                  disabled={page === Math.ceil(totalFilteredTeams() / rowsPerPage)}
                >
                  <ChevronRight size={16} />
                </button>
                <button
                  className="p-1 hover:bg-muted rounded disabled:opacity-50"
                  onClick={() => setPage(Math.ceil(totalFilteredTeams() / rowsPerPage))}
                  disabled={page === Math.ceil(totalFilteredTeams() / rowsPerPage)}
                >
                  <ChevronsRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
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