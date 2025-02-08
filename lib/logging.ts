import { createServerSupabase } from "./supabase/server";
import { captureEvent } from "./posthog";

export type LogLevel = "info" | "warning" | "error";

export interface LogEntry {
  level: LogLevel;
  event: string;
  details: Record<string, any>;
  timestamp: string;
  userId?: string;
}

export async function logEvent(
  level: LogLevel,
  event: string,
  details: Record<string, any>,
  userId?: string
) {
  const timestamp = new Date().toISOString();
  const logEntry: LogEntry = {
    level,
    event,
    details,
    timestamp,
    userId,
  };

  // Log to Supabase
  const supabase = createServerSupabase();
  const { error } = await supabase.from("logs").insert([logEntry]);
  
  if (error) {
    console.error("Failed to store log in Supabase:", error);
  }

  // Log to PostHog with appropriate event name
  captureEvent(`${level.toUpperCase()}_${event}`, {
    ...details,
    userId,
    timestamp,
  });

  // Also console.log for development
  if (process.env.NODE_ENV === "development") {
    console.log(`[${level.toUpperCase()}] ${event}:`, details);
  }
}

// Convenience methods
export const logInfo = (event: string, details: Record<string, any>, userId?: string) =>
  logEvent("info", event, details, userId);

export const logWarning = (event: string, details: Record<string, any>, userId?: string) =>
  logEvent("warning", event, details, userId);

export const logError = (event: string, details: Record<string, any>, userId?: string) =>
  logEvent("error", event, details, userId);
