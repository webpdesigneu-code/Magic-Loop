import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

const SESSION_COOKIE = 'handmade-admin-session';
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'products');

async function isAuthenticated(): Promise<boolean> {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get(SESSION_COOKIE);
        return !!session?.value;
    } catch {
        return false;
    }
}

export async function POST(request: NextRequest) {
    if (!await isAuthenticated()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const files = formData.getAll('files') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No files provided' }, { status: 400 });
        }

        // Ensure upload directory exists
        await mkdir(UPLOAD_DIR, { recursive: true });

        const uploadedPaths: string[] = [];

        for (const file of files) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                continue;
            }

            // Generate unique filename and always enforce .jpg
            const filename = `${uuidv4()}.jpg`;
            const filepath = path.join(UPLOAD_DIR, filename);

            // Read file buffer
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Compress and resize image using sharp
            await sharp(buffer)
                .resize({ width: 1200, withoutEnlargement: true })
                .jpeg({ quality: 80 })
                .toFile(filepath);

            uploadedPaths.push(`/products/${filename}`);
        }

        if (uploadedPaths.length === 0) {
            return NextResponse.json({ error: 'No valid images uploaded' }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            paths: uploadedPaths
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Failed to upload files' }, { status: 500 });
    }
}
