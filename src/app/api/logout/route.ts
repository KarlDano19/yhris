import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { getIronSession } from 'iron-session';

import { sessionOptions, sleep, SessionData } from '@/lib/session';

export async function POST(request: NextRequest) {
  const session = await getIronSession<SessionData>(cookies() as any, sessionOptions);
  const cookieStore = cookies();
  
  try {
    const token = session.token;
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    const res = await fetch(`${process.env.NEXT_API_URL}/api/logout/`, config);
    const data = await res.json();
    if (!res.ok) {
      throw data;
    }
    
    // Clear session data
    session.destroy();
    
    // Clear the token cookie if it exists
    cookieStore.delete('token');
    
    await sleep(250);
    
    // Return response with cleared cookies
    const response = NextResponse.json(data, { status: 200 });
    response.cookies.delete('token');
    
    return response;
  } catch (err: any) {
    // Clear session data even on error
    session.destroy();
    
    // Clear the token cookie if it exists
    cookieStore.delete('token');
    
    await sleep(250);
    
    const response = NextResponse.json(err, { status: 500 });
    response.cookies.delete('token');
    
    return response;
  }
}
