import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreBar } from "@/components/lead-card";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Briefcase } from "lucide-react";
import type { JobLead, OpportunityClassification } from "@/lib/types";

const CLASSIFICATION_STYLES: Record<
  OpportunityClassification,
  { bg: string; text: string; label: string; description: string }
> = {
  Green: {
    bg: "bg-emerald-500/15",
    text: "text-emerald-300",
    label: "Green — Employment Fit",
    description: "Best pursued as a job application.",
  },
  Yellow: {
    bg: "bg-amber-500/15",
    text: "text-amber-300",
    label: "Yellow — Employment + Consulting",
    description: "Could work as a hire or a consulting engagement.",
  },
  Red: {
    bg: "bg-red-500/15",
    text: "text-red-300",
    label: "Red — Strong Service Opportunity",
    description: "Company likely needs an agency or consultant, not just an employee.",
  },
  Gold: {
    bg: "bg-yellow-500/15",
    text: "text-yellow-300",
    label: "Gold — High-Value Lead",
    description: "Multiple opportunity types. Strong fit. Immediate outreach recommended.",
  },
};

export default async function JobLeadDetailPage({
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
    .from("job_leads")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!lead) notFound();

  const typedLead = lead as JobLead;
  const classification = typedLead.opportunity_classification;
  const classStyle = classification
    ? CLASSIFICATION_STYLES[classification]
    : null;
  const scores = typedLead.opportunity_scores;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/leads/jobs">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">
            {typedLead.job_title}
          </h1>
          <p className="text-sm text-zinc-500">
            {typedLead.company_name} · {typedLead.location ?? typedLead.remote_status}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {classStyle && classification && (
            <Card className={`${classStyle.bg} border-0`}>
              <div className="flex items-start gap-3">
                <Briefcase className={`mt-0.5 h-5 w-5 ${classStyle.text}`} />
                <div>
                  <p className={`font-semibold ${classStyle.text}`}>
                    {classStyle.label}
                  </p>
                  <p className="mt-0.5 text-sm text-zinc-400">
                    {classStyle.description}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {typedLead.pain_point_summary && (
            <Card>
              <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-zinc-500">
                Pain Point Detected
              </h2>
              <p className="text-zinc-300">{typedLead.pain_point_summary}</p>
            </Card>
          )}

          {typedLead.recommended_angle && (
            <Card>
              <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-zinc-500">
                Recommended Outreach Angle
              </h2>
              <p className="text-zinc-300">{typedLead.recommended_angle}</p>
            </Card>
          )}

          {typedLead.suggested_services && typedLead.suggested_services.length > 0 && (
            <Card>
              <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-zinc-500">
                Suggested Services
              </h2>
              <div className="flex flex-wrap gap-2">
                {typedLead.suggested_services.map((s) => (
                  <Badge key={s} className="bg-zinc-700 text-zinc-300">
                    {s}
                  </Badge>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-zinc-500">
              Opportunity Scores
            </h2>
            <div className="space-y-3">
              <ScoreBar label="Employment" score={scores?.employment ?? null} />
              <ScoreBar label="Consulting" score={scores?.consulting ?? null} />
              <ScoreBar label="Agency" score={scores?.agency ?? null} />
              <ScoreBar label="Automation" score={scores?.automation ?? null} />
              <ScoreBar label="SaaS" score={scores?.saas ?? null} />
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-zinc-500">
              Match Scores
            </h2>
            <div className="space-y-3">
              <ScoreBar label="Overall Fit" score={typedLead.fit_score} />
              <ScoreBar label="Skill Match" score={typedLead.skill_match_score} />
              <ScoreBar label="Industry Match" score={typedLead.industry_match_score} />
              <ScoreBar label="Location Match" score={typedLead.location_match_score} />
            </div>
          </Card>

          <Card>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-zinc-500">
              Details
            </h2>
            <dl className="space-y-2 text-sm">
              {typedLead.salary_range && (
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Salary</dt>
                  <dd className="text-zinc-300">{typedLead.salary_range}</dd>
                </div>
              )}
              {typedLead.remote_status && (
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Work Type</dt>
                  <dd className="text-zinc-300 capitalize">{typedLead.remote_status}</dd>
                </div>
              )}
              {typedLead.source && (
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Source</dt>
                  <dd className="text-zinc-300">{typedLead.source}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-zinc-500">Opportunity</dt>
                <dd className="text-zinc-300 capitalize">{typedLead.opportunity_type ?? "—"}</dd>
              </div>
            </dl>
          </Card>

          <div className="flex flex-col gap-2">
            {typedLead.job_url && (
              <a href={typedLead.job_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4" />
                  View Job Listing
                </Button>
              </a>
            )}
            <form action={`/api/n8n/email-draft`} method="POST">
              <input type="hidden" name="lead_type" value="job" />
              <input type="hidden" name="lead_id" value={typedLead.id} />
              <Button className="w-full" type="submit">
                Draft Outreach Email
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
