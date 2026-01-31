#!/usr/bin/env bash
set -euo pipefail

# PostToolUse hook: runs after every Edit/Write/MultiEdit
# Fast TypeScript check (not full build) to maintain iteration speed

echo "🔍 TypeScript check..."

if [ -f "package.json" ] && [ -f "tsconfig.json" ]; then
    npx tsc --noEmit 2>&1 || {
        echo "❌ TypeScript errors found"
        exit 1
    }
fi

echo "✅ TypeScript check passed"
