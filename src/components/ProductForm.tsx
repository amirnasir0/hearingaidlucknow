'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import slugify from 'slugify';
import Image from 'next/image';

type Attribute = { id: number; name: string };
type ProductFormProps = {
    initialData?: {
        id: number;
        title: string;
        mrp: string;
        description: string | null;
        categoryId: number | null;
        shapeId: number | null;
        images: { url: string; position: number }[];
        technologyIds: number[];
        suitableForIds: number[];
        featureIds: number[];
    };
    categories: Attribute[];
    technologies: Attribute[];
    shapes: Attribute[];
    suitableFor: Attribute[];
    features: Attribute[];
};

function MultiSelect({
    label,
    options,
    selected,
    onChange,
}: {
    label: string;
    options: Attribute[];
    selected: number[];
    onChange: (ids: number[]) => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handle(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener('mousedown', handle);
        return () => document.removeEventListener('mousedown', handle);
    }, []);

    const toggle = (id: number) => {
        if (selected.includes(id)) {
            onChange(selected.filter((s) => s !== id));
        } else {
            onChange([...selected, id]);
        }
    };

    const selectedItems = options.filter((o) => selected.includes(o.id));

    return (
        <div className="form-group" ref={ref} style={{ position: 'relative' }}>
            <label className="form-label">{label}</label>
            <div
                className="multi-select-container"
                onClick={() => setOpen(!open)}
                style={{ cursor: 'pointer' }}
            >
                {selectedItems.length > 0 ? (
                    <div className="multi-select-tags">
                        {selectedItems.map((item) => (
                            <span key={item.id} className="multi-select-tag">
                                {item.name}
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); toggle(item.id); }}
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Click to select…</span>
                )}
            </div>
            {open && (
                <div className="multi-select-dropdown">
                    {options.length === 0 ? (
                        <div className="multi-select-option" style={{ color: 'var(--text-muted)' }}>
                            No options. Add in Attributes.
                        </div>
                    ) : (
                        options.map((opt) => (
                            <div
                                key={opt.id}
                                className={`multi-select-option ${selected.includes(opt.id) ? 'selected' : ''}`}
                                onClick={(e) => { e.stopPropagation(); toggle(opt.id); }}
                            >
                                <span style={{ fontSize: 16 }}>{selected.includes(opt.id) ? '☑' : '☐'}</span>
                                {opt.name}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default function ProductForm({ initialData, categories, technologies, shapes, suitableFor, features }: ProductFormProps) {
    const isEdit = !!initialData;
    const router = useRouter();

    const [title, setTitle] = useState(initialData?.title ?? '');
    const [mrp, setMrp] = useState(initialData?.mrp ?? '');
    const [description, setDescription] = useState(initialData?.description ?? '');
    const [categoryId, setCategoryId] = useState<string>(initialData?.categoryId?.toString() ?? '');
    const [shapeId, setShapeId] = useState<string>(initialData?.shapeId?.toString() ?? '');
    const [technologyIds, setTechnologyIds] = useState<number[]>(initialData?.technologyIds ?? []);
    const [suitableForIds, setSuitableForIds] = useState<number[]>(initialData?.suitableForIds ?? []);
    const [featureIds, setFeatureIds] = useState<number[]>(initialData?.featureIds ?? []);
    const [images, setImages] = useState<string[]>(
        initialData?.images.sort((a, b) => a.position - b.position).map((i) => i.url) ?? []
    );
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);

    const slug = slugify(title, { lower: true, strict: true });

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, slot: number) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingSlot(slot);
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();

        if (data.url) {
            const newImages = [...images];
            newImages[slot] = data.url;
            setImages(newImages);
        } else if (data.error) {
            setError(`Image upload failed: ${data.error}`);
        }
        setUploadingSlot(null);
        e.target.value = '';
    }

    function removeImage(slot: number) {
        const newImages = [...images];
        newImages.splice(slot, 1);
        setImages(newImages);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError('');

        const payload = {
            title,
            mrp: parseFloat(mrp),
            description,
            categoryId: categoryId ? parseInt(categoryId) : null,
            shapeId: shapeId ? parseInt(shapeId) : null,
            images,
            technologyIds,
            suitableForIds,
            featureIds,
        };

        const url = isEdit ? `/api/products/${initialData!.id}` : '/api/products';
        const method = isEdit ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            router.push('/admin/products');
            router.refresh();
        } else {
            const data = await res.json();
            setError(data.error || 'Something went wrong. Please try again.');
            setSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            {error && <div className="error-alert" style={{ marginBottom: 20 }}>⚠️ {error}</div>}

            <div className="grid-2">
                {/* Left column */}
                <div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="title">Product Title *</label>
                        <input
                            id="title"
                            type="text"
                            className="form-input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Signia Pure Charge&Go AX"
                            required
                        />
                        {title && (
                            <div className="slug-preview">
                                🔗 URL: <span className="slug-preview-value">/products/{slug}</span>
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="mrp">MRP (₹) *</label>
                        <input
                            id="mrp"
                            type="number"
                            className="form-input"
                            value={mrp}
                            onChange={(e) => setMrp(e.target.value)}
                            placeholder="e.g. 85000"
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="category">Category</label>
                        <div style={{ position: 'relative' }}>
                            <select
                                id="category"
                                className="form-select"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                style={{ paddingRight: 40 }}
                            >
                                <option value="">Select category…</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}>▾</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="shape">Shape</label>
                        <div style={{ position: 'relative' }}>
                            <select
                                id="shape"
                                className="form-select"
                                value={shapeId}
                                onChange={(e) => setShapeId(e.target.value)}
                                style={{ paddingRight: 40 }}
                            >
                                <option value="">Select shape…</option>
                                {shapes.map((s) => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                            <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}>▾</span>
                        </div>
                    </div>

                    <MultiSelect
                        label="Technology (multi-select)"
                        options={technologies}
                        selected={technologyIds}
                        onChange={setTechnologyIds}
                    />

                    <MultiSelect
                        label="Suitable For (multi-select)"
                        options={suitableFor}
                        selected={suitableForIds}
                        onChange={setSuitableForIds}
                    />

                    <MultiSelect
                        label="Features & Platform (multi-select)"
                        options={features}
                        selected={featureIds}
                        onChange={setFeatureIds}
                    />
                </div>

                {/* Right column */}
                <div>
                    <div className="form-group">
                        <label className="form-label">Product Images (max 3)</label>
                        <div className="image-upload-grid">
                            {[0, 1, 2].map((slot) => (
                                <div key={slot}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id={`img-${slot}`}
                                        onChange={(e) => handleImageUpload(e, slot)}
                                        disabled={uploadingSlot !== null}
                                    />
                                    <label htmlFor={`img-${slot}`}>
                                        <div className="image-slot">
                                            {uploadingSlot === slot ? (
                                                <div style={{ textAlign: 'center' }}>
                                                    <div style={{ fontSize: 24, marginBottom: 8 }}>⏳</div>
                                                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Uploading…</div>
                                                </div>
                                            ) : images[slot] ? (
                                                <>
                                                    <img src={images[slot]} alt={`Product image ${slot + 1}`} />
                                                    <button
                                                        type="button"
                                                        className="image-slot-remove"
                                                        onClick={(e) => { e.preventDefault(); removeImage(slot); }}
                                                    >
                                                        ×
                                                    </button>
                                                </>
                                            ) : (
                                                <div style={{ textAlign: 'center' }}>
                                                    <div style={{ fontSize: 28, marginBottom: 8 }}>📷</div>
                                                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                                                        Image {slot + 1}
                                                    </div>
                                                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
                                                        Click to upload
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </label>
                                </div>
                            ))}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
                            JPG, PNG, WebP • Max 5MB each
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="description">Product Description</label>
                        <textarea
                            id="description"
                            className="form-textarea"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the product, its features, benefits, and what makes it special…"
                            style={{ minHeight: 200 }}
                        />
                    </div>
                </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 24, display: 'flex', gap: 12 }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? '⏳ Saving…' : isEdit ? '✅ Update Product' : '✅ Create Product'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => router.back()}>
                    Cancel
                </button>
            </div>
        </form>
    );
}
