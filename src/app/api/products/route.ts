import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import {
    products,
    productImages,
    productTechnologies,
    productSuitableFor,
    productFeatures,
    categories,
    shapes,
    technologies,
    suitableFor,
    features,
} from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import slugify from 'slugify';
import { auth } from '@/auth';

export async function GET() {
    const rows = await db
        .select({
            id: products.id,
            title: products.title,
            slug: products.slug,
            mrp: products.mrp,
            createdAt: products.createdAt,
            categoryName: categories.name,
            shapeName: shapes.name,
        })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .leftJoin(shapes, eq(products.shapeId, shapes.id))
        .orderBy(desc(products.createdAt));

    return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
        title,
        mrp,
        description,
        categoryId,
        shapeId,
        images = [],
        technologyIds = [],
        suitableForIds = [],
        featureIds = [],
    } = body;

    if (!title?.trim() || !mrp) {
        return NextResponse.json({ error: 'Title and MRP are required' }, { status: 400 });
    }

    // Generate unique slug
    let baseSlug = slugify(title.trim(), { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;
    while (true) {
        const existing = await db
            .select({ id: products.id })
            .from(products)
            .where(eq(products.slug, slug))
            .limit(1);
        if (existing.length === 0) break;
        slug = `${baseSlug}-${counter++}`;
    }

    const [product] = await db
        .insert(products)
        .values({
            title: title.trim(),
            slug,
            mrp: mrp.toString(),
            description: description || null,
            categoryId: categoryId || null,
            shapeId: shapeId || null,
        })
        .returning();

    // Insert images (max 3)
    if (images.length > 0) {
        const imageInserts = images.slice(0, 3).map((url: string, idx: number) => ({
            productId: product.id,
            url,
            position: idx,
        }));
        await db.insert(productImages).values(imageInserts);
    }

    // Insert junction records
    if (technologyIds.length > 0) {
        await db.insert(productTechnologies).values(
            technologyIds.map((tid: number) => ({ productId: product.id, technologyId: tid }))
        );
    }
    if (suitableForIds.length > 0) {
        await db.insert(productSuitableFor).values(
            suitableForIds.map((sid: number) => ({ productId: product.id, suitableForId: sid }))
        );
    }
    if (featureIds.length > 0) {
        await db.insert(productFeatures).values(
            featureIds.map((fid: number) => ({ productId: product.id, featureId: fid }))
        );
    }

    return NextResponse.json(product, { status: 201 });
}
