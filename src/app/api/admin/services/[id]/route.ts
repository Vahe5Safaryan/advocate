import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/services/[id] - Get a single service
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        translations: true,
      },
    });

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/services/[id] - Update a service
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { slug, icon, order, isActive, translations } = body;

    // Check if slug already exists for another service
    const existing = await prisma.service.findFirst({
      where: {
        slug,
        NOT: { id },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Услуга с таким slug уже существует' },
        { status: 400 }
      );
    }

    // Delete existing translations
    await prisma.serviceTranslation.deleteMany({
      where: { serviceId: id },
    });

    // Update service with new translations
    const service = await prisma.service.update({
      where: { id },
      data: {
        slug,
        icon,
        order,
        isActive,
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

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/services/[id] - Partial update (e.g., toggle active)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const service = await prisma.service.update({
      where: { id },
      data: body,
      include: {
        translations: true,
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/services/[id] - Delete a service
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    );
  }
}
