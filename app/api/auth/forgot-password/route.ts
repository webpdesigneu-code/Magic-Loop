import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';
import { Resend } from 'resend';

const USERS_PATH = path.join(process.cwd(), 'data', 'users.json');

// Lazy resend init (copied from email.ts pattern)
let resend: Resend | null = null;
function getResend() {
    if (!resend && process.env.RESEND_API_KEY) {
        resend = new Resend(process.env.RESEND_API_KEY);
    }
    return resend;
}

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!fs.existsSync(USERS_PATH)) {
            return NextResponse.json({ error: 'System error' }, { status: 500 });
        }

        // 1. Find user
        const usersData = JSON.parse(fs.readFileSync(USERS_PATH, 'utf-8'));
        const userIndex = usersData.findIndex((u: any) => u.email === email);

        if (userIndex === -1) {
            // Security: Don't reveal if email exists
            return NextResponse.json({ success: true, message: 'Jeśli email istnieje, link został wysłany.' });
        }

        // 2. Generate token
        const token = randomBytes(32).toString('hex');
        const expiresAt = Date.now() + 3600000; // 1 hour

        // 3. Save token to user
        usersData[userIndex].resetToken = token;
        usersData[userIndex].resetTokenExpires = expiresAt;
        fs.writeFileSync(USERS_PATH, JSON.stringify(usersData, null, 2));

        // 4. Send email
        const client = getResend();
        if (client) {
            // In dev environment or specific setup, host might vary. 
            // We'll use the origin from the request or fallback.
            const origin = request.headers.get('origin') || 'http://localhost:3000';
            const resetLink = `${origin}/admin/reset-password?token=${token}`;

            await client.emails.send({
                from: 'Magic Loop <security@resend.dev>',
                to: email,
                subject: '🔐 Reset hasła - Magic Loop CMS',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2>Reset hasła</h2>
                        <p>Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta administratora.</p>
                        <p>Kliknij poniższy link, aby ustawić nowe hasło:</p>
                        <p>
                            <a href="${resetLink}" style="background: #e91e63; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                                Zresetuj hasło
                            </a>
                        </p>
                        <p style="color: #666; font-size: 12px; margin-top: 20px;">
                            Link jest ważny przez 1 godzinę. Jeśli to nie Ty prosiłeś o reset, zignoruj tę wiadomość.
                        </p>
                    </div>
                `
            });
            return NextResponse.json({ success: true, message: 'Link wysłany.' });
        } else {
            console.warn('Resend API key missing. Reset link:', `/admin/reset-password?token=${token}`);
            // In dev without email setup, we might want to return the link for testing?
            // But for security we shouldn't. However, for this user I'll log it to console.
             return NextResponse.json({ success: true, message: 'Link wygenerowany (sprawdź logi serwera jeśli brak konfiguracji email).' });
        }

    } catch (error) {
        console.error('Reset password request error:', error);
        return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
    }
}
