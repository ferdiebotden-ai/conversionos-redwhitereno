---
description: Build a feature from PRD specification
argument-hint: "<feature-name>"
allowed-tools:
  - Read
  - Write
  - Edit
  - MultiEdit
  - Bash(npm *)
  - Bash(npx *)
  - Bash(git *)
---

# Build Feature Command

Build a feature following the structured development workflow.

## Process

### 1. Locate Requirements

```
Read PRD files and find section for: $ARGUMENTS
- Check PRD_LEAD_TO_QUOTE_ENGINE_V2.md
- If not found, ask user for specification
```

### 2. Check References

```
- Look in reference-mockups/ or Screenshots/ for visual targets
- Read related docs in docs/
- Check SESSION_STATUS.md for context
```

### 3. Plan (Required for Multi-File Features)

Use Plan Mode to create implementation plan including:

- [ ] Files to create/modify (list each)
- [ ] Database migrations needed (if any)
- [ ] Zod schemas to create/update
- [ ] Tests to write
- [ ] Rollback strategy

**Wait for user approval before proceeding.**

### 4. Implement

Follow the approved plan step by step:

```
For each step:
1. Make changes
2. Verify with npm run build
3. Commit atomic changes
```

### 5. Test

```bash
# Write E2E tests for user journeys
# Write unit tests for business logic
# Run full test suite
npm run test
npx playwright test
```

### 6. Document

```
- Update SESSION_STATUS.md with:
  - What was implemented
  - Any deviations from plan
  - Known issues
  - Next steps
```

### 7. Complete

```bash
# Final verification
npm run build
npm run test

# Commit with descriptive message
git add .
git commit -m "feat($ARGUMENTS): [description]

- [Change 1]
- [Change 2]
- Tests: [what was tested]"
```

### 8. Report

Provide completion summary:
- What was built
- Files changed
- Tests added
- Any issues encountered

## Project Guidelines

- Mobile-first (test on 375px first)
- Validate all AI outputs with Zod
- Use `frontend-design` skill for all UI work
- CTAs in thumb zone (bottom 30%)
- Touch targets >= 44x44px
