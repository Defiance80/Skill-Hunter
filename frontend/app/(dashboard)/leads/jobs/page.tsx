import { createClient } from "@/lib/supabase/server";
import { JobLeadCard } from "@/components/lead-card";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search } from "lucide-react";

export default async function JobLeadsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: leads } = await supabase
    .from("job_leads")
    .select("*")
    .eq("user_id", user.id)
    .order("fit_score", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100">Job Leads</h1>
          <p className="text-zinc-500">
            Saved by n8n Workflow 2 into{" "}
            <code className="text-zinc-400">job_leads</code>
          </p>
        </div>
        <Link href="/search/jobs">
          <Button>
            <Search className="h-4 w-4" />
            New Search
          </Button>
        </Link>
      </div>

      {leads && leads.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {leads.map((lead) => (
            <JobLeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No job leads yet</CardTitle>
            <p className="text-sm text-zinc-500">
              Import Workflow 2 in n8n, then run a job search from here.
            </p>
          </CardHeader>
          <Link href="/search/jobs">
            <Button>Start Job Search</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
