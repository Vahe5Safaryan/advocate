'use client';

import { useEffect, useState, use } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import SessionProvider from '@/components/admin/SessionProvider';
import CaseStudyForm from '@/components/admin/CaseStudyForm';

interface CaseStudyData {
  id: string;
  slug: string;
  imageUrl: string | null;
  categoryId: string | null;
  publishedAt: string | null;
  isPublished: boolean;
  translations: {
    language: string;
    title: string;
    introTitle?: string;
    intro: string;
    sections: string;
  }[];
}

export default function EditCasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [caseData, setCaseData] = useState<CaseStudyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const res = await fetch(`/api/admin/cases/${id}`);
        if (!res.ok) throw new Error('Дело не найдено');
        const data = await res.json();
        setCaseData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    };
    fetchCase();
  }, [id]);

  return (
    <SessionProvider>
      <AdminLayout title="Редактирование дела">
        {loading ? (
          <div className="admin-card"><div className="admin-loading"><div className="admin-spinner"></div></div></div>
        ) : error ? (
          <div className="admin-card"><div className="admin-empty"><div className="admin-empty-icon">❌</div><p>{error}</p></div></div>
        ) : caseData ? (
          <CaseStudyForm initialData={caseData} isEditing />
        ) : null}
      </AdminLayout>
    </SessionProvider>
  );
}
