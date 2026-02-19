'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import styles from './Header.module.css';
import Link from 'next/link';

export default function Header() {
    const { language, setLanguage, t } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleLanguage = () => {
        setLanguage(language === 'pl' ? 'se' : 'pl');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <>
            <header className={styles.header}>
                <div className={`container ${styles.headerContent}`}>
                    {/* Hamburger Button */}
                    <button 
                        className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerActive : ''}`} 
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        <span className={styles.bar}></span>
                        <span className={styles.bar}></span>
                        <span className={styles.bar}></span>
                    </button>

                    <Link href="/" className={styles.logo} onClick={closeMenu}>
                        <img src="/design/logo.png" alt="Magic Loop Logo" className={styles.logoImage} />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className={styles.desktopNav}>
                        <a href="#products" className={styles.navLink}>
                            {t('nav.products')}
                        </a>
                        <a href="#about" className={styles.navLink}>
                            {t('nav.about')}
                        </a>
                        <a href="#faq" className={styles.navLink}>
                            {t('nav.faq')}
                        </a>

                        <button onClick={toggleLanguage} className={styles.langButton}>
                            <span className={styles.langFlag}>
                                {language === 'pl' ? '🇸🇪' : '🇵🇱'}
                            </span>
                            {t('language.switch')}
                        </button>
                    </nav>
                </div>
            </header>

            {/* Mobile Navigation Overlay */}
            <nav className={`${styles.mobileNav} ${isMenuOpen ? styles.mobileNavActive : ''}`}>
                <a href="#products" className={styles.mobileNavLink} onClick={closeMenu}>
                    {t('nav.products')}
                </a>
                <a href="#about" className={styles.mobileNavLink} onClick={closeMenu}>
                    {t('nav.about')}
                </a>
                <a href="#faq" className={styles.mobileNavLink} onClick={closeMenu}>
                    {t('nav.faq')}
                </a>

                <button onClick={toggleLanguage} className={styles.mobileLangButton}>
                    <span className={styles.langFlag}>
                        {language === 'pl' ? '🇸🇪' : '🇵🇱'}
                    </span>
                    {t('language.switch')}
                </button>
            </nav>
        </>
    );
}
