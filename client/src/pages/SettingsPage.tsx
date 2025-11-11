import React, { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter"; // Import useLocation and useSearch
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator"; // Corrected Separator import
import { Avatar, AvatarFallback } from "@/components/ui/avatar"; // Import Avatar components
import { Switch } from "@/components/ui/switch"; // Import Switch component
import { Button } from "@/components/ui/button"; // Import Button component
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // Import Tooltip components
import { Info } from "react-feather"; // Import Info icon
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select components
import { Input } from "@/components/ui/input"; // Import Input component
import { Textarea } from "@/components/ui/textarea"; // Import Textarea component

export default function SettingsPage() {
  const sections = [ // Define sections array first for use in initial state
    "My Profile",
    "Preferences",
    "Business Hours",
    "AI Assistants",
    "Agent Chats",
    "Chat Widget",
    "Out of Office",
    "Bot to Agent",
    "Quick Replies",
    "Tags",
    "Password Policy",
    "Developer Settings",
    "Change Password",
  ];

  // Calculate initial activeSection directly from URL
  const initialTabParam = new URLSearchParams(window.location.search).get("tab");
  const initialActiveSection = (initialTabParam && sections.includes(initialTabParam)) ? initialTabParam : "My Profile";

  const [activeSection, setActiveSection] = useState(initialActiveSection);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false); // User preference for notifications, off by default
  const [browserNotificationsDenied, setBrowserNotificationsDenied] = useState(Notification.permission === 'denied'); // Initialize based on actual browser permission
  const [, navigate] = useLocation(); // Get navigate function from wouter
  const search = useSearch(); // Get the query string from wouter

  useEffect(() => {
    const params = new URLSearchParams(search);
    const tabParam = params.get("tab");

    if (tabParam && sections.includes(tabParam)) {
      setActiveSection(tabParam);
    }
    // No else branch needed here, as initial state is handled,
    // and if tabParam becomes invalid, activeSection will remain
    // at its last valid state or default.
  }, [search, sections]); // Depend on search and sections

  const handleTestNotification = () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      new Notification("Test Notification", {
        body: "This is a test desktop notification from your app!",
        icon: "/favicon.ico", // You might want to use a proper icon path
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("Test Notification", {
            body: "This is a test desktop notification from your app!",
            icon: "/favicon.ico",
          });
          setBrowserNotificationsDenied(false); // Update state if permission is granted
        } else if (permission === "denied") {
          setBrowserNotificationsDenied(true); // Update state if permission is denied
        }
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <div className="flex gap-6">
        {/* Left Sidebar Navigation */}
        <Card className="h-full w-64 shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0 flex-shrink-0">
          <CardContent className="bg-slate-200/75 rounded-lg p-1 space-y-1">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => {
                  navigate(`/settings?tab=${section}`);
                }}
                className={`w-full text-left px-4 py-2 h-10 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === section
                    ? "bg-background text-foreground shadow-[0_-3px_6px_rgba(0,0,0,0.00),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.02)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {section}
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Right Content Area */}
        <Card className="h-fit flex-1 shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          {activeSection === "My Profile" && (
            <>
              <CardHeader>
                <CardTitle className="text-lg">My Profile</CardTitle>
                <p className="text-sm text-muted-foreground">Customize your account profile.</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <Separator />
                {/* Profile Info */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">AD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg font-semibold">Admin User</p>
                    <p className="text-sm text-muted-foreground">email@example.com</p>
                  </div>
                </div>

                <Separator />

                {/* Details */}
                <div className="space-y-3">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-foreground pr-1.5">Role:</p>
                    <p className="text-sm text-muted-foreground">Administrator</p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-foreground pr-1.5">Team:</p>
                    <p className="text-sm text-muted-foreground">No team assigned</p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-foreground pr-1.5">Timezone:</p>
                    <p className="text-sm text-muted-foreground">(GMT+05:00) Islamabad, Karachi, Tashkent</p>
                  </div>
                </div>

                <Separator />

                {/* Notifications */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-base">Notifications</h4>
                  <p className="text-sm text-muted-foreground">Show desktop notifications for incoming conversations. You will need to configure your browser settings to allow notifications from us.</p>
                  {browserNotificationsDenied && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm">
                      You have actively denied notifications. Please update your browser notification settings.
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">Enable Desktop Notifications</p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={!notificationsEnabled || browserNotificationsDenied} // Disabled if notifications not enabled or browser denied
                        onClick={handleTestNotification} // Attach handler
                        className="hover-elevate h-7 text-xs [border-color:hsl(var(--input))]"
                      >
                        Test
                      </Button>
                      <Switch
                        aria-label="Enable Desktop Notifications"
                        checked={notificationsEnabled}
                        onCheckedChange={setNotificationsEnabled}
                        disabled={browserNotificationsDenied} // Disable only if browser denied
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={() => console.log("Save My Profile")} className="bg-blue-500 hover:bg-blue-600 text-white font-normal">
                  Save
                </Button>
              </CardFooter>
            </>
          )}

          {activeSection === "Preferences" && (
            <>
              <CardHeader>
                <CardTitle className="text-lg">Preferences</CardTitle>
                <p className="text-sm text-muted-foreground">These settings will be applied to the entire account.</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <Separator />

                {/* Timezone */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-base">Timezone</h4>
                  <Select defaultValue="(GMT+05:00) Islamabad, Karachi, Tashkent">
                    <SelectTrigger className="max-w-[400px]">
                      <SelectValue placeholder="Select a timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="(GMT-12:00) International Date Line West">
                        (GMT-12:00) International Date Line West
                      </SelectItem>
                      <SelectItem value="(GMT-11:00) Coordinated Universal Time-11">
                        (GMT-11:00) Coordinated Universal Time-11
                      </SelectItem>
                      <SelectItem value="(GMT-10:00) Hawaii">
                        (GMT-10:00) Hawaii
                      </SelectItem>
                      <SelectItem value="(GMT-09:00) Alaska">
                        (GMT-09:00) Alaska
                      </SelectItem>
                      <SelectItem value="(GMT-08:00) Pacific Time (US & Canada)">
                        (GMT-08:00) Pacific Time (US & Canada)
                      </SelectItem>
                      <SelectItem value="(GMT-07:00) Mountain Time (US & Canada)">
                        (GMT-07:00) Mountain Time (US & Canada)
                      </SelectItem>
                      <SelectItem value="(GMT-06:00) Central Time (US & Canada)">
                        (GMT-06:00) Central Time (US & Canada)
                      </SelectItem>
                      <SelectItem value="(GMT-05:00) Eastern Time (US & Canada)">
                        (GMT-05:00) Eastern Time (US & Canada)
                      </SelectItem>
                      <SelectItem value="(GMT-04:00) Atlantic Time (Canada)">
                        (GMT-04:00) Atlantic Time (Canada)
                      </SelectItem>
                      <SelectItem value="(GMT-03:30) Newfoundland">
                        (GMT-03:30) Newfoundland
                      </SelectItem>
                      <SelectItem value="(GMT-03:00) Brasilia">
                        (GMT-03:00) Brasilia
                      </SelectItem>
                      <SelectItem value="(GMT-02:00) Mid-Atlantic">
                        (GMT-02:00) Mid-Atlantic
                      </SelectItem>
                      <SelectItem value="(GMT-01:00) Azores">
                        (GMT-01:00) Azores
                      </SelectItem>
                      <SelectItem value="(GMT+00:00) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London">
                        (GMT+00:00) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London
                      </SelectItem>
                      <SelectItem value="(GMT+01:00) Brussels, Copenhagen, Madrid, Paris">
                        (GMT+01:00) Brussels, Copenhagen, Madrid, Paris
                      </SelectItem>
                      <SelectItem value="(GMT+02:00) Amman">
                        (GMT+02:00) Amman
                      </SelectItem>
                      <SelectItem value="(GMT+02:00) Athens, Bucharest, Istanbul">
                        (GMT+02:00) Athens, Bucharest, Istanbul
                      </SelectItem>
                      <SelectItem value="(GMT+02:00) Beirut">
                        (GMT+02:00) Beirut
                      </SelectItem>
                      <SelectItem value="(GMT+02:00) Cairo">
                        (GMT+02:00) Cairo
                      </SelectItem>
                      <SelectItem value="(GMT+02:00) Harare, Pretoria">
                        (GMT+02:00) Harare, Pretoria
                      </SelectItem>
                      <SelectItem value="(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius">
                        (GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius
                      </SelectItem>
                      <SelectItem value="(GMT+02:00) Jerusalem">
                        (GMT+02:00) Jerusalem
                      </SelectItem>
                      <SelectItem value="(GMT+02:00) Windhoek">
                        (GMT+02:00) Windhoek
                      </SelectItem>
                      <SelectItem value="(GMT+03:00) Kuwait, Riyadh">
                        (GMT+03:00) Kuwait, Riyadh
                      </SelectItem>
                      <SelectItem value="(GMT+03:00) Baghdad">
                        (GMT+03:00) Baghdad
                      </SelectItem>
                      <SelectItem value="(GMT+03:00) Moscow, St. Petersburg, Volgograd">
                        (GMT+03:00) Moscow, St. Petersburg, Volgograd
                      </SelectItem>
                      <SelectItem value="(GMT+03:00) Nairobi">
                        (GMT+03:00) Nairobi
                      </SelectItem>
                      <SelectItem value="(GMT+03:30) Tehran">
                        (GMT+03:30) Tehran
                      </SelectItem>
                      <SelectItem value="(GMT+04:00) Abu Dhabi, Muscat">
                        (GMT+04:00) Abu Dhabi, Muscat
                      </SelectItem>
                      <SelectItem value="(GMT+04:00) Baku">
                        (GMT+04:00) Baku
                      </SelectItem>
                      <SelectItem value="(GMT+04:00) Tbilisi">
                        (GMT+04:00) Tbilisi
                      </SelectItem>
                      <SelectItem value="(GMT+04:00) Yerevan">
                        (GMT+04:00) Yerevan
                      </SelectItem>
                      <SelectItem value="(GMT+04:30) Kabul">
                        (GMT+04:30) Kabul
                      </SelectItem>
                      <SelectItem value="(GMT+05:00) Islamabad, Karachi, Tashkent">
                        (GMT+05:00) Islamabad, Karachi, Tashkent
                      </SelectItem>
                      <SelectItem value="(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi">
                        (GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi
                      </SelectItem>
                      <SelectItem value="(GMT+05:45) Kathmandu">
                        (GMT+05:45) Kathmandu
                      </SelectItem>
                      <SelectItem value="(GMT+06:00) Astana, Dhaka">
                        (GMT+06:00) Astana, Dhaka
                      </SelectItem>
                      <SelectItem value="(GMT+06:30) Yangon (Rangoon)">
                        (GMT+06:30) Yangon (Rangoon)
                      </SelectItem>
                      <SelectItem value="(GMT+07:00) Bangkok, Hanoi, Jakarta">
                        (GMT+07:00) Bangkok, Hanoi, Jakarta
                      </SelectItem>
                      <SelectItem value="(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi">
                        (GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi
                      </SelectItem>
                      <SelectItem value="(GMT+08:00) Perth">
                        (GMT+08:00) Perth
                      </SelectItem>
                      <SelectItem value="(GMT+08:00) Taipei">
                        (GMT+08:00) Taipei
                      </SelectItem>
                      <SelectItem value="(GMT+09:00) Osaka, Sapporo, Tokyo">
                        (GMT+09:00) Osaka, Sapporo, Tokyo
                      </SelectItem>
                      <SelectItem value="(GMT+09:00) Seoul">
                        (GMT+09:00) Seoul
                      </SelectItem>
                      <SelectItem value="(GMT+09:30) Adelaide">
                        (GMT+09:30) Adelaide
                      </SelectItem>
                      <SelectItem value="(GMT+09:30) Darwin">
                        (GMT+09:30) Darwin
                      </SelectItem>
                      <SelectItem value="(GMT+10:00) Brisbane">
                        (GMT+10:00) Brisbane
                      </SelectItem>
                      <SelectItem value="(GMT+10:00) Canberra, Melbourne, Sydney">
                        (GMT+10:00) Canberra, Melbourne, Sydney
                      </SelectItem>
                      <SelectItem value="(GMT+10:00) Guam, Port Moresby">
                        (GMT+10:00) Guam, Port Moresby
                      </SelectItem>
                      <SelectItem value="(GMT+10:00) Hobart">
                        (GMT+10:00) Hobart
                      </SelectItem>
                      <SelectItem value="(GMT+11:00) Magadan, Solomon Is., New Caledonia">
                        (GMT+11:00) Magadan, Solomon Is., New Caledonia
                      </SelectItem>
                      <SelectItem value="(GMT+12:00) Auckland, Wellington">
                        (GMT+12:00) Auckland, Wellington
                      </SelectItem>
                      <SelectItem value="(GMT+12:00) Fiji, Kamchatka, Marshall Is.">
                        (GMT+12:00) Fiji, Kamchatka, Marshall Is.
                      </SelectItem>
                      <SelectItem value="(GMT+13:00) Nuku'alofa">
                        (GMT+13:00) Nuku'alofa
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Login Security */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-base">Login Security</h4>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info size={16} className="text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Two-factor authentication is an extra layer of security for your user accounts. Instead of only entering a password to log in, they will also be required to enter a code. After you enable this feature, your users will receive a one-time code on their registered mobile phone number and/or registered email address to log in to their account.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Enable two-factor authentication for your user login. For certain countries, two-factor authentication via SMS is not available. <br /> Email can be selected as a backup option to receive the login code.</p>
                    <Switch aria-label="Enable two-factor authentication" />
                  </div>
                </div>

                <Separator />

                {/* Auto-hide Conversations */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-base">Auto-hide Conversations</h4>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Enable auto-hide for conversation marked closed by your agents.</p>
                    <Switch aria-label="Enable auto-hide conversations" />
                  </div>
                </div>

                <Separator />

                {/* Disable CSAT */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-base">Disable CSAT</h4>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Disable customer feedback templates for pending chats.</p>
                    <Switch aria-label="Disable CSAT" />
                  </div>
                </div>

                <Separator />

                {/* Manual Bot to Human Handoff */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-base">Manual Bot to Human Handoff</h4>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Enable agents and supervisors to manually take over a conversation from a bot.<br /><span className="font-bold">Note:</span> Agents and Supervisors must relogin for the changes to take effect.</p>
                    <Switch aria-label="Enable manual bot to human handoff" />
                  </div>
                </div>

                <Separator />

                {/* Enable Conversation Transcript */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-base">Enable Conversation Transcript</h4>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Conversation transcript is a record of a chat between a customer and an agent.</p>
                    <Switch aria-label="Enable conversation transcript" />
                  </div>
                </div>

                <Separator />

                {/* Email Conversation Transcripts */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-base">Email Conversation Transcripts</h4>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Automatically allow conversation transcripts to be sent to one or more email addresses when a conversation is closed by your agents. For your security, consider only using this feature with trusted email addresses.</p>
                    <Switch aria-label="Enable email conversation transcripts" />
                  </div>
                </div>

                {/* Enter Email Addresses */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-base">Enter Email Addresses</h4>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info size={16} className="text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Insert comma separated email address</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Textarea placeholder="john@example.com, peter@example.com" rows={4} />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={() => console.log("Save Preferences")} className="bg-blue-500 hover:bg-blue-600 text-white font-normal">
                  Save
                </Button>
              </CardFooter>
            </>
          )}
          {/* Placeholder for other sections */}
          {activeSection !== "My Profile" && activeSection !== "Preferences" && (
            <>
              <CardHeader>
                <CardTitle className="text-lg">{activeSection}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Content for {activeSection} will go here.</p>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
