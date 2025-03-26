import { createServerSupabase } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const provider = requestUrl.searchParams.get("provider");
  const error = requestUrl.searchParams.get("error");
  const error_code = requestUrl.searchParams.get("error_code");

  // Handle error cases first
  if (error || error_code) {
    return NextResponse.redirect(
      new URL(
        `/app?auth-error=true&error=${error || ""}&error_code=${
          error_code || ""
        }`,
        requestUrl.origin
      )
    );
  }

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerSupabase();

    try {
      // Exchange the code for a session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.exchangeCodeForSession(code);

      if (sessionError) throw sessionError;

      if (session?.user) {
        // Check if there's an existing user with the same email
        const { data: existingUsers, error: userError } = await supabase
          .from("users")
          .select("id, email")
          .eq("email", session.user.email)
          .neq("id", session.user.id); // Exclude the current user

        if (userError) {
          return NextResponse.redirect(
            new URL(
              "/app?auth-error=true&error=database_error",
              requestUrl.origin
            )
          );
        }

        // Build the success URL with all necessary parameters
        const successUrl = new URL("/app", requestUrl.origin);
        successUrl.searchParams.set("auth-success", "true");

        // Add provider info if available
        if (provider) {
          successUrl.searchParams.set("provider", provider);
        }

        // Add account exists flag if needed
        if (existingUsers?.length > 0) {
          successUrl.searchParams.set("account-exists", "true");
        }

        // Add session info
        successUrl.searchParams.set("user_id", session.user.id);

        return NextResponse.redirect(successUrl);
      }

      // If we get here, something went wrong
      return NextResponse.redirect(
        new URL("/app?auth-error=true&error=no_session", requestUrl.origin)
      );
    } catch (error) {
      return NextResponse.redirect(
        new URL("/app?auth-error=true&error=server_error", requestUrl.origin)
      );
    }
  }

  // If no code, redirect to home page with an error parameter
  return NextResponse.redirect(
    new URL("/app?auth-error=true&error=no_code", requestUrl.origin)
  );
}
