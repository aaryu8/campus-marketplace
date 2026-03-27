import { cookies } from 'next/headers';
import crypto from 'crypto';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get('session_id')?.value;

  if (!sessionId) {
    sessionId = crypto.randomBytes(64).toString('hex');
    const response = NextResponse.json({ sessionId });
    response.cookies.set('session_id', sessionId, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
      secure: false,
      path: '/',
    });
    return response;
  }

  return NextResponse.json({ sessionId });
}