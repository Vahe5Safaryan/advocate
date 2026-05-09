import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/cases/[id]
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const caseStudy = await prisma.caseStudy.findUnique({
      where: { id },
      include: {
        translations: true,
        category: { include: { translations: true } },
      },
    });

    if (!caseStudy) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    return NextResponse.json(caseStudy);
  } catch (error) {
    console.error('Error fetching case:', error);
    return NextResponse.json({ error: 'Failed to fetch case' }, { status: 500 });
  }
}

// PUT /api/admin/cases/[id]
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { slug, imageUrl, categoryId, publishedAt, isPublished, translations } = body;

    const existing = await prisma.caseStudy.findFirst({
      where: { slug, NOT: { id } },
    });
    if (existing) {
      return NextResponse.json({ error: 'Дело с таким slug уже существует' }, { status: 400 });
    }

    await prisma.caseStudyTranslation.deleteMany({ where: { caseId: id } });

    const caseStudy = await prisma.caseStudy.update({
      where: { id },
      data: {
        slug,
        imageUrl: imageUrl || null,
        categoryId: categoryId || null,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        isPublished,
        translations: {
          create: translations.map((t: {
            language: string;
            title: string;
            introTitle?: string;
            intro: string;
            sections: { title: string; content: string }[];
          }) => ({
            language: t.language,
            title: t.title,
            introTitle: t.introTitle || '',
            intro: t.intro,
            sections: JSON.stringify(t.sections || []),
          })),
        },
      },
      include: {
        translations: true,
        category: { include: { translations: true } },
      },
    });

    return NextResponse.json(caseStudy);
  } catch (error) {
    console.error('Error updating case:', error);
    return NextResponse.json({ error: 'Failed to update case' }, { status: 500 });
  }
}

// PATCH /api/admin/cases/[id]
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const caseStudy = await prisma.caseStudy.update({
      where: { id },
      data: body,
      include: {
        translations: true,
        category: { include: { translations: true } },
      },
    });

    return NextResponse.json(caseStudy);
  } catch (error) {
    console.error('Error updating case:', error);
    return NextResponse.json({ error: 'Failed to update case' }, { status: 500 });
  }
}

// DELETE /api/admin/cases/[id]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.caseStudy.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting case:', error);
    return NextResponse.json({ error: 'Failed to delete case' }, { status: 500 });
  }
}
