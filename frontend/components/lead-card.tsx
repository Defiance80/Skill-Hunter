import { ScoreBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatRelativeDate } from "@/lib/utils";
import type { BusinessLead, JobLead, OpportunityClassification } from "@/lib/types";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

const CLASSIFICATION_BADGE: Record<
  OpportunityClassification,
  { bg: string; text: string }
> = {
  Green:  { bg: "bg-emerald-500/20", text: "text-emerald-300" },
  Yellow: { bg: "bg-amber-500/20",   text: "text-amber-300"   },
  Red:    { bg: "bg-red-500/20",     text: "text-red-300"     },
  Gold:   { bg: "bg-yellow-500/20",  text: "text-yellow-300"  },
};

export function BusinessLeadCard({ lead }: { lead: BusinessLead }) {
  return (
    <Link href={`/leads/business/${lead.id}`}>
      <Card className="transition-colors hover:border-zinc-700">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-medium text-zinc-100">
              {lead.business_name}
            </h3>
            <p className="text-sm text-zinc-500">
              {lead.industry} · {lead.location}
            </p>
            {lead.pain_point_summary && (
              <p className="mt-2 line-clamp-2 text-sm text-zinc-400">
                {lead.pain_point_summary}
              </p>
            )}
          </div>
          <ScoreBadge score={lead.lead_score} />
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
          <span>{formatRelativeDate(lead.created_at)}</span>
          {lead.website_url && (
            <span className="flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              Website
            </span>
          )}
        </div>
      </Card>
    </Link>
  );
}

export function JobLeadCard({ lead }: { lead: JobLead }) {
  const classStyle = lead.opportunity_classification
    ? CLASSIFICATION_BADGE[lead.opportunity_classification]
    : null;

  return (
    <Link href={`/leads/jobs/${lead.id}`}>
      <Card className="transition-colors hover:border-zinc-700">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="truncate font-medium text-zinc-100">{lead.job_title}</h3>
              {classStyle && lead.opportunity_classification && (
                <span
                  className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-medium ${classStyle.bg} ${classStyle.text}`}
                >
                  {lead.opportunity_classification}
                </span>
              )}
            </div>
            <p className="text-sm text-zinc-500">
              {lead.company_name} · {lead.location ?? lead.remote_status}
            </p>
            {lead.pain_point_summary && (
              <p className="mt-2 line-clamp-2 text-sm text-zinc-400">
                {lead.pain_point_summary}
              </p>
            )}
          </div>
          <ScoreBadge score={lead.fit_score} />
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
          <span>{formatRelativeDate(lead.created_at)}</span>
          {lead.job_url && (
            <span className="flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              View listing
            </span>
          )}
        </div>
      </Card>
    </Link>
  );
}

export function MetricCard({
  label,
  value,
  subtext,
}: {
  label: string;
  value: string | number;
  subtext?: string;
}) {
  return (
    <Card>
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-zinc-100">{value}</p>
      {subtext && <p className="mt-1 text-xs text-zinc-500">{subtext}</p>}
    </Card>
  );
}

export function ScoreBar({
  label,
  score,
}: {
  label: string;
  score: number | null;
}) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-zinc-400">{label}</span>
        <span className="text-zinc-300">{score ?? "—"}/100</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all"
          style={{ width: `${score ?? 0}%` }}
        />
      </div>
    </div>
  );
}
