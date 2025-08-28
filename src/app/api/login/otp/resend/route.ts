import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    
    const res = await fetch(`${process.env.NEXT_API_URL}/api/auth/login/otp/resend/`, config);
    const data = await res.json();
    
    if (!res.ok) {
      throw data;
    }
    
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(err, { status: 500 });
  }
} 