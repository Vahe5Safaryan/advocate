import { cookies } from 'next/headers';
import prisma from './prisma';

const SUPPORTED = ['ru', 'en', 'hy'] as const;
type Lang = (typeof SUPPORTED)[number];

export async function getLang(): Promise<Lang> {
  try {
    const store = await cookies();
    const v = store.get('site-lang')?.value;
    return (SUPPORTED as readonly string[]).includes(v ?? '') ? (v as Lang) : 'ru';
  } catch {
    // cookies() is unavailable in generateStaticParams (build time) — default to ru
    return 'ru';
  }
}

function pickT<T extends { language: string }>(arr: T[], lang: string): T | undefined {
  return arr.find((t) => t.language === lang) ?? arr[0];
}

// ─── Hero ────────────────────────────────────────────────────────────────────

export async function getHeroSlides() {
  const lang = await getLang();
  const slides = await prisma.heroSlide.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    include: { translations: true },
  });
  return slides.map((s) => {
    const tr = pickT(s.translations, lang);
    return {
      id: s.id,
      imageUrl: s.imageUrl,
      subtitle: tr?.subtitle ?? '',
      title: tr?.title ?? '',
      description: tr?.description ?? '',
      buttonText: tr?.buttonText ?? 'Позвонить',
    };
  });
}

// ─── Services ────────────────────────────────────────────────────────────────

export async function getServices() {
  const lang = await getLang();
  const items = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    include: { translations: true },
  });
  return items.map((s) => {
    const tr = pickT(s.translations, lang);
    return {
      id: s.id,
      slug: s.slug,
      icon: s.icon,
      title: tr?.title ?? '',
      heroTitle: tr?.heroTitle ?? '',
      introTitle: tr?.introTitle ?? '',
      items: tr?.items ? (JSON.parse(tr.items) as string[]) : [],
      intro: tr?.intro ? (JSON.parse(tr.intro) as string[]) : [],
      sections: tr?.sections
        ? (JSON.parse(tr.sections) as { title: string; items: string[]; paragraphs?: { title: string; content: string }[] }[])
        : [],
    };
  });
}

export async function getServiceBySlug(slug: string) {
  const lang = await getLang();
  const s = await prisma.service.findUnique({
    where: { slug },
    include: { translations: true },
  });
  if (!s) return null;
  const tr = pickT(s.translations, lang);
  return {
    id: s.id,
    slug: s.slug,
    icon: s.icon,
    title: tr?.title ?? '',
    heroTitle: tr?.heroTitle ?? '',
    introTitle: tr?.introTitle ?? '',
    items: tr?.items ? (JSON.parse(tr.items) as string[]) : [],
    intro: tr?.intro ? (JSON.parse(tr.intro) as string[]) : [],
    sections: tr?.sections
      ? (JSON.parse(tr.sections) as { title: string; items: string[]; paragraphs?: { title: string; content: string }[] }[])
      : [],
  };
}

// ─── Statistics ──────────────────────────────────────────────────────────────

export async function getStatistics() {
  const lang = await getLang();
  const items = await prisma.statistic.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    include: { translations: true },
  });
  return items.map((s) => ({
    id: s.id,
    number: parseInt(s.number) || 0,
    suffix: s.suffix,
    label: pickT(s.translations, lang)?.label ?? '',
  }));
}

// ─── Team ────────────────────────────────────────────────────────────────────

export async function getTeamMembers() {
  const lang = await getLang();
  const members = await prisma.teamMember.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    include: { translations: true },
  });
  return members.map((m) => {
    const tr = pickT(m.translations, lang);
    return {
      id: m.id,
      slug: m.slug,
      imageUrl: m.imageUrl,
      licenseNumber: m.licenseNumber ?? '',
      name: tr?.name ?? '',
      position: tr?.position ?? '',
      bio: tr?.bio ? (JSON.parse(tr.bio) as string[]) : [],
    };
  });
}

export async function getTeamMemberBySlug(slug: string) {
  const lang = await getLang();
  const m = await prisma.teamMember.findUnique({
    where: { slug },
    include: { translations: true },
  });
  if (!m) return null;
  const tr = pickT(m.translations, lang);
  return {
    id: m.id,
    slug: m.slug,
    imageUrl: m.imageUrl,
    licenseNumber: m.licenseNumber ?? '',
    name: tr?.name ?? '',
    position: tr?.position ?? '',
    bio: tr?.bio ? (JSON.parse(tr.bio) as string[]) : [],
  };
}

// ─── Blog ────────────────────────────────────────────────────────────────────

export async function getBlogPosts(limit?: number) {
  const lang = await getLang();
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
    take: limit,
    include: {
      translations: true,
      category: { include: { translations: true } },
    },
  });
  return posts.map((p) => {
    const tr = pickT(p.translations, lang);
    const catTr = p.category ? pickT(p.category.translations, lang) : null;
    return {
      id: p.id,
      slug: p.slug,
      imageUrl: p.imageUrl ?? '',
      publishedAt: p.publishedAt?.toISOString() ?? '',
      category: catTr?.name ?? '',
      title: tr?.title ?? '',
      introTitle: tr?.introTitle ?? '',
      excerpt: tr?.excerpt ?? tr?.intro?.slice(0, 200) ?? '',
      intro: tr?.intro ?? '',
      sections: tr?.sections
        ? (JSON.parse(tr.sections) as { title: string; content: string }[])
        : [],
    };
  });
}

