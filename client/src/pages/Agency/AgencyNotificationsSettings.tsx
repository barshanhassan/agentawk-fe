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

const AgencyNotificationsSettings = () => {
  const { mode } = useTheme();
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
      toast({ title: "Saved", description: "Notification settings updated." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
    }
  });

  return (
    <div className={cn("p-6 font-sans transition-colors duration-300", 
      mode === "dark" ? "text-white" : "text-slate-900")}>
      <Card className={cn("shadow-xl overflow-hidden transition-colors", 
        mode === "dark" ? "bg-[#1e293b] border-slate-800" : "bg-white border-slate-200")}>
        {/* Header Section */}
        <div className={cn("p-4 border-b flex items-center gap-3 transition-colors", 
          mode === "dark" ? "border-slate-800" : "border-slate-100")}>
          <Settings className="w-5 h-5 text-gray-400" />
          <h2 className={cn("font-bold text-base leading-tight uppercase tracking-tight", 
            mode === "dark" ? "text-white" : "text-slate-900")}>Notifications</h2>
        </div>
        
        <CardContent className="p-8 space-y-8">
          {/* Notification Email */}
          <div className="space-y-4">
             <div className="space-y-1.5">
               <label className={cn("text-[12px] font-bold uppercase tracking-wider", mode === "dark" ? "text-gray-300" : "text-slate-500")}>Notification Email</label>
               <Input 
                 value={notifEmail}
                 onChange={(e) => setNotifEmail(e.target.value)}
                 placeholder="admin@example.com"
                 className={cn("text-sm h-11 max-w-xl transition-colors", 
                   mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900")} 
               />
               <p className="text-[11px] text-gray-500 font-medium">Email address that will receive our notification, announcements and products updates.</p>
             </div>
          </div>

          <div className={cn("border-t pt-8 space-y-4 transition-colors", 
            mode === "dark" ? "border-slate-800/50" : "border-slate-100")}>
             {/* Notification Language */}
             <div className="space-y-1.5">
               <label className={cn("text-[12px] font-bold uppercase tracking-wider", mode === "dark" ? "text-gray-300" : "text-slate-500")}>Notification Language</label>
               <Select value={notifLanguage} onValueChange={setNotifLanguage}>
                 <SelectTrigger className={cn("text-sm h-11 max-w-xl transition-colors", 
                   mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900")}>
                   <div className="flex items-center gap-2">
                     <SelectValue placeholder="Select language" />
                   </div>
                 </SelectTrigger>
                 <SelectContent className={cn("border shadow-2xl transition-colors", 
                   mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900")}>
                   <SelectItem value="pt-BR">
                     <div className="flex items-center gap-2">
                       <span className="text-lg">🇧🇷</span>
                       <span>Português do Brasil</span>
                     </div>
                   </SelectItem>
                   <SelectItem value="en-US">
                     <div className="flex items-center gap-2">
                       <span className="text-lg">🇺🇸</span>
                       <span>English (US)</span>
                     </div>
                   </SelectItem>
                   <SelectItem value="es-ES">
                     <div className="flex items-center gap-2">
                       <span className="text-lg">🇪🇸</span>
                       <span>Español</span>
                     </div>
                   </SelectItem>
                 </SelectContent>
               </Select>
               <p className="text-[11px] text-gray-500 font-medium">Choose the language that you want to receive our email notifications.</p>
             </div>
          </div>

          <div className="flex justify-start pt-4">
            <button 
              onClick={() => updateMutation.mutate({ notification_email: notifEmail, notification_language: notifLanguage })}
              disabled={updateMutation.isPending}
              className={cn("px-8 py-2.5 rounded text-sm font-bold transition-colors border shadow-sm flex items-center gap-2",
                mode === "dark" ? "bg-[#334155] hover:bg-[#475569] text-white border-slate-700" : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200")}>
               <Save size={14} /> {updateMutation.isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgencyNotificationsSettings;
