export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold">Admin Login</h1>
        <p className="text-center text-muted-foreground">
          Login form will be implemented in DEV-046.
        </p>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Middleware is correctly protecting admin routes.
        </p>
      </div>
    </main>
  );
}
