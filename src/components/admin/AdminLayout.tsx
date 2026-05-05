'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminSidebar from './Sidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="admin-container">
        <div className="admin-loading" style={{ width: '100%', height: '100vh' }}>
          <div className="admin-spinner"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="admin-main">
        <header className="admin-header">
          <h1 className="admin-header-title">{title}</h1>
          <div className="admin-header-actions">
            <div className="admin-user-info">
              <div className="admin-user-avatar">
                {session.user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div>
                <div className="admin-user-name">{session.user?.name}</div>
                <div className="admin-user-role">{session.user?.role}</div>
              </div>
            </div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
