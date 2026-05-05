import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

interface RouteParams { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const area = await prisma.practiceArea.findUnique({ where: { id }, include: { translations: true } });
  if (!area) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(area);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    const { icon, order, translations } = await request.json();

    await prisma.practiceAreaTranslation.deleteMany({ where: { practiceAreaId: id } });
    const area = await prisma.practiceArea.update({
      where: { id },
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
    return NextResponse.json(area);
  } catch (error) {
    console.error('Error updating practice area:', error);
    return NextResponse.json({ error: 'Failed to update practice area' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  await prisma.practiceArea.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
