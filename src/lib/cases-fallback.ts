/**
 * Static case studies when the DB has no published items — matches UI slugs on `/cases`
 * so list + detail routes work without a database.
 */

import type { SiteLang } from '@/lib/blog-fallback';

export type CaseFallbackListItem = {
  id: string;
  slug: string;
  category: string;
  publishedAt: string;
  title: string;
  excerpt: string;
  imageUrl?: string;
};

type Section = { title: string; content: string };

export type CaseFallbackDetail = {
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

const FALLBACK_CASES: Array<{
  id: string;
  slug: string;
  category: Record<SiteLang, string>;
  publishedAt: string;
  ru: LangBlock;
  en: LangBlock;
  hy: LangBlock;
}> = [
  {
    id: 'fb-fraud-defense',
    slug: 'fraud-defense',
    category: {
      ru: 'Уголовное право',
      en: 'Criminal Law',
      hy: 'Քրեական իրավունք',
    },
    publishedAt: '2024-03-15T12:00:00.000Z',
    ru: {
      title: 'Успешная защита в деле о мошенничестве',
      introTitle: 'Итог дела',
      excerpt:
        'Клиент был оправдан по обвинению в мошенничестве благодаря тщательному анализу доказательств.',
      intro:
        'Обвинение выдвигалось по статье о мошенничестве с крупным ущербом. Защита сосредоточилась на проверке цепочки доказательств, подтверждении добросовестности действий клиента и противоречиях в показаниях потерпевших.',
      sections: [
        {
          title: 'Стратегия защиты',
          content:
            'Были запрошены финансовые и банковские документы, проведена реконструкция сделок и привлечены эксперты. Суд учёл недостаточность доказательственной базы для признания вины.',
        },
        {
          title: 'Результат',
          content:
            'Приговором суда клиент признан невиновным; арест имущества и ограничительные меры сняты.',
        },
      ],
    },
    en: {
      title: 'Successful defense in a fraud case',
      introTitle: 'Outcome',
      excerpt:
        'The client was acquitted of fraud charges thanks to a careful review of the evidence.',
      intro:
        'Charges involved large-scale fraud. The defense focused on tracing evidence, demonstrating good faith, and inconsistencies in witness testimony.',
      sections: [
        {
          title: 'Defense strategy',
          content:
            'Financial records were obtained, transactions reconstructed, and experts consulted. The court found the evidence insufficient for a conviction.',
        },
        {
          title: 'Result',
          content:
            'The client was acquitted; seizures and restrictive measures were lifted.',
        },
      ],
    },
    hy: {
      title: 'Հաջող պաշտպանություն խարդախության գործով',
      introTitle: 'Գործի արդյունքը',
      excerpt:
        'Հաճախորդը արդարացվեց խարդախության մեղադրանքից՝ ապացույցների մանրակրկիտ վերլուծության շնորհիվ:',
      intro:
        'Մեղադրանքը կապված էր խոշոր վնասով խարդախության հետ: Պաշտպանությունը կենտրոնացած էր ապացույցների շղթայի ստուգման, հաճախորդի անկեղծ գործողությունների և վկաների ցուցմունքների հակասությունների վրա:',
      sections: [
        {
          title: 'Պաշտպանության ռազմավարություն',
          content:
            'Պահանջվեցին ֆինանսական փաստաթղթեր, վերակառուցվեցին գործարքները, ներգրավվեցին փորձագետներ: Դատարանը գտավ, որ մեղքը ապացուցված չէ:',
        },
        {
          title: 'Արդյունք',
          content:
            'Հաճախորդը ճանաչվեց անմեղ, կալանքները և սահմանափակումները հանվեցին:',
        },
      ],
    },
  },
  {
    id: 'fb-debt-collection',
    slug: 'debt-collection',
    category: {
      ru: 'Гражданское право',
      en: 'Civil Law',
      hy: 'Քաղաքացիական իրավունք',
    },
    publishedAt: '2024-03-10T12:00:00.000Z',
    ru: {
      title: 'Взыскание задолженности в размере 50 млн драмов',
      introTitle: 'Контекст спора',
      excerpt:
        'Представление интересов кредитора в споре о взыскании крупной суммы задолженности.',
      intro:
        'Кредитор обратился за взысканием задолженности по договору поставки. Должник оспаривал размер и сроки исполнения. Была проведена претензионная работа и подготовлено судебное производство.',
      sections: [
        {
          title: 'Правовая позиция',
          content:
            'Подтверждены акты приёмки, накладные и переписка. Рассчитаны неустойка и проценты в соответствии с договором и законом.',
        },
        {
          title: 'Результат',
          content:
            'Суд удовлетворил иск в полном объёме; взыскание обеспечено исполнительной надписью и работой с приставами.',
        },
      ],
    },
    en: {
      title: 'Recovery of 50 million AMD in debt',
      introTitle: 'Dispute background',
      excerpt:
        'Representing the creditor in a dispute over recovery of a substantial debt.',
      intro:
        'The creditor sought payment under a supply contract. The debtor disputed the amount and performance timeline. Pre-litigation steps were taken before filing suit.',
      sections: [
        {
          title: 'Legal position',
          content:
            'Delivery documents, invoices, and correspondence supported the claim. Penalties and interest were calculated per contract and statute.',
        },
        {
          title: 'Result',
          content:
            'The court granted the claim in full; enforcement followed through bailiffs.',
        },
      ],
    },
    hy: {
      title: '50 մլն դրամ պարտքի բռնագանձում',
      introTitle: 'Վեճի համատեքստ',
      excerpt:
        'Պարտատիրոջ ներկայացուցչություն մեծ գումարի պարտքի բռնագանձման վեճում:',
      intro:
        'Պարտատերը պահանջում էր վճարում մատակարարման պայմանագրով: Պարտապանը վիճարկում էր գումարը և ժամկետները: Կատարվեց նախապատրաստում դատական հայց ներկայացնելուց առաջ:',
      sections: [
        {
          title: 'Իրավական դիրքորոշում',
          content:
            'Հաստատվեցին ընդունման ակտերը, հաշիվները և նամակագրությունը: Տույժերը և տոկոսները հաշվարկվեցին պայմանագրով և օրենքով:',
        },
        {
          title: 'Արդյունք',
          content:
            'Դատարանը բավարարեց հայցը ամբողջությամբ, բռնագանձումը կատարվեց ընդ որում:',
        },
      ],
    },
  },
  {
    id: 'fb-international-company',
    slug: 'international-company',
    category: {
      ru: 'Корпоративное право',
      en: 'Corporate Law',
      hy: 'Կորպորատիվ իրավունք',
    },
    publishedAt: '2024-03-05T12:00:00.000Z',
    ru: {
      title: 'Регистрация международной компании',
      introTitle: 'Задача клиента',
      excerpt:
        'Успешная регистрация филиала международной корпорации в Армении.',
      intro:
        'Клиент планировал открытие филиала для ведения IT-услуг и найма персонала. Требовалось выбрать форму присутствия, оформить регистрацию и соблюсти налоговые обязательства.',
      sections: [
        {
          title: 'Этапы работы',
          content:
            'Подготовлены учредительные документы, получены регистрационные коды, настроен учёт НДС и фондов социального страхования.',
        },
        {
          title: 'Результат',
          content:
            'Филиал зарегистрирован, клиент получил полный пакет документов для открытия счёта и контрактов.',
        },
      ],
    },
    en: {
      title: 'Registration of an international company',
      introTitle: 'Client objectives',
      excerpt:
        'Successful registration of a branch of an international corporation in Armenia.',
      intro:
        'The client sought a branch for IT services and hiring. We structured presence, registration, and tax compliance.',
      sections: [
        {
          title: 'Work performed',
          content:
            'Corporate documents were filed, tax IDs obtained, and VAT and social contribution registration completed.',
        },
        {
          title: 'Result',
          content:
            'The branch was registered with a full document pack for banking and contracts.',
        },
      ],
    },
    hy: {
      title: 'Միջազգային ընկերության գրանցում',
      introTitle: 'Հաճախորդի նպատակը',
      excerpt:
        'Միջազգային կորպորացիայի մասնաճյուղի հաջող գրանցում Հայաստանում:',
      intro:
        'Հաճախորդը նախատեսում էր մասնաճյուղ IT ծառայությունների և աշխատակազմի համար: Պահանջվում էր ընտրել ներկայության ձևը, կատարել գրանցումը և պահպանել հարկային պարտավորությունները:',
      sections: [
        {
          title: 'Կատարված աշխատանք',
          content:
            'Պատրաստվեցին հիմնադիր փաստաթղթերը, ստացվեցին հարկային կոդերը, կարգավորվեցին ԱԱՀ և սոցապահովության հաշվառումները:',
        },
        {
          title: 'Արդյունք',
          content:
            'Մասնաճյուղը գրանցվեց, հաճախորդը ստացավ փաստաթղթերի ամբողջական փաթեթը հաշվեհամարի և պայմանագրերի համար:',
        },
      ],
    },
  },
];

export function getCaseFallbackList(lang: SiteLang): CaseFallbackListItem[] {
  return FALLBACK_CASES.map((c) => {
    const t = c[lang];
    return {
      id: c.id,
      slug: c.slug,
      category: c.category[lang],
      publishedAt: c.publishedAt,
      title: t.title,
      excerpt: t.excerpt,
    };
  });
}

export function getCaseFallbackBySlug(slug: string, lang: SiteLang): CaseFallbackDetail | null {
  const c = FALLBACK_CASES.find((x) => x.slug === slug);
  if (!c) return null;
  const t = c[lang];
  return {
    id: c.id,
    slug: c.slug,
    imageUrl: '',
    publishedAt: c.publishedAt,
    category: c.category[lang],
    title: t.title,
    introTitle: t.introTitle,
    excerpt: t.excerpt,
    intro: t.intro,
    sections: t.sections,
  };
}

export function getCaseFallbackRelatedList(
  excludeSlug: string,
  lang: SiteLang,
  limit: number,
): CaseFallbackListItem[] {
  return getCaseFallbackList(lang)
    .filter((p) => p.slug !== excludeSlug)
    .slice(0, limit);
}
