# Lead-to-Quote Engine v2

AI-native renovation lead capture platform. First client: Red White Reno (Stratford, ON).

## Context
- **PRD:** `PRD_LEAD_TO_QUOTE_ENGINE_V2.md` — full specs, task IDs, schemas
- **Session state:** `SESSION_STATUS.md` — current phase, next task, blockers
- **Skills:** `.claude/skills/` — patterns for AI, Next.js, Supabase, TypeScript, testing, security

Always check SESSION_STATUS.md before starting. Update it when done.

## Stack
Next.js 16 (App Router) • React 19 • TypeScript 5.7 (strict) • Supabase • Tailwind v4 • shadcn/ui • Vitest • Playwright

## AI Stack
- Chat/Vision: OpenAI GPT-5.2
- Image generation: Gemini 3 Pro Image (Nano Banana Pro)
- Validation: Zod schemas on all AI outputs

## Commands
```bash
npm run dev          # localhost:3000
npm run build        # typecheck + build (run before commits)
npm run test         # unit tests
npm run test:e2e     # Playwright
```

## Patterns
**Server Components by default.** Client only for interactivity.

**AI outputs → Zod validation → render.** Never trust raw AI output.

**Mobile-first.** Test on 375px. Touch targets ≥44px. CTAs in thumb zone.

**Feature branches only.** Never edit main directly.

**Reference PRD task IDs in commits:** `feat(chat): streaming responses [DEV-021]`

## Key Files (when they exist)
```
src/lib/ai/          — AI service integrations
src/lib/schemas/     — Zod validation schemas
src/components/ui/   — shadcn/ui components
supabase/migrations/ — database schema
```

## Skills Reference
Load the relevant skill when working in that domain:
- Building UI/pages/components → `frontend-design` + `nextjs-patterns`
- Building AI features → `ai-native-development`
- Database/auth/storage → `supabase-patterns`
- Type safety → `typescript-strict`
- Testing → `playwright-testing`
- Security review → `security-compliance`

**UI/UX Priority:** Always use `frontend-design` when building any user-facing interface. Avoid generic AI aesthetics.

## Business Constants
HST: 13% • Deposit: 50% • Primary color: #D32F2F
