import Link from 'next/link';
import Image from 'next/image';
import { Section } from '@/components/ui';
import '@/styles/blog-detail.css';

// Cases data
const casesData: Record<string, {
  title: string;
  category: string;
  date: string;
  image: string;
  intro: string;
  sections: { title: string; content: string }[];
}> = {
  'fraud-defense': {
    title: 'Успешная защита в деле о мошенничестве',
    category: 'Уголовное право',
    date: '15 марта 2024',
    image: '/images/team/team4.png',
    intro: 'Наш клиент был обвинён в мошенничестве на крупную сумму. Благодаря тщательному анализу доказательств и грамотной правовой стратегии, нам удалось добиться полного оправдания. Это дело демонстрирует важность качественной юридической защиты и детального изучения всех обстоятельств.',
    sections: [
      {
        title: 'Обстоятельства дела',
        content: 'Клиент был обвинён в совершении мошенничества в особо крупном размере. Следствие утверждало, что он получил денежные средства путём обмана. Однако детальный анализ документов показал наличие реальных договорных отношений.'
      },
      {
        title: 'Стратегия защиты',
        content: 'Мы собрали доказательства добросовестности клиента, привлекли экспертов для анализа финансовых документов и подготовили свидетелей, подтвердивших законность сделок. Была проведена работа по опровержению каждого пункта обвинения.'
      },
      {
        title: 'Результат',
        content: 'Суд полностью оправдал нашего клиента за отсутствием состава преступления. Обвинение не смогло доказать умысел на совершение мошенничества. Клиент был полностью реабилитирован.'
      }
    ]
  },
  'debt-collection': {
    title: 'Взыскание задолженности в размере 50 млн драмов',
    category: 'Гражданское право',
    date: '10 марта 2024',
    image: '/images/team/team4.png',
    intro: 'Представление интересов кредитора в сложном споре о взыскании крупной суммы задолженности по договору поставки. Несмотря на сопротивление должника и попытки скрыть активы, нам удалось добиться полного взыскания суммы.',
    sections: [
      {
        title: 'Обстоятельства дела',
        content: 'Наш клиент поставил товары на сумму 50 миллионов драмов, однако покупатель отказался оплачивать поставку, ссылаясь на ненадлежащее качество товара. При этом акты приёмки были подписаны без замечаний.'
      },
      {
        title: 'Судебный процесс',
        content: 'Мы подготовили исковое заявление с полным пакетом доказательств. В ходе судебного разбирательства опровергли все доводы ответчика о ненадлежащем качестве товара. Параллельно были приняты обеспечительные меры для предотвращения вывода активов.'
      },
      {
        title: 'Результат',
        content: 'Суд полностью удовлетворил наши требования. Задолженность была взыскана в полном объёме вместе с процентами за пользование чужими денежными средствами и судебными расходами.'
      }
    ]
  },
  'international-company': {
    title: 'Регистрация международной компании',
    category: 'Корпоративное право',
    date: '5 марта 2024',
    image: '/images/team/team4.png',
    intro: 'Успешное сопровождение регистрации филиала крупной международной корпорации в Армении. Проект включал полный комплекс юридических услуг: от подготовки документов до получения всех необходимых разрешений.',
    sections: [
      {
        title: 'Задача клиента',
        content: 'Международная IT-компания приняла решение открыть филиал в Армении для привлечения талантливых специалистов и оптимизации налоговой нагрузки. Требовалось провести регистрацию в кратчайшие сроки с соблюдением всех требований законодательства.'
      },
      {
        title: 'Выполненная работа',
        content: 'Мы подготовили полный пакет учредительных документов, провели регистрацию в государственных органах, открыли банковские счета и помогли с получением статуса IT-компании для применения налоговых льгот.'
      },
      {
        title: 'Результат',
        content: 'Филиал был зарегистрирован в течение двух недель. Компания получила все необходимые разрешения и начала операционную деятельность. Благодаря статусу IT-компании клиент экономит значительные средства на налогах.'
      }
    ]
  }
};

