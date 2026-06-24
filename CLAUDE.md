# Skill Hunter — Project Instructions

## What This Is

Skill Hunter is an automated n8n-powered lead generation tool for freelancers, consultants, and digital professionals. It finds two types of opportunities:

1. **Business Contract Leads** — companies with weak online presence that could use the user's services (SEO, web design, PPC, branding, etc.)
2. **Job + Contract Leads** — active job postings that reveal hidden business needs matching the user's skills

The tool evaluates relevance before saving, scoring, or drafting outreach. No blind scraping.

---

## Tech Stack

| Layer | Tools |
|---|---|
| Frontend | Next.js, Tailwind CSS, ShadCN UI |
| Auth | Supabase Auth (Google / Apple / Email magic link) |
| Backend / Automation | n8n |
| Database | Supabase (PostgreSQL) |
| AI | Claude API (primary), OpenAI as fallback |
| Lead Data | SerpAPI or DataForSEO, Google Maps, Apify (where legal) |
| SEO Metrics | Moz / Ahrefs / Semrush API |
| Contact Enrichment | Hunter.io / Apollo / Clearbit |
| Website Audit | Google PageSpeed Insights API |
| Email Sending | Gmail API (drafts), Resend / SendGrid / Mailgun (outreach) |

---

## Core Modules

### Module A — Business Lead Hunter

Finds companies with poor digital presence.

**User search inputs:**
- Industry (dropdown — see full list in PDF)
- Location + radius
- Remote / local / hybrid
- Website quality threshold
- Domain authority range
- Negative keywords
- Services to offer
- Minimum business relevance score
- Contact availability requirement

**Industries supported:** Law Firms, MedSpas, Dental, Chiropractors, Real Estate, Mortgage, Insurance, Restaurants, Contractors, HVAC, Plumbers, Electricians, Auto Shops, Fitness Studios, Local Retail, E-commerce, Nonprofits, Consultants, Coaches, Event Venues, Music/Entertainment, Healthcare Clinics, Home Services, Custom

### Module B — Job + Contract Hunter

Searches job listings for roles matching the user's skill profile.

**Search sources (API-friendly only):**
- LinkedIn job search URLs / approved integrations
- Indeed, ZipRecruiter search URLs
- Craigslist gigs/jobs
- Company career pages
- Google Jobs where allowed
- RSS job feeds
- Apify actors (responsibly)
- SerpAPI / DataForSEO / BrightData (legally acceptable only)
- Manual CSV import

**Job categories:** SEO, Marketing, Web Development, Graphic Design, Project Management, Media, Branding, Content, Digital Strategy, PPC, Social Media, WordPress, Shopify, Client Success, Creative Ops, Marketing Ops, Agency Account Management

**Skill level filter:** Entry, Mid-Level, Technical, Management, Executive, Contract, Freelance, Remote, Hybrid, Local

---

## Skill Profile Engine

Users upload a resume (PDF, DOCX, plain text, LinkedIn profile text, portfolio URL, case study links). AI extracts:
- Core skills, tools used, industries served
- Years of experience, role titles
- Service strengths, past client types
- Portfolio highlights, preferred job types
- Services the user can offer
- Skills to avoid overstating

**Manual skill settings (JSON):**
```json
{
  "primary_skills": ["SEO", "PPC", "WordPress", "Marketing Strategy", "Branding"],
  "secondary_skills": ["Graphic Design", "Video Marketing", "Project Management"],
  "preferred_industries": ["Law Firms", "MedSpas", "Home Services", "Ecommerce"],
  "avoid_industries": ["MLM", "crypto scams", "commission only sales"],
  "preferred_locations": ["Murrieta", "Temecula", "Oceanside", "Remote"],
  "minimum_fit_score": 70,
  "tone": "professional, helpful, direct, consultative"
}
```

---

## Business Website Audit Engine

### Audit categories scored:
- **Website:** mobile friendliness, page speed, layout, design freshness, CTAs, navigation, service pages, trust signals, booking funnel
- **SEO:** domain authority, title tags, meta descriptions, schema, local SEO, blog/content, location pages, thin pages
- **Social Presence:** recency of posts, engagement, brand consistency, visuals, video, offer clarity
- **Paid Ads Potential:** PPC landing pages, conversion funnel, local keyword coverage
- **Branding/Media:** graphics quality, brand consistency, video, photography, testimonials/case studies

