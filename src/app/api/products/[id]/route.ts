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
import { eq } from 'drizzle-orm';
import slugify from 'slugify';
import { auth } from '@/auth';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const productId = parseInt(id);

    const [product] = await db
        .select()
        .from(products)
        .where(eq(products.id, productId))
        .limit(1);

    if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const images = await db
        .select()
        .from(productImages)
        .where(eq(productImages.productId, productId))
        .orderBy(productImages.position);

    const techs = await db
        .select({ id: technologies.id, name: technologies.name })
        .from(productTechnologies)
        .innerJoin(technologies, eq(productTechnologies.technologyId, technologies.id))
        .where(eq(productTechnologies.productId, productId));

    const suitable = await db
        .select({ id: suitableFor.id, name: suitableFor.name })
        .from(productSuitableFor)
        .innerJoin(suitableFor, eq(productSuitableFor.suitableForId, suitableFor.id))
        .where(eq(productSuitableFor.productId, productId));

    const feats = await db
        .select({ id: features.id, name: features.name })
        .from(productFeatures)
        .innerJoin(features, eq(productFeatures.featureId, features.id))
        .where(eq(productFeatures.productId, productId));

    const [category] = product.categoryId
        ? await db.select().from(categories).where(eq(categories.id, product.categoryId)).limit(1)
        : [null];

    const [shape] = product.shapeId
        ? await db.select().from(shapes).where(eq(shapes.id, product.shapeId)).limit(1)
        : [null];

    return NextResponse.json({
        ...product,
        images,
        category,
        shape,
        technologies: techs,
        suitableFor: suitable,
        features: feats,
    });
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const productId = parseInt(id);
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

    // Get current product to preserve slug if title unchanged
    const [existing] = await db.select().from(products).where(eq(products.id, productId)).limit(1);
    if (!existing) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    let slug = existing.slug;
    if (title && title.trim() !== existing.title) {
        let baseSlug = slugify(title.trim(), { lower: true, strict: true });
        slug = baseSlug;
        let counter = 1;
        while (true) {
            const dup = await db
                .select({ id: products.id })
                .from(products)
                .where(eq(products.slug, slug))
                .limit(1);
            if (dup.length === 0 || dup[0].id === productId) break;
            slug = `${baseSlug}-${counter++}`;
        }
    }

    const [updated] = await db
        .update(products)
        .set({
            title: title?.trim() ?? existing.title,
            slug,
            mrp: mrp?.toString() ?? existing.mrp,
            description: description ?? existing.description,
            categoryId: categoryId ?? null,
            shapeId: shapeId ?? null,
            updatedAt: new Date(),
        })
        .where(eq(products.id, productId))
        .returning();

    // Replace images
    await db.delete(productImages).where(eq(productImages.productId, productId));
    if (images.length > 0) {
        await db.insert(productImages).values(
            images.slice(0, 3).map((url: string, idx: number) => ({
                productId,
                url,
                position: idx,
            }))
        );
    }

    // Replace junctions
    await db.delete(productTechnologies).where(eq(productTechnologies.productId, productId));
    await db.delete(productSuitableFor).where(eq(productSuitableFor.productId, productId));
    await db.delete(productFeatures).where(eq(productFeatures.productId, productId));

    if (technologyIds.length > 0) {
        await db.insert(productTechnologies).values(
            technologyIds.map((tid: number) => ({ productId, technologyId: tid }))
        );
    }
    if (suitableForIds.length > 0) {
        await db.insert(productSuitableFor).values(
            suitableForIds.map((sid: number) => ({ productId, suitableForId: sid }))
        );
    }
    if (featureIds.length > 0) {
        await db.insert(productFeatures).values(
            featureIds.map((fid: number) => ({ productId, featureId: fid }))
        );
    }

    return NextResponse.json(updated);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const productId = parseInt(id);

    await db.delete(products).where(eq(products.id, productId));
    return NextResponse.json({ success: true });
}
