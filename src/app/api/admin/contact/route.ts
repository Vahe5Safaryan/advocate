import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const contacts = await prisma.contactInfo.findMany({
    include: { translations: true },
    orderBy: { order: 'asc' },
  });
  return NextResponse.json(contacts);
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { type, value, icon, link, order, isActive, translations } = await request.json();

    const contact = await prisma.contactInfo.create({
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
    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error('Error creating contact info:', error);
    return NextResponse.json({ error: 'Failed to create contact info' }, { status: 500 });
  }
}
