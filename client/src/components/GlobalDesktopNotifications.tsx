import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { apiRequest } from "@/lib/queryClient";
import { getUserInfo } from "@/lib/auth";
import { useSocket } from "@/hooks/use-socket";
import { useToast } from "@/hooks/use-toast";

/**
 * "Desktop Notifications" (Settings → My Profile → Notifications &
 * Preferences) — mounted once for the whole app (same pattern as
 * SessionPolicyBanner), since a socket owned by ConversationsInbox alone
 * disconnects the moment the agent navigates to any other page.
 *
 * Two different popups depending on where the agent's attention actually is:
 *   - tab visible, on some OTHER page (Insights, Contacts, …) → an in-app
 *     toast, same as the one ConversationsInbox already shows unconditionally
 *     while the agent is looking right at the inbox itself.
 *   - tab hidden/backgrounded (minimized, another app in front) → a real
 *     OS-level browser Notification, since no in-app UI is visible to toast into.
 */
export default function GlobalDesktopNotifications() {
  const { t } = useTranslation();
  const { toast } = useToast();

  const workspaceId = useMemo(() => {
    const info = getUserInfo();
    // Agency accounts have no single workspace inbox to notify for.
    if (String(info?.modelable_type ?? "").toLowerCase().includes("agency")) return undefined;
    const raw = info?.workspace_id ?? info?.modelable_id;
    return raw ? Number(raw) || undefined : undefined;
  }, []);

  const socket = useSocket(workspaceId);

  const { data: prefs } = useQuery<any>({
    queryKey: ["/api/users/preferences"],
    queryFn: async () => (await apiRequest("GET", "/api/users/preferences")).json(),
    enabled: typeof window !== "undefined" && !!localStorage.getItem("auth_token"),
  });

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data: { message?: { text?: string; direction?: string; contact_name?: string } }) => {
      const msg = data?.message;
      if (!msg || msg.direction === "OUTGOING") return;
      if (!prefs?.desktopNotifications) return;

      const tabHidden = typeof document !== "undefined" && document.hidden;
      const onInboxPage = typeof window !== "undefined" && window.location.pathname.startsWith("/conversations/inbox");

      // Inbox page already shows its own toast for every incoming message,
      // unconditionally — skip here so it isn't shown twice.
      if (!tabHidden && onInboxPage) return;

      const title = msg.contact_name || t("conversations_inbox.toasts.new_message_received");

      if (tabHidden) {
        if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
        new Notification(title, { body: msg.text || undefined });
      } else {
        toast({ title, description: msg.text || undefined });
      }
    };

    socket.on("new_message", handleNewMessage);
    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [socket, prefs?.desktopNotifications, t, toast]);

  return null;
}
