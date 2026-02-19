'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Products from '@/components/Products';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import OrderModal from '@/components/OrderModal';
import { Product } from '@/lib/types';

// Import products data directly for SSG
import productsData from '@/data/products.json';

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const products = productsData.products as Product[];

  const handleOrder = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Products products={products} onOrder={handleOrder} />
        <FAQ />
      </main>
      <Footer />

      {selectedProduct && (
        <OrderModal
          product={selectedProduct}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
