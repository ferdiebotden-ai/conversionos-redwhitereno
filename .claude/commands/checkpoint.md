---
description: Quick mid-session save without ending (commit + push)
allowed-tools:
  - Bash(git *)
---

# Checkpoint

Quick save without ending the session. Use when you want to preserve progress but keep working.

## Process

```bash
# Check what's changed
git status

# Stage and commit
git add -A
git commit -m "checkpoint: $ARGUMENTS

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to GitHub
git push origin HEAD
```

## Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ CHECKPOINT SAVED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Message: $ARGUMENTS
Branch: [current branch]
GitHub: ✅ Pushed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Usage

```
/checkpoint work on chat UI streaming
/checkpoint DEV-021 progress
```
