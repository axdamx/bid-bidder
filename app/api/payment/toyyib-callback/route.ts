import { NextRequest, NextResponse } from "next/server";
import { handleToyyibCallback } from "@/app/checkout/[itemId]/actions";

export async function POST(req: NextRequest) {
  try {
    console.log("[TOYYIB CALLBACK] Received callback request");
    const data = await req.json();
    console.log("[TOYYIB CALLBACK] Callback data:", data);
    
    const result = await handleToyyibCallback(data);
    console.log("[TOYYIB CALLBACK] Handler result:", result);

    if (!result.success) {
      console.error("[TOYYIB CALLBACK] Error:", result.error);
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[TOYYIB CALLBACK API ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
