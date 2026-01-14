import React, { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  Settings,
  Clock,
  Bot,
  MessageCircle,
  CalendarX,
  UserCog,
  MessageSquare,
  Tag,
  ShieldCheck,
  Code,
  Lock
} from "lucide-react";
import ProfileSection from "@/components/sections/ProfileSection";
import PreferencesSection from "@/components/sections/PreferencesSection";
import BusinessHoursSection from "@/components/sections/BusinessHoursSection";
import AIAssistantsSection from "@/components/sections/AIAssistantsSection";
import AgentChatsSection from "@/components/sections/AgentChatsSection";
import OutOfOfficeSection from "@/components/sections/OutOfOfficeSection";
import BotToAgentSection from "@/components/sections/BotToAgentSection";
import PasswordPolicySection from "@/components/sections/PasswordPolicySection";
import DeveloperSettingsSection from "@/components/sections/DeveloperSettingsSection";
import ChangePasswordSection from "@/components/sections/ChangePasswordSection";
import QuickRepliesSection from "@/components/sections/QuickRepliesSection";
import TagsSection from "@/components/sections/TagsSection";

export default function SettingsPage() {
  const sections = [
    { name: "My Profile", icon: User },
    { name: "Preferences", icon: Settings },
    { name: "Business Hours", icon: Clock },
    { name: "AI Assistants", icon: Bot },
    { name: "Agent Chats", icon: MessageCircle },
    { name: "Out of Office", icon: CalendarX },
    { name: "Bot to Agent", icon: UserCog },
    { name: "Quick Replies", icon: MessageSquare },
    { name: "Tags", icon: Tag },
    { name: "Password Policy", icon: ShieldCheck },
    { name: "Developer Settings", icon: Code },
    { name: "Change Password", icon: Lock },
  ];

  // Calculate initial activeSection directly from URL
  const initialTabParam = new URLSearchParams(window.location.search).get("tab");
  const initialActiveSection = (initialTabParam && sections.some(s => s.name === initialTabParam)) ? initialTabParam : "My Profile";

  const [activeSection, setActiveSection] = useState(initialActiveSection);
  const [profilePictureUrl, setProfilePictureUrl] = useState(""); // Default profile picture
  const [notificationsEnabled, setNotificationsEnabled] = useState(false); // User preference for notifications, off by default
  const [browserNotificationsDenied, setBrowserNotificationsDenied] = useState(Notification.permission === 'denied'); // Initialize based on actual browser permission
  const [allDaysSelected, setAllDaysSelected] = useState(true); // State for "All days" vs "Per day" radio
  const [businessHours, setBusinessHours] = useState({
    allDayAvailability: false, // Added this line
    allDays: { enabled: true, startHour: '09', startMinute: '00', startPeriod: 'AM', endHour: '05', endMinute: '00', endPeriod: 'PM' },
    perDay: {
      monday: { enabled: true, startHour: '09', startMinute: '00', startPeriod: 'AM', endHour: '05', endMinute: '00', endPeriod: 'PM' },
      tuesday: { enabled: true, startHour: '09', startMinute: '00', startPeriod: 'AM', endHour: '05', endMinute: '00', endPeriod: 'PM' },
      wednesday: { enabled: true, startHour: '09', startMinute: '00', startPeriod: 'AM', endHour: '05', endMinute: '00', endPeriod: 'PM' },
      thursday: { enabled: true, startHour: '09', startMinute: '00', startPeriod: 'AM', endHour: '05', endMinute: '00', endPeriod: 'PM' },
      friday: { enabled: true, startHour: '09', startMinute: '00', startPeriod: 'AM', endHour: '05', endMinute: '00', endPeriod: 'PM' },
      saturday: { enabled: false, startHour: '09', startMinute: '00', startPeriod: 'AM', endHour: '05', endMinute: '00', endPeriod: 'PM' },
      sunday: { enabled: false, startHour: '09', startMinute: '00', startPeriod: 'AM', endHour: '05', endMinute: '00', endPeriod: 'PM' },
    }
  });
  const [preferences, setPreferences] = useState({
    timezone: "(GMT+05:00) Islamabad, Karachi, Tashkent",
    twoFactorAuth: false,
    autoHide: false,
    disableCSAT: false,
    manualHandoff: false,
    enableTranscript: false,
    emailTranscript: false,
    transcriptEmails: "",
  });
  const [, navigate] = useLocation(); // Get navigate function from wouter
  const search = useSearch(); // Get the query string from wouter

  useEffect(() => {
    const params = new URLSearchParams(search);
    const tabParam = params.get("tab");

    if (tabParam && sections.some(s => s.name === tabParam)) {
      setActiveSection(tabParam);
    }
  }, [search]); // Depend on search and sections

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
        <Card className="h-full w-64 bg-white dark:bg-background border-0 rounded-md shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] flex-shrink-0">
          <CardContent className="p-1 flex flex-col">
            {sections.map((section, index) => (
              <React.Fragment key={section.name}>
                <button
                  onClick={() => {
                    navigate(`/settings?tab=${section.name}`);
                  }}
                  className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === section.name
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground dark:text-gray-300 dark:hover:bg-slate-700 dark:hover:text-white"
                    }`}
                >
                  <section.icon size={16} className="mr-2" />
                  {section.name}
                </button>
                {index < sections.length - 1 && (
                  <div className="mx-1 my-1 h-px bg-slate-200 dark:bg-slate-800" />
                )}
              </React.Fragment>
            ))}
          </CardContent>
        </Card>

        {/* Right Content Area */}
        <Card className="h-fit flex-1 shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          {activeSection === "My Profile" && (
            <ProfileSection
              profilePictureUrl={profilePictureUrl}
              setProfilePictureUrl={setProfilePictureUrl}
              notificationsEnabled={notificationsEnabled}
              setNotificationsEnabled={setNotificationsEnabled}
              browserNotificationsDenied={browserNotificationsDenied}
              handleTestNotification={handleTestNotification}
            />
          )}

          {activeSection === "Preferences" && (
            <PreferencesSection
              preferences={preferences}
              setPreferences={setPreferences}
            />
          )}

          {activeSection === "Business Hours" && (
            <BusinessHoursSection
              allDaysSelected={allDaysSelected}
              setAllDaysSelected={setAllDaysSelected}
              businessHours={businessHours}
              setBusinessHours={setBusinessHours}
              allDayAvailability={businessHours.allDayAvailability}
              setAllDayAvailability={(value: boolean) => setBusinessHours(prev => ({ ...prev, allDayAvailability: value }))}
            />
          )}
          {activeSection === "AI Assistants" && (
            <AIAssistantsSection />
          )}
          {activeSection === "Agent Chats" && (
            <AgentChatsSection />
          )}
          {activeSection === "Out of Office" && (
            <OutOfOfficeSection />
          )}
          {activeSection === "Bot to Agent" && (
            <BotToAgentSection />
          )}
          {activeSection === "Quick Replies" && (
            <QuickRepliesSection />
          )}
          {activeSection === "Tags" && (
            <TagsSection />
          )}
          {activeSection === "Password Policy" && (
            <PasswordPolicySection />
          )}
          {activeSection === "Developer Settings" && (
            <DeveloperSettingsSection />
          )}
          {activeSection === "Change Password" && (
            <ChangePasswordSection />
          )}
        </Card>
      </div>
    </div>
  );
}
