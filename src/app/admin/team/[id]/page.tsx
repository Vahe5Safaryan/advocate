'use client';

import { useEffect, useState, use } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import SessionProvider from '@/components/admin/SessionProvider';
import TeamMemberForm from '@/components/admin/TeamMemberForm';

interface TeamMemberData {
  id: string;
  slug: string;
  imageUrl: string;
  licenseNumber: string | null;
  order: number;
  isActive: boolean;
  translations: {
    language: string;
    name: string;
    position: string;
    bio: string;
  }[];
}

export default function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [teamMember, setTeamMember] = useState<TeamMemberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamMember = async () => {
      try {
        const res = await fetch(`/api/admin/team/${id}`);
        if (!res.ok) {
          throw new Error('Сотрудник не найден');
        }
        const data = await res.json();
        setTeamMember(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMember();
  }, [id]);

  return (
    <SessionProvider>
      <AdminLayout title="Редактирование сотрудника">
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
        ) : teamMember ? (
          <TeamMemberForm initialData={teamMember} isEditing />
        ) : null}
      </AdminLayout>
    </SessionProvider>
  );
}
