import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { triggerBusinessLeadSearch } from "@/lib/n8n";

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
    const { industry, location, radius = 10 } = body;

    if (!industry || !location) {
      return NextResponse.json(
        { error: "industry and location are required" },
        { status: 400 }
      );
    }

    // Payload matches workflow-1-business-lead-discovery.json Extract Search Parameters node
    const result = await triggerBusinessLeadSearch({
      industry,
      location,
      radius: Number(radius),
      user_id: user.id,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
