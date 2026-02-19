import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);
const USERS_PATH = path.join(process.cwd(), 'data', 'users.json');

async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${salt}:${derivedKey.toString('hex')}`;
}

export async function POST(request: NextRequest) {
    try {
        const { token, newPassword } = await request.json();

        if (!fs.existsSync(USERS_PATH)) {
            return NextResponse.json({ error: 'System error' }, { status: 500 });
        }

        const usersData = JSON.parse(fs.readFileSync(USERS_PATH, 'utf-8'));
        const userIndex = usersData.findIndex((u: any) => u.resetToken === token);

        if (userIndex === -1) {
            return NextResponse.json({ error: 'Nieprawidłowy lub wygasły token' }, { status: 400 });
        }

        const user = usersData[userIndex];
        if (Date.now() > user.resetTokenExpires) {
             return NextResponse.json({ error: 'Token wygasł' }, { status: 400 });
        }

        // Success: Update password and clear token
        usersData[userIndex].passwordHash = await hashPassword(newPassword);
        delete usersData[userIndex].resetToken;
        delete usersData[userIndex].resetTokenExpires;

        fs.writeFileSync(USERS_PATH, JSON.stringify(usersData, null, 2));

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json({ error: 'Błąd resetowania hasła' }, { status: 500 });
    }
}
