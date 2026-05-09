import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/blog/[id]
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        translations: true,
        category: {
          include: { translations: true },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}

// PUT /api/admin/blog/[id]
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { slug, imageUrl, categoryId, publishedAt, isPublished, translations } = body;

    const existing = await prisma.blogPost.findFirst({
      where: { slug, NOT: { id } },
    });

    if (existing) {
      return NextResponse.json({ error: 'Статья с таким slug уже существует' }, { status: 400 });
    }

    await prisma.blogPostTranslation.deleteMany({ where: { postId: id } });

    const post = await prisma.blogPost.update({
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

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

// PATCH /api/admin/blog/[id] - Partial update (toggle publish)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const post = await prisma.blogPost.update({
      where: { id },
      data: body,
      include: {
        translations: true,
        category: {
          include: { translations: true },
        },
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

// DELETE /api/admin/blog/[id]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}
