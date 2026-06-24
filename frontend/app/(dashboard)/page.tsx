import { createClient } from "@/lib/supabase/server";
import { MetricCard, BusinessLeadCard } from "@/components/lead-card";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    { count: businessCount },
    { count: jobCount },
    { count: newToday },
    { count: draftCount },
    { data: topLeads },
    { data: profile },
  ] = await Promise.all([
    supabase
      .from("business_leads")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("job_leads")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("business_leads")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", today.toISOString()),
    supabase
      .from("email_drafts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "draft"),
    supabase
      .from("business_leads")
      .select("*")
      .eq("user_id", user.id)
      .order("lead_score", { ascending: false })
      .limit(5),
    supabase
      .from("skill_profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100">Dashboard</h1>
          <p className="text-zinc-500">
            Your lead pipeline at a glance
          </p>
        </div>
        <Link href="/search/business">
          <Button>
            <Search className="h-4 w-4" />
            New Search
          </Button>
        </Link>
      </div>

      {!profile && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-amber-200">
                Set up your skill profile first
              </p>
              <p className="text-sm text-amber-200/70">
                Upload a resume or configure skills so n8n can score leads
                against your profile.
              </p>
            </div>
            <Link href="/profile">
              <Button variant="outline" size="sm">
                Set up profile
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Business Leads" value={businessCount ?? 0} />
        <MetricCard label="Job Leads" value={jobCount ?? 0} />
        <MetricCard label="New Today" value={newToday ?? 0} />
        <MetricCard label="Draft Emails" value={draftCount ?? 0} />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-zinc-200">
            Highest-Scoring Leads
          </h2>
          <Link
            href="/leads/business"
            className="text-sm text-emerald-400 hover:text-emerald-300"
          >
            View all
          </Link>
        </div>
        {topLeads && topLeads.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {topLeads.map((lead) => (
              <BusinessLeadCard key={lead.id} lead={lead} />
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No leads yet</CardTitle>
              <p className="text-sm text-zinc-500">
                Run a business search to discover companies with weak digital
                presence. Results are saved by n8n Workflow 1 into Supabase.
              </p>
            </CardHeader>
            <Link href="/search/business">
              <Button>Start Business Search</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
