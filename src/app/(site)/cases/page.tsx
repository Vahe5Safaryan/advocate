import { waitForRequest } from '@/lib/next-connection';
import { Section } from '@/components/ui';
import { getCaseFallbackList } from '@/lib/cases-fallback';
import { getCaseStudies, getLang } from '@/lib/data';
import { L, tl } from '@/lib/labels';
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
          <h1 className="blog-hero-title">{tl(L.cases, lang)}</h1>
        </div>
      </section>

      <Section background="gray">
        <div className="blog-page-header">
          <span className="blog-page-label">{tl(L.cases_page_label, lang)}</span>
          <h2 className="blog-page-title">{tl(L.cases_page_title, lang)}</h2>
        </div>

        <PaginatedList items={data} basePath="/cases" perPage={12} lang={lang} variant="cases" />
      </Section>
    </>
  );
}
