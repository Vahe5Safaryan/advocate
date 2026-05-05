import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Section } from '@/components/ui';
import { getBlogPostBySlug, getBlogPosts, getLang } from '@/lib/data';
import { L, tl } from '@/lib/labels';
import '@/styles/blog-detail.css';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const [post, allPosts, lang] = await Promise.all([getBlogPostBySlug(slug), getBlogPosts(3), getLang()]);

  if (!post) return notFound();

  const related = allPosts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      <section className="blog-detail-hero">
        <div className="blog-detail-hero-overlay"></div>
        <div className="container blog-detail-hero-content">
          <h1 className="blog-detail-hero-title">{post.title}</h1>
          <div className="blog-detail-breadcrumb">
            <Link href="/">Главная</Link>
            <span className="blog-detail-breadcrumb-separator">›</span>
            <Link href="/blog">Блог</Link>
            <span className="blog-detail-breadcrumb-separator">›</span>
            <span>{post.title}</span>
          </div>
        </div>
      </section>

      <Section background="white">
        <div className="blog-detail-layout">
          <article className="blog-detail-content">
            {post.imageUrl && (
              <Image
                src={post.imageUrl}
                alt={post.title}
                width={800}
                height={450}
                className="blog-detail-featured-image"
              />
            )}
            <div className="blog-detail-meta">
              {post.publishedAt && (
                <span className="blog-detail-date">
                  {(() => { const d = new Date(post.publishedAt); return `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`; })()}
                </span>
              )}
              {post.category && <span className="blog-detail-category">{post.category}</span>}
            </div>
            {'introTitle' in post && post.introTitle && (
              <h2 className="blog-detail-section-title" style={{ marginBottom: '16px' }}>{post.introTitle}</h2>
            )}
            <p className="blog-detail-intro">{post.intro}</p>

            <div className="blog-detail-sections">
              {post.sections.map((section, index) => (
                <div key={index} className="blog-detail-section">
                  <div className="blog-detail-section-header">
                    <h2 className="blog-detail-section-title">{section.title}</h2>
                  </div>
                  <p className="blog-detail-section-content">{section.content}</p>
                </div>
              ))}
            </div>
          </article>

          {related.length > 0 && (
            <aside className="blog-detail-sidebar">
              <h3 className="blog-detail-sidebar-title">{tl(L.related_articles, lang)}</h3>
              <div className="blog-detail-related">
                {related.map((p) => (
                  <Link key={p.id} href={`/blog/${p.slug}`} className="blog-detail-related-card">
                    <div className="blog-detail-related-image">
                      {p.imageUrl ? (
                        <Image src={p.imageUrl} alt={p.title} fill style={{ objectFit: 'cover' }} />
                      ) : (
                        <span className="blog-detail-related-icon">📰</span>
                      )}
                      <span className="blog-detail-related-category">{p.category}</span>
                    </div>
                    <div className="blog-detail-related-content">
                      <h4 className="blog-detail-related-title">{p.title}</h4>
                      <p className="blog-detail-related-excerpt">{p.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </aside>
          )}
        </div>
      </Section>
    </>
  );
}
