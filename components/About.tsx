'use client';

import Image from 'next/image';
import { useTranslation } from '@/lib/i18n';
import styles from './About.module.css';

export default function About() {
    const { t } = useTranslation();

    return (
        <section id="about" className={`section ${styles.about}`}>
            <div className="container">
                <div className={styles.content}>
                    <div className={styles.imageWrapper}>
                        <div className={styles.imageContainer}>
                            <Image
                                src="/design/about-me-illustration.png"
                                alt="Anna - Magic Loop"
                                fill
                                style={{ objectFit: 'cover' }}
                                priority
                            />
                        </div>
                        <div className={styles.badge}>{t('about.badge')}</div>
                    </div>

                    <div className={styles.text}>
                        <h2>{t('about.title')}</h2>
                        <p>{t('about.text1')}</p>
                        <p>{t('about.text2')}</p>
                        <p>{t('about.text3')}</p>

                        <div className={styles.features}>
                            <div className={styles.feature}>
                                <span className={styles.featureIcon}>🧵</span>
                                <span>{t('about.feature1')}</span>
                            </div>
                            <div className={styles.feature}>
                                <span className={styles.featureIcon}>💝</span>
                                <span>{t('about.feature2')}</span>
                            </div>
                            <div className={styles.feature}>
                                <span className={styles.featureIcon}>🌍</span>
                                <span>{t('about.feature3')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
