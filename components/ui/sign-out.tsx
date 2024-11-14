"use client";

import { createClient } from "@supabase/supabase-js";
import { Button } from "./button";
import { supabase } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Initialize Supabase client
export function SignOut() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isLoading) return; // Prevent multiple clicks

    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      router.push("/");
      router.refresh(); // Refresh the page to update auth state
    } catch (error) {
      console.error("Error signing out:", error);
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
