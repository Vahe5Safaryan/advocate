import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getLang, getMenuItems, getSettings } from '@/lib/data';
import type { SiteLang } from '@/lib/site-lang';
import { t } from '@/messages';
import type { Metadata } from 'next';
import { waitForRequest } from '@/lib/next-connection';

/** Avoid Prisma during `next build` when no DB is available (e.g. Docker image build). */
export const dynamic = 'force-dynamic';

function buildFallbackMenu(lang: SiteLang) {
  return [
    { id: '1', title: t(lang, 'home'), href: '/', children: [] },
    { id: '2', title: t(lang, 'services'), href: '/services', children: [] },
    { id: '3', title: t(lang, 'team'), href: '/team', children: [] },
    { id: '4', title: t(lang, 'cases'), href: '/cases', children: [] },
    { id: '5', title: t(lang, 'blog'), href: '/blog', children: [] },
    { id: '6', title: t(lang, 'about'), href: '/about', children: [] },
    { id: '7', title: t(lang, 'contact'), href: '/contact', children: [] },
  ];
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    title: t(lang, 'meta_title'),
    description: t(lang, 'meta_description'),
    keywords: t(lang, 'meta_keywords'),
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  await waitForRequest();
  const [menuItems, settings, lang] = await Promise.all([
    getMenuItems(),
    getSettings(),
    getLang(),
  ]);
  const fallbackMenu = buildFallbackMenu(lang);

  return (
    <>
      <Header
        menuItems={menuItems}
        fallbackMenu={fallbackMenu}
        initialLang={lang}
        phone={settings.phone || ''}
        phone2={settings.phone2 || ''}
        email={settings.email || ''}
      />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
