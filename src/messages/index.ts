import { isSiteLang, type SiteLang } from '@/lib/site-lang';
import { enMessages } from './en';
import { hyMessages } from './hy';
import { ruMessages, type MessageKey } from './ru';

export type { MessageKey } from './ru';

const messagesByLang: Record<SiteLang, Record<MessageKey, string>> = {
  ru: ruMessages,
  en: enMessages,
  hy: hyMessages,
};

const FALLBACK_ORDER: SiteLang[] = ['en', 'ru', 'hy'];

/** Resolve UI string: preferred language, then en → ru → hy. */
export function t(lang: string, key: MessageKey): string {
  const tried = new Set<SiteLang>();
  const primary = isSiteLang(lang) ? lang : null;
  const chain: SiteLang[] = [];
  if (primary) {
    chain.push(primary);
    tried.add(primary);
  }
  for (const code of FALLBACK_ORDER) {
    if (!tried.has(code)) {
      chain.push(code);
      tried.add(code);
    }
  }
  for (const code of chain) {
    const val = messagesByLang[code][key];
    if (val) return val;
  }
  return '';
}

export interface StatFallbackItem {
  id: string;
  number: number;
  suffix: string;
  label: string;
}

export function getStatisticsFallbackItems(lang: string): StatFallbackItem[] {
  return [
    { id: '1', number: 500, suffix: '+', label: t(lang, 'stats_fallback_1_label') },
    { id: '2', number: 10, suffix: '+', label: t(lang, 'stats_fallback_2_label') },
    { id: '3', number: 15, suffix: '', label: t(lang, 'stats_fallback_3_label') },
    { id: '4', number: 98, suffix: '%', label: t(lang, 'stats_fallback_4_label') },
  ];
}
