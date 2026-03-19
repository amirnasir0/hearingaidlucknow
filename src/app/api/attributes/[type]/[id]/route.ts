import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import {
    categories,
    technologies,
    shapes,
    suitableFor,
    features,
} from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';

type AttributeType = 'categories' | 'technologies' | 'shapes' | 'suitable-for' | 'features';

const tableMap = {
    categories,
    technologies,
    shapes,
    'suitable-for': suitableFor,
    features,
};

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ type: string; id: string }> }
) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, id } = await params;
    const table = tableMap[type as AttributeType];
    if (!table) {
        return NextResponse.json({ error: 'Invalid attribute type' }, { status: 400 });
    }

    await db.delete(table).where(eq(table.id, parseInt(id)));
    return NextResponse.json({ success: true });
}
