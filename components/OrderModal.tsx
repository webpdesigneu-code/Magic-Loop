'use client';

import { useState, FormEvent } from 'react';
import { useTranslation } from '@/lib/i18n';
import { Product } from '@/lib/types';
import styles from './OrderModal.module.css';

interface OrderModalProps {
    product: Product;
    onClose: () => void;
}

export default function OrderModal({ product, onClose }: OrderModalProps) {
    const { language, currency, t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        country: language === 'pl' ? 'Polska' : 'Sverige',
        address: '',
        message: '',
        gdpr: false,
    });

    const name = product.name[language];
    const price = new Intl.NumberFormat(language === 'pl' ? 'pl-PL' : 'sv-SE', {
        style: 'currency',
        currency: currency,
    }).format(product.price[currency]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: product.id,
                    productName: name,
                    productPrice: price,
                    language,
                    ...formData,
                }),
            });

            if (response.ok) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.close} onClick={onClose}>×</button>

                {status === 'success' ? (
                    <div className={styles.success}>
                        <span className={styles.successIcon}>✅</span>
                        <h3>{t('order.thankyou')}</h3>
                        <p>{t('order.success')}</p>
                        <button className="btn btn-primary" onClick={onClose}>OK</button>
                    </div>
                ) : status === 'error' ? (
                    <div className={styles.error}>
                        <span className={styles.errorIcon}>❌</span>
                        <h3>{t('order.oops')}</h3>
                        <p>{t('order.error')}</p>
                        <button className="btn btn-secondary" onClick={() => setStatus('idle')}>
                            {t('order.retry')}
                        </button>
                    </div>
                ) : (
                    <>
                        <div className={styles.header}>
                            <h2>{t('order.title')}</h2>
                            <p>{t('order.subtitle')}</p>
                        </div>

                        <div className={styles.productInfo}>
                            <div className={styles.productBadge}>
                                <strong>{t('order.product')}:</strong> {name}
                            </div>
                            <div className={styles.priceBadge}>{price}</div>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className="form-group">
                                <label className="form-label">{t('order.name')} *</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">{t('order.email')} *</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-input"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">{t('order.phone')}</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    className="form-input"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">{t('order.country')} *</label>
                                <select
                                    name="country"
                                    className="form-select"
                                    value={formData.country}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Polska">{t('order.poland')} 🇵🇱</option>
                                    <option value="Sverige">{t('order.sweden')} 🇸🇪</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">{t('order.address')} *</label>
                                <textarea
                                    name="address"
                                    className="form-textarea"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">{t('order.message')}</label>
                                <textarea
                                    name="message"
                                    className="form-textarea"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder={t('order.messagePlaceholder')}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-checkbox">
                                    <input
                                        type="checkbox"
                                        name="gdpr"
                                        checked={formData.gdpr}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span>{t('order.gdpr')}</span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSubmitting}
                                style={{ width: '100%' }}
                            >
                                {isSubmitting ? t('order.sending') : t('order.submit')}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
