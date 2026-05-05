import { Section } from '@/components/ui';
import ContactPageForm from '@/components/ContactPageForm';
import '@/styles/contact-page.css';

interface ContactItem {
  id: string;
  type: string;
  value: string;
  icon: string;
  link: string;
  label: string;
}

export default function Contact({ contactInfo = [], lang = 'ru' }: { contactInfo?: ContactItem[]; lang?: string }) {
  return (
    <Section background="white">
      <ContactPageForm contactInfo={contactInfo} lang={lang} />
    </Section>
  );
}
