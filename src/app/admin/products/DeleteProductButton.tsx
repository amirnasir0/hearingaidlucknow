'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteProductButton({ id }: { id: number }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleDelete() {
        if (!confirm('Delete this product? This action cannot be undone.')) return;
        setLoading(true);
        await fetch(`/api/products/${id}`, { method: 'DELETE' });
        router.refresh();
        setLoading(false);
    }

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="btn btn-danger btn-sm"
        >
            {loading ? '...' : '🗑️ Delete'}
        </button>
    );
}
