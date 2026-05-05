import Link from 'next/link';
import { getContactInfo, getMenuItems, getServices, getSettings } from '@/lib/data';
import '@/styles/footer.css';

const SOCIAL_KEYS = [
  { key: 'social_facebook', icon: '📘', name: 'Facebook' },
  { key: 'social_instagram', icon: '📷', name: 'Instagram' },
  { key: 'social_linkedin', icon: '💼', name: 'LinkedIn' },
  { key: 'social_youtube', icon: '▶️', name: 'YouTube' },
];

const CONTACT_ICONS: Record<string, string> = {
  address: '📍',
  phone: '📞',
  email: '✉️',
};

export default async function Footer() {
  const [contactInfo, services, menuItems, settings] = await Promise.all([
    getContactInfo(),
    getServices(),
    getMenuItems(),
    getSettings(),
  ]);

  const description =
    settings.footer_description ||
    'Адвокатская контора «LSA» уже более 10 лет оказывает высококачественные юридические и бухгалтерские услуги в городе Ереван.';

  const currentYear = new Date().getFullYear();
  const copyright = (settings.copyright || `© ${currentYear} LSA Legal. Все права защищены.`)
    .replace(/\d{4}/, String(currentYear));

  const titleServices = settings.footer_title_services || 'Услуги';
  const titleCompany  = settings.footer_title_company  || 'Компания';
  const titleContacts = settings.footer_title_contacts || 'Контакты';

  const activeSocials = SOCIAL_KEYS.filter((s) => settings[s.key]);

  const visibleContacts = contactInfo;

  // Company nav links from DB (exclude home and services — shown separately)
  const companyLinks = menuItems.filter(
    (m) => m.href !== '/' && m.href !== '/services',
  );

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Company Info */}
          <div>
            <div className="footer-logo">
              <span className="footer-logo-gold">LSA</span>
              <span> Legal</span>
            </div>
            <p className="footer-description">{description}</p>
            {activeSocials.length > 0 && (
              <div className="footer-social">
                {activeSocials.map((social) => (
                  <Link
                    key={social.key}
                    href={settings[social.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-link"
                    aria-label={social.name}
                  >
                    <span className="footer-social-icon">{social.icon}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Services Links */}
          <div>
            <h4 className="footer-title">{titleServices}</h4>
            <ul className="footer-links">
              {services.slice(0, 5).map((svc) => (
                <li key={svc.id}>
                  <Link href={`/services/${svc.slug}`} className="footer-link">
                    {svc.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="footer-title">{titleCompany}</h4>
            <ul className="footer-links">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="footer-link">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info (no hours) */}
          <div>
            <h4 className="footer-title">{titleContacts}</h4>
            <ul className="footer-contact-list">
              {visibleContacts.map((item) => (
                <li key={item.id} className="footer-contact-item">
                  <span className="footer-contact-icon">
                    {item.icon || CONTACT_ICONS[item.type] || '📌'}
                  </span>
                  {item.link ? (
                    <Link href={item.link} className="footer-contact-link">
                      {item.value}
                    </Link>
                  ) : (
                    <span className="footer-contact-text">{item.value}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-copyright">
          <p className="footer-copyright-text">{copyright}</p>
        </div>
      </div>
    </footer>
  );
}
