'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import SessionProvider from '@/components/admin/SessionProvider';

interface BlogPost {
  id: string;
  slug: string;
  imageUrl: string | null;
  publishedAt: string | null;
  isPublished: boolean;
  translations: { language: string; title: string }[];
  category: { translations: { language: string; name: string }[] } | null;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/admin/blog');
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту статью?')) return;
    try {
      await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
      setPosts(posts.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    try {
      await fetch(`/api/admin/blog/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !isPublished }),
      });
      setPosts(posts.map((p) => (p.id === id ? { ...p, isPublished: !isPublished } : p)));
    } catch (error) {
      console.error('Error toggling post:', error);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('ru-RU');
  };

  return (
    <SessionProvider>
      <AdminLayout title="Управление блогом">
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Статьи</h2>
            <Link href="/admin/blog/new" className="admin-btn admin-btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Добавить статью
            </Link>
          </div>

          {loading ? (
            <div className="admin-loading"><div className="admin-spinner"></div></div>
          ) : posts.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">📝</div>
              <p>Статей пока нет</p>
              <Link href="/admin/blog/new" className="admin-btn admin-btn-primary" style={{ marginTop: '16px' }}>
                Добавить первую статью
              </Link>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Заголовок (RU)</th>
                  <th>Категория</th>
                  <th>Дата</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => {
                  const ruTitle = post.translations.find((t) => t.language === 'ru')?.title || '-';
                  const ruCategory = post.category?.translations.find((t) => t.language === 'ru')?.name || '-';
                  return (
                    <tr key={post.id}>
                      <td>{ruTitle}</td>
                      <td>{ruCategory}</td>
                      <td>{formatDate(post.publishedAt)}</td>
                      <td>
                        <span className={`admin-badge ${post.isPublished ? 'admin-badge-success' : 'admin-badge-danger'}`}>
                          {post.isPublished ? 'Опубликовано' : 'Черновик'}
                        </span>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <Link href={`/admin/blog/${post.id}`} className="admin-btn admin-btn-secondary admin-btn-sm">
                            Редактировать
                          </Link>
                          <button onClick={() => handleTogglePublish(post.id, post.isPublished)} className="admin-btn admin-btn-secondary admin-btn-sm">
                            {post.isPublished ? 'Скрыть' : 'Опубликовать'}
                          </button>
                          <button onClick={() => handleDelete(post.id)} className="admin-btn admin-btn-danger admin-btn-sm">
                            Удалить
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </AdminLayout>
    </SessionProvider>
  );
}
