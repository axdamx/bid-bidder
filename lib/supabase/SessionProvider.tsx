"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Session } from "@supabase/supabase-js";
import { createClientSupabase } from "./client";

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [sessionState, setSessionState] = useState<"active" | "expired">("expired");
  const router = useRouter();
  const supabase = createClientSupabase();

  useEffect(() => {
    let refreshTimer: NodeJS.Timeout;
    let periodicCheckTimer: NodeJS.Timeout;
    let isRefreshing = false;

    const checkAndRefreshSession = async () => {
      if (isRefreshing) return;
      isRefreshing = true;

      try {
        console.log("🔍 Performing session check...");
        const {
          data: { session: currentSession },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session check error:", sessionError);
          setSessionState("expired");
          return;
        }

        if (!currentSession) {
          console.log("⚠️ No session found, attempting refresh...");
          const { data, error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshError) {
            if (refreshError.message.includes("no current session")) {
              console.log("No current session to refresh");
              setSessionState("expired");
            } else {
              console.error("Session refresh failed:", refreshError);
              setSessionState("expired");
            }
          } else if (data.session) {
            console.log("✅ Session refreshed successfully");
            setSessionState("active");
          }
        } else {
          setSessionState("active");
        }
      } catch (error) {
        console.error("Session check/refresh error:", error);
        setSessionState("expired");
      } finally {
        isRefreshing = false;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("📱 Tab is visible, checking session...");
        checkAndRefreshSession();
      }
    };

    const setupSession = async () => {
      try {
        console.log("🔄 Setting up session...");
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Initial session check error:", error);
          setSessionState("expired");
          return;
        }

        if (session) {
          console.log(
            "✅ Session found, expires at:",
            new Date(session.expires_at! * 1000).toLocaleString()
          );
          setSessionState("active");

          // Calculate time until expiry with 5-minute buffer
          const expiresIn = session.expires_at! * 1000 - Date.now() - 300000;
          console.log(
            `⏰ Session expires in ${Math.round(expiresIn / 1000)} seconds`
          );

          // Set up refresh timer
          if (expiresIn > 0) {
            refreshTimer = setTimeout(async () => {
              console.log("🔄 Scheduled session refresh starting...");
              const { data, error: refreshError } = await supabase.auth.refreshSession();
              
              if (refreshError) {
                console.error("Scheduled refresh failed:", refreshError);
                setSessionState("expired");
                // Retry setup after error
                setTimeout(setupSession, 5000);
              } else if (data.session) {
                console.log("✅ Scheduled refresh successful");
                setSessionState("active");
                // Set up next refresh cycle
                setupSession();
              }
            }, Math.max(0, expiresIn));
          }

          // Set up periodic checks
          periodicCheckTimer = setInterval(checkAndRefreshSession, 120000); // Every 2 minutes
        } else {
          console.log("⚠️ No active session");
          setSessionState("expired");
        }
      } catch (error) {
        console.error("Session setup error:", error);
        setSessionState("expired");
      } finally {
        setIsInitialized(true);
      }
    };

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("🔔 Auth state changed:", event, session?.user?.email);

      switch (event) {
        case "SIGNED_OUT":
          setSessionState("expired");
          break;
        case "SIGNED_IN":
        case "TOKEN_REFRESHED":
          setSessionState("active");
          setupSession();
          break;
        case "USER_UPDATED":
          if (session) {
            setSessionState("active");
          }
          break;
      }
    });

    // Set up visibility change listener
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Initial setup
    setupSession();

    // Cleanup
    return () => {
      console.log("🧹 Cleaning up session provider...");
      subscription.unsubscribe();
      if (refreshTimer) clearTimeout(refreshTimer);
      if (periodicCheckTimer) clearInterval(periodicCheckTimer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [router]);

  if (!isInitialized) {
    return <SkeletonLoader />;
  }

  return children;
}

function SkeletonLoader() {
  return (
    <div className="w-full min-h-screen bg-gray-100">
      <header className="flex items-center justify-between p-4 border-b bg-white">
        <div className="w-12 h-12 bg-gray-300 animate-enhanced-pulse rounded" />
        <div className="w-64 h-10 bg-gray-300 animate-enhanced-pulse rounded-md" />
        <div className="w-24 h-10 bg-gray-300 animate-enhanced-pulse rounded-md" />
      </header>

      <div className="container mx-auto px-4 py-12 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="h-12 bg-gray-300 animate-enhanced-pulse rounded w-3/4" />
            <div className="h-12 bg-gray-300 animate-enhanced-pulse rounded w-full" />
            <div className="h-12 bg-gray-300 animate-enhanced-pulse rounded w-2/3" />
          </div>
          <div className="h-6 bg-gray-300 animate-enhanced-pulse rounded w-2/3" />
          <div className="flex gap-4">
            <div className="h-12 bg-red-300 animate-enhanced-pulse rounded w-32" />
            <div className="h-12 bg-gray-300 animate-enhanced-pulse rounded w-32" />
          </div>
          <div className="flex gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-8 bg-gray-300 animate-enhanced-pulse rounded w-16" />
                <div className="h-4 bg-gray-300 animate-enhanced-pulse rounded w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div className="h-8 bg-gray-300 animate-enhanced-pulse rounded w-32" />
          <div className="h-6 bg-gray-300 animate-enhanced-pulse rounded w-24" />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4 space-y-4 bg-white">
              <div className="aspect-video bg-gray-300 animate-enhanced-pulse rounded-lg" />
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-300 animate-enhanced-pulse rounded w-1/2" />
                  <div className="h-6 bg-gray-300 animate-enhanced-pulse rounded w-24" />
                </div>
                <div className="h-8 bg-gray-300 animate-enhanced-pulse rounded w-32" />
                <div className="flex justify-between">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="text-center space-y-1">
                      <div className="h-6 bg-gray-300 animate-enhanced-pulse rounded w-12" />
                      <div className="h-4 bg-gray-300 animate-enhanced-pulse rounded w-16" />
                    </div>
                  ))}
                </div>
                <div className="h-12 bg-gray-800 animate-enhanced-pulse rounded-md w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
