import React from 'react';
import * as LucideIcons from 'lucide-react';
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const { 
  Shield, 
  User,
  Users, 
  Key, 
  Layers, 
  Settings, 
  FileText,
  Lock,
  BadgeCheck,
  UserRoundCheck,
  UserRound,
  Scale,
  Stethoscope,
  Info,
  CircleHelp,
  ChevronDown
} = LucideIcons;

interface AddRoleFormProps {
  onCancel: () => void;
  initialData?: any;
}

const AddRoleForm: React.FC<AddRoleFormProps> = ({ onCancel, initialData }) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const iconsMap: Record<string, React.ElementType> = {
    'fa-person-military-pointing': Shield,
    'fa-lock': Lock,
    'fa-shield-check': Shield,
    'fa-user-shield': UserRoundCheck,
    'fa-badge-check': BadgeCheck,
    'fa-key': Key,
    'fa-user-lock': UserRound,
    'fa-user': UserRound,
    'fa-user-tie': UserRound,
    'fa-user-group': Users,
    'fa-scale-balanced': Scale,
    'fa-user-doctor': Stethoscope,
    'fa-circle-info': Info,
    'fa-circle-question': CircleHelp
  };

  const [formData, setFormData] = React.useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    icon: initialData?.icon || 'fa-person-military-pointing',
    permissions: initialData?.permissions || {
      'team.add': false,
      'team.edit': false,
      'team.delete': false,
      'roles.add': false,
      'roles.edit': false,
      'roles.delete': false,
      'workspaces.add': false,
      'workspaces.edit': false,
      'workspaces.delete': false,
      'settings.billing': false,
      'settings.mobile': false,
      'settings.audit': false,
      'settings.help': false,
      'settings.agency': false,
      'legal.view': false,
      'legal.view_doc': false,
      'legal.create': false,
      'legal.edit': false,
    }
  });

  const [isSaving, setIsSaving] = React.useState(false);

  const handlePermissionChange = (key: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [key]: checked
      }
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      onCancel();
    }, 1200);
  };

  const permissionCategories = [
    { id: 'team', name: 'Team', icon: <Users size={16} className="text-slate-700 dark:text-slate-300" /> },
    { id: 'roles', name: 'Roles & Permissions', icon: <Shield size={16} className="text-slate-700 dark:text-slate-300" /> },
    { id: 'workspaces', name: 'Workspaces', icon: <Layers size={16} className="text-slate-700 dark:text-slate-300" /> },
    { id: 'settings', name: 'Settings', icon: <Settings size={16} className="text-slate-700 dark:text-slate-300" /> },
    { id: 'legal', name: 'Legal', icon: <FileText size={16} className="text-slate-700 dark:text-slate-300" /> },
  ];

  return (
    <div className={cn(
      "min-h-screen p-8 transition-colors duration-300",
      isDark ? "bg-[#0f172a]" : "bg-slate-50"
    )}>
      <div className={cn(
        "w-full max-w-[1400px] rounded-lg border overflow-hidden transition-colors duration-300",
        isDark ? "bg-[#1e293b] border-slate-700 shadow-xl" : "bg-white border-slate-300 shadow-sm"
      )}>
        {/* Header */}
        <div className={cn("px-8 py-6 border-b flex items-center gap-4", isDark ? "border-slate-700 bg-[#1e293b]" : "border-slate-300 bg-white")}>
          <div className="relative">
            <User className={cn("w-7 h-7 text-slate-400")} />
            <Shield className={cn("w-3.5 h-3.5 absolute -bottom-0.5 -right-0.5", isDark ? "text-slate-900 fill-slate-400" : "text-white fill-slate-900")} />
          </div>
          <h1 className={cn("text-[17px] font-bold tracking-tight", isDark ? "text-white" : "text-slate-900")}>
            {initialData ? 'Edit role' : 'Add role'}
          </h1>
        </div>

        <div className="px-8 py-8 space-y-8">
          {/* Top Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-slate-800 dark:text-slate-200">Name</label>
              <Input 
                className={cn("h-11 rounded-md transition-all", isDark ? "bg-[#0f172a] border-slate-700" : "bg-white border-slate-200 focus:border-green-500")} 
                placeholder="Role name" 
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-slate-800 dark:text-slate-200">Select Icon</label>
              <Select 
                value={formData.icon} 
                onValueChange={(val) => setFormData(prev => ({ ...prev, icon: val }))}
              >
                <SelectTrigger className={cn("h-11 rounded-md transition-all", isDark ? "bg-[#0f172a] border-slate-700" : "bg-white border-slate-200 focus:border-green-500")}>
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent className={cn(isDark ? "bg-[#1e293b] border-slate-700 text-white" : "")}>
                  {Object.entries(iconsMap).map(([name, Icon]) => (
                    <SelectItem key={name} value={name} className="cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Icon size={16} className="text-gray-400" />
                        <span className="text-sm font-medium">{name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-bold text-slate-800 dark:text-slate-200">Description</label>
            <Textarea 
              className={cn("min-h-[100px] rounded-md transition-all", isDark ? "bg-[#0f172a] border-slate-700" : "bg-white border-slate-200 focus:border-green-500")} 
              placeholder="Enter role description..." 
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          {/* Permissions Section */}
          <div className="space-y-4 pt-4">
            <h2 className={cn("text-[18px] font-bold tracking-tight", isDark ? "text-white" : "text-slate-900")}>Permissions</h2>
            <div className={cn("border-t transition-colors", isDark ? "border-slate-700" : "border-slate-300")}>
              <Accordion type="multiple" className="w-full">
                {permissionCategories.map((category) => (
                  <AccordionItem key={category.id} value={category.id} className={cn("border-b", isDark ? "border-slate-700" : "border-slate-300")}>
                    <AccordionTrigger className="hover:no-underline py-4 px-2">
                      <div className="flex items-center gap-3">
                        {category.icon}
                        <span className={cn("text-[14px] font-bold", isDark ? "text-slate-300" : "text-slate-800")}>{category.name}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-10 pb-6 pt-2">
                      {category.id === 'team' ? (
                        <div className="space-y-6">
                          {[
                            { key: 'team.add', label: 'Add Agent', desc: 'Can add an Agent' },
                            { key: 'team.edit', label: 'Edit Agent', desc: 'Can edit Agent' },
                            { key: 'team.delete', label: 'Delete Agents', desc: 'Allow member to delete other agents.' }
                          ].map(perm => (
                            <div key={perm.key} className="flex items-center justify-between py-1">
                              <div>
                                <p className={cn("text-[14px] font-bold", isDark ? "text-white" : "text-slate-900")}>{perm.label}</p>
                                <p className="text-[12px] text-slate-500 font-medium">{perm.desc}</p>
                              </div>
                              <Switch 
                                checked={formData.permissions[perm.key as keyof typeof formData.permissions]}
                                onCheckedChange={(v) => handlePermissionChange(perm.key, v)}
                                className="data-[state=checked]:bg-green-500"
                              />
                            </div>
                          ))}
                        </div>
                      ) : category.id === 'roles' ? (
                        <div className="space-y-6">
                          {[
                            { key: 'roles.add', label: 'Add Role', desc: 'Can add role' },
                            { key: 'roles.edit', label: 'Edit Role', desc: 'Edit a role' },
                            { key: 'roles.delete', label: 'Delete Role', desc: 'Can delete role' }
                          ].map(perm => (
                            <div key={perm.key} className="flex items-center justify-between py-1">
                              <div>
                                <p className={cn("text-[14px] font-bold", isDark ? "text-white" : "text-slate-900")}>{perm.label}</p>
                                <p className="text-[12px] text-slate-500 font-medium">{perm.desc}</p>
                              </div>
                              <Switch 
                                checked={formData.permissions[perm.key as keyof typeof formData.permissions]}
                                onCheckedChange={(v) => handlePermissionChange(perm.key, v)}
                                className="data-[state=checked]:bg-green-500"
                              />
                            </div>
                          ))}
                        </div>
                      ) : category.id === 'workspaces' ? (
                        <div className="space-y-6">
                          {[
                            { key: 'workspaces.add', label: 'Add Workspace', desc: 'Can create a Workspace' },
                            { key: 'workspaces.edit', label: 'Edit Workspace', desc: 'Can edit a Workpspace' },
                            { key: 'workspaces.delete', label: 'Delete Workspace', desc: 'Can delete a workspace' }
                          ].map(perm => (
                            <div key={perm.key} className="flex items-center justify-between py-1">
                              <div>
                                <p className={cn("text-[14px] font-bold", isDark ? "text-white" : "text-slate-900")}>{perm.label}</p>
                                <p className="text-[12px] text-slate-500 font-medium">{perm.desc}</p>
                              </div>
                              <Switch 
                                checked={formData.permissions[perm.key as keyof typeof formData.permissions]}
                                onCheckedChange={(v) => handlePermissionChange(perm.key, v)}
                                className="data-[state=checked]:bg-green-500"
                              />
                            </div>
                          ))}
                        </div>
                      ) : category.id === 'settings' ? (
                        <div className="space-y-6">
                          {[
                            { key: 'settings.billing', label: 'Billing', desc: 'Grant agent access and authorization to modify billing information.' },
                            { key: 'settings.mobile', label: 'Mobile Applications', desc: 'Manage Mobile Applications' },
                            { key: 'settings.audit', label: 'Audit logs', desc: 'Allow to access Audit logs.' },
                            { key: 'settings.help', label: 'Help', desc: 'Allow to access the help section.' },
                            { key: 'settings.agency', label: 'Agency settings', desc: 'Allow access to the Agency Settings.' }
                          ].map(perm => (
                            <div key={perm.key} className="flex items-center justify-between py-1">
                              <div>
                                <p className={cn("text-[14px] font-bold", isDark ? "text-white" : "text-slate-900")}>{perm.label}</p>
                                <p className="text-[12px] text-slate-500 font-medium">{perm.desc}</p>
                              </div>
                              <Switch 
                                checked={formData.permissions[perm.key as keyof typeof formData.permissions]}
                                onCheckedChange={(v) => handlePermissionChange(perm.key, v)}
                                className="data-[state=checked]:bg-green-500"
                              />
                            </div>
                          ))}
                        </div>
                      ) : category.id === 'legal' ? (
                        <div className="space-y-6">
                          {[
                            { key: 'legal.view', label: 'View legal', desc: 'Allow access to legal option.' },
                            { key: 'legal.view_doc', label: 'View Document', desc: 'View legal document' },
                            { key: 'legal.create', label: 'Create Legal Document', desc: 'Allow Agent to create new legal documents.' },
                            { key: 'legal.edit', label: 'Edit Legal Document', desc: 'Allow Agent to edit legal document.' }
                          ].map(perm => (
                            <div key={perm.key} className="flex items-center justify-between py-1">
                              <div>
                                <p className={cn("text-[14px] font-bold", isDark ? "text-white" : "text-slate-900")}>{perm.label}</p>
                                <p className="text-[12px] text-slate-500 font-medium">{perm.desc}</p>
                              </div>
                              <Switch 
                                checked={formData.permissions[perm.key as keyof typeof formData.permissions]}
                                onCheckedChange={(v) => handlePermissionChange(perm.key, v)}
                                className="data-[state=checked]:bg-green-500"
                              />
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* Footer */}
          <div className={cn("px-8 py-6 border-t flex justify-end gap-3", isDark ? "border-slate-700 bg-[#1e293b]" : "border-slate-300 bg-white")}>
            <Button 
              variant="outline" 
              onClick={onCancel} 
              className={cn("px-6 h-10 font-bold text-[13px] transition-all", isDark ? "bg-transparent border-slate-700 hover:bg-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50")}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-green-500 hover:bg-green-600 text-white px-8 h-10 font-bold text-[13px] min-w-[100px] shadow-sm transition-all"
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                initialData ? 'Update' : 'Save'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRoleForm;
