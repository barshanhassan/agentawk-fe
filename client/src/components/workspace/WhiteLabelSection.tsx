import React, { useState } from "react";
import { BadgeCheck, Info, ChevronsUpDown, Mail, Copy } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Upload, Image as ImageIcon, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";


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
  const { toast } = useToast();

  const { data: brandingData, isLoading } = useQuery<any>({
    queryKey: ["/api/workspaces/branding"],
  });

  const updateBrandingMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("PATCH", "/api/workspaces/branding", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces/branding"] });
      toast({
        title: "Success",
        description: "Color settings saved successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save colors",
        variant: "destructive",
      });
    }
  });

  const [colors, setColors] = useState({
    mainTheme: "#0a7a22",
    links: "#5742f5",
    incomingBubble: "#705800",
    incomingText: "#ffffff",
    outgoingBubble: "#9c9c9c",
    outgoingText: "#ffffff",
  });

  React.useEffect(() => {
    if (brandingData) {
      setColors({
        mainTheme: brandingData.color || "#0a7a22",
        links: brandingData.link_color || "#5742f5",
        incomingBubble: brandingData.incoming_chat_color || "#705800",
        incomingText: brandingData.incoming_chat_text_color || "#ffffff",
        outgoingBubble: brandingData.outgoing_chat_color || "#9c9c9c",
        outgoingText: brandingData.outgoing_chat_text_color || "#ffffff",
      });
    }
  }, [brandingData]);

  const [subdomain, setSubdomain] = useState("");
  const [domain, setDomain] = useState("");

  const handleColorChange = (key: keyof typeof colors, value: string) => {
    setColors(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveColors = () => {
    updateBrandingMutation.mutate(colors);
  };

  // Notification Email state and handlers
  const [notificationEmail, setNotificationEmail] = useState<{
    id: string | null;
    prefix: string;
    domain: string;
    email: string | null;
    status: "VERIFIED" | "UNVERIFIED" | null;
    rpath_selector?: string;
    rpath_value?: string;
    dkim_selector?: string;
    dkim_value?: string;
    cname_selector?: string;
    cname_value?: string;
    request_id?: string;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleConnectEmail = () => {
    setNotificationEmail({
      id: null,
      prefix: "",
      domain: "",
      email: null,
      status: "UNVERIFIED",
    });
    setEmailError(null);
  };

  const handleSubmitNotificationEmail = async () => {
    if (!notificationEmail) return;

    // Validation
    if (!notificationEmail.prefix) {
      setEmailError("Prefix is required");
      return;
    }
    if (!notificationEmail.domain) {
      setEmailError("Domain is required");
      return;
    }

    const domainPattern = /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/;
    if (!domainPattern.test(notificationEmail.domain)) {
      setEmailError("Invalid domain format");
      return;
    }

    setEmailError(null);
    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/notification-email', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     prefix: notificationEmail.prefix,
      //     domain: notificationEmail.domain
      //   })
      // });
      // const data = await response.json();

      // Mock response for demonstration
      setTimeout(() => {
        setNotificationEmail({
          ...notificationEmail,
          id: "mock-id-123",
          email: `${notificationEmail.prefix}@${notificationEmail.domain}`,
          status: "UNVERIFIED",
          request_id: "req-123",
          rpath_selector: "em1234",
          rpath_value: "u1234567.wl089.sendgrid.net",
          dkim_selector: "s1",
          dkim_value: "s1.domainkey.u1234567.wl089.sendgrid.net",
          cname_selector: "1234567",
          cname_value: "sendgrid.net",
        });
        setIsSubmitting(false);
        console.log("Email domain submitted successfully");
      }, 1000);
    } catch (error) {
      setEmailError("Failed to submit domain. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!notificationEmail?.id) return;

    setIsVerifying(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/notification-email/verify/${notificationEmail.id}`);
      // const data = await response.json();

      // Mock verification
      setTimeout(() => {
        const verified = Math.random() > 0.5; // Random for demo
        setNotificationEmail({
          ...notificationEmail,
          status: verified ? "VERIFIED" : "UNVERIFIED",
        });
        setIsVerifying(false);

        if (verified) {
          toast({
            title: "Success",
            description: "Email domain verified successfully!",
          });
        } else {
          toast({
            title: "Verification Failed",
            description: "Please check your DNS records and try again.",
            variant: "destructive",
          });
        }
      }, 1500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify domain. Please try again.",
        variant: "destructive",
      });
      setIsVerifying(false);
    }
  };

  const handleDeleteEmail = async () => {
    if (!notificationEmail?.id) return;

    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/notification-email/${notificationEmail.id}`, { method: 'DELETE' });

      setNotificationEmail(null);
      setShowDeleteConfirm(false);
      toast({
        title: "Success",
        description: "Notification email deleted successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete notification email. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  const handleLogoAction = (action: "upload" | "gallery" | "remove", type: "light" | "dark") => {
    if (action === "upload") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
          toast({
            title: "Uploading...",
            description: `Uploading ${type} logo: ${file.name}`,
          });
          // TODO: Implement actual upload logic
        }
      };
      input.click();
    } else if (action === "gallery") {
      toast({
        title: "Media Gallery",
        description: "Opening media gallery...",
      });
    } else if (action === "remove") {
      toast({
        title: "Logo Removed",
        description: `${type === "light" ? "Light" : "Dark"} mode logo has been removed.`,
      });
      // TODO: Call API to remove logo
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading White Label settings...</div>;
  }

  return (
    <>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4 px-8 pt-8">
        <div className="p-3 bg-primary/10 rounded-xl">
          <BadgeCheck className="w-8 h-8 text-primary" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold tracking-tight">White Label</CardTitle>
          <CardDescription className="text-base text-gray-500 dark:text-gray-400">Change color, logo and favicon of your Workspace</CardDescription>
        </div>
      </CardHeader>

      <Separator className="mx-8 bg-gray-100 dark:bg-slate-800" />

      <CardContent className="p-8 pt-6">
        <Tabs defaultValue="logo" className="w-full">
          <TabsList className="flex w-full h-12 bg-gray-100/80 dark:bg-slate-800/60 p-1.5 rounded-xl mb-8">
            <TabsTrigger value="logo" className="flex-1 text-sm font-semibold rounded-lg transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700">Logo</TabsTrigger>
            <TabsTrigger value="favicon" className="flex-1 text-sm font-semibold rounded-lg transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700">Favicon</TabsTrigger>
            <TabsTrigger value="colors" className="flex-1 text-sm font-semibold rounded-lg transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700">Colors</TabsTrigger>
            <TabsTrigger value="custom-domain" className="flex-1 text-sm font-semibold rounded-lg transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700">Custom Domain</TabsTrigger>
            <TabsTrigger value="notification-email" className="flex-1 text-sm font-semibold rounded-lg transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700">Notification E-mail</TabsTrigger>
          </TabsList>

          <TabsContent value="logo" className="mt-0 focus-visible:outline-none">
            <div className="bg-[#ffffff] dark:bg-slate-900/40 border border-gray-200 dark:border-slate-800 rounded-3xl p-10 space-y-12 shadow-sm backdrop-blur-sm">

              {/* Light Mode Logo Section */}
              <div className="space-y-5 text-left">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100/50 dark:bg-blue-900/30 p-2 rounded-lg">
                    <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <Label className="text-lg font-bold text-gray-900 dark:text-gray-100">Light Mode Logo</Label>
                </div>

                <div className="max-w-[540px]">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl p-8 flex items-center justify-center bg-[#f8fafc] dark:bg-slate-950/50 h-[180px] transition-all duration-300 hover:border-primary/40 hover:shadow-md cursor-pointer group">
                        <img
                          src="/white-label/ezconn-logo.svg"
                          alt="Light Logo"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      <DropdownMenuItem onClick={() => handleLogoAction("upload", "light")}>
                        <Upload className="mr-2 h-4 w-4" /> Upload
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleLogoAction("gallery", "light")}>
                        <ImageIcon className="mr-2 h-4 w-4" /> Select from gallery
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleLogoAction("remove", "light")} className="text-red-600 focus:text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" /> Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <div className="mt-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
                      Recommended size: 460px * 140px
                    </span>
                  </div>
                </div>
              </div>

              {/* Dark Mode Logo Section */}
              <div className="space-y-5 text-left">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100/50 dark:bg-blue-900/30 p-2 rounded-lg">
                    <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <Label className="text-lg font-bold text-gray-900 dark:text-gray-100">Dark Mode Logo</Label>
                </div>

                <div className="max-w-[540px]">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="border-2 border-dashed border-slate-700 dark:border-slate-600 rounded-2xl p-8 flex items-center justify-center bg-[#020617] h-[180px] transition-all duration-300 hover:border-primary/40 overflow-hidden isolate shadow-xl hover:shadow-2xl cursor-pointer group">
                        <img
                          src="/white-label/ezconn-logo-dark.svg"
                          alt="Dark Logo"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      <DropdownMenuItem onClick={() => handleLogoAction("upload", "dark")}>
                        <Upload className="mr-2 h-4 w-4" /> Upload
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleLogoAction("gallery", "dark")}>
                        <ImageIcon className="mr-2 h-4 w-4" /> Select from gallery
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleLogoAction("remove", "dark")} className="text-red-600 focus:text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" /> Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <div className="mt-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
                      Recommended size: 460px * 140px
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="favicon" className="mt-0 focus-visible:outline-none">
            <div className="bg-white dark:bg-slate-900/40 border border-gray-200 dark:border-slate-800 rounded-3xl p-10 shadow-sm space-y-10 backdrop-blur-sm">
              <div className="flex items-start gap-5 text-left bg-blue-50/60 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/20">
                <div className="bg-blue-500 rounded-full p-1 mt-0.5">
                  <Info className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold leading-relaxed">
                  Upload the favicon that will be displayed at the browser tab. This is a critical element of your visual brand that helps users recognize your platform in a crowded browser.
                </p>
              </div>

              <div className="space-y-6 text-left">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl p-10 flex items-center justify-center bg-[#f8fafc] dark:bg-slate-950/50 w-44 h-44 overflow-hidden transition-all duration-300 hover:border-primary/40 group hover:shadow-lg cursor-pointer">
                      <img
                        src="/white-label/favicon.png"
                        alt="Favicon Preview"
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuItem onClick={() => handleLogoAction("upload", "light")}>
                      <Upload className="mr-2 h-4 w-4" /> Upload
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleLogoAction("gallery", "light")}>
                      <ImageIcon className="mr-2 h-4 w-4" /> Select from gallery
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
                  Recommended size: 64px * 64px
                </span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="colors" className="mt-0">
            <div className="bg-white dark:bg-slate-900/40 border border-gray-200 dark:border-slate-800 rounded-3xl p-10 shadow-sm space-y-10 backdrop-blur-sm">
              <div className="flex items-start gap-5 text-left bg-blue-50/60 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/20">
                <Info className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold leading-relaxed">
                  Customize the color palette for your Workspace. These settings will be applied across your dashboard and client-facing interfaces.
                </p>
              </div>

              <div className="space-y-10">
                <ColorPicker
                  label="Main theme color (Buttons, active menu, selected tabs)"
                  value={colors.mainTheme}
                  onChange={(val) => handleColorChange('mainTheme', val)}
                />

                <ColorPicker
                  label="Link color (Clickable text, anchors)"
                  value={colors.links}
                  onChange={(val) => handleColorChange('links', val)}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  <ColorPicker
                    label="Incoming chat bubbles"
                    value={colors.incomingBubble}
                    onChange={(val) => handleColorChange('incomingBubble', val)}
                  />
                  <ColorPicker
                    label="Incoming bubble text"
                    value={colors.incomingText}
                    onChange={(val) => handleColorChange('incomingText', val)}
                  />
                  <ColorPicker
                    label="Outgoing chat bubbles"
                    value={colors.outgoingBubble}
                    onChange={(val) => handleColorChange('outgoingBubble', val)}
                  />
                  <ColorPicker
                    label="Outgoing bubble text"
                    value={colors.outgoingText}
                    onChange={(val) => handleColorChange('outgoingText', val)}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button
                  className="px-10 h-12 text-sm transition-all btn-outline-primary"
                  variant="outline"
                  onClick={handleSaveColors}
                  disabled={updateBrandingMutation.isPending}
                >
                  {updateBrandingMutation.isPending ? "Applying..." : "Apply Changes"}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="custom-domain" className="mt-0">
            <div className="bg-white dark:bg-slate-900/40 border border-gray-200 dark:border-slate-800 rounded-3xl p-10 shadow-sm space-y-10 backdrop-blur-sm">

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center shadow-sm">
                  <div className="bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-blue-900/20 rounded-l-2xl px-5 py-3 text-sm font-bold text-blue-600 dark:text-blue-400 border-r-0 h-14 flex items-center">
                    https://
                  </div>
                  <Input
                    placeholder="app"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value)}
                    className="rounded-l-none border-gray-200 dark:border-slate-700 w-36 h-14 bg-white dark:bg-slate-950 font-semibold focus-visible:ring-primary/20"
                  />
                </div>

                <span className="text-gray-400 dark:text-slate-600 font-bold text-2xl self-center">.</span>

                <Input
                  placeholder="example.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="border-gray-200 dark:border-slate-700 w-72 h-14 bg-white dark:bg-slate-950 font-semibold shadow-sm focus-visible:ring-primary/20"
                />

                <Button variant="outline" className="h-14 px-10 btn-outline-primary shadow-sm">
                  Connect Domain
                </Button>
              </div>

              <div className="space-y-6 text-left bg-blue-50/60 dark:bg-blue-900/10 p-8 rounded-2xl border border-blue-100 dark:border-blue-900/20">
                <p className="font-bold text-lg text-gray-900 dark:text-gray-100">
                  Make your Workspace shine with your own custom domain!
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-semibold">
                  This section lets you ditch our branding and use your unique Workspace domain name. This adds a professional touch, strengthens your brand authority, and builds trust with your agents and clients.
                </p>
                <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-xl text-amber-700 dark:text-amber-400 text-sm font-bold">
                  <Info className="w-4 h-4" />
                  <span>Important Note: This custom domain applies to this specific Workspace only.</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notification-email" className="mt-0">
            <div className="bg-white dark:bg-slate-900/40 border border-gray-200 dark:border-slate-800 rounded-3xl p-10 shadow-sm backdrop-blur-sm">

              {!notificationEmail && (
                <div className="flex flex-col items-center justify-center text-center space-y-8 py-10 animate-in fade-in zoom-in duration-500">
                  <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center shadow-xl rotate-3">
                    <Mail className="w-14 h-14 text-white -rotate-3" />
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Notification E-mail</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm text-base font-medium mx-auto">
                      Integrate your custom e-mail domain to send white-labeled agent invitations and security notifications.
                    </p>
                  </div>

                  <Button
                    className="px-12 h-12 transition-all btn-outline-primary shadow-lg hover:shadow-primary/20"
                    variant="outline"
                    onClick={handleConnectEmail}
                  >
                    Configure Now
                  </Button>
                </div>
              )}

              {notificationEmail && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {notificationEmail.status === "VERIFIED" ? (
                    <div className="space-y-8">
                      <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 rounded-2xl p-6 flex items-center gap-4">
                        <div className="bg-green-500 rounded-full p-2">
                          <BadgeCheck className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-sm font-bold text-green-800 dark:text-green-300">
                          Your email domain has been successfully verified and is active.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <Label className="text-sm font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest pl-1">Active Notification Email</Label>
                        <div className="bg-gray-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">{notificationEmail.email}</span>
                            <span className="text-xs font-bold text-white bg-green-500 rounded-full px-4 py-1 uppercase tracking-tighter">Verified</span>
                          </div>
                          <Button
                            variant="outline"
                            className="text-red-500 hover:text-white hover:bg-red-500 transition-all font-bold border-red-100 dark:border-red-900/30"
                            onClick={() => setShowDeleteConfirm(true)}
                          >
                            Disconnect
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-10">
                      {emailError && (
                        <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl p-6 flex items-center gap-4 animate-shake">
                          <Info className="w-6 h-6 text-red-500" />
                          <p className="text-sm font-bold text-red-700 dark:text-red-400">{emailError}</p>
                        </div>
                      )}

                      <div className="space-y-6">
                        <Label className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-3">
                          Domain Setup
                          <Info className="w-4 h-4 text-primary" />
                        </Label>
                        <div className="flex items-center gap-4">
                          <Input
                            type="text"
                            placeholder="info"
                            value={notificationEmail.prefix}
                            onChange={(e) => setNotificationEmail({ ...notificationEmail, prefix: e.target.value })}
                            disabled={!!notificationEmail.id}
                            className="w-40 h-14 bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-700 text-lg font-bold shadow-sm"
                          />
                          <span className="font-black text-gray-400 text-2xl">@</span>
                          <Input
                            type="text"
                            placeholder="brand.com"
                            value={notificationEmail.domain}
                            onChange={(e) => setNotificationEmail({ ...notificationEmail, domain: e.target.value })}
                            disabled={!!notificationEmail.id}
                            className="flex-1 h-14 bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-700 text-lg font-bold shadow-sm"
                          />
                          {notificationEmail.id ? (
                            <Button
                              variant="outline"
                              className="h-14 px-8 text-red-500 hover:bg-red-50 transition-all font-bold"
                              onClick={() => setShowDeleteConfirm(true)}
                            >
                              Reset
                            </Button>
                          ) : (
                            <Button
                              className="h-14 px-10 font-bold transition-all btn-outline-primary"
                              variant="outline"
                              onClick={handleSubmitNotificationEmail}
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "Processing..." : "Submit Domain"}
                            </Button>
                          )}
                        </div>
                      </div>

                      {notificationEmail.id && notificationEmail.request_id && (
                        <div className="space-y-8 mt-12 animate-in fade-in zoom-in-95 duration-700">
                          <div className="space-y-4">
                            <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-3">
                              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs">DNS</span>
                              Required DNS Records
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 pl-9 font-medium">
                              Add these CNAME records to your domain's DNS settings to authorize e-mail delivery.
                            </p>
                          </div>

                          <div className="border border-gray-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                            <table className="w-full text-left">
                              <thead className="bg-blue-50/50 dark:bg-slate-800/80">
                                <tr>
                                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest w-24">Type</th>
                                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Hostname</th>
                                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Value</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                                {[
                                  { selector: notificationEmail.rpath_selector, value: notificationEmail.rpath_value, full: `${notificationEmail.rpath_selector}.${notificationEmail.domain}` },
                                  { selector: `${notificationEmail.dkim_selector}._domainkey`, value: notificationEmail.dkim_value, full: `${notificationEmail.dkim_selector}._domainkey.${notificationEmail.domain}` },
                                  { selector: notificationEmail.cname_selector, value: notificationEmail.cname_value, full: `${notificationEmail.cname_selector}.${notificationEmail.domain}` }
                                ].filter(r => r.selector && r.value).map((record, i) => (
                                  <tr key={i} className="bg-white dark:bg-slate-900/40 hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-5">
                                      <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded-md">CNAME</span>
                                    </td>
                                    <td className="px-6 py-5">
                                      <div className="flex flex-col gap-1.5 item-start">
                                        <div className="flex items-center gap-2">
                                          <code className="text-sm font-bold text-blue-700 dark:text-blue-300 bg-blue-50/80 dark:bg-blue-900/30 px-2 py-0.5 rounded">{record.selector}</code>
                                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-primary/10 hover:text-primary" onClick={() => copyToClipboard(record.selector || "")}>
                                            <Copy className="h-3 w-3" />
                                          </Button>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 overflow-hidden text-ellipsis max-w-[200px]">{record.full}</span>
                                      </div>
                                    </td>
                                    <td className="px-6 py-5">
                                      <div className="flex items-center gap-3">
                                        <code className="text-sm font-bold text-blue-700 dark:text-blue-300 bg-blue-50/80 dark:bg-blue-900/30 px-3 py-1 rounded max-w-[280px] truncate">{record.value}</code>
                                        <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-bold border-slate-200 dark:border-slate-700 hover:bg-primary hover:text-white transition-all shadow-sm" onClick={() => copyToClipboard(record.value || "")}>
                                          Copy
                                        </Button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          <div className="flex justify-end mt-4 pt-6 border-t border-gray-100 dark:border-slate-800">
                            <Button
                              className="px-12 h-14 font-extrabold transition-all btn-outline-primary shadow-lg hover:shadow-primary/20"
                              variant="outline"
                              onClick={handleVerifyEmail}
                              disabled={isVerifying}
                            >
                              {isVerifying ? "Verifying Authority..." : "Verify DNS Changes"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="bg-white dark:bg-slate-900 border-none shadow-2xl rounded-3xl p-10 max-w-md">
          <DialogHeader className="space-y-4">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <Mail className="w-8 h-8 text-red-600" />
            </div>
            <DialogTitle className="text-2xl font-black text-gray-900 dark:text-white text-center">Disconnect Email Domain?</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400 text-center text-base font-medium leading-relaxed">
              This will remove your custom email branding. All system notifications will revert to our default sender. This action is irreversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-4 mt-8 sm:justify-center">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              className="h-12 flex-1 rounded-xl border-gray-200 dark:border-slate-800 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-slate-800 order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              className="h-12 flex-1 rounded-xl bg-red-600 text-white hover:bg-red-700 font-black shadow-lg shadow-red-600/20 order-1 sm:order-2"
              onClick={handleDeleteEmail}
            >
              Confirm Disconnect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
