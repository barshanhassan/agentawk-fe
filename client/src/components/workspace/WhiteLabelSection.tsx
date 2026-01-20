import React, { useState } from "react";
import { BadgeCheck, Info, ChevronsUpDown, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const ColorPicker = ({ label, value, onChange }: ColorPickerProps) => (
  <div className="space-y-2 text-left">
    <Label className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</Label>
    <div className="relative group">
      <div className="flex items-center gap-3 px-3 py-2 border border-gray-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 cursor-pointer hover:border-gray-300 dark:hover:border-slate-700 transition-colors h-10 w-full max-w-[280px]">
        <div 
          className="w-5 h-5 rounded-full border border-gray-100 dark:border-slate-800 flex-shrink-0" 
          style={{ backgroundColor: value }}
        />
        <span className="text-sm font-medium text-gray-900 dark:text-white uppercase">{value}</span>
        <ChevronsUpDown className="ml-auto w-4 h-4 text-gray-400" />
      </div>
      <input 
        type="color" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
  </div>
);

export default function WhiteLabelSection() {
  const [colors, setColors] = useState({
    mainTheme: "#0a7a22",
    links: "#5742f5",
    incomingBubble: "#705800",
    incomingText: "#ffffff",
    outgoingBubble: "#9c9c9c",
    outgoingText: "#ffffff",
  });

  const [subdomain, setSubdomain] = useState("");
  const [domain, setDomain] = useState("");

  const handleColorChange = (key: keyof typeof colors, value: string) => {
    setColors(prev => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
        <BadgeCheck className="w-8 h-8 text-black dark:text-white" />
        <div className="space-y-1">
          <CardTitle className="text-lg">White Label</CardTitle>
          <CardDescription>Change color, logo and favicon of your Workspace</CardDescription>
        </div>
      </CardHeader>
      <Separator className="bg-gray-200 dark:bg-slate-800" />
      
      <CardContent className="pt-6">
        <div className="max-w-4xl mx-0 space-y-6">
          <Tabs defaultValue="logo" className="w-full">
            <TabsList className="grid grid-cols-5 bg-gray-100 dark:bg-slate-800 rounded-t-lg h-auto">
              <TabsTrigger value="logo">Logo</TabsTrigger>
              <TabsTrigger value="favicon">Favicon</TabsTrigger>
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="custom-domain">Custom Domain</TabsTrigger>
              <TabsTrigger value="notification-email">Notification E-mail</TabsTrigger>
            </TabsList>

            <TabsContent value="logo" className="mt-0">
              <div className="bg-white dark:bg-slate-900 border border-t-0 border-gray-200 dark:border-slate-800 rounded-b-lg p-6 space-y-8">
                
                {/* Light Logo Section */}
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-gray-500" />
                    <Label className="text-sm font-medium text-gray-900 dark:text-white">Light Logo</Label>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-lg p-2 flex items-center justify-center bg-white dark:bg-slate-900 w-full max-w-[460px] h-[140px]">
                    <img 
                      src="/white-label/ezconn-logo.png" 
                      alt="Light Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-xs text-red-500">Recommended size: 460px * 140px</p>
                </div>

                {/* Dark Logo Section */}
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-gray-500" />
                    <Label className="text-sm font-medium text-gray-900 dark:text-white">Dark Logo</Label>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-800 dark:border-slate-600 rounded-lg p-0 flex items-center justify-center bg-[#1e293b] w-full max-w-[460px] h-[140px] overflow-hidden isolate">
                    <img 
                      src="/white-label/ezconn-logo.png" 
                      alt="Dark Logo" 
                      className="w-full h-full object-contain invert hue-rotate-180 mix-blend-screen"
                    />
                  </div>
                  <p className="text-xs text-red-500">Recommended size: 460px * 140px</p>
                </div>

              </div>
            </TabsContent>

            <TabsContent value="favicon" className="mt-0">
              <div className="bg-white dark:bg-slate-900 border border-t-0 border-gray-200 dark:border-slate-800 rounded-b-lg p-6 space-y-6">
                <div className="flex items-start gap-3 text-left">
                  <Info className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                    Upload the favicon that will be displayed at the browsers tab.
                  </p>
                </div>

                <div className="space-y-3 text-left">
                  <div className="border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-lg p-6 flex items-center justify-center bg-white dark:bg-slate-900 w-32 h-32 overflow-hidden">
                    <img
                      src="/white-label/favicon.png"
                      alt="Favicon Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-xs text-red-500">Recommended size: 64px * 64px</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="colors" className="mt-0">
              <div className="bg-white dark:bg-slate-900 border border-t-0 border-gray-200 dark:border-slate-800 rounded-b-lg p-6 space-y-6">
                <div className="flex items-start gap-3 text-left mb-6">
                  <Info className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                    Select the color that will be set to your account and Workspaces.
                  </p>
                </div>

                <div className="space-y-6">
                  <ColorPicker 
                    label="Main theme color for buttons, active menu options and tabs"
                    value={colors.mainTheme}
                    onChange={(val) => handleColorChange('mainTheme', val)}
                  />
                  
                  <ColorPicker 
                    label="Main color for clickable links"
                    value={colors.links}
                    onChange={(val) => handleColorChange('links', val)}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <ColorPicker 
                      label="Incoming message chat bubbles color"
                      value={colors.incomingBubble}
                      onChange={(val) => handleColorChange('incomingBubble', val)}
                    />
                    <ColorPicker 
                      label="Incoming message chat bubbles text color"
                      value={colors.incomingText}
                      onChange={(val) => handleColorChange('incomingText', val)}
                    />
                    <ColorPicker 
                      label="Outgoing message chat bubbles color"
                      value={colors.outgoingBubble}
                      onChange={(val) => handleColorChange('outgoingBubble', val)}
                    />
                    <ColorPicker 
                      label="Outgoing message chat bubbles text color"
                      value={colors.outgoingText}
                      onChange={(val) => handleColorChange('outgoingText', val)}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button className="px-8 btn-outline-primary" variant="outline">
                    Save
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="custom-domain" className="mt-0">
              <div className="bg-white dark:bg-slate-900 border border-t-0 border-gray-200 dark:border-slate-800 rounded-b-lg p-6 space-y-6">
                
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center">
                    <div className="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-l-lg px-3 py-2 text-sm text-gray-500 dark:text-gray-400 border-r-0 h-10 flex items-center">
                      https://
                    </div>
                    <Input 
                      placeholder="app"
                      value={subdomain}
                      onChange={(e) => setSubdomain(e.target.value)}
                      className="rounded-l-none border-gray-200 dark:border-slate-700 w-32 focus-visible:ring-0 focus-visible:ring-offset-0 h-10 bg-white dark:bg-slate-950 text-gray-900 dark:text-white"
                    />
                  </div>

                  <span className="text-gray-900 dark:text-white font-bold text-xl mb-1">.</span>

                  <Input 
                    placeholder="example.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="border-gray-200 dark:border-slate-700 w-64 focus-visible:ring-0 focus-visible:ring-offset-0 h-10 bg-white dark:bg-slate-950 text-gray-900 dark:text-white"
                  />

                  <Button variant="secondary" className="bg-[#f1f3f5] dark:bg-slate-800 hover:bg-[#e9ecef] dark:hover:bg-slate-700 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700 h-10 px-6 font-medium">
                    Connect
                  </Button>
                </div>

                <div className="space-y-4 text-left">
                  <p className="font-bold text-gray-900 dark:text-white">
                    Make your Workspace shine with your own custom domain!
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    This section lets you ditch the our branding and use your Workspace domain name. This adds a professional touch and builds trust with agents.
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    <span className="font-bold">Important Note:</span> This custom domain applies to this specific Workspace only.
                  </p>
                </div>

              </div>
            </TabsContent>
            <TabsContent value="notification-email" className="mt-0">
              <div className="bg-white dark:bg-slate-900 border border-t-0 border-gray-200 dark:border-slate-800 rounded-b-lg p-16 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#3b82f6] flex items-center justify-center shadow-md">
                  <Mail className="w-12 h-12 text-white" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Notification E-mail</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-sm text-sm">
                    Integrate your e-mail to send branded agent invitation and forgot password emails.
                  </p>
                </div>

                <Button className="px-6 h-10 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors" variant="outline">
                  Connect now
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </>
  );
}
