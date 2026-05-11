import React, { useState, useEffect } from 'react';
import { getUserInfo } from "@/lib/auth";
import {
  Network,
  Plus,
  Search,
  ExternalLink,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Monitor,
  BarChart3,
  Wallet,
  Ban,
  Trash2,
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
import { useTranslation } from "react-i18next";

const AgencyWorkspaces = () => {
  const { t } = useTranslation();
  const { mode } = useTheme();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const dark = mode === "dark";

  const [viewMode, setViewMode] = useState<'LIST' | 'CREATE' | 'EDIT' | 'USAGE' | 'VOICE_WALLET'>('LIST');
  const [selectedWorkspace, setSelectedWorkspace] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const userInfo = React.useMemo(() => {
    try { return getUserInfo(); } catch { return {}; }
  }, []);
  const agencyId = userInfo.modelable_id;

  const { data: workspacesResponse, isLoading } = useQuery({
    queryKey: [`/api/agencies/${agencyId}/workspaces`],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/agencies/${agencyId}/workspaces`);
      return res.json();
    }
  });

  const workspaces = (workspacesResponse?.workspaces || []).map((ws: any) => ({
    id: ws.id,
    name: ws.name,
    createdAt: ws.created_at ? format(new Date(ws.created_at), "MMM dd, yyyy") : "—",
    status: (ws.status === 'active' || ws.status === 'ACTIVE') ? 'Active' : 'Suspended',
    hasLogin: true,
  }));

  const [localWorkspaces, setLocalWorkspaces] = useState<any[]>([]);
  useEffect(() => {
    if (workspaces.length > 0) setLocalWorkspaces(workspaces);
  }, [workspacesResponse]);

  const displayWorkspaces = localWorkspaces.length > 0 ? localWorkspaces : workspaces;
  const filteredWorkspaces = displayWorkspaces.filter((ws: any) =>
    ws.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleStatusMutation = useMutation({
    mutationFn: async (workspace: any) => {
      const isActive = workspace.status === 'Active';
      const res = await apiRequest("POST", `/api/agencies/${agencyId}/workspaces/${workspace.id}/${isActive ? 'suspend' : 'activate'}`);
      return res.json();
    },
    onSuccess: (_, workspace) => {
      const newStatus = workspace.status === 'Active' ? 'Suspended' : 'Active';
      setLocalWorkspaces(prev => prev.map(ws => ws.id === workspace.id ? { ...ws, status: newStatus } : ws));
      toast({ title: `Workspace ${newStatus}` });
      queryClient.invalidateQueries({ queryKey: [`/api/agencies/${agencyId}/workspaces`] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (workspace: any) => {
      const res = await apiRequest("DELETE", `/api/agencies/${agencyId}/workspaces/${workspace.id}`);
      return res.json();
    },
    onSuccess: (_, workspace) => {
      setLocalWorkspaces(prev => prev.filter(ws => ws.id !== workspace.id));
      toast({ title: "Workspace deleted", variant: "destructive" });
      queryClient.invalidateQueries({ queryKey: [`/api/agencies/${agencyId}/workspaces`] });
    },
  });

  if (viewMode === 'VOICE_WALLET') {
    return <AgencyVoiceWallet workspace={selectedWorkspace} onBack={() => { setViewMode('LIST'); setSelectedWorkspace(null); }} />;
  }
  if (viewMode === 'CREATE' || viewMode === 'EDIT') {
    return <CreateWorkspaceForm onCancel={() => { setViewMode('LIST'); setSelectedWorkspace(null); }} initialData={selectedWorkspace} />;
  }
  if (viewMode === 'USAGE') {
    return <WorkspaceUsageView workspace={selectedWorkspace} onBack={() => { setViewMode('LIST'); setSelectedWorkspace(null); }} />;
  }

  return (
    <div className={cn("p-6 min-h-screen", dark ? "bg-[#0f172a] text-white" : "bg-slate-50 text-slate-900")}>

      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Workspaces</h1>
          <p className={cn("text-sm mt-0.5", dark ? "text-slate-400" : "text-slate-500")}>
            Manage all your client workspaces
          </p>
        </div>
        <button
          onClick={() => setViewMode('CREATE')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold bg-primary hover:opacity-90 text-primary-foreground transition-colors shadow-sm"
        >
          <Plus size={16} />
          Add Workspace
        </button>
      </div>

      {/* Main Card */}
      <div className={cn("rounded-xl border overflow-hidden", dark ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-200")}>

        {/* Empty State */}
        {!isLoading && filteredWorkspaces.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
            <div className={cn("w-20 h-20 rounded-2xl flex items-center justify-center mb-5", dark ? "bg-primary/10" : "bg-primary/10")}>
              <Network size={36} className="text-primary" />
            </div>
            <h3 className={cn("text-lg font-bold mb-2", dark ? "text-white" : "text-slate-800")}>
              No Workspaces Yet
            </h3>
            <p className={cn("text-sm mb-6 max-w-xs", dark ? "text-slate-400" : "text-slate-500")}>
              Start managing your clients by creating your first workspace in just a few clicks.
            </p>
            <button
              onClick={() => setViewMode('CREATE')}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-[12px] font-semibold bg-primary hover:opacity-90 text-primary-foreground transition-colors shadow-sm"
            >
              <Plus size={16} />
              Add Your First Workspace
            </button>
          </div>
        ) : (
          <>
            {/* Filter Bar */}
            <div className={cn("flex items-center justify-between px-5 py-3 border-b", dark ? "border-slate-700" : "border-slate-100")}>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder={t("agency.workspaces.searchPlaceholder") || "Search workspaces..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn("pl-9 h-9 text-sm", dark ? "bg-slate-800 border-slate-700 text-white" : "border-slate-200")}
                />
              </div>
              <div className="flex items-center gap-4">
                <label className={cn("flex items-center gap-2 text-sm cursor-pointer", dark ? "text-slate-400" : "text-slate-500")}>
                  <Checkbox className="border-slate-300 w-4 h-4" />
                  {t("agency.workspaces.showInactive") || "Show inactive"}
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger className={cn("flex items-center gap-1.5 text-sm outline-none", dark ? "text-slate-400" : "text-slate-500")}>
                    {t("agency.workspaces.sortNewest") || "Newest first"} <ChevronDown size={14} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className={cn(dark ? "bg-[#1e293b] border-slate-700 text-white" : "")}>
                    <DropdownMenuItem>{t("agency.workspaces.sortNewest") || "Newest first"}</DropdownMenuItem>
                    <DropdownMenuItem>{t("agency.workspaces.sortOldest") || "Oldest first"}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Table */}
            <table className="w-full text-left">
              <thead className={cn("border-b text-xs font-semibold uppercase tracking-wider", dark ? "border-slate-700 text-slate-400" : "border-slate-100 text-slate-400")}>
                <tr>
                  <th className="px-5 py-3">{t("agency.workspaces.table.name")}</th>
                  <th className="px-5 py-3">{t("agency.workspaces.table.createdAt")}</th>
                  <th className="px-5 py-3 text-center">{t("agency.workspaces.table.status")}</th>
                  <th className="px-5 py-3 text-center">{t("agency.workspaces.table.login")}</th>
                  <th className="px-5 py-3 text-right">{t("agency.workspaces.table.action")}</th>
                </tr>
              </thead>
              <tbody className={cn("divide-y", dark ? "divide-slate-700" : "divide-slate-100")}>
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={5} className="px-5 py-4">
                        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-3/4" />
                      </td>
                    </tr>
                  ))
                ) : filteredWorkspaces.map((ws: any) => (
                  <tr key={ws.id} className={cn("group transition-colors", dark ? "hover:bg-slate-800/50" : "hover:bg-slate-50")}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
                          {ws.name.slice(0, 2).toUpperCase()}
                        </div>
                        <span className={cn("font-medium text-sm", dark ? "text-slate-200" : "text-slate-700")}>
                          {ws.name}
                        </span>
                      </div>
                    </td>
                    <td className={cn("px-5 py-4 text-sm", dark ? "text-slate-400" : "text-slate-500")}>
                      {ws.createdAt}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                        ws.status === 'Active'
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-red-50 text-red-500"
                      )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", ws.status === 'Active' ? "bg-emerald-500" : "bg-red-500")} />
                        {ws.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button className={cn("inline-flex items-center gap-1 text-xs font-medium transition-colors", dark ? "text-slate-400 hover:text-primary" : "text-slate-400 hover:text-primary")}>
                        Login <ExternalLink size={11} />
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className={cn("p-1.5 rounded-lg outline-none transition-colors", dark ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-400")}>
                            <MoreHorizontal size={16} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className={cn("w-48 p-1", dark ? "bg-[#1e293b] border-slate-700 text-white" : "")}>
                          <DropdownMenuItem onClick={() => { setSelectedWorkspace(ws); setViewMode('EDIT'); }} className="flex items-center gap-2 text-sm cursor-pointer">
                            <Monitor size={15} /> Manage
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setSelectedWorkspace(ws); setViewMode('USAGE'); }} className="flex items-center gap-2 text-sm cursor-pointer">
                            <BarChart3 size={15} /> Usage
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setSelectedWorkspace(ws); setViewMode('VOICE_WALLET'); }} className="flex items-center gap-2 text-sm cursor-pointer">
                            <Wallet size={15} /> Voice Wallet
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleStatusMutation.mutate(ws)} className="flex items-center gap-2 text-sm cursor-pointer">
                            <Ban size={15} /> {ws.status === 'Active' ? 'Suspend' : 'Activate'}
                          </DropdownMenuItem>
                          <div className={cn("my-1 h-px", dark ? "bg-slate-700" : "bg-slate-100")} />
                          <DropdownMenuItem
                            onClick={() => { if (confirm(`Delete "${ws.name}"?`)) deleteMutation.mutate(ws); }}
                            className="flex items-center gap-2 text-sm cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50"
                          >
                            <Trash2 size={15} /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {filteredWorkspaces.length > 0 && (
              <div className={cn("flex items-center justify-end gap-2 px-5 py-3 border-t", dark ? "border-slate-700" : "border-slate-100")}>
                <button className={cn("p-1.5 rounded-lg border transition-colors", dark ? "border-slate-700 text-slate-400 hover:border-slate-500" : "border-slate-200 text-slate-400 hover:border-slate-300")}>
                  <ChevronLeft size={14} />
                </button>
                <button className="w-7 h-7 rounded-lg bg-primary text-primary-foreground text-xs font-bold">1</button>
                <button className={cn("p-1.5 rounded-lg border transition-colors", dark ? "border-slate-700 text-slate-400 hover:border-slate-500" : "border-slate-200 text-slate-400 hover:border-slate-300")}>
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AgencyWorkspaces;
