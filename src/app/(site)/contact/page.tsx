import { Section } from '@/components/ui';
import { getContactInfo, getLang } from '@/lib/data';
import { L, tl } from '@/lib/labels';
import ContactPageForm from '@/components/ContactPageForm';
import '@/styles/contact-page.css';

const FALLBACK = [
  { id: '1', type: 'address', value: 'ул. Туманяна 8, Ереван, Армения', icon: '', link: '', label: 'Адрес' },
  { id: '2', type: 'email', value: 'contact@newlex.am', icon: '', link: 'mailto:contact@newlex.am', label: 'Email' },
  { id: '3', type: 'phone', value: '+374 10 123 456', icon: '', link: 'tel:+37410123456', label: 'Телефон' },
  { id: '4', type: 'phone2', value: '+374 10 123 457', icon: '', link: 'tel:+37410123457', label: 'Телефон 2' },
];

export default async function ContactPage() {
  const [items, lang] = await Promise.all([getContactInfo(), getLang()]);
  const contactInfo = items.length > 0 ? items : FALLBACK;

  return (
    <>
      <section className="contact-hero">
        <div className="contact-hero-overlay"></div>
        <div className="container contact-hero-content">
          <h1 className="contact-hero-title">{tl(L.contact, lang)}</h1>
        </div>
      </section>

      <Section background="white">
        <ContactPageForm contactInfo={contactInfo} lang={lang} />
      </Section>
    </>
  );
}
