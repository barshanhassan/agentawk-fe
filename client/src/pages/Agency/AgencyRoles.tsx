import React, { useState } from 'react';
import { 
  Shield, 
  User,
  Plus, 
  UserCheck, 
  Archive, 
  Settings,
  MoreHorizontal,
  ChevronRight,
  ShieldCheck
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
  const [activeTab, setActiveTab] = useState('active');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: rolesResponse, isLoading } = useQuery({
    queryKey: ["/api/roles/list"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/roles/list");
      return res.json();
    }
  });

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
    toast({
      title: newStatus === 'ARCHIVED' ? "Role Archived" : "Role Activated",
      description: `The role "${role.name}" has been ${newStatus.toLowerCase()}.`
    });
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
    <div className={cn("p-8 transition-colors duration-300", mode === "dark" ? "bg-[#0f172a]" : "bg-slate-50")}>
      <div className={cn("max-w-[1400px] mx-auto rounded-lg border transition-colors duration-300 overflow-hidden",
        mode === "dark" ? "bg-[#1e293b] border-slate-700 shadow-xl" : "bg-white border-slate-300 shadow-sm")}>
        
        {/* Header Section */}
        <div className="px-8 py-5 border-b border-slate-300 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#1e293b]">
          <div className="flex items-center gap-4">
            <div className="relative">
              <User className={cn("w-7 h-7 text-slate-500")} />
              <Shield className={cn("w-3.5 h-3.5 absolute -bottom-0.5 -right-0.5", mode === "dark" ? "text-slate-900 fill-slate-400" : "text-white fill-slate-900")} />
            </div>
            <div>
              <h1 className={cn("text-[16px] font-bold tracking-tight", mode === "dark" ? "text-white" : "text-slate-900")}>
                Roles and permissions
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-[12px] font-medium">
                Manage Roles & Permissions and assign them to specific agents.
              </p>
            </div>
          </div>
          <button 
            onClick={handleAddNewRole}
            className="px-5 py-1.5 rounded-md font-bold text-[12px] border border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10 transition-all"
          >
            Add role
          </button>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="active" onValueChange={setActiveTab} className="w-full">
          <div className="px-8 bg-white dark:bg-[#1e293b]">
            <TabsList className="bg-transparent h-auto p-0 gap-10 border-b border-slate-200 dark:border-slate-800 w-full justify-start rounded-none">
              {[
                { id: "active", label: "Active" },
                { id: "archived", label: "Archived" },
              ].map((tab) => (
                <TabsTrigger 
                  key={tab.id}
                  value={tab.id} 
                  className={cn(
                    "px-0 py-3 rounded-none text-[13px] font-bold transition-all relative border-b-2 border-transparent shadow-none bg-transparent",
                    "data-[state=active]:bg-transparent data-[state=active]:border-green-600 data-[state=active]:text-green-600 data-[state=active]:shadow-none",
                    "hover:bg-transparent hover:text-green-600 hover:shadow-none focus-visible:ring-0",
                    mode === "dark" ? "text-slate-400 data-[state=active]:text-green-400" : "text-slate-600 data-[state=active]:text-green-600"
                  )}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="active" className="mt-0 focus-visible:outline-none min-h-[300px] bg-white dark:bg-[#1e293b]">
            {roles.filter(r => r.status === 'ACTIVE').length > 0 ? (
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {roles.filter(r => r.status === 'ACTIVE').map((role, i) => (
                  <div key={i} className="flex items-center justify-between p-6 hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors">
                    <div className="flex items-start gap-5 flex-1">
                      <div className="mt-1">
                        <UserCheck className="w-5 h-5 text-slate-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className={cn("font-bold text-[14px]", mode === "dark" ? "text-white" : "text-slate-900")}>
                          {role.name}
                        </h3>
                        <p className="text-[12px] text-slate-600 dark:text-slate-400 mt-1 max-w-4xl leading-relaxed font-medium">
                          {role.description}
                        </p>
                      </div>
                    </div>

                    {!role.isSystem && (
                      <div className="flex items-center gap-3 ml-8">
                        <button 
                          onClick={() => handleToggleArchive(role)}
                          className={cn("px-4 py-1.5 rounded-lg text-[12px] font-bold transition-all border shadow-sm",
                          mode === "dark" ? "bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800" : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50")}
                        >
                          Archive
                        </button>
                        <button 
                          onClick={() => handleEditRole(role)}
                          className={cn("px-4 py-1.5 rounded-lg text-[12px] font-bold transition-all border border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10")}
                        >
                          Manage
                        </button>
                      </div>
                    )}
                    {role.isSystem && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full border border-blue-200 dark:border-blue-800">
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tighter">System Role</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="relative mb-4">
                  <div className="w-16 h-16 bg-green-50 dark:bg-green-500/10 rounded-full flex items-center justify-center border border-green-100 dark:border-green-900/30">
                    <User className="w-8 h-8 text-green-500/60" />
                    <Shield className="w-4 h-4 absolute bottom-0 right-0 text-green-600 fill-green-600 border-2 border-white dark:border-[#1e293b] rounded-full" />
                  </div>
                </div>
                <h3 className={cn("text-[16px] font-bold mb-1", mode === "dark" ? "text-white" : "text-slate-900")}>
                  There is nothing here.
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-[13px] font-medium">
                  All of your active roles will appear here.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="archived" className="mt-0 focus-visible:outline-none min-h-[300px] bg-white dark:bg-[#1e293b]">
            {roles.filter(r => r.status === 'ARCHIVED').length > 0 ? (
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {roles.filter(r => r.status === 'ARCHIVED').map((role, i) => (
                  <div key={i} className="flex items-center justify-between p-6 hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors">
                    <div className="flex items-start gap-5 flex-1">
                      <div className="mt-1">
                        <UserCheck className="w-5 h-5 text-slate-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className={cn("font-bold text-[14px]", mode === "dark" ? "text-white" : "text-slate-900")}>
                          {role.name}
                        </h3>
                        <p className="text-[12px] text-slate-600 dark:text-slate-400 mt-1 max-w-4xl leading-relaxed font-medium">
                          {role.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 ml-8">
                      <button 
                        onClick={() => handleToggleArchive(role)}
                        className={cn("px-4 py-1.5 rounded-lg text-[12px] font-bold transition-all border border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10")}
                      >
                        Activate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="relative mb-4">
                  <div className="w-16 h-16 bg-green-50 dark:bg-green-500/10 rounded-full flex items-center justify-center border border-green-100 dark:border-green-900/30">
                    <User className="w-8 h-8 text-green-500/60" />
                    <Shield className="w-4 h-4 absolute bottom-0 right-0 text-green-600 fill-green-600 border-2 border-white dark:border-[#1e293b] rounded-full" />
                  </div>
                </div>
                <h3 className={cn("text-[16px] font-bold mb-1", mode === "dark" ? "text-white" : "text-slate-900")}>
                  There is nothing here.
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-[13px] font-medium">
                  All of your archived roles will appear here.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AgencyRoles;
