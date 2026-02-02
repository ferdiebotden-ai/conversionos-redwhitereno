---
description: Start a new development session with full vision context and optimized session planning
allowed-tools:
  - Read
  - Bash(git status)
  - Bash(git branch *)
  - Bash(git log *)
  - EnterPlanMode
---

# Session Start

Initialize a high-quality development session by fully understanding the product vision before planning an optimal batch of work.

## 1. Load Full Product Vision

**Read the complete PRD** (`PRD_LEAD_TO_QUOTE_ENGINE_V2.md`) to deeply understand:
- The North Star vision and mission
- Target users and their pain points
- The AI-native approach and why it matters
- UI/UX standards and design philosophy
- User journey and conversion goals
- Quality bar we're aspiring to (world-class, not just functional)

This context is essential. We're not just completing tasks—we're building a cohesive, delightful product.

## 2. Load Session Context

Read `SESSION_STATUS.md` to understand:
- Current phase and completed tasks
- Next task ID and remaining work
- Any blockers or decisions from previous sessions
- Technical notes and patterns established

## 3. Git Status Check

```bash
git status
git branch --show-current
git log --oneline -5
```

Verify:
- On a feature branch (not main)
- Working directory state
- Recent commits for continuity

## 4. Plan the Session

With your 200k token context window, assess what you can realistically accomplish in one focused coding session. Consider:

**Scope Assessment:**
- What is the next logical batch of sequential tasks?
- Which tasks share components, patterns, or context?
- What's the natural stopping point (cohesive feature, testable milestone)?

**Quality Gates:**
- Every feature should feel polished, not just functional
- Mobile-first responsive design on all UI
- Accessibility and touch targets (44px minimum)
- TypeScript strict mode compliance
- Build must pass before session ends

**Session Plan:**
Create a concrete plan covering:
1. Tasks to complete (by DEV-ID)
2. Why this scope makes sense as a unit
3. Key components/files to create
4. Verification steps at the end

## 5. Display Session Brief

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  SESSION START
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Phase: [current phase]
Branch: [current branch]
Status: [clean/uncommitted changes]

Session Plan: [DEV-XXX to DEV-YYY]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Brief description of what will be built]

Tasks:
  [ ] DEV-XXX: [description]
  [ ] DEV-YYY: [description]
  ...

Why This Scope:
[Explain the cohesion and natural stopping point]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 6. Confirmation

Present the session plan and ask:
"This is what I recommend for this session. Should I proceed, or would you like to adjust the scope?"

## Quality Reminders

Throughout the session, remember:
- **AI-Native**: Every interaction should feel intelligent, not just automated
- **Mobile-First**: Design for 375px width first, then scale up
- **Delightful UX**: Loading states, animations, micro-interactions matter
- **Professional Polish**: This is for a real contractor's business
- **Canadian Context**: HST 13%, CAD formatting, Ontario focus

We're building something the contractor will be proud to show clients.
