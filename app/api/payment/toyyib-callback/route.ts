import { NextRequest, NextResponse } from "next/server";
import { handleToyyibCallback } from "@/app/checkout/[itemId]/actions";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const result = await handleToyyibCallback(data);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
