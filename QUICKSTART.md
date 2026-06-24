# Skill Hunter — Quick Start Guide

**Goal:** Get your first business lead from a Google Maps search within 30 minutes.

---

## Step 1: Create Supabase Project (5 minutes)

1. Go to https://supabase.com/dashboard
2. Click **New Project**
3. Name it: `skill-hunter`
4. Set a database password (save it somewhere)
5. Choose region: **US West** (closest to you)
6. Wait for project to provision (~2 minutes)

### Apply Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy contents of `/database/schema.sql` from this repo
4. Paste into SQL Editor
5. Click **Run**
6. Confirm tables created: Go to **Table Editor** and verify you see:
   - `user_profiles`
   - `skill_profiles`
   - `business_leads`
   - `job_leads`
   - `email_drafts`
   - `outreach_logs`
   - `audits`
   - `settings`
   - `industries`
   - `negative_keywords`

### Get API Keys

1. In Supabase dashboard, go to **Settings → API**
2. Copy these values:
   - **Project URL** (starts with `https://...supabase.co`)
   - **anon public** key
   - **service_role** secret key (click "Reveal" to see it)

**Save these somewhere safe — you'll need them in Step 2.**

---

## Step 2: Get OpenAI API Key (3 minutes)

1. Go to https://platform.openai.com/api-keys
2. Click **Create new secret key**
3. Name it: `skill-hunter`
4. Copy the key (starts with `sk-`)
5. **IMPORTANT:** Save it now — you can't see it again

**Estimated cost:** ~$0.02 per business lead analyzed (GPT-4o is cheap)

---

## Step 3: Get Resend API Key (2 minutes)

1. Go to https://resend.com/api-keys
2. Sign up (free tier: 3,000 emails/month)
3. Click **Create API Key**
4. Name it: `skill-hunter`
5. Copy the key (starts with `re_`)

---

## Step 4: Get Google PageSpeed API Key (3 minutes)

