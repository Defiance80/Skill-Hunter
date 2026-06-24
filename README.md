# Skill Hunter

Automated job + contract lead generation tool powered by n8n + AI.

## Architecture

- **Frontend:** Next.js (minimal dashboard for lead review + skill profile management)
- **Database:** Supabase (PostgreSQL + Auth)
- **Automation:** n8n (self-hosted on Hostinger VPS)
- **Email:** Resend
- **AI:** OpenAI/Claude API

## Modules

1. **Business Lead Hunter** — Finds companies with weak digital presence
2. **Job Lead Hunter** — Finds job/contract opportunities matching skill profile
3. **Audit Engine** — Generates website/SEO/social audits
4. **Email Drafter** — AI-powered outreach emails
5. **Landing Page Funnel** — Public audit tool for lead capture

## Setup

See `/docs/SETUP.md`

## Workflow Architecture

See `/docs/WORKFLOWS.md`
