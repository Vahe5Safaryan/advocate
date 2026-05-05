'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';
import SessionProvider from '@/components/admin/SessionProvider';

interface TeamMemberTranslation {
  language: string;
  name: string;
  position: string;
}

interface TeamMember {
  id: string;
  slug: string;
  imageUrl: string;
  licenseNumber: string | null;
  order: number;
  isActive: boolean;
  translations: TeamMemberTranslation[];
}

export default function AdminTeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const res = await fetch('/api/admin/team');
      const data = await res.json();
      setTeamMembers(data);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого сотрудника?')) return;

    try {
      await fetch(`/api/admin/team/${id}`, { method: 'DELETE' });
      setTeamMembers(teamMembers.filter((m) => m.id !== id));
    } catch (error) {
      console.error('Error deleting team member:', error);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await fetch(`/api/admin/team/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });
      setTeamMembers(
        teamMembers.map((m) => (m.id === id ? { ...m, isActive: !isActive } : m))
      );
    } catch (error) {
      console.error('Error toggling team member:', error);
    }
  };

  return (
    <SessionProvider>
      <AdminLayout title="Управление командой">
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Команда</h2>
            <Link href="/admin/team/new" className="admin-btn admin-btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Добавить сотрудника
            </Link>
          </div>

          {loading ? (
            <div className="admin-loading">
              <div className="admin-spinner"></div>
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">👥</div>
              <p>Сотрудников пока нет</p>
              <Link href="/admin/team/new" className="admin-btn admin-btn-primary" style={{ marginTop: '16px' }}>
                Добавить первого сотрудника
              </Link>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Фото</th>
                  <th>Имя (RU)</th>
                  <th>Должность (RU)</th>
                  <th>Порядок</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member) => {
                  const ruTranslation = member.translations.find(
                    (t) => t.language === 'ru'
                  );
                  return (
                    <tr key={member.id}>
                      <td>
                        <Image
                          src={member.imageUrl}
                          alt={ruTranslation?.name || 'Team member'}
                          width={50}
                          height={60}
                          className="admin-table-image"
                          style={{ objectFit: 'cover', borderRadius: '4px' }}
                        />
                      </td>
                      <td>{ruTranslation?.name || '-'}</td>
                      <td>{ruTranslation?.position || '-'}</td>
                      <td>{member.order}</td>
                      <td>
                        <span
                          className={`admin-badge ${
                            member.isActive
                              ? 'admin-badge-success'
                              : 'admin-badge-danger'
                          }`}
                        >
                          {member.isActive ? 'Активен' : 'Неактивен'}
                        </span>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <Link
                            href={`/admin/team/${member.id}`}
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                          >
                            Редактировать
                          </Link>
                          <button
                            onClick={() =>
                              handleToggleActive(member.id, member.isActive)
                            }
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                          >
                            {member.isActive ? 'Скрыть' : 'Показать'}
                          </button>
                          <button
                            onClick={() => handleDelete(member.id)}
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
