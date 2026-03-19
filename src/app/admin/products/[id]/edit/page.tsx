import { db } from '@/db';
import { products, categories, technologies, shapes, suitableFor, features, productTechnologies, productSuitableFor, productFeatures, productImages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import ProductForm from '@/components/ProductForm';
import Link from 'next/link';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const productId = parseInt(id);

    const [[product], cats, techs, shps, suitable, feats, imgs, techjunc, suitjunc, featjunc] = await Promise.all([
        db.select().from(products).where(eq(products.id, productId)).limit(1),
        db.select().from(categories).orderBy(categories.name),
        db.select().from(technologies).orderBy(technologies.name),
        db.select().from(shapes).orderBy(shapes.name),
        db.select().from(suitableFor).orderBy(suitableFor.name),
        db.select().from(features).orderBy(features.name),
        db.select().from(productImages).where(eq(productImages.productId, productId)).orderBy(productImages.position),
        db.select().from(productTechnologies).where(eq(productTechnologies.productId, productId)),
        db.select().from(productSuitableFor).where(eq(productSuitableFor.productId, productId)),
        db.select().from(productFeatures).where(eq(productFeatures.productId, productId)),
    ]);

    if (!product) notFound();

    return (
        <>
            <div className="admin-header">
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Link href="/admin/products" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14 }}>
                            ← Products
                        </Link>
                        <span style={{ color: 'var(--text-muted)' }}>/</span>
                        <div style={{ fontSize: 20, fontWeight: 700 }}>Edit Product</div>
                    </div>
                </div>
                <Link href={`/products/${product.slug}`} target="_blank" className="btn btn-secondary btn-sm">
                    🌐 View Live
                </Link>
            </div>

            <div className="admin-main">
                <div className="card">
                    <ProductForm
                        initialData={{
                            id: product.id,
                            title: product.title,
                            mrp: product.mrp,
                            description: product.description,
                            categoryId: product.categoryId,
                            shapeId: product.shapeId,
                            images: imgs,
                            technologyIds: techjunc.map((t) => t.technologyId),
                            suitableForIds: suitjunc.map((s) => s.suitableForId),
                            featureIds: featjunc.map((f) => f.featureId),
                        }}
                        categories={cats}
                        technologies={techs}
                        shapes={shps}
                        suitableFor={suitable}
                        features={feats}
                    />
                </div>
            </div>
        </>
    );
}
