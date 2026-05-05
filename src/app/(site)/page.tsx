import { getHeroSlides, getServices, getStatistics, getTeamMembers, getBlogPosts, getContactInfo, getSettings, getLang } from '@/lib/data';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import About from '@/components/About';
import Statistics from '@/components/Statistics';
import Team from '@/components/Team';
import Blog from '@/components/Blog';
import Contact from '@/components/Contact';

export default async function Home() {
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
    { icon: settings.home_about_f1_icon || '📚', title: settings.home_about_f1_title || 'Множество успешных дел', description: settings.home_about_f1_desc || 'Наша команда успешно завершила множество дел в различных сферах права' },
    { icon: settings.home_about_f2_icon || '⚖️', title: settings.home_about_f2_title || 'Профессиональные юристы', description: settings.home_about_f2_desc || 'Опытные адвокаты предоставляют индивидуальные юридические консультации' },
    { icon: settings.home_about_f3_icon || '💼', title: settings.home_about_f3_title || 'Более 10 лет опыта', description: settings.home_about_f3_desc || 'Наш стратегический подход основан на десятилетнем опыте работы' },
  ];

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
      <Statistics stats={stats} />
      <Team members={members} lang={lang} />
      <Blog posts={posts} />
      <Contact contactInfo={contactInfo} lang={lang} />
    </>
  );
}
