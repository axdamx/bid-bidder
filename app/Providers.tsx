"use client";

import { Provider } from "jotai";
// import { store } from '@/lib/store'
import { SupabaseProvider } from "./context/SupabaseContext";
import { NotificationProvider } from "./context/NotificationContext";
import QueryProvider from "@/lib/QueryClientComponentWrapper";
import SessionProvider from "@/lib/supabase/SessionProvider";
import { Suspense, useEffect, useState } from "react";
import { PostHogProvider } from "./providers/PostHogProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  //   const [mounted, setMounted] = useState(false);

  //   useEffect(() => {
  //     setMounted(true);
  //   }, []);

  //   if (!mounted) {
  //     // window.location.reload();
  //     console.log("not mounted");
  //     return null; // or a loading skeleton
  //   }

  return (
    <Suspense fallback={null}>
      <Provider>
        <QueryProvider>
          <PostHogProvider>
            <NotificationProvider>{children}</NotificationProvider>
          </PostHogProvider>
        </QueryProvider>
      </Provider>
    </Suspense>
  );
}
