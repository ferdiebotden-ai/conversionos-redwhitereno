# Deployment Guide

Step-by-step guide for deploying the Lead-to-Quote Engine to production.

---

## Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All tests passing (`npm run test && npm run test:e2e`)
- [ ] Build succeeds (`npm run build`)
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Domain name decided
- [ ] Email service configured

---

## Step 1: Database Setup

### 1.1 Verify Supabase Project

1. Log into [Supabase Dashboard](https://supabase.com/dashboard)
2. Confirm project is in **Canada (Central)** region
3. Note the project URL and API keys

### 1.2 Run Migrations

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref bwvrtypzcvuojfsyiwch

# Push migrations to production
supabase db push
```

### 1.3 Set Up Admin Role Function

In Supabase SQL Editor, run:

```sql
-- Enable admin role management
CREATE OR REPLACE FUNCTION set_admin_role(user_email TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data = jsonb_set(
    COALESCE(raw_app_meta_data, '{}'::jsonb),
    '{role}',
    '"admin"'
  )
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set your admin email
SELECT set_admin_role('your-admin-email@example.com');
```

### 1.4 Configure RLS Policies

Verify Row Level Security is enabled on all tables:

```sql
-- Check RLS status
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Should show 't' (true) for: leads, quote_drafts, chat_sessions, audit_log
```

---

## Step 2: Vercel Deployment

### 2.1 Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Select the `lead_quote_engine_v2` directory

### 2.2 Configure Build Settings

| Setting | Value |
|---------|-------|
| Framework Preset | Next.js |
| Root Directory | `lead_quote_engine_v2` (if in monorepo) |
| Build Command | `npm run build` |
| Output Directory | `.next` |
| Install Command | `npm install` |

### 2.3 Add Environment Variables

In Vercel project settings, add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://bwvrtypzcvuojfsyiwch.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
OPENAI_API_KEY=sk-...
GOOGLE_AI_API_KEY=AIza...
RESEND_API_KEY=re_...
```

**Important:** Mark `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, `GOOGLE_AI_API_KEY`, and `RESEND_API_KEY` as **Encrypted** (not exposed to browser).

### 2.4 Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Note the production URL (e.g., `https://leadquoteenginev2.vercel.app`)

---

## Step 3: Custom Domain (Optional)

### 3.1 Add Domain in Vercel

1. Go to Project Settings → Domains
2. Enter your domain (e.g., `getquote.redwhitereno.com`)
3. Follow Vercel's DNS configuration instructions

### 3.2 Configure DNS

In your DNS provider (Cloudflare, GoDaddy, etc.):

**Option A: A Record**
```
Type: A
Name: getquote
Value: 76.76.21.21 (Vercel's anycast IP)
```

**Option B: CNAME (for subdomains)**
```
Type: CNAME
Name: getquote
Value: cname.vercel-dns.com
```

### 3.3 Update Supabase Redirect URLs

In Supabase Dashboard → Authentication → URL Configuration:

- Add your custom domain to **Site URL**
- Add to **Redirect URLs**:
  - `https://your-domain.com/auth/callback`
  - `https://your-domain.com/admin/login`

---

## Step 4: Email Configuration

### 4.1 Resend Setup

1. Sign up at [Resend](https://resend.com)
2. Add and verify your domain:
   - Go to Domains → Add Domain
   - Enter your domain (e.g., `redwhitereno.com`)
   - Add DNS records as instructed
3. Create an API key with "Sending access"
4. Add to Vercel environment variables

### 4.2 Test Email Delivery

```bash
# Send test email via API
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer YOUR_RESEND_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "Red White Reno <quotes@yourdomain.com>",
    "to": ["test@example.com"],
    "subject": "Test Email",
    "html": "<p>Test from Lead-to-Quote Engine</p>"
  }'
```

---

## Step 5: AI Service Configuration

### 5.1 OpenAI

1. Verify API key has access to GPT-5.2
2. Check rate limits and quotas
3. Set up usage alerts in OpenAI dashboard

### 5.2 Google AI (Gemini)

1. Ensure project has Gemini API access enabled
2. Verify quota for image generation
3. For production, consider requesting increased quotas

---

## Step 6: Post-Deployment Verification

### 6.1 Health Checks

```bash
# Test homepage
curl -s https://your-domain.com | head -20

# Test API routes
curl -s https://your-domain.com/api/leads -X POST \
  -H 'Content-Type: application/json' \
  -d '{"test": true}'
```

### 6.2 Functional Testing

| Test | Steps | Expected Result |
|------|-------|-----------------|
| Homepage | Visit `/` | Loads with navigation |
| Quote Flow | Click "Get Quote" → Answer questions | Chat interface works |
| Visualizer | Visit `/visualizer` → Upload photo | Upload works, styles load |
| Admin Login | Visit `/admin/login` | Login form displays |
| Mobile | Test on phone | Layout responsive, touch targets work |

### 6.3 Run E2E Tests Against Production

```bash
# Update playwright.config.ts baseURL
# Then run:
BASE_URL=https://your-domain.com npm run test:e2e
```

---

## Step 7: Monitoring Setup

### 7.1 Vercel Analytics

1. Enable in Vercel Dashboard → Analytics
2. Add to environment variables:
   ```
   VERCEL_ANALYTICS_ID=...
   ```

### 7.2 Error Tracking (Optional)

Consider adding Sentry or LogRocket:

```bash
npm install @sentry/nextjs
```

### 7.3 Uptime Monitoring

Set up external monitoring:
- [UptimeRobot](https://uptimerobot.com) (free tier available)
- [Pingdom](https://www.pingdom.com)
- Check every 5 minutes
- Alert on 5xx errors

---

## Step 8: Security Hardening

### 8.1 Enable HTTPS Only

In Vercel project settings:
- Ensure "HTTPS Only" is enabled
- Enable "Security Headers"

### 8.2 Configure CORS

In Supabase Dashboard → API → Settings:
- Add your production domain to CORS origins
- Remove `localhost` origins for production

### 8.3 Rate Limiting

Verify rate limits are active:
```bash
# Test rate limiting
curl -X POST https://your-domain.com/api/ai/chat \
  -H 'Content-Type: application/json' \
  -d '{"message": "test"}'
# Run 15+ times quickly - should get 429 error
```

---

## Rollback Plan

If issues occur:

1. **Immediate**: Revert to previous deployment in Vercel
   - Go to Deployments → Previous build → Redeploy

2. **Database**: Rollback migrations
   ```bash
   supabase db reset  # Warning: destructive!
   ```

3. **Environment**: Switch to previous env var values

---

## Troubleshooting Deployment Issues

### Build Fails

```bash
# Check logs in Vercel dashboard
# Common issues:
# 1. Missing environment variables
# 2. TypeScript errors (run `npm run build` locally first)
# 3. Node version mismatch (set to 20.x in Vercel settings)
```

### API Routes Return 500

1. Check Vercel Function Logs
2. Verify environment variables are set
3. Check Supabase connection (RLS, IP allowlist)

### Static Assets Not Loading

1. Check `next.config.ts` output settings
2. Verify `public/` folder contents
3. Check for 404s in browser dev tools

---

## Production Checklist

Before announcing go-live:

- [ ] Homepage loads without errors
- [ ] Quote flow completes successfully
- [ ] Visualizer generates images
- [ ] Admin login works
- [ ] Email delivery tested
- [ ] PDF generation works
- [ ] Mobile experience verified
- [ ] Analytics collecting data
- [ ] Error monitoring active
- [ ] Backup strategy confirmed
- [ ] Rollback plan documented

---

## Next Steps

After successful deployment:

1. **DNS Cutover**: Update main website CTA to point to new platform
2. **Team Training**: Walk through admin dashboard with client
3. **Monitor**: Watch for errors and user feedback
4. **Iterate**: Plan v1.1 features based on usage

---

*See also: [README.md](README.md) for general documentation*
