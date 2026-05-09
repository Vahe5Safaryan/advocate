import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/admin/services - List all services
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const services = await prisma.service.findMany({
      include: {
        translations: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

// POST /api/admin/services - Create a new service
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { slug, icon, order, isActive, translations } = body;

    // Check if slug already exists
    const existing = await prisma.service.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Услуга с таким slug уже существует' },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: {
        slug,
        icon: icon || '⚖️',
        order: order || 0,
        isActive: isActive !== false,
        translations: {
          create: translations.map((t: {
            language: string;
            title: string;
            heroTitle: string;
            introTitle?: string;
            items: string[];
            intro: string[];
            sections: { title: string; items: string[]; paragraphs?: { title: string; content: string }[] }[];
          }) => ({
            language: t.language,
            title: t.title,
            heroTitle: t.heroTitle || t.title,
            introTitle: t.introTitle || '',
            items: JSON.stringify(t.items || []),
            intro: JSON.stringify(t.intro || []),
            sections: JSON.stringify(t.sections || []),
          })),
        },
      },
      include: {
        translations: true,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}
