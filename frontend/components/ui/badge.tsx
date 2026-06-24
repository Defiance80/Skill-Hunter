import { cn } from "@/lib/utils";
import { getScoreColor, getScoreLabel } from "@/lib/constants";

export function Badge({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function ScoreBadge({ score }: { score: number | null }) {
  return (
    <Badge className={cn("text-white", getScoreColor(score))}>
      {score ?? "—"} · {getScoreLabel(score)}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    new: "bg-blue-500/20 text-blue-300",
    reviewed: "bg-purple-500/20 text-purple-300",
    draft_created: "bg-amber-500/20 text-amber-300",
    sent: "bg-cyan-500/20 text-cyan-300",
    clicked: "bg-teal-500/20 text-teal-300",
    audit_completed: "bg-emerald-500/20 text-emerald-300",
    replied: "bg-green-500/20 text-green-300",
    follow_up_needed: "bg-orange-500/20 text-orange-300",
    won: "bg-emerald-600/30 text-emerald-200",
    rejected: "bg-zinc-500/20 text-zinc-400",
    draft: "bg-amber-500/20 text-amber-300",
    approved: "bg-blue-500/20 text-blue-300",
  };

  return (
    <Badge className={colors[status] ?? "bg-zinc-700 text-zinc-300"}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
