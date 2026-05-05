'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import SessionProvider from '@/components/admin/SessionProvider';
import ServiceForm from '@/components/admin/ServiceForm';

export default function NewServicePage() {
  return (
    <SessionProvider>
      <AdminLayout title="Новая услуга">
        <ServiceForm />
      </AdminLayout>
    </SessionProvider>
  );
}
