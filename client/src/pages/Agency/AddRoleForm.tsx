import React from 'react';
import * as LucideIcons from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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
  const { t } = useTranslation();
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

  const handlePermissionChange = (key: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [key]: checked
      }
    }));
  };

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userInfo = JSON.parse(localStorage.getItem("user_info") || "{}");
  const agencyId = userInfo.modelable_id || "1";

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const url = initialData 
        ? `/api/agencies/${agencyId}/roles/${initialData.id}` 
        : `/api/agencies/${agencyId}/roles`;
      const method = initialData ? "PATCH" : "POST";
      const res = await apiRequest(method, url, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/agencies/${agencyId}/roles`] });
      toast({
        title: initialData ? t("common.updated") : t("common.saved"),
        description: initialData ? t("agency.roles.messages.updated") : t("agency.roles.messages.created"),
      });
      onCancel();
    },
    onError: (err: any) => {
      toast({
        title: t("common.error"),
        description: err.message || t("common.errorDesc"),
        variant: "destructive",
      });
    }
  });

  const handleSave = () => {
    saveMutation.mutate(formData);
  };

  const isSaving = saveMutation.isPending;

  const permissionCategories = [
    { id: 'team', name: t('agency.roles.categories.team'), icon: <Users size={16} className="text-slate-700 dark:text-slate-300" /> },
    { id: 'roles', name: t('agency.roles.categories.roles'), icon: <Shield size={16} className="text-slate-700 dark:text-slate-300" /> },
    { id: 'workspaces', name: t('agency.roles.categories.workspaces'), icon: <Layers size={16} className="text-slate-700 dark:text-slate-300" /> },
    { id: 'settings', name: t('agency.roles.categories.settings'), icon: <Settings size={16} className="text-slate-700 dark:text-slate-300" /> },
    { id: 'legal', name: t('agency.roles.categories.legal'), icon: <FileText size={16} className="text-slate-700 dark:text-slate-300" /> },
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
            {initialData ? t('agency.roles.form.edit_title') : t('agency.roles.form.add_title')}
          </h1>
        </div>

        <div className="px-8 py-8 space-y-8">
          {/* Top Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-slate-800 dark:text-slate-200">{t("agency.roles.form.name")}</label>
              <Input 
                className={cn("h-11 rounded-md transition-all", isDark ? "bg-[#0f172a] border-slate-700" : "bg-white border-slate-200 focus:border-green-500")} 
                placeholder={t("agency.roles.form.name")} 
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-slate-800 dark:text-slate-200">{t("agency.roles.form.select_icon")}</label>
              <Select 
                value={formData.icon} 
                onValueChange={(val) => setFormData(prev => ({ ...prev, icon: val }))}
              >
                <SelectTrigger className={cn("h-11 rounded-md transition-all", isDark ? "bg-[#0f172a] border-slate-700" : "bg-white border-slate-200 focus:border-green-500")}>
                  <SelectValue placeholder={t("agency.roles.form.select_icon_placeholder")} />
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
            <label className="text-[13px] font-bold text-slate-800 dark:text-slate-200">{t("agency.roles.form.description")}</label>
            <Textarea 
              className={cn("min-h-[100px] rounded-md transition-all", isDark ? "bg-[#0f172a] border-slate-700" : "bg-white border-slate-200 focus:border-green-500")} 
              placeholder={t("agency.roles.form.description")} 
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          {/* Permissions Section */}
          <div className="space-y-4 pt-4">
            <h2 className={cn("text-[18px] font-bold tracking-tight", isDark ? "text-white" : "text-slate-900")}>{t("agency.roles.form.permissions")}</h2>
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
                            { key: 'team.add', label: t('agency.roles.permissions.team.add'), desc: t('agency.roles.permissions.team.add_desc') },
                            { key: 'team.edit', label: t('agency.roles.permissions.team.edit'), desc: t('agency.roles.permissions.team.edit_desc') },
                            { key: 'team.delete', label: t('agency.roles.permissions.team.delete'), desc: t('agency.roles.permissions.team.delete_desc') }
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
                            { key: 'roles.add', label: t('agency.roles.permissions.roles.add'), desc: t('agency.roles.permissions.roles.add_desc') },
                            { key: 'roles.edit', label: t('agency.roles.permissions.roles.edit'), desc: t('agency.roles.permissions.roles.edit_desc') },
                            { key: 'roles.delete', label: t('agency.roles.permissions.roles.delete'), desc: t('agency.roles.permissions.roles.delete_desc') }
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
                            { key: 'workspaces.add', label: t('agency.roles.permissions.workspaces.add'), desc: t('agency.roles.permissions.workspaces.add_desc') },
                            { key: 'workspaces.edit', label: t('agency.roles.permissions.workspaces.edit'), desc: t('agency.roles.permissions.workspaces.edit_desc') },
                            { key: 'workspaces.delete', label: t('agency.roles.permissions.workspaces.delete'), desc: t('agency.roles.permissions.workspaces.delete_desc') }
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
                            { key: 'settings.billing', label: t('agency.roles.permissions.settings.billing'), desc: t('agency.roles.permissions.settings.billing_desc') },
                            { key: 'settings.mobile', label: t('agency.roles.permissions.settings.mobile'), desc: t('agency.roles.permissions.settings.mobile_desc') },
                            { key: 'settings.audit', label: t('agency.roles.permissions.settings.audit'), desc: t('agency.roles.permissions.settings.audit_desc') },
                            { key: 'settings.help', label: t('agency.roles.permissions.settings.help'), desc: t('agency.roles.permissions.settings.help_desc') },
                            { key: 'settings.agency', label: t('agency.roles.permissions.settings.agency'), desc: t('agency.roles.permissions.settings.agency_desc') }
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
                            { key: 'legal.view', label: t('agency.roles.permissions.legal.view'), desc: t('agency.roles.permissions.legal.view_desc') },
                            { key: 'legal.view_doc', label: t('agency.roles.permissions.legal.view_doc'), desc: t('agency.roles.permissions.legal.view_doc_desc') },
                            { key: 'legal.create', label: t('agency.roles.permissions.legal.create'), desc: t('agency.roles.permissions.legal.create_desc') },
                            { key: 'legal.edit', label: t('agency.roles.permissions.legal.edit'), desc: t('agency.roles.permissions.legal.edit_desc') }
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
              {t("common.cancel")}
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-green-500 hover:bg-green-600 text-white px-8 h-10 font-bold text-[13px] min-w-[100px] shadow-sm transition-all"
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  {t("common.saving")}
                </div>
              ) : (
                initialData ? t('common.update') : t('common.save')
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRoleForm;
