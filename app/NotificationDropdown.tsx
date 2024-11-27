import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { notificationsAtom, unreadCountAtom } from "./atom/notificationAtom";
import { useNotifications } from "./context/NotificationContext";
import { useState } from "react";
import { createClientSupabase } from "@/lib/supabase/client";

export function NotificationDropdown() {
  const [notifications, setNotifications] = useAtom(notificationsAtom);
  const [unreadCount, setUnreadCount] = useAtom(unreadCountAtom);
  const router = useRouter();
  const { isConnected } = useNotifications();
  const [open, setOpen] = useState(false);
  const supabase = createClientSupabase(); // IF QUERY AT CLIENT, USE THIS

  const handleNotificationClick = async (notification: any) => {
    try {
      setNotifications(
        notifications.map((n) =>
          n.id === notification.id ? { ...n, read: true } : n
        )
      );

      setOpen(false);

      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notification.id);

      if (error) throw error;

      // Handle different notification types
      switch (notification.type) {
        case "bid":
          router.push(`/items/${notification.itemId}`);
          break;
        case "follow":
          router.push(`/profile/${notification.followerId}`);
          break;
        case "new_item":
          router.push(`/items/${notification.itemId}`);
          break;
        default:
          console.warn(`Unknown notification type: ${notification.type}`);
          break;
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      setNotifications(notifications);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);

      if (unreadIds.length === 0) return;

      setNotifications(notifications.map((n) => ({ ...n, read: true })));
      // setUnreadCount(0);

      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .in("id", unreadIds);

      if (error) throw error;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      setNotifications(notifications);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={`Notifications ${
            unreadCount > 0 ? `(${unreadCount} unread)` : ""
          }`}
        >
          <Bell
            className={cn("h-6 w-6", !isConnected && "text-muted-foreground")}
          />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-2 -right-2 h-7 w-7 flex items-center justify-center p-0"
              variant="destructive"
            >
              {unreadCount > 10 ? "10+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-6" align="end" sideOffset={8}>
        <h4 className="font-bold text-lg mb-2">Notifications</h4>
        <p className="text-sm mb-4">
          You have {unreadCount} unread message{unreadCount !== 1 && "s"}.
        </p>
        <ScrollArea className="h-[calc(100vh-300px)] max-h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                No notifications yet
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start space-x-2"
                >
                  <span
                    className={`p-2 ${
                      notification.read ? "text-blue-500" : "text-red-500"
                    }`}
                  >
                    •
                  </span>
                  <div>
                    <button
                      onClick={() => handleNotificationClick(notification)}
                      className="text-left text-sm font-medium hover:underline"
                    >
                      {notification.message}
                    </button>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.createdAt))}{" "}
                      ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        {notifications.some((n) => !n.read) && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-4 text-xs h-8 px-2 text-muted-foreground hover:text-foreground"
            onClick={handleMarkAllAsRead}
          >
            ✓ Mark all as read
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}
