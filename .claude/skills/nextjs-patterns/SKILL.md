---
name: nextjs-building
description: "Next.js 16 App Router patterns and best practices for RedWhiteReno. Use when working with server components, client components, server actions, route handlers, pages, layouts, data fetching, or any Next.js application structure questions."
---

# Next.js 16 Patterns

## Server Components (Default)

All components are Server Components by default. Only add 'use client' when necessary.

```tsx
// app/page.tsx - Server Component (default)
import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data } = await supabase.from('leads').select('*')
  return <LeadList leads={data} />
}
```

## Client Components (Only When Needed)

Use 'use client' only for:
- useState, useEffect, useRef hooks
- Event handlers (onClick, onChange)
- Browser APIs (localStorage, window)
- Third-party client libraries

```tsx
'use client'
import { useState } from 'react'

export function IntakeForm() {
  const [step, setStep] = useState(1)
  // Interactive form logic
}
```

## Server Actions (Mutations)

Prefer Server Actions over API routes for form submissions.

```tsx
// app/actions.ts
'use server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { LeadSchema } from '@/types/schemas'

export async function createLead(formData: FormData) {
  const validated = LeadSchema.parse(Object.fromEntries(formData))
  const supabase = await createClient()
  const { data, error } = await supabase.from('leads').insert(validated)
  if (error) throw error
  return data
}
```

## Route Handlers (API Routes)

Use for webhooks, external API integrations.

```tsx
// app/api/webhook/route.ts
import { NextResponse } from 'next/server'
import { z } from 'zod'

export async function POST(req: Request) {
  const body = await req.json()
  const validated = WebhookSchema.parse(body)
  // Process webhook
  return NextResponse.json({ success: true })
}
```

## Data Fetching

- Use Server Components for data fetching (no useEffect)
- Parallel fetching with Promise.all
- Streaming with Suspense for slow data

## Error Handling

- `error.tsx` for route-level errors
- `not-found.tsx` for 404s
- `loading.tsx` for loading states

## Mobile-First Layout

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-off-white">
        <main className="mx-auto max-w-md px-4 pb-24">
          {children}
        </main>
      </body>
    </html>
  )
}
```

## RedWhiteReno Specific

- All CTAs in bottom 30% (thumb zone)
- Touch targets min 44x44px
- Test every form on 375px viewport first
