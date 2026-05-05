'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import '@/styles/header.css';

const FALLBACK_MENU = [
    { id: '1', title: 'Главная', href: '/', children: [] },
    { id: '2', title: 'Услуги', href: '/services', children: [] },
    { id: '3', title: 'Команда', href: '/team', children: [] },
    { id: '4', title: 'Дела', href: '/cases', children: [] },
    { id: '5', title: 'Блог', href: '/blog', children: [] },
    { id: '6', title: 'О нас', href: '/about', children: [] },
    { id: '7', title: 'Контакты', href: '/contact', children: [] },
];

interface MenuItem {
    id: string;
    title: string;
    href: string;
    children: { id: string; title: string; href: string }[];
}

const languages = [
    { code: 'hy', name: 'Հայ', flag: '🇦🇲' },
    { code: 'en', name: 'Eng', flag: '🇺🇸' },
    { code: 'ru', name: 'Ру', flag: '🇷🇺' },
];

function getCookieLang(): string {
    if (typeof document === 'undefined') return 'ru';
    const match = document.cookie.match(/(?:^|;\s*)site-lang=([^;]*)/);
    return match ? match[1] : 'ru';
}

export default function Header({
    menuItems = [],
    phone = '+374 (96) 374 374',
    phone2 = '',
    email = 'info@lsa.am',
}: {
    menuItems?: MenuItem[];
    phone?: string;
    phone2?: string;
    email?: string;
}) {
    const items = menuItems.length > 0 ? menuItems : FALLBACK_MENU;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
    const [currentLang, setCurrentLang] = useState(languages[0]);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    // Sync flag with cookie on mount
    useEffect(() => {
        const code = getCookieLang();
        const found = languages.find((l) => l.code === code);
        if (found) setCurrentLang(found);
    }, []);

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 100);
        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const switchLang = (lang: (typeof languages)[number]) => {
        document.cookie = `site-lang=${lang.code}; path=/; max-age=31536000`;
        setCurrentLang(lang);
        setIsLangOpen(false);
        router.refresh();
    };

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container">
                <div className="header-inner">
                    {/* Logo */}
                    <Link href="/" className="logo">
                        <div className="logo-text">
                            <span className="logo-gold">LSA</span>
                            <span className={isScrolled ? 'logo-dark' : 'logo-light'}> Legal</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="nav-desktop">
                        {items.map((item) => (
                            <div
                                key={item.href}
                                className="nav-item"
                                onMouseEnter={() => item.children.length > 0 && setActiveSubmenu(item.href)}
                                onMouseLeave={() => setActiveSubmenu(null)}
                            >
                                {item.children.length > 0 ? (
                                    <Link
                                        href={item.href}
                                        className={`nav-link nav-link-btn ${isScrolled ? 'dark' : 'light'} ${isActive(item.href) ? 'active' : ''}`}
                                    >
                                        {item.title}
                                        <span className={`nav-arrow ${activeSubmenu === item.href ? 'open' : ''}`}>▼</span>
                                    </Link>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className={`nav-link ${isScrolled ? 'dark' : 'light'} ${isActive(item.href) ? 'active' : ''}`}
                                    >
                                        {item.title}
                                    </Link>
                                )}

                                {item.children.length > 0 && activeSubmenu === item.href && (
                                    <div className="dropdown">
                                        {item.children.map((subItem) => (
                                            <Link
                                                key={subItem.href}
                                                href={subItem.href}
                                                className="dropdown-link"
                                            >
                                                {subItem.title}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Language Switcher */}
                        <div className="lang-switcher">
                            <button
                                className={`lang-btn ${isScrolled ? 'dark' : 'light'}`}
                                onClick={() => setIsLangOpen(!isLangOpen)}
                            >
                                <span>{currentLang.name}</span>
                                <span className="lang-arrow">▼</span>
                            </button>

                            {isLangOpen && (
                                <div className="lang-dropdown">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => switchLang(lang)}
                                            className={`lang-option ${currentLang.code === lang.code ? 'active' : ''}`}
                                        >
                                            <span>{lang.flag}</span>
                                            <span>{lang.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* Contact Info */}
                    <div className="header-contact">
                        <div className="phone-icon">
                            <svg fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                        </div>
                        <div>
                            <p className="phone-number">{phone || '+374 (96) 374 374'}</p>
                            {phone2 && <p className="phone-number">{phone2}</p>}
                            <p className={`phone-email ${isScrolled ? '' : 'light'}`}>{email || 'info@lsa.am'}</p>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="menu-btn"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <div className="menu-btn-inner">
                            <span className={`menu-btn-line ${isScrolled ? 'dark' : ''}`}></span>
                            <span className={`menu-btn-line ${isScrolled ? 'dark' : ''}`}></span>
                            <span className={`menu-btn-line ${isScrolled ? 'dark' : ''}`}></span>
                        </div>
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
                    <nav>
                        {items.map((item) => (
                            <div key={item.href}>
                                {item.children.length > 0 ? (
                                    <div className="mobile-nav-item-with-submenu">
                                        <Link
                                            href={item.href}
                                            className={`mobile-nav-link ${isActive(item.href) ? 'active' : ''}`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {item.title}
                                        </Link>
                                        <button
                                            className="mobile-submenu-toggle"
                                            onClick={() => setMobileSubmenu(mobileSubmenu === item.href ? null : item.href)}
                                        >
                                            <span className={`mobile-arrow ${mobileSubmenu === item.href ? 'open' : ''}`}>▼</span>
                                        </button>
                                    </div>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className={`mobile-nav-link ${isActive(item.href) ? 'active' : ''}`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item.title}
                                    </Link>
                                )}
                                {item.children.length > 0 && mobileSubmenu === item.href && (
                                    <div className="mobile-submenu">
                                        {item.children.map((subItem) => (
                                            <Link
                                                key={subItem.href}
                                                href={subItem.href}
                                                className="mobile-submenu-link"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                {subItem.title}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Mobile Language Switcher */}
                        <div style={{ display: 'flex', gap: '8px', padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '8px' }}>
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => { switchLang(lang); setIsMenuOpen(false); }}
                                    style={{
                                        background: currentLang.code === lang.code ? 'rgba(212,175,55,0.2)' : 'transparent',
                                        border: `1px solid ${currentLang.code === lang.code ? '#A38B4D' : 'rgba(255,255,255,0.2)'}`,
                                        borderRadius: '6px',
                                        padding: '6px 12px',
                                        cursor: 'pointer',
                                        color: currentLang.code === lang.code ? '#A38B4D' : 'inherit',
                                        fontSize: '13px',
                                        fontWeight: currentLang.code === lang.code ? 600 : 400,
                                    }}
                                >
                                    {lang.name}
                                </button>
                            ))}
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}
