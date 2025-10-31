import { useState } from "react";
import {
  Menu,
  Bell,
  User,
  Lock,
  HelpCircle,
  LogOut,
  CheckCircle,
  BellOff,
} from "react-feather";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TopNavbarProps {
  onToggleSidebar: () => void;
}

export default function TopNavbar({ onToggleSidebar }: TopNavbarProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsMuted, setNotificationsMuted] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "chat",
      message: "New message from John Doe",
      time: "2m ago",
      read: false,
    },
    {
      id: 2,
      type: "alert",
      message: "Campaign 'Summer Sale' delivered",
      time: "15m ago",
      read: false,
    },
    {
      id: 3,
      type: "info",
      message: "System update available",
      time: "1h ago",
      read: true,
    },
    {
      id: 4,
      type: "chat",
      message: "New message from Sarah Smith",
      time: "45m ago",
      read: false,
    },
    {
      id: 5,
      type: "alert",
      message: "API rate limit warning",
      time: "2h ago",
      read: true,
    },
  ]);

  const mockNotifications = {
    all: notifications,
    chats: notifications.filter((n) => n.type === "chat"),
    alerts: notifications.filter((n) => n.type === "alert"),
    info: notifications.filter((n) => n.type === "info"),
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  return (
    <header
      className="h-16 bg-card border-b border-card-border px-4 flex items-center justify-between"
      data-testid="navbar"
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        className="hover-elevate"
        data-testid="button-sidebar-toggle"
      >
        <Menu size={20} />
      </Button>

      <div className="flex items-center gap-3">
        <DropdownMenu
          open={notificationsOpen}
          onOpenChange={setNotificationsOpen}
        >
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative hover-elevate w-12 h-12"
              data-testid="button-notifications"
            >
              {notificationsMuted ? <BellOff size={20} /> : <Bell size={20} />}
              {!notificationsMuted && unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center p-0 text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-80 p-0"
            data-testid="dropdown-notifications"
          >
            <Tabs defaultValue="all" className="w-full">
              <div className="p-4 pb-0">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-base">Notifications</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${unreadCount > 0 ? "text-blue-500" : "text-muted-foreground"}`}
                      title="Mark all as read"
                      onClick={handleMarkAllAsRead}
                      disabled={unreadCount === 0}
                    >
                      <CheckCircle size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`h-8 w-8 ${notificationsMuted ? "text-blue-500" : ""}`} 
                      title={notificationsMuted ? "Unmute notifications" : "Mute notifications"}
                      onClick={() => setNotificationsMuted(!notificationsMuted)}
                    >
                      <BellOff size={16} />
                    </Button>
                  </div>
                </div>
                <TabsList className="grid w-full grid-cols-4 bg-slate-200/75 mb-2">
                  <TabsTrigger
                    value="all"
                    className="text-xs"
                    data-testid="tab-all"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="chats"
                    className="text-xs"
                    data-testid="tab-chats"
                  >
                    Chats
                  </TabsTrigger>
                  <TabsTrigger
                    value="alerts"
                    className="text-xs"
                    data-testid="tab-alerts"
                  >
                    Alerts
                  </TabsTrigger>
                  <TabsTrigger
                    value="info"
                    className="text-xs"
                    data-testid="tab-info"
                  >
                    Info
                  </TabsTrigger>
                </TabsList>
              </div>
              <ScrollArea className="h-80">
                {(["all", "chats", "alerts", "info"] as const).map((tab) => (
                  <TabsContent key={tab} value={tab} className="m-0">
                    <div className="divide-y divide-border">
                      {mockNotifications[tab].map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 hover-elevate cursor-pointer transition-colors ${
                            notif.read
                              ? "bg-background"
                              : "bg-blue-50 dark:bg-blue-950/20"
                          }`}
                          onClick={() => handleMarkAsRead(notif.id)}
                          data-testid={`notification-${notif.id}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p
                                className={`text-sm ${
                                  notif.read
                                    ? "text-muted-foreground"
                                    : "font-semibold text-foreground"
                                }`}
                              >
                                {notif.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {notif.time}
                              </p>
                            </div>
                            {!notif.read && (
                              <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </ScrollArea>
            </Tabs>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="gap-2 hover-elevate"
              data-testid="button-user-menu"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  AD
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden md:inline">
                Admin User
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56"
            data-testid="dropdown-user-menu"
          >
            <DropdownMenuLabel>
              <div>
                <p className="font-semibold">Admin User</p>
                <p className="text-xs text-muted-foreground font-normal">
                  admin@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="hover-elevate"
              data-testid="menu-profile"
            >
              <User size={16} className="mr-2" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover-elevate"
              data-testid="menu-change-password"
            >
              <Lock size={16} className="mr-2" />
              Change Password
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover-elevate"
              data-testid="menu-support"
            >
              <HelpCircle size={16} className="mr-2" />
              Contact Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="hover-elevate text-destructive"
              data-testid="menu-logout"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
