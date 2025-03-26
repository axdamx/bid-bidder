"use client";

import { Provider } from "jotai";
import { NotificationProvider } from "./context/NotificationContext";
import QueryProvider from "@/lib/QueryClientComponentWrapper";
import { Suspense } from "react";
import { PostHogProvider } from "./providers/PostHogProvider";

export function Providers({ children }: { children: React.ReactNode }) {
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
