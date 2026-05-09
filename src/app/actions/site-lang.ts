'use server';

import { cookies } from 'next/headers';
import { isSiteLang } from '@/lib/site-lang';

/** Persists language for server components (Header cookie alone can lose the race with `router.refresh()`). */
export async function setSiteLang(code: string) {
  if (!isSiteLang(code)) return;
  const store = await cookies();
  store.set('site-lang', code, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    httpOnly: false,
  });
}
