import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "./lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // First, handle session updates
  const response = await updateSession(request);

  // Handle exact /app URL (without trailing slash)
  if (request.nextUrl.pathname === "/app") {
    // Redirect to /app/app to show the app page
    const url = new URL("/app", request.url);
    url.search = request.nextUrl.search;
    return NextResponse.rewrite(url);
  }

  // Check if the path starts with /app/
  // if (request.nextUrl.pathname.startsWith("/app/")) {
  //   // Skip rewriting for the how-auction-work path
  //   if (request.nextUrl.pathname === "/app/how-auction-work") {
  //     return response;
  //   }

  // For /app/profile or any other path under /app that isn't /app/app
  // We want to rewrite to use the app layout
  // if (!request.nextUrl.pathname.startsWith("/app/app/")) {
  //   // Extract the path after /app/
  //   const path = request.nextUrl.pathname.substring(5); // Remove '/app/'

  //   // Rewrite to /app/app/{path} to use the app layout
  //   const url = new URL(`/app/app${path}`, request.url);
  //   url.search = request.nextUrl.search;

  //   return NextResponse.rewrite(url);
  // }
  // }

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
