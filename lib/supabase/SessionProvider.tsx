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
  const [sessionState, setSessionState] = useState<"active" | "expired">(
    "expired"
  );
  const router = useRouter();
  const supabase = createClientSupabase();

  useEffect(() => {
    let refreshTimer: NodeJS.Timeout;
    let periodicCheckTimer: NodeJS.Timeout;

    const checkAndRefreshSession = async () => {
      console.log("🔍 Performing session check...");
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      if (!currentSession) {
        console.log("⚠️ Session check failed, attempting refresh...");
        const { data, error: refreshError } =
          await supabase.auth.refreshSession();
        if (refreshError) {
          console.error("Session refresh failed:", refreshError);
          setSessionState("expired");
        } else {
          setSessionState("active");
        }
      } else {
        setSessionState("active");
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
        console.log("🔄 Checking session status...");
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Session check error:", error);
          setSessionState("expired");
          return;
        }

        if (session) {
          console.log(
            "✅ Session found, expires at:",
            new Date(session.expires_at! * 1000).toLocaleString()
          );
          setSessionState("active");

          const expiresIn = session.expires_at! * 1000 - Date.now() - 300000; // 5 minutes buffer
          console.log(
            `⏰ Session expires in ${Math.round(expiresIn / 1000)} seconds`
          );

          refreshTimer = setTimeout(async () => {
            console.log("🔄 Refreshing session...");
            const { data, error: refreshError } =
              await supabase.auth.refreshSession();
            if (refreshError) {
              console.error("Session refresh failed:", refreshError);
              setSessionState("expired");
              setTimeout(setupSession, 5000);
            }
          }, Math.max(0, expiresIn));

          periodicCheckTimer = setInterval(checkAndRefreshSession, 120000);
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

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("🔔 Auth state changed:", event, session?.user?.email);

      if (event === "SIGNED_OUT") {
        setSessionState("expired");
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        console.log("reach here?");
        setSessionState("active");
        setupSession();
      }
    });

    document.addEventListener("visibilitychange", handleVisibilityChange);

    setupSession();

    return () => {
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
        <div className="w-12 h-12 bg-gray-300 animate-pulse rounded" />
        <div className="w-64 h-10 bg-gray-300 animate-pulse rounded-md" />
        <div className="w-24 h-10 bg-gray-300 animate-pulse rounded-md" />
      </header>

      <div className="container mx-auto px-4 py-12 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="h-12 bg-gray-300 animate-pulse rounded w-3/4" />
            <div className="h-12 bg-gray-300 animate-pulse rounded w-full" />
            <div className="h-12 bg-gray-300 animate-pulse rounded w-2/3" />
          </div>
          <div className="h-6 bg-gray-300 animate-pulse rounded w-2/3" />
          <div className="flex gap-4">
            <div className="h-12 bg-red-300 animate-pulse rounded w-32" />
            <div className="h-12 bg-gray-300 animate-pulse rounded w-32" />
          </div>
          <div className="flex gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-8 bg-gray-300 animate-pulse rounded w-16" />
                <div className="h-4 bg-gray-300 animate-pulse rounded w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div className="h-8 bg-gray-300 animate-pulse rounded w-32" />
          <div className="h-6 bg-gray-300 animate-pulse rounded w-24" />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4 space-y-4 bg-white">
              <div className="aspect-video bg-gray-300 animate-pulse rounded-lg" />
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-300 animate-pulse rounded w-1/2" />
                  <div className="h-6 bg-gray-300 animate-pulse rounded w-24" />
                </div>
                <div className="h-8 bg-gray-300 animate-pulse rounded w-32" />
                <div className="flex justify-between">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="text-center space-y-1">
                      <div className="h-6 bg-gray-300 animate-pulse rounded w-12" />
                      <div className="h-4 bg-gray-300 animate-pulse rounded w-16" />
                    </div>
                  ))}
                </div>
                <div className="h-12 bg-gray-800 animate-pulse rounded-md w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
