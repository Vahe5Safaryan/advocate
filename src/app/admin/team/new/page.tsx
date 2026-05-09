'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import SessionProvider from '@/components/admin/SessionProvider';
import TeamMemberForm from '@/components/admin/TeamMemberForm';

export default function NewTeamMemberPage() {
  return (
    <SessionProvider>
      <AdminLayout title="Новый сотрудник">
        <TeamMemberForm />
      </AdminLayout>
    </SessionProvider>
  );
}
