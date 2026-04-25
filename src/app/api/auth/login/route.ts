import { NextRequest, NextResponse } from 'next/server';
import { readSettings } from '@/lib/storage';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const { pin } = await req.json();
  const settings = await readSettings();

  if (pin === settings.pin) {
    const cookieStore = await cookies();
    cookieStore.set('auth_session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
}
