import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const areas = await prisma.practiceArea.findMany({
    include: { translations: true },
    orderBy: { order: 'asc' },
  });
  return NextResponse.json(areas);
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { icon, order, translations } = await request.json();

    const area = await prisma.practiceArea.create({
      data: {
        icon, order: order ?? 0,
        translations: {
          create: translations.map((t: { language: string; title: string; description: string }) => ({
            language: t.language, title: t.title, description: t.description,
          })),
        },
      },
      include: { translations: true },
    });
    return NextResponse.json(area, { status: 201 });
  } catch (error) {
    console.error('Error creating practice area:', error);
    return NextResponse.json({ error: 'Failed to create practice area' }, { status: 500 });
  }
}
