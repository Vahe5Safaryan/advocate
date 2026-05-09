import Link from 'next/link';
import { SectionHeader, Section } from '@/components/ui';
import { getLang } from '@/lib/data';
import { t } from '@/messages';
import '@/styles/about.css';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface AboutProps {
  title?: string;
  description?: string;
  statsNumber?: string;
  statsLabel?: string;
  youtubeUrl?: string;
  features?: Feature[];
}

export default async function About({
  title,
  description,
  statsNumber = '10+',
  statsLabel,
  youtubeUrl = 'https://www.youtube.com/watch?v=ksvLw74GK2E',
  features,
}: AboutProps) {
  const lang = await getLang();
  const displayTitle = title || t(lang, 'about_default_title');
  const displayDescription = description || t(lang, 'about_default_description');
  const displayStatsLabel = statsLabel || t(lang, 'about_stats_label_default');
  const displayFeatures: Feature[] =
    features && features.length > 0
      ? features
      : [
          {
            icon: '📚',
            title: t(lang, 'about_feature_1_title'),
            description: t(lang, 'about_feature_1_desc'),
          },
          {
            icon: '⚖️',
            title: t(lang, 'about_feature_2_title'),
            description: t(lang, 'about_feature_2_desc'),
          },
          {
            icon: '💼',
            title: t(lang, 'about_feature_3_title'),
            description: t(lang, 'about_feature_3_desc'),
          },
        ];

  return (
    <Section background="white">
      <div className="about-wrapper">
        <div className="about-content">
          <SectionHeader
            title={displayTitle}
            description={displayDescription}
            centered={false}
            className="light"
          />

          <div className="about-features">
            {displayFeatures.map((feature, index) => (
              <div key={index} className="about-feature">
                <div className="about-feature-icon">{feature.icon}</div>
                <div>
                  <h5 className="about-feature-title">{feature.title}</h5>
                  <p className="about-feature-description">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="about-image">
          <div className="about-stats-box">
            <div className="about-stats-number">{statsNumber}</div>
            <div className="about-stats-label">{displayStatsLabel}</div>
          </div>

          <Link href={youtubeUrl} target="_blank" className="about-play-btn">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </Link>
        </div>
      </div>
    </Section>
  );
}
