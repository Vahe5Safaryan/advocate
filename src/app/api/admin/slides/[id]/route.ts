import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/slides/[id] - Get a single slide
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const slide = await prisma.heroSlide.findUnique({
      where: { id },
      include: {
        translations: true,
      },
    });

    if (!slide) {
      return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
    }

    return NextResponse.json(slide);
  } catch (error) {
    console.error('Error fetching slide:', error);
    return NextResponse.json(
      { error: 'Failed to fetch slide' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/slides/[id] - Update a slide
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { imageUrl, order, isActive, translations } = body;

    // Delete existing translations
    await prisma.heroSlideTranslation.deleteMany({
      where: { slideId: id },
    });

    // Update slide with new translations
    const slide = await prisma.heroSlide.update({
      where: { id },
      data: {
        imageUrl,
        order,
        isActive,
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

    return NextResponse.json(slide);
  } catch (error) {
    console.error('Error updating slide:', error);
    return NextResponse.json(
      { error: 'Failed to update slide' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/slides/[id] - Partial update (e.g., toggle active)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const slide = await prisma.heroSlide.update({
      where: { id },
      data: body,
      include: {
        translations: true,
      },
    });

    return NextResponse.json(slide);
  } catch (error) {
    console.error('Error updating slide:', error);
    return NextResponse.json(
      { error: 'Failed to update slide' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/slides/[id] - Delete a slide
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.heroSlide.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting slide:', error);
    return NextResponse.json(
      { error: 'Failed to delete slide' },
      { status: 500 }
    );
  }
}
