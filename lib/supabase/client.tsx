"use client";
import { CookieOptions, createBrowserClient } from "@supabase/ssr";

let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null;

export function createClientSupabase() {
  if (supabaseInstance) {
    // Force reconnect realtime connection
    supabaseInstance.realtime.connect();
    console.log("🔄 Reconnecting existing Supabase realtime connection");
    return supabaseInstance;
  }

  console.log("🆕 Creating new Supabase instance");
  supabaseInstance = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          console.log("🍪 Getting cookie:", name);
          return document.cookie
            .split("; ")
            .find((row) => row.startsWith(`${name}=`))
            ?.split("=")[1];
        },
        set(name: string, value: string, options: CookieOptions) {
          console.log("🍪 Setting cookie:", name);
          let cookieString = `${name}=${value}; path=${options.path}`;
          if (options.maxAge) cookieString += `; max-age=${options.maxAge}`;
          if (options.domain) cookieString += `; domain=${options.domain}`;
          if (options.secure) cookieString += "; secure";
          if (options.sameSite)
            cookieString += `; samesite=${options.sameSite}`;
          document.cookie = cookieString;
        },
        remove(name: string, options: CookieOptions) {
          console.log("🍪 Removing cookie:", name);
          document.cookie = `${name}=; path=${options.path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        },
      },
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    }
  );

  return supabaseInstance;
}

// Export a singleton instance
export const supabase = createClientSupabase();
