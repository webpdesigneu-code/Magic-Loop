'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { Product } from '@/lib/types';
import styles from './ProductCard.module.css';

interface ProductCardProps {
    product: Product;
    onOrder: (product: Product) => void;
}

export default function ProductCard({ product, onOrder }: ProductCardProps) {
    const { language, currency, t } = useTranslation();
    const [showGallery, setShowGallery] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);

    const name = product.name[language];
    const description = product.description[language];
    const originalPrice = product.price[currency];
    const salePrice = product.salePrice?.[currency];
    const isOnSale = salePrice !== undefined && salePrice < originalPrice;
    const displayPrice = isOnSale ? salePrice : originalPrice;

    // Determine if product can be ordered based on status
    const canOrder = product.status === 'available' || product.status === 'on-order';
    const statusLabel = {
        'available': '',
        'on-order': language === 'pl' ? 'Na zamówienie' : 'På beställning',
        'sold-out': language === 'pl' ? 'Wyprzedane' : 'Slutsåld',
        'hidden': ''
    };

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat(language === 'pl' ? 'pl-PL' : 'sv-SE', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    const openGallery = () => {
        if (product.images.length > 0) {
            setShowGallery(true);
        }
    };

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImage((prev) => (prev + 1) % product.images.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    };

    // Don't render hidden products
    if (product.status === 'hidden') {
        return null;
    }

    return (
        <>
            <article className={`card ${styles.productCard}`}>
                <div className={styles.imageContainer}>
                    {isOnSale && (
                        <div className={styles.saleBadge}>
                            {language === 'pl' ? 'PROMOCJA' : 'REA'}
                        </div>
                    )}

                    {product.images.length > 0 ? (
                        <img
                            src={product.images[currentImage]}
                            alt={name}
                            className={styles.image}
                            onClick={openGallery}
                            style={{ cursor: 'zoom-in' }}
                        />
                    ) : (
                        <div className={styles.placeholder}>🧸</div>
                    )}

                    {product.images.length > 1 && (
                        <div className={styles.imageNav}>
                            {product.images.map((_, idx) => (
                                <button
                                    key={idx}
                                    className={`${styles.dot} ${idx === currentImage ? styles.dotActive : ''}`}
                                    onClick={() => setCurrentImage(idx)}
                                />
                            ))}
                        </div>
                    )}

                    {(product.status === 'sold-out' || product.status === 'on-order') && (
                        <div className={`${styles.statusBadge} ${styles[product.status]}`}>
                            {statusLabel[product.status]}
                        </div>
                    )}
                </div>

                <div className={styles.content}>
                    <h3 className={styles.name}>{name}</h3>
                    <p className={styles.description}>{description}</p>

                    <div className={styles.footer}>
                        <div className={styles.priceWrapper}>
                            {isOnSale && (
                                <span className={styles.originalPrice}>
                                    {formatPrice(originalPrice)}
                                </span>
                            )}
                            <span className={`${styles.price} ${isOnSale ? styles.salePrice : ''}`}>
                                {formatPrice(displayPrice)}
                            </span>
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={() => onOrder(product)}
                            disabled={!canOrder}
                        >
                            {product.status === 'on-order'
                                ? (language === 'pl' ? 'Zamów' : 'Beställ')
                                : t('products.orderButton')
                            }
                        </button>
                    </div>
                </div>
            </article>

            {/* Lightbox Gallery */}
            {showGallery && (
                <div 
                    className={styles.galleryOverlay} 
                    onClick={() => setShowGallery(false)}
                >
                    <div className={styles.galleryContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.closeBtn} onClick={() => setShowGallery(false)}>×</button>
                        
                        <img 
                            src={product.images[currentImage]} 
                            alt={name} 
                            className={styles.galleryImage} 
                        />

                        {product.images.length > 1 && (
                            <>
                                <button className={styles.prevBtn} onClick={prevImage}>❮</button>
                                <button className={styles.nextBtn} onClick={nextImage}>❯</button>
                                
                                <div className={styles.galleryDots}>
                                    {product.images.map((_, idx) => (
                                        <button
                                            key={idx}
                                            className={`${styles.dot} ${idx === currentImage ? styles.dotActive : ''}`}
                                            onClick={() => setCurrentImage(idx)}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
