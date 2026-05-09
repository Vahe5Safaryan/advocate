import { Metadata } from 'next';
import '@/styles/admin/admin.css';

export const metadata: Metadata = {
  title: 'NEW LEX Admin Panel',
  description: '0000000Панель управления NEW LEX Legal',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
