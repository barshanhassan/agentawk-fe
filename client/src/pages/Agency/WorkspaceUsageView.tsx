import React from 'react';
import {
  ChevronLeft,
  BarChart3,
  Users,
  MessageSquare,
  Bot,
  Loader2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { useTranslation } from 'react-i18next';
import { apiRequest } from "@/lib/queryClient";
import { getUserInfo } from "@/lib/auth";

interface WorkspaceUsageViewProps {
  workspace: any;
  onBack: () => void;
}

const WorkspaceUsageView: React.FC<WorkspaceUsageViewProps> = ({ workspace, onBack }) => {
  const { t } = useTranslation();
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const userInfo = React.useMemo(() => {
    try { return getUserInfo(); } catch { return {} as any; }
  }, []);
  const agencyId = userInfo.modelable_id;

  const { data, isLoading } = useQuery({
    queryKey: [`/api/organizations/${agencyId}/workspaces/${workspace?.id}/usage`],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/organizations/${agencyId}/workspaces/${workspace.id}/usage`);
      return res.json();
    },
    enabled: !!agencyId && !!workspace?.id,
  });

  const usage = data?.usage;

  const rows = usage ? [
    { key: 'contacts', icon: <Users className="w-5 h-5 text-gray-400" />, label: t("agency.workspaces.usage.contacts"), used: usage.contacts.used, limit: usage.contacts.limit },
    { key: 'agents', icon: <Users className="w-5 h-5 text-gray-400" />, label: t("agency.workspaces.usage.agents"), used: usage.agents.used, limit: usage.agents.limit },
    { key: 'ai_assistants', icon: <Bot className="w-5 h-5 text-gray-400" />, label: "AI Assistants", used: usage.ai_assistants.used, limit: usage.ai_assistants.limit },
    { key: 'whatsapp', icon: <MessageSquare className="w-5 h-5 text-green-500" />, label: "WhatsApp Channels", used: usage.channels.whatsapp.used, limit: usage.channels.whatsapp.limit },
    { key: 'instagram', icon: <MessageSquare className="w-5 h-5 text-pink-500" />, label: "Instagram Channels", used: usage.channels.instagram.used, limit: usage.channels.instagram.limit },
    { key: 'facebook', icon: <MessageSquare className="w-5 h-5 text-blue-500" />, label: "Facebook Channels", used: usage.channels.facebook.used, limit: usage.channels.facebook.limit },
  ] : [];

  return (
    <div className={cn("p-6 font-sans transition-colors duration-300", isDark ? "text-white" : "text-slate-900")}>
      {/* Header */}
      <div className={cn("flex items-center justify-between mb-8 p-4 rounded-md border shadow-sm transition-colors",
        isDark ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-200")}>
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className={cn("p-2 rounded-full transition-colors", isDark ? "hover:bg-slate-700" : "hover:bg-slate-100")}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className={cn("p-2 rounded", isDark ? "bg-[#334155]" : "bg-slate-100")}>
            <BarChart3 className={cn("w-6 h-6", isDark ? "text-white" : "text-primary")} />
          </div>
          <div>
            <h1 className="text-xl font-semibold">{t("agency.workspaces.usage.title_for", { name: workspace?.name })}</h1>
            <p className="text-gray-400 text-sm">{t("agency.workspaces.usage.desc")}</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <Card className={cn("border transition-colors", isDark ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-200")}>
          <CardHeader className="border-b border-slate-700/50 pb-4">
            <CardTitle className="text-lg font-semibold">{t("agency.workspaces.usage.period")}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <tbody className={cn("divide-y", isDark ? "divide-slate-700" : "divide-slate-100")}>
                {rows.map((row) => (
                  <tr key={row.key} className="hover:bg-slate-800/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {row.icon}
                        <p className="font-semibold text-sm">{row.label}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-tighter">{t("common.total")}</p>
                      <p className="text-lg font-bold">{row.used}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-tighter">{t("common.included")}</p>
                      <p className="text-sm font-medium">{row.limit ?? '—'}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkspaceUsageView;
