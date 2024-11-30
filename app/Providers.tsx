"use client";

import { Provider } from "jotai";
// import { store } from '@/lib/store'
import { SupabaseProvider } from "./context/SupabaseContext";
import { NotificationProvider } from "./context/NotificationContext";
import QueryProvider from "@/lib/QueryClientComponentWrapper";
import SessionProvider from "@/lib/supabase/SessionProvider";
import { useEffect, useState } from "react";

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
    <Provider>
      <QueryProvider>
        {/* <SupabaseProvider> */}
        {/* <SessionProvider> */}
        <NotificationProvider>{children}</NotificationProvider>
        {/* </SessionProvider> */}
        {/* </SupabaseProvider> */}
      </QueryProvider>
    </Provider>
  );
}
