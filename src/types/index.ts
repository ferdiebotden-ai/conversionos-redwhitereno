/**
 * Shared TypeScript types for Lead-to-Quote Engine v2
 */

// Database types - regenerate from Supabase after migrations:
// npx supabase gen types typescript --project-id bwvrtypzcvuojfsyiwch > src/types/database.ts
export type {
  Database,
  Json,
  Lead,
  LeadInsert,
  LeadUpdate,
  LeadStatus,
  QuoteDraft,
  QuoteDraftInsert,
  QuoteDraftUpdate,
  QuoteStatus,
  ChatSession,
  ChatSessionInsert,
  ChatSessionUpdate,
  ChatSessionStatus,
  AuditLog,
  AuditLogInsert,
} from './database';
