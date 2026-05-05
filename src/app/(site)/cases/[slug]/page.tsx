import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Section } from '@/components/ui';
import { getCaseStudyBySlug, getCaseStudies, getLang } from '@/lib/data';
import { L, tl } from '@/lib/labels';
import '@/styles/blog-detail.css';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const cases = await getCaseStudies();
  return cases.map((c) => ({ slug: c.slug }));
}

export default async function CaseDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const [caseStudy, allCases, lang] = await Promise.all([getCaseStudyBySlug(slug), getCaseStudies(4), getLang()]);

  if (!caseStudy) return notFound();

  const related = allCases.filter((c) => c.slug !== slug).slice(0, 3);

  return (
    <>
      <section className="blog-detail-hero case-detail-hero">
        <div className="blog-detail-hero-overlay"></div>
        <div className="container blog-detail-hero-content">
          {caseStudy.category && <span className="case-detail-category">{caseStudy.category}</span>}
          <h1 className="blog-detail-hero-title">{caseStudy.title}</h1>
          <div className="blog-detail-breadcrumb">
            <Link href="/">Главная</Link>
            <span className="blog-detail-breadcrumb-separator">›</span>
            <Link href="/cases">Дела</Link>
            <span className="blog-detail-breadcrumb-separator">›</span>
            <span>{caseStudy.title}</span>
          </div>
        </div>
      </section>

      <Section background="white">
        <div className="blog-detail-layout">
          <article className="blog-detail-content">
            {caseStudy.imageUrl && (
              <Image
                src={caseStudy.imageUrl}
                alt={caseStudy.title}
                width={800}
                height={450}
                className="blog-detail-featured-image"
              />
            )}
            <div className="blog-detail-meta">
              {caseStudy.publishedAt && (
                <span className="blog-detail-date">
                  {(() => { const d = new Date(caseStudy.publishedAt); return `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`; })()}
                </span>
              )}
            </div>

            {'introTitle' in caseStudy && caseStudy.introTitle && (
              <h2 className="blog-detail-section-title" style={{ marginBottom: '16px' }}>{caseStudy.introTitle}</h2>
            )}
            <p className="blog-detail-intro">{caseStudy.intro}</p>

            <div className="blog-detail-sections">
              {caseStudy.sections.map((section, index) => (
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
              <h3 className="blog-detail-sidebar-title">{tl(L.related_cases, lang)}</h3>
              <div className="blog-detail-related">
                {related.map((c) => (
                  <Link key={c.id} href={`/cases/${c.slug}`} className="blog-detail-related-card">
                    <div className="blog-detail-related-image case-related-image">
                      {c.imageUrl ? (
                        <Image src={c.imageUrl} alt={c.title} fill style={{ objectFit: 'cover' }} />
                      ) : null}
                      <span className="blog-detail-related-category">{c.category}</span>
                    </div>
                    <div className="blog-detail-related-content">
                      <h4 className="blog-detail-related-title">{c.title}</h4>
                      <p className="blog-detail-related-excerpt">{c.excerpt}</p>
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
