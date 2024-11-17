"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../utils";

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let refreshTimer: NodeJS.Timeout;

    const refreshSession = async () => {
      try {
        console.log("🔄 Attempting to refresh session...");
        const { data, error } = await supabase.auth.refreshSession();

        if (error) {
          console.error("❌ Error refreshing session:", error);
          return false;
        }

        if (data.session) {
          console.log("✅ Session refreshed successfully");
          console.log(
            "📅 New session expires at:",
            new Date(data.session.expires_at! * 1000).toLocaleString()
          );
          console.log(
            "⏰ Time until expiry:",
            data.session.expires_at! * 1000 - Date.now(),
            "ms"
          );
          return true;
        }

        console.log("⚠️ No session data after refresh");
        return false;
      } catch (error) {
        console.error("❌ Error in refresh session:", error);
        return false;
      }
    };

    const setupSession = async () => {
      try {
        console.log("🚀 Setting up session...");
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          console.log("📌 Current session details:");
          console.log(
            "- Expires at:",
            new Date(session.expires_at! * 1000).toLocaleString()
          );
          console.log(
            "- Time until expiry:",
            session.expires_at! * 1000 - Date.now(),
            "ms"
          );

          // Refresh every 10 minutes
          refreshTimer = setInterval(async () => {
            console.log("⏰ Scheduled refresh triggered");
            await refreshSession();
          }, 10 * 60 * 1000); // 10 minutes

          console.log("⏰ Refresh timer set for every 10 minutes");
        } else {
          console.log("⚠️ No active session found during setup");
        }
      } catch (error) {
        console.error("❌ Error setting up session:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    // Set up auth state change listener
    const {
      data: { subscription: authListener },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔔 Auth state changed:", event);

      if (event === "SIGNED_IN") {
        console.log("👤 User signed in, setting up session...");
        await setupSession();
        router.refresh();
      } else if (event === "SIGNED_OUT") {
        console.log("👋 User signed out, clearing refresh timer");
        clearInterval(refreshTimer);
        router.refresh();
      } else if (event === "TOKEN_REFRESHED") {
        console.log("🔄 Token refreshed event received");
        router.refresh();
      }
    });

    // Initial setup
    console.log("🎬 Initial session setup starting...");
    setupSession();

    // Cleanup
    return () => {
      console.log("🧹 Cleaning up session provider...");
      authListener.unsubscribe();
      if (refreshTimer) {
        console.log("⏰ Clearing refresh timer");
        clearInterval(refreshTimer);
      }
    };
  }, [router]);

  // Add session check wrapper for children
  const WrappedChildren = () => {
    useEffect(() => {
      const checkSession = async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          console.log("⚠️ No active session found in WrappedChildren");
        } else {
          console.log("✅ Active session found in WrappedChildren");
        }
      };

      checkSession();
    }, []);

    return children;
  };

  if (!isInitialized) {
    console.log("⏳ Session provider initializing...");
    return null;
  }

  return <WrappedChildren />;
}
