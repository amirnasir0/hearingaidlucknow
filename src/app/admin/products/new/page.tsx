import { db } from '@/db';
import { categories, technologies, shapes, suitableFor, features } from '@/db/schema';
import ProductForm from '@/components/ProductForm';
import Link from 'next/link';

export default async function NewProductPage() {
    const [cats, techs, shps, suitable, feats] = await Promise.all([
        db.select().from(categories).orderBy(categories.name),
        db.select().from(technologies).orderBy(technologies.name),
        db.select().from(shapes).orderBy(shapes.name),
        db.select().from(suitableFor).orderBy(suitableFor.name),
        db.select().from(features).orderBy(features.name),
    ]);

    return (
        <>
            <div className="admin-header">
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Link href="/admin/products" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14 }}>
                            ← Products
                        </Link>
                        <span style={{ color: 'var(--text-muted)' }}>/</span>
                        <div style={{ fontSize: 20, fontWeight: 700 }}>New Product</div>
                    </div>
                </div>
            </div>

            <div className="admin-main">
                <div className="card">
                    <ProductForm
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
