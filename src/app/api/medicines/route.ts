import { NextRequest, NextResponse } from 'next/server';
import { readMedicines, writeMedicines } from '@/lib/storage';
import { Medicine } from '@/lib/types';
import { cookies } from 'next/headers';

async function checkAuth() {
  const cookieStore = await cookies();
  const auth = cookieStore.get('auth_session');
  return !!auth;
}

export async function GET() {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const medicines = await readMedicines();
  return NextResponse.json(medicines);
}

export async function POST(req: NextRequest) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const medicine: Medicine = await req.json();
  const medicines = await readMedicines();
  medicines.push(medicine);
  await writeMedicines(medicines);
  return NextResponse.json(medicine);
}

export async function PUT(req: NextRequest) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const medicine: Medicine = await req.json();
  const medicines = await readMedicines();
  const index = medicines.findIndex((m) => m.id === medicine.id);
  if (index !== -1) {
    medicines[index] = medicine;
    await writeMedicines(medicines);
    return NextResponse.json(medicine);
  }
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function DELETE(req: NextRequest) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  const medicines = await readMedicines();
  const filtered = medicines.filter((m) => m.id !== id);
  await writeMedicines(filtered);
  return NextResponse.json({ success: true });
}
