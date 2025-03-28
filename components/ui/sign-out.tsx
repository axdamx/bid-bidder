"use client";

import { createClient } from "@supabase/supabase-js";
import { Button } from "./button";
// import { supabase } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClientSupabase } from "@/lib/supabase/client";

// Initialize Supabase client
export function SignOut() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isLoading) return; // Prevent multiple clicks

    try {
      const supabase = createClientSupabase();
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      router.push("/app");
      router.refresh(); // Refresh the page to update auth state
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignOut}>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Signing out..." : "Sign Out"}
      </Button>
    </form>
  );
}
