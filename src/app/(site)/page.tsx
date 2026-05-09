import { waitForRequest } from '@/lib/next-connection';
import { getHeroSlides, getServices, getStatistics, getTeamMembers, getBlogPosts, getContactInfo, getSettings, getLang } from '@/lib/data';
import { getStatisticsFallbackItems, t } from '@/messages';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import About from '@/components/About';
import Statistics from '@/components/Statistics';
import Team from '@/components/Team';
import Blog from '@/components/Blog';
import Contact from '@/components/Contact';

export default async function Home() {
  await waitForRequest();
  const [slides, services, stats, members, posts, contactInfo, settings, lang] = await Promise.all([
    getHeroSlides(),
    getServices(),
    getStatistics(),
    getTeamMembers(),
    getBlogPosts(3),
    getContactInfo(),
    getSettings(),
    getLang(),
  ]);

  const aboutFeatures = [
    {
      icon: settings.home_about_f1_icon || '📚',
      title: settings.home_about_f1_title || t(lang, 'about_feature_1_title'),
      description: settings.home_about_f1_desc || t(lang, 'about_feature_1_desc'),
    },
    {
      icon: settings.home_about_f2_icon || '⚖️',
      title: settings.home_about_f2_title || t(lang, 'about_feature_2_title'),
      description: settings.home_about_f2_desc || t(lang, 'about_feature_2_desc'),
    },
    {
      icon: settings.home_about_f3_icon || '💼',
      title: settings.home_about_f3_title || t(lang, 'about_feature_3_title'),
      description: settings.home_about_f3_desc || t(lang, 'about_feature_3_desc'),
    },
  ];

  const displayStats = stats.length > 0 ? stats : getStatisticsFallbackItems(lang);

  return (
    <>
      <Hero slides={slides} />
      <About
        title={settings.home_about_title}
        description={settings.home_about_description}
        statsNumber={settings.home_about_stats_number}
        statsLabel={settings.home_about_stats_label}
        youtubeUrl={settings.home_about_youtube}
        features={aboutFeatures}
      />
      <Services services={services} />
      <Statistics stats={displayStats} />
      <Team members={members} lang={lang} />
      <Blog posts={posts} />
      <Contact contactInfo={contactInfo} lang={lang} />
    </>
  );
}
