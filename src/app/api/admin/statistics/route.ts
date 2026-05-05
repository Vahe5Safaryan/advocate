import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const stats = await prisma.statistic.findMany({
      include: { translations: true },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { number, suffix, order, isActive, translations } = await request.json();

    const stat = await prisma.statistic.create({
      data: {
        number,
        suffix: suffix || '',
        order: order ?? 0,
        isActive: isActive ?? true,
        translations: {
          create: translations.map((t: { language: string; label: string }) => ({
            language: t.language,
            label: t.label,
          })),
        },
      },
      include: { translations: true },
    });
    return NextResponse.json(stat, { status: 201 });
  } catch (error) {
    console.error('Error creating statistic:', error);
    return NextResponse.json({ error: 'Failed to create statistic' }, { status: 500 });
  }
}
