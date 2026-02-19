import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

const SESSION_COOKIE = 'handmade-admin-session';
const SETTINGS_PATH = path.join(process.cwd(), 'data', 'settings.json');

async function isAuthenticated(): Promise<boolean> {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get(SESSION_COOKIE);
        return !!session?.value;
    } catch {
        return false;
    }
}

function getSettings() {
    try {
        if (!fs.existsSync(SETTINGS_PATH)) {
            return { notificationEmail: '' };
        }
        const data = fs.readFileSync(SETTINGS_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading settings:', error);
        return { notificationEmail: '' };
    }
}

function saveSettings(settings: any) {
    try {
        fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 4), 'utf-8');
        return true;
    } catch (error) {
        console.error('Error saving settings:', error);
        return false;
    }
}

export async function GET() {
    if (!await isAuthenticated()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const settings = getSettings();
    return NextResponse.json(settings);
}

export async function POST(request: NextRequest) {
    if (!await isAuthenticated()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const currentSettings = getSettings();
        const newSettings = { ...currentSettings, ...body };
        
        if (saveSettings(newSettings)) {
            return NextResponse.json({ success: true, settings: newSettings });
        } else {
            return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
