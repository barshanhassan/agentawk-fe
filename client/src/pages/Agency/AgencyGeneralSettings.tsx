import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Settings, 
  CreditCard, 
  Mail,
  Trash2,
  Phone,
  Save,
  ChevronDown,
  Edit2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search } from "lucide-react";

import { COUNTRIES } from "@/lib/countries";
import { Country, State, City } from "country-state-city";

const TAX_IDS = [
  "Other",
  "Australian Business Number (AU ABN)",
  "Australian Taxation Office Reference Number",
  "Brazil CNPJ number",
  "Brazil CPF number",
  "Bulgaria Unified Identification Code",
  "Canada BN",
  "Canada GST/HST number",
  "Canadian PST number (British Columbia)",
  "Canadian PST number (Manitoba)",
  "Canadian PST number (Saskatchewan)",
  "Canadian QST number (Québec)",
  "Chilean TIN",
  "Egyptian Tax Identification Number",
  "EU VAT number",
  "European One Stop Shop VAT number for non-Union scheme",
  "Georgian VAT",
  "Hong Kong BR number",
  "Hungary tax number (adószám)",
  "India GSTIN",
  "Indonesian NPWP",
  "Israel VAT",
  "Japan TRN",
  "Kenya PIN",
  "Malaysia SST",
  "Mexico RFC",
  "New Zealand GST",
  "Norway VAT",
  "Oman VAT",
  "Russia INN",
  "Saudi Arabia VAT",
  "Serbia VAT",
  "Singapore GST",
  "South Africa VAT",
  "South Korea BRN",
  "Switzerland VAT",
  "Taiwan VAT",
  "Thailand VAT",
  "Turkey VAT",
  "Ukraine VAT",
  "United Arab Emirates TRN",
  "United Kingdom VAT",
  "United States EIN"
];

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
    tax_id_name: "",
    tax_number: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country_iso2: "PK"
    }
  });

  const [billingErrors, setBillingErrors] = useState<Record<string, string>>({});

  const handleSaveBilling = () => {
    const errors: Record<string, string> = {};
    if (!billingData.billing_company?.trim()) errors.billing_company = "Please enter a company name";
    if (!billingData.billing_person?.trim()) errors.billing_person = "Please enter a name";
    if (!billingData.tax_id) errors.tax_id = "auth.tax_type_required";
    if (!billingData.tax_id_name?.trim()) errors.tax_id_name = "Please select a Tax ID";
    if (!billingData.tax_number?.trim()) errors.tax_number = "Please enter Tax ID";
    
    if (!billingData.address.country_iso2) {
      errors.country_iso2 = "Please select a country";
    } else {
      const states = State.getStatesOfCountry(billingData.address.country_iso2);
      if (states.length > 0 && !billingData.address.state) {
         errors.state = "Please select a state";
      }
      
      const cities = states.length > 0 
          ? (billingData.address.state ? City.getCitiesOfState(billingData.address.country_iso2, billingData.address.state) : [])
          : (City.getCitiesOfCountry(billingData.address.country_iso2) || []);
          
      if (cities.length > 0 && !billingData.address.city) {
         errors.city = "Please select a city";
      }
    }
    
    if (Object.keys(errors).length > 0) {
      setBillingErrors(errors);
      return;
    }
    
    setBillingErrors({});
    updateBillingMutation.mutate(billingData);
  };

  const [recipients, setRecipients] = useState(["test@test.com"]);
  const [isAdding, setIsAdding] = useState(false);
  const [newRecipient, setNewRecipient] = useState("");

  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [phoneSearchQuery, setPhoneSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES.find(c => c.code === "US")!);
  const [tempPhone, setTempPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  const handleOpenPhoneModal = () => {
    let phonePart = generalData.phone || "";
    let foundCountry = selectedCountry;
    
    if (phonePart.startsWith("+")) {
      const matchedCountry = COUNTRIES.slice().sort((a,b) => b.dial.length - a.dial.length).find(c => phonePart.startsWith(c.dial));
      if (matchedCountry) {
        foundCountry = matchedCountry;
        phonePart = phonePart.slice(matchedCountry.dial.length).trim();
      }
    }
    
    setSelectedCountry(foundCountry);
    setTempPhone(phonePart);
    setPhoneError("");
    setIsPhoneModalOpen(true);
  };

  const handleSavePhone = () => {
    if (!tempPhone.trim()) {
      setPhoneError("Please enter mobile number");
      return;
    }
    setPhoneError("");
    setGeneralData({ ...generalData, phone: `${selectedCountry.dial} ${tempPhone}` });
    setIsPhoneModalOpen(false);
  };

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
        tax_id_name: a.tax_id_name || "",
        tax_number: a.tax_number || "",
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
    <div className={cn("p-6 font-sans transition-colors duration-300 space-y-6", 
      mode === "dark" ? "text-white bg-[#0f172a]" : "text-slate-900 bg-slate-50")}>
      
      {/* Settings Section */}
      <Card className={cn("shadow-sm overflow-hidden transition-colors rounded-lg", 
        mode === "dark" ? "bg-[#1e293b] border-slate-800" : "bg-white border-slate-300")}>
        <div className={cn("p-5 border-b flex items-center justify-between transition-colors", 
          mode === "dark" ? "border-slate-800" : "border-slate-200")}>
          <div className="flex items-center gap-4">
            <Settings className={cn("w-6 h-6", mode === "dark" ? "text-slate-300" : "text-slate-800")} />
            <div>
              <h2 className={cn("font-bold text-[15px] tracking-tight", 
                mode === "dark" ? "text-white" : "text-slate-900")}>Settings</h2>
              <p className={cn("text-[12px] font-medium", mode === "dark" ? "text-slate-400" : "text-slate-500")}>Control the preferences and settings</p>
            </div>
          </div>
          <button className={cn("px-4 py-1.5 rounded text-[13px] font-medium transition-colors border",
            mode === "dark" 
              ? "bg-[#1e293b] hover:bg-[#00e55e] hover:text-white text-[#00e55e] border-[#00e55e]" 
              : "bg-white hover:bg-[#00e55e] hover:text-white text-[#00e55e] border-[#00e55e]")}>
            Cancel White Label
          </button>
        </div>
        
        <CardContent className="p-0">
          <div className="px-6">
             <div className={cn("flex flex-col md:flex-row md:items-center py-5 border-b", mode === "dark" ? "border-slate-800" : "border-slate-200")}>
               <div className="w-[250px] shrink-0 mb-2 md:mb-0">
                 <span className={cn("text-[13px] font-bold", mode === "dark" ? "text-slate-200" : "text-slate-800")}>Name</span>
               </div>
               <div className="flex-1">
                 <Input 
                   value={generalData.name}
                   onChange={(e) => setGeneralData({ ...generalData, name: e.target.value })}
                   className={cn("text-[13px] h-10 transition-colors shadow-none rounded focus-visible:ring-1 focus-visible:ring-slate-300", 
                     mode === "dark" ? "bg-[#0f172a] border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900")} 
                 />
               </div>
             </div>

             <div className={cn("flex flex-col md:flex-row md:items-center py-5 border-b", mode === "dark" ? "border-slate-800" : "border-slate-200")}>
               <div className="w-[250px] shrink-0 mb-2 md:mb-0">
                 <span className={cn("text-[13px] font-bold", mode === "dark" ? "text-slate-200" : "text-slate-800")}>Timezone</span>
               </div>
               <div className="flex-1">
                 <Select 
                   value={generalData.timezone} 
                   onValueChange={(val) => setGeneralData({ ...generalData, timezone: val })}
                 >
                   <SelectTrigger className={cn("text-[13px] h-10 transition-colors shadow-none rounded focus-visible:ring-1 focus-visible:ring-slate-300", 
                     mode === "dark" ? "bg-[#0f172a] border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900")}>
                     <SelectValue placeholder="Select timezone" />
                   </SelectTrigger>
                   <SelectContent className={cn("border shadow-2xl transition-colors", 
                     mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900")}>
                     <SelectItem value="america-fortaleza">Fortaleza (America/Fortaleza)</SelectItem>
                     <SelectItem value="etc-gmt+12">International Date Line West (Etc/GMT+12)</SelectItem>
                     <SelectItem value="etc-gmt+11">Coordinated Universal Time 11 (Etc/GMT+11)</SelectItem>
                     <SelectItem value="pacific-honolulu">Hawaii (Pacific/Honolulu)</SelectItem>
                     <SelectItem value="america-anchorage">Alaska (America/Anchorage)</SelectItem>
                     <SelectItem value="america-santa_isabel">Baja California (America/Santa_Isabel)</SelectItem>
                     <SelectItem value="america-los_angeles">Pacific Time (US and Canada) (America/Los_Angeles)</SelectItem>
                     <SelectItem value="america-chihuahua">Chihuahua, La Paz (America/Chihuahua)</SelectItem>
                     <SelectItem value="america-mazatlan">Mazatlan (America/Mazatlan)</SelectItem>
                     <SelectItem value="america-phoenix">Arizona (America/Phoenix)</SelectItem>
                     <SelectItem value="america-denver">Mountain Time (US and Canada) (America/Denver)</SelectItem>
                     <SelectItem value="america-guatemala">Central America (America/Guatemala)</SelectItem>
                     <SelectItem value="america-chicago">Central Time (US and Canada) (America/Chicago)</SelectItem>
                     <SelectItem value="america-regina">Saskatchewan (America/Regina)</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
             </div>

             <div className="flex flex-col md:flex-row md:items-center py-5">
               <div className="w-[250px] shrink-0 mb-2 md:mb-0">
                 <span className={cn("text-[13px] font-bold", mode === "dark" ? "text-slate-200" : "text-slate-800")}>Phone number</span>
               </div>
               <div className="flex-1">
                 <div className="relative">
                   <Input 
                     value={generalData.phone}
                     readOnly
                     onClick={handleOpenPhoneModal}
                     className={cn("text-[13px] h-10 transition-colors shadow-none rounded focus-visible:ring-1 focus-visible:ring-slate-300 pr-10 cursor-pointer", 
                     mode === "dark" ? "bg-[#0f172a] border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900")} 
                   />
                   <Edit2 className="absolute right-3 top-3 w-4 h-4 text-blue-500 cursor-pointer" onClick={handleOpenPhoneModal} />
                 </div>
               </div>
             </div>
          </div>

          <div className={cn("p-4 border-t flex justify-end", mode === "dark" ? "border-slate-800" : "border-slate-200")}>
            <button 
              onClick={() => updateGeneralMutation.mutate(generalData)}
              disabled={updateGeneralMutation.isPending}
              className={cn("px-6 py-1.5 rounded text-[13px] font-medium transition-colors border",
              mode === "dark" ? "bg-[#1e293b] hover:bg-[#00e55e] text-[#00e55e] hover:text-white border-[#00e55e]" : "bg-white hover:bg-[#00e55e] hover:text-white text-[#00e55e] border-[#00e55e]")}>
              {updateGeneralMutation.isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Billing Details Section */}
      <Card className={cn("shadow-sm overflow-hidden transition-colors rounded-lg", 
        mode === "dark" ? "bg-[#1e293b] border-slate-800" : "bg-white border-slate-300")}>
        <div className={cn("p-5 border-b flex items-center gap-4 transition-colors", 
          mode === "dark" ? "border-slate-800" : "border-slate-200")}>
          <CreditCard className={cn("w-6 h-6", mode === "dark" ? "text-slate-300" : "text-slate-800")} />
          <div>
            <h2 className={cn("font-bold text-[15px] tracking-tight", 
              mode === "dark" ? "text-white" : "text-slate-900")}>Billing Details</h2>
            <p className={cn("text-[12px] font-medium", mode === "dark" ? "text-slate-400" : "text-slate-500")}>Details that will be shown on your invoices</p>
          </div>
        </div>
        
        <CardContent className="p-0">
          <div className="px-6">
             <div className={cn("flex flex-col md:flex-row md:items-center py-4 border-b", mode === "dark" ? "border-slate-800" : "border-slate-200")}>
               <div className="w-[250px] shrink-0 mb-2 md:mb-0">
                 <span className={cn("text-[13px] font-bold", mode === "dark" ? "text-slate-200" : "text-slate-800")}>Company Name</span>
               </div>
               <div className="flex-1">
                 <Input 
                   value={billingData.billing_company}
                   onChange={(e) => {
                     setBillingData({ ...billingData, billing_company: e.target.value });
                     if (e.target.value) setBillingErrors(prev => ({ ...prev, billing_company: "" }));
                   }}
                   className={cn("text-[13px] h-10 transition-colors shadow-none rounded focus-visible:ring-1 focus-visible:ring-slate-300", 
                     billingErrors.billing_company && "border-red-400 focus-visible:ring-red-400",
                     mode === "dark" ? "bg-[#0f172a] border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900")} 
                 />
                 {billingErrors.billing_company && <div className="text-red-400 text-[12px] italic mt-1.5">{billingErrors.billing_company}</div>}
               </div>
             </div>

             <div className={cn("flex flex-col md:flex-row md:items-center py-4 border-b", mode === "dark" ? "border-slate-800" : "border-slate-200")}>
               <div className="w-[250px] shrink-0 mb-2 md:mb-0">
                 <span className={cn("text-[13px] font-bold", mode === "dark" ? "text-slate-200" : "text-slate-800")}>Person Responsible</span>
               </div>
               <div className="flex-1">
                 <Input 
                   value={billingData.billing_person}
                   onChange={(e) => {
                     setBillingData({ ...billingData, billing_person: e.target.value });
                     if (e.target.value) setBillingErrors(prev => ({ ...prev, billing_person: "" }));
                   }}
                   className={cn("text-[13px] h-10 transition-colors shadow-none rounded focus-visible:ring-1 focus-visible:ring-slate-300", 
                     billingErrors.billing_person && "border-red-400 focus-visible:ring-red-400",
                     mode === "dark" ? "bg-[#0f172a] border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900")} 
                 />
                 {billingErrors.billing_person && <div className="text-red-400 text-[12px] italic mt-1.5">{billingErrors.billing_person}</div>}
               </div>
             </div>

             <div className={cn("flex flex-col md:flex-row md:items-center py-4 border-b", mode === "dark" ? "border-slate-800" : "border-slate-200")}>
               <div className="w-[250px] shrink-0 mb-2 md:mb-0">
                 <span className={cn("text-[13px] font-bold", mode === "dark" ? "text-slate-200" : "text-slate-800")}>Tax ID</span>
               </div>
               <div className="flex-1">
                 <Select 
                   value={billingData.tax_id}
                   onValueChange={(val) => {
                     setBillingData({ ...billingData, tax_id: val });
                     if (val) setBillingErrors(prev => ({ ...prev, tax_id: "" }));
                   }}
                 >
                   <SelectTrigger className={cn("text-[13px] h-10 transition-colors shadow-none rounded focus-visible:ring-1 focus-visible:ring-slate-300", 
                     billingErrors.tax_id && "border-red-400 focus-visible:ring-red-400",
                     mode === "dark" ? "bg-[#0f172a] border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900")}>
                     <SelectValue placeholder="Select a Tax ID" />
                   </SelectTrigger>
                   <SelectContent className={cn("border shadow-2xl transition-colors max-h-[300px]", 
                     mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900")}>
                     {TAX_IDS.map(taxId => (
                       <SelectItem key={taxId} value={taxId} className="text-[13px]">{taxId}</SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
                 {billingErrors.tax_id && <div className="text-red-400 text-[12px] italic mt-1.5">{billingErrors.tax_id}</div>}
               </div>
             </div>

             <div className={cn("flex flex-col md:flex-row md:items-center py-4 border-b", mode === "dark" ? "border-slate-800" : "border-slate-200")}>
               <div className="w-[250px] shrink-0 mb-2 md:mb-0">
                 <span className={cn("text-[13px] font-bold", mode === "dark" ? "text-slate-200" : "text-slate-800")}>Tax ID Name / Tax Number</span>
               </div>
               <div className="flex-1 grid grid-cols-2 gap-4">
                 <div>
                   <Input 
                     value={billingData.tax_id_name}
                     onChange={(e) => {
                       setBillingData({ ...billingData, tax_id_name: e.target.value });
                       if (e.target.value) setBillingErrors(prev => ({ ...prev, tax_id_name: "" }));
                     }}
                     placeholder=""
                     className={cn("text-[13px] h-10 transition-colors shadow-none rounded focus-visible:ring-1 focus-visible:ring-slate-300", 
                       billingErrors.tax_id_name && "border-red-400 focus-visible:ring-red-400",
                       mode === "dark" ? "bg-[#0f172a] border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900")} 
                   />
                   {billingErrors.tax_id_name && <div className="text-red-400 text-[12px] italic mt-1.5">{billingErrors.tax_id_name}</div>}
                 </div>
                 <div>
                   <Input 
                     value={billingData.tax_number}
                     onChange={(e) => {
                       setBillingData({ ...billingData, tax_number: e.target.value });
                       if (e.target.value) setBillingErrors(prev => ({ ...prev, tax_number: "" }));
                     }}
                     placeholder=""
                     className={cn("text-[13px] h-10 transition-colors shadow-none rounded focus-visible:ring-1 focus-visible:ring-slate-300", 
                       billingErrors.tax_number && "border-red-400 focus-visible:ring-red-400",
                       mode === "dark" ? "bg-[#0f172a] border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900")} 
                   />
                   {billingErrors.tax_number && <div className="text-red-400 text-[12px] italic mt-1.5">{billingErrors.tax_number}</div>}
                 </div>
               </div>
             </div>

             <div className={cn("flex flex-col md:flex-row md:items-center py-4 border-b", mode === "dark" ? "border-slate-800" : "border-slate-200")}>
               <div className="w-[250px] shrink-0 mb-2 md:mb-0">
                 <span className={cn("text-[13px] font-bold", mode === "dark" ? "text-slate-200" : "text-slate-800")}>Address</span>
               </div>
               <div className="flex-1">
                 <Input 
                   value={billingData.address.street}
                   onChange={(e) => setBillingData({ ...billingData, address: { ...billingData.address, street: e.target.value } })}
                   className={cn("text-[13px] h-10 transition-colors shadow-none rounded focus-visible:ring-1 focus-visible:ring-slate-300", 
                     mode === "dark" ? "bg-[#0f172a] border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900")} 
                 />
               </div>
             </div>

             <div className={cn("flex flex-col md:flex-row md:items-center py-4 border-b", mode === "dark" ? "border-slate-800" : "border-slate-200")}>
                <div className="w-[250px] shrink-0 mb-2 md:mb-0">
                  <span className={cn("text-[13px] font-bold", mode === "dark" ? "text-slate-200" : "text-slate-800")}>Country</span>
                </div>
                <div className="flex-1">
                  <Select 
                    value={billingData.address.country_iso2}
                    onValueChange={(val) => {
                      setBillingData({ ...billingData, address: { ...billingData.address, country_iso2: val, state: "", city: "" } });
                      if (val) setBillingErrors(prev => ({ ...prev, country_iso2: "" }));
                    }}
                  >
                    <SelectTrigger className={cn("text-[13px] h-10 transition-colors shadow-none rounded focus-visible:ring-1 focus-visible:ring-slate-300", 
                      billingErrors.country_iso2 && "border-red-400 focus-visible:ring-red-400",
                      mode === "dark" ? "bg-[#0f172a] border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900")}>
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent className={cn("border shadow-2xl transition-colors max-h-[300px]", 
                      mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900")}>
                      {Country.getAllCountries().map(country => (
                        <SelectItem key={country.isoCode} value={country.isoCode} className="text-[13px]">
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {billingErrors.country_iso2 && <div className="text-red-400 text-[12px] italic mt-1.5">{billingErrors.country_iso2}</div>}
                </div>
              </div>

              <div className={cn("flex flex-col md:flex-row md:items-center py-4 border-b", mode === "dark" ? "border-slate-800" : "border-slate-200")}>
                <div className="w-[250px] shrink-0 mb-2 md:mb-0">
                  <span className={cn("text-[13px] font-bold", mode === "dark" ? "text-slate-200" : "text-slate-800")}>State</span>
                </div>
                <div className="flex-1">
                  <Select 
                    value={billingData.address.state}
                    onValueChange={(val) => {
                      setBillingData({ ...billingData, address: { ...billingData.address, state: val, city: "" } });
                      if (val) setBillingErrors(prev => ({ ...prev, state: "" }));
                    }}
                    disabled={!billingData.address.country_iso2}
                  >
                    <SelectTrigger className={cn("text-[13px] h-10 transition-colors shadow-none rounded focus-visible:ring-1 focus-visible:ring-slate-300 disabled:opacity-50", 
                      billingErrors.state && "border-red-400 focus-visible:ring-red-400",
                      mode === "dark" ? "bg-[#0f172a] border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900")}>
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent className={cn("border shadow-2xl transition-colors max-h-[300px]", 
                      mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900")}>
                      {billingData.address.country_iso2 && State.getStatesOfCountry(billingData.address.country_iso2).map(state => (
                        <SelectItem key={state.isoCode} value={state.isoCode} className="text-[13px]">
                          {state.name}
                        </SelectItem>
                      ))}
                      {billingData.address.country_iso2 && State.getStatesOfCountry(billingData.address.country_iso2).length === 0 && (
                        <SelectItem value="none" disabled className="text-[13px]">No states available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {billingErrors.state && <div className="text-red-400 text-[12px] italic mt-1.5">{billingErrors.state}</div>}
                </div>
              </div>

              <div className={cn("flex flex-col md:flex-row md:items-center py-4 border-b", mode === "dark" ? "border-slate-800" : "border-slate-200")}>
                <div className="w-[250px] shrink-0 mb-2 md:mb-0">
                  <span className={cn("text-[13px] font-bold", mode === "dark" ? "text-slate-200" : "text-slate-800")}>City</span>
                </div>
                <div className="flex-1">
                  <Select 
                    value={billingData.address.city}
                    onValueChange={(val) => {
                      setBillingData({ ...billingData, address: { ...billingData.address, city: val } });
                      if (val) setBillingErrors(prev => ({ ...prev, city: "" }));
                    }}
                    disabled={!billingData.address.country_iso2 || (!billingData.address.state && State.getStatesOfCountry(billingData.address.country_iso2).length > 0)}
                  >
                    <SelectTrigger className={cn("text-[13px] h-10 transition-colors shadow-none rounded focus-visible:ring-1 focus-visible:ring-slate-300 disabled:opacity-50", 
                      billingErrors.city && "border-red-400 focus-visible:ring-red-400",
                      mode === "dark" ? "bg-[#0f172a] border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900")}>
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent className={cn("border shadow-2xl transition-colors max-h-[300px]", 
                      mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900")}>
                      {billingData.address.country_iso2 && (
                        State.getStatesOfCountry(billingData.address.country_iso2).length > 0 
                          ? billingData.address.state ? City.getCitiesOfState(billingData.address.country_iso2, billingData.address.state) : []
                          : City.getCitiesOfCountry(billingData.address.country_iso2) || []
                      ).map((city, index) => (
                        <SelectItem key={`${city.name}-${index}`} value={city.name} className="text-[13px]">
                          {city.name}
                        </SelectItem>
                      ))}
                      {billingData.address.country_iso2 && (
                        State.getStatesOfCountry(billingData.address.country_iso2).length > 0 
                          ? billingData.address.state ? City.getCitiesOfState(billingData.address.country_iso2, billingData.address.state) : []
                          : City.getCitiesOfCountry(billingData.address.country_iso2) || []
                      ).length === 0 && (
                        <SelectItem value="none" disabled className="text-[13px]">No cities available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {billingErrors.city && <div className="text-red-400 text-[12px] italic mt-1.5">{billingErrors.city}</div>}
                </div>
              </div>

             <div className={cn("flex flex-col md:flex-row md:items-center py-4")}>
               <div className="w-[250px] shrink-0 mb-2 md:mb-0">
                 <span className={cn("text-[13px] font-bold", mode === "dark" ? "text-slate-200" : "text-slate-800")}>Zip Code</span>
               </div>
               <div className="flex-1">
                 <Input 
                   value={billingData.address.zip}
                   onChange={(e) => setBillingData({ ...billingData, address: { ...billingData.address, zip: e.target.value } })}
                   className={cn("text-[13px] h-10 transition-colors shadow-none rounded focus-visible:ring-1 focus-visible:ring-slate-300", 
                     mode === "dark" ? "bg-[#0f172a] border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900")} 
                 />
               </div>
             </div>
          </div>

          <div className={cn("p-4 border-t flex justify-end", mode === "dark" ? "border-slate-800" : "border-slate-200")}>
            <button 
              onClick={handleSaveBilling}
              disabled={updateBillingMutation.isPending}
              className={cn("px-6 py-1.5 rounded text-[13px] font-medium transition-colors border",
              mode === "dark" ? "bg-[#1e293b] hover:bg-[#00e55e] text-[#00e55e] hover:text-white border-[#00e55e]" : "bg-white hover:bg-[#00e55e] hover:text-white text-[#00e55e] border-[#00e55e]")}>
              {updateBillingMutation.isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Recipients Section */}
      <Card className={cn("shadow-sm overflow-hidden transition-colors rounded-lg", 
        mode === "dark" ? "bg-[#1e293b] border-slate-800" : "bg-white border-slate-300")}>
        <div className={cn("p-5 border-b flex items-center gap-4 transition-colors", 
          mode === "dark" ? "border-slate-800" : "border-slate-200")}>
          <CreditCard className={cn("w-6 h-6", mode === "dark" ? "text-slate-300" : "text-slate-800")} />
          <div>
            <h2 className={cn("font-bold text-[15px] tracking-tight", 
              mode === "dark" ? "text-white" : "text-slate-900")}>Invoice Recipients</h2>
            <p className={cn("text-[12px] font-medium", mode === "dark" ? "text-slate-400" : "text-slate-500")}>Add people to receive a copy of your invoices.</p>
          </div>
        </div>
        
        <CardContent className="p-0">
          <div className="px-6 py-4 space-y-4">
            {recipients.map((recipient, index) => (
              <div key={index} className={cn("flex flex-col md:flex-row md:items-center py-2 border-b", mode === "dark" ? "border-slate-800" : "border-slate-200")}>
                <div className="w-[250px] shrink-0 mb-2 md:mb-0">
                  <span className={cn("text-[13px] font-bold", mode === "dark" ? "text-slate-200" : "text-slate-800")}>Recipient # {index + 1}</span>
                </div>
                <div className="flex-1 flex gap-2">
                  <Input 
                    value={recipient}
                    readOnly
                    className={cn("text-[13px] h-10 flex-1 transition-all rounded shadow-none", 
                      mode === "dark" ? "bg-[#0f172a] border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900")} 
                  />
                  <button 
                    onClick={() => handleDeleteRecipient(index)}
                    className="px-4 py-1.5 rounded text-[13px] font-medium transition-colors border bg-white hover:bg-red-50 text-red-500 border-red-300 dark:bg-[#1e293b] dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/30 shadow-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {isAdding ? (
              <div className="flex flex-col md:flex-row md:items-center py-2 animate-in fade-in slide-in-from-left-2">
                <div className="w-[250px] shrink-0 mb-2 md:mb-0">
                  <span className={cn("text-[13px] font-bold", mode === "dark" ? "text-slate-200" : "text-slate-800")}>New Recipient</span>
                </div>
                <div className="flex-1 flex gap-2">
                  <Input 
                    placeholder="test@test.com"
                    value={newRecipient}
                    onChange={(e) => setNewRecipient(e.target.value)}
                    className={cn("text-[13px] h-10 flex-1 transition-all rounded shadow-none focus-visible:ring-1 focus-visible:ring-slate-300", 
                      mode === "dark" ? "bg-[#0f172a] border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900")} 
                  />
                  <button 
                    onClick={handleSaveRecipient}
                    className="px-4 py-1.5 rounded text-[13px] font-medium transition-colors border bg-[#00e55e] hover:bg-[#00c853] text-white border-[#00e55e] shadow-sm"
                  >
                    Save
                  </button>
                  <button 
                    onClick={() => setIsAdding(false)}
                    className={cn("px-4 py-1.5 rounded text-[13px] font-medium transition-colors border shadow-sm",
                      mode === "dark" ? "bg-slate-800 text-white border-slate-700 hover:bg-slate-700" : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50")}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-2 pb-2">
                <button 
                  onClick={() => setIsAdding(true)}
                  className={cn("px-6 py-1.5 rounded text-[13px] font-medium transition-colors border",
                  mode === "dark" ? "bg-[#1e293b] hover:bg-[#00e55e] text-[#00e55e] hover:text-white border-[#00e55e]" : "bg-white hover:bg-[#00e55e] hover:text-white text-[#00e55e] border-[#00e55e]")}
                >
                  Add an invoice recipient
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isPhoneModalOpen} onOpenChange={setIsPhoneModalOpen}>
        <DialogContent className={cn("sm:max-w-[450px] p-0 border-0 overflow-hidden shadow-2xl", 
          mode === "dark" ? "bg-[#1e293b] text-white" : "bg-white text-slate-900")}>
          <DialogHeader className={cn("p-4 border-b", mode === "dark" ? "border-slate-800" : "border-slate-200")}>
            <DialogTitle className="text-[15px] font-bold">Update mobile number</DialogTitle>
          </DialogHeader>
          
          <div className="p-6 space-y-3">
            <label className={cn("text-[13px] font-bold", mode === "dark" ? "text-slate-200" : "text-slate-800")}>
              Enter mobile number
            </label>
            <div className="flex flex-col gap-3">
              <div className={cn("flex items-center flex-1 rounded border transition-colors focus-within:ring-1", 
                phoneError ? "border-red-400 focus-within:ring-red-400" :
                mode === "dark" ? "bg-[#0f172a] border-slate-700 focus-within:ring-slate-600" : "bg-white border-slate-300 focus-within:ring-slate-300")}>
                
                <Popover open={isCountryDropdownOpen} onOpenChange={setIsCountryDropdownOpen}>
                  <PopoverTrigger asChild>
                    <button className={cn("flex items-center gap-2 pl-3 pr-2 py-2 h-10 border-r focus:outline-none hover:bg-slate-50 transition-colors", 
                      phoneError ? "border-red-400" : mode === "dark" ? "border-slate-700 dark:hover:bg-slate-800/50" : "border-slate-200")}>
                      <img src={`https://flagcdn.com/w20/${selectedCountry.code.toLowerCase()}.png`} width="20" alt={selectedCountry.name} className="shadow-sm rounded-[2px]" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent 
                    className={cn("w-[280px] p-0 shadow-2xl border", 
                      mode === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-200")} 
                    align="start"
                  >
                    <div className="p-2 border-b dark:border-slate-700">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                        <Input 
                          placeholder="Search" 
                          value={phoneSearchQuery}
                          onChange={(e) => setPhoneSearchQuery(e.target.value)}
                          className={cn("h-9 pl-9 text-[13px] shadow-none focus-visible:ring-1", 
                            mode === "dark" ? "bg-[#0f172a] border-slate-700 text-white" : "bg-white border-slate-200")}
                        />
                      </div>
                    </div>
                    <div className="max-h-[250px] overflow-y-auto p-1 overscroll-contain" onWheel={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()}>
                      {COUNTRIES.filter(c => 
                        c.name.toLowerCase().includes(phoneSearchQuery.toLowerCase()) || 
                        c.dial.includes(phoneSearchQuery)
                      ).map((country) => (
                        <button
                          key={country.code}
                          onPointerDown={(e) => {
                            e.preventDefault();
                            setSelectedCountry(country);
                            setIsCountryDropdownOpen(false);
                            setPhoneSearchQuery("");
                          }}
                          className={cn("w-full flex items-center justify-between px-3 py-2 text-[13px] rounded-sm text-left transition-colors", 
                            mode === "dark" ? "hover:bg-slate-800 text-slate-200" : "hover:bg-slate-100 text-slate-700",
                            selectedCountry.code === country.code && (mode === "dark" ? "bg-slate-800 font-medium" : "bg-slate-100 font-medium")
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <img src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`} width="16" alt={country.name} className="shadow-sm rounded-[2px]" />
                            <span>{country.name} ({country.dial})</span>
                          </div>
                        </button>
                      ))}
                      {COUNTRIES.filter(c => c.name.toLowerCase().includes(phoneSearchQuery.toLowerCase()) || c.dial.includes(phoneSearchQuery)).length === 0 && (
                        <div className="p-3 text-center text-[13px] text-slate-500">No countries found.</div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>

                <Input 
                  value={tempPhone}
                  onChange={(e) => {
                    setTempPhone(e.target.value);
                    if (e.target.value.trim()) setPhoneError("");
                  }}
                  placeholder={
                    selectedCountry.code === "US" || selectedCountry.code === "CA" ? "(407) 231-1234" :
                    selectedCountry.code === "PK" ? "333 2345678" :
                    selectedCountry.code === "IN" ? "98765 43210" :
                    selectedCountry.code === "GB" ? "7911 123456" :
                    selectedCountry.code === "AU" ? "412 345 678" :
                    selectedCountry.code === "FR" ? "6 12 34 56 78" :
                    selectedCountry.code === "DE" ? "1512 3456789" :
                    selectedCountry.code === "AE" ? "50 123 4567" :
                    selectedCountry.code === "SA" ? "50 123 4567" :
                    "123 456 7890"
                  }
                  className="flex-1 h-10 border-0 focus-visible:ring-0 shadow-none bg-transparent px-3 text-[13px]"
                />
              </div>

              {phoneError && (
                <div className="text-red-400 text-[13px] italic">{phoneError}</div>
              )}

              <div className="flex justify-end pt-1">
                <button 
                  onClick={handleSavePhone}
                  className={cn("px-5 py-1.5 rounded text-[13px] font-medium transition-colors border",
                    mode === "dark" 
                      ? "bg-[#1e293b] hover:bg-[#00e55e] text-[#00e55e] hover:text-white border-[#00e55e]" 
                      : "bg-white hover:bg-[#00e55e] hover:text-white text-[#00e55e] border-[#00e55e]"
                  )}
                >
                  submit
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgencyGeneralSettings;
