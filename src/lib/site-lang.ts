/** Supported public site locales (cookie `site-lang`). */
export const SITE_LANGS = ['ru', 'en', 'hy'] as const;
export type SiteLang = (typeof SITE_LANGS)[number];

export function isSiteLang(code: string): code is SiteLang {
  return (SITE_LANGS as readonly string[]).includes(code);
}
