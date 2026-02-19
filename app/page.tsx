import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import ProductsWrapper from '@/components/ProductsWrapper';
import { getProducts } from '@/lib/products';

export default function Home() {
  const products = getProducts();

  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <ProductsWrapper products={products} />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
