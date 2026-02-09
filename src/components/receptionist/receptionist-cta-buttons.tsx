'use client';

/**
 * Receptionist CTA Buttons
 * Parses [CTA:Label:/path] markers from message text and renders clickable buttons
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CTA_REGEX = /\[CTA:([^:]+):([^\]]+)\]/g;

interface CTAMatch {
  label: string;
  path: string;
}

/**
 * Extract CTA markers from text
 */
function extractCTAs(text: string): CTAMatch[] {
  const matches: CTAMatch[] = [];
  let match: RegExpExecArray | null;

  // Reset regex state
  CTA_REGEX.lastIndex = 0;
  while ((match = CTA_REGEX.exec(text)) !== null) {
    if (match[1] && match[2]) {
      matches.push({ label: match[1], path: match[2] });
    }
  }
  return matches;
}

/**
 * Remove CTA markers from text, returning clean text for display
 */
export function stripCTAs(text: string): string {
  return text.replace(CTA_REGEX, '').trim();
}

/**
 * Render inline CTA buttons parsed from message text
 */
export function ReceptionistCTAButtons({ text }: { text: string }) {
  const ctas = extractCTAs(text);

  if (ctas.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {ctas.map((cta, index) => (
        <Button
          key={`${cta.path}-${index}`}
          variant="outline"
          size="sm"
          className="h-8 text-xs border-primary/30 text-primary hover:bg-primary/10"
          asChild
        >
          <Link href={cta.path}>
            {cta.label}
            <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      ))}
    </div>
  );
}
