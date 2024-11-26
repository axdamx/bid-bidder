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
import { cn, supabase } from "@/lib/utils";
// import { useSupabase } from "../context/SupabaseContext"
// import { useNotifications } from "../context/NotificationContext"
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { notificationsAtom, unreadCountAtom } from "./atom/notificationAtom";
import { useNotifications } from "./context/NotificationContext";
import { useState } from "react";

export function NotificationDropdown() {
  const [notifications, setNotifications] = useAtom(notificationsAtom);
  const [unreadCount] = useAtom(unreadCountAtom);
  const router = useRouter();
  //   const { supabase } = useSupabase();
  const { isConnected } = useNotifications();
  const [open, setOpen] = useState(false);

  const handleNotificationClick = async (notification: any) => {
    try {
      // Optimistically update UI
      setNotifications(
        notifications.map((n) =>
          n.id === notification.id ? { ...n, read: true } : n
        )
      );

      setOpen(false);

      // Update in database
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notification.id);

      if (error) throw error;

      // Navigate to the item
      router.push(`/items/${notification.itemId}`);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      // Revert optimistic update on error
      setNotifications(notifications);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // Get all unread notification IDs
      const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);

      if (unreadIds.length === 0) return;

      // Optimistically update UI
      setNotifications(notifications.map((n) => ({ ...n, read: true })));

      // Update in database
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .in("id", unreadIds);

      if (error) throw error;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      // Revert optimistic update on error
      setNotifications(notifications);
    }
  };

  const renderNotificationContent = (notification: any) => {
    switch (notification.type) {
      case "bid":
        return (
          <div className="space-y-1">
            <p className="font-medium text-sm">
              New bid on{" "}
              <span className="text-primary">{notification.itemTitle}</span>
            </p>
            <p className="text-muted-foreground text-xs">
              {notification.message}
            </p>
          </div>
        );
      // Add more cases for different notification types
      default:
        return <p className="text-sm">{notification.message}</p>;
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
            className={cn("h-5 w-5", !isConnected && "text-muted-foreground")}
          />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h4 className="font-semibold text-sm">Notifications</h4>
          {!isConnected && (
            <Badge variant="outline" className="text-xs">
              Reconnecting...
            </Badge>
          )}
        </div>
        {notifications.some((n) => !n.read) && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-8 px-2 text-muted-foreground hover:text-foreground"
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </Button>
        )}
        <ScrollArea className="h-[calc(100vh-200px)] max-h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                No notifications yet
              </p>
            </div>
          ) : (
            <div className="py-2">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={cn(
                    "w-full text-left px-4 py-3 space-y-1",
                    "hover:bg-accent transition-colors",
                    "focus:outline-none focus:bg-accent",
                    !notification.read && "bg-accent/50"
                  )}
                >
                  {renderNotificationContent(notification)}
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(notification.createdAt), "MMM d, h:mm a")}
                  </p>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

// Loading skeleton for notifications
function NotificationSkeleton() {
  return (
    <div className="p-4 space-y-3">
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}
