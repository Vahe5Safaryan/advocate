import { Metadata } from 'next';
import '@/styles/admin/admin.css';

export const metadata: Metadata = {
  title: 'LSA Admin Panel',
  description: 'Панель управления LSA Legal',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
