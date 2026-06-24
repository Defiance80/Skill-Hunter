import { createClient } from "@/lib/supabase/server";
import { ScoreBadge, StatusBadge } from "@/components/ui/badge";
import { ScoreBar } from "@/components/lead-card";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { DraftEmailButton } from "./draft-email-button";
import { UpdateStatusSelect } from "./update-status";

export default async function BusinessLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: lead } = await supabase
    .from("business_leads")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!lead) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-500">Lead not found.</p>
        <Link href="/leads/business" className="mt-4 inline-block text-emerald-400">
          Back to leads
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/leads/business"
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to business leads
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100">
            {lead.business_name}
          </h1>
          <p className="text-zinc-500">
            {lead.industry} · {lead.location}
          </p>
        </div>
        <ScoreBadge score={lead.lead_score} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge status={lead.status} />
        <span className="text-sm text-zinc-500">
          Added {formatDate(lead.created_at)}
        </span>
        {lead.website_url && (
          <a
            href={lead.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300"
          >
            <ExternalLink className="h-3 w-3" />
            Visit website
          </a>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4">
          <CardHeader>
            <CardTitle>Audit Scores</CardTitle>
          </CardHeader>
          <ScoreBar label="Website Presence" score={lead.website_score} />
          <ScoreBar label="SEO Visibility" score={lead.seo_score} />
          <ScoreBar label="Social Presence" score={lead.social_score} />
          <ScoreBar label="Brand Trust" score={lead.brand_score} />
        </Card>

        <Card className="space-y-4">
          <CardHeader>
            <CardTitle>Analysis</CardTitle>
          </CardHeader>
          {lead.pain_point_summary && (
            <div>
              <p className="text-xs font-medium uppercase text-zinc-500">
                Pain Point
              </p>
              <p className="mt-1 text-sm text-zinc-300">
                {lead.pain_point_summary}
              </p>
            </div>
          )}
          {lead.recommended_services && lead.recommended_services.length > 0 && (
            <div>
              <p className="text-xs font-medium uppercase text-zinc-500">
                Recommended Services
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {lead.recommended_services.map((service: string) => (
                  <span
                    key={service}
                    className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      <Card className="flex flex-wrap items-center justify-between gap-4">
        <UpdateStatusSelect leadId={lead.id} currentStatus={lead.status} />
        <DraftEmailButton leadId={lead.id} />
      </Card>
    </div>
  );
}
