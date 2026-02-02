# Lead-to-Quote Engine v2

AI-native renovation lead capture and quoting platform for contractors.

**Live URL:** https://leadquoteenginev2.vercel.app  
**First Client:** Red White Reno (Stratford, ON)

---

## Features

| Feature | Description |
|---------|-------------|
| **AI Quote Assistant** | Conversational chat interface that captures project details and generates instant ballpark estimates |
| **AI Design Visualizer** | Upload photos and generate photorealistic "after" renderings using Gemini 3 Pro Image |
| **Admin Dashboard** | Full lead management, quote editing, PDF generation, and email delivery |
| **Mobile-First Design** | Optimized for smartphone users (60% of renovation research starts on mobile) |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5.7 (strict mode) |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui |
| Database | Supabase (PostgreSQL + Auth) |
| AI Services | OpenAI GPT-5.2, Gemini 3 Pro Image |
| Email | Resend |
| Testing | Vitest (unit), Playwright (E2E) |
| Deployment | Vercel |

---

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm or npm
- Supabase CLI (optional): `npm install -g supabase`

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd lead_quote_engine_v2

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys (see Environment Variables section)

# Run development server
npm run dev
```

Visit `http://localhost:3000`

---

## Environment Variables

Create `.env.local` with these variables:

```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI Services (Required)
OPENAI_API_KEY=sk-...
GOOGLE_AI_API_KEY=AIza...  # For Gemini image generation

# Email (Required for quote delivery)
RESEND_API_KEY=re_...

# Optional
VERCEL_ANALYTICS_ID=...
```

---

## Development

### Available Scripts

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Production build with type checking
npm run lint         # ESLint check
npm run test         # Run unit tests (Vitest)
npm run test:e2e     # Run E2E tests (Playwright)
```

### Project Structure

```
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── (marketing)/  # Public marketing pages
│   │   ├── admin/        # Admin dashboard (protected)
│   │   ├── api/          # API routes
│   │   ├── about/
│   │   ├── contact/
│   │   ├── estimate/     # AI Quote Assistant
│   │   ├── services/     # Service pages
│   │   └── visualizer/   # AI Design Visualizer
│   ├── components/       # React components
│   │   ├── admin/        # Admin dashboard components
│   │   ├── chat/         # Chat interface
│   │   ├── ui/           # shadcn/ui components
│   │   └── visualizer/   # Visualizer components
│   ├── lib/              # Utilities and services
│   │   ├── ai/           # AI integrations (OpenAI, Gemini)
│   │   ├── auth/         # Authentication helpers
│   │   ├── db/           # Database queries
│   │   ├── email/        # Email templates
│   │   ├── pdf/          # PDF generation
│   │   └── schemas/      # Zod validation schemas
│   └── types/            # TypeScript types
├── supabase/
│   └── migrations/       # Database migrations
├── tests/
│   ├── e2e/              # Playwright E2E tests
│   └── unit/             # Vitest unit tests
└── public/               # Static assets
```

### Development Guidelines

1. **Server Components by default** — Only use Client Components for interactivity
2. **TypeScript strict mode** — All code must pass strict type checking
3. **Zod validation** — Validate all AI outputs and form inputs
4. **Mobile-first** — Design for 375px viewport minimum
5. **Test coverage** — Unit tests for utilities, E2E for critical flows

---

## Testing

### Unit Tests

```bash
npm run test
```

Covers:
- Pricing engine calculations
- Schema validation
- Utility functions

### E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI mode for debugging
npx playwright test --ui

# Run specific test file
npx playwright test tests/e2e/quote-happy-path.spec.ts
```

Test matrix:
- Mobile (375px)
- Tablet (768px)
- Desktop (1440px)

---

## Database

### Schema Overview

**leads** — Lead capture from quote assistant
- Contact info, project details, chat transcript
- Scope JSON, quote drafts, photos
- Status tracking (new → reviewing → sent → won/lost)

