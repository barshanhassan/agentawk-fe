import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Briefcase, CheckCircle, Info, AlertTriangle } from "react-feather";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function NotificationsPage() {
    // Mock notifications data
    const notifications = [
        {
            id: 1,
            title: "New message from John Doe",
            description: "Hey, can we reschedule our meeting?",
            time: "2 minutes ago",
            type: "message",
            read: false,
        },
        {
            id: 2,
            title: 'Campaign "Summer Sale" completed',
            description: "The campaign reached 5,000 customers with a 25% click-through rate.",
            time: "1 hour ago",
            type: "success",
            read: true,
        },
        {
            id: 3,
            title: "Template approved",
            description: "Your WhatsApp template 'Order Confirmation' has been approved.",
            time: "3 hours ago",
            type: "info",
            read: true,
        },
        {
            id: 4,
            title: "System Maintenance",
            description: "Scheduled maintenance will occur on Saturday at 2:00 AM.",
            time: "5 hours ago",
            type: "warning",
            read: true,
        },
        {
            id: 5,
            title: "New Team Member",
            description: "Sarah Smith has joined the Sales Team.",
            time: "1 day ago",
            type: "info",
            read: true,
        },
        {
            id: 6,
            title: "Billing Alert",
            description: "Your credit card is about to expire.",
            time: "2 days ago",
            type: "warning",
            read: true,
        },
        {
            id: 7,
            title: "Export Ready",
            description: "Your contacts export is ready for download.",
            time: "3 days ago",
            type: "success",
            read: true,
        },
    ];

    const getIcon = (type: string) => {
        switch (type) {
            case "message":
                return <Bell className="text-blue-500" size={20} />;
            case "success":
                return <CheckCircle className="text-green-500" size={20} />;
            case "warning":
                return <AlertTriangle className="text-yellow-500" size={20} />;
            case "info":
            default:
                return <Info className="text-gray-500" size={20} />;
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Notifications</h1>
                <Badge variant="outline" className="text-muted-foreground bg-background">
                    {notifications.filter(n => !n.read).length} Unread
                </Badge>
            </div>

            <Card className="border-0 shadow-lg bg-white dark:bg-slate-900">
                <CardHeader className="border-b border-gray-100 dark:border-slate-800 pb-4">
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollArea className="h-[calc(100vh-250px)]">
                        <div className="divide-y divide-gray-100 dark:divide-slate-800">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`flex items-start gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${!notification.read ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                                        }`}
                                >
                                    <div className="mt-1 bg-white dark:bg-slate-800 p-2 rounded-full shadow-sm border border-gray-100 dark:border-slate-700">
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className={`text-sm font-medium leading-none ${!notification.read ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}>
                                            {notification.title}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {notification.description}
                                        </p>
                                        <p className="text-xs text-gray-400 pt-1">
                                            {notification.time}
                                        </p>
                                    </div>
                                    {!notification.read && (
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}
