import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Settings, 
  CheckCircle2,
  Image as ImageIcon,
  Palette,
  Globe,
  Mail,
  Box,
  Info,
  Upload,
  ChevronDown,
  Pipette,
  Trash2,
  ImagePlus,
  Plus,
  ChevronUp
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from 'react-i18next';


const AgencyWhiteLabelSettings = () => {
  const { mode } = useTheme();
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const userInfo = JSON.parse(localStorage.getItem("user_info") || "{}");
  const agencyId = userInfo.modelable_id || "1";

  const { data: agencyResponse } = useQuery({
    queryKey: [`/api/agencies/${agencyId}`],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/agencies/${agencyId}`);
      return res.json();
    }
  });

  const [brandingData, setBrandingData] = useState({
    color: "#149f8f",
    logo: "",
    favicon: "",
    slug: "",
    domain: ""
  });

  const [showEmailForm, setShowEmailForm] = React.useState(false);
  const [emailFormData, setEmailFormData] = React.useState({
    user: "info",
    domain: ""
  });
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (agencyResponse?.agency?.branding) {
      const b = agencyResponse.agency.branding;
      setBrandingData({
        color: b.color || "#149f8f",
        logo: b.logo || "",
        favicon: b.favicon || "",
        slug: agencyResponse.agency.slug || "",
        domain: b.domain || ""
      });
    }
  }, [agencyResponse]);

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("PATCH", `/api/agencies/${agencyId}/branding`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/agencies/${agencyId}`] });
      toast({ title: t("agency.settings.general.updated"), description: t("agency.settings.general.updatedDesc") });
    }
  });

  const handleColorChange = (color: string) => {
    setBrandingData({ ...brandingData, color });
    updateMutation.mutate({ color });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const features = [
    // ... same as before
    "agency.settings.general.whiteLabel.customize",
    "agency.settings.general.whiteLabel.logoDisplay",
    "agency.settings.general.whiteLabel.colorDisplay",
    "agency.settings.general.whiteLabel.emailUsage",
    "agency.settings.general.whiteLabel.whiteLabelAll"
  ];

  return (
    <div className={cn("p-6 font-sans transition-colors duration-300", mode === "dark" ? "text-white" : "text-slate-900")}>
      <Card className={cn("shadow-sm overflow-hidden transition-colors duration-300 rounded-lg", 
        mode === "dark" ? "bg-[#1e293b] border-slate-800" : "bg-white border-slate-300")}>
        {/* Header Section */}
        <div className={cn("p-5 border-b flex items-start gap-4 transition-colors", mode === "dark" ? "border-slate-800" : "border-slate-200")}>
          <Settings className={cn("w-6 h-6 mt-0.5", mode === "dark" ? "text-slate-300" : "text-slate-800")} />
          <div>
            <h2 className={cn("font-bold text-[15px] tracking-tight", mode === "dark" ? "text-white" : "text-slate-900")}>{t("agency.settings.general.whiteLabel.title")}</h2>
            <p className={cn("text-[12px] font-medium mt-0.5", mode === "dark" ? "text-slate-400" : "text-slate-500")}>{t("agency.settings.general.whiteLabel.replaceBrand")}</p>
          </div>
        </div>
        
        <CardContent className="p-0">
          <Tabs defaultValue="features" className="w-full">
            <div className={cn("px-6 border-b flex justify-start", mode === "dark" ? "border-slate-800" : "border-slate-200")}>
              <TabsList className="h-auto p-0 gap-6 bg-transparent border-none flex w-full justify-start rounded-none">
                {["features", "logo", "favicon", "colors", "domain", "notification"].map((tab) => (
                  <TabsTrigger 
                    key={tab}
                    value={tab} 
                    className={cn(
                      "px-1 py-4 rounded-none text-[13px] font-bold transition-all shadow-none relative bg-transparent",
                      "data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#00e55e]",
                      "hover:text-[#00e55e] border-b-2 border-transparent",
                      mode === "dark" 
                        ? "text-slate-400 data-[state=active]:text-[#00e55e]" 
                        : "text-slate-600 data-[state=active]:text-[#00e55e]"
                    )}
                  >
                    {tab === "notification" ? t("agency.settings.general.whiteLabel.email") : t(`agency.settings.general.whiteLabel.${tab}`)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value="features" className="p-6">
              <div className="bg-[#00e55e] rounded border-none p-6">
                <div className="space-y-0 mb-4">
                  <h3 className="text-[12px] font-bold text-white">{t("agency.settings.general.whiteLabel.title")}</h3>
                  <div className="flex items-baseline">
                    <span className="text-[48px] leading-tight font-bold text-white tracking-tight">$0</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[12px] font-bold text-white">
                    {t("agency.settings.general.whiteLabel.personalize")}
                  </p>
                  
                  <ul className="space-y-2">
                    {features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-[16px] h-[16px] text-white mt-[2px] shrink-0" />
                        <span className="text-[12px] font-medium text-white">{t(feature)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="logo" className="p-6 space-y-8">
              {/* Light Mode Section */}
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                   <Info className="w-[16px] h-[16px] text-gray-400 mt-[2px] shrink-0" />
                   <p className={cn("text-[11px] font-medium leading-relaxed", mode === "dark" ? "text-slate-400" : "text-slate-500")}>
                     {t("agency.settings.general.whiteLabel.logo_info_light")}
                   </p>
                </div>

                <div className="flex gap-8">
                  <div className="space-y-1.5">
                    <p className={cn("text-[12px] font-medium", mode === "dark" ? "text-gray-300" : "text-slate-700")}>{t("agency.settings.general.whiteLabel.fullLogo")}</p>
                    <div className={cn("w-[250px] h-20 border border-dashed rounded-lg flex items-center justify-center relative group overflow-hidden transition-colors",
                      mode === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-300")}>
                       <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                           <div className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                            {brandingData.logo ? (
                              <img src={brandingData.logo} alt="Agency Logo" className="max-h-full object-contain" />
                            ) : (
                              <div className="flex items-center gap-2">
                                 <div className="w-8 h-8 bg-[#00e55e] rounded-md flex items-center justify-center font-bold text-white text-[18px]">EC</div>
                                 <span className={cn("text-[18px] font-bold tracking-tight transition-colors", mode === "dark" ? "text-gray-400 group-hover:text-white" : "text-slate-900")}>EZCONN</span>
                              </div>
                            )}
                           </div>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent className={cn("w-48", mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "")}>
                           <DropdownMenuItem onClick={handleUploadClick} className="cursor-pointer gap-2">
                             <Upload size={14} /> {t("common.uploadNew")}
                           </DropdownMenuItem>
                           <DropdownMenuItem onClick={() => setLocation("/settings?tab=Media Gallery")} className="cursor-pointer gap-2">
                             <ImageIcon size={14} /> {t("common.selectFromGallery")}
                           </DropdownMenuItem>
                           <DropdownMenuItem className="cursor-pointer gap-2 text-red-500 hover:text-red-600">
                             <Trash2 size={14} /> {t("common.remove")}
                           </DropdownMenuItem>
                         </DropdownMenuContent>
                       </DropdownMenu>
                    </div>
                    <p className="text-[10px] text-[#ef4444]">{t("common.recommendedSize")}: 460px * 140px</p>
                  </div>

                  <div className="space-y-1.5">
                    <p className={cn("text-[12px] font-medium", mode === "dark" ? "text-gray-300" : "text-slate-700")}>{t("agency.settings.general.whiteLabel.smallLogo")}</p>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className={cn("w-16 h-16 border border-dashed rounded-lg flex items-center justify-center relative group cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors",
                          mode === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-300")}>
                           <div className="w-10 h-10 bg-[#00e55e] rounded-md flex items-center justify-center font-bold text-white text-xl">EC</div>
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className={cn("w-48", mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "")}>
                        <DropdownMenuItem onClick={handleUploadClick} className="cursor-pointer gap-2">
                          <Upload size={14} /> {t("common.uploadNew")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLocation("/settings?tab=Media Gallery")} className="cursor-pointer gap-2">
                          <ImageIcon size={14} /> {t("common.selectFromGallery")}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer gap-2 text-red-500 hover:text-red-600">
                          <Trash2 size={14} /> {t("common.remove")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <p className="text-[10px] text-[#ef4444]">{t("common.recommendedSize")}: 256px * 256px</p>
                  </div>
                </div>
              </div>

              {/* Dark Mode Section */}
              <div className="space-y-4">
                <div className={cn("flex items-start gap-2 border-t pt-6", mode === "dark" ? "border-slate-800" : "border-slate-100")}>
                   <Info className="w-[16px] h-[16px] text-gray-400 mt-[2px] shrink-0" />
                   <p className={cn("text-[11px] font-medium leading-relaxed", mode === "dark" ? "text-slate-400" : "text-slate-500")}>
                     {t("agency.settings.general.whiteLabel.logo_info_dark")}
                   </p>
                </div>

                <div className="flex gap-8">
                  <div className="space-y-1.5">
                    <p className={cn("text-[12px] font-medium", mode === "dark" ? "text-gray-300" : "text-slate-700")}>{t("agency.settings.general.whiteLabel.fullLogo")}</p>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className={cn("w-[250px] h-20 border border-dashed rounded-lg flex items-center justify-center relative group cursor-pointer hover:opacity-80 transition-opacity",
                          mode === "dark" ? "bg-white/5 border-slate-700" : "bg-[#0f172a] border-slate-800")}>
                           <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-[#00e55e] rounded-md flex items-center justify-center font-bold text-white text-[18px]">EC</div>
                              <span className="text-[18px] font-bold text-white tracking-tight">EZCONN</span>
                           </div>
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className={cn("w-48", mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "")}>
                        <DropdownMenuItem onClick={handleUploadClick} className="cursor-pointer gap-2">
                          <Upload size={14} /> {t("common.uploadNew")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLocation("/settings?tab=Media Gallery")} className="cursor-pointer gap-2">
                          <ImageIcon size={14} /> {t("common.selectFromGallery")}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer gap-2 text-red-500 hover:text-red-600">
                          <Trash2 size={14} /> {t("common.remove")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <p className="text-[10px] text-[#ef4444]">{t("common.recommendedSize")}: 460px * 140px</p>
                  </div>

                  <div className="space-y-1.5">
                    <p className={cn("text-[12px] font-medium", mode === "dark" ? "text-gray-300" : "text-slate-700")}>{t("agency.settings.general.whiteLabel.smallLogo")}</p>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className={cn("w-16 h-16 border border-dashed rounded-lg flex items-center justify-center relative group cursor-pointer hover:opacity-80 transition-opacity",
                          mode === "dark" ? "bg-white/5 border-slate-700" : "bg-[#0f172a] border-slate-800")}>
                           <div className="w-10 h-10 bg-[#00e55e] rounded-md flex items-center justify-center font-bold text-white text-xl">EC</div>
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className={cn("w-48", mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "")}>
                        <DropdownMenuItem onClick={handleUploadClick} className="cursor-pointer gap-2">
                          <Upload size={14} /> {t("common.uploadNew")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLocation("/settings?tab=Media Gallery")} className="cursor-pointer gap-2">
                          <ImageIcon size={14} /> {t("common.selectFromGallery")}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer gap-2 text-red-500 hover:text-red-600">
                          <Trash2 size={14} /> {t("common.remove")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <p className="text-[10px] text-[#ef4444]">{t("common.recommendedSize")}: 256px * 256px</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="favicon" className="p-6 space-y-4">
              <div className="flex items-start gap-2">
                 <Info className="w-[16px] h-[16px] text-gray-400 mt-[2px] shrink-0" />
                 <p className={cn("text-[11px] font-medium leading-relaxed", mode === "dark" ? "text-slate-400" : "text-slate-500")}>
                   {t("agency.settings.general.whiteLabel.uploadFavicon")}
                 </p>
              </div>

              <div className="space-y-1.5">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className={cn("w-12 h-12 border border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors",
                      mode === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-300")}>
                      {brandingData.favicon ? (
                        <img src={brandingData.favicon} alt="Favicon" className="w-full h-full object-contain rounded-lg" />
                      ) : (
                        <div className="w-7 h-7 bg-[#00e55e] rounded flex items-center justify-center font-bold text-white text-xs">EC</div>
                      )}
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className={cn("w-48", mode === "dark" ? "bg-[#1e293b] border-slate-700 text-white" : "")}>
                    <DropdownMenuItem onClick={handleUploadClick} className="cursor-pointer gap-2">
                      <Upload size={14} /> {t("common.uploadNew")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLocation("/settings?tab=Media Gallery")} className="cursor-pointer gap-2">
                      <ImageIcon size={14} /> {t("common.selectFromGallery")}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer gap-2 text-red-500 hover:text-red-600">
                      <Trash2 size={14} /> {t("common.remove")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <p className="text-[10px] text-[#ef4444]">{t("common.recommendedSize")}: 64px * 64px</p>
              </div>
            </TabsContent>

            <TabsContent value="colors" className="p-6 space-y-5">
              <div className="flex items-start gap-2">
                 <Info className="w-[16px] h-[16px] text-gray-400 mt-[2px] shrink-0" />
                 <p className={cn("text-[11px] font-medium leading-relaxed", mode === "dark" ? "text-slate-400" : "text-slate-500")}>
                   {t("agency.settings.general.whiteLabel.selectColor")}
                 </p>
              </div>

              <div className="flex items-center gap-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <div className={cn("flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer transition-all w-[180px]", 
                      mode === "dark" ? "bg-[#1e293b] border-slate-700 hover:border-slate-500" : "bg-white border-slate-300 hover:border-slate-400")}>
                      <div className="w-4 h-4 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: brandingData.color }} />
                      <span className={cn("text-[13px] font-bold flex-1", mode === "dark" ? "text-white" : "text-slate-800")}>
                        {brandingData.color}
                      </span>
                      <div className="flex flex-col gap-0.5 opacity-50">
                        <ChevronUp size={10} />
                        <ChevronDown size={10} />
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className={cn("w-auto p-3", mode === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-200")}>
                    <div className="space-y-4">
                      <HexColorPicker color={brandingData.color} onChange={handleColorChange} />
                      
                      <div className="grid grid-cols-3 gap-2">
                        {["R", "G", "B"].map((label, idx) => {
                          const r = parseInt(brandingData.color.slice(1, 3), 16) || 0;
                          const g = parseInt(brandingData.color.slice(3, 5), 16) || 0;
                          const b = parseInt(brandingData.color.slice(5, 7), 16) || 0;
                          const val = idx === 0 ? r : idx === 1 ? g : b;
                          
                          return (
                            <div key={label} className="space-y-1">
                              <div className={cn("border rounded px-2 py-1.5 text-center text-[12px] font-bold",
                                mode === "dark" ? "bg-[#0f172a] border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800")}>
                                {val}
                              </div>
                              <p className="text-[10px] text-center font-bold text-slate-400">{label}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </TabsContent>

            <TabsContent value="domain" className="p-6 space-y-5">
              <div className="flex items-center gap-2 max-w-2xl">
                 {/* Box 1: https:// + app */}
                 <div className={cn("flex border rounded overflow-hidden h-9 items-center transition-colors",
                   mode === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-300")}>
                    <span className={cn("px-3 text-[12px] font-medium border-r h-full flex items-center transition-colors",
                      mode === "dark" ? "text-gray-500 border-slate-700 bg-[#0f172a]/30" : "text-slate-400 border-slate-300 bg-slate-50")}>https://</span>
                    <Input 
                      placeholder="app" 
                      value={brandingData.slug}
                      onChange={(e) => setBrandingData({ ...brandingData, slug: e.target.value })}
                      className={cn("border-none bg-transparent h-full text-[12px] focus-visible:ring-0 shadow-none w-24 text-center", 
                        mode === "dark" ? "text-white" : "text-slate-900")} 
                    />
                 </div>

                 <span className="text-gray-400 text-[14px] font-bold">•</span>

                 {/* Box 2: example.com */}
                 <div className={cn("flex border rounded overflow-hidden h-9 items-center transition-colors flex-1",
                   mode === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-300")}>
                    <Input 
                      placeholder="example.com" 
                      value={brandingData.domain}
                      onChange={(e) => setBrandingData({ ...brandingData, domain: e.target.value })}
                      className={cn("border-none bg-transparent h-full text-[12px] focus-visible:ring-0 shadow-none flex-1 px-3", 
                        mode === "dark" ? "text-white" : "text-slate-900")} 
                    />
                 </div>

                 <button 
                  onClick={() => updateMutation.mutate({ domain: brandingData.domain, slug: brandingData.slug })}
                  className={cn("px-6 py-1.5 rounded text-[12px] font-medium transition-colors border h-9",
                    mode === "dark" ? "bg-[#1e293b] hover:bg-[#00e55e] text-[#00e55e] hover:text-white border-[#00e55e]" : "bg-white hover:bg-[#00e55e] hover:text-white text-[#00e55e] border-[#00e55e]")}>
                    {updateMutation.isPending ? t("common.connecting") : t("common.connect")}
                 </button>
              </div>

              <div className="space-y-2 max-w-4xl">
                 <h3 className={cn("text-[13px] font-bold", mode === "dark" ? "text-gray-200" : "text-slate-800")}>{t("agency.settings.general.whiteLabel.makeShine")}</h3>
                 <p className={cn("text-[12px] leading-relaxed", mode === "dark" ? "text-gray-400" : "text-slate-500")}>
                   {t("agency.settings.general.whiteLabel.ditchBrand")}
                 </p>
                 <p className={cn("text-[12px] leading-relaxed", mode === "dark" ? "text-gray-400" : "text-slate-500")}>
                   <span className={cn("font-bold underline", mode === "dark" ? "text-gray-200" : "text-slate-800")}>{t("common.importantNote")}</span> {t("agency.settings.general.whiteLabel.customDomainNote")}
                 </p>
              </div>
            </TabsContent>

            <TabsContent value="notification" className="p-6">
               {!showEmailForm ? (
                 <div className="flex flex-col items-center justify-center text-center space-y-3 min-h-[200px]">
                    <div className="w-14 h-14 bg-[#7c3aed] rounded-full flex items-center justify-center">
                       <Mail className="w-7 h-7 text-white" />
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className={cn("text-[14px] font-bold", mode === "dark" ? "text-white" : "text-slate-900")}>{t("agency.settings.general.whiteLabel.email")}</h3>
                      <p className={cn("text-[12px] max-w-lg", mode === "dark" ? "text-gray-400" : "text-slate-500")}>
                        {t("agency.settings.general.whiteLabel.emailIntegrate")}
                      </p>
                    </div>

                    <button 
                      onClick={() => setShowEmailForm(true)}
                      className={cn("px-5 py-1.5 rounded text-[12px] font-medium transition-colors border",
                        mode === "dark" ? "bg-[#1e293b] hover:bg-[#00e55e] text-[#00e55e] hover:text-white border-[#00e55e]" : "bg-white hover:bg-[#00e55e] hover:text-white text-[#00e55e] border-[#00e55e]")}>
                      {t("common.connectNow")}
                    </button>
                 </div>
               ) : (
                 <div className="space-y-6 max-w-2xl">
                   <div className="space-y-4">
                     <div className="flex items-center gap-2">
                       <label className={cn("text-sm font-bold", mode === "dark" ? "text-gray-200" : "text-slate-800")}>{t("agency.settings.general.whiteLabel.enterDomain")}</label>
                       <Info size={14} className="text-gray-400 cursor-help" />
                     </div>
                     
                     <div className="flex items-center gap-3">
                       <div className="flex items-center gap-0 flex-1">
                          <Input 
                            value={emailFormData.user}
                            onChange={(e) => setEmailFormData(prev => ({ ...prev, user: e.target.value }))}
                            className={cn("w-32 h-11 text-sm rounded-r-none border-r-0 focus-visible:ring-0", 
                              mode === "dark" ? "bg-[#0f172a] border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900")} 
                          />
                          <div className={cn("h-11 px-3 flex items-center border-y text-gray-400 font-bold text-lg",
                            mode === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-slate-50 border-slate-200")}>
                            @
                          </div>
                          <Input 
                            placeholder="your-domain.com"
                            value={emailFormData.domain}
                            onChange={(e) => setEmailFormData(prev => ({ ...prev, domain: e.target.value }))}
                            className={cn("flex-1 h-11 text-sm rounded-l-none border-l-0 focus-visible:ring-0", 
                              mode === "dark" ? "bg-[#0f172a] border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900")} 
                          />
                       </div>
                       
                       <button className="h-11 px-8 rounded-md bg-white border border-[#149f8f] text-[#149f8f] hover:bg-[#149f8f]/5 text-sm font-bold transition-colors">
                          {t("common.continue")}
                       </button>
                     </div>
                   </div>
                 </div>
               )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            console.log("File selected:", file.name);
          }
        }}
      />
    </div>
  );
};

export default AgencyWhiteLabelSettings;
