import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
        return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    try {
        const blob = await put(file.name, file, {
            access: 'public',
            addRandomSuffix: true,
        });
        return NextResponse.json({ url: blob.url });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Upload failed';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
