'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';
import SessionProvider from '@/components/admin/SessionProvider';

interface HeroSlide {
  id: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
  translations: {
    language: string;
    title: string;
    subtitle: string;
  }[];
}

export default function AdminSlidesPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const res = await fetch('/api/admin/slides');
      const data = await res.json();
      setSlides(data);
    } catch (error) {
      console.error('Error fetching slides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот слайд?')) return;

    try {
      await fetch(`/api/admin/slides/${id}`, { method: 'DELETE' });
      setSlides(slides.filter((s) => s.id !== id));
    } catch (error) {
      console.error('Error deleting slide:', error);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await fetch(`/api/admin/slides/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });
      setSlides(
        slides.map((s) => (s.id === id ? { ...s, isActive: !isActive } : s))
      );
    } catch (error) {
      console.error('Error toggling slide:', error);
    }
  };

  return (
    <SessionProvider>
      <AdminLayout title="Управление слайдером">
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Слайды</h2>
            <Link href="/admin/slides/new" className="admin-btn admin-btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Добавить слайд
            </Link>
          </div>

          {loading ? (
            <div className="admin-loading">
              <div className="admin-spinner"></div>
            </div>
          ) : slides.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">📷</div>
              <p>Слайдов пока нет</p>
              <Link href="/admin/slides/new" className="admin-btn admin-btn-primary" style={{ marginTop: '16px' }}>
                Добавить первый слайд
              </Link>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Изображение</th>
                  <th>Заголовок (RU)</th>
                  <th>Порядок</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {slides.map((slide) => {
                  const ruTranslation = slide.translations.find(
                    (t) => t.language === 'ru'
                  );
                  return (
                    <tr key={slide.id}>
                      <td>
                        <Image
                          src={slide.imageUrl}
                          alt={ruTranslation?.title || 'Slide'}
                          width={80}
                          height={50}
                          className="admin-table-image"
                          style={{ objectFit: 'cover' }}
                        />
                      </td>
                      <td>{ruTranslation?.title || '-'}</td>
                      <td>{slide.order}</td>
                      <td>
                        <span
                          className={`admin-badge ${
                            slide.isActive
                              ? 'admin-badge-success'
                              : 'admin-badge-danger'
                          }`}
                        >
                          {slide.isActive ? 'Активен' : 'Неактивен'}
                        </span>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <Link
                            href={`/admin/slides/${slide.id}`}
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                          >
                            Редактировать
                          </Link>
                          <button
                            onClick={() =>
                              handleToggleActive(slide.id, slide.isActive)
                            }
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                          >
                            {slide.isActive ? 'Скрыть' : 'Показать'}
                          </button>
                          <button
                            onClick={() => handleDelete(slide.id)}
                            className="admin-btn admin-btn-danger admin-btn-sm"
                          >
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
