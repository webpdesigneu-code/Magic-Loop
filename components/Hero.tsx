'use client';

import { useTranslation } from '@/lib/i18n';
import styles from './Hero.module.css';

export default function Hero() {
    const { t } = useTranslation();

    return (
        <section className={styles.hero}>
            {/* Decorations removed as per user request */}

            <div className={`container ${styles.heroContent}`}>
                <h1 className={styles.title}>
                    {t('hero.title')}
                </h1>
                <p className={styles.subtitle}>
                    {t('hero.subtitle')}
                </p>
                <p className={styles.description}>
                    {t('hero.description')}
                </p>
                <div className={styles.location}>
                    <span>📍</span> {t('hero.location')}
                </div>
                <a href="#products" className={`btn btn-primary ${styles.cta}`}>
                    {t('hero.cta')}
                    <span>↓</span>
                </a>
            </div>
        </section>
    );
}
