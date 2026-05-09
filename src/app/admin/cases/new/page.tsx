'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import SessionProvider from '@/components/admin/SessionProvider';
import CaseStudyForm from '@/components/admin/CaseStudyForm';

export default function NewCasePage() {
  return (
    <SessionProvider>
      <AdminLayout title="Новое дело">
        <CaseStudyForm />
      </AdminLayout>
    </SessionProvider>
  );
}
