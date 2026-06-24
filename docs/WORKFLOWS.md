# n8n Workflow Architecture

## Overview

Skill Hunter uses 5 core n8n workflows running on Hostinger VPS.

All workflows connect to Supabase for data storage and OpenAI/Claude for AI analysis.

---

## Workflow 1: Business Lead Discovery

**Trigger:** Manual / Scheduled / Webhook

**Flow:**
1. **Webhook/Manual Trigger** — Receives search parameters (industry, location, radius)
2. **Load User Profile** — Get skill profile, negative keywords, preferences
3. **Search Google Maps/SERP** — Find businesses matching criteria
4. **Filter by Negative Keywords** — Remove MLM, closed businesses, etc.
5. **Extract Contact Info** — Business name, website, phone, email, social links
6. **Website Quality Check** — PageSpeed Insights API + basic crawl
7. **SEO Score** — Check domain authority, meta tags, schema, local SEO
8. **Social Presence Check** — Scrape recent posts, engagement, branding
9. **AI Analysis** — GPT/Claude analyzes business, identifies pain points
10. **Score Lead** — Calculate website_score, seo_score, social_score, lead_score
11. **Save to Supabase** — Insert into `business_leads` table
12. **Generate Mini Audit** — Create visual scorecard
13. **Draft Email** — AI writes consultative outreach email
14. **Save Draft** — Insert into `email_drafts` table

**Outputs:**
- New business lead in database
- Mini audit preview
- Draft email ready for review

---

## Workflow 2: Job Lead Discovery

**Trigger:** Manual / Scheduled / Webhook

**Flow:**
1. **Webhook/Manual Trigger** — Receives search parameters (skills, location, job type)
2. **Load Skill Profile** — Get resume, skills, preferences, negative keywords
3. **Search Job Boards** — LinkedIn, Indeed, ZipRecruiter, Craigslist
4. **Extract Job Listings** — Title, company, URL, description, salary
5. **Filter by Negative Keywords** — Remove MLM, commission-only, crypto scams
6. **Visit Company Website** — Extract company info, social links
7. **Find Contact Info** — Hunter.io or Apollo for decision-maker email
8. **AI Job Analysis** — Match job against skill profile, identify pain points
9. **Score Lead** — Calculate fit_score, skill_match, industry_match
10. **Determine Opportunity Type** — Job, contract, freelance, consulting
11. **Save to Supabase** — Insert into `job_leads` table
12. **Draft Outreach Email** — AI writes professional pitch
13. **Save Draft** — Insert into `email_drafts` table

**Outputs:**
- New job lead in database
- Fit score + pain point analysis
- Draft email ready for review

---

## Workflow 3: Audit Landing Page Flow

**Trigger:** Public webhook (from Next.js landing page)

**Flow:**
1. **Webhook Receives URL** — User submits website for audit
2. **Run Website Audit** — PageSpeed, mobile-friendliness, broken links
3. **Run SEO Scan** — Meta tags, schema, domain authority, local SEO
4. **Run Social Scan** — Find social profiles, check activity
5. **AI Analysis** — Generate plain-English summary of issues/opportunities
6. **Generate Teaser Results** — "We found 11 improvement opportunities"
7. **Save Audit** — Insert into `audits` table (teaser_unlocked = true)
8. **Return Teaser** — Show limited results, prompt for sign-in
9. **Wait for Auth Webhook** — User signs in via Next.js frontend
10. **Unlock Full Report** — Update audit (full_unlocked = true)
11. **Notify User** — Email with full audit link
12. **Notify Admin** — Internal notification of new engaged lead

**Outputs:**
- Teaser audit saved
- Email capture opportunity
- Full audit unlocked after sign-in

---

## Workflow 4: Email Draft + Send Manager

**Trigger:** New approved lead / Manual approval / Auto-send rules

**Flow:**
1. **Load Lead** — Fetch business_lead or job_lead
2. **Load User Tone/Profile** — Get preferred tone, skill profile
3. **AI Email Generation** — GPT/Claude writes email based on lead analysis
4. **Spam Risk Check** — Scan for spam trigger words, hype language
5. **Compliance Check** — Ensure opt-out language, no false claims
6. **Save Draft** — Insert into `email_drafts` table
7. **Check Send Mode** — Manual, approval, or auto-send
8. **If Approved → Send Email** — Via Resend/SendGrid
9. **Log Outreach** — Insert into `outreach_logs` table
10. **Track Engagement** — Update log on opens/clicks/replies

**Outputs:**
- Email draft created
- Email sent (if approved)
- Outreach logged

---

## Workflow 5: Follow-Up Manager

**Trigger:** Scheduled (daily check for follow-up opportunities)

**Flow:**
1. **Query Leads Needing Follow-Up** — Sent but no reply after X days
2. **Check Engagement Signals** — Link clicked, audit completed, etc.
3. **AI Follow-Up Generator** — Draft contextual follow-up based on engagement
4. **Check Follow-Up Rules** — User settings for follow-up delay, limits
5. **Save Follow-Up Draft** — Insert into `email_drafts` table
6. **If Auto-Follow-Up Enabled → Send** — Via Resend/SendGrid
7. **Log Follow-Up** — Update `outreach_logs` table

**Outputs:**
- Follow-up emails drafted
- Follow-ups sent (if enabled)

---

## Workflow 6: Resume Parser (One-Time)

**Trigger:** Manual upload from frontend

**Flow:**
1. **Receive Resume File** — PDF, DOCX, or text
2. **Extract Text** — PDF parser or DOCX parser
3. **AI Skill Extraction** — GPT/Claude identifies skills, industries, roles
4. **Save Skill Profile** — Insert into `skill_profiles` table
5. **Return Extracted Data** — Show in frontend for user to edit

**Outputs:**
- Skill profile populated
- User can review + edit

---

## n8n Environment Variables

Set these in n8n settings or `.env` file:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
OPENAI_API_KEY=sk-...
SERP_API_KEY=your-serpapi-key (optional)
HUNTER_API_KEY=your-hunter-key (optional)
RESEND_API_KEY=re_... 
PAGESPEED_API_KEY=your-google-api-key
```

---

## Workflow File Naming Convention

Save n8n workflow exports as:

- `workflow-1-business-lead-discovery.json`
- `workflow-2-job-lead-discovery.json`
- `workflow-3-audit-landing-page.json`
- `workflow-4-email-manager.json`
- `workflow-5-follow-up-manager.json`
- `workflow-6-resume-parser.json`

Store in `/n8n-workflows/` directory.

---

## Testing Workflow

1. Start with **Workflow 1 (Business Lead Discovery)** — test with small search
2. Verify data saves to Supabase
3. Check AI analysis quality
4. Test email draft generation
5. Move to Workflow 2, 3, etc.

---

## Deployment Checklist

- [ ] n8n installed on Hostinger VPS
- [ ] Supabase project created
- [ ] Database schema applied
- [ ] Environment variables set in n8n
- [ ] Workflow 1 imported and tested
- [ ] Workflow 2 imported and tested
- [ ] Workflow 3 imported and tested
- [ ] Workflows 4, 5, 6 imported
- [ ] Webhooks configured
- [ ] API keys validated
- [ ] Email sending tested
