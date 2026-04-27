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
  Pipette
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";


const AgencyWhiteLabelSettings = () => {
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

  const [brandingData, setBrandingData] = useState({
    color: "#149f8f",
    logo: "",
    favicon: "",
    slug: "",
    domain: ""
  });

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
      toast({ title: "Branding Updated", description: "White label settings have been saved." });
    }
  });

  const handleColorChange = (color: string) => {
    setBrandingData({ ...brandingData, color });
    // We could auto-save or wait for a save button if we add one
  };


  const features = [
    // ... same as before
    "Customize your Agency Logo, Colors and Domain.",
    "Your agency logo will be displayed in all of your workspaces.",
    "Your agency colors will be displayed in all of your workspaces.",
    "Your agency e-mail can be used from your Workspaces.",
    "Display your agency logo, colors, emails and the generic *.chatbotsystem.ai domain to White Label all your Workspaces."
  ];

  return (
    <div className={cn("p-6 font-sans transition-colors duration-300", mode === "dark" ? "text-white" : "text-slate-900")}>
      <Card className={cn("shadow-xl overflow-hidden transition-colors duration-300", 
        mode === "dark" ? "bg-[#1e293b] border-slate-800" : "bg-white border-slate-200")}>
        {/* Header Section */}
        <div className={cn("p-4 border-b flex items-center gap-3", mode === "dark" ? "border-slate-800" : "border-slate-100")}>
          <Settings className="w-5 h-5 text-gray-400" />
          <div>
            <h2 className={cn("font-bold text-base leading-tight uppercase tracking-tight", mode === "dark" ? "text-white" : "text-slate-900")}>White Label</h2>
            <p className="text-[11px] text-gray-500">Replace our brand with your own agency brand!</p>
          </div>
        </div>
        
        <CardContent className="p-0">
          <Tabs defaultValue="features" className="w-full">
            <TabsList className={cn("bg-transparent border-b w-full justify-start rounded-none h-12 p-0 px-4 gap-8", 
              mode === "dark" ? "border-slate-800" : "border-slate-100")}>
              {["features", "logo", "favicon", "colors", "domain", "notification"].map((tab) => (
                <TabsTrigger 
                  key={tab}
                  value={tab} 
                  className={cn(
                    "data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 h-full font-semibold text-sm transition-colors",
                    mode === "dark" 
                      ? "text-gray-400 data-[state=active]:text-white" 
                      : "text-gray-500 data-[state=active]:text-slate-900"
                  )}
                >
                  {tab === "notification" ? "Notification E-mail" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="features" className="p-6">
              <div className={cn("rounded-lg border p-10 min-h-[400px] transition-colors", 
                mode === "dark" ? "bg-[#334155]/30 border-slate-700/50" : "bg-slate-50 border-slate-200")}>
                <div className="space-y-2 mb-8">
                  <h3 className={cn("text-sm font-bold", mode === "dark" ? "text-gray-300" : "text-slate-600")}>Agency White Label</h3>
                  <div className="flex items-baseline">
                    <span className={cn("text-6xl font-bold", mode === "dark" ? "text-white" : "text-slate-900")}>$0</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <p className={cn("text-sm font-bold", mode === "dark" ? "text-gray-200" : "text-slate-700")}>
                    Personalize your Workspaces with your logo, colors and chatbotsystem.ai domain.
                  </p>
                  
                  <ul className="space-y-3">
                    {features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" />
                        <span className={cn("text-sm leading-relaxed", mode === "dark" ? "text-gray-400" : "text-slate-500")}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="logo" className="p-6 space-y-12">
              {/* Light Mode Section */}
              <div className="space-y-6">
                <div className="flex items-start gap-3 text-gray-400">
                   <Info className="w-5 h-5 shrink-0 mt-0.5" />
                   <p className="text-[11px] leading-relaxed">
                     The logos displayed in this Agency account and as the default logo in Workspaces when the agent selects light mode. Please note that you can assign specific logos directly to specific Workspaces. This change will not affect custom logos in active Workspaces.
                   </p>
                </div>

                <div className="flex gap-12">
                  <div className="space-y-2">
                    <p className={cn("text-[12px] font-bold uppercase", mode === "dark" ? "text-gray-300" : "text-slate-500")}>Full wide logo</p>
                    <div className={cn("w-[300px] h-24 border-2 border-dashed rounded-lg flex items-center justify-center relative group overflow-hidden transition-colors",
                      mode === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-slate-50 border-slate-200")}>
                       {brandingData.logo ? (
                         <img src={brandingData.logo} alt="Agency Logo" className="max-h-full object-contain" />
                       ) : (
                         <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-green-500 rounded flex items-center justify-center font-bold text-white text-xl">R</div>
                            <span className={cn("text-xl font-bold transition-colors", mode === "dark" ? "text-gray-400" : "text-slate-900")}>REPLYAGENT</span>
                         </div>
                       )}
                    </div>
                    <Input 
                      placeholder="Logo URL" 
                      value={brandingData.logo}
                      onChange={(e) => setBrandingData({ ...brandingData, logo: e.target.value })}
                      className="mt-2 text-xs"
                    />
                    <p className="text-[10px] text-red-500 font-medium italic">Recommended size: 460px * 140px</p>
                  </div>

                  <div className="flex items-end pb-8">
                    <button 
                      onClick={() => updateMutation.mutate({ logo: brandingData.logo })}
                      className="bg-primary text-white px-4 py-2 rounded text-xs font-bold">
                      {updateMutation.isPending ? "Saving..." : "Save Logo"}
                    </button>
                  </div>
                </div>

              </div>

              {/* Dark Mode Section */}
              <div className="space-y-6">
                <div className={cn("flex items-start gap-3 text-gray-400 border-t pt-8", mode === "dark" ? "border-slate-800" : "border-slate-100")}>
                   <Info className="w-5 h-5 shrink-0 mt-0.5" />
                   <p className="text-[11px] leading-relaxed">
                     The logos displayed in this Agency account and as the default logo in Workspaces when the agent selects dark mode. Please note that you can assign specific logos directly to specific Workspaces. This change will not affect custom logos in active Workspaces.
                   </p>
                </div>

                <div className="flex gap-12">
                  <div className="space-y-2">
                    <p className={cn("text-[12px] font-bold uppercase", mode === "dark" ? "text-gray-300" : "text-slate-500")}>Full wide logo</p>
                    <div className={cn("w-[300px] h-24 border-2 border-dashed rounded-lg flex items-center justify-center relative group cursor-pointer hover:border-primary transition-colors",
                      mode === "dark" ? "bg-white/5 border-slate-700" : "bg-slate-900 border-slate-800")}>
                       <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-green-500 rounded flex items-center justify-center font-bold text-white text-xl">R</div>
                          <span className="text-xl font-bold text-white">REPLYAGENT</span>
                       </div>
                    </div>
                    <p className="text-[10px] text-red-500 font-medium italic">Recommended size: 460px * 140px</p>
                  </div>

                  <div className="space-y-2">
                    <p className={cn("text-[12px] font-bold uppercase", mode === "dark" ? "text-gray-300" : "text-slate-500")}>Small logo</p>
                    <div className={cn("w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center relative group cursor-pointer hover:border-primary transition-colors",
                      mode === "dark" ? "bg-white/5 border-slate-700" : "bg-slate-900 border-slate-800")}>
                       <div className="w-12 h-12 bg-green-500 rounded flex items-center justify-center font-bold text-white text-2xl">R</div>
                    </div>
                    <p className="text-[10px] text-red-500 font-medium italic">Recommended size: 256px * 256px</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="favicon" className="p-6 space-y-6">
              <div className="flex items-start gap-3 text-gray-400">
                 <Info className="w-5 h-5 shrink-0 mt-0.5" />
                 <p className="text-[11px] leading-relaxed">
                   Upload the favicon that will be displayed at the browsers tab.
                 </p>
              </div>

              <div className="space-y-4">
                <div className={cn("w-16 h-16 border-2 border-dashed rounded-lg flex items-center justify-center relative overflow-hidden transition-colors",
                  mode === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-slate-50 border-slate-200")}>
                   {brandingData.favicon ? (
                     <img src={brandingData.favicon} alt="Favicon" className="w-full h-full object-contain" />
                   ) : (
                     <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center font-bold text-white text-xs">R</div>
                   )}
                </div>
                <div className="flex gap-4 max-w-md">
                  <Input 
                    placeholder="Favicon URL" 
                    value={brandingData.favicon}
                    onChange={(e) => setBrandingData({ ...brandingData, favicon: e.target.value })}
                    className="text-xs flex-1"
                  />
                  <button 
                    onClick={() => updateMutation.mutate({ favicon: brandingData.favicon })}
                    className="bg-primary text-white px-4 py-2 rounded text-xs font-bold shrink-0">
                    {updateMutation.isPending ? "Saving..." : "Save Favicon"}
                  </button>
                </div>
                <p className="text-[10px] text-red-500 font-medium italic">Recommended size: 64px * 64px</p>
              </div>

            </TabsContent>

            <TabsContent value="colors" className="p-6 space-y-6">
              <div className="flex items-start gap-3 text-gray-400">
                 <Info className="w-5 h-5 shrink-0 mt-0.5" />
                 <p className="text-[11px] leading-relaxed">
                   Select the color that will be set to your account and Workspaces.
                 </p>
              </div>

              <div className="max-w-xs">
                <Popover>
                  <PopoverTrigger asChild>
                    <div className={cn("border rounded-md p-2 flex items-center gap-3 cursor-pointer transition-colors",
                      mode === "dark" ? "bg-[#1e293b] border-slate-700 hover:bg-[#334155]/50" : "bg-slate-50 border-slate-200 hover:bg-slate-100")}>
                       <div className="w-5 h-5 rounded" style={{ backgroundColor: brandingData.color }} />
                       <span className={cn("text-sm font-medium flex-1", mode === "dark" ? "text-gray-300" : "text-slate-700")}>{brandingData.color}</span>
                       <ChevronDown size={14} className="text-gray-500" />
                    </div>

                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3 bg-white border-none shadow-2xl rounded-lg overflow-hidden" align="start">
                    <div className="space-y-4">
                      <HexColorPicker color={brandingData.color} onChange={handleColorChange} />
                      
                      <div className="flex items-center gap-4">
                         <div className="w-8 h-8 flex items-center justify-center text-gray-600">
                            <Pipette size={18} />
                         </div>
                         <div className="w-10 h-10 rounded-full border border-gray-100" style={{ backgroundColor: brandingData.color }} />
                         <div className="h-4 flex-1 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 rounded-full relative">
                            <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow-md" style={{ left: '50%' }} />
                         </div>
                      </div>
                      <Button onClick={() => updateMutation.mutate({ color: brandingData.color })} className="w-full mt-2">
                        {updateMutation.isPending ? "Saving..." : "Save Color"}
                      </Button>


                      <div className="grid grid-cols-3 gap-2">
                        {["R", "G", "B"].map((label, idx) => (
                          <div key={label} className="space-y-1 text-center">
                            <div className="bg-gray-50 border border-gray-200 rounded p-2 text-sm text-gray-700 font-medium">
                              {parseInt(brandingData.color.slice(1 + idx * 2, 3 + idx * 2), 16) || 0}
                            </div>
                            <span className="text-[10px] text-gray-400 font-bold">{label}</span>
                          </div>
                        ))}
                      </div>

                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </TabsContent>

            <TabsContent value="domain" className="p-6 space-y-8">
              <div className="flex items-center gap-2 max-w-2xl">
                 <div className={cn("flex border rounded-md overflow-hidden flex-1 h-11 items-center transition-colors",
                   mode === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-slate-50 border-slate-200")}>
                    <span className={cn("px-3 text-sm font-medium border-r h-full flex items-center transition-colors",
                      mode === "dark" ? "text-gray-500 border-slate-700 bg-[#0f172a]/30" : "text-slate-400 border-slate-200 bg-slate-100")}>https://</span>
                    <Input 
                      placeholder="app" 
                      value={brandingData.slug}
                      onChange={(e) => setBrandingData({ ...brandingData, slug: e.target.value })}
                      className={cn("border-none bg-transparent h-full text-sm focus-visible:ring-0 w-24 text-center", 
                        mode === "dark" ? "text-white" : "text-slate-900")} 
                    />
                    <span className="px-1 text-gray-500 font-bold">•</span>
                    <Input 
                      placeholder="example.com" 
                      value={brandingData.domain}
                      onChange={(e) => setBrandingData({ ...brandingData, domain: e.target.value })}
                      className={cn("border-none bg-transparent h-full text-sm focus-visible:ring-0 flex-1", 
                        mode === "dark" ? "text-white" : "text-slate-900")} 
                    />
                 </div>
                 <button 
                  onClick={() => updateMutation.mutate({ domain: brandingData.domain, slug: brandingData.slug })}
                  className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-2.5 rounded-md text-sm font-bold transition-colors h-11">
                    {updateMutation.isPending ? "Connecting..." : "Connect"}
                 </button>

              </div>

              <div className="space-y-4 max-w-4xl">
                 <h3 className={cn("text-sm font-bold", mode === "dark" ? "text-gray-200" : "text-slate-800")}>Make your Agency shine with your own custom domain!</h3>
                 <p className={cn("text-[13px] leading-relaxed", mode === "dark" ? "text-gray-400" : "text-slate-500")}>
                   This section lets you ditch our brand and use your agency's domain name. This adds a professional touch and builds trust with your Agency employees.
                 </p>
                 <p className={cn("text-[13px] leading-relaxed", mode === "dark" ? "text-gray-400" : "text-slate-500")}>
                   <span className={cn("font-bold underline", mode === "dark" ? "text-gray-200" : "text-slate-800")}>Important Note:</span> This custom domain applies to the agency level, not individual workspaces. To change the domain for specific workspaces, head over to their settings directly.
                 </p>
              </div>
            </TabsContent>

            <TabsContent value="notification" className="p-12">
               <div className="flex flex-col items-center justify-center text-center space-y-6 min-h-[300px]">
                  <div className="w-20 h-20 bg-[#7c3aed] rounded-full flex items-center justify-center shadow-lg shadow-purple-500/20">
                     <Mail className="w-10 h-10 text-white" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className={cn("text-xl font-bold", mode === "dark" ? "text-white" : "text-slate-900")}>Notification E-mail</h3>
                    <p className={cn("text-sm max-w-md", mode === "dark" ? "text-gray-400" : "text-slate-500")}>
                      Integrate your e-mail to send branded agent invitation and forgot password emails.
                    </p>
                  </div>

                  <button className={cn("px-6 py-2 rounded text-sm font-medium transition-colors border shadow-sm",
                    mode === "dark" ? "bg-[#334155] hover:bg-[#475569] text-white border-slate-700" : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200")}>
                    Connect now
                  </button>
               </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgencyWhiteLabelSettings;
