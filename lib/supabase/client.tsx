import { createBrowserClient } from "@supabase/ssr";

export function createClientSupabase() {
  // renamed from createClient to createClientSupabase
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
