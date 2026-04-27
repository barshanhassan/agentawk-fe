import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ShieldCheck, 
  Plus, 
  UserCheck, 
  Archive, 
  Settings,
  MoreHorizontal
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";


import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import AddRoleForm from "./AddRoleForm";

const AgencyRoles = () => {
  const { mode } = useTheme();
  const [viewMode, setViewMode] = useState<'LIST' | 'ADD' | 'EDIT'>('LIST');
  const [selectedRole, setSelectedRole] = useState<any>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: rolesResponse, isLoading } = useQuery({
    queryKey: ["/api/roles/list"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/roles/list");
      return res.json();
    }
  });

  // Local state to manage status (Active/Archived) for UI until backend supports it fully
  const [localRoles, setLocalRoles] = useState<any[]>([]);

  React.useEffect(() => {
    if (rolesResponse) {
      const mappedRoles = (rolesResponse || []).map((r: any) => ({
        id: r.id,
        name: r.name,
        description: r.description || "No description provided.",
        isSystem: r.is_system || false,
        status: r.status || 'ACTIVE'
      }));
      setLocalRoles(mappedRoles);
    }
  }, [rolesResponse]);

  const roles = localRoles;

  const handleAddNewRole = () => {
    setSelectedRole(null);
    setViewMode('ADD');
  };

  const handleEditRole = (role: any) => {
    setSelectedRole(role);
    setViewMode('EDIT');
  };

  const handleToggleArchive = (role: any) => {
    const newStatus = role.status === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE';
    setLocalRoles(prev => prev.map(r => 
      r.id === role.id ? { ...r, status: newStatus } : r
    ));
  };

  if (viewMode === 'ADD' || viewMode === 'EDIT') {
    return (
      <AddRoleForm 
        onCancel={() => {
          setViewMode('LIST');
          setSelectedRole(null);
        }} 
        initialData={selectedRole}
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
            <ShieldCheck className={cn("w-6 h-6", mode === "dark" ? "text-white" : "text-primary")} />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Roles and permissions</h1>
            <p className="text-gray-400 text-sm">Manage Roles & Permissions and assign them to specific agents.</p>
          </div>
        </div>
        <button 
          onClick={handleAddNewRole}
          className={cn("px-4 py-2 rounded font-bold text-sm transition-colors flex items-center gap-2 border shadow-sm",
          mode === "dark" ? "bg-[#334155] hover:bg-[#475569] text-white border-slate-600" : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200")}>
           Add role
        </button>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className={cn("bg-transparent border-b w-full justify-start rounded-none h-12 p-0 gap-8 transition-colors",
          mode === "dark" ? "border-slate-700" : "border-slate-100")}>
          <TabsTrigger 
            value="active" 
            className={cn(
              "data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 h-full font-bold transition-colors",
              mode === "dark" ? "text-gray-400 data-[state=active]:text-white" : "text-gray-500 data-[state=active]:text-slate-900"
            )}
          >
            Active
          </TabsTrigger>
          <TabsTrigger 
            value="archived" 
            className={cn(
              "data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 h-full font-bold transition-colors",
              mode === "dark" ? "text-gray-400 data-[state=active]:text-white" : "text-gray-500 data-[state=active]:text-slate-900"
            )}
          >
            Archived
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-8 space-y-6">
          {roles.filter(r => r.status === 'ACTIVE').map((role, i) => (
            <div key={i} className="flex items-start justify-between group">
              <div className="flex items-start gap-4 flex-1">
                <div className="mt-1 bg-transparent p-1">
                  <UserCheck className="w-6 h-6 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h3 className={cn("font-bold text-base transition-colors", mode === "dark" ? "text-gray-100" : "text-slate-800")}>{role.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 max-w-2xl leading-relaxed font-medium">
                    {role.description || ""}
                  </p>
                </div>
              </div>

              {!role.isSystem && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleToggleArchive(role)}
                    className={cn("px-4 py-1.5 rounded text-xs font-bold transition-colors border shadow-sm",
                    mode === "dark" ? "bg-[#334155] hover:bg-[#475569] text-gray-200 border-slate-600" : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200")}>
                    Archive
                  </button>
                  <button 
                    onClick={() => handleEditRole(role)}
                    className={cn("px-4 py-1.5 rounded text-xs font-bold transition-colors border shadow-sm",
                    mode === "dark" ? "bg-[#334155] hover:bg-[#475569] text-gray-200 border-slate-600" : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200")}>
                    Manage
                  </button>
                </div>
              )}
            </div>
          ))}
          {roles.filter(r => r.status === 'ACTIVE').length === 0 && (
            <div className={cn("text-center py-12 rounded-lg border border-dashed transition-colors",
              mode === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-slate-50 border-slate-200")}>
               <p className="text-gray-500 font-medium">No active roles found.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="archived" className="mt-8 space-y-6">
          {roles.filter(r => r.status === 'ARCHIVED').map((role, i) => (
            <div key={i} className="flex items-start justify-between group">
              <div className="flex items-start gap-4 flex-1">
                <div className="mt-1 bg-transparent p-1">
                  <UserCheck className="w-6 h-6 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h3 className={cn("font-bold text-base transition-colors", mode === "dark" ? "text-gray-100" : "text-slate-800")}>{role.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 max-w-2xl leading-relaxed font-medium">
                    {role.description || ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleToggleArchive(role)}
                  className={cn("px-4 py-1.5 rounded text-xs font-bold transition-colors border shadow-sm",
                  mode === "dark" ? "bg-[#334155] hover:bg-[#475569] text-gray-200 border-slate-600" : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200")}>
                  Activate
                </button>
              </div>
            </div>
          ))}
          {roles.filter(r => r.status === 'ARCHIVED').length === 0 && (
            <div className={cn("text-center py-12 rounded-lg border border-dashed transition-colors",
              mode === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-slate-50 border-slate-200")}>
               <p className="text-gray-500 font-medium">No archived roles found.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgencyRoles;
