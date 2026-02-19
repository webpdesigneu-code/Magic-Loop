export type ProductStatus = 'available' | 'on-order' | 'sold-out' | 'hidden';

export interface Product {
    id: string;
    slug: string;
    category: string;
    images: string[];
    name: {
        pl: string;
        se: string;
    };
    description: {
        pl: string;
        se: string;
    };
    price: {
        PLN: number;
        SEK: number;
    };
    salePrice?: {
        PLN: number;
        SEK: number;
    };
    status: ProductStatus;
    order: number;
    available: boolean; // kept for backwards compatibility
}

export interface Order {
    id: string;
    productName: string;
    customerName: string;
    email: string;
    phone?: string;
    country: string;
    address: string;
    message?: string;
    createdAt: string;
    status: 'new' | 'contacted' | 'completed' | 'cancelled';
}
