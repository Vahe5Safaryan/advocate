import { waitForRequest } from '@/lib/next-connection';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Section } from '@/components/ui';
import { getCaseFallbackBySlug, getCaseFallbackRelatedList } from '@/lib/cases-fallback';
import { getCaseStudyBySlug, getCaseStudies, getLang } from '@/lib/data';
import { t } from '@/messages';
import '@/styles/blog-detail.css';

export const dynamic = 'force-dynamic';

type Params = Promise<{ slug: string }>;

export default async function CaseDetailPage({ params }: { params: Params }) {
  await waitForRequest();
  const { slug } = await params;
  const [fromDb, allCases, lang] = await Promise.all([getCaseStudyBySlug(slug), getCaseStudies(4), getLang()]);

  const caseStudy =
    fromDb ?? (allCases.length === 0 ? getCaseFallbackBySlug(slug, lang) : null);
  if (!caseStudy) return notFound();

  const fromDbRelated = allCases.filter((c) => c.slug !== slug).slice(0, 3);
  const related =
    fromDbRelated.length > 0
      ? fromDbRelated
      : allCases.length === 0
        ? getCaseFallbackRelatedList(slug, lang, 3)
        : [];

  return (
    <>
      <section className="blog-detail-hero case-detail-hero">
        <div className="blog-detail-hero-overlay"></div>
        <div className="container blog-detail-hero-content">
          {caseStudy.category && <span className="case-detail-category">{caseStudy.category}</span>}
          <h1 className="blog-detail-hero-title">{caseStudy.title}</h1>
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
              <h3 className="blog-detail-sidebar-title">{t(lang, 'related_cases')}</h3>
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
