// Types aligned with /database/schema.sql (OpenClaw)

export type LeadStatus =
  | "new"
  | "reviewed"
  | "draft_created"
  | "sent"
  | "clicked"
  | "audit_completed"
  | "replied"
  | "follow_up_needed"
  | "won"
  | "rejected";

export type SendMode = "manual" | "approval" | "auto";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface SkillProfile {
  id: string;
  user_id: string;
  resume_text: string | null;
  resume_url: string | null;
  portfolio_url: string | null;
  linkedin_url: string | null;
  primary_skills: string[];
  secondary_skills: string[];
  preferred_industries: string[];
  avoid_industries: string[];
  preferred_locations: string[];
  skill_level: string | null;
  tone: string;
  minimum_fit_score: number;
  created_at: string;
  updated_at: string;
}

export interface BusinessLead {
  id: string;
  user_id: string;
  business_name: string;
  industry: string | null;
  website_url: string | null;
  location: string | null;
  phone: string | null;
  email: string | null;
  contact_name: string | null;
  social_links: Record<string, string> | null;
  domain_authority: number | null;
  website_score: number | null;
  seo_score: number | null;
  social_score: number | null;
  brand_score: number | null;
  lead_score: number | null;
  pain_point_summary: string | null;
  recommended_services: string[] | null;
  audit_data: Record<string, unknown> | null;
  audit_url: string | null;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
}

export interface JobLead {
  id: string;
  user_id: string;
  company_name: string;
  job_title: string;
  job_url: string | null;
  source: string | null;
  website_url: string | null;
  location: string | null;
  remote_status: string | null;
  salary_range: string | null;
  contact_name: string | null;
  contact_email: string | null;
  skills_requested: string[] | null;
  fit_score: number | null;
  skill_match_score: number | null;
  industry_match_score: number | null;
  location_match_score: number | null;
  pain_point_summary: string | null;
  recommended_angle: string | null;
  suggested_services: string[] | null;
  opportunity_type: string | null;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
}

export interface EmailDraft {
  id: string;
  user_id: string;
  lead_type: "business" | "job";
  lead_id: string;
  subject: string;
  body: string;
  tone: string | null;
  status: "draft" | "approved" | "sent";
  sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Settings {
  id: string;
  user_id: string;
  send_mode: SendMode;
  auto_send_threshold: number;
  daily_send_limit: number;
  enable_follow_ups: boolean;
  follow_up_delay_days: number;
  created_at: string;
  updated_at: string;
}

export interface Audit {
  id: string;
  website_url: string;
  requester_email: string | null;
  requester_name: string | null;
  user_id: string | null;
  audit_data: Record<string, unknown>;
  teaser_unlocked: boolean;
  full_unlocked: boolean;
  unlocked_at: string | null;
  created_at: string;
}

export interface Industry {
  id: string;
  name: string;
  category: string | null;
}

// n8n webhook payloads — matches workflow-1-business-lead-discovery.json
export interface BusinessLeadSearchPayload {
  industry: string;
  location: string;
  radius: number;
  user_id: string;
}

export interface JobLeadSearchPayload {
  skills: string[];
  location: string;
  remote_status?: string;
  user_id: string;
}

export interface ResumeParserPayload {
  user_id: string;
  resume_text: string;
}

export interface AuditScanPayload {
  website_url: string;
  requester_email?: string;
  requester_name?: string;
}

export interface N8nWebhookResponse {
  success: boolean;
  leads_found?: number;
  message?: string;
}
