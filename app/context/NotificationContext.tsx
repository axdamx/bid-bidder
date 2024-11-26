"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { RealtimeChannel } from "@supabase/supabase-js";
import { userAtom } from "../atom/userAtom";
import { supabase } from "@/lib/utils";
import { notificationsAtom, unreadCountAtom } from "../atom/notificationAtom";

interface NotificationContextType {
  isConnected: boolean;
  reconnect: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const [notifications, setNotifications] = useAtom(notificationsAtom);
  const [, setUnreadCount] = useAtom(unreadCountAtom);
  const [user] = useAtom(userAtom);

  const fetchNotifications = async (userId: string) => {
    if (!user) return;

    // TODO: query the notifications table for the user
    console.log("fetching notifications for user ID:", userId);
    try {
      const { data: existingNotifications, error } = await supabase
        .from("notifications") // Specify the table name
        .select("*") // Select all columns
        .eq("userId", userId) // Filter by userId
        // .order("createdAt", { ascending: false }) // Order by createdAt in descending order
        .limit(50); // Limit the results to 50

      if (error) {
        console.error("Error fetching notifications:", error);
        return;
      }

      console.log("Fetched notifications:", existingNotifications);

      if (existingNotifications) {
        setNotifications(existingNotifications);
        // setUnreadCount(existingNotifications.filter((n) => !n.read).length);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const setupChannel = async () => {
    if (!user || channelRef.current) return;

    // Set up real-time channel
    channelRef.current = supabase
      .channel(`notifications:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `userId=eq.${user.id}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev]);
          // setUnreadCount((prev) => prev + 1);
        }
      )
      .on("presence", { event: "sync" }, () => {
        setIsConnected(true);
      })
      .on("presence", { event: "join" }, () => {
        setIsConnected(true);
      })
      .on("presence", { event: "leave" }, () => {
        setIsConnected(false);
      });

    await channelRef.current.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        setIsConnected(true);
      } else if (status === "CLOSED") {
        setIsConnected(false);
        reconnectTimeoutRef.current = setTimeout(reconnect, 5000);
      }
    });
  };

  const reconnect = async () => {
    if (channelRef.current) {
      await supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    await setupChannel();
  };

  useEffect(() => {
    if (user) {
      fetchNotifications(user.id); // Fetch notifications on login
      setupChannel();
    } else {
      // Clear notifications and reset connection on logout
      setNotifications([]);
      setIsConnected(false);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    }

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [user?.id]);

  return (
    <NotificationContext.Provider value={{ isConnected, reconnect }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
