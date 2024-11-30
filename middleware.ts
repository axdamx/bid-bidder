import { type NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Match all paths except:
    // - Static files (_next/static, images, favicon)
    // - Public routes (items, auth)
    "/((?!_next/static|_next/image|favicon.ico|items|auth|auctions|profile|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
