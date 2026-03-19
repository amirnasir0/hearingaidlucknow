import { db } from '@/db';
import { categories, technologies, shapes, suitableFor, features } from '@/db/schema';
import AttributesClient from './AttributesClient';

export const dynamic = 'force-dynamic';

export default async function AttributesPage() {
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
                    <div style={{ fontSize: 20, fontWeight: 700 }}>Attributes</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        Manage product categories, technologies, shapes, and more
                    </div>
                </div>
            </div>

            <div className="admin-main">
                <AttributesClient
                    initial={{ cats, techs, shps, suitable, feats }}
                />
            </div>
        </>
    );
}
