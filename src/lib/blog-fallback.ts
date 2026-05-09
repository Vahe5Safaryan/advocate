/**
 * Static blog posts when the DB has no published items — matches seed slugs in prisma/seed.ts
 * so list + detail routes stay consistent without a database.
 */

export type SiteLang = 'ru' | 'en' | 'hy';

export type BlogFallbackListItem = {
  id: string;
  slug: string;
  category: string;
  publishedAt: string;
  title: string;
  excerpt: string;
  imageUrl?: string;
};

type Section = { title: string; content: string };

type BlogFallbackDetail = {
  id: string;
  slug: string;
  imageUrl: string;
  publishedAt: string;
  category: string;
  title: string;
  introTitle: string;
  excerpt: string;
  intro: string;
  sections: Section[];
};

type LangBlock = {
  title: string;
  introTitle: string;
  excerpt: string;
  intro: string;
  sections: Section[];
};

const FALLBACK_POSTS: Array<{
  id: string;
  slug: string;
  category: Record<SiteLang, string>;
  publishedAt: string;
  ru: LangBlock;
  en: LangBlock;
  hy: LangBlock;
}> = [
  {
    id: 'fb-tax-changes-2024',
    slug: 'tax-changes-2024',
    category: {
      ru: 'Налоговое право',
      en: 'Tax Law',
      hy: 'Հարկային իրավունք',
    },
    publishedAt: '2024-03-15T12:00:00.000Z',
    ru: {
      title: 'Изменения в налоговом законодательстве Армении в 2024 году',
      introTitle: 'Ключевые поправки',
      excerpt:
        'Обзор ключевых изменений в налоговом кодексе, которые вступят в силу в новом году.',
      intro:
        'В 2024 году вступают в силу ряд изменений налогового законодательства Республики Армения. Ниже приведён обзор основных новелл для бизнеса и физических лиц.',
      sections: [
        {
          title: 'Основные изменения',
          content:
            'Пересмотрены ставки и сроки подачи деклараций для отдельных категорий налогоплательщиков. Рекомендуем заранее проконсультироваться с бухгалтерией или юристом.',
        },
      ],
    },
    en: {
      title: 'Changes to Armenian tax law in 2024',
      introTitle: 'Key amendments',
      excerpt: 'Overview of major changes to the tax code taking effect in the new year.',
      intro:
        'Several amendments to Armenia’s tax legislation take effect in 2024. Below is an overview of the main updates for businesses and individuals.',
      sections: [
        {
          title: 'Key changes',
          content:
            'Rates and filing deadlines have been revised for certain taxpayer categories. Consult your accountant or lawyer early.',
        },
      ],
    },
    hy: {
      title: '2024 թվականին Հայաստանի հարկային օրենսդրության փոփոխություններ',
      introTitle: 'Հիմնական ուղղումներ',
      excerpt: 'Հարկային օրենսգրքի հիմնական փոփոխությունների համառոտ նկարագիր:',
      intro:
        '2024 թվականին ուժի մեջ են մտնում Հայաստանի հարկային օրենսդրության մի շարք փոփոխություններ:',
      sections: [
        {
          title: 'Հիմնական փոփոխություններ',
          content:
            'Վերանայվել են դրույքաչափերը և ներկայացման ժամկետները որոշ կատեգորիաների համար:',
        },
      ],
    },
  },
  {
    id: 'fb-labor-disputes',
    slug: 'labor-disputes',
    category: {
      ru: 'Трудовое право',
      en: 'Labor Law',
      hy: 'Աշխատանքային իրավունք',
    },
    publishedAt: '2024-03-10T12:00:00.000Z',
    ru: {
      title: 'Как защитить свои права при трудовых спорах',
      introTitle: 'Практические рекомендации',
      excerpt:
        'Практические советы по защите трудовых прав и разрешению конфликтов с работодателем.',
      intro:
        'Трудовые споры требуют грамотного документооборота и соблюдения процедур. В статье собраны базовые шаги для защиты интересов работника или работодателя.',
      sections: [
        {
          title: 'Документы и сроки',
          content:
            'Сохраняйте трудовой договор, приказы и переписку. Соблюдайте сроки обращения в инспекцию труда или суд.',
        },
      ],
    },
    en: {
      title: 'How to protect your rights in labor disputes',
      introTitle: 'Practical guidance',
      excerpt: 'Practical tips on labor rights and resolving conflicts with an employer.',
      intro:
        'Labor disputes require solid documentation and procedural care. This article outlines basic steps to protect employee or employer interests.',
      sections: [
        {
          title: 'Documents and deadlines',
          content:
            'Keep your contract, orders, and correspondence. Respect deadlines for labor inspectorate or court filings.',
        },
      ],
    },
    hy: {
      title: 'Ինչպես պաշտպանել ձեր իրավունքները աշխատանքային վեճերի ժամանակ',
      introTitle: 'Գործնական խորհուրդներ',
      excerpt:
        'Խորհուրդներ աշխատանքային իրավունքների պաշտպանության և գործատուի հետ հակամարտությունների լուծման վերաբերյալ:',
      intro:
        'Աշխատանքային վեճերը պահանջում են ճիշտ փաստաթղթավորում և ընթացակարգերի պահպանում:',
      sections: [
        {
          title: 'Փաստաթղթեր և ժամկետներ',
          content: 'Պահպանեք պայմանագիրը, հրամանները և նամակագրությունը:',
        },
      ],
    },
  },
  {
    id: 'fb-business-registration',
    slug: 'business-registration',
    category: {
      ru: 'Корпоративное право',
      en: 'Corporate Law',
      hy: 'Կորպորատիվ իրավունք',
    },
    publishedAt: '2024-03-05T12:00:00.000Z',
    ru: {
      title: 'Регистрация бизнеса в Армении: пошаговое руководство',
      introTitle: 'С чего начать',
      excerpt: 'Полное руководство по регистрации компании для иностранных инвесторов.',
      intro:
        'Армения предлагает прозрачные процедуры регистрации юридических лиц. Ниже приведена упрощённая последовательность шагов для иностранных инвесторов.',
      sections: [
        {
          title: 'Этапы регистрации',
          content:
            'Выбор организационно-правовой формы, учреждение, государственная регистрация и налоговый учёт.',
        },
      ],
    },
    en: {
      title: 'Business registration in Armenia: a step-by-step guide',
      introTitle: 'Where to start',
      excerpt: 'A practical guide to company registration for foreign investors.',
      intro:
        'Armenia offers transparent procedures for registering legal entities. Below is a simplified sequence for foreign investors.',
      sections: [
        {
          title: 'Registration steps',
          content:
            'Choose a legal form, incorporate, complete state registration, and tax enrollment.',
        },
      ],
    },
    hy: {
      title: 'Բիզնեսի գրանցում Հայաստանում. քայլ առ քայլ ուղեցույց',
      introTitle: 'Որտեղից սկսել',
      excerpt: 'Ընկերության գրանցման ամբողջական ուղեցույց օտարերկրյա ներդրողների համար:',
      intro:
        'Հայաստանում իրավաբանական անձանց գրանցումը բավական թափանցիկ ընթացակարգ է:',
      sections: [
        {
          title: 'Գրանցման փուլեր',
          content:
            'Իրավաբանական ձևի ընտրություն, հիմնում, պետական գրանցում և հարկային հաշվառում:',
        },
      ],
    },
  },
];

export function getBlogFallbackList(lang: SiteLang): BlogFallbackListItem[] {
  return FALLBACK_POSTS.map((p) => {
    const t = p[lang];
    return {
      id: p.id,
      slug: p.slug,
      category: p.category[lang],
      publishedAt: p.publishedAt,
      title: t.title,
      excerpt: t.excerpt,
    };
  });
}

export function getBlogFallbackBySlug(slug: string, lang: SiteLang): BlogFallbackDetail | null {
  const p = FALLBACK_POSTS.find((x) => x.slug === slug);
  if (!p) return null;
  const t = p[lang];
  return {
    id: p.id,
    slug: p.slug,
    imageUrl: '',
    publishedAt: p.publishedAt,
    category: p.category[lang],
    title: t.title,
    introTitle: t.introTitle,
    excerpt: t.excerpt,
    intro: t.intro,
    sections: t.sections,
  };
}

/** Related cards when the DB returns no other posts (same shape as getBlogPosts list items). */
export function getBlogFallbackRelatedList(
  excludeSlug: string,
  lang: SiteLang,
  limit: number,
): BlogFallbackListItem[] {
  return getBlogFallbackList(lang)
    .filter((p) => p.slug !== excludeSlug)
    .slice(0, limit);
}
