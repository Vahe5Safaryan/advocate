'use client';

import Link from 'next/link';
import { Button, SectionHeader, Section } from '@/components/ui';
import '@/styles/blog.css';

const blogPosts = [
  {
    id: 1,
    title: 'Изменения в налоговом законодательстве Армении в 2024 году',
    excerpt: 'Обзор ключевых изменений в налоговом кодексе, которые вступят в силу в новом году.',
    date: '15 марта 2024',
    category: 'Налоговое право',
    image: '📰',
    href: '/blog/tax-changes-2024',
  },
  {
    id: 2,
    title: 'Как защитить свои права при трудовых спорах',
    excerpt: 'Практические советы по защите трудовых прав и разрешению конфликтов с работодателем.',
    date: '10 марта 2024',
    category: 'Трудовое право',
    image: '⚖️',
    href: '/blog/labor-disputes',
  },
  {
    id: 3,
    title: 'Регистрация бизнеса в Армении: пошаговое руководство',
    excerpt: 'Полное руководство по регистрации компании для иностранных инвесторов.',
    date: '5 марта 2024',
    category: 'Корпоративное право',
    image: '🏢',
    href: '/blog/business-registration',
  },
];

export default function Blog() {
  return (
    <Section background="gray">
        <SectionHeader
          subtitle="Блог"
          title="Последние новости"
          description="Актуальные новости и полезные статьи о законодательстве Армении"
        />

        {/* Blog Grid */}
        <div className="blog-grid">
          {blogPosts.map((post) => (
            <Link href={post.href} key={post.id} className="blog-card-link">
              <article className="blog-card">
                <div className="blog-card-image">
                  <span className="blog-card-icon">{post.image}</span>
                  <span className="blog-card-category">{post.category}</span>
                </div>
                <div className="blog-card-content">
                  <span className="blog-card-date">{post.date}</span>
                  <h3 className="blog-card-title">{post.title}</h3>
                  <p className="blog-card-excerpt">{post.excerpt}</p>
                  <span className="blog-card-read-more">
                    Читать далее
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="blog-footer">
          <Button href="/blog" variant="outline">
            Все статьи
          </Button>
        </div>
    </Section>
  );
}
