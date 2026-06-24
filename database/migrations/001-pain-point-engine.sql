-- Migration 001: Pain Point Detection Engine
-- Run this in Supabase SQL Editor: Dashboard → SQL Editor → New query

ALTER TABLE public.job_leads
  ADD COLUMN IF NOT EXISTS opportunity_scores JSONB,
  ADD COLUMN IF NOT EXISTS opportunity_classification TEXT;

-- Index for sorting by classification
CREATE INDEX IF NOT EXISTS idx_job_leads_classification
  ON public.job_leads(opportunity_classification);

-- Add a comment explaining the schema
COMMENT ON COLUMN public.job_leads.opportunity_scores IS
  'JSON: {employment, consulting, agency, automation, saas} each 0-100';
COMMENT ON COLUMN public.job_leads.opportunity_classification IS
  'Green=employment only, Yellow=employment+consulting, Red=strong service lead, Gold=high-value immediate outreach';
