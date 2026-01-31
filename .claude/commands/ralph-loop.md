---
description: Autonomous iteration until completion criteria met
argument-hint: "<task> --max-iterations N"
allowed-tools:
  - Read
  - Write
  - Edit
  - MultiEdit
  - Bash(npm *)
  - Bash(npx *)
  - Bash(git *)
---

# Ralph Loop Command

Autonomous iteration until a well-defined completion criteria is met.

## CRITICAL SAFETY RULES

### 1. ALWAYS Set --max-iterations

```
Default: 10
Maximum: 20
NEVER run without a cap
```

### 2. Feature Branch Only

```bash
# Check branch FIRST
BRANCH=$(git branch --show-current)
if [ "$BRANCH" = "main" ]; then
    echo "ERROR: Cannot run Ralph loop on main branch"
    echo "Create a feature branch: git checkout -b feature/[name]"
    exit 1
fi
```

### 3. Well-Defined, Testable Tasks Only

**GOOD Tasks for Ralph Loops:**
- "Make all Playwright tests pass"
- "Fix all TypeScript errors"
- "Fix all ESLint errors"
- "Match reference mockup (95% visual similarity)"
- "Complete TODO items in TODO.md"

**BAD Tasks for Ralph Loops:**
- "Refactor the entire codebase" (unbounded)
- "Build the authentication system" (too complex)
- "Fix all bugs" (unbounded)
- "Improve performance" (subjective)

## Usage

```bash
/ralph-loop "Make all Playwright tests pass" --max-iterations 10
/ralph-loop "Fix TypeScript errors" --max-iterations 5
```

## Process

### 1. Parse Task and Constraints

```
Task: $ARGUMENTS (up to --max-iterations)
Max Iterations: [extracted number, default 10]
```

### 2. Pre-Flight Checks

```bash
# Verify not on main
[ "$(git branch --show-current)" != "main" ] || exit 1

# Verify clean starting point
git status
```

### 3. Loop Execution

```
iteration = 0
while iteration < max_iterations:

    # Attempt task
    [Execute appropriate action]

    # Run verification
    npm run build
    npm run test (or specific test command)

    # Check completion
    if [all tests pass / no errors]:
        print("✅ COMPLETE")
        exit success

    # Analyze failure
    [Read error output]
    [Identify root cause]
    [Adjust approach]

    iteration += 1

    # Checkpoint every 5 iterations
    if iteration % 5 == 0:
        [Generate checkpoint.md]
        [Consider using /compact]

print("⚠️ Max iterations reached")
exit with status report
```

### 4. Report Final Status

```markdown
## Ralph Loop Complete

**Task:** [task description]
**Iterations:** X / Y max
**Status:** ✅ SUCCESS / ⚠️ MAX ITERATIONS

### Progress Log
1. Iteration 1: [what was tried, result]
2. Iteration 2: [what was tried, result]
...

### Final State
- Tests passing: X / Y
- Errors remaining: [list if any]

### Recommended Next Steps
- [Action if incomplete]
```

## Emergency Stop

User can interrupt at any time:
- Press Ctrl+C
- Loop auto-stops at max iterations
- Git can revert all changes:
  ```bash
  git checkout .
  git clean -fd
  ```

## Context Checkpoint Pattern

After every 5 iterations:

1. Generate checkpoint summary:
   - What was attempted
   - What worked/failed
   - Current state
   - Next approach

2. Consider `/compact` to compress context

3. If context exhausted:
   - Generate DEBRIEF.md
   - Start new session with DEBRIEF.md as context

## Project Specific

- Visual regression: Use 95% similarity threshold
- Mobile tests: Run on 375px viewport first
- AI validation: Ensure Zod schemas catch failures
