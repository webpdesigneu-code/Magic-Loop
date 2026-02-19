'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import styles from './CookieConsent.module.css';

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const consent = localStorage.getItem('magicloop-cookie-consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('magicloop-cookie-consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <p className={styles.text}>
                    {t('cookies.text')}{' '}
                    <Link href="/privacy-policy" className={styles.link}>
                        {t('cookies.policy')}
                    </Link>
                </p>
                <button onClick={acceptCookies} className={styles.button}>
                    {t('cookies.button')}
                </button>
            </div>
        </div>
    );
}
