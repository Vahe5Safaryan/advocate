import { waitForRequest } from '@/lib/next-connection';
import { Section } from '@/components/ui';
import { getCaseFallbackList } from '@/lib/cases-fallback';
import { getCaseStudies, getLang } from '@/lib/data';
import { t } from '@/messages';
import PaginatedList from '@/components/PaginatedList';
import '@/styles/blog-page.css';

export default async function CasesPage() {
  await waitForRequest();
  const [cases, lang] = await Promise.all([getCaseStudies(), getLang()]);
  const data = cases.length > 0 ? cases : getCaseFallbackList(lang);

  return (
    <>
      <section className="blog-hero">
        <div className="blog-hero-overlay"></div>
        <div className="container blog-hero-content">
          <h1 className="blog-hero-title">{t(lang, 'cases')}</h1>
        </div>
      </section>

      <Section background="gray">
        <div className="blog-page-header">
          <span className="blog-page-label">{t(lang, 'cases_page_label')}</span>
          <h2 className="blog-page-title">{t(lang, 'cases_page_title')}</h2>
        </div>

        <PaginatedList items={data} basePath="/cases" perPage={12} readMoreText={t(lang, 'cases_read_more')} />
      </Section>
    </>
  );
}
