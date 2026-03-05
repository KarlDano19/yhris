import { NextRequest, NextResponse } from 'next/server';

async function resolveEmail(directiveId: string, emailIndex: number): Promise<string | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/directives/${directiveId}/`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Secret': process.env.INTERNAL_API_SECRET ?? '',
      },
      cache: 'no-store',
    }
  );

  if (!res.ok) return null;

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

  return emails[emailIndex] ?? null;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { emailIndex, code } = body;

    if (emailIndex === undefined || emailIndex === null || !code) {
      return NextResponse.json({ error: 'emailIndex and code are required' }, { status: 400 });
    }

    const email = await resolveEmail(params.id, emailIndex);

    if (!email) {
      return NextResponse.json({ error: 'Invalid email selection' }, { status: 400 });
    }

    const verifyRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/directives/${params.id}/verify-code/`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      }
    );

    const responseData = await verifyRes.json();
    return NextResponse.json(responseData, { status: verifyRes.status });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
