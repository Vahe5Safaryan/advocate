import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/admin/blog - List all blog posts
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const posts = await prisma.blogPost.findMany({
      include: {
        translations: true,
        category: {
          include: {
            translations: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

// POST /api/admin/blog - Create a new blog post
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { slug, imageUrl, categoryId, publishedAt, isPublished, translations } = body;

    const existing = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Статья с таким slug уже существует' },
        { status: 400 }
      );
    }

    const post = await prisma.blogPost.create({
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
            excerpt: t.intro ? t.intro.slice(0, 200) + (t.intro.length > 200 ? '...' : '') : '',
            intro: t.intro,
            sections: JSON.stringify(t.sections || []),
          })),
        },
      },
      include: {
        translations: true,
        category: {
          include: { translations: true },
        },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
