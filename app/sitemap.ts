import { MetadataRoute } from 'next';
import productsData from '@/data/products.json';
import { Product } from '@/lib/products';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'http://93.127.214.180'; // Update domain later

  // Static pages
  const routes = [
    '',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 1.0,
  }));

  // Dynamic product pages (if we had individual pages, but we have a modal)
  // Since we use modals/hash, we mainly just index the homepage.
  // But if we had /products/[slug], we would map them here.
  // For now, let's just stick to the main page as the app is a single-page-like experience.

  return [...routes];
}
