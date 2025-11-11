import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("My Profile");

  const sections = [
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

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <div className="flex gap-6">
        {/* Left Sidebar Navigation */}
        <Card className="w-64 shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0 flex-shrink-0">
          <CardContent className="space-y-1 p-2">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeSection === section
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
