import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { triggerResumeParser } from "@/lib/n8n";

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
    const { resume_text } = body;

    if (!resume_text) {
      return NextResponse.json(
        { error: "resume_text is required" },
        { status: 400 }
      );
    }

    const result = await triggerResumeParser({
      user_id: user.id,
      resume_text,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook failed";
    return NextResponse.json(
      { error: message, extracted: null },
      { status: 502 }
    );
  }
}
