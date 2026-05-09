import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const tabs = await prisma.aboutTab.findMany({
    include: { translations: true },
    orderBy: { order: 'asc' },
  });
  return NextResponse.json(tabs);
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { tabKey, order, translations } = await request.json();

    const tab = await prisma.aboutTab.create({
      data: {
        tabKey, order: order ?? 0,
        translations: {
          create: translations.map((t: { language: string; label: string; content: string }) => ({
            language: t.language, label: t.label, content: t.content,
          })),
        },
      },
      include: { translations: true },
    });
    return NextResponse.json(tab, { status: 201 });
  } catch (error) {
    console.error('Error creating tab:', error);
    return NextResponse.json({ error: 'Failed to create tab' }, { status: 500 });
  }
}
