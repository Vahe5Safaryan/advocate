import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const items = await prisma.menuItem.findMany({
    include: { translations: true, children: { include: { translations: true } } },
    where: { parentId: null },
    orderBy: { order: 'asc' },
  });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { parentId, href, order, isActive, translations } = await request.json();

    const item = await prisma.menuItem.create({
      data: {
        parentId: parentId || null,
        href, order: order ?? 0, isActive: isActive ?? true,
        translations: {
          create: translations.map((t: { language: string; title: string }) => ({
            language: t.language, title: t.title,
          })),
        },
      },
      include: { translations: true },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 });
  }
}
