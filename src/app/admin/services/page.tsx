'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import SessionProvider from '@/components/admin/SessionProvider';

interface ServiceTranslation {
  language: string;
  title: string;
}

interface Service {
  id: string;
  slug: string;
  icon: string;
  order: number;
  isActive: boolean;
  translations: ServiceTranslation[];
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/admin/services');
      const data = await res.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту услугу?')) return;

    try {
      await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      setServices(services.filter((s) => s.id !== id));
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await fetch(`/api/admin/services/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });
      setServices(
        services.map((s) => (s.id === id ? { ...s, isActive: !isActive } : s))
      );
    } catch (error) {
      console.error('Error toggling service:', error);
    }
  };

  return (
    <SessionProvider>
      <AdminLayout title="Управление услугами">
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Услуги</h2>
            <Link href="/admin/services/new" className="admin-btn admin-btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Добавить услугу
            </Link>
          </div>

          {loading ? (
            <div className="admin-loading">
              <div className="admin-spinner"></div>
            </div>
          ) : services.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">⚖️</div>
              <p>Услуг пока нет</p>
              <Link href="/admin/services/new" className="admin-btn admin-btn-primary" style={{ marginTop: '16px' }}>
                Добавить первую услугу
              </Link>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Иконка</th>
                  <th>Название (RU)</th>
                  <th>Slug</th>
                  <th>Порядок</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => {
                  const ruTranslation = service.translations.find(
                    (t) => t.language === 'ru'
                  );
                  return (
                    <tr key={service.id}>
                      <td style={{ fontSize: '24px' }}>{service.icon}</td>
                      <td>{ruTranslation?.title || '-'}</td>
                      <td><code>{service.slug}</code></td>
                      <td>{service.order}</td>
                      <td>
                        <span
                          className={`admin-badge ${
                            service.isActive
                              ? 'admin-badge-success'
                              : 'admin-badge-danger'
                          }`}
                        >
                          {service.isActive ? 'Активна' : 'Неактивна'}
                        </span>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <Link
                            href={`/admin/services/${service.id}`}
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                          >
                            Редактировать
                          </Link>
                          <button
                            onClick={() =>
                              handleToggleActive(service.id, service.isActive)
                            }
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                          >
                            {service.isActive ? 'Скрыть' : 'Показать'}
                          </button>
                          <button
                            onClick={() => handleDelete(service.id)}
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
