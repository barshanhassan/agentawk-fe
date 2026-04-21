import React, { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import {
  LayoutGrid,
  User,
  Settings,
  Clock,
  Bot,
  CalendarX,
  UserCog,
  MessageSquare,
  Tag,
  ShieldCheck,
  Code,
  Lock,
  PaintBucket,
  ChevronDown,
  Film,
  Sliders,
  Book,
  Cpu, // Added Cpu icon for AI Products
  Plug, // Added Plug icon
  Code2,
  Network,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";
import ManageSection from "@/components/workspace/ManageSection";
import LiveChatSection from "@/components/workspace/LiveChatSection";
import ProfileSection from "@/components/sections/ProfileSection";
import ThemeSection from "@/components/sections/ThemeSection";
import PreferencesSection from "@/components/sections/PreferencesSection";
import BusinessHoursSection from "@/components/sections/BusinessHoursSection";
import AIAssistantsSection from "@/components/sections/AIAssistantsSection";
import AIChatAssistantsSection from "@/components/sections/ai/AIChatAssistantsSection";
import AIVoiceAssistantsSection from "@/components/sections/ai/AIVoiceAssistantsSection";
import AIKnowledgeBaseSection from "@/components/sections/ai/AIKnowledgeBaseSection";
import AIReportBuilderSection from "@/components/sections/ai/AIReportBuilderSection";
import AIThemesSection from "@/components/sections/ai/AIThemesSection";
import AIItemsSection from "@/components/sections/ai/AIItemsSection";
import AITopicsSection from "@/components/sections/ai/AITopicsSection";
import AIProductsSection from "@/components/sections/ai/AIProductsSection";
import IntegrationsSection from "@/components/sections/connect/IntegrationsSection";
import APISection from "@/components/sections/connect/APISection";
import VisualAPISection from "@/components/sections/connect/VisualAPISection";

import PasswordPolicySection from "@/components/sections/PasswordPolicySection";
import DeveloperSettingsSection from "@/components/sections/DeveloperSettingsSection";
import ChangePasswordSection from "@/components/sections/ChangePasswordSection";


import WhiteLabelSection from "@/components/workspace/WhiteLabelSection";
import RolesSection from "@/components/workspace/RolesSection";
import TeamsSection from "@/components/workspace/TeamsSection";
import ManageAgentsSection from "@/components/workspace/ManageAgentsSection";
import MediaGallerySection from "@/components/workspace/MediaGallerySection";
import CustomizationSection from "@/components/sections/CustomizationSection";
import CustomFieldsSection from "@/components/sections/CustomFieldsSection";
import ChatWidgetSection from "@/components/sections/ChatWidgetSection";
import IframeSection from "@/components/sections/IframeSection";
import TagsSection from "@/components/sections/TagsSection";
import QuickRepliesSection from "@/components/sections/QuickRepliesSection";

// Channel Sections
import WhatsAppSection from "@/components/sections/channels/WhatsAppSection";
import InstagramSection from "@/components/sections/channels/InstagramSection";
import MessengerSection from "@/components/sections/channels/MessengerSection";
import TelegramSection from "@/components/sections/channels/TelegramSection";
import SmsCallsSection from "@/components/sections/channels/SmsCallsSection";
import WebchatSection from "@/components/sections/channels/WebchatSection";


export default function SettingsPage() {
  const sections = [
    {
      name: "Workspace",
      icon: LayoutGrid,
      children: [
        { name: "Manage", path: "/settings/workspace/ManageSection" },
        { name: "Live Chat", path: "/settings/workspace/live-chat" },
        { name: "White Label", path: "/settings/workspace/white-label" },
        { name: "Manage User", path: "/settings/workspace/manage-agents" },
        { name: "Roles & Permissions", path: "/settings/workspace/roles" },
        { name: "Teams", path: "/settings/workspace/teams" },
      ],
    },
    { name: "Media Gallery", icon: Film },

    // SETTINGS (existing ones)
    {
      name: "Conversation channels",
      icon: MessageSquare,
      children: [
        { name: "WhatsApp", iconPath: "/images/automations/whatsapp.svg" },
        { name: "Instagram", iconPath: "/images/automations/instagram.svg" },
        { name: "Messenger", iconPath: "/images/automations/messenger.svg" },
        { name: "Telegram", iconPath: "/images/automations/telegram.svg" },
        { name: "SMS & Calls", iconPath: "/images/automations/sms.svg" },
        { name: "Webchat", iconPath: "/images/automations/webchat.svg" },
      ],
    },
    {
      name: "ChatGPT",
      icon: Bot,
      children: [
        { name: "AI Chat Assistants" },
        { name: "AI Voice Assistants" },
        { name: "AI Knowledge base" },
        { name: "AI Report Builder" },
        { name: "Ai Themes" },
        { name: "Ai items" },
        { name: "Ai Topics" },
      ],
    },
    {
      name: "Connect",
      icon: Plug,
      children: [
        { name: "Integrations", icon: Plug },
        { name: "API", icon: Code2 },
        { name: "Visual API", icon: Network },
      ],
    },
    { name: "Ai Products", icon: Cpu },
    { name: "Theme", icon: PaintBucket },
    {
      name: "Customization",
      icon: Sliders,
      children: [
        { name: "Custom fields" },
        { name: "Chat Widget" },
        { name: "Iframe" },
        { name: "Tags" },
        { name: "Quick Replies" },
      ],
    },

    { name: "Business Hours", icon: Clock },
    { name: "AI Assistants", icon: Bot },



    { name: "Password Policy", icon: ShieldCheck },
    { name: "Developer Settings", icon: Code },
    { name: "Change Password", icon: Lock },
  ];




  // Calculate initial activeSection directly from URL
  const initialTabParam = new URLSearchParams(window.location.search).get("tab");
  // Default to empty so right pane is empty until a selection
  const initialActiveSection = (initialTabParam && (sections.some(s => s.name === initialTabParam) || sections.some(s => s.children?.some((c: any) => c.name === initialTabParam)))) ? initialTabParam : "Manage";

  const [activeSection, setActiveSection] = useState(initialActiveSection);
  const [workspaceOpen, setWorkspaceOpen] = useState(true);
  const [customizationOpen, setCustomizationOpen] = useState(false);
  const [channelsOpen, setChannelsOpen] = useState(false);
  const [chatGptOpen, setChatGptOpen] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState(""); // Default profile picture
  const [notificationsEnabled, setNotificationsEnabled] = useState(false); // User preference for notifications, off by default
  const [browserNotificationsDenied, setBrowserNotificationsDenied] = useState(Notification.permission === 'denied'); // Initialize based on actual browser permission
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
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(search);
    const tabParam = params.get("tab");

    if (tabParam) {
      const found = sections.some(s => s.name === tabParam) || sections.some(s => s.children?.some((c: any) => c.name === tabParam));
      if (found) setActiveSection(tabParam);
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

  // Filter sections based on search query
  const filteredSections = sections.map(section => {
    if (!searchQuery.trim()) return section;

    const matchesParent = section.name.toLowerCase().includes(searchQuery.toLowerCase());
    const filteredChildren = section.children?.filter((child: any) =>
      child.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (matchesParent || (filteredChildren && filteredChildren.length > 0)) {
      return {
        ...section,
        children: filteredChildren && filteredChildren.length > 0 ? filteredChildren : section.children
      };
    }
    return null;
  }).filter(Boolean);


  return (
    <>
      {/* Google Font - Inter */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <div className="h-screen overflow-hidden" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div className="flex h-full">
          {/* Left Sidebar Navigation */}
          <Card className="h-full w-64 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border-r-2 border-slate-200/50 dark:border-slate-700/50 rounded-none shadow-[4px_0_24px_rgba(0,0,0,0.04)] flex-shrink-0 z-10 flex flex-col relative overflow-hidden">
            {/* Decorative gradient overlay */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-purple-500/5 to-transparent pointer-events-none rounded-full blur-2xl" />
            <CardContent className="p-0 flex flex-col flex-1 overflow-y-auto max-h-full min-h-0">

              {/* Search Bar */}
              <div className="p-4 border-b-2 border-slate-200/70 dark:border-slate-700/70 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm relative z-10">
                <div className="relative group">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="Search settings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                             bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                             placeholder:text-slate-400 dark:placeholder:text-slate-500
                             transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
                  />
                </div>
              </div>

              <div className="p-2 relative z-10">


                {/* WORKSPACE DROPDOWN */}
                <div className="border-b-2 border-slate-200/60 dark:border-slate-700/60 pb-3 mb-3 relative">
                  <div className="absolute -left-2 top-0 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full opacity-60" />
                  <button
                    onClick={() => setWorkspaceOpen(!workspaceOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors
                text-muted-foreground hover:bg-accent hover:text-foreground
                dark:text-gray-300 dark:hover:bg-slate-700 dark:hover:text-white"
                  >
                    <div className="flex items-center gap-2.5">
                      <LayoutGrid size={16} />
                      <span className="font-medium">Workspace</span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${workspaceOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {workspaceOpen && (
                    <div className="ml-6 mt-1 space-y-1">
                      {filteredSections[0]?.children?.map((item: any, idx: number) => (
                        <React.Fragment key={item.path}>
                          <button
                            onClick={() => {
                              navigate(item.path);
                              setActiveSection(item.name)
                            }}
                            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-all duration-200 
          ${activeSection === item.name
                                ? "bg-primary text-white shadow-sm transform scale-[1.02]"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground dark:text-gray-300 dark:hover:bg-slate-700 dark:hover:text-white hover:translate-x-0.5"
                              }`}
                          >
                            {item.name}
                          </button>

                        </React.Fragment>
                      ))}
                    </div>

                  )}

                </div>
                {/* SETTINGS */}
                {filteredSections.slice(1).map((section, index) => {
                  if (!section) return null;
                  const Icon = section.icon;
                  // Render Customization as a dropdown with children
                  if (section.name === "Conversation channels") {
                    return (
                      <div key={section.name} className="border-b-2 border-slate-200/60 dark:border-slate-700/60 pb-3 mb-3 relative">
                        <div className="absolute -left-2 top-0 w-1 h-8 bg-gradient-to-b from-green-500 to-teal-500 rounded-full opacity-60" />
                        <button
                          onClick={() => setChannelsOpen(!channelsOpen)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === section.name
                            ? "bg-primary text-white shadow-sm"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground dark:text-gray-300 dark:hover:bg-slate-700 dark:hover:text-white"
                            }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {Icon && <Icon size={16} />}
                            <span className="font-medium">{section.name}</span>
                          </div>
                          <ChevronDown size={14} className={`${channelsOpen ? "rotate-180" : ""}`} />
                        </button>

                        {channelsOpen && (
                          <div className="ml-6 mt-1 space-y-1">
                            {section.children?.map((child: any, childIndex: number) => {
                              const ChildIcon = child.icon;
                              return (
                                <React.Fragment key={child.name}>
                                  <button
                                    onClick={() => setActiveSection(child.name)}
                                    className={`w-full flex items-center gap-2 text-left px-3 py-2 text-sm rounded-md transition-colors ${activeSection === child.name
                                      ? "bg-primary text-white shadow-sm"
                                      : "text-muted-foreground hover:bg-accent hover:text-foreground dark:text-gray-300 dark:hover:bg-slate-700 dark:hover:text-white"
                                      }`}
                                  >
                                    {child.iconPath ? (
                                      <img src={child.iconPath} alt={child.name} className="w-3.5 h-3.5" />
                                    ) : ChildIcon ? (
                                      <ChildIcon size={14} className={activeSection === child.name ? "text-white" : child.color} />
                                    ) : null}
                                    {child.name}
                                  </button>

                                </React.Fragment>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (section.name === "Customization") {
                    return (
                      <div key={section.name} className="border-b-2 border-slate-200/60 dark:border-slate-700/60 pb-3 mb-3 relative">
                        <div className="absolute -left-2 top-0 w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full opacity-60" />
                        <button
                          onClick={() => setCustomizationOpen(!customizationOpen)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === section.name
                            ? "bg-primary text-white shadow-sm"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground dark:text-gray-300 dark:hover:bg-slate-700 dark:hover:text-white"
                            }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {Icon && <Icon size={16} />}
                            <span className="font-medium">{section.name}</span>
                          </div>
                          <ChevronDown size={14} className={`${customizationOpen ? "rotate-180" : ""}`} />
                        </button>

                        {customizationOpen && (
                          <div className="ml-6 mt-1 space-y-1">
                            {section.children?.map((child: any, idx: number) => (
                              <React.Fragment key={child.name}>
                                <button
                                  onClick={() => setActiveSection(child.name)}
                                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${activeSection === child.name
                                    ? "bg-primary text-white shadow-sm"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground dark:text-gray-300 dark:hover:bg-slate-700 dark:hover:text-white"
                                    }`}
                                >
                                  {child.name}
                                </button>

                              </React.Fragment>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (section.name === "ChatGPT") {
                    return (
                      <div key={section.name} className="border-b-2 border-slate-200/60 dark:border-slate-700/60 pb-3 mb-3 relative">
                        <div className="absolute -left-2 top-0 w-1 h-8 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full opacity-60" />
                        <button
                          onClick={() => setChatGptOpen(!chatGptOpen)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === section.name
                            ? "bg-primary text-white shadow-sm"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground dark:text-gray-300 dark:hover:bg-slate-700 dark:hover:text-white"
                            }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {Icon && <Icon size={16} />}
                            <span className="font-medium">{section.name}</span>
                          </div>
                          <ChevronDown size={14} className={`${chatGptOpen ? "rotate-180" : ""}`} />
                        </button>

                        {chatGptOpen && (
                          <div className="ml-6 mt-1 space-y-1">
                            {section.children?.map((child: any, idx: number) => (
                              <React.Fragment key={child.name}>
                                <button
                                  onClick={() => setActiveSection(child.name)}
                                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${activeSection === child.name
                                    ? "bg-primary text-white shadow-sm"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground dark:text-gray-300 dark:hover:bg-slate-700 dark:hover:text-white"
                                    }`}
                                >
                                  {child.name}
                                </button>

                              </React.Fragment>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (section.name === "Connect") {
                    return (
                      <div key={section.name} className="border-b-2 border-slate-200/60 dark:border-slate-700/60 pb-3 mb-3 relative">
                        <div className="absolute -left-2 top-0 w-1 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full opacity-60" />
                        <button
                          onClick={() => setConnectOpen(!connectOpen)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === section.name
                            ? "bg-primary text-white shadow-sm"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground dark:text-gray-300 dark:hover:bg-slate-700 dark:hover:text-white"
                            }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {Icon && <Icon size={16} />}
                            <span className="font-medium">{section.name}</span>
                          </div>
                          <ChevronDown size={14} className={`${connectOpen ? "rotate-180" : ""}`} />
                        </button>

                        {connectOpen && (
                          <div className="ml-6 mt-1 space-y-1">
                            {section.children?.map((child: any, idx: number) => (
                              <React.Fragment key={child.name}>
                                <button
                                  onClick={() => setActiveSection(child.name)}
                                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${activeSection === child.name
                                    ? "bg-primary text-white shadow-sm"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground dark:text-gray-300 dark:hover:bg-slate-700 dark:hover:text-white"
                                    }`}
                                >
                                  {child.name}
                                </button>

                              </React.Fragment>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <div key={section.name} className="border-b-2 border-slate-200/60 dark:border-slate-700/60 pb-3 mb-3 relative hover:bg-slate-50/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
                      <div className="absolute -left-2 top-0 w-1 h-8 bg-gradient-to-b from-indigo-500 to-violet-500 rounded-full opacity-60" />
                      <button
                        onClick={() => {
                          navigate(`/settings?tab=${section.name}`);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === section.name
                          ? "bg-primary text-white shadow-sm"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground dark:text-gray-300 dark:hover:bg-slate-700 dark:hover:text-white"
                          }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {Icon && <Icon size={16} />}
                          <span className="font-medium">{section.name}</span>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </CardContent>

          </Card>

          {/* Right Content Area */}
          <div className="flex-1 flex flex-col min-h-0 p-6 bg-gray-50/50 dark:bg-slate-950 settings-pane">
            <Card className="flex-1 overflow-auto shadow-sm border border-gray-100/50 bg-white dark:bg-slate-900 dark:border-slate-800">
              {activeSection === "Manage" && (
                <ManageSection />)}

              {activeSection === "Live Chat" && (
                <LiveChatSection />
              )}

              {activeSection === "White Label" && (
                <WhiteLabelSection />)}
              {activeSection === "Manage User" && (
                <ManageAgentsSection />)}
              {activeSection === "Roles & Permissions" && (
                <RolesSection />)}
              {activeSection === "Teams" && (
                <TeamsSection />)}
              {activeSection === "Media Gallery" && (
                <MediaGallerySection />)}


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

              {activeSection === "Theme" && (
                <ThemeSection />
              )}

              {activeSection === "Preferences" && (
                <PreferencesSection
                  preferences={preferences}
                  setPreferences={setPreferences}
                />
              )}

              {activeSection === "Business Hours" && (
                <BusinessHoursSection />
              )}
              {activeSection === "AI Assistants" && (
                <AIAssistantsSection />
              )}
              {activeSection === "AI Chat Assistants" && (
                <AIChatAssistantsSection />
              )}
              {activeSection === "AI Voice Assistants" && (
                <AIVoiceAssistantsSection />
              )}
              {activeSection === "AI Knowledge base" && (
                <AIKnowledgeBaseSection />
              )}
              {activeSection === "AI Report Builder" && (
                <AIReportBuilderSection />
              )}
              {activeSection === "Ai Themes" && (
                <AIThemesSection />
              )}
              {activeSection === "Ai items" && (
                <AIItemsSection />
              )}
              {activeSection === "Ai Topics" && (
                <AITopicsSection />
              )}
              {activeSection === "Ai Products" && (
                <AIProductsSection />
              )}
              {activeSection === "Integrations" && (
                <IntegrationsSection />
              )}
              {activeSection === "API" && (
                <APISection />
              )}
              {activeSection === "Visual API" && (
                <VisualAPISection />
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
              {activeSection === "Custom fields" && (
                <CustomFieldsSection />
              )}
              {activeSection === "Chat Widget" && (
                <ChatWidgetSection />
              )}
              {activeSection === "Iframe" && (
                <IframeSection />
              )}
              {activeSection === "Change Password" && (
                <ChangePasswordSection />
              )}

              {/* Channel Sections */}
              {activeSection === "WhatsApp" && <WhatsAppSection />}
              {activeSection === "Instagram" && <InstagramSection />}
              {activeSection === "Messenger" && <MessengerSection />}
              {activeSection === "Telegram" && <TelegramSection />}
              {activeSection === "SMS & Calls" && <SmsCallsSection />}
              {activeSection === "Webchat" && <WebchatSection />}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
