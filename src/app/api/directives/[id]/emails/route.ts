import { NextRequest, NextResponse } from 'next/server';

import { MaskedEmail } from '@/types/directives';

const MAX_MASK_LENGTH = 4;

function getMaskLength(local: string): number {
  return Math.min(MAX_MASK_LENGTH, Math.max(1, Math.floor(local.length / 4)));
}

function maskLocalPart(local: string, maskLength: number): string {
  if (local.length <= 2) return local;

  const length = Math.min(maskLength, local.length - 2);
  const start = Math.floor((local.length - length) / 2);

  return `${local.slice(0, start)}${'*'.repeat(length)}${local.slice(start + length)}`;
}

function countOccurrences(values: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  return counts;
}

function buildMaskedEmails(emails: string[]): MaskedEmail[] {
  const parts = emails.map((email) => {
    const atIndex = email.indexOf('@');
    const local = atIndex !== -1 ? email.slice(0, atIndex) : email;
    const domain = atIndex !== -1 ? email.slice(atIndex) : '';
    return { local, domain, maskLength: getMaskLength(local) };
  });

  const render = () =>
    parts.map((part) => `${maskLocalPart(part.local, part.maskLength)}${part.domain}`);

  // Companies with standardized email naming can mask down to the same string.
  // Reveal one more character at a time until the colliding entries differ.
  let masks = render();
  for (let pass = 0; pass < MAX_MASK_LENGTH; pass += 1) {
    const counts = countOccurrences(masks);
    if (!Array.from(counts.values()).some((count) => count > 1)) break;

    let changed = false;
    parts.forEach((part, index) => {
      if ((counts.get(masks[index]) ?? 0) > 1 && part.maskLength > 1) {
        part.maskLength -= 1;
        changed = true;
      }
    });

    if (!changed) break;
    masks = render();
  }

  // Genuinely duplicated addresses can still tie — number them so no two
  // options in the dropdown ever look the same.
  const totals = countOccurrences(masks);
  const seen = new Map<string, number>();

  return masks.map((masked, index) => {
    if ((totals.get(masked) ?? 0) <= 1) return { index, masked };

    const occurrence = (seen.get(masked) ?? 0) + 1;
    seen.set(masked, occurrence);
    return { index, masked: `${masked} (${occurrence})` };
  });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/directives/${params.id}/`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch directive' },
        { status: res.status }
      );
    }

    const data = await res.json();

    let emails: string[] = [];
    if (Array.isArray(data.to)) {
      emails = data.to;
    } else if (typeof data.to === 'string') {
      try {
        const parsed = JSON.parse(data.to);
        emails = Array.isArray(parsed) ? parsed : [];
      } catch {
        emails = [];
      }
    }

    return NextResponse.json({ emails: buildMaskedEmails(emails) });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
