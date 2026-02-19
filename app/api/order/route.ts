import { NextRequest, NextResponse } from 'next/server';
import { sendOrderNotification } from '@/lib/email';
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

function saveOrder(order: Order): void {
    try {
        const data = fs.readFileSync(DATA_PATH, 'utf-8');
        const parsed = JSON.parse(data);
        if (!parsed.orders) {
            parsed.orders = [];
        }
        parsed.orders.push(order);
        fs.writeFileSync(DATA_PATH, JSON.stringify(parsed, null, 4), 'utf-8');
    } catch (error) {
        console.error('Error saving order:', error);
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            productId,
            productName,
            productPrice,
            language,
            name,
            email,
            phone,
            country,
            address,
            message,
            gdpr,
        } = body;

        // Validate required fields
        if (!productId || !productName || !name || !email || !country || !address || !gdpr) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Save order to database
        const order: Order = {
            id: Date.now().toString(),
            productName: `${productName} (${productPrice})`,
            customerName: name,
            email,
            phone,
            country,
            address,
            message,
            createdAt: new Date().toISOString(),
            status: 'new',
        };
        saveOrder(order);

        // Send email notifications
        const emailSent = await sendOrderNotification({
            productName,
            productPrice,
            customerName: name,
            customerEmail: email,
            customerPhone: phone,
            country,
            address,
            message,
            language: language || 'pl',
        });

        if (!emailSent) {
            console.log('Order saved (email failed):', order.id);
            return NextResponse.json(
                { success: true, warning: 'Order received but email notification may have failed' },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Order received successfully' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Order API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
