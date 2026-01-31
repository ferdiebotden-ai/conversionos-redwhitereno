---
name: supabase-querying
description: "Supabase database patterns including server/client setup, Row Level Security (RLS), migrations, auth, and storage. Use when working with database queries, creating tables, setting up authentication, or managing file uploads."
---

# Supabase Patterns

## Client Setup

### Server-Side (Server Components, Server Actions)

```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        }
      }
    }
  )
}
```

### Client-Side (Client Components)

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

## Row Level Security (RLS)

**Always enable RLS on tables with user data.**

```sql
-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Public can insert leads (intake form)
CREATE POLICY "Anyone can submit leads"
ON leads FOR INSERT
WITH CHECK (true);

-- Only admin can view leads
CREATE POLICY "Admin can view all leads"
ON leads FOR SELECT
USING (auth.jwt() ->> 'role' = 'admin');
```

## Query Patterns

```typescript
// Select with typing
const { data, error } = await supabase
  .from('leads')
  .select('id, name, email, status, created_at')
  .eq('status', 'new')
  .order('created_at', { ascending: false })
  .limit(10)

// Insert with return
const { data, error } = await supabase
  .from('leads')
  .insert({ name, email, phone, project_type })
  .select()
  .single()

// Update
const { error } = await supabase
  .from('leads')
  .update({ status: 'contacted' })
  .eq('id', leadId)
```

## Migrations

```bash
# Create migration
npx supabase migration new add_leads_table

# Apply locally
npx supabase db push

# Deploy to production (requires confirmation)
npx supabase db push --linked
```

## Safe Migration Checklist

- [ ] Backup before destructive changes
- [ ] Test migration locally first
- [ ] RLS policies included
- [ ] Rollback script prepared
- [ ] No data loss operations without explicit approval

## TypeScript Types

Generate types from schema:
```bash
npx supabase gen types typescript --local > types/supabase.ts
```

## Storage (For Project Photos)

```typescript
// Upload image
const { data, error } = await supabase.storage
  .from('project-photos')
  .upload(`leads/${leadId}/${filename}`, file, {
    cacheControl: '3600',
    upsert: false
  })

// Get public URL
const { data } = supabase.storage
  .from('project-photos')
  .getPublicUrl(`leads/${leadId}/${filename}`)
```

## RedWhiteReno Tables

- `leads` - Lead intake submissions
- `quote_drafts` - AI-generated quote drafts
- `projects` - Converted lead projects
- `admin_users` - Admin authentication