### Visual audit output (simple scorecard):
```
Website Presence:      42 / 100
SEO Visibility:        38 / 100
Social Presence:       27 / 100
Lead Conversion Setup: 31 / 100
Brand Trust:           45 / 100
```

Include:
- Plain-English layman summary
- "Where They Are vs. Where They Could Be" section

---

## Full Audit Gated Flow (Lead Conversion Funnel)

1. Tool sends short email with mini-audit link
2. Recipient clicks link
3. Landing page: "We found a few simple areas where your online presence may be leaving leads on the table. Enter your website to generate a deeper free audit."
4. User enters URL
5. System runs deeper audit
6. Teaser: "We found 11 improvement opportunities. Sign in to view your full audit."
7. Sign-in: Google / Apple / Email magic link
8. Full audit unlocked
9. CTA: "Want help fixing the highest-impact items first? Request a free review."

---

## Job Lead Scoring

Score each lead 0–100:

| Factor | Points |
|---|---|
| Skill Match | 30 |
| Industry Match | 15 |
| Location / Remote Match | 15 |
| Experience Level Match | 15 |
| Contact Availability | 10 |
| Pain Point Strength | 10 |
| Outreach Potential | 5 |

**Lead labels:**
- 90–100: Excellent Fit
- 75–89: Strong Fit
- 60–74: Possible Fit
- 40–59: Low Priority
- Below 40: Ignore

---

## Outreach Email Rules

- Short, helpful, no hype
- No scare tactics, no fake urgency
- Mention one specific observation
- Invite them to view a free audit
- Keep it consultative

**Business lead email template:**
```
Subject: Quick note about your website

Hi {{first_name}},

I came across {{business_name}} and noticed a few simple areas where your 
website and online presence may be able to generate more calls or inquiries.

I put together a quick visual snapshot showing where things look strong and 
where there may be room to improve.

You can view it here: {{audit_link}}

No pressure — just thought it may be useful.

Best,
{{sender_name}}
```

**Job lead email template:**
```
Subject: Helping with {{role_focus}} at {{company_name}}

Hi {{first_name}},

I saw that {{company_name}} is looking for support with {{job_focus}}.

Based on the role, it looks like you may need someone who can help with 
{{pain_point_summary}}. My background is in SEO, marketing strategy, web 
updates, branding, client communication, and project execution.

I'd be open to discussing the role, contract support, or project-based help 
if that would be useful.

Best,
{{sender_name}}
```

---

## Send Modes

| Mode | Behavior |
|---|---|
| **Manual** (default) | AI drafts only; user sends manually |
| **Approval** | AI drafts; user clicks approve; system sends |
| **Auto-Send** | Sends above score threshold; requires compliance settings + opt-out language + daily limits |

Default: **Manual Mode**

---

## Negative Keywords

**Job leads — block:**
MLM, commission only, door to door, crypto, adult, casino, gambling, unpaid internship, volunteer only, equity only, no salary, high ticket closer, life insurance only, cold calling

**Business leads — block:**
closed, out of business, franchise only, government, school district, enterprise only, no website

---

## n8n Workflow Architecture

### Workflow 1 — Business Lead Discovery
**Trigger:** Manual / Schedule / Webhook from UI

Steps: receive params → search Google Maps/SERP/directories → collect business info → filter (industry, location, negative keywords) → check website/SEO/social → score → save → generate mini-audit → draft email → save draft

### Workflow 2 — Job Lead Discovery
**Trigger:** Manual / Schedule / Webhook from UI

Steps: load skill profile → search job boards → extract listings → visit company site → find contact info → match against resume → interpret hidden pain point → score → save → generate outreach suggestion → draft email → save draft

### Workflow 3 — Audit Landing Page Scan
**Trigger:** User submits URL on landing page

Steps: receive URL → run website audit → run SEO scan → run social scan → generate teaser → ask user to sign in → unlock full report → notify internal user

