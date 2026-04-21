import React, { useState } from "react";
import {
  Users2,
  Edit,
  Trash2,
  UserPlus,
  ArrowRight,
  Plus,
  Check,
  Users,
  Search,
  ChevronDown,
  AlertCircle
} from "lucide-react";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const INITIAL_TEAMS = [
  { id: "1", name: "Team B", distribution: "Priority distribution", agents: "7 Agents" },
  { id: "2", name: "Team A", distribution: "d_equal", agents: "6 Agents" },
  { id: "3", name: "equipe_test", distribution: "d_equal", agents: "2 Agents" },
  { id: "4", name: "suporte", distribution: "Priority distribution", agents: "2 Agents" },
  { id: "5", name: "Equipe Teste", distribution: "Priority distribution", agents: "4 Agents" },
  { id: "6", name: "teste edilson", distribution: "d_equal", agents: "7 Agents" },
];

export default function TeamsSection() {
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const { toast } = useToast();

  // Form state
  const [teamName, setTeamName] = useState("");
  const [distribution, setDistribution] = useState<"EQUAL" | "PRIORITY">("EQUAL");
  const [autoAssign, setAutoAssign] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState<any[]>([]);

  const { data: teamsData, isLoading: leadsLoading } = useQuery<any>({
    queryKey: ["/api/teams/get-all"],
  });

  const { data: membersData } = useQuery<any>({
    queryKey: ["/api/workspaces/members"],
  });

  const agents = membersData || [];
  const teams = Array.isArray(teamsData) ? teamsData : [];

  const createOrUpdateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/teams/create", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams/get-all"] });
      toast({ title: "Success", description: "Team saved successfully!" });
      setView("list");
      resetForm();
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" })
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string | number) => {
      await apiRequest("DELETE", `/api/teams/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams/get-all"] });
      toast({ title: "Success", description: "Team deleted successfully!" });
      setAlertOpen(false);
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" })
  });

  const handleEdit = (team: any) => {
    setEditingId(team.id);
    setTeamName(team.name);
    setDistribution(team.distribution);
    setAutoAssign(team.auto_assign === 1);
    setSelectedAgents(team.team_members?.map((m: any) => ({ ...m.users, priority: m.priority })) || []);
    setView("edit");
  };

  const [editingId, setEditingId] = useState<string | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const resetForm = () => {
    setTeamName("");
    setDistribution("EQUAL");
    setAutoAssign(false);
    setEditingId(null);
    setSelectedAgents([]);
  };

  const handleDelete = (id: string) => {
    setPendingDeleteId(id);
    setAlertOpen(true);
  };

  const executeDelete = () => {
    if (pendingDeleteId) {
      deleteMutation.mutate(pendingDeleteId);
    }
  };

  const handleSave = () => {
    if (!teamName) return;

    createOrUpdateMutation.mutate({
      id: editingId,
      name: teamName,
      distribution: distribution,
      auto_assign: autoAssign,
      members: selectedAgents.map(a => ({ id: a.id, priority: a.priority || 0 }))
    });
  };

  if (view === "add" || view === "edit") {
    return (
      <div className="flex flex-col min-h-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg text-left overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-6 border-b border-gray-50 dark:border-slate-800/50">
          <Users2 className="w-10 h-10 text-black dark:text-white" />
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">{view === "add" ? "Create Team" : "Edit Team"}</CardTitle>
            <CardDescription className="text-sm font-medium">Create a team and manage how they receive incoming calls, conversations, opportunities and tasks.</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          <div className="space-y-3">
            <label className="text-[13px] font-bold text-[#1e293b] dark:text-slate-200">Team name</label>
            <Input
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter team name"
              className="h-12 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-1 focus:ring-blue-600 rounded-lg"
            />
          </div>

          <div className="space-y-4">
            <p className="text-[13px] font-bold text-[#1e293b] dark:text-slate-200">Select the automated contact distribution method of team.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setDistribution("EQUAL")}
                className={cn(
                  "flex flex-col text-left p-6 rounded-xl border-2 transition-all relative group",
                  distribution === "EQUAL"
                    ? "border-blue-600 bg-blue-50/10"
                    : "border-gray-100 dark:border-slate-800 hover:border-blue-200"
                )}
              >
                <span className="text-[14px] font-bold text-[#1e293b] dark:text-slate-200">Round robin distribution - Equal</span>
                <p className="text-[12px] text-slate-500 mt-2 leading-relaxed font-medium">
                  This distribution allows automated equal distribution of incoming calls, conversations, opportunities and tasks among all agents.
                </p>
                {distribution === "EQUAL" && (
                  <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                )}
              </button>

              <button
                onClick={() => setDistribution("PRIORITY")}
                className={cn(
                  "flex flex-col text-left p-6 rounded-xl border-2 transition-all relative group",
                  distribution === "PRIORITY"
                    ? "border-blue-600 bg-blue-50/10"
                    : "border-gray-100 dark:border-slate-800 hover:border-blue-200"
                )}
              >
                <span className="text-[14px] font-bold text-[#1e293b] dark:text-slate-200">Round robin distribution - Priority</span>
                <p className="text-[12px] text-slate-500 mt-2 leading-relaxed font-medium">
                  This distribution type allows prioritization of specific agents to receive incoming calls, conversations, opportunities and tasks over others.
                </p>
                {distribution === "PRIORITY" && (
                  <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Checkbox
              id="available"
              checked={autoAssign}
              onCheckedChange={(checked) => setAutoAssign(checked as boolean)}
              className="w-5 h-5 border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 rounded"
            />
            <label htmlFor="available" className="text-[13px] font-medium text-slate-600 dark:text-slate-400">
              Assign conversations, opportunities, tasks and route calls exclusively to agents who have the <span className="font-bold text-slate-900 dark:text-slate-200 uppercase">Available</span> online status.
            </label>
          </div>

          <div className="space-y-3">
            <label className="text-[13px] font-bold text-[#1e293b] dark:text-slate-200">Add agents to this team</label>
            <div className="relative">
              <Select onValueChange={(val) => {
                const agent = agents.find((a: any) => a.id.toString() === val);
                if (agent && !selectedAgents.find(sa => sa.id === agent.id)) {
                  setSelectedAgents([...selectedAgents, { ...agent, priority: 0 }]);
                }
              }}>
                <SelectTrigger className="w-full h-12 bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-700 text-slate-500 font-medium rounded-lg">
                  <SelectValue placeholder="Search agent..." />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  {agents.filter((a: any) => !selectedAgents.find(sa => sa.id === a.id)).map((agent: any) => (
                    <SelectItem key={agent.id} value={agent.id.toString()}>
                      {agent.full_name || agent.first_name} ({agent.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 gap-3 mt-4">
              {selectedAgents.map((agent, index) => (
                <div key={agent.id} className="flex items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 transition-all hover:border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold text-xs">
                      {(agent.full_name || agent.first_name || "?")[0].toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{agent.full_name || agent.first_name}</span>
                      <span className="text-[11px] text-slate-500 font-medium">{agent.email}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {distribution === "PRIORITY" && (
                      <div className="flex items-center gap-2">
                        <Label className="text-[11px] font-bold text-slate-500 uppercase">Priority</Label>
                        <Input 
                          type="number" 
                          value={agent.priority || 0} 
                          onChange={(e) => {
                            const newAgents = [...selectedAgents];
                            newAgents[index].priority = parseInt(e.target.value) || 0;
                            setSelectedAgents(newAgents);
                          }}
                          className="h-8 w-16 text-center text-xs font-bold bg-white dark:bg-slate-900 border-slate-200 focus:ring-1 focus:ring-blue-600 rounded-md"
                        />
                      </div>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setSelectedAgents(selectedAgents.filter(sa => sa.id !== agent.id))}
                      className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>

        <Separator className="bg-gray-100 dark:bg-slate-800" />

        <div className="p-6 flex justify-end gap-3 bg-white dark:bg-slate-900">
          <Button
            variant="outline"
            onClick={() => {
              resetForm();
              setView("list");
            }}
            className="h-11 px-8 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 rounded-lg transition-colors"
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={handleSave}
            className="h-11 px-12 btn-outline-primary font-bold rounded-lg shadow-sm"
          >
            {view === "add" ? "Add" : "Save"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg text-left overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between p-6 bg-white dark:bg-slate-900 border-b border-gray-50 dark:border-slate-800/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
            <Users2 className="w-7 h-7 text-[#1e293b] dark:text-white" />
          </div>
          <div className="text-left max-w-2xl">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">Teams</CardTitle>
            <CardDescription className="text-[13px] font-medium text-slate-500 mt-1 leading-relaxed">
              Build a team and streamline workflow by automating opportunity assignment, conversation management, task allocation, and call scheduling.
            </CardDescription>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            resetForm();
            setView("add");
          }}
          className="h-10 px-6 btn-outline-primary text-[13px] whitespace-nowrap rounded-lg shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Team
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50/50 dark:bg-slate-800/30">
            <TableRow className="border-b border-slate-100 dark:border-slate-800 hover:bg-transparent">
              <TableHead className="w-[40%] text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest h-14 pl-8">Name</TableHead>
              <TableHead className="w-[30%] text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest h-14">Distribution</TableHead>
              <TableHead className="w-[20%] text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest h-14">Agents</TableHead>
              <TableHead className="w-[10%] text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest h-14 text-right pr-10">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-20 text-slate-400">No teams found. Create one to get started.</TableCell>
              </TableRow>
            ) : teams.map((team: any) => (
              <TableRow key={team.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                <TableCell className="py-5 pl-8">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-slate-50 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                      <Users className="w-4 h-4 text-slate-900 dark:text-slate-200" />
                    </div>
                    <span className="text-sm font-bold text-[#1e293b] dark:text-slate-100 tracking-tight">{team.name}</span>
                  </div>
                </TableCell>
                <TableCell className="py-5">
                  <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-[10px] py-1 px-2.5 rounded-full border-none shadow-none uppercase">
                    {team.distribution === 'PRIORITY' ? 'Priority distribution' : 'Equal distribution'}
                  </Badge>
                </TableCell>
                <TableCell className="py-5">
                  <span className="text-[13px] font-bold text-slate-500 dark:text-slate-400">{team.team_members?.length || 0} Agents</span>
                </TableCell>
                <TableCell className="py-5 text-right pr-10">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(team)}
                      className="h-9 w-9 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(team.id.toString())}
                      className="h-9 w-9 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent className="max-w-[400px] p-6 bg-white dark:bg-slate-900 border-none shadow-2xl rounded-xl">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/40 rounded-full flex items-center justify-center relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[26px] border-b-orange-200 dark:border-b-orange-800/60 translate-y-[-2px]"></div>
                </div>
                <AlertCircle className="w-10 h-10 text-orange-600 relative z-10" strokeWidth={2.5} />
              </div>
            </div>

            <div className="space-y-2">
              <AlertDialogTitle className="text-xl font-bold text-[#1e293b] dark:text-white">Are you sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-[14px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Are you sure you want to delete the entire team and its agents? This action cannot be undone.
              </AlertDialogDescription>
            </div>

            <AlertDialogFooter className="flex items-center justify-center gap-3 w-full sm:justify-center pt-2">
              <AlertDialogCancel asChild>
                <Button variant="outline" className="h-11 px-8 border-slate-200 text-slate-600 hover:bg-slate-50 font-bold min-w-[100px] rounded-lg transition-colors">
                  Close
                </Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  onClick={executeDelete}
                  className="h-11 px-10 bg-[#f97316] hover:bg-orange-600 text-white font-bold border-none min-w-[140px] rounded-lg shadow-sm"
                >
                  Yes I'm sure
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
