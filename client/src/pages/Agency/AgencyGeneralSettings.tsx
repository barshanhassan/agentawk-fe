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
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";


const AgencyGeneralSettings = () => {
  const { mode } = useTheme();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const userInfo = JSON.parse(localStorage.getItem("user_info") || "{}");
  const agencyId = userInfo.modelable_id || "1";

  const { data: agencyResponse, isLoading } = useQuery({
    queryKey: [`/api/agencies/${agencyId}`],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/agencies/${agencyId}`);
      return res.json();
    }
  });

  const [generalData, setGeneralData] = useState({
    name: "",
    timezone: "",
    phone: ""
  });

  const [billingData, setBillingData] = useState({
    billing_company: "",
    billing_person: "",
    tax_id: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country_iso2: "PK"
    }
  });

  const [recipients, setRecipients] = useState(["test@test.com"]);
  const [isAdding, setIsAdding] = useState(false);
  const [newRecipient, setNewRecipient] = useState("");

  const handleSaveRecipient = () => {
    if (newRecipient && !recipients.includes(newRecipient)) {
      setRecipients([...recipients, newRecipient]);
      setNewRecipient("");
      setIsAdding(false);
      toast({ title: "Recipient Added", description: "The invoice recipient has been added." });
    }
  };

  const handleDeleteRecipient = (index: number) => {
    const updated = recipients.filter((_, i) => i !== index);
    setRecipients(updated);
    toast({ title: "Recipient Deleted", description: "The invoice recipient has been removed." });
  };

  useEffect(() => {
    if (agencyResponse?.agency) {
      const a = agencyResponse.agency;
      setGeneralData({
        name: a.name || "",
        timezone: a.timezone || "",
        phone: a.phone || ""
      });
      setBillingData({
        billing_company: a.billing_company || "",
        billing_person: a.billing_person || "",
        tax_id: a.tax_id || "",
        address: {
          street: a.address?.street || "",
          city: a.address?.city || "",
          state: a.address?.state || "",
          zip: a.address?.zip || "",
          country_iso2: a.address?.country_iso2 || "PK"
        }
      });
    }
  }, [agencyResponse]);

  const updateGeneralMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("PATCH", `/api/agencies/${agencyId}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/agencies/${agencyId}`] });
      toast({ title: "Settings Updated", description: "General settings have been saved." });
    }
  });

  const updateBillingMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("PATCH", `/api/agencies/${agencyId}/billing`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/agencies/${agencyId}`] });
      toast({ title: "Billing Updated", description: "Billing details have been saved." });
    }
  });

  
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
                 value={generalData.name}
                 onChange={(e) => setGeneralData({ ...generalData, name: e.target.value })}
                 className={cn("text-sm h-11 transition-colors", 
                   mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900")} 
               />
             </div>

             <div className="space-y-1.5">
               <label className={cn("text-[12px] font-bold uppercase tracking-wider", mode === "dark" ? "text-gray-300" : "text-slate-500")}>Timezone</label>
               <Select 
                 value={generalData.timezone} 
                 onValueChange={(val) => setGeneralData({ ...generalData, timezone: val })}
               >
                 <SelectTrigger className={cn("text-sm h-11 transition-colors", 
                   mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900")}>
                   <SelectValue placeholder="Select timezone" />
                 </SelectTrigger>
                 <SelectContent className={cn("border shadow-2xl transition-colors", 
                   mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900")}>
                   <SelectItem value="america-fortaleza">Fortaleza (America/Fortaleza)</SelectItem>
                   <SelectItem value="asia_karachi">Karachi (Asia/Karachi)</SelectItem>
                   <SelectItem value="utc">UTC</SelectItem>
                 </SelectContent>
               </Select>
             </div>

             <div className="space-y-1.5">
               <label className={cn("text-[12px] font-bold uppercase tracking-wider", mode === "dark" ? "text-gray-300" : "text-slate-500")}>Phone number</label>
               <div className="relative">
                 <Input 
                   value={generalData.phone}
                   onChange={(e) => setGeneralData({ ...generalData, phone: e.target.value })}
                   className={cn("text-sm h-11 transition-colors", 
                   mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900")} 
                 />
                 <Phone className="absolute right-3 top-3.5 w-4 h-4 text-gray-500" />
               </div>
             </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              onClick={() => updateGeneralMutation.mutate(generalData)}
              disabled={updateGeneralMutation.isPending}
              className={cn("px-6 py-2 rounded text-sm font-bold transition-colors border shadow-sm flex items-center gap-2",
              mode === "dark" ? "bg-[#334155] hover:bg-[#475569] text-white border-slate-700" : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200")}>
              <Save size={16} /> {updateGeneralMutation.isPending ? "Saving..." : "Save"}
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
               <Input 
                 value={billingData.billing_company}
                 onChange={(e) => setBillingData({ ...billingData, billing_company: e.target.value })}
                 className={cn("text-sm h-11 transition-colors", 
                   mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900")} 
               />
             </div>

             <div className="space-y-1.5">
               <label className={cn("text-[12px] font-bold uppercase tracking-wider", mode === "dark" ? "text-gray-300" : "text-slate-500")}>Person Responsible</label>
               <Input 
                 value={billingData.billing_person}
                 onChange={(e) => setBillingData({ ...billingData, billing_person: e.target.value })}
                 className={cn("text-sm h-11 transition-colors", 
                   mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900")} 
               />
             </div>

             <div className="space-y-1.5">
               <label className={cn("text-[12px] font-bold uppercase tracking-wider", mode === "dark" ? "text-gray-300" : "text-slate-500")}>Tax ID</label>
               <Input 
                 value={billingData.tax_id}
                 onChange={(e) => setBillingData({ ...billingData, tax_id: e.target.value })}
                 className={cn("text-sm h-11 transition-colors", 
                   mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900")} 
               />
             </div>

             <div className="space-y-1.5">
               <label className={cn("text-[12px] font-bold uppercase tracking-wider", mode === "dark" ? "text-gray-300" : "text-slate-500")}>Address</label>
               <Input 
                 value={billingData.address.street}
                 onChange={(e) => setBillingData({ ...billingData, address: { ...billingData.address, street: e.target.value } })}
                 className={cn("text-sm h-11 transition-colors", 
                   mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900")} 
               />
             </div>

             <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className={cn("text-[12px] font-bold uppercase tracking-wider", mode === "dark" ? "text-gray-300" : "text-slate-500")}>Country</label>
                  <Select 
                    value={billingData.address.country_iso2}
                    onValueChange={(val) => setBillingData({ ...billingData, address: { ...billingData.address, country_iso2: val } })}
                  >
                    <SelectTrigger className={cn("text-sm h-11 transition-colors", 
                      mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900")}>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent className={cn("border shadow-2xl transition-colors", 
                      mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900")}>
                      <SelectItem value="br">Brazil</SelectItem>
                      <SelectItem value="pk">Pakistan</SelectItem>
                      <SelectItem value="us">United States</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className={cn("text-[12px] font-bold uppercase tracking-wider", mode === "dark" ? "text-gray-300" : "text-slate-500")}>State</label>
                  <Input 
                    value={billingData.address.state}
                    onChange={(e) => setBillingData({ ...billingData, address: { ...billingData.address, state: e.target.value } })}
                    className={cn("text-sm h-11 transition-colors", 
                      mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900")} 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={cn("text-[12px] font-bold uppercase tracking-wider", mode === "dark" ? "text-gray-300" : "text-slate-500")}>City</label>
                  <Input 
                    value={billingData.address.city}
                    onChange={(e) => setBillingData({ ...billingData, address: { ...billingData.address, city: e.target.value } })}
                    className={cn("text-sm h-11 transition-colors", 
                      mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900")} 
                  />
                </div>
             </div>

             <div className="space-y-1.5">
               <label className={cn("text-[12px] font-bold uppercase tracking-wider", mode === "dark" ? "text-gray-300" : "text-slate-500")}>Zip Code</label>
               <Input 
                 value={billingData.address.zip}
                 onChange={(e) => setBillingData({ ...billingData, address: { ...billingData.address, zip: e.target.value } })}
                 className={cn("text-sm h-11 transition-colors", 
                   mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900")} 
               />
             </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              onClick={() => updateBillingMutation.mutate(billingData)}
              disabled={updateBillingMutation.isPending}
              className={cn("px-6 py-2 rounded text-sm font-bold transition-colors border shadow-sm flex items-center gap-2",
              mode === "dark" ? "bg-[#334155] hover:bg-[#475569] text-white border-slate-700" : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200")}>
              <Save size={16} /> {updateBillingMutation.isPending ? "Saving..." : "Save"}
            </button>
          </div>

        </CardContent>

      </Card>

      {/* Invoice Recipients Section */}
      <Card className={cn("shadow-xl overflow-hidden transition-colors rounded-2xl border", 
        mode === "dark" ? "bg-[#1e293b] border-slate-800" : "bg-white border-slate-100")}>
        <div className={cn("p-5 border-b flex items-center gap-3 transition-colors", 
          mode === "dark" ? "border-slate-800 bg-slate-900/50" : "border-slate-100 bg-slate-50/50")}>
          <Mail className="w-5 h-5 text-teal-500" />
          <div>
            <h2 className={cn("font-bold text-base leading-tight uppercase tracking-tight", 
              mode === "dark" ? "text-white" : "text-slate-900")}>Invoice Recipients</h2>
            <p className="text-[11px] text-gray-500 font-medium">Add people to receive a copy of your invoices.</p>
          </div>
        </div>
        
        <CardContent className="p-8 space-y-6">
          <div className="space-y-4">
            {recipients.map((recipient, index) => (
              <div key={index} className="space-y-2">
                <label className={cn("text-[12px] font-bold tracking-tight", mode === "dark" ? "text-gray-300" : "text-slate-600")}>
                  Recipient # {index + 1}
                </label>
                <div className="flex gap-2">
                  <Input 
                    value={recipient}
                    readOnly
                    className={cn("text-sm h-11 flex-1 transition-all rounded-xl", 
                      mode === "dark" ? "bg-[#0f172a] border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900")} 
                  />
                  <button 
                    onClick={() => handleDeleteRecipient(index)}
                    className="bg-[#ef4444] hover:bg-[#dc2626] text-white px-6 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {isAdding ? (
              <div className="space-y-2 animate-in fade-in slide-in-from-left-2">
                <div className="flex items-center gap-2">
                  <label className={cn("text-[12px] font-bold tracking-tight whitespace-nowrap", mode === "dark" ? "text-gray-300" : "text-slate-600")}>
                    Recipient
                  </label>
                  <div className="flex-1 flex gap-2">
                    <Input 
                      placeholder="test@test.com"
                      value={newRecipient}
                      onChange={(e) => setNewRecipient(e.target.value)}
                      className={cn("text-sm h-11 flex-1 transition-all rounded-xl focus:ring-teal-500", 
                        mode === "dark" ? "bg-[#0f172a] border-slate-700 text-white" : "bg-white border-teal-500 text-slate-900")} 
                    />
                    <button 
                      onClick={handleSaveRecipient}
                      className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => setIsAdding(false)}
                      className={cn("px-6 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm active:scale-95",
                        mode === "dark" ? "bg-slate-800 text-white border-slate-700" : "bg-white text-slate-700 border-slate-200")}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsAdding(true)}
                className="text-teal-500 hover:text-teal-600 text-[12px] font-bold transition-all uppercase tracking-widest flex items-center gap-2"
              >
                + Add an invoice recipient
              </button>
            )}
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default AgencyGeneralSettings;