**quote_drafts** — Editable quote versions
- Line items, tiers (good/better/best)
- Pricing breakdowns, PDF URLs
- Email tracking (sent_at, opened_at)

**chat_sessions** — In-progress conversations
- Session restoration with magic links
- 7-day expiry for incomplete sessions

**audit_log** — Compliance tracking
- All status changes, quote updates
- IP address and user agent logging

### Running Migrations

```bash
# Deploy migrations to production
supabase db push

# Create new migration
supabase migration new migration_name
```

---

## Deployment

### Vercel (Recommended)

1. Connect GitHub repo to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main

```bash
# Manual deployment
vercel --prod
```

### Environment Setup

Before first deployment:

1. Run database migrations in Supabase
2. Set up admin user:
   ```sql
   SELECT set_admin_role('admin@example.com');
   ```
3. Configure Resend domain for email delivery
4. Set up Google AI API access for image generation

---

## Admin Access

1. Navigate to `/admin/login`
2. Sign in with admin credentials
3. Dashboard shows lead metrics and recent activity

**Setting up first admin:**
```sql
-- In Supabase SQL Editor
SELECT set_admin_role('your-email@example.com');
```

---

## API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ai/chat` | POST | Streaming chat with GPT-5.2 |
| `/api/ai/visualize` | POST | Generate design concepts with Gemini |
| `/api/leads` | POST | Submit new lead |
| `/api/leads/[id]` | GET/PATCH | Get/update lead |
| `/api/leads/[id]/audit` | GET | Get audit log for lead |
| `/api/quotes/[leadId]` | GET/POST | Get/create quote draft |
| `/api/quotes/[leadId]/pdf` | GET | Generate PDF quote |
| `/api/quotes/[leadId]/send` | POST | Email quote to customer |
| `/api/sessions/save` | POST | Save chat session |
| `/api/sessions/[id]` | GET | Resume chat session |
| `/api/visualizations` | POST | Save visualization |
| `/api/visualizations/[id]` | GET | Get visualization by ID |

---

## Security

- **HTTPS enforced** on all routes
- **Row Level Security** on all Supabase tables
- **Input sanitization** via Zod validation
- **Rate limiting** on AI endpoints (10 req/min per IP)
- **Admin role verification** on protected routes
- **Audit logging** for all status changes and quote sends

---

## Compliance

### PIPEDA (Canadian Privacy)
- Clear consent before data collection
- Data retention: 24 months then anonymization
- Right to access and deletion
- Images deleted after 7 days if no quote submitted

### CASL (Anti-Spam)
- Express consent checkbox for marketing
- One-click unsubscribe
- Sender identification in all emails
- Consent timestamp logging

---

## Troubleshooting

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Database Connection Issues

1. Verify Supabase URL and keys in `.env.local`
2. Check IP allowlist in Supabase dashboard
3. Verify RLS policies are correctly configured

### AI Service Errors

1. Check API key validity and quotas
2. Verify rate limits haven't been exceeded
3. Check Vercel function timeout settings (AI endpoints may need 30s+)

### Email Delivery Issues

1. Verify Resend API key
2. Check domain verification status in Resend
3. Review spam folder and email authentication (SPF, DKIM)

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Lighthouse Performance | ≥90 |
| Lighthouse Accessibility | ≥95 |
| First Contentful Paint | <1.5s |
| Largest Contentful Paint | <2.5s |
| Time to Interactive | <3s |

---

## Contributing

1. Check `SESSION_STATUS.md` for current phase and next tasks
2. Create feature branch: `git checkout -b feature/DEV-XXX`
3. Reference task ID in commit messages
4. Run full test suite before submitting
5. Update `SESSION_STATUS.md` when complete

---

## License

Private — NorBot Systems Inc.

---

## Support

For issues or questions:
- Check PRD: `PRD_LEAD_TO_QUOTE_ENGINE_V2.md`
- Check session status: `SESSION_STATUS.md`
- Contact: Ferdie @ NorBot Systems
