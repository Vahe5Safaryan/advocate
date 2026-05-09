import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

interface RouteParams { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const stat = await prisma.statistic.findUnique({ where: { id }, include: { translations: true } });
  if (!stat) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(stat);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    const { number, suffix, order, isActive, translations } = await request.json();

    await prisma.statisticTranslation.deleteMany({ where: { statisticId: id } });
    const stat = await prisma.statistic.update({
      where: { id },
      data: {
        number, suffix: suffix || '', order: order ?? 0, isActive: isActive ?? true,
        translations: {
          create: translations.map((t: { language: string; label: string }) => ({
            language: t.language, label: t.label,
          })),
        },
      },
      include: { translations: true },
    });
    return NextResponse.json(stat);
  } catch (error) {
    console.error('Error updating statistic:', error);
    return NextResponse.json({ error: 'Failed to update statistic' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  await prisma.statistic.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
