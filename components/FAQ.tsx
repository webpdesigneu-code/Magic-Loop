'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import styles from './FAQ.module.css';

interface FAQItem {
    question: string;
    answer: string;
}

export default function FAQ() {
    const { t, tArray } = useTranslation();
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const items = tArray<FAQItem>('faq.items');

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className={`section ${styles.faq}`}>
            <div className="container">
                <div className="section-title">
                    <h2>{t('faq.title')}</h2>
                </div>

                <div className={styles.items}>
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className={`${styles.item} ${openIndex === index ? styles.itemOpen : ''}`}
                        >
                            <button
                                className={styles.question}
                                onClick={() => toggle(index)}
                            >
                                <span>{item.question}</span>
                                <span className={styles.icon}>
                                    {openIndex === index ? '−' : '+'}
                                </span>
                            </button>
                            <div className={styles.answer}>
                                <p>{item.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
