'use client';

import { useTranslation } from '@/lib/i18n';
import styles from './Footer.module.css';

export default function Footer() {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.content}>
                    <div className={styles.brand}>
                        <div className={styles.logoWrapper}>
                            <img src="/design/logo.png" alt="Magic Loop Logo" className={styles.logoImage} />
                        </div>
                        <p className={styles.tagline}>{t('footer.handmade')}</p>
                    </div>

                    <div className={styles.contact}>
                        <h4>{t('footer.contact')}</h4>
                        <p>
                            <a href="mailto:apietrowicz87@gmail.com">
                                📧 apietrowicz87@gmail.com
                            </a>
                        </p>
                        <div className={styles.flags}>
                            <span>🇵🇱</span>
                            <span>🇸🇪</span>
                        </div>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>
                        © {currentYear} Magic Loop. {t('footer.rights')}.
                        <a href="/admin" style={{ marginLeft: '10px', textDecoration: 'none', opacity: 0.5 }} title="Admin Panel">🔒</a>
                    </p>
                    <p style={{ marginTop: '5px', fontSize: '0.85rem', opacity: 0.8 }}>
                        Powered by <a href="https://webpdesign.eu/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', fontWeight: 'bold', textDecoration: 'underline' }}>WebpDesign</a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
