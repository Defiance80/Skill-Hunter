# Skill Hunter — Project Status

**Last Updated:** 2026-06-24

---

## ✅ Completed

### Infrastructure
- [x] GitHub repo created: `Defiance80/Skill-Hunter`
- [x] n8n installed on Hostinger VPS (85.31.232.102)
- [x] n8n running as systemd service on port 5678
- [x] Basic auth enabled (user: admin, password: SkillHunter2026!)

### Documentation
- [x] Database schema designed (`/database/schema.sql`)
- [x] Setup guide created (`/docs/SETUP.md`)
- [x] Workflow architecture documented (`/docs/WORKFLOWS.md`)
- [x] AI prompt templates documented (`/docs/AI-PROMPTS.md`)

### Workflows
- [x] Workflow 1 template created (Business Lead Discovery)

---

## 🚧 Next Steps (Priority Order)

### 1. Supabase Setup
- [ ] Create Supabase project
- [ ] Apply database schema
- [ ] Get API keys (URL, anon key, service key)
- [ ] Configure Row Level Security policies

### 2. n8n Configuration
- [ ] Access n8n UI: `http://85.31.232.102:5678`
- [ ] Log in (admin / SkillHunter2026!)
- [ ] Add environment variables:
  - [ ] SUPABASE_URL
  - [ ] SUPABASE_ANON_KEY
  - [ ] SUPABASE_SERVICE_KEY
  - [ ] OPENAI_API_KEY
  - [ ] RESEND_API_KEY
  - [ ] PAGESPEED_API_KEY
  - [ ] SERP_API_KEY (optional)
  - [ ] HUNTER_API_KEY (optional)

### 3. API Keys to Obtain
- [ ] OpenAI API key: https://platform.openai.com/api-keys
- [ ] Resend API key: https://resend.com/api-keys
- [ ] Google PageSpeed Insights: https://console.cloud.google.com/
- [ ] SerpAPI (optional): https://serpapi.com/
- [ ] Hunter.io (optional): https://hunter.io/

### 4. n8n Workflow Build
- [ ] Import Workflow 1 (Business Lead Discovery)
- [ ] Add Supabase credentials in n8n
- [ ] Test business lead search
- [ ] Build Workflow 2 (Job Lead Discovery)
- [ ] Build Workflow 3 (Audit Landing Page)
- [ ] Build Workflow 4 (Email Manager)
- [ ] Build Workflow 5 (Follow-Up Manager)
- [ ] Build Workflow 6 (Resume Parser)

### 5. Frontend (Later Phase)
- [ ] Create Next.js app in `/frontend`
- [ ] Set up Supabase auth (Google/Apple/email)
- [ ] Build skill profile page
- [ ] Build resume upload
- [ ] Build leads dashboard
- [ ] Build email review interface
- [ ] Deploy to Vercel

---

## 🔧 Access Information

**n8n UI:**
- URL: `http://85.31.232.102:5678`
- Username: `admin`
- Password: `SkillHunter2026!`

**VPS:**
- IP: `85.31.232.102`
- SSH: `ssh root@85.31.232.102`

**n8n Service:**
- Start: `systemctl start n8n`
- Stop: `systemctl stop n8n`
- Restart: `systemctl restart n8n`
- Status: `systemctl status n8n`
- Logs: `journalctl -u n8n -f`

**GitHub:**
- Repo: https://github.com/Defiance80/Skill-Hunter

---

## 📋 Current Build Phase

**Phase 1: Core Infrastructure**
- Database schema ✅
- n8n installation ✅
- Documentation ✅
- Workflow templates 🚧

**Next Milestone:** Supabase setup + n8n configuration + test first workflow

---

## 🎯 MVP Scope

The MVP will focus on:
1. Business lead discovery (Google Maps search + AI audit)
2. Manual email review (no auto-send yet)
3. Minimal frontend (just for viewing leads + uploading resume)

**What's NOT in MVP:**
- Job lead discovery (Phase 2)
- Auto-send mode (Phase 3)
- Follow-up automation (Phase 3)
- Public audit landing page (Phase 2)

---

## 📝 Notes

- This is a service-focused tool (primarily for Robert's use)
- Frontend can be very basic — functional over flashy
- Focus on n8n workflows and AI quality first
- Frontend polish can come later

---

## 🚀 To Resume Work

1. Create Supabase project
2. Run `/database/schema.sql` in Supabase SQL editor
3. Get API keys (OpenAI, Resend, PageSpeed)
4. Access n8n UI and configure environment variables
5. Import Workflow 1 and test business lead search
