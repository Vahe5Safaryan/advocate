import { waitForRequest } from '@/lib/next-connection';
import { Section } from '@/components/ui';
import { getBlogPosts, getLang } from '@/lib/data';
import { getBlogFallbackList } from '@/lib/blog-fallback';
import { t } from '@/messages';
import PaginatedList from '@/components/PaginatedList';
import '@/styles/blog-page.css';

export default async function BlogPage() {
  await waitForRequest();
  const [posts, lang] = await Promise.all([getBlogPosts(), getLang()]);
  const data = posts.length > 0 ? posts : getBlogFallbackList(lang);

  return (
    <>
      <section className="blog-hero">
        <div className="blog-hero-overlay"></div>
        <div className="container blog-hero-content">
          <h1 className="blog-hero-title">{t(lang, 'blog')}</h1>
        </div>
      </section>

      <Section background="gray">
        <div className="blog-page-header">
          <span className="blog-page-label">{t(lang, 'blog_page_label')}</span>
          <h2 className="blog-page-title">{t(lang, 'blog_page_title')}</h2>
        </div>

        <PaginatedList items={data} basePath="/blog" perPage={12} readMoreText={t(lang, 'blog_read_more')} />
      </Section>
    </>
  );
}
