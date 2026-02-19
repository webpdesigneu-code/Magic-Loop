'use client';

import { useState } from 'react';
import Products from '@/components/Products';
import OrderModal from '@/components/OrderModal';
import { Product } from '@/lib/types';

interface ProductsWrapperProps {
    products: Product[];
}

export default function ProductsWrapper({ products }: ProductsWrapperProps) {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const handleOrder = (product: Product) => {
        setSelectedProduct(product);
    };

    const handleCloseModal = () => {
        setSelectedProduct(null);
    };

    return (
        <>
            <Products products={products} onOrder={handleOrder} />
            {selectedProduct && (
                <OrderModal
                    product={selectedProduct}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
}
