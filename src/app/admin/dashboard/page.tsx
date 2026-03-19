import { db } from '@/db';
import { products, categories, technologies } from '@/db/schema';
import { getSiteSettings } from '@/lib/settings';
import { sql } from 'drizzle-orm';
import Link from 'next/link';

export default async function DashboardPage() {
    const [settings, productCount, categoryCount, techCount] = await Promise.all([
        getSiteSettings(),
        db.select({ count: sql<number>`count(*)` }).from(products),
        db.select({ count: sql<number>`count(*)` }).from(categories),
        db.select({ count: sql<number>`count(*)` }).from(technologies),
    ]);

    const stats = [
        { label: 'Total Products', value: productCount[0]?.count ?? 0, icon: '🎧', color: 'blue', href: '/admin/products' },
        { label: 'Categories', value: categoryCount[0]?.count ?? 0, icon: '🏷️', color: 'green', href: '/admin/attributes' },
        { label: 'Technologies', value: techCount[0]?.count ?? 0, icon: '⚡', color: 'amber', href: '/admin/attributes' },
    ];

    return (
        <>
            <div className="admin-header">
                <div>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>Dashboard</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Welcome to {settings.brandName} admin</div>
                </div>
                <Link href="/admin/products/new" className="btn btn-primary">
                    ＋ Add Product
                </Link>
            </div>

            <div className="admin-main">
                <div className="stats-grid">
                    {stats.map((stat) => (
                        <Link href={stat.href} key={stat.label} style={{ textDecoration: 'none' }}>
                            <div className={`stat-card ${stat.color}`}>
                                <div className={`stat-icon ${stat.color}`}>{stat.icon}</div>
                                <div className="stat-value">{stat.value}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="card">
                    <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Quick Actions</h2>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        <Link href="/admin/products/new" className="btn btn-primary">🎧 Add New Product</Link>
                        <Link href="/admin/attributes" className="btn btn-secondary">🏷️ Manage Attributes</Link>
                        <Link href="/" target="_blank" className="btn btn-secondary">🌐 View Website</Link>
                    </div>
                </div>
            </div>
        </>
    );
}
