import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { itemId: string } }
) {
  const supabase = createServerSupabase();

  try {
    const { data: order, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        item:items(*)
      `
      )
      .eq("itemId", params.itemId)
      .single();

    if (error) throw error;

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch order status" },
      { status: 500 }
    );
  }
}
