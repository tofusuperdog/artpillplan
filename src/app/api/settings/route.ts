import { NextRequest, NextResponse } from 'next/server';
import { readSettings, writeSettings } from '@/lib/storage';
import { Settings } from '@/lib/types';
import { cookies } from 'next/headers';

async function checkAuth() {
  const cookieStore = await cookies();
  const auth = cookieStore.get('auth_session');
  return !!auth;
}

export async function GET() {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const settings = await readSettings();
  // Don't send PIN to frontend for general settings GET if needed, 
  // but here it's simple and the user might need it in Settings page.
  return NextResponse.json(settings);
}

export async function POST(req: NextRequest) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const settings: Settings = await req.json();
  await writeSettings(settings);
  return NextResponse.json(settings);
}
