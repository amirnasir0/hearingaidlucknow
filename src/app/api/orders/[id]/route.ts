import { db } from '@/db';
import { orders } from '@/db/schema';
import { auth } from '@/auth';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const { status, notes } = body;

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const [row] = await db
        .update(orders)
        .set({ status, ...(notes !== undefined ? { notes } : {}), updatedAt: new Date() })
        .where(eq(orders.id, parseInt(id)))
        .returning();

    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(row);
}
