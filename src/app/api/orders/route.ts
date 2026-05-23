import { db } from '@/db';
import { orders } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

function generateOrderId(): string {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `HS-${ts}${rand}`;
}

export async function GET() {
    const rows = await db.select().from(orders).orderBy(desc(orders.createdAt));
    return NextResponse.json(rows);
}

export async function POST(req: Request) {
    const body = await req.json();
    const { productId, productTitle, productSlug, mrp, fullName, mobile, address, pincode, notes } = body;

    if (!productTitle || !productSlug || !mrp || !fullName || !mobile || !address) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const orderId = generateOrderId();

    const [row] = await db.insert(orders).values({
        orderId,
        productId: productId ?? null,
        productTitle,
        productSlug,
        mrp: String(mrp),
        fullName,
        mobile,
        address,
        pincode: pincode || null,
        notes: notes || null,
    }).returning();

    return NextResponse.json({ orderId: row.orderId }, { status: 201 });
}
