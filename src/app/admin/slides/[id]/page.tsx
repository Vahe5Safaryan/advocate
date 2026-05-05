'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import SessionProvider from '@/components/admin/SessionProvider';
import SlideForm from '@/components/admin/SlideForm';

interface Translation {
  language: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
}

interface Slide {
  id: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
  translations: Translation[];
}

export default function EditSlidePage() {
  const params = useParams();
  const [slide, setSlide] = useState<Slide | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlide = async () => {
      try {
        const res = await fetch(`/api/admin/slides/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setSlide(data);
        }
      } catch (error) {
        console.error('Error fetching slide:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchSlide();
    }
  }, [params.id]);

  return (
    <SessionProvider>
      <AdminLayout title="Редактирование слайда">
        {loading ? (
          <div className="admin-loading">
            <div className="admin-spinner"></div>
          </div>
        ) : slide ? (
          <SlideForm initialData={slide} isEditing />
        ) : (
          <div className="admin-card">
            <div className="admin-empty">
              <p>Слайд не найден</p>
            </div>
          </div>
        )}
      </AdminLayout>
    </SessionProvider>
  );
}
