import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

interface RouteParams { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const tab = await prisma.aboutTab.findUnique({ where: { id }, include: { translations: true } });
  if (!tab) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(tab);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    const { tabKey, order, translations } = await request.json();

    await prisma.aboutTabTranslation.deleteMany({ where: { tabId: id } });
    const tab = await prisma.aboutTab.update({
      where: { id },
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
    return NextResponse.json(tab);
  } catch (error) {
    console.error('Error updating tab:', error);
    return NextResponse.json({ error: 'Failed to update tab' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  await prisma.aboutTab.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
