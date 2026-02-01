/**
 * Admin Auth Helpers
 * Functions for admin authentication and authorization
 */

import { createClient as createServerClient } from '@/lib/db/server';

/**
 * Check if the current user is authenticated as admin
 * Call this in Server Components or Route Handlers
 */
export async function getAdminUser() {
  const supabase = await createServerClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  // For now, any authenticated user is considered admin
  // TODO: Add role checking via user metadata or a separate admins table
  // Example: Check user.app_metadata.role === 'admin'

  return user;
}

/**
 * Require admin authentication
 * Throws an error if not authenticated
 */
export async function requireAdmin() {
  const user = await getAdminUser();

  if (!user) {
    throw new Error('Unauthorized: Admin access required');
  }

  return user;
}

/**
 * Sign out the current user
 */
export async function signOutAdmin() {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
}
