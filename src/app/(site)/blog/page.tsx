import { waitForRequest } from '@/lib/next-connection';
import { Section } from '@/components/ui';
import { getBlogPosts, getLang } from '@/lib/data';
import { getBlogFallbackList } from '@/lib/blog-fallback';
import { L, tl } from '@/lib/labels';
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
