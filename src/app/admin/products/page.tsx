import { db } from '@/db';
import { products, categories, shapes } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';
import DeleteProductButton from './DeleteProductButton';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
    const rows = await db
        .select({
            id: products.id,
            title: products.title,
            slug: products.slug,
            mrp: products.mrp,
            createdAt: products.createdAt,
            categoryName: categories.name,
        })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .orderBy(desc(products.createdAt));

    return (
        <>
            <div className="admin-header">
                <div>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>Products</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{rows.length} products total</div>
                </div>
                <Link href="/admin/products/new" className="btn btn-primary">
                    ＋ Add Product
                </Link>
            </div>

            <div className="admin-main">
                <div className="card">
                    {rows.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">🎧</div>
                            <div className="empty-state-title">No products yet</div>
                            <p style={{ fontSize: 13, marginBottom: 20 }}>Add your first hearing aid product to get started.</p>
                            <Link href="/admin/products/new" className="btn btn-primary">＋ Add Product</Link>
                        </div>
                    ) : (
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Category</th>
                                        <th>MRP</th>
                                        <th>Slug</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row) => (
                                        <tr key={row.id}>
                                            <td>
                                                <div style={{ fontWeight: 600 }}>{row.title}</div>
                                            </td>
                                            <td>
                                                {row.categoryName ? (
                                                    <span className="badge badge-blue">{row.categoryName}</span>
                                                ) : (
                                                    <span className="badge badge-gray">—</span>
                                                )}
                                            </td>
                                            <td style={{ fontWeight: 700 }}>
                                                ₹{parseFloat(row.mrp).toLocaleString('en-IN')}
                                            </td>
                                            <td>
                                                <Link
                                                    href={`/products/${row.slug}`}
                                                    target="_blank"
                                                    style={{ color: 'var(--accent-green)', fontSize: 12, fontFamily: 'monospace' }}
                                                >
                                                    /{row.slug}
                                                </Link>
                                            </td>
                                            <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                                                {new Date(row.createdAt).toLocaleDateString('en-IN')}
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: 8 }}>
                                                    <Link
                                                        href={`/admin/products/${row.id}/edit`}
                                                        className="btn btn-secondary btn-sm"
                                                    >
                                                        ✏️ Edit
                                                    </Link>
                                                    <DeleteProductButton id={row.id} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
