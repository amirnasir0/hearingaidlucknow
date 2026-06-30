import { db } from '@/db';
import { leads } from '@/db/schema';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const body = await req.json();
    const { fullName, mobile, productTitle, productSlug } = body;

    if (!fullName || !mobile) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await db.insert(leads).values({
        fullName,
        mobile,
        productTitle: productTitle ?? null,
        productSlug: productSlug ?? null,
    });

    return NextResponse.json({ success: true }, { status: 201 });
}
