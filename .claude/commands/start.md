---
description: Start a new development session with optimal context loading
allowed-tools:
  - Read
  - Bash(git status)
  - Bash(git branch *)
  - Bash(git log *)
---

# Session Start

Initialize a focused development session with minimal context overhead.

## 1. Load Context (Progressive Disclosure)

Read SESSION_STATUS.md to understand:
- Current phase and next task ID
- North star reminder
- Any blockers from previous session

## 2. Git Status Check

```bash
git status
git branch --show-current
```

Verify:
- On a feature branch (not main)
- Working directory state
- Any uncommitted changes from last session

## 3. Display Session Brief

Report to user in this format:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 SESSION START
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Phase: [current phase]
Next Task: [task ID and brief description]
Branch: [current branch]
Status: [clean/uncommitted changes]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 4. Ready Prompt

Ask: "Ready to continue with [TASK-ID]? Or would you like to work on something else?"

## Notes

- Do NOT read the full PRD unless specifically needed for the task
- Load skills on-demand when working in that domain
- Keep context lean for better performance
