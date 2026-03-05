import { NextRequest, NextResponse } from 'next/server';

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
          'X-Internal-Secret': process.env.INTERNAL_API_SECRET ?? '',
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

    const emailList = emails.map((email: string, index: number) => {
      const atIndex = email.indexOf('@');
      const local = atIndex !== -1 ? email.slice(0, atIndex) : email;
      const domain = atIndex !== -1 ? email.slice(atIndex) : '';
      const visible = local.length > 4 ? local.slice(0, local.length - 4) : '';
      const masked = `${visible}****${domain}`;
      return { index, masked };
    });

    return NextResponse.json({ emails: emailList });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
