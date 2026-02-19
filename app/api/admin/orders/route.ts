import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'products.json');

interface Order {
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

async function isAuthenticated(): Promise<boolean> {
    const cookieStore = await cookies();
    return cookieStore.get('admin-session')?.value === 'authenticated';
}

function getOrders(): Order[] {
    try {
        const data = fs.readFileSync(DATA_PATH, 'utf-8');
        const parsed = JSON.parse(data);
        return parsed.orders || [];
    } catch {
        return [];
    }
}

function saveOrders(orders: Order[]): void {
    try {
        const data = fs.readFileSync(DATA_PATH, 'utf-8');
        const parsed = JSON.parse(data);
        parsed.orders = orders;
        fs.writeFileSync(DATA_PATH, JSON.stringify(parsed, null, 4), 'utf-8');
    } catch (error) {
        console.error('Error saving orders:', error);
    }
}

// GET - Fetch all orders
export async function GET() {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = getOrders();
    return NextResponse.json({ orders });
}

// POST - Create a new order (called from public order form)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { productName, name, email, phone, country, address, message } = body;

        if (!productName || !name || !email || !country || !address) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const orders = getOrders();
        const newOrder: Order = {
            id: Date.now().toString(),
            productName,
            customerName: name,
            email,
            phone,
            country,
            address,
            message,
            createdAt: new Date().toISOString(),
            status: 'new',
        };

        orders.push(newOrder);
        saveOrders(orders);

        return NextResponse.json({ success: true, orderId: newOrder.id });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}

// PUT - Update order status
export async function PUT(request: Request) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id, status } = await request.json();

        if (!id || !status) {
            return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
        }

        const orders = getOrders();
        const index = orders.findIndex(o => o.id === id);

        if (index === -1) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        orders[index].status = status;
        saveOrders(orders);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}
