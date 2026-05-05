import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const settings = await prisma.siteSetting.findMany({
    include: { translations: true },
    orderBy: { key: 'asc' },
  });
  return NextResponse.json(settings);
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { key, value, translations } = await request.json();

    const setting = await prisma.siteSetting.upsert({
      where: { key },
      update: {
        value,
        translations: {
          deleteMany: {},
          create: translations?.map((t: { language: string; value: string }) => ({
            language: t.language, value: t.value,
          })) ?? [],
        },
      },
      create: {
        key, value,
        translations: {
          create: translations?.map((t: { language: string; value: string }) => ({
            language: t.language, value: t.value,
          })) ?? [],
        },
      },
      include: { translations: true },
    });
    return NextResponse.json(setting);
  } catch (error) {
    console.error('Error saving setting:', error);
    return NextResponse.json({ error: 'Failed to save setting' }, { status: 500 });
  }
}
