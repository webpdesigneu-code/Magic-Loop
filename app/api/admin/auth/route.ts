import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SESSION_COOKIE = 'handmade-admin-session';

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Test123';

        if (password === ADMIN_PASSWORD) {
            const sessionToken = Buffer.from(Date.now().toString() + '-' + Math.random()).toString('base64');

            const cookieStore = await cookies();
            cookieStore.set(SESSION_COOKIE, sessionToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24, // 24 hours
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json(
            { error: 'Invalid password' },
            { status: 401 }
        );
    } catch (error) {
        console.error('Auth error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get(SESSION_COOKIE);

        if (session?.value) {
            return NextResponse.json({ authenticated: true });
        }

        return NextResponse.json({ authenticated: false });
    } catch {
        return NextResponse.json({ authenticated: false });
    }
}

export async function DELETE() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete(SESSION_COOKIE);
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ success: true });
    }
}
