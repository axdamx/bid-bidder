"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import { RealtimeChannel } from "@supabase/supabase-js";
import { userAtom } from "../atom/userAtom";
// import { supabase } from "@/lib/utils";
import {
  notificationsAtom,
  unreadCountAtom,
  Notification,
} from "../atom/notificationAtom";
import { createClientSupabase } from "@/lib/supabase/client";

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
  const setNotifications = useSetAtom(notificationsAtom);
  // const setUnreadCount = useSetAtom(unreadCountAtom);
  const [user] = useAtom(userAtom);
  const supabase = createClientSupabase(); // IF QUERY AT CLIENT, USE THIS

  const fetchNotifications = async (userId: string) => {
    if (!user) {
      return;
    }

    try {
      const { data: existingNotifications, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("userId", userId)
        .order("createdAt", { ascending: false })
        .limit(50);

      if (error) {
        return;
      }

      if (existingNotifications) {
        setNotifications(existingNotifications);
      }
    } catch (error) {}
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
        (payload: any) => {
          const newNotification = {
            ...payload.new,
            itemTitle: payload.new.itemTitle || "",
          } as Notification;
          setNotifications((prev) => [newNotification, ...prev]);
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

    // @ts-ignore
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
      fetchNotifications(user.id);
      setupChannel();
    } else {
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
