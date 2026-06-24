import { createClient } from "@/lib/supabase/server";
import { BusinessLeadCard } from "@/components/lead-card";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search } from "lucide-react";

export default async function BusinessLeadsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: leads } = await supabase
    .from("business_leads")
    .select("*")
    .eq("user_id", user.id)
    .order("lead_score", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100">Business Leads</h1>
          <p className="text-zinc-500">
            Saved by n8n Workflow 1 into{" "}
            <code className="text-zinc-400">business_leads</code>
          </p>
        </div>
        <Link href="/search/business">
          <Button>
            <Search className="h-4 w-4" />
            New Search
          </Button>
        </Link>
      </div>

      {leads && leads.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {leads.map((lead) => (
            <BusinessLeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No business leads yet</CardTitle>
            <p className="text-sm text-zinc-500">
              Run a search from the dashboard or use n8n directly with the
              webhook payload from QUICKSTART.md.
            </p>
          </CardHeader>
          <Link href="/search/business">
            <Button>Start Search</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
