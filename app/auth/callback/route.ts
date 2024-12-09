import { createServerSupabase } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Get the URL and code
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    console.error("No code provided in callback");
    return NextResponse.redirect(
      new URL("/?auth-error=true", requestUrl.origin)
    );
  }

  // const cookieStore = cookies();
  const supabase = createServerSupabase();

  try {
    // Exchange the code for a session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (sessionError) {
      console.error("Session error:", sessionError);
      throw sessionError;
    }

    if (!session?.user) {
      console.error("No user in session");
      throw new Error("No user in session");
    }

    // Check for existing user
    const { data: existingUsers, error: userError } = await supabase
      .from("users")
      .select("id, email")
      .eq("email", session.user.email)
      .neq("id", session.user.id);

    if (userError) {
      console.error("Error checking existing user:", userError);
      return NextResponse.redirect(
        new URL("/?auth-error=true", requestUrl.origin)
      );
    }

    // Handle existing user case
    if (existingUsers?.length > 0) {
      return NextResponse.redirect(
        new URL("/?auth-success=true&account-exists=true", requestUrl.origin)
      );
    }

    // Success case
    return NextResponse.redirect(
      new URL("/?auth-success=true", requestUrl.origin)
    );
  } catch (error) {
    console.error("Error in auth callback:", error);
    return NextResponse.redirect(
      new URL("/?auth-error=true", requestUrl.origin)
    );
  }
}
