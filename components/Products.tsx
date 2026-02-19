'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { Product } from '@/lib/types';
import ProductCard from './ProductCard';
import styles from './Products.module.css';

interface ProductsProps {
    products: Product[];
    onOrder: (product: Product) => void;
}

export default function Products({ products, onOrder }: ProductsProps) {
    const { t } = useTranslation();
    const [activeCategory, setActiveCategory] = useState('all');

    const categories = ['all', 'pluszaki', 'dekoracje', 'kwiaty'];

    const filteredProducts = activeCategory === 'all'
        ? products
        : products.filter(p => p.category === activeCategory);

    return (
        <section id="products" className={`section ${styles.products}`}>
            <div className="container">
                <div className="section-title">
                    <h2>{t('products.title')}</h2>
                    <p>{t('products.subtitle')}</p>
                </div>

                <div className={styles.filters}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterActive : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {t(`products.categories.${cat}`)}
                        </button>
                    ))}
                </div>

                <div className={styles.grid}>
                    {filteredProducts.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onOrder={onOrder}
                        />
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <p className={styles.empty}>
                        {t('products.empty')}
                    </p>
                )}
            </div>
        </section>
    );
}
