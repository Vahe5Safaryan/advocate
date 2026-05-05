import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/admin/cases - List all case studies
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cases = await prisma.caseStudy.findMany({
      include: {
        translations: true,
        category: {
          include: { translations: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(cases);
  } catch (error) {
    console.error('Error fetching cases:', error);
    return NextResponse.json({ error: 'Failed to fetch cases' }, { status: 500 });
  }
}

// POST /api/admin/cases - Create a new case study
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { slug, imageUrl, categoryId, publishedAt, isPublished, translations } = body;

    const existing = await prisma.caseStudy.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'Дело с таким slug уже существует' }, { status: 400 });
    }

    const caseStudy = await prisma.caseStudy.create({
      data: {
        slug,
        imageUrl: imageUrl || null,
        categoryId: categoryId || null,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        isPublished: isPublished || false,
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

    return NextResponse.json(caseStudy, { status: 201 });
  } catch (error) {
    console.error('Error creating case:', error);
    return NextResponse.json({ error: 'Failed to create case' }, { status: 500 });
  }
}
