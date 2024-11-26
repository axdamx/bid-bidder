"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { useSupabase } from "./SupabaseContext";
import { RealtimeChannel } from "@supabase/supabase-js";
import { userAtom } from "../atom/userAtom";
import { supabase } from "@/lib/utils";
import { notificationsAtom } from "../atom/notificationAtom";

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
  const [, setNotifications] = useAtom(notificationsAtom);
  //   const { supabase, user } = useSupabase();
  const [user] = useAtom(userAtom);

  const setupChannel = async () => {
    if (!user || channelRef.current) return;

    try {
      // Fetch initial notifications
      const { data: existingNotifications } = await supabase
        .from("notifications")
        .select("*")
        .eq("userId", user.id)
        .order("createdAt", { ascending: false })
        .limit(50); // Limit the initial fetch

      if (existingNotifications) {
        setNotifications(existingNotifications);
      }

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
          // Attempt to reconnect after a delay
          reconnectTimeoutRef.current = setTimeout(reconnect, 5000);
        }
      });
    } catch (error) {
      console.error("Error setting up notification channel:", error);
      setIsConnected(false);
    }
  };

  const reconnect = async () => {
    if (channelRef.current) {
      await supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    await setupChannel();
  };

  useEffect(() => {
    setupChannel();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [user?.id]); // Only re-run if user ID changes

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
