import React, { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter"; // Import useLocation and useSearch
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator"; // Corrected Separator import
import { Avatar, AvatarFallback } from "@/components/ui/avatar"; // Import Avatar components
import { Switch } from "@/components/ui/switch"; // Import Switch component
import { Button } from "@/components/ui/button"; // Import Button component

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
              </CardHeader>
              <CardContent className="space-y-6">
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
                        disabled={browserNotificationsDenied} // Disabled if notifications not enabled or browser denied
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
          {/* Placeholder for other sections */}
          {activeSection !== "My Profile" && (
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
