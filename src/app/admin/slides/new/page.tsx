'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import SessionProvider from '@/components/admin/SessionProvider';
import SlideForm from '@/components/admin/SlideForm';

export default function NewSlidePage() {
  return (
    <SessionProvider>
      <AdminLayout title="Новый слайд">
        <SlideForm />
      </AdminLayout>
    </SessionProvider>
  );
}
