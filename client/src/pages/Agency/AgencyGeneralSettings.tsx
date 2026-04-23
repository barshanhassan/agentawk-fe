import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Settings, 
  CreditCard, 
  Mail,
  Trash2,
  Phone,
  Save,
  ChevronDown
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

const AgencyGeneralSettings = () => {
  const { mode } = useTheme();
  
  return (
    <div className={cn("p-6 font-sans transition-colors duration-300 space-y-8", 
      mode === "dark" ? "text-white" : "text-slate-900")}>
      
      {/* Settings Section */}
      <Card className={cn("shadow-xl overflow-hidden transition-colors", 
        mode === "dark" ? "bg-[#1e293b] border-slate-800" : "bg-white border-slate-200")}>
        <div className={cn("p-4 border-b flex items-center justify-between transition-colors", 
          mode === "dark" ? "border-slate-800" : "border-slate-100")}>
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-gray-400" />
            <div>
              <h2 className={cn("font-bold text-base leading-tight uppercase tracking-tight", 
                mode === "dark" ? "text-white" : "text-slate-900")}>Settings</h2>
              <p className="text-[11px] text-gray-500">Control the preferences and settings</p>
            </div>
          </div>
          <button className={cn("px-4 py-1.5 rounded text-xs font-bold transition-colors border shadow-sm",
            mode === "dark" ? "bg-[#334155] hover:bg-[#475569] text-white border-slate-700" : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200")}>
            Cancel White Label
          </button>
        </div>
        
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
             <div className="space-y-1.5">
               <label className={cn("text-[12px] font-bold uppercase tracking-wider", mode === "dark" ? "text-gray-300" : "text-slate-500")}>Name</label>
               <Input 
                 defaultValue="Connecta Group Corporation" 
                 className={cn("text-sm h-11 transition-colors", 
                   mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900")} 
               />
             </div>

             <div className="space-y-1.5">
               <label className={cn("text-[12px] font-bold uppercase tracking-wider", mode === "dark" ? "text-gray-300" : "text-slate-500")}>Timezone</label>
               <Select defaultValue="america-fortaleza">
                 <SelectTrigger className={cn("text-sm h-11 transition-colors", 
                   mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900")}>
                   <SelectValue placeholder="Select timezone" />
                 </SelectTrigger>
                 <SelectContent className={cn("border shadow-2xl transition-colors", 
                   mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900")}>
                   <SelectItem value="america-fortaleza">Fortaleza (America/Fortaleza)</SelectItem>
                   <SelectItem value="utc">UTC</SelectItem>
                 </SelectContent>
               </Select>
             </div>

             <div className="space-y-1.5">
               <label className={cn("text-[12px] font-bold uppercase tracking-wider", mode === "dark" ? "text-gray-300" : "text-slate-500")}>Phone number</label>
               <div className="relative">
                 <Input className={cn("text-sm h-11 transition-colors", 
                   mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900")} />
                 <Phone className="absolute right-3 top-3.5 w-4 h-4 text-gray-500" />
               </div>
             </div>
          </div>

          <div className="flex justify-end pt-4">
            <button className={cn("px-6 py-2 rounded text-sm font-bold transition-colors border shadow-sm flex items-center gap-2",
              mode === "dark" ? "bg-[#334155] hover:bg-[#475569] text-white border-slate-700" : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200")}>
              <Save size={16} /> Save
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Billing Details Section */}
      <Card className={cn("shadow-xl overflow-hidden transition-colors", 
        mode === "dark" ? "bg-[#1e293b] border-slate-800" : "bg-white border-slate-200")}>
        <div className={cn("p-4 border-b flex items-center gap-3 transition-colors", 
          mode === "dark" ? "border-slate-800" : "border-slate-100")}>
          <CreditCard className="w-5 h-5 text-gray-400" />
          <div>
            <h2 className={cn("font-bold text-base leading-tight uppercase tracking-tight", 
              mode === "dark" ? "text-white" : "text-slate-900")}>Billing Details</h2>
            <p className="text-[11px] text-gray-500">Details that will be shown on your invoices</p>
          </div>
        </div>
        
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-4">
             <div className="space-y-1.5">
               <label className={cn("text-[12px] font-bold uppercase tracking-wider", mode === "dark" ? "text-gray-300" : "text-slate-500")}>Company Name</label>
               <Input className={cn("text-sm h-11 transition-colors", 
                 mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900")} />
             </div>

             <div className="space-y-1.5">
               <label className={cn("text-[12px] font-bold uppercase tracking-wider", mode === "dark" ? "text-gray-300" : "text-slate-500")}>Person Responsible</label>
               <Input className={cn("text-sm h-11 transition-colors", 
                 mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900")} />
             </div>

             <div className="space-y-1.5">
               <label className={cn("text-[12px] font-bold uppercase tracking-wider", mode === "dark" ? "text-gray-300" : "text-slate-500")}>Tax ID</label>
               <Select>
                 <SelectTrigger className={cn("text-sm h-11 transition-colors", 
                   mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900")}>
                   <SelectValue placeholder="Select a Tax ID" />
                 </SelectTrigger>
                 <SelectContent className={cn("border shadow-2xl transition-colors", 
                   mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900")}>
                   <SelectItem value="none">None</SelectItem>
                 </SelectContent>
               </Select>
             </div>

             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1.5">
                 <label className={cn("text-[12px] font-bold uppercase tracking-wider", mode === "dark" ? "text-gray-300" : "text-slate-500")}>Tax ID Name / Tax Number</label>
                 <Input className={cn("text-sm h-11 transition-colors", 
                   mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900")} />
               </div>
               <div className="space-y-1.5">
                 <label className={cn("text-[12px] font-bold uppercase tracking-wider", mode === "dark" ? "text-gray-300" : "text-slate-500")}>&nbsp;</label>
                 <Input className={cn("text-sm h-11 transition-colors", 
                   mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900")} />
               </div>
             </div>

             <div className="space-y-1.5">
               <label className={cn("text-[12px] font-bold uppercase tracking-wider", mode === "dark" ? "text-gray-300" : "text-slate-500")}>Address</label>
               <Input className={cn("text-sm h-11 transition-colors", 
                 mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900")} />
             </div>

             <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className={cn("text-[12px] font-bold uppercase tracking-wider", mode === "dark" ? "text-gray-300" : "text-slate-500")}>Country</label>
                  <Select>
                    <SelectTrigger className={cn("text-sm h-11 transition-colors", 
                      mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900")}>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent className={cn("border shadow-2xl transition-colors", 
                      mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900")}>
                      <SelectItem value="br">Brazil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className={cn("text-[12px] font-bold uppercase tracking-wider", mode === "dark" ? "text-gray-300" : "text-slate-500")}>State</label>
                  <Select>
                    <SelectTrigger className={cn("text-sm h-11 transition-colors", 
                      mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900")}>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent className={cn("border shadow-2xl transition-colors", 
                      mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900")}>
                      <SelectItem value="ce">Ceará</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className={cn("text-[12px] font-bold uppercase tracking-wider", mode === "dark" ? "text-gray-300" : "text-slate-500")}>City</label>
                  <Select>
                    <SelectTrigger className={cn("text-sm h-11 transition-colors", 
                      mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900")}>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent className={cn("border shadow-2xl transition-colors", 
                      mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900")}>
                      <SelectItem value="fortaleza">Fortaleza</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
             </div>

             <div className="space-y-1.5">
               <label className={cn("text-[12px] font-bold uppercase tracking-wider", mode === "dark" ? "text-gray-300" : "text-slate-500")}>Zip Code</label>
               <Input className={cn("text-sm h-11 transition-colors", 
                 mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900")} />
             </div>
          </div>

          <div className="flex justify-end pt-4">
            <button className={cn("px-6 py-2 rounded text-sm font-bold transition-colors border shadow-sm flex items-center gap-2",
              mode === "dark" ? "bg-[#334155] hover:bg-[#475569] text-white border-slate-700" : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200")}>
              <Save size={16} /> Save
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Recipients Section */}
      <Card className={cn("shadow-xl overflow-hidden transition-colors", 
        mode === "dark" ? "bg-[#1e293b] border-slate-800" : "bg-white border-slate-200")}>
        <div className={cn("p-4 border-b flex items-center gap-3 transition-colors", 
          mode === "dark" ? "border-slate-800" : "border-slate-100")}>
          <Mail className="w-5 h-5 text-gray-400" />
          <div>
            <h2 className={cn("font-bold text-base leading-tight uppercase tracking-tight", 
              mode === "dark" ? "text-white" : "text-slate-900")}>Invoice Recipients</h2>
            <p className="text-[11px] text-gray-500">Add people to receive a copy of your invoices.</p>
          </div>
        </div>
        
        <CardContent className="p-6 space-y-4">
          <div className="space-y-3">
             <div className="space-y-1.5">
               <label className={cn("text-[12px] font-bold uppercase tracking-wider", mode === "dark" ? "text-gray-300" : "text-slate-500")}>Recipient #1</label>
               <div className="flex gap-2">
                 <Input 
                   defaultValue="test@test.com" 
                   className={cn("text-sm h-11 flex-1 transition-colors", 
                     mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900")} 
                 />
                 <button className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded text-xs font-bold transition-colors border border-red-500/20">
                   Delete
                 </button>
               </div>
             </div>
          </div>

          <button className="text-primary hover:text-primary/80 text-[12px] font-bold transition-colors uppercase tracking-wider">
            Add an invoice recipient
          </button>
        </CardContent>
      </Card>

    </div>
  );
};

export default AgencyGeneralSettings;
