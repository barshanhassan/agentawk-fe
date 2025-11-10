import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  BarChart2,
  MessageSquare,
  Cpu,
  FileText,
  Send,
  Users,
  GitBranch,
  Zap,
  Grid,
  Settings,
  UserPlus,
  CreditCard,
  Star,
  ChevronDown,
} from "react-feather";
import { SiWhatsapp } from "react-icons/si";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // Import Tooltip components

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  children?: { label: string; path: string }[];
}

interface AppSidebarProps {
  collapsed: boolean;
}

export default function AppSidebar({ collapsed }: AppSidebarProps) {
  const [location] = useLocation();
  const [conversationsOpen, setConversationsOpen] = useState(false);

  const mainMenuItems: MenuItem[] = [
    { icon: <BarChart2 size={20} />, label: "Insights", path: "/insights" }, // Changed path to /insights
    {
      icon: <MessageSquare size={20} />,
      label: "Conversations",
      path: "/conversations",
      children: [
        { label: "Inbox", path: "/conversations/inbox" },
        { label: "Logs", path: "/conversations/logs" },
      ],
    },
    { icon: <Cpu size={20} />, label: "Bot Conversations", path: "/conversations/bot" },
    { icon: <FileText size={20} />, label: "WhatsApp Templates", path: "/templates" },
    { icon: <Send size={20} />, label: "Campaign Manager", path: "/campaigns" },
    { icon: <Users size={20} />, label: "Contacts", path: "/contacts" },
    { icon: <Settings size={20} />, label: "User Management", path: "/users" },
    { icon: <UserPlus size={20} />, label: "Team Management", path: "/teams" },
  ];

  const footerMenuItems: MenuItem[] = [
    { icon: <SiWhatsapp size={20} />, label: "WhatsApp Manager", path: "/whatsapp-manager" },
    { icon: <CreditCard size={20} />, label: "Billing", path: "/billing" },
    { icon: <Settings size={20} />, label: "Settings", path: "/settings-page" },
  ];

  const isActive = (path: string) => location === path || (path === "/insights" && location === "/"); // Added condition for root path

  return (
    <div
      className={`h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ${
        collapsed ? "w-14" : "w-64"
      }`}
      data-testid="sidebar"
    >
      <div className="p-4 pl-2 border-b border-sidebar-border flex items-center h-16">
        {collapsed ? (
          <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold absolute" data-testid="logo-icon">
            CM
          </div>
        ) : (
          <div className="flex items-center gap-2" data-testid="logo-full">
            <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold">
              CM
            </div>
            <span className="font-bold text-lg text-sidebar-foreground">CommPlatform</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-2">
        <nav className="space-y-1">
          {mainMenuItems.map((item) => {
            if (item.children) {
              return (
                <Collapsible
                  key={item.path}
                  open={conversationsOpen}
                  onOpenChange={setConversationsOpen}
                >
                  <CollapsibleTrigger asChild>
                    {collapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            className={`w-full justify-start gap-3 hover-elevate ${
                              collapsed ? "px-2" : "px-3"
                            } ${
                              location.startsWith(item.path)
                                ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                                : "text-sidebar-foreground"
                            }`}
                            data-testid={`menu-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                          >
                            {item.icon}
                            {!collapsed && (
                              <>
                                <span className="flex-1 text-left">{item.label}</span>
                                <ChevronDown
                                  size={16}
                                  className={`transition-transform ${conversationsOpen ? "rotate-180" : ""}`}
                                />
                              </>
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">{item.label}</TooltipContent>
                      </Tooltip>
                    ) : (
                      <Button
                        variant="ghost"
                        className={`w-full justify-start gap-3 hover-elevate ${
                          collapsed ? "px-2" : "px-3"
                        } ${
                          location.startsWith(item.path)
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                            : "text-sidebar-foreground"
                        }`}
                        data-testid={`menu-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        {item.icon}
                        {!collapsed && (
                          <>
                            <span className="flex-1 text-left">{item.label}</span>
                            <ChevronDown
                              size={16}
                              className={`transition-transform ${conversationsOpen ? "rotate-180" : ""}`}
                            />
                          </>
                        )}
                      </Button>
                    )}
                  </CollapsibleTrigger>
                  {!collapsed && (
                    <CollapsibleContent className="ml-9 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link key={child.path} href={child.path}>
                          <Button
                            variant="ghost"
                            className={`w-full justify-start text-sm hover-elevate ${
                              isActive(child.path)
                                ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                                : "text-muted-foreground"
                            }`}
                            data-testid={`submenu-${child.label.toLowerCase()}`}
                          >
                            {child.label}
                          </Button>
                        </Link>
                      ))}
                    </CollapsibleContent>
                  )}
                </Collapsible>
              );
            }

            return (
              <Link key={item.path} href={item.path}>
                {collapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start gap-3 hover-elevate ${
                          collapsed ? "px-2" : "px-3"
                        } ${
                          isActive(item.path)
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                            : "text-sidebar-foreground"
                        }`}
                        data-testid={`menu-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        {item.icon}
                        {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                ) : (
                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-3 hover-elevate ${
                      collapsed ? "px-2" : "px-3"
                    } ${
                      isActive(item.path)
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                        : "text-sidebar-foreground"
                    }`}
                    data-testid={`menu-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {item.icon}
                    {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
                  </Button>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-sidebar-border py-4 px-2 space-y-1">
        {footerMenuItems.map((item) => (
          <Link key={item.path} href={item.path}>
            {collapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-3 hover-elevate ${
                      collapsed ? "px-2" : "px-3"
                    } ${
                      isActive(item.path)
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                        : "text-sidebar-foreground"
                    }`}
                    data-testid={`menu-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {item.icon}
                    {!collapsed && (
                      <span className="flex-1 text-left flex items-center gap-2">
                        {item.label}
                        {item.label === "What's New" && (
                          <Badge variant="default" className="text-xs">
                            New
                          </Badge>
                        )}
                      </span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ) : (
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 hover-elevate ${
                  collapsed ? "px-2" : "px-3"
                } ${
                  isActive(item.path)
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                    : "text-sidebar-foreground"
                }`}
                data-testid={`menu-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {item.icon}
                {!collapsed && (
                  <span className="flex-1 text-left flex items-center gap-2">
                    {item.label}
                    {item.label === "What's New" && (
                      <Badge variant="default" className="text-xs">
                        New
                      </Badge>
                    )}
                  </span>
                )}
              </Button>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
