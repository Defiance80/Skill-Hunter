import { ScoreBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatRelativeDate } from "@/lib/utils";
import type { BusinessLead, JobLead } from "@/lib/types";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

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
  return (
    <Card className="transition-colors hover:border-zinc-700">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-medium text-zinc-100">{lead.job_title}</h3>
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
          <a
            href={lead.job_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-zinc-300"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-3 w-3" />
            View listing
          </a>
        )}
      </div>
    </Card>
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
