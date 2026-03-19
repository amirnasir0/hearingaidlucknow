'use client';

import { useState } from 'react';
import type { Settings } from '@/lib/settings';

export default function SettingsForm({ initial }: { initial: Settings }) {
    const [form, setForm] = useState(initial);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError('');
        const res = await fetch('/api/settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });
        setSaving(false);
        if (res.ok) {
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } else {
            setError('Failed to save settings. Please try again.');
        }
    }

    return (
        <div className="card" style={{ maxWidth: 600 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Brand & Contact Settings</h2>

            {saved && (
                <div style={{ marginBottom: 16, padding: '10px 14px', background: '#d1fae5', color: '#065f46', borderRadius: 8, fontSize: 14 }}>
                    ✅ Settings saved successfully
                </div>
            )}
            {error && (
                <div style={{ marginBottom: 16, padding: '10px 14px', background: '#fee2e2', color: '#991b1b', borderRadius: 8, fontSize: 14 }}>
                    ⚠️ {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="form-group">
                    <label className="form-label">Brand Name</label>
                    <input
                        className="form-input"
                        value={form.brandName}
                        onChange={(e) => setForm((f) => ({ ...f, brandName: e.target.value }))}
                        required
                        placeholder="Hearing Solutions"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Brand Logo URL</label>
                    <input
                        className="form-input"
                        type="url"
                        value={form.brandLogoUrl ?? ''}
                        onChange={(e) => setForm((f) => ({ ...f, brandLogoUrl: e.target.value || null }))}
                        placeholder="https://your-cdn.com/logo.png"
                    />
                    {form.brandLogoUrl && (
                        <img
                            src={form.brandLogoUrl}
                            alt="Logo preview"
                            style={{ marginTop: 10, height: 48, objectFit: 'contain', borderRadius: 6, border: '1px solid #e8eaf6' }}
                        />
                    )}
                    <p style={{ fontSize: 12, color: '#8b90a8', marginTop: 4 }}>
                        If set, replaces the emoji icon in the nav and footer.
                    </p>
                </div>

                <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                        className="form-input"
                        value={form.phone ?? ''}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value || null }))}
                        placeholder="+91 98765 43210"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                        className="form-input"
                        type="email"
                        value={form.email ?? ''}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value || null }))}
                        placeholder="contact@hearingsolutions.in"
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                    style={{ alignSelf: 'flex-start' }}
                >
                    {saving ? '⏳ Saving...' : '💾 Save Settings'}
                </button>
            </form>
        </div>
    );
}
