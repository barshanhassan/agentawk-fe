import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Bell,
  Settings,
  Save,
  Globe
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from 'react-i18next';

const AgencyNotificationsSettings = () => {
  const { mode } = useTheme();
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const userInfo = JSON.parse(localStorage.getItem("user_info") || "{}");
  const agencyId = userInfo.modelable_id || "1";

  const { data: agencyResponse } = useQuery({
    queryKey: [`/api/agencies/${agencyId}`],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/agencies/${agencyId}`);
      return res.json();
    }
  });

  const [notifEmail, setNotifEmail] = useState("");
  const [notifLanguage, setNotifLanguage] = useState("en-US");

  useEffect(() => {
    if (agencyResponse?.agency) {
      setNotifEmail(agencyResponse.agency.notification_email || "");
      setNotifLanguage(agencyResponse.agency.notification_language || "en-US");
    }
  }, [agencyResponse]);

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("PATCH", `/api/agencies/${agencyId}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/agencies/${agencyId}`] });
      toast({ title: t("common.saved"), description: t("agency.settings.notifications.updated") });
    },
    onError: () => {
      toast({ title: t("common.error"), description: t("common.errorDesc"), variant: "destructive" });
    }
  });

  const LANGUAGES = [
    { code: "en-US", label: t("common.languages.en"), flag: "us" },
  ];

  const selectedLang = LANGUAGES.find(l => l.code === notifLanguage) || LANGUAGES[1];

  return (
    <div className={cn("p-6 font-sans transition-colors duration-300", 
      mode === "dark" ? "text-white" : "text-slate-900")}>
      <Card className={cn("shadow-sm overflow-hidden transition-colors rounded-lg", 
        mode === "dark" ? "bg-[#1e293b] border-slate-800" : "bg-white border-slate-300")}>
        {/* Header Section */}
        <div className={cn("p-5 border-b flex items-center gap-4 transition-colors", 
          mode === "dark" ? "border-slate-800" : "border-slate-200")}>
          <Settings className={cn("w-6 h-6", mode === "dark" ? "text-slate-300" : "text-slate-800")} />
          <h2 className={cn("font-bold text-[15px] tracking-tight", 
            mode === "dark" ? "text-white" : "text-slate-900")}>{t("agency.settings.notifications.title")}</h2>
        </div>
        
        <CardContent className="p-6">
          <div className="max-w-[450px]">
            {/* Notification Email */}
            <div>
              <label className={cn("text-[13px] font-semibold block mb-1.5", mode === "dark" ? "text-slate-200" : "text-slate-800")}>{t("agency.settings.notifications.email")}</label>
              <Input 
                value={notifEmail}
                onChange={(e) => setNotifEmail(e.target.value)}
                placeholder="admin@example.com"
                className={cn("text-[13px] h-9 transition-colors shadow-none rounded focus-visible:ring-1 focus-visible:ring-slate-300", 
                  mode === "dark" ? "bg-[#0f172a] border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900")} 
              />
              <p className={cn("text-[12px] font-medium mt-1.5", mode === "dark" ? "text-slate-300" : "text-slate-800")}>{t("agency.settings.notifications.emailDesc")}</p>
            </div>

            <div className={cn("h-px w-full my-6", mode === "dark" ? "bg-slate-800" : "bg-slate-100")}></div>

            {/* Notification Language */}
            <div>
              <label className={cn("text-[13px] font-semibold block mb-1.5", mode === "dark" ? "text-slate-200" : "text-slate-800")}>{t("agency.settings.notifications.language")}</label>
              <Select value={notifLanguage} onValueChange={setNotifLanguage}>
                <SelectTrigger className={cn("text-[13px] h-9 transition-colors shadow-none rounded focus-visible:ring-1 focus-visible:ring-slate-300", 
                  mode === "dark" ? "bg-[#0f172a] border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900")}>
                  <SelectValue placeholder={t("agency.settings.notifications.selectLanguage")}>
                    <div className="flex items-center gap-2">
                      <img src={`https://flagcdn.com/w20/${selectedLang.flag}.png`} width="20" alt={selectedLang.flag} className="rounded-sm" />
                      <span>{selectedLang.label}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className={cn("border shadow-2xl transition-colors", 
                  mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900")}>
                  {LANGUAGES.map(lang => (
                    <SelectItem key={lang.code} value={lang.code} className="text-[13px]">
                      <div className="flex items-center gap-2">
                        <img src={`https://flagcdn.com/w20/${lang.flag}.png`} width="20" alt={lang.flag} className="rounded-sm" />
                        <span>{lang.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className={cn("text-[12px] font-medium mt-1.5", mode === "dark" ? "text-slate-300" : "text-slate-800")}>{t("agency.settings.notifications.languageDesc")}</p>

              <div className="flex justify-end pt-5">
                <button 
                  onClick={() => updateMutation.mutate({ notification_email: notifEmail, notification_language: notifLanguage })}
                  disabled={updateMutation.isPending}
                  className={cn("px-8 py-1.5 rounded text-[13px] font-medium transition-colors border",
                  mode === "dark" ? "bg-[#1e293b] hover:bg-[#00e55e] text-[#00e55e] hover:text-white border-[#00e55e]" : "bg-white hover:bg-[#00e55e] hover:text-white text-[#00e55e] border-[#00e55e]")}>
                  {updateMutation.isPending ? t("common.saving") : t("common.save")}
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgencyNotificationsSettings;
