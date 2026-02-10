import React, { useState } from "react";
import { BadgeCheck, Info, ChevronsUpDown, Mail } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";


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

  const { toast } = useToast();

  const handleColorChange = (key: keyof typeof colors, value: string) => {
    setColors(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveColors = () => {
    console.log("Saving color settings:", colors);
    toast({
      title: "Success",
      description: "Color settings saved successfully!",
    });
    // TODO: Replace with actual API call
    // Example:
    // await fetch('/api/workspace/white-label/colors', {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(colors)
    // });
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
                  <Button 
                    className="px-8 btn-outline-primary" 
                    variant="outline"
                    onClick={handleSaveColors}
                  >
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
              <div className="bg-white dark:bg-slate-900 border border-t-0 border-gray-200 dark:border-slate-800 rounded-b-lg p-16">
                
                {/* Empty State - No email configured */}
                {!notificationEmail && (
                  <div className="flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#3b82f6] flex items-center justify-center shadow-md">
                      <Mail className="w-12 h-12 text-white" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Notification E-mail</h3>
                      <p className="text-gray-500 dark:text-gray-400 max-w-sm text-sm">
                        Integrate your e-mail to send branded agent invitation and forgot password emails.
                      </p>
                    </div>

                    <Button 
                      className="px-6 h-10 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors" 
                      variant="outline"
                      onClick={handleConnectEmail}
                    >
                      Connect now
                    </Button>
                  </div>
                )}

                {/* Verified State */}
                {notificationEmail && notificationEmail.status === "VERIFIED" && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <p className="text-sm text-blue-900 dark:text-blue-200">
                        Your email domain has been verified and is ready to send branded emails.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-900 dark:text-white">Verified Email</Label>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-900 dark:text-white">{notificationEmail.email}</span>
                        <span className="text-xs text-white bg-green-700 rounded-full px-3 py-1">Verified</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => setShowDeleteConfirm(true)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Unverified State - Show Form */}
                {notificationEmail && notificationEmail.status === "UNVERIFIED" && (
                  <div className="space-y-6 max-w-2xl">
                    {emailError && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <p className="text-sm text-red-900 dark:text-red-200">{emailError}</p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                        Enter your domain
                        <Info className="w-4 h-4 text-gray-400" />
                      </Label>
                      <div className="flex items-center gap-3">
                        <Input
                          type="text"
                          placeholder="info"
                          value={notificationEmail.prefix}
                          onChange={(e) => setNotificationEmail({ ...notificationEmail, prefix: e.target.value })}
                          disabled={!!notificationEmail.id}
                          className="w-32 bg-white dark:bg-slate-950 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white disabled:opacity-50"
                        />
                        <span className="font-bold text-gray-900 dark:text-white">@</span>
                        <Input
                          type="text"
                          placeholder="your-domain.com"
                          value={notificationEmail.domain}
                          onChange={(e) => setNotificationEmail({ ...notificationEmail, domain: e.target.value })}
                          disabled={!!notificationEmail.id}
                          className="flex-1 bg-white dark:bg-slate-950 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white disabled:opacity-50"
                        />
                        {notificationEmail.id ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => setShowDeleteConfirm(true)}
                          >
                            Delete
                          </Button>
                        ) : (
                          <Button
                            className="bg-blue-600 text-white hover:bg-blue-700"
                            onClick={handleSubmitNotificationEmail}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Submitting..." : "Submit domain"}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* DNS Configuration Instructions */}
                    {notificationEmail.id && notificationEmail.request_id && (
                      <div className="space-y-6 mt-8">
                        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
                          <li>Log in to your domain provider's DNS management console.</li>
                          <li>Add the following CNAME records to your DNS configuration:</li>
                        </ol>

                        <div className="overflow-x-auto">
                          <table className="w-full border border-gray-200 dark:border-slate-700 rounded-lg">
                            <thead className="bg-gray-50 dark:bg-slate-800">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Type</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Hostname</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Value</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                              {notificationEmail.rpath_value && (
                                <tr className="bg-white dark:bg-slate-900">
                                  <td className="px-4 py-3">
                                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">CNAME</span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-900 dark:text-white">{notificationEmail.rpath_selector}</span>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="text-xs h-6"
                                          onClick={() => copyToClipboard(notificationEmail.rpath_selector || "")}
                                        >
                                          Copy
                                        </Button>
                                      </div>
                                      <p className="text-xs text-gray-400">
                                        Full: {notificationEmail.rpath_selector}.{notificationEmail.domain}
                                      </p>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm text-gray-900 dark:text-white">{notificationEmail.rpath_value}</span>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs h-6"
                                        onClick={() => copyToClipboard(notificationEmail.rpath_value || "")}
                                      >
                                        Copy
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              )}
                              
                              {notificationEmail.dkim_value && (
                                <tr className="bg-white dark:bg-slate-900">
                                  <td className="px-4 py-3">
                                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">CNAME</span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-900 dark:text-white">{notificationEmail.dkim_selector}._domainkey</span>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="text-xs h-6"
                                          onClick={() => copyToClipboard(`${notificationEmail.dkim_selector}._domainkey`)}
                                        >
                                          Copy
                                        </Button>
                                      </div>
                                      <p className="text-xs text-gray-400">
                                        Full: {notificationEmail.dkim_selector}._domainkey.{notificationEmail.domain}
                                      </p>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm text-gray-900 dark:text-white">{notificationEmail.dkim_value}</span>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs h-6"
                                        onClick={() => copyToClipboard(notificationEmail.dkim_value || "")}
                                      >
                                        Copy
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              )}

                              {notificationEmail.cname_selector && (
                                <tr className="bg-white dark:bg-slate-900">
                                  <td className="px-4 py-3">
                                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">CNAME</span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-900 dark:text-white">{notificationEmail.cname_selector}</span>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="text-xs h-6"
                                          onClick={() => copyToClipboard(notificationEmail.cname_selector || "")}
                                        >
                                          Copy
                                        </Button>
                                      </div>
                                      <p className="text-xs text-gray-400">
                                        Full: {notificationEmail.cname_selector}.{notificationEmail.domain}
                                      </p>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm text-gray-900 dark:text-white">{notificationEmail.cname_value}</span>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs h-6"
                                        onClick={() => copyToClipboard(notificationEmail.cname_value || "")}
                                      >
                                        Copy
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>

                        <div className="flex justify-end">
                          <Button
                            className="bg-blue-600 text-white hover:bg-blue-700"
                            onClick={handleVerifyEmail}
                            disabled={isVerifying}
                          >
                            {isVerifying ? "Verifying..." : "Verify"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="bg-white dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Delete Notification Email</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Are you sure you want to delete this notification email configuration? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              className="border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300"
            >
              No
            </Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={handleDeleteEmail}
            >
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