export async function getBlogPostBySlug(slug: string) {
  const lang = await getLang();
  const p = await prisma.blogPost.findUnique({
    where: { slug },
    include: {
      translations: true,
      category: { include: { translations: true } },
    },
  });
  if (!p) return null;
  const tr = pickT(p.translations, lang);
  const catTr = p.category ? pickT(p.category.translations, lang) : null;
  return {
    id: p.id,
    slug: p.slug,
    imageUrl: p.imageUrl ?? '',
    publishedAt: p.publishedAt?.toISOString() ?? '',
    category: catTr?.name ?? '',
    title: tr?.title ?? '',
    introTitle: tr?.introTitle ?? '',
    excerpt: tr?.excerpt ?? tr?.intro?.slice(0, 200) ?? '',
    intro: tr?.intro ?? '',
    sections: tr?.sections
      ? (JSON.parse(tr.sections) as { title: string; content: string }[])
      : [],
  };
}

// ─── Cases ───────────────────────────────────────────────────────────────────

export async function getCaseStudies(limit?: number) {
  const lang = await getLang();
  const cases = await prisma.caseStudy.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
    take: limit,
    include: {
      translations: true,
      category: { include: { translations: true } },
    },
  });
  return cases.map((c) => {
    const tr = pickT(c.translations, lang);
    const catTr = c.category ? pickT(c.category.translations, lang) : null;
    return {
      id: c.id,
      slug: c.slug,
      imageUrl: c.imageUrl ?? '',
      publishedAt: c.publishedAt?.toISOString() ?? '',
      category: catTr?.name ?? '',
      title: tr?.title ?? '',
      introTitle: tr?.introTitle ?? '',
      excerpt: tr?.intro?.slice(0, 200) ?? '',
      intro: tr?.intro ?? '',
      sections: tr?.sections
        ? (JSON.parse(tr.sections) as { title: string; content: string }[])
        : [],
    };
  });
}

export async function getCaseStudyBySlug(slug: string) {
  const lang = await getLang();
  const c = await prisma.caseStudy.findUnique({
    where: { slug },
    include: {
      translations: true,
      category: { include: { translations: true } },
    },
  });
  if (!c) return null;
  const tr = pickT(c.translations, lang);
  const catTr = c.category ? pickT(c.category.translations, lang) : null;
  return {
    id: c.id,
    slug: c.slug,
    imageUrl: c.imageUrl ?? '',
    publishedAt: c.publishedAt?.toISOString() ?? '',
    category: catTr?.name ?? '',
    title: tr?.title ?? '',
    introTitle: tr?.introTitle ?? '',
    excerpt: tr?.intro?.slice(0, 200) ?? '',
    intro: tr?.intro ?? '',
    sections: tr?.sections
      ? (JSON.parse(tr.sections) as { title: string; content: string }[])
      : [],
  };
}

// ─── Contact ─────────────────────────────────────────────────────────────────

export async function getContactInfo() {
  const lang = await getLang();
  const items = await prisma.contactInfo.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    include: { translations: true },
  });
  return items.map((c) => ({
    id: c.id,
    type: c.type,
    value: c.value,
    icon: c.icon,
    link: c.link ?? '',
    label: pickT(c.translations, lang)?.label ?? c.type,
  }));
}

// ─── About ───────────────────────────────────────────────────────────────────

export async function getAboutTabs() {
  const lang = await getLang();
  const tabs = await prisma.aboutTab.findMany({
    orderBy: { order: 'asc' },
    include: { translations: true },
  });
  return tabs.map((t) => ({
    id: t.id,
    tabKey: t.tabKey,
    label: pickT(t.translations, lang)?.label ?? t.tabKey,
    content: pickT(t.translations, lang)?.content ?? '',
  }));
}

export async function getProcessSteps() {
  const lang = await getLang();
  const steps = await prisma.processStep.findMany({
    orderBy: { order: 'asc' },
    include: { translations: true },
  });
  return steps.map((s) => ({
    id: s.id,
    stepNumber: s.stepNumber,
    title: pickT(s.translations, lang)?.title ?? '',
    description: pickT(s.translations, lang)?.description ?? '',
  }));
}

export async function getPracticeAreas() {
  const lang = await getLang();
  const areas = await prisma.practiceArea.findMany({
    orderBy: { order: 'asc' },
    include: { translations: true },
  });
  return areas.map((a) => ({
    id: a.id,
    icon: a.icon,
    title: pickT(a.translations, lang)?.title ?? '',
    description: pickT(a.translations, lang)?.description ?? '',
  }));
}

// ─── Settings ────────────────────────────────────────────────────────────────

export async function getSettings() {
  const lang = await getLang();
  const settings = await prisma.siteSetting.findMany({
    include: { translations: true },
  });
  const map: Record<string, string> = {};
  settings.forEach((s) => {
    const tr = pickT(s.translations, lang);
    map[s.key] = tr?.value || s.value;
  });
  return map;
}

// ─── Menu ────────────────────────────────────────────────────────────────────

export async function getMenuItems() {
  const lang = await getLang();
  const items = await prisma.menuItem.findMany({
    where: { parentId: null, isActive: true },
    orderBy: { order: 'asc' },
    include: {
      translations: true,
      children: {
        where: { isActive: true },
        orderBy: { order: 'asc' },
        include: { translations: true },
      },
    },
  });
  return items.map((item) => ({
    id: item.id,
    href: item.href,
    title: pickT(item.translations, lang)?.title ?? '',
    children: item.children.map((child) => ({
      id: child.id,
      href: child.href,
      title: pickT(child.translations, lang)?.title ?? '',
    })),
  }));
}
