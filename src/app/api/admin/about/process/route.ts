import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const steps = await prisma.processStep.findMany({
    include: { translations: true },
    orderBy: { order: 'asc' },
  });
  return NextResponse.json(steps);
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { stepNumber, order, translations } = await request.json();

    const step = await prisma.processStep.create({
      data: {
        stepNumber, order: order ?? 0,
        translations: {
          create: translations.map((t: { language: string; title: string; description: string }) => ({
            language: t.language, title: t.title, description: t.description,
          })),
        },
      },
      include: { translations: true },
    });
    return NextResponse.json(step, { status: 201 });
  } catch (error) {
    console.error('Error creating process step:', error);
    return NextResponse.json({ error: 'Failed to create process step' }, { status: 500 });
  }
}
