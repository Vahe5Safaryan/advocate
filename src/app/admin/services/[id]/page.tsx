'use client';

import { useEffect, useState, use } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import SessionProvider from '@/components/admin/SessionProvider';
import ServiceForm from '@/components/admin/ServiceForm';

interface ServiceData {
  id: string;
  slug: string;
  icon: string;
  order: number;
  isActive: boolean;
  translations: {
    language: string;
    title: string;
    heroTitle: string;
    items: string;
    intro: string;
    sections: string;
  }[];
}

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [service, setService] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch(`/api/admin/services/${id}`);
        if (!res.ok) {
          throw new Error('Услуга не найдена');
        }
        const data = await res.json();
        setService(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  return (
    <SessionProvider>
      <AdminLayout title="Редактирование услуги">
        {loading ? (
          <div className="admin-card">
            <div className="admin-loading">
              <div className="admin-spinner"></div>
            </div>
          </div>
        ) : error ? (
          <div className="admin-card">
            <div className="admin-empty">
              <div className="admin-empty-icon">❌</div>
              <p>{error}</p>
            </div>
          </div>
        ) : service ? (
          <ServiceForm initialData={service} isEditing />
        ) : null}
      </AdminLayout>
    </SessionProvider>
  );
}
