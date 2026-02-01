import { createClient } from '@/lib/db/server';

export default async function TestDbPage() {
  const supabase = await createClient();

  // Test connection by checking auth status
  const { data: { user }, error } = await supabase.auth.getUser();

  const connectionStatus = error
    ? `Error: ${error.message}`
    : 'Connection successful';

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="rounded-lg border border-border bg-card p-8 shadow-lg">
        <h1 className="mb-4 text-2xl font-bold">Supabase Connection Test</h1>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Status:</span>{' '}
            <span className={error ? 'text-destructive' : 'text-green-600'}>
              {connectionStatus}
            </span>
          </p>
          <p>
            <span className="font-medium">User:</span>{' '}
            {user ? user.email : 'Not authenticated'}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            This page tests the Supabase server client connection.
            Remove after verification.
          </p>
        </div>
      </div>
    </main>
  );
}
