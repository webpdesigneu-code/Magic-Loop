import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ filename: string }> }
) {
    const { filename } = await context.params;

    try {
        const filepath = path.join(process.cwd(), 'public', 'products', filename);

        // Ensure the path is within the products directory to prevent directory traversal attacks
        if (!filepath.startsWith(path.join(process.cwd(), 'public', 'products'))) {
            return new NextResponse('Not Found', { status: 404 });
        }

        const buffer = await readFile(filepath);

        const ext = filename.split('.').pop()?.toLowerCase();
        let mimeType = 'image/jpeg';
        if (ext === 'png') mimeType = 'image/png';
        if (ext === 'ico') mimeType = 'image/x-icon';

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': mimeType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        return new NextResponse('Not Found', { status: 404 });
    }
}
