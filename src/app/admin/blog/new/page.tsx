'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import SessionProvider from '@/components/admin/SessionProvider';
import BlogPostForm from '@/components/admin/BlogPostForm';

export default function NewBlogPostPage() {
  return (
    <SessionProvider>
      <AdminLayout title="Новая статья">
        <BlogPostForm />
      </AdminLayout>
    </SessionProvider>
  );
}