1. Go to https://console.cloud.google.com/
2. Create a new project (if you don't have one)
3. Go to **APIs & Services → Library**
4. Search for **PageSpeed Insights API**
5. Click **Enable**
6. Go to **APIs & Services → Credentials**
7. Click **Create Credentials → API Key**
8. Copy the key

---

## Step 5: Configure n8n (5 minutes)

### Access n8n

1. Open browser: `http://85.31.232.102:5678`
2. Log in:
   - Username: `admin`
   - Password: `SkillHunter2026!`

### Add Environment Variables

1. In n8n, click your profile icon (top-right)
2. Go to **Settings**
3. Click **Environments**
4. Add these variables:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here
OPENAI_API_KEY=sk-your-key-here
RESEND_API_KEY=re_your-key-here
PAGESPEED_API_KEY=your-google-api-key-here
```

5. Click **Save**

---

## Step 6: Add Supabase Credentials in n8n (2 minutes)

1. In n8n, click **Credentials** (left sidebar)
2. Click **Add Credential**
3. Search for **Supabase**
4. Fill in:
   - **Credential Name:** `Supabase account`
   - **Host:** Your Supabase project URL (without `https://`)
   - **Service Role Secret:** Your service_role key from Step 1
5. Click **Save**

---

## Step 7: Import Workflow 1 (2 minutes)

1. In n8n, click **Workflows** (left sidebar)
2. Click **Add Workflow → Import from File**
3. Select `/n8n-workflows/workflow-1-business-lead-discovery.json` from this repo
4. Click **Import**
5. The workflow should appear with all nodes connected

### Fix Credential References

1. Click on the **Load User Profile (Supabase)** node
2. In the right panel, under **Credentials**, select: `Supabase account`
3. Click on the **Save to Supabase** node
4. Under **Credentials**, select: `Supabase account`
5. Click **Save** (top-right of workflow)

---

## Step 8: Create Your Skill Profile (3 minutes)

Before running a search, you need a skill profile in Supabase.

### Option A: Manual Insert (Quick)

1. Go to Supabase dashboard → **Table Editor**
2. Click **user_profiles** → **Insert Row**
3. Fill in:
   - **id:** Generate a UUID here: https://www.uuidgenerator.net/
   - **email:** `cory@imperialmediadesign.com`
   - **full_name:** `Robert Austin`
4. Click **Save**
5. Copy the UUID you generated
6. Click **skill_profiles** → **Insert Row**
7. Fill in:
   - **user_id:** Paste the UUID from step 5
   - **primary_skills:** `["SEO", "Marketing", "WordPress", "Branding", "PPC"]`
   - **secondary_skills:** `["Graphic Design", "Project Management"]`
   - **preferred_industries:** `["Law Firms", "MedSpas", "Home Services"]`
   - **avoid_industries:** `["MLM", "crypto"]`
   - **preferred_locations:** `["Murrieta", "Temecula", "Remote"]`
   - **skill_level:** `expert`
8. Click **Save**

### Option B: Upload Resume (Later Phase)

This will be built into the frontend in Phase 2.

---

## Step 9: Test Your First Business Lead Search (5 minutes)

1. In n8n, open **Workflow 1: Business Lead Discovery**
2. Click **Execute Workflow** (top-right)
3. In the **Webhook Trigger** test panel, paste this JSON:

```json
{
  "industry": "Law Firms",
  "location": "Los Angeles, CA",
  "radius": 10,
  "user_id": "YOUR-UUID-FROM-STEP-8"
}
```

4. Replace `YOUR-UUID-FROM-STEP-8` with your actual UUID
5. Click **Execute**
6. Watch the workflow run through each node
7. If successful, you'll see:
   - Google Maps results
   - PageSpeed scores
   - AI analysis
   - Leads saved to Supabase

### Check Results

1. Go to Supabase dashboard → **Table Editor**
2. Click **business_leads**
3. You should see 1-10 new law firms with scores, pain points, and recommendations

---

## Step 10: Review Your Leads (2 minutes)

In Supabase **business_leads** table, look at:
- **business_name**
- **website_url**
- **lead_score** (0-100)
- **pain_point_summary** (AI analysis)
- **recommended_services** (what to offer them)

**High-value leads:**
- `lead_score` > 70
- Clear pain points
- Weak website/SEO scores

---

## What's Next?

You now have:
- ✅ n8n workflow discovering business leads
- ✅ AI analyzing each business
- ✅ Leads scored and stored in Supabase

**Next steps:**
1. Build email draft generation (Workflow 4)
2. Build job lead discovery (Workflow 2)
3. Build basic frontend dashboard to review leads
4. Build public audit landing page (Workflow 3)

---

## Troubleshooting

### n8n won't start
```bash
ssh root@85.31.232.102
systemctl status n8n
journalctl -u n8n -f
```

### Workflow execution fails
1. Check n8n execution logs (click on the failed node)
2. Verify environment variables are set correctly
3. Verify Supabase credentials are correct

### No results from Google Maps search
1. Verify SerpAPI key is set (or use alternative search method)
2. Check if search query is too specific
3. Try broader location (e.g., "California" instead of "Murrieta, CA")

### AI analysis returns empty results
1. Verify OpenAI API key is correct
2. Check API key has credits
3. Look at HTTP Request node response

---

## Cost Estimate (Per Month)

Assuming 100 business leads searched per month:

- **Supabase:** Free (up to 500MB database)
- **OpenAI:** ~$2 (100 leads × $0.02 per lead)
- **Resend:** Free (up to 3,000 emails/month)
- **PageSpeed API:** Free (25,000 requests/day)
- **SerpAPI (optional):** $75/month (5,000 searches) or free alternative
- **Hostinger VPS:** (already have this)

**Total:** ~$2-77/month depending on search volume and SerpAPI usage

---

## Need Help?

- GitHub Issues: https://github.com/Defiance80/Skill-Hunter/issues
- Check `/docs/SETUP.md` for detailed setup
- Check `/docs/WORKFLOWS.md` for workflow architecture
- Check `/docs/AI-PROMPTS.md` for prompt templates
