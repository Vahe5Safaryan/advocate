import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

interface RouteParams { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const contact = await prisma.contactInfo.findUnique({ where: { id }, include: { translations: true } });
  if (!contact) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(contact);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    const { type, value, icon, link, order, isActive, translations } = await request.json();

    await prisma.contactInfoTranslation.deleteMany({ where: { contactInfoId: id } });
    const contact = await prisma.contactInfo.update({
      where: { id },
      data: {
        type, value, icon: icon || '', link: link || null,
        order: order ?? 0, isActive: isActive ?? true,
        translations: {
          create: translations.map((t: { language: string; label: string }) => ({
            language: t.language, label: t.label,
          })),
        },
      },
      include: { translations: true },
    });
    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error updating contact info:', error);
    return NextResponse.json({ error: 'Failed to update contact info' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = await request.json();
  const contact = await prisma.contactInfo.update({ where: { id }, data: body, include: { translations: true } });
  return NextResponse.json(contact);
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  await prisma.contactInfo.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
