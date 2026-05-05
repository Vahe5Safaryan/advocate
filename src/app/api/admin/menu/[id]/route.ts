import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

interface RouteParams { params: Promise<{ id: string }> }

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    const { parentId, href, order, isActive, translations } = await request.json();

    await prisma.menuItemTranslation.deleteMany({ where: { menuItemId: id } });
    const item = await prisma.menuItem.update({
      where: { id },
      data: {
        parentId: parentId || null, href,
        order: order ?? 0, isActive: isActive ?? true,
        translations: {
          create: translations.map((t: { language: string; title: string }) => ({
            language: t.language, title: t.title,
          })),
        },
      },
      include: { translations: true },
    });
    return NextResponse.json(item);
  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  await prisma.menuItem.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
