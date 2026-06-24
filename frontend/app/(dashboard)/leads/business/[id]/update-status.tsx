"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Select } from "@/components/ui/input";
import { LEAD_STATUSES } from "@/lib/constants";

export function UpdateStatusSelect({
  leadId,
  currentStatus,
}: {
  leadId: string;
  currentStatus: string;
}) {
  const router = useRouter();

  async function handleChange(status: string) {
    const supabase = createClient();
    await supabase
      .from("business_leads")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", leadId);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-zinc-500">Pipeline status:</span>
      <Select
        value={currentStatus}
        onChange={(e) => handleChange(e.target.value)}
        className="w-48"
      >
        {LEAD_STATUSES.map((status) => (
          <option key={status} value={status}>
            {status.replace(/_/g, " ")}
          </option>
        ))}
      </Select>
    </div>
  );
}