// Related cases
const relatedCases = [
  {
    id: 1,
    title: 'Защита в арбитражном разбирательстве',
    excerpt: 'Представление интересов компании в международном арбитраже.',
    category: 'Арбитраж',
    href: '/cases/arbitration-case'
  },
  {
    id: 2,
    title: 'Оспаривание решения налогового органа',
    excerpt: 'Отмена незаконного решения о доначислении налогов.',
    category: 'Налоговое право',
    href: '/cases/tax-dispute'
  },
  {
    id: 3,
    title: 'Трудовой спор о незаконном увольнении',
    excerpt: 'Восстановление работника на работе и взыскание компенсации.',
    category: 'Трудовое право',
    href: '/cases/wrongful-termination'
  }
];

// Default case for unknown slugs
const defaultCase = {
  title: 'Успешное завершение дела',
  category: 'Юридическая практика',
  date: '1 марта 2024',
  image: '/images/team/team4.png',
  intro: 'Наша команда успешно завершила сложное юридическое дело, продемонстрировав высокий профессионализм и глубокое знание законодательства. Благодаря тщательной подготовке и грамотной стратегии, интересы клиента были полностью защищены.',
  sections: [
    {
      title: 'Обстоятельства дела',
      content: 'Клиент обратился к нам со сложной правовой ситуацией, требующей комплексного подхода и глубокого анализа. Мы тщательно изучили все обстоятельства и разработали оптимальную стратегию.'
    },
    {
      title: 'Наш подход',
      content: 'Мы провели детальный анализ документов, собрали необходимые доказательства и подготовили правовую позицию. На каждом этапе клиент был проинформирован о ходе дела и возможных вариантах развития событий.'
    },
    {
      title: 'Результат',
      content: 'Дело было успешно завершено в пользу нашего клиента. Достигнутый результат полностью соответствовал поставленным целям и ожиданиям клиента.'
    }
  ]
};

export default async function CaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const caseData = casesData[slug] || defaultCase;

  return (
    <>
      {/* Hero Section with Image */}
      <section className="blog-detail-hero case-detail-hero">
        <div className="blog-detail-hero-overlay"></div>
        <div className="container blog-detail-hero-content">
          <span className="case-detail-category">{caseData.category}</span>
          <h1 className="blog-detail-hero-title">{caseData.title}</h1>
          <div className="blog-detail-breadcrumb">
            <Link href="/">Главная</Link>
            <span className="blog-detail-breadcrumb-separator">›</span>
            <Link href="/cases">Дела</Link>
            <span className="blog-detail-breadcrumb-separator">›</span>
            <span>{caseData.title}</span>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <Section background="white">
        <div className="blog-detail-layout">
          {/* Main Content */}
          <article className="blog-detail-content">
            <Image
              src={caseData.image}
              alt={caseData.title}
              width={800}
              height={450}
              className="blog-detail-featured-image"
            />
            <div className="case-detail-meta">
              <span className="case-detail-date">{caseData.date}</span>
            </div>

            <p className="blog-detail-intro">{caseData.intro}</p>

            <div className="blog-detail-sections">
              {caseData.sections.map((section, index) => (
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
            <h3 className="blog-detail-sidebar-title">Похожие дела</h3>
            <div className="blog-detail-related">
              {relatedCases.map((relatedCase) => (
                <Link key={relatedCase.id} href={relatedCase.href} className="blog-detail-related-card">
                  <div className="blog-detail-related-image case-related-image">
                    <span className="blog-detail-related-category">{relatedCase.category}</span>
                  </div>
                  <div className="blog-detail-related-content">
                    <h4 className="blog-detail-related-title">{relatedCase.title}</h4>
                    <p className="blog-detail-related-excerpt">{relatedCase.excerpt}</p>
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
