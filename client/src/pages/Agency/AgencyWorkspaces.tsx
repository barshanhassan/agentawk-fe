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
    status: ws.status === 'active' ? 'Active' : 'Inactive',
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

  const handleToggleStatus = (workspace: any) => {
    const isActive = workspace.status === 'Active';
    const newStatus = isActive ? 'Suspended' : 'Active';
    
    setLocalWorkspaces(prev => prev.map(ws => 
      ws.id === workspace.id ? { ...ws, status: newStatus } : ws
    ));

    toast({
      title: `Workspace ${newStatus}`,
      description: `${workspace.name} has been ${newStatus.toLowerCase()} successfully.`,
    });
  };

  const handleDelete = (workspace: any) => {
    if (confirm(`Are you sure you want to delete ${workspace.name}? This action cannot be undone.`)) {
      setLocalWorkspaces(prev => prev.filter(ws => ws.id !== workspace.id));
      toast({
        title: "Workspace Deleted",
        description: `${workspace.name} has been removed from your agency.`,
        variant: "destructive",
      });
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
      {/* Header Section */}
      <div className={cn("flex items-center justify-between mb-8 p-4 rounded-md border shadow-sm transition-colors",
        mode === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-200")}>
        <div className="flex items-center gap-4">
          <div className={cn("p-2 rounded", mode === "dark" ? "bg-[#334155]" : "bg-slate-100")}>
            <Layers className={cn("w-6 h-6", mode === "dark" ? "text-white" : "text-primary")} />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Workspaces</h1>
            <p className="text-gray-400 text-sm">Workspaces (sub-accounts) belonging to either you or your customers.</p>
          </div>
        </div>
        <button 
          onClick={() => setViewMode('CREATE')}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded font-bold text-sm transition-colors flex items-center gap-2"
        >
           Create Workspace
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input 
              placeholder="Search" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn("pl-10 focus-visible:ring-1 focus-visible:ring-primary transition-colors",
                mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900")} 
            />
          </div>
          <button className={cn("px-4 py-2 rounded text-sm font-bold transition-colors",
            mode === "dark" ? "bg-[#334155] text-white hover:bg-[#475569]" : "bg-slate-100 text-slate-700 hover:bg-slate-200")}>
            Search
          </button>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Checkbox id="inactive" className="border-slate-400 data-[state=checked]:bg-primary" />
            <label htmlFor="inactive" className="text-sm text-gray-500 cursor-pointer font-medium">Show inactive</label>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors font-medium">
              <span className="flex items-center gap-1">
                <Menu className="w-4 h-4 rotate-90" />
                From newest
              </span>
              <ChevronLeft className="w-4 h-4 -rotate-90" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className={cn("border shadow-xl", mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900")}>
              <DropdownMenuItem className={cn(mode === "dark" ? "hover:bg-[#334155]" : "hover:bg-slate-50")}>From newest</DropdownMenuItem>
              <DropdownMenuItem className={cn(mode === "dark" ? "hover:bg-[#334155]" : "hover:bg-slate-50")}>From oldest</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Workspaces Table */}
      <div className={cn("rounded-lg border overflow-hidden shadow-sm transition-colors",
        mode === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-200")}>
        <table className="w-full text-left">
          <thead className={cn("border-b transition-colors", mode === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-slate-50 border-slate-100")}>
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Login</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Created At</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
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
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">REPLYAGENT</span>
                      </div>
                    )}
                    <span className={cn("text-sm font-semibold transition-colors cursor-pointer",
                      mode === "dark" ? "text-gray-200 group-hover:text-primary" : "text-slate-700 group-hover:text-primary")}>
                      {ws.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  {ws.hasLogin && (
                    <button 
                      onClick={() => handleLogin(ws)}
                      className={cn("text-xs flex items-center justify-center gap-1 mx-auto transition-colors font-medium",
                      mode === "dark" ? "text-gray-300 hover:text-white" : "text-slate-500 hover:text-primary")}>
                      Login <ExternalLink size={12} />
                    </button>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">
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
                        mode === "dark" ? "text-gray-400 hover:text-white hover:bg-[#475569]" : "text-slate-400 hover:text-primary hover:bg-slate-100")}>
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

        {/* Pagination */}
        <div className={cn("px-6 py-4 border-t flex justify-end items-center gap-2",
          mode === "dark" ? "border-slate-700" : "border-slate-100")}>
          <button className="p-1 rounded text-gray-500 hover:text-primary disabled:opacity-30">
            <ChevronLeft size={18} />
          </button>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded bg-primary text-white text-sm font-bold">1</button>
            <button className={cn("w-8 h-8 rounded text-sm font-bold transition-colors",
              mode === "dark" ? "text-gray-400 hover:bg-[#334155]" : "text-slate-400 hover:bg-slate-100")}>2</button>
          </div>
          <button className="p-1 rounded text-gray-400 hover:text-primary">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgencyWorkspaces;
