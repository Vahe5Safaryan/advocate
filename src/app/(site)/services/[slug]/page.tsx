import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Section } from '@/components/ui';
import { getServiceBySlug, getServices } from '@/lib/data';
import '@/styles/services-detail.css';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export default async function ServiceDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const [service, allServices] = await Promise.all([getServiceBySlug(slug), getServices()]);

  if (!service && allServices.length > 0) notFound();

  // Fallback data when DB is empty
  const s = service ?? {
    title: 'Юридические Услуги',
    heroTitle: 'Юридические Услуги',
    intro: ['Юридическая фирма NEW LEX предоставляет широкий спектр юридических услуг для физических и юридических лиц.'],
    sections: [{ title: 'Наши основные направления:', items: ['Гражданское право', 'Уголовное право', 'Корпоративное право'] }],
  };

  const sidebarItems = allServices.length > 0
    ? allServices
    : [
        { slug: 'criminal', icon: '⚖️', title: 'Уголовное Право' },
        { slug: 'civil', icon: '🛡️', title: 'Гражданское Право' },
        { slug: 'administrative', icon: '🏛️', title: 'Административное Право' },
        { slug: 'corporate', icon: '💼', title: 'Корпоративные Услуги' },
        { slug: 'accounting', icon: '🧮', title: 'Бухгалтерский Учет' },
        { slug: 'immigration', icon: '🌐', title: 'Защита Иностранцев' },
      ];

  return (
    <>
      <section className="service-detail-hero">
        <div className="service-detail-hero-overlay"></div>
        <div className="container service-detail-hero-content">
          <h1 className="service-detail-hero-title">{s.heroTitle}</h1>
          <div className="service-detail-breadcrumb">
            <Link href="/">Главная</Link>
            <span className="service-detail-breadcrumb-separator">/</span>
            <Link href="/services">Услуги</Link>
            <span className="service-detail-breadcrumb-separator">/</span>
            <span>{s.title}</span>
          </div>
        </div>
      </section>

      <Section background="white">
        <div className="service-detail-layout">
          <aside className="service-detail-sidebar">
            <h3 className="service-detail-sidebar-title">Наши Услуги</h3>
            <nav className="service-detail-nav">
              {sidebarItems.map((item) => (
                <Link
                  key={item.slug}
                  href={`/services/${item.slug}`}
                  className={`service-detail-nav-link ${slug === item.slug ? 'active' : ''}`}
                >
                  <span className="service-detail-nav-icon">{item.icon}</span>
                  <span className="service-detail-nav-text">{item.title}</span>
                  <span className="service-detail-nav-arrow">›</span>
                </Link>
              ))}
            </nav>
          </aside>

          <article className="service-detail-content">
            {'introTitle' in s && s.introTitle && (
              <h2 className="service-detail-section-title">{s.introTitle}</h2>
            )}

            {s.intro.map((paragraph, index) => (
              <p key={index} className="service-detail-paragraph">{paragraph}</p>
            ))}

            {s.sections.map((section, index) => (
              <div key={index} className="service-detail-section">
                {section.title && <h2 className="service-detail-section-title">{section.title}</h2>}
                {section.items.length > 0 && (
                  <ul className="service-detail-list">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                )}
                {'paragraphs' in section && section.paragraphs && section.paragraphs.map((para, pi) => (
                  <div key={pi} className="service-detail-para-block">
                    {para.title && <h3 className="service-detail-para-title">{para.title}</h3>}
                    {para.content && <p className="service-detail-paragraph">{para.content}</p>}
                  </div>
                ))}
              </div>
            ))}
          </article>
        </div>
      </Section>
    </>
  );
}
