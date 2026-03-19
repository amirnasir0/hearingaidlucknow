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
import slugify from 'slugify';
import { auth } from '@/auth';

type AttributeType = 'categories' | 'technologies' | 'shapes' | 'suitable-for' | 'features';

const tableMap = {
    categories,
    technologies,
    shapes,
    'suitable-for': suitableFor,
    features,
};

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ type: string }> }
) {
    const { type } = await params;
    const table = tableMap[type as AttributeType];
    if (!table) {
        return NextResponse.json({ error: 'Invalid attribute type' }, { status: 400 });
    }

    const rows = await db.select().from(table).orderBy(table.name);
    return NextResponse.json(rows);
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ type: string }> }
) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type } = await params;
    const table = tableMap[type as AttributeType];
    if (!table) {
        return NextResponse.json({ error: 'Invalid attribute type' }, { status: 400 });
    }

    const body = await request.json();
    const { name } = body;
    if (!name?.trim()) {
        return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const insertData: Record<string, string> = { name: name.trim() };

    // Add slug for categories
    if (type === 'categories') {
        insertData.slug = slugify(name.trim(), { lower: true, strict: true });
    }

    const [row] = await db.insert(table).values(insertData as never).returning();
    return NextResponse.json(row, { status: 201 });
}
