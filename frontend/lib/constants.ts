// Mirrors seed data in /database/schema.sql and CLAUDE.md

export const INDUSTRIES = [
  "Law Firms",
  "MedSpas",
  "Dental Practices",
  "Chiropractors",
  "Real Estate Agents",
  "Mortgage Brokers",
  "Insurance Agencies",
  "Restaurants",
  "Contractors",
  "HVAC Companies",
  "Plumbers",
  "Electricians",
  "Auto Shops",
  "Fitness Studios",
  "Local Retail",
  "E-commerce Brands",
  "Nonprofits",
  "Consultants",
  "Coaches",
  "Event Venues",
  "Music / Entertainment",
  "Healthcare Clinics",
  "Home Services",
] as const;

export const JOB_CATEGORIES = [
  "SEO",
  "Marketing",
  "Web Development",
  "Graphic Design",
  "Project Management",
  "Media",
  "Branding",
  "Content",
  "Digital Strategy",
  "PPC",
  "Social Media",
  "WordPress",
  "Shopify",
  "Client Success",
  "Creative Ops",
  "Marketing Ops",
  "Agency Account Management",
] as const;

export const SKILL_LEVELS = [
  { value: "entry", label: "Entry" },
  { value: "mid", label: "Mid-Level" },
  { value: "senior", label: "Senior" },
  { value: "expert", label: "Expert" },
] as const;

export const REMOTE_OPTIONS = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "On-site" },
  { value: "any", label: "Any" },
] as const;

export const LEAD_STATUSES = [
  "new",
  "reviewed",
  "draft_created",
  "sent",
  "clicked",
  "audit_completed",
  "replied",
  "follow_up_needed",
  "won",
  "rejected",
] as const;

export const SEND_MODES = [
  { value: "manual", label: "Manual", description: "AI drafts only; you send manually" },
  { value: "approval", label: "Approval", description: "AI drafts; you approve before send" },
  { value: "auto", label: "Auto-Send", description: "Sends above score threshold automatically" },
] as const;

// n8n webhook path names — match /n8n-workflows/ file naming
export const N8N_WEBHOOKS = {
  businessLeadSearch: "business-lead-search",
  jobLeadSearch: "job-lead-search",
  auditScan: "audit-scan",
  emailDraft: "email-draft",
  resumeParser: "resume-parser",
} as const;

export function getScoreLabel(score: number | null): string {
  if (score === null) return "Unscored";
  if (score >= 90) return "Excellent Fit";
  if (score >= 75) return "Strong Fit";
  if (score >= 60) return "Possible Fit";
  if (score >= 40) return "Low Priority";
  return "Ignore";
}

export function getScoreColor(score: number | null): string {
  if (score === null) return "bg-zinc-500";
  if (score >= 75) return "bg-emerald-500";
  if (score >= 60) return "bg-amber-500";
  if (score >= 40) return "bg-orange-500";
  return "bg-zinc-500";
}
