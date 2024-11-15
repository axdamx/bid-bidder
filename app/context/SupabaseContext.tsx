"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Session, createClient } from "@supabase/supabase-js";

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

const supabase = createSupabaseClient();

type SupabaseContextType = {
  session: Session | null;
  supabase: typeof supabase;
};

const SupabaseContext = createContext<SupabaseContextType | undefined>(
  undefined
);

export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });

    // Check for an existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <SupabaseContext.Provider value={{ session, supabase }}>
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
