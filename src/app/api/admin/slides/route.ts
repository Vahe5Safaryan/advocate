import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/admin/slides - List all slides
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const slides = await prisma.heroSlide.findMany({
      include: {
        translations: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json(slides);
  } catch (error) {
    console.error('Error fetching slides:', error);
    return NextResponse.json(
      { error: 'Failed to fetch slides' },
      { status: 500 }
    );
  }
}

// POST /api/admin/slides - Create a new slide
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { imageUrl, order, isActive, translations } = body;

    const slide = await prisma.heroSlide.create({
      data: {
        imageUrl,
        order: order || 0,
        isActive: isActive !== false,
        translations: {
          create: translations.map((t: {
            language: string;
            title: string;
            subtitle: string;
            description: string;
            buttonText?: string;
          }) => ({
            language: t.language,
            title: t.title,
            subtitle: t.subtitle,
            description: t.description,
            buttonText: t.buttonText || 'Позвонить',
          })),
        },
      },
      include: {
        translations: true,
      },
    });

    return NextResponse.json(slide, { status: 201 });
  } catch (error) {
    console.error('Error creating slide:', error);
    return NextResponse.json(
      { error: 'Failed to create slide' },
      { status: 500 }
    );
  }
}
