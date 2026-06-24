import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export default async function EmailsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: drafts } = await supabase
    .from("email_drafts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-100">Email Drafts</h1>
        <p className="text-zinc-500">
          AI-generated outreach from n8n Workflow 4. Default send mode is
          manual — copy and send yourself.
        </p>
      </div>

      {drafts && drafts.length > 0 ? (
        <div className="space-y-4">
          {drafts.map((draft) => (
            <Card key={draft.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={draft.status} />
                    <span className="text-xs text-zinc-500">
                      {draft.lead_type} lead · {formatDate(draft.created_at)}
                    </span>
                  </div>
                  <h3 className="mt-2 font-medium text-zinc-100">
                    {draft.subject}
                  </h3>
                  <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-zinc-950 p-4 text-sm text-zinc-300">
                    {draft.body}
                  </pre>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No email drafts yet</CardTitle>
            <p className="text-sm text-zinc-500">
              Open a business lead and click &quot;Generate Email Draft&quot; to
              trigger Workflow 4, or wait for n8n to auto-draft after a search.
            </p>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
