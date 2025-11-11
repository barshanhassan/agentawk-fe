import React, { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter"; // Import useLocation and useSearch
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <div className="flex gap-6">
        {/* Left Sidebar Navigation */}
        <Card className="w-64 shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0 flex-shrink-0">
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
        <Card className="flex-1 shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardHeader>
            <CardTitle className="text-lg">{activeSection}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Content for {activeSection} will go here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
