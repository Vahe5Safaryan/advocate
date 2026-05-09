/**
 * Fallback roster when there are no `TeamMember` rows but the UI still shows
 * placeholder cards (same slugs must resolve on `/team/[slug]`).
 */

export type TeamFallbackCard = {
  id: string;
  slug: string;
  imageUrl: string;
  name: string;
  position: string;
};

export const TEAM_FALLBACK_MEMBERS: TeamFallbackCard[] = [
  { id: '1', slug: 'tatevik-malkhasyan', imageUrl: '/images/team/team1.jpg', name: 'Татевик Малхасян', position: 'Директор компании, Адвокат' },
  { id: '2', slug: 'andranik-mnatsakanyan', imageUrl: '/images/team/team2.jpg', name: 'Андраник Мнацаканян', position: 'Партнер, Адвокат' },
  { id: '3', slug: 'gurgen-nersisyan', imageUrl: '/images/team/team3.jpg', name: 'Гурген Нерсисян', position: 'Партнер, Адвокат' },
  { id: '4', slug: 'edgar-ayvazyan', imageUrl: '/images/team/team1.jpg', name: 'Эдгар Айвазян', position: 'Партнер, Адвокат' },
  { id: '5', slug: 'arsen-sardaryan', imageUrl: '/images/team/team2.jpg', name: 'Арсен Сардарян', position: 'Управляющий партнер' },
  { id: '6', slug: 'susanna-pambukchyan', imageUrl: '/images/team/team3.jpg', name: 'Сусанна Памбукчян', position: 'Главный бухгалтер' },
];

export type TeamMemberDetail = {
  id: string;
  slug: string;
  imageUrl: string;
  licenseNumber: string;
  name: string;
  position: string;
  bio: string[];
};

export function getTeamFallbackDetail(slug: string): TeamMemberDetail | null {
  const row = TEAM_FALLBACK_MEMBERS.find((r) => r.slug === slug);
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    imageUrl: row.imageUrl,
    licenseNumber: '',
    name: row.name,
    position: row.position,
    bio: [],
  };
}
