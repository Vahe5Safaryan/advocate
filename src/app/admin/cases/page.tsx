'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import SessionProvider from '@/components/admin/SessionProvider';

interface CaseStudy {
  id: string;
  slug: string;
  imageUrl: string | null;
  publishedAt: string | null;
  isPublished: boolean;
  translations: { language: string; title: string }[];
  category: { translations: { language: string; name: string }[] } | null;
}

export default function AdminCasesPage() {
  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const res = await fetch('/api/admin/cases');
      const data = await res.json();
      setCases(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить это дело?')) return;
    try {
      await fetch(`/api/admin/cases/${id}`, { method: 'DELETE' });
      setCases(cases.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Error deleting case:', error);
    }
  };

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    try {
      await fetch(`/api/admin/cases/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !isPublished }),
      });
      setCases(cases.map((c) => (c.id === id ? { ...c, isPublished: !isPublished } : c)));
    } catch (error) {
      console.error('Error toggling case:', error);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('ru-RU');
  };

  return (
    <SessionProvider>
      <AdminLayout title="Управление делами">
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Дела (кейсы)</h2>
            <Link href="/admin/cases/new" className="admin-btn admin-btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Добавить дело
            </Link>
          </div>

          {loading ? (
            <div className="admin-loading"><div className="admin-spinner"></div></div>
          ) : cases.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">⚖️</div>
              <p>Дел пока нет</p>
              <Link href="/admin/cases/new" className="admin-btn admin-btn-primary" style={{ marginTop: '16px' }}>
                Добавить первое дело
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
                {cases.map((item) => {
                  const ruTitle = item.translations.find((t) => t.language === 'ru')?.title || '-';
                  const ruCategory = item.category?.translations.find((t) => t.language === 'ru')?.name || '-';
                  return (
                    <tr key={item.id}>
                      <td>{ruTitle}</td>
                      <td>{ruCategory}</td>
                      <td>{formatDate(item.publishedAt)}</td>
                      <td>
                        <span className={`admin-badge ${item.isPublished ? 'admin-badge-success' : 'admin-badge-danger'}`}>
                          {item.isPublished ? 'Опубликовано' : 'Черновик'}
                        </span>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <Link href={`/admin/cases/${item.id}`} className="admin-btn admin-btn-secondary admin-btn-sm">
                            Редактировать
                          </Link>
                          <button onClick={() => handleTogglePublish(item.id, item.isPublished)} className="admin-btn admin-btn-secondary admin-btn-sm">
                            {item.isPublished ? 'Скрыть' : 'Опубликовать'}
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="admin-btn admin-btn-danger admin-btn-sm">
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
