import { Metadata } from 'next';
import { Suspense } from 'react';
import { EstimatePageClient } from './estimate-client';

export const metadata: Metadata = {
  title: 'Get an Instant Estimate | Red White Reno',
  description: 'Chat with our AI assistant to get a preliminary renovation estimate in minutes. Upload photos of your space and describe your project.',
};

function EstimateLoading() {
  return (
    <div className="h-[calc(100vh-64px)] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

export default function EstimatePage() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<EstimateLoading />}>
        <EstimatePageClient />
      </Suspense>
    </main>
  );
}
