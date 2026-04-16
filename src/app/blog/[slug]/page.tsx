import Link from 'next/link';
import Image from 'next/image';
import { Section } from '@/components/ui';
import '@/styles/blog-detail.css';

// Blog posts data
const blogPostsData: Record<string, {
  title: string;
  category: string;
  date: string;
  image: string;
  intro: string;
  sections: { title: string; content: string }[];
}> = {
  'tax-changes-2024': {
    title: 'Изменения в налоговом законодательстве Армении в 2024 году',
    category: 'Налоговое право',
    date: '15 марта 2024',
    image: '/images/team/team4.png',
    intro: 'Понимание изменений в налоговом законодательстве важно для каждого предпринимателя и физического лица. Независимо от того, ведёте ли вы бизнес, работаете по найму или планируете инвестиции, знание актуальных налоговых норм поможет избежать штрафов и оптимизировать налоговую нагрузку. Вместо того чтобы откладывать изучение изменений, своевременное ознакомление с новыми правилами значительно улучшит ваше финансовое планирование.',
    sections: [
      {
        title: 'Новые ставки подоходного налога',
        content: 'С 2024 года вступают в силу обновлённые ставки подоходного налога. Базовая ставка остаётся на уровне 20%, однако введены новые льготы для определённых категорий налогоплательщиков. Важно учитывать эти изменения при расчёте заработной платы и планировании доходов.'
      },
      {
        title: 'Изменения в НДС',
        content: 'Порог обязательной регистрации в качестве плательщика НДС был пересмотрен. Теперь компании с оборотом свыше 115 миллионов драмов обязаны регистрироваться как плательщики НДС. Также расширен перечень товаров и услуг, облагаемых по льготной ставке.'
      },
      {
        title: 'Налоговые льготы для IT-сектора',
        content: 'Правительство продолжает поддерживать IT-индустрию. Компании, работающие в сфере информационных технологий, могут рассчитывать на сниженную ставку налога на прибыль и освобождение от НДС при экспорте услуг.'
      }
    ]
  },
  'labor-disputes': {
    title: 'Как защитить свои права при трудовых спорах',
    category: 'Трудовое право',
    date: '10 марта 2024',
    image: '/images/team/team4.png',
    intro: 'Защита трудовых прав является важным аспектом профессиональной жизни каждого работника. Независимо от того, столкнулись ли вы с незаконным увольнением, задержкой заработной платы или нарушением условий труда, знание своих прав поможет эффективно отстоять свои интересы. Своевременное обращение за юридической помощью может существенно повысить шансы на успешное разрешение спора.',
    sections: [
      {
        title: 'Основные трудовые права работника',
        content: 'Каждый работник имеет право на своевременную оплату труда, безопасные условия работы, отпуск и социальные гарантии. Трудовой кодекс Армении защищает эти права и предусматривает ответственность работодателя за их нарушение.'
      },
      {
        title: 'Порядок разрешения трудовых споров',
        content: 'При возникновении спора рекомендуется сначала попытаться урегулировать конфликт путём переговоров с работодателем. Если это не помогает, можно обратиться в трудовую инспекцию или суд. Важно сохранять все документы, подтверждающие нарушение ваших прав.'
      },
      {
        title: 'Сроки обращения в суд',
        content: 'Законодательство устанавливает определённые сроки для обращения в суд по трудовым спорам. Как правило, этот срок составляет один месяц с момента, когда работник узнал о нарушении своих прав. Пропуск срока может стать основанием для отказа в иске.'
      }
    ]
  }
};

// Related posts
const relatedPosts = [
  {
    id: 1,
    title: 'Шаги по разрешению бизнес-споров',
    excerpt: 'Практические юридические стратегии для эффективного разрешения коммерческих конфликтов.',
    category: 'Юридические советы',
    image: '⚖️',
    href: '/blog/business-disputes'
  },
  {
    id: 2,
    title: 'Защита интеллектуальной собственности',
    excerpt: 'Как защитить авторские права и товарные знаки вашей компании.',
    category: 'Корпоративное право',
    image: '💡',
    href: '/blog/intellectual-property'
  },
  {
    id: 3,
    title: 'Договорные отношения: основы',
    excerpt: 'Ключевые аспекты составления и исполнения договоров.',
    category: 'Гражданское право',
    image: '📋',
    href: '/blog/contract-basics'
  }
];

// Default post for unknown slugs
const defaultPost = {
  title: 'Понимание ваших юридических прав',
  category: 'Юридические советы',
  date: '1 марта 2024',
  image: '/images/team/team4.png',
  intro: 'Понимание ваших юридических прав важно для каждого, кто хочет принимать обоснованные и уверенные решения. Независимо от того, имеете ли вы дело с контрактами, рабочими вопросами, имущественными делами или семейными проблемами, знание ваших прав по закону помогает избежать дорогостоящих ошибок и ненужных споров. Вместо того чтобы игнорировать юридические вопросы до обострения проблем, своевременное изучение основ может значительно улучшить вашу позицию и душевное спокойствие.',
  sections: [
    {
      title: 'Знайте свои основные юридические права',
      content: 'Каждый человек имеет фундаментальные права, защищённые законом, включая права на безопасность, собственность, договоры и справедливое обращение. Изучение этих прав позволяет распознать, когда границы нарушены и когда может потребоваться юридическая поддержка.'
    },
    {
      title: 'Понимайте договоры перед подписанием',
      content: 'Договоры создают обязательные обязательства. Всегда внимательно изучайте условия и убедитесь, что понимаете условия оплаты, сроки и обязанности. Получение разъяснений перед подписанием может предотвратить недоразумения и будущие споры.'
    },
    {
      title: 'Обращайтесь за профессиональной помощью',
      content: 'При возникновении сложных юридических вопросов не стесняйтесь обращаться к квалифицированным специалистам. Профессиональная консультация поможет избежать ошибок и защитить ваши интересы наиболее эффективным способом.'
    }
  ]
};

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPostsData[slug] || defaultPost;

  return (
    <>
      {/* Hero Section */}
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

      {/* Content Section */}
      <Section background="white">
        <div className="blog-detail-layout">
          {/* Main Content */}
          <article className="blog-detail-content">
            <Image
              src={post.image}
              alt={post.title}
              width={800}
              height={450}
              className="blog-detail-featured-image"
            />
            <div className="blog-detail-meta">
              <span className="blog-detail-date">{post.date}</span>
            </div>
            <p className="blog-detail-intro">{post.intro}</p>

            <div className="blog-detail-sections">
              {post.sections.map((section, index) => (
                <div key={index} className="blog-detail-section">
                  <div className="blog-detail-section-header">
                    <span className="blog-detail-section-number">{index + 1}</span>
                    <h2 className="blog-detail-section-title">{section.title}</h2>
                  </div>
                  <p className="blog-detail-section-content">{section.content}</p>
                </div>
              ))}
            </div>
          </article>

          {/* Sidebar */}
          <aside className="blog-detail-sidebar">
            <h3 className="blog-detail-sidebar-title">Похожие статьи</h3>
            <div className="blog-detail-related">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={relatedPost.href} className="blog-detail-related-card">
                  <div className="blog-detail-related-image">
                    <span className="blog-detail-related-icon">{relatedPost.image}</span>
                    <span className="blog-detail-related-category">{relatedPost.category}</span>
                  </div>
                  <div className="blog-detail-related-content">
                    <h4 className="blog-detail-related-title">{relatedPost.title}</h4>
                    <p className="blog-detail-related-excerpt">{relatedPost.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
