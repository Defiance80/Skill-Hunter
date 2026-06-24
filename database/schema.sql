-- Skill Hunter Database Schema
-- Supabase PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (managed by Supabase Auth, but we extend it)
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skill Profiles
CREATE TABLE public.skill_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  resume_text TEXT,
  resume_url TEXT,
  portfolio_url TEXT,
  linkedin_url TEXT,
  primary_skills TEXT[], -- Array of skills
  secondary_skills TEXT[],
  preferred_industries TEXT[],
  avoid_industries TEXT[],
  preferred_locations TEXT[],
  skill_level TEXT, -- 'entry', 'mid', 'senior', 'expert'
  tone TEXT DEFAULT 'professional, helpful, direct, consultative',
  minimum_fit_score INTEGER DEFAULT 70,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Industries lookup
CREATE TABLE public.industries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Negative Keywords
CREATE TABLE public.negative_keywords (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  type TEXT DEFAULT 'business', -- 'business' or 'job'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Business Leads
CREATE TABLE public.business_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  industry TEXT,
  website_url TEXT,
  location TEXT,
  phone TEXT,
  email TEXT,
  contact_name TEXT,
  social_links JSONB, -- {facebook, instagram, linkedin, twitter}
  domain_authority INTEGER,
  website_score INTEGER, -- 0-100
  seo_score INTEGER, -- 0-100
  social_score INTEGER, -- 0-100
  brand_score INTEGER, -- 0-100
  lead_score INTEGER, -- 0-100 overall
  pain_point_summary TEXT,
  recommended_services TEXT[],
  audit_data JSONB, -- Full audit results
  audit_url TEXT,
  status TEXT DEFAULT 'new', -- new, reviewed, draft_created, sent, clicked, audit_completed, replied, won, rejected
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job Leads
CREATE TABLE public.job_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  job_url TEXT,
  source TEXT, -- 'linkedin', 'indeed', 'ziprecruiter', etc.
  website_url TEXT,
  location TEXT,
  remote_status TEXT, -- 'remote', 'hybrid', 'onsite'
  salary_range TEXT,
  contact_name TEXT,
  contact_email TEXT,
  skills_requested TEXT[],
  fit_score INTEGER, -- 0-100
  skill_match_score INTEGER,
  industry_match_score INTEGER,
  location_match_score INTEGER,
  pain_point_summary TEXT,
  recommended_angle TEXT,
  suggested_services TEXT[],
  opportunity_type TEXT, -- 'job', 'contract', 'freelance', 'consulting'
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email Drafts
CREATE TABLE public.email_drafts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  lead_type TEXT NOT NULL, -- 'business' or 'job'
  lead_id UUID NOT NULL, -- References business_leads.id or job_leads.id
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  tone TEXT,
  status TEXT DEFAULT 'draft', -- draft, approved, sent
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Outreach Logs
CREATE TABLE public.outreach_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  email_draft_id UUID REFERENCES public.email_drafts(id) ON DELETE SET NULL,
  lead_type TEXT NOT NULL,
  lead_id UUID NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  replied_at TIMESTAMPTZ,
  reply_text TEXT,
  status TEXT DEFAULT 'sent', -- sent, opened, clicked, replied, bounced
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audits (for public landing page leads)
CREATE TABLE public.audits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  website_url TEXT NOT NULL,
  requester_email TEXT,
  requester_name TEXT,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL, -- NULL if they haven't signed in yet
  audit_data JSONB NOT NULL,
  teaser_unlocked BOOLEAN DEFAULT FALSE,
  full_unlocked BOOLEAN DEFAULT FALSE,
  unlocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings (per-user configuration)
CREATE TABLE public.settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  send_mode TEXT DEFAULT 'manual', -- manual, approval, auto
  auto_send_threshold INTEGER DEFAULT 80, -- Only auto-send leads above this score
  daily_send_limit INTEGER DEFAULT 50,
  enable_follow_ups BOOLEAN DEFAULT TRUE,
  follow_up_delay_days INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_business_leads_user ON public.business_leads(user_id);
CREATE INDEX idx_business_leads_status ON public.business_leads(status);
CREATE INDEX idx_business_leads_score ON public.business_leads(lead_score DESC);
CREATE INDEX idx_job_leads_user ON public.job_leads(user_id);
CREATE INDEX idx_job_leads_status ON public.job_leads(status);
CREATE INDEX idx_job_leads_score ON public.job_leads(fit_score DESC);
CREATE INDEX idx_email_drafts_lead ON public.email_drafts(lead_type, lead_id);
CREATE INDEX idx_outreach_logs_lead ON public.outreach_logs(lead_type, lead_id);

-- Row Level Security (RLS) policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outreach_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access their own data
CREATE POLICY "Users can view own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own skill profile" ON public.skill_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own business leads" ON public.business_leads FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own job leads" ON public.job_leads FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own email drafts" ON public.email_drafts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own outreach logs" ON public.outreach_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own audits" ON public.audits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own settings" ON public.settings FOR ALL USING (auth.uid() = user_id);

-- Public audits can be created by anyone (for landing page)
CREATE POLICY "Anyone can create audits" ON public.audits FOR INSERT WITH CHECK (true);

-- Seed default industries
INSERT INTO public.industries (name, category) VALUES
  ('Law Firms', 'Professional Services'),
  ('MedSpas', 'Healthcare'),
  ('Dental Practices', 'Healthcare'),
  ('Chiropractors', 'Healthcare'),
  ('Real Estate Agents', 'Real Estate'),
  ('Mortgage Brokers', 'Finance'),
  ('Insurance Agencies', 'Finance'),
  ('Restaurants', 'Food & Beverage'),
  ('Contractors', 'Home Services'),
  ('HVAC Companies', 'Home Services'),
  ('Plumbers', 'Home Services'),
  ('Electricians', 'Home Services'),
  ('Auto Shops', 'Automotive'),
  ('Fitness Studios', 'Health & Fitness'),
  ('Local Retail', 'Retail'),
  ('E-commerce Brands', 'E-commerce'),
  ('Nonprofits', 'Nonprofit'),
  ('Consultants', 'Professional Services'),
  ('Coaches', 'Professional Services'),
  ('Event Venues', 'Events'),
  ('Music / Entertainment', 'Entertainment'),
  ('Healthcare Clinics', 'Healthcare'),
  ('Home Services', 'Home Services')
ON CONFLICT (name) DO NOTHING;
