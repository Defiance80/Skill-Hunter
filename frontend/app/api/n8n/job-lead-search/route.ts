import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { triggerJobLeadSearch } from "@/lib/n8n";

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
    const { skills, location, remote_status } = body;

    if (!skills?.length || !location) {
      return NextResponse.json(
        { error: "skills and location are required" },
        { status: 400 }
      );
    }

    const result = await triggerJobLeadSearch({
      skills,
      location,
      remote_status,
      user_id: user.id,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
