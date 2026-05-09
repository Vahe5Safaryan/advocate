import { connection } from "next/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getMenuItems, getSettings } from "@/lib/data";

/** Avoid Prisma during `next build` when no DB is available (e.g. Docker image build). */
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  await connection();
  const [menuItems, settings] = await Promise.all([getMenuItems(), getSettings()]);

  return (
    <>
      <Header
        menuItems={menuItems}
        phone={settings.phone || ''}
        phone2={settings.phone2 || ''}
        email={settings.email || ''}
      />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
