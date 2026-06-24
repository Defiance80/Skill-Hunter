# Skill Hunter Setup Guide

## Prerequisites

- Hostinger VPS (for n8n)
- Supabase account (free tier works)
- Vercel account (free tier works)
- Resend account (free tier works)
- OpenAI or Anthropic API key

## Step 1: Supabase Setup

1. Create new Supabase project: https://supabase.com/dashboard
2. Go to **SQL Editor**
3. Copy contents of `/database/schema.sql`
4. Run the SQL to create all tables
5. Go to **Settings → API** and copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key

## Step 2: n8n Setup (Hostinger VPS)

n8n is installed globally at: `/usr/local/lib/node_modules/n8n`

### Start n8n as a service

```bash
ssh root@85.31.232.102

# Create n8n service user
useradd -m -s /bin/bash n8n

# Create n8n data directory
mkdir -p /home/n8n/.n8n
chown -R n8n:n8n /home/n8n/.n8n

# Create systemd service
cat > /etc/systemd/system/n8n.service << 'EOF'
[Unit]
Description=n8n - Workflow Automation
After=network.target

[Service]
Type=simple
User=n8n
WorkingDirectory=/home/n8n
Environment="N8N_BASIC_AUTH_ACTIVE=true"
Environment="N8N_BASIC_AUTH_USER=admin"
Environment="N8N_BASIC_AUTH_PASSWORD=YourSecurePassword123"
Environment="N8N_HOST=0.0.0.0"
Environment="N8N_PORT=5678"
Environment="N8N_PROTOCOL=http"
Environment="WEBHOOK_URL=http://85.31.232.102:5678/"
ExecStart=/usr/local/bin/n8n
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

# Start n8n
systemctl daemon-reload
systemctl enable n8n
systemctl start n8n
systemctl status n8n
```

### Access n8n

Open browser: `http://85.31.232.102:5678`

Login with credentials from service file.

### Configure n8n Environment Variables

In n8n UI:
1. Go to **Settings → Environments**
2. Add these variables:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
OPENAI_API_KEY=sk-...
RESEND_API_KEY=re_...
PAGESPEED_API_KEY=your-google-pagespeed-key
```

Optional (if you use them):
```
SERP_API_KEY=your-serpapi-key
HUNTER_API_KEY=your-hunter-key
```

## Step 3: Get API Keys

### OpenAI
1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Copy key (starts with `sk-`)

### Resend (Email)
1. Go to https://resend.com/api-keys
2. Create new API key
3. Copy key (starts with `re_`)

### Google PageSpeed Insights
1. Go to https://console.cloud.google.com/
2. Enable **PageSpeed Insights API**
3. Create credentials → API key
4. Copy key

### SerpAPI (Optional - for Google Maps/SERP scraping)
1. Go to https://serpapi.com/
2. Sign up for free tier
3. Copy API key from dashboard

### Hunter.io (Optional - for email finding)
1. Go to https://hunter.io/
2. Sign up for free tier (50 searches/month)
3. Copy API key from dashboard

## Step 4: Frontend Setup (Next.js + Vercel)

```bash
cd /root/.openclaw/workspace/skill-hunter/frontend

# Create Next.js app
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir

# Install dependencies
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install lucide-react
npm install zod react-hook-form @hookform/resolvers

# Set up environment variables
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
N8N_WEBHOOK_URL=http://85.31.232.102:5678/webhook/
EOF
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd /root/.openclaw/workspace/skill-hunter/frontend
vercel --prod
```

Or push to GitHub and connect via Vercel dashboard.

## Step 5: Import n8n Workflows

1. Open n8n: `http://85.31.232.102:5678`
2. Click **Workflows → Import from File**
3. Import each workflow from `/n8n-workflows/` directory
4. Activate each workflow
5. Test webhooks

## Step 6: Test End-to-End

### Test Business Lead Discovery
1. Go to n8n
2. Open **Workflow 1: Business Lead Discovery**
3. Click **Execute Workflow**
4. Enter test parameters:
   - Industry: "Law Firms"
   - Location: "Los Angeles, CA"
   - Radius: 10
5. Check Supabase `business_leads` table for results

### Test Job Lead Discovery
1. Open **Workflow 2: Job Lead Discovery**
2. Execute with test parameters:
   - Skills: ["SEO", "Marketing"]
   - Location: "Remote"
3. Check Supabase `job_leads` table

### Test Frontend
1. Go to Vercel URL
2. Sign in with Google/email
3. Upload resume
4. View leads dashboard

## Step 7: Production Checklist

- [ ] Supabase project created
- [ ] Database schema applied
- [ ] n8n running on VPS (systemd service)
- [ ] All API keys configured in n8n
- [ ] Workflows imported and activated
- [ ] Frontend deployed to Vercel
- [ ] Test business lead search
- [ ] Test job lead search
- [ ] Test email draft generation
- [ ] Test audit landing page
- [ ] Set up CloudPanel reverse proxy for n8n (optional, for HTTPS)

## Reverse Proxy for n8n (Optional - for HTTPS + Custom Domain)

If you want `https://n8n.yoursite.com` instead of `http://85.31.232.102:5678`:

1. Add DNS A record: `n8n.yoursite.com` → `85.31.232.102`
2. In CloudPanel, create new site: `n8n.yoursite.com`
3. Set reverse proxy to `http://localhost:5678`
4. Enable SSL certificate

## Troubleshooting

### n8n won't start
```bash
ssh root@85.31.232.102
journalctl -u n8n -f
```

### Workflow errors
Check n8n execution logs in UI

### Supabase connection fails
Verify API keys in n8n environment variables

### Email sending fails
Check Resend API key, verify sender domain

---

## Next Steps

See `/docs/WORKFLOWS.md` for workflow architecture details.

Build order:
1. Set up Supabase
2. Install n8n on VPS
3. Import Workflow 1 (Business Lead Discovery)
4. Test business lead search
5. Build minimal frontend dashboard
6. Import remaining workflows