### Workflow 4 — Email Draft + Send Manager
**Trigger:** New approved lead / Manual approval / Auto-send rules

Steps: load lead → load user tone/profile → generate email → check spam-risk → check compliance → save draft → if approved, send → log status → track opens/clicks/replies

### Workflow 5 — Follow-Up Manager
**Trigger:** No reply after X days / Link clicked / Audit completed / Full report unlocked

Steps: check engagement → choose follow-up type → draft follow-up → save for review → log activity

---

## Database Schema (Supabase)

### business_leads
`id, business_name, industry, website_url, location, phone, email, contact_name, social_links, domain_authority, website_score, seo_score, social_score, lead_score, pain_point_summary, recommended_services, audit_url, status, created_at, updated_at`

### job_leads
`id, company_name, job_title, job_url, source, website_url, location, remote_status, salary, contact_name, contact_email, fit_score, pain_point_summary, recommended_angle, suggested_services, draft_email_id, status, created_at, updated_at`

### skill_profiles
`id, user_id, resume_text, primary_skills, secondary_skills, preferred_industries, negative_keywords, preferred_locations, skill_level, tone, created_at, updated_at`

### Other tables
`users, resumes, audits, email_drafts, outreach_logs, industries, negative_keywords, settings`

---

## AI Prompt Guidelines

### Business Lead Analysis Prompt
```
You are Skill Hunter's business opportunity analyst.

Analyze this company based on its website, SEO signals, social presence, and 
available public information.

Your job is not to insult the business. Your job is to identify simple, 
practical opportunities where the business may improve lead generation, trust, 
visibility, or conversion.

Return:
1. Plain-English summary
2. Biggest issue
3. Best opportunity
4. Recommended services
5. Website score
6. SEO score
7. Social score
8. Overall lead score
9. Short outreach angle
10. One-sentence audit teaser

Avoid hype. Avoid fear-based language. Be useful, calm, and consultative.
```

### Job Lead Analysis Prompt
```
You are Skill Hunter's job and contract opportunity analyst.

Compare this job listing against the user's skill profile.

Identify:
1. Fit score
2. Skill matches
3. Skill gaps
4. Hidden business pain point
5. Whether this is better as a job, freelance pitch, or contract support opportunity
6. Best outreach angle
7. Suggested services the user can offer
8. Professional draft email

Be honest. Do not overstate the user's qualifications. Focus on where the 
user can provide real value.
```

---

## Dashboard

### Main Dashboard metrics:
Total business leads, total job leads, new leads today, draft emails ready, audits clicked, full audits unlocked, replies received, top industries, highest-scoring leads

### Lead Pipeline statuses:
New → Reviewed → Draft Created → Sent → Clicked → Audit Completed → Replied → Follow-Up Needed → Won / Rejected

---

## Compliance Rules

- Respect website terms of service where possible
- Use public business contact data only
- Include opt-out language in all automated campaigns
- Enforce daily send limits
- Never auto-send without explicit user opt-in
- Keep logs of all outreach
- Never claim "we audited your site in detail" if only a light scan was done
- Never imply a partnership or endorsement
- Never scrape private or sensitive data

---

## MVP Build Order

### Phase 1 — Core MVP
1. User skill profile
2. Resume upload
3. Business lead search
4. Job lead search
5. Lead scoring
6. Mini audit generator
7. Email draft generator
8. Manual review dashboard

### Phase 2 — Audit Funnel
1. Public audit landing page
2. URL scan
3. Teaser report
4. Google / Apple / Email login
5. Full report unlock
6. Lead engagement tracking

### Phase 3 — Automation
1. Scheduled lead searches
2. Follow-up drafts
3. Approval mode
4. Auto-send mode
5. Open/click/reply tracking
6. Industry-specific templates

---

## Final Goal

Skill Hunter is a personal opportunity engine. It should:
- Find companies with visible problems
- Find job postings that reveal hidden business needs
- Match those opportunities to the user's real skills
- Score and prioritize leads
- Explain the opportunity in plain English
- Draft helpful, professional outreach
- Drive prospects into a simple audit funnel
- Help the user win jobs, contracts, and consulting work faster
