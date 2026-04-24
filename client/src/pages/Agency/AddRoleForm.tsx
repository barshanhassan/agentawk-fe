import React from 'react';
import { ShieldCheck, ChevronDown, Save, X, Users, Key, Layers, Settings, FileText, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface AddRoleFormProps {
  onCancel: () => void;
}

const AddRoleForm: React.FC<AddRoleFormProps> = ({ onCancel }) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const permissionCategories = [
    { id: 'team', name: 'Team', icon: <Users size={18} /> },
    { id: 'roles', name: 'Roles & Permissions', icon: <ShieldCheck size={18} /> },
    { id: 'workspaces', name: 'Workspaces', icon: <Layers size={18} /> },
    { id: 'settings', name: 'Settings', icon: <Settings size={18} /> },
    { id: 'legal', name: 'Legal', icon: <FileText size={18} /> },
  ];

  return (
    <div className={cn(
      "min-h-screen p-6 font-sans transition-colors duration-300",
      isDark ? "bg-[#0f172a] text-white" : "bg-slate-50 text-slate-900"
    )}>
      <div className={cn(
        "max-w-6xl mx-auto rounded-lg border shadow-sm overflow-hidden transition-colors",
        isDark ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-200"
      )}>
        {/* Header */}
        <div className={cn("p-4 border-b flex items-center gap-3", isDark ? "border-slate-700" : "border-slate-100")}>
          <div className={cn("p-1.5 rounded", isDark ? "bg-slate-800" : "bg-slate-50")}>
            <ShieldCheck size={20} className="text-gray-400" />
          </div>
          <h1 className="text-lg font-bold">Add role</h1>
        </div>

        <div className="p-6 space-y-8">
          {/* Top Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Name</label>
              <Input className={cn(isDark ? "bg-[#0f172a] border-slate-700" : "")} placeholder="Role name" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Icon</label>
              <div className="relative">
                 <div className="absolute left-3 top-1/2 -translate-y-1/2">
                   <ShieldCheck size={16} className="text-gray-400" />
                 </div>
                 <Input 
                   className={cn("pl-10", isDark ? "bg-[#0f172a] border-slate-700" : "")} 
                   defaultValue="fa-person-military-pointing" 
                 />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
            <Textarea 
              className={cn("min-h-[100px]", isDark ? "bg-[#0f172a] border-slate-700" : "")} 
              placeholder="Enter role description..." 
            />
          </div>

          {/* Permissions Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Permissions</h2>
            <div className={cn("border-t transition-colors", isDark ? "border-slate-700" : "border-slate-100 pt-2")}>
              <Accordion type="multiple" className="w-full">
                {permissionCategories.map((category) => (
                  <AccordionItem key={category.id} value={category.id} className={cn("border-b", isDark ? "border-slate-700" : "border-slate-100")}>
                    <AccordionTrigger className="hover:no-underline py-4 px-2">
                      <div className="flex items-center gap-3">
                        {category.icon}
                        <span className="text-[15px] font-semibold">{category.name}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 pt-2">
                      {category.id === 'team' ? (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <p className="text-sm font-bold">Add Agent</p>
                              <p className="text-xs text-slate-500">Can add an Agent</p>
                            </div>
                            <Switch />
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <p className="text-sm font-bold">Edit Agent</p>
                              <p className="text-xs text-slate-500">Can edit Agent</p>
                            </div>
                            <Switch />
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <p className="text-sm font-bold">Delete Agents</p>
                              <p className="text-xs text-slate-500">Allow member to delete other agents.</p>
                            </div>
                            <Switch />
                          </div>
                        </div>
                      ) : category.id === 'roles' ? (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <p className="text-sm font-bold">Add Role</p>
                              <p className="text-xs text-slate-500">Can add role</p>
                            </div>
                            <Switch />
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <p className="text-sm font-bold">Edit Role</p>
                              <p className="text-xs text-slate-500">Edit a role</p>
                            </div>
                            <Switch />
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <p className="text-sm font-bold">Delete Role</p>
                              <p className="text-xs text-slate-500">Can delete role</p>
                            </div>
                            <Switch />
                          </div>
                        </div>
                      ) : category.id === 'workspaces' ? (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <p className="text-sm font-bold">Add Workspace</p>
                              <p className="text-xs text-slate-500">Can create a Workspace</p>
                            </div>
                            <Switch />
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <p className="text-sm font-bold">Edit Workspace</p>
                              <p className="text-xs text-slate-500">Can edit a Workpspace</p>
                            </div>
                            <Switch />
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <p className="text-sm font-bold">Delete Workspace</p>
                              <p className="text-xs text-slate-500">Can delete a workspace</p>
                            </div>
                            <Switch />
                          </div>
                        </div>
                      ) : category.id === 'settings' ? (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <p className="text-sm font-bold">Billing</p>
                              <p className="text-xs text-slate-500">Grant agent access and authorization to modify billing information.</p>
                            </div>
                            <Switch />
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <p className="text-sm font-bold">Mobile Applications</p>
                              <p className="text-xs text-slate-500">Manage Mobile Applications</p>
                            </div>
                            <Switch />
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <p className="text-sm font-bold">Audit logs</p>
                              <p className="text-xs text-slate-500">Allow to access Audit logs.</p>
                            </div>
                            <Switch />
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <p className="text-sm font-bold">Help</p>
                              <p className="text-xs text-slate-500">Allow to access the help section.</p>
                            </div>
                            <Switch />
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <p className="text-sm font-bold">Agency settings</p>
                              <p className="text-xs text-slate-500">Allow access to the Agency Settings.</p>
                            </div>
                            <Switch />
                          </div>
                        </div>
                      ) : category.id === 'legal' ? (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <p className="text-sm font-bold">View legal</p>
                              <p className="text-xs text-slate-500">Allow access to legal option.</p>
                            </div>
                            <Switch />
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <p className="text-sm font-bold">View Document</p>
                              <p className="text-xs text-slate-500">View legal document</p>
                            </div>
                            <Switch />
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <p className="text-sm font-bold">Create Legal Document</p>
                              <p className="text-xs text-slate-500">Allow Agent to create new legal documents.</p>
                            </div>
                            <Switch />
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <p className="text-sm font-bold">Edit Legal Document</p>
                              <p className="text-xs text-slate-500">Allow Agent to edit legal document.</p>
                            </div>
                            <Switch />
                          </div>
                        </div>
                      ) : (
                        <div className={cn("p-4 rounded-md", isDark ? "bg-[#0f172a]" : "bg-slate-50")}>
                          <p className="text-sm text-gray-500 italic">No permissions defined yet for this category.</p>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-800">
            <Button variant="outline" onClick={onCancel} className={cn(isDark ? "bg-transparent border-slate-700 hover:bg-slate-800" : "")}>
              Cancel
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-white px-8">
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRoleForm;
