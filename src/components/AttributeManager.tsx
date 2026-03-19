'use client';

import { useState } from 'react';

type Item = { id: number; name: string };
type AttributeManagerProps = {
    type: string;
    initialItems: Item[];
};

export default function AttributeManager({ type, initialItems }: AttributeManagerProps) {
    const [items, setItems] = useState<Item[]>(initialItems);
    const [newName, setNewName] = useState('');
    const [adding, setAdding] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        if (!newName.trim()) return;
        setAdding(true);

        const res = await fetch(`/api/attributes/${type}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName.trim() }),
        });

        if (res.ok) {
            const item = await res.json();
            setItems([...items, item]);
            setNewName('');
        }
        setAdding(false);
    }

    async function handleDelete(id: number) {
        if (!confirm('Remove this attribute? Products using it will lose this value.')) return;
        setDeletingId(id);
        await fetch(`/api/attributes/${type}/${id}`, { method: 'DELETE' });
        setItems(items.filter((i) => i.id !== id));
        setDeletingId(null);
    }

    return (
        <div>
            <form onSubmit={handleAdd} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                <input
                    type="text"
                    className="form-input"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Add new item…"
                    style={{ flex: 1 }}
                />
                <button type="submit" className="btn btn-primary" disabled={adding || !newName.trim()}>
                    {adding ? '⏳' : '＋ Add'}
                </button>
            </form>

            {items.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '32px 0' }}>
                    No items yet. Add the first one above.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {items.map((item) => (
                        <div
                            key={item.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '10px 16px',
                                background: 'var(--bg-primary)',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border-color)',
                            }}
                        >
                            <span style={{ fontSize: 14, fontWeight: 500 }}>{item.name}</span>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(item.id)}
                                disabled={deletingId === item.id}
                            >
                                {deletingId === item.id ? '⏳' : '🗑️ Remove'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
