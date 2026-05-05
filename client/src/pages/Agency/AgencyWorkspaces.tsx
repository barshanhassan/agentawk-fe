import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Layers, 
  Plus, 
  Search, 
  ExternalLink, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  Monitor,
  BarChart3,
  Wallet,
  Ban,
  Trash2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";


import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import CreateWorkspaceForm from "./CreateWorkspaceForm";
import WorkspaceUsageView from "./WorkspaceUsageView";
import AgencyVoiceWallet from "./AgencyVoiceWallet";

const AgencyWorkspaces = () => {
  const { mode } = useTheme();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<'LIST' | 'CREATE' | 'EDIT' | 'USAGE' | 'VOICE_WALLET'>('LIST');
  const [selectedWorkspace, setSelectedWorkspace] = useState<any>(null);

  const userInfo = JSON.parse(localStorage.getItem("user_info") || "{}");
  const agencyId = userInfo.modelable_id || "7";

  const { data: workspacesResponse, isLoading: workspacesLoading } = useQuery({
    queryKey: [`/api/agencies/${agencyId}/workspaces`],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/agencies/${agencyId}/workspaces`);
      return res.json();
    }
  });

  const workspaces = (workspacesResponse?.workspaces || []).map((ws: any) => ({
    id: ws.id,
    name: ws.name,
    createdAt: ws.created_at ? format(new Date(ws.created_at), "yyyy-MM-dd hh:mm a") : "N/A",
    status: (ws.status === 'active' || ws.status === 'ACTIVE') ? 'Active' : 'Suspended',
    hasLogin: true,
    customLogo: ws.custom_logo || false
  }));

  const [localWorkspaces, setLocalWorkspaces] = useState<any[]>([]);

  useEffect(() => {
    if (workspaces.length > 0) {
      setLocalWorkspaces(workspaces);
    }
  }, [workspacesResponse]);

  // Use localWorkspaces for filtering/searching to allow local UI updates (like suspend)
  const displayWorkspaces = localWorkspaces.length > 0 ? localWorkspaces : workspaces;

  const handleManage = (workspace: any) => {
    setSelectedWorkspace(workspace);
    setViewMode('EDIT');
  };

  const handleShowUsage = (workspace: any) => {
    setSelectedWorkspace(workspace);
    setViewMode('USAGE');
  };

  const handleVoiceWallet = (workspace: any) => {
    setSelectedWorkspace(workspace);
    setViewMode('VOICE_WALLET');
  };

  const toggleStatusMutation = useMutation({
    mutationFn: async (workspace: any) => {
      const isActive = workspace.status === 'Active';
      const endpoint = `/api/agencies/${agencyId}/workspaces/${workspace.id}/${isActive ? 'suspend' : 'activate'}`;
      const res = await apiRequest("POST", endpoint);
      return res.json();
    },
    onSuccess: (_, workspace) => {
      const newStatus = workspace.status === 'Active' ? 'Suspended' : 'Active';
      setLocalWorkspaces(prev => prev.map(ws => 
        ws.id === workspace.id ? { ...ws, status: newStatus } : ws
      ));
      toast({
        title: `Workspace ${newStatus}`,
        description: `${workspace.name} has been ${newStatus.toLowerCase()} successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: [`/api/agencies/${agencyId}/workspaces`] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update workspace status.", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (workspace: any) => {
      const res = await apiRequest("DELETE", `/api/agencies/${agencyId}/workspaces/${workspace.id}`);
      return res.json();
    },
    onSuccess: (_, workspace) => {
      setLocalWorkspaces(prev => prev.filter(ws => ws.id !== workspace.id));
      toast({
        title: "Workspace Deleted",
        description: `${workspace.name} has been removed from your agency.`,
        variant: "destructive",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/agencies/${agencyId}/workspaces`] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete workspace.", variant: "destructive" });
    }
  });

  const handleToggleStatus = (workspace: any) => {
    toggleStatusMutation.mutate(workspace);
  };

  const handleDelete = (workspace: any) => {
    if (confirm(`Are you sure you want to delete ${workspace.name}? This action cannot be undone.`)) {
      deleteMutation.mutate(workspace);
    }
  };
  const handleLogin = (workspace: any) => {
    toast({
      title: "Logging in...",
      description: `Redirecting you to ${workspace.name} dashboard.`,
    });
    // In real app: window.open(`/login-to-workspace/${workspace.id}`, '_blank');
  };

  const [searchQuery, setSearchQuery] = useState('');
  const filteredWorkspaces = displayWorkspaces.filter((ws: any) => 
    ws.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (viewMode === 'VOICE_WALLET') {
    return (
      <AgencyVoiceWallet 
        workspace={selectedWorkspace} 
        onBack={() => {
          setViewMode('LIST');
          setSelectedWorkspace(null);
        }} 
      />
    );
  }

  if (viewMode === 'CREATE' || viewMode === 'EDIT') {
    return (
      <CreateWorkspaceForm 
        onCancel={() => {
          setViewMode('LIST');
          setSelectedWorkspace(null);
        }} 
        initialData={selectedWorkspace}
      />
    );
  }

  if (viewMode === 'USAGE') {
    return (
      <WorkspaceUsageView 
        workspace={selectedWorkspace} 
        onBack={() => {
          setViewMode('LIST');
          setSelectedWorkspace(null);
        }} 
      />
    );
  }

  return (
    <div className={cn("p-6 font-sans transition-colors duration-300", mode === "dark" ? "text-white" : "text-slate-900")}>
      <div className={cn("rounded-lg border overflow-hidden shadow-sm transition-colors flex flex-col",
        mode === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-300")}>
        
        {/* Header Section Inside Card */}
        <div className="flex items-center justify-between p-5 pb-3 transition-colors">
          <div className="flex items-center gap-3">
            <div className={cn("p-1 rounded-lg transition-colors")}>
              <Layers className={cn("w-6 h-6", mode === "dark" ? "text-slate-300" : "text-slate-800")} />
            </div>
            <div>
              <h1 className={cn("text-[15px] font-bold tracking-tight", mode === "dark" ? "text-white" : "text-slate-900")}>Workspaces</h1>
              <p className={cn("text-[12px] font-medium mt-0.5", mode === "dark" ? "text-slate-400" : "text-slate-600")}>Workspaces (sub-accounts) belonging to either you or your customers.</p>
            </div>
          </div>
          <button 
            onClick={() => setViewMode('CREATE')}
            className={cn("px-5 py-1.5 rounded text-[12px] font-medium transition-colors border",
              mode === "dark" ? "bg-[#1e293b] hover:bg-[#00e55e] text-[#00e55e] hover:text-white border-[#00e55e]" : "bg-white hover:bg-[#00e55e] hover:text-white text-[#00e55e] border-[#00e55e]")}
          >
             + Add Workspace
          </button>
        </div>

        {/* Filter Bar Inside Card */}
        <div className="px-5 py-3 flex flex-col md:flex-row items-center justify-between gap-3 transition-colors">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn("pl-10 h-9 text-[12px] focus-visible:ring-1 focus-visible:ring-green-500 transition-colors rounded",
                  mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900")} 
              />
            </div>
            <button className={cn("px-4 h-8 rounded text-[11px] font-bold transition-all border",
              mode === "dark" ? "bg-[#1e293b] hover:bg-[#00e55e] text-[#00e55e] hover:text-white border-[#00e55e]" : "bg-white hover:bg-[#00e55e] hover:text-white text-[#00e55e] border-[#00e55e]")}>Search</button>
          </div>

            <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Checkbox id="inactive" className="border-slate-300 data-[state=checked]:bg-green-500 w-4 h-4" />
              <label htmlFor="inactive" className={cn("text-[12px] cursor-pointer font-medium", mode === "dark" ? "text-slate-400" : "text-slate-700")}>Show inactive</label>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className={cn("flex items-center gap-1.5 text-[12px] hover:text-green-600 transition-colors font-medium outline-none", mode === "dark" ? "text-slate-400" : "text-slate-700")}>
                <span className="flex items-center gap-1">
                  <Menu className="w-4 h-4 rotate-90 opacity-50" />
                  From newest
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className={cn("border shadow-xl", mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900")}>
                <DropdownMenuItem className={cn(mode === "dark" ? "hover:bg-[#334155]" : "hover:bg-slate-50 font-bold text-slate-700")}>From newest</DropdownMenuItem>
                <DropdownMenuItem className={cn(mode === "dark" ? "hover:bg-[#334155]" : "hover:bg-slate-50 font-bold text-slate-700")}>From oldest</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

      {/* Workspaces List Area */}
      <div className="flex-1 flex flex-col transition-all">
        
        {filteredWorkspaces.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
             <div className="w-20 h-20 mb-5 relative">
                <div className="absolute inset-0 bg-green-500/5 rounded-full" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <Layers className="w-10 h-10 text-green-500/20" />
                </div>
             </div>
             <h3 className={cn("text-[15px] font-bold mb-5 tracking-tight", mode === "dark" ? "text-slate-400" : "text-slate-500")}>No Workspace found</h3>
             <button 
                onClick={() => setViewMode('CREATE')}
                className={cn("px-6 py-1.5 rounded text-[12px] font-medium transition-colors border",
                  mode === "dark" ? "bg-[#1e293b] hover:bg-[#00e55e] text-[#00e55e] hover:text-white border-[#00e55e]" : "bg-white hover:bg-[#00e55e] hover:text-white text-[#00e55e] border-[#00e55e]")}
              >
                + Add Workspace
              </button>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className={cn("border-b transition-colors", mode === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-300")}>
              <tr>
                <th className={cn("px-5 py-3 text-[10px] font-bold uppercase tracking-widest", mode === "dark" ? "text-slate-300" : "text-slate-700")}>NAME</th>
                <th className={cn("px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-center", mode === "dark" ? "text-slate-300" : "text-slate-700")}>LOGIN</th>
                <th className={cn("px-5 py-3 text-[10px] font-bold uppercase tracking-widest", mode === "dark" ? "text-slate-300" : "text-slate-700")}>CREATED AT</th>
                <th className={cn("px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-center", mode === "dark" ? "text-slate-300" : "text-slate-700")}>STATUS</th>
                <th className={cn("px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-right", mode === "dark" ? "text-slate-300" : "text-slate-700")}>ACTION</th>
              </tr>
            </thead>
            <tbody className={cn("divide-y transition-colors", mode === "dark" ? "divide-slate-700" : "divide-slate-100")}>
              {filteredWorkspaces.map((ws: any, i: number) => (
                <tr key={i} className={cn("transition-colors group",
                  mode === "dark" ? "hover:bg-[#334155]/30" : "hover:bg-slate-50")}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {ws.customLogo ? (
                        <div className="w-10 h-6 bg-white rounded flex items-center justify-center p-1 overflow-hidden border shadow-sm">
                           <span className="text-[8px] font-bold text-red-600">SMART</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                            R
                          </div>
                          <span className={cn("text-[10px] font-bold uppercase tracking-tighter", mode === "dark" ? "text-gray-400" : "text-gray-600")}>REPLYAGENT</span>
                        </div>
                      )}
                      <span className={cn("text-sm font-semibold transition-colors cursor-pointer",
                        mode === "dark" ? "text-gray-200 group-hover:text-primary" : "text-slate-700 group-hover:text-green-600")}>
                        {ws.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {ws.hasLogin && (
                      <button 
                        onClick={() => handleLogin(ws)}
                        className={cn("text-xs flex items-center justify-center gap-1 mx-auto transition-colors font-medium",
                        mode === "dark" ? "text-gray-300 hover:text-white" : "text-slate-500 hover:text-green-600")}>
                        Login <ExternalLink size={12} />
                      </button>
                    )}
                  </td>
                  <td className={cn("px-5 py-3 text-[12px] font-medium", mode === "dark" ? "text-gray-400" : "text-slate-600")}>
                    {ws.createdAt}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold border transition-colors",
                      ws.status === 'Active' 
                        ? (mode === "dark" ? "bg-[#14532d] text-green-400 border-green-900" : "bg-green-50 text-green-600 border-green-100")
                        : (mode === "dark" ? "bg-[#7f1d1d] text-red-400 border-red-900" : "bg-red-50 text-red-600 border-red-100")
                    )}>
                      {ws.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className={cn("p-1 rounded transition-colors outline-none",
                          mode === "dark" ? "text-gray-400 hover:text-white hover:bg-[#475569]" : "text-slate-400 hover:text-green-600 hover:bg-slate-100")}>
                          <Menu className="w-5 h-5 rotate-90" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        align="end" 
                        className={cn("w-56 p-2 border transition-colors shadow-2xl", 
                          mode === "dark" ? "bg-[#1e293b] border-slate-700 text-slate-300" : "bg-white border-slate-200 text-slate-600")}
                      >
                        <DropdownMenuItem 
                          onClick={() => handleManage(ws)}
                          className={cn("flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors outline-none",
                          mode === "dark" ? "hover:bg-slate-800 focus:bg-slate-800" : "hover:bg-slate-50 focus:bg-slate-50")}>
                          <Monitor size={18} />
                          <span className="font-semibold">Manage</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleShowUsage(ws)}
                          className={cn("flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors outline-none",
                          mode === "dark" ? "hover:bg-slate-800 focus:bg-slate-800" : "hover:bg-slate-50 focus:bg-slate-50")}>
                          <BarChart3 size={18} />
                          <span className="font-semibold">Usage</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleVoiceWallet(ws)}
                          className={cn("flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors outline-none",
                          mode === "dark" ? "hover:bg-slate-800 focus:bg-slate-800" : "hover:bg-slate-50 focus:bg-slate-50")}>
                          <Wallet size={18} />
                          <span className="font-semibold">AI Voice Credits Wallet</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleToggleStatus(ws)}
                          className={cn("flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors outline-none",
                          mode === "dark" ? "hover:bg-slate-800 focus:bg-slate-800" : "hover:bg-slate-50 focus:bg-slate-50")}>
                          <Ban size={18} />
                          <span className="font-semibold">{ws.status === 'Active' ? 'Suspend' : 'Activate'}</span>
                        </DropdownMenuItem>
                        <div className={cn("my-1 border-t", mode === "dark" ? "border-slate-800" : "border-slate-100")} />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(ws)}
                          className={cn("flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors outline-none text-red-500",
                          mode === "dark" ? "hover:bg-red-500/10 focus:bg-red-500/10" : "hover:bg-red-50 focus:bg-red-50")}>
                          <Trash2 size={18} />
                          <span className="font-semibold">Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination (Only show if workspaces exist) */}
        {filteredWorkspaces.length > 0 && (
          <div className={cn("px-5 py-3 border-t flex justify-end items-center gap-2 mt-auto",
            mode === "dark" ? "border-slate-700" : "border-slate-300 bg-white")}>
            <button className={cn("p-1 border rounded text-gray-400 hover:text-green-600 hover:border-green-600 disabled:opacity-30 transition-all", mode === "dark" ? "border-slate-700" : "border-slate-300")}>
              <ChevronLeft size={14} />
            </button>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 rounded bg-green-500 text-white text-[11px] font-bold shadow-sm">1</button>
            </div>
            <button className={cn("p-1 border rounded text-gray-400 hover:text-green-600 hover:border-green-600 transition-all", mode === "dark" ? "border-slate-700" : "border-slate-300")}>
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);
};

export default AgencyWorkspaces;
