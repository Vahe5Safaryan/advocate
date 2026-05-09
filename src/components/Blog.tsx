import Link from 'next/link';
import Image from 'next/image';
import { Button, SectionHeader, Section } from '@/components/ui';
import { getLang } from '@/lib/data';
import { L, tl } from '@/lib/labels';
import '@/styles/blog.css';

interface BlogPost {
  id: string;
  slug: string;
  category: string;
  publishedAt: string;
  title: string;
  excerpt: string;
  imageUrl?: string;
}

const FALLBACK: BlogPost[] = [
  { id: '1', slug: 'tax-changes-2024', category: 'Налоговое право', publishedAt: '2024-03-15', title: 'Изменения в налоговом законодательстве Армении в 2024 году', excerpt: 'Обзор ключевых изменений в налоговом кодексе, которые вступят в силу в новом году.' },
  { id: '2', slug: 'labor-disputes', category: 'Трудовое право', publishedAt: '2024-03-10', title: 'Как защитить свои права при трудовых спорах', excerpt: 'Практические советы по защите трудовых прав и разрешению конфликтов с работодателем.' },
  { id: '3', slug: 'business-registration', category: 'Корпоративное право', publishedAt: '2024-03-05', title: 'Регистрация бизнеса в Армении: пошаговое руководство', excerpt: 'Полное руководство по регистрации компании для иностранных инвесторов.' },
];

const READ_MORE: Record<string, string> = {
  ru: 'Читать далее',
  en: 'Read more',
  hy: 'Կարդալ ավելին',
};

function formatDate(iso: string) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return `${dd}-${mm}-${d.getFullYear()}`;
  } catch {
    return iso;
  }
}

export default async function Blog({ posts = [] }: { posts?: BlogPost[] }) {
  const lang = await getLang();
  const data = posts.length > 0 ? posts : FALLBACK;

  return (
    <Section background="gray">
      <SectionHeader
        subtitle={tl(L.blog_subtitle, lang)}
        title={tl(L.blog_title, lang)}
      />

      <div className="blog-grid">
        {data.map((post, index) => (
          <Link href={`/blog/${post.slug}`} key={post.id} className="blog-card-link">
            <article className="blog-card">
              <div className="blog-card-image">
                {post.imageUrl ? (
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <span className="blog-card-icon">📰</span>
                )}
                <span className="blog-card-category">{post.category}</span>
              </div>
              <div className="blog-card-content">
                <span className="blog-card-date">{formatDate(post.publishedAt)}</span>
                <h3 className="blog-card-title">{post.title}</h3>
                <p className="blog-card-excerpt">{post.excerpt}</p>
                <span className="blog-card-read-more">
                  {READ_MORE[lang] ?? READ_MORE.ru}
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </article>
          </Link>
        ))}
      </div>

      <div className="blog-footer">
        <Button href="/blog" variant="outline">
          {tl(L.blog_btn, lang)}
        </Button>
      </div>
    </Section>
  );
}
