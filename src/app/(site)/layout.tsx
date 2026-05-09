import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getMenuItems, getSettings } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
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
