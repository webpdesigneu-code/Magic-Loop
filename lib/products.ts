import fs from 'fs';
import path from 'path';
import { Product, ProductStatus } from './types';

export type { Product, ProductStatus };

export interface ProductsData {
    products: Product[];
}

const DATA_PATH = path.join(process.cwd(), 'data', 'products.json');

export function getProducts(): Product[] {
    try {
        const data = fs.readFileSync(DATA_PATH, 'utf-8');
        const parsed: ProductsData = JSON.parse(data);
        return parsed.products;
    } catch (error) {
        console.error('Error reading products:', error);
        return [];
    }
}

export function getProductById(id: string): Product | null {
    const products = getProducts();
    return products.find(p => p.id === id) || null;
}

export function getProductBySlug(slug: string): Product | null {
    const products = getProducts();
    return products.find(p => p.slug === slug) || null;
}

export function saveProducts(products: Product[]): boolean {
    try {
        const data: ProductsData = { products };
        fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
        return true;
    } catch (error) {
        console.error('Error saving products:', error);
        return false;
    }
}

export function addProduct(product: Omit<Product, 'id'>): Product {
    const products = getProducts();
    const newId = (Math.max(0, ...products.map(p => parseInt(p.id))) + 1).toString();
    const newProduct: Product = { ...product, id: newId };
    products.push(newProduct);
    saveProducts(products);
    return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
    const products = getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    products[index] = { ...products[index], ...updates };
    saveProducts(products);
    return products[index];
}

export function deleteProduct(id: string): boolean {
    const products = getProducts();
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length === products.length) return false;

    saveProducts(filtered);
    return true;
}
