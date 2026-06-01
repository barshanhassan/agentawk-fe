import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle, Info, AlertTriangle, Mail, Send, MessageSquare } from "react-feather";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

/** Map notification slug → icon. Mirrors AppSidebar's dropdown mapping. */
function getIcon(slug?: string) {
    const s = (slug || "").toLowerCase();
    if (s.includes("message") || s.includes("mail")) return <Mail className="text-blue-500" size={20} />;
    if (s.includes("campaign") || s.includes("broadcast") || s.includes("send")) return <Send className="text-green-500" size={20} />;
    if (s.includes("approved") || s.includes("complete") || s.includes("success")) return <CheckCircle className="text-emerald-500" size={20} />;
    if (s.includes("warning") || s.includes("alert") || s.includes("maintenance")) return <AlertTriangle className="text-yellow-500" size={20} />;
    if (s.includes("chat") || s.includes("conversation")) return <MessageSquare className="text-purple-500" size={20} />;
    if (s.includes("info")) return <Info className="text-gray-500" size={20} />;
    return <Bell className="text-slate-500" size={20} />;
}

/** Human-readable relative time without pulling in a date library. */
function formatRelativeTime(iso: string | Date | null | undefined): string {
    if (!iso) return "";
    const date = typeof iso === "string" ? new Date(iso) : iso;
    const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diffSec < 60) return "just now";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} minute${Math.floor(diffSec / 60) === 1 ? "" : "s"} ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hour${Math.floor(diffSec / 3600) === 1 ? "" : "s"} ago`;
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)} day${Math.floor(diffSec / 86400) === 1 ? "" : "s"} ago`;
    return date.toLocaleDateString();
}

export default function NotificationsPage() {
    const { data: resp, isLoading } = useQuery<any>({
        queryKey: ["/api/notifications", { limit: 100 }],
        queryFn: async () => {
            const res = await apiRequest("GET", "/api/notifications?limit=100");
            return res.json();
        },
        refetchInterval: 60 * 1000,
    });
    const notifications: any[] = resp?.notifications || [];
    const unread: number = resp?.unread || 0;

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Notifications</h1>
                {unread > 0 && (
                    <Badge variant="outline" className="text-muted-foreground bg-background">
                        {unread} Unread
                    </Badge>
                )}
            </div>

            <Card className="border-0 shadow-lg">
                <CardHeader className="border-b border-gray-100 dark:border-slate-800 pb-4">
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollArea className="h-[calc(100vh-250px)]">
                        {isLoading ? (
                            <div className="p-10 text-center text-sm text-muted-foreground">Loading...</div>
                        ) : notifications.length === 0 ? (
                            <div className="p-16 text-center space-y-2">
                                <Bell className="mx-auto opacity-30" size={36} />
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">You're all caught up</p>
                                <p className="text-xs text-muted-foreground">No notifications yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100 dark:divide-slate-800">
                                {notifications.map((n: any) => {
                                    const title = n.data?.title || n.data?.message || n.slug || "Notification";
                                    const description = n.data?.description || n.data?.body || "";
                                    return (
                                        <div
                                            key={n.id}
                                            className={`flex items-start gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                                                !n.read ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                                            }`}
                                        >
                                            <div className="mt-1 bg-secondary p-2 rounded-full shadow-sm border border-gray-100 dark:border-slate-700">
                                                {getIcon(n.slug)}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p className={`text-sm font-medium leading-none ${!n.read ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}>
                                                    {title}
                                                </p>
                                                {description && (
                                                    <p className="text-sm text-muted-foreground">{description}</p>
                                                )}
                                                <p className="text-xs text-gray-400 pt-1">{formatRelativeTime(n.created_at)}</p>
                                            </div>
                                            {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}
