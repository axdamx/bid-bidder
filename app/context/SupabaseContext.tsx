"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Session, createClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/utils";

// Create singleton Supabase client
const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (typeof window === "undefined") {
    return createClient(supabaseUrl, supabaseAnonKey);
  }

  // @ts-ignore - globalThis works in modern browsers
  if (!globalThis.supabase) {
    // @ts-ignore
    globalThis.supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  // @ts-ignore
  return globalThis.supabase;
};

// const supabase = createSupabaseClient();
const SupabaseContext = createContext<SupabaseContextType | undefined>(
  undefined
);

type SupabaseContextType = {
  session: Session | null;
  supabase: typeof supabase;
  isLoading: boolean;
};

export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for an existing session first
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <SupabaseContext.Provider value={{ session, supabase, isLoading }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
};
