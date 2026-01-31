---
description: End session with GitHub sync, status update, and context clear
allowed-tools:
  - Read
  - Edit
  - Write
  - Bash(git *)
  - Bash(date *)
---

# Session End

Properly close a development session with documentation and GitHub sync.

## 1. Gather Session Summary

Review what was accomplished:
- Check git log for commits this session
- Check git diff for any uncommitted changes
- Note any blockers or decisions made

```bash
git log --oneline -10
git status
```

## 2. Update SESSION_STATUS.md

Edit SESSION_STATUS.md with:

### Update "Last Updated" timestamp
```
> **Last Updated:** [current date]
```

### Update phase progress
- Mark completed tasks with ✅
- Update "Next Task ID" to the next uncompleted task

### Add session log entry
```markdown
### Session: [Date]
**Completed:**
- [List of completed task IDs and descriptions]

**Decisions Made:**
- [Any architectural or implementation decisions]

**Blockers:**
- [Any blockers for next session, or "None"]

**Next Session:**
1. [First priority task]
2. [Second priority task]
```

## 3. Commit Uncommitted Changes

If there are uncommitted changes:

```bash
git add -A
git commit -m "wip: session checkpoint [DATE]

- Progress on [current task]
- [Brief description of changes]

Co-Authored-By: Claude <noreply@anthropic.com>"
```

## 4. Push to GitHub

```bash
git push origin HEAD
```

If push fails (no upstream), set it:
```bash
git push -u origin $(git branch --show-current)
```

## 5. Display Session Summary

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 SESSION END
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Duration: [if trackable]
Commits: [number of commits this session]
Tasks Completed: [list]
Next Task: [next task ID]
GitHub: ✅ Synced
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Run /clear to reset context for next session
   Then run /start to begin fresh
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 6. Context Recommendation

After displaying summary, remind the user:

"Your progress is saved to GitHub. For optimal performance in your next session:
1. Run `/clear` now to reset context
2. Run `/start` when you return

This keeps Claude's context window fresh and focused."
