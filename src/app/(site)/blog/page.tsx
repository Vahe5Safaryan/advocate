import { Section } from '@/components/ui';
import { getBlogPosts, getLang } from '@/lib/data';
import { L, tl } from '@/lib/labels';
import PaginatedList from '@/components/PaginatedList';
import '@/styles/blog-page.css';

const FALLBACK = [
  { id: '1', slug: 'tax-changes-2024', category: 'Налоговое право', publishedAt: '2024-03-15', title: 'Изменения в налоговом законодательстве Армении в 2024 году', excerpt: 'Обзор ключевых изменений в налоговом кодексе, которые вступят в силу в новом году.' },
  { id: '2', slug: 'labor-disputes', category: 'Трудовое право', publishedAt: '2024-03-10', title: 'Как защитить свои права при трудовых спорах', excerpt: 'Практические советы по защите трудовых прав и разрешению конфликтов с работодателем.' },
  { id: '3', slug: 'business-registration', category: 'Корпоративное право', publishedAt: '2024-03-05', title: 'Регистрация бизнеса в Армении: пошаговое руководство', excerpt: 'Полное руководство по регистрации компании для иностранных инвесторов.' },
];

export default async function BlogPage() {
  const [posts, lang] = await Promise.all([getBlogPosts(), getLang()]);
  const data = posts.length > 0 ? posts : FALLBACK;

  return (
    <>
      <section className="blog-hero">
        <div className="blog-hero-overlay"></div>
        <div className="container blog-hero-content">
          <h1 className="blog-hero-title">{tl(L.blog, lang)}</h1>
        </div>
      </section>

      <Section background="gray">
        <div className="blog-page-header">
          <span className="blog-page-label">{tl(L.blog_page_label, lang)}</span>
          <h2 className="blog-page-title">{tl(L.blog_page_title, lang)}</h2>
        </div>

        <PaginatedList items={data} basePath="/blog" perPage={12} lang={lang} />
      </Section>
    </>
  );
}
