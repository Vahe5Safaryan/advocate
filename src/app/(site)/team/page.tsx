import { waitForRequest } from '@/lib/next-connection';
import Link from 'next/link';
import Image from 'next/image';
import { Section } from '@/components/ui';
import { getTeamMembers, getLang } from '@/lib/data';
import { TEAM_FALLBACK_MEMBERS } from '@/lib/team-fallback';
import { t } from '@/messages';
import '@/styles/team-page.css';

export default async function TeamPage() {
  await waitForRequest();
  const [members, lang] = await Promise.all([getTeamMembers(), getLang()]);
  const data = members.length > 0 ? members : TEAM_FALLBACK_MEMBERS;

  return (
    <>
      <section className="team-hero">
        <div className="team-hero-overlay"></div>
        <div className="container team-hero-content">
          <h1 className="team-hero-title">{t(lang, 'team')}</h1>
        </div>
      </section>

      <Section background="gray">
        <div className="team-page-header">
          <span className="team-page-label">{t(lang, 'team_page_label')}</span>
          <h2 className="team-page-title">{t(lang, 'team_page_title')}</h2>
        </div>

        <div className="team-page-grid">
          {data.map((member) => (
            <Link href={`/team/${member.slug}`} key={member.id} className="team-page-card">
              <div className="team-page-card-image">
                <Image src={member.imageUrl} alt={member.name} fill className="team-page-card-img" />
              </div>
              <div className="team-page-card-info">
                <h3 className="team-page-card-name">{member.name}</h3>
                <p className="team-page-card-position">{member.position}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
