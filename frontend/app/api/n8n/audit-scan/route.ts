import { NextResponse } from "next/server";
import { triggerAuditScan } from "@/lib/n8n";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { website_url, requester_email, requester_name } = body;

    if (!website_url) {
      return NextResponse.json(
        { error: "website_url is required" },
        { status: 400 }
      );
    }

    const result = await triggerAuditScan({
      website_url,
      requester_email,
      requester_name,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
