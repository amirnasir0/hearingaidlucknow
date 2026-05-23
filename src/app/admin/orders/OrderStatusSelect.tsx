'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

interface Props {
    orderId: number;
    currentStatus: string;
    statusColorClass: string;
}

export default function OrderStatusSelect({ orderId, currentStatus, statusColorClass }: Props) {
    const router = useRouter();
    const [status, setStatus] = useState(currentStatus);
    const [saving, setSaving] = useState(false);

    async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const newStatus = e.target.value;
        setStatus(newStatus);
        setSaving(true);
        try {
            await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            router.refresh();
        } finally {
            setSaving(false);
        }
    }

    const colorClass = {
        pending: 'order-status-pending',
        confirmed: 'order-status-confirmed',
        processing: 'order-status-processing',
        shipped: 'order-status-shipped',
        delivered: 'order-status-delivered',
        cancelled: 'order-status-cancelled',
    }[status] || statusColorClass;

    return (
        <select
            value={status}
            onChange={handleChange}
            disabled={saving}
            className={`order-status-select ${colorClass}`}
        >
            {STATUSES.map((s) => (
                <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
            ))}
        </select>
    );
}
