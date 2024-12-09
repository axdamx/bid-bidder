import { createServerSupabase } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerSupabase();

    try {
      // Exchange the code for a session
      const { data: { session }, error: sessionError } = 
        await supabase.auth.exchangeCodeForSession(code);
      
      if (sessionError) throw sessionError;

      if (session?.user) {
        // Check if there's an existing user with the same email
        const { data: existingUsers, error: userError } = await supabase
          .from('users')
          .select('id, email')
          .eq('email', session.user.email)
          .neq('id', session.user.id); // Exclude the current user

        if (userError) {
          console.error('Error checking existing user:', userError);
          return NextResponse.redirect(
            new URL("/?auth-error=true", requestUrl.origin)
          );
        }

        if (existingUsers?.length > 0) {
          // We found an existing account with the same email
          // Here we could either:
          // 1. Merge the accounts (requires additional logic to handle data migration)
          // 2. Link the accounts (requires additional database structure)
          // 3. Or simply notify the user
          
          // For now, we'll just redirect with a special parameter
          return NextResponse.redirect(
            new URL("/?auth-success=true&account-exists=true", requestUrl.origin)
          );
        }
      }

      // No existing account found, proceed normally
      return NextResponse.redirect(
        new URL("/?auth-success=true", requestUrl.origin)
      );
    } catch (error) {
      console.error('Error in auth callback:', error);
      return NextResponse.redirect(
        new URL("/?auth-error=true", requestUrl.origin)
      );
    }
  }

  // If no code, redirect to home page with an error parameter
  return NextResponse.redirect(new URL("/?auth-error=true", requestUrl.origin));
}
