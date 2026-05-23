import { db } from '@/db';
import { orders } from '@/db/schema';
import { desc } from 'drizzle-orm';
import Link from 'next/link';
import OrderStatusSelect from './OrderStatusSelect';

const STATUS_COLORS: Record<string, string> = {
    pending: 'order-status-pending',
    confirmed: 'order-status-confirmed',
    processing: 'order-status-processing',
    shipped: 'order-status-shipped',
    delivered: 'order-status-delivered',
    cancelled: 'order-status-cancelled',
};

export default async function OrdersPage() {
    const rows = await db.select().from(orders).orderBy(desc(orders.createdAt));

    const counts = {
        total: rows.length,
        pending: rows.filter((r) => r.status === 'pending').length,
        confirmed: rows.filter((r) => r.status === 'confirmed').length,
        shipped: rows.filter((r) => r.status === 'shipped').length,
        delivered: rows.filter((r) => r.status === 'delivered').length,
    };

    return (
        <>
            <div className="admin-header">
                <div>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>Orders</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        {counts.pending} pending · {counts.total} total
                    </div>
                </div>
            </div>

            <div className="admin-main">
                {/* Summary stats */}
                <div className="stats-grid" style={{ marginBottom: 24 }}>
                    {[
                        { label: 'Total Orders', value: counts.total, icon: '🛒', color: 'blue' },
                        { label: 'Pending', value: counts.pending, icon: '⏳', color: 'amber' },
                        { label: 'Confirmed', value: counts.confirmed, icon: '✅', color: 'green' },
                        { label: 'Delivered', value: counts.delivered, icon: '📦', color: 'green' },
                    ].map((s) => (
                        <div key={s.label} className={`stat-card ${s.color}`}>
                            <div className={`stat-icon ${s.color}`}>{s.icon}</div>
                            <div className="stat-value">{s.value}</div>
                            <div className="stat-label">{s.label}</div>
                        </div>
                    ))}
                </div>

                {rows.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '64px 20px', color: 'var(--text-secondary)' }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
                        <div style={{ fontSize: 16, fontWeight: 600 }}>No orders yet</div>
                        <div style={{ fontSize: 13, marginTop: 8 }}>Orders placed on the website will appear here.</div>
                    </div>
                ) : (
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <div className="orders-table-wrap">
                            <table className="orders-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Product</th>
                                        <th>Customer</th>
                                        <th>Mobile</th>
                                        <th>Amount</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((order) => (
                                        <tr key={order.id}>
                                            <td>
                                                <span className="order-id-badge">{order.orderId}</span>
                                            </td>
                                            <td>
                                                <Link
                                                    href={`/products/${order.productSlug}`}
                                                    target="_blank"
                                                    className="order-product-link"
                                                >
                                                    {order.productTitle}
                                                </Link>
                                            </td>
                                            <td>
                                                <div className="order-customer-name">{order.fullName}</div>
                                                {order.pincode && (
                                                    <div className="order-customer-meta">📍 {order.pincode}</div>
                                                )}
                                            </td>
                                            <td>
                                                <a href={`tel:${order.mobile}`} className="order-mobile-link">
                                                    {order.mobile}
                                                </a>
                                            </td>
                                            <td>
                                                <span className="order-amount">
                                                    ₹{parseFloat(order.mrp).toLocaleString('en-IN')}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="order-date">
                                                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                        day: 'numeric', month: 'short', year: 'numeric',
                                                    })}
                                                </span>
                                            </td>
                                            <td>
                                                <OrderStatusSelect
                                                    orderId={order.id}
                                                    currentStatus={order.status}
                                                    statusColorClass={STATUS_COLORS[order.status] || 'order-status-pending'}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
