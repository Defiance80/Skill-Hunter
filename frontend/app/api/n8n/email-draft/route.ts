import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { triggerEmailDraft } from "@/lib/n8n";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { lead_type, lead_id } = body;

    if (!lead_type || !lead_id) {
      return NextResponse.json(
        { error: "lead_type and lead_id are required" },
        { status: 400 }
      );
    }

    const result = await triggerEmailDraft({
      user_id: user.id,
      lead_type,
      lead_id,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
