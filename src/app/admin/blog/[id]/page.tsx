'use client';

import { useEffect, useState, use } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import SessionProvider from '@/components/admin/SessionProvider';
import BlogPostForm from '@/components/admin/BlogPostForm';

interface BlogPostData {
  id: string;
  slug: string;
  imageUrl: string | null;
  categoryId: string | null;
  publishedAt: string | null;
  isPublished: boolean;
  translations: {
    language: string;
    title: string;
    excerpt: string;
    intro: string;
    sections: string;
  }[];
}

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/admin/blog/${id}`);
        if (!res.ok) throw new Error('Статья не найдена');
        const data = await res.json();
        setPost(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  return (
    <SessionProvider>
      <AdminLayout title="Редактирование статьи">
        {loading ? (
          <div className="admin-card"><div className="admin-loading"><div className="admin-spinner"></div></div></div>
        ) : error ? (
          <div className="admin-card"><div className="admin-empty"><div className="admin-empty-icon">❌</div><p>{error}</p></div></div>
        ) : post ? (
          <BlogPostForm initialData={post} isEditing />
        ) : null}
      </AdminLayout>
    </SessionProvider>
  );
}
