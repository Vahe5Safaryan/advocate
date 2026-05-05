import { Section } from '@/components/ui';
import { getCaseStudies, getLang } from '@/lib/data';
import { L, tl } from '@/lib/labels';
import PaginatedList from '@/components/PaginatedList';
import '@/styles/blog-page.css';

const FALLBACK = [
  { id: '1', slug: 'fraud-defense', category: 'Уголовное право', publishedAt: '2024-03-15', title: 'Успешная защита в деле о мошенничестве', excerpt: 'Клиент был оправдан по обвинению в мошенничестве благодаря тщательному анализу доказательств.' },
  { id: '2', slug: 'debt-collection', category: 'Гражданское право', publishedAt: '2024-03-10', title: 'Взыскание задолженности в размере 50 млн драмов', excerpt: 'Представление интересов кредитора в споре о взыскании крупной суммы задолженности.' },
  { id: '3', slug: 'international-company', category: 'Корпоративное право', publishedAt: '2024-03-05', title: 'Регистрация международной компании', excerpt: 'Успешная регистрация филиала международной корпорации в Армении.' },
];

export default async function CasesPage() {
  const [cases, lang] = await Promise.all([getCaseStudies(), getLang()]);
  const data = cases.length > 0 ? cases : FALLBACK;

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
