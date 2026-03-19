'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError('Invalid email or password. Please try again.');
            setLoading(false);
        } else {
            const callbackUrl = searchParams.get('callbackUrl') || '/admin/dashboard';
            router.push(callbackUrl);
        }
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-logo">
                    <div className="login-logo-icon">🎧</div>
                </div>
                <h1 className="login-title">Welcome back</h1>
                <p className="login-subtitle">Sign in to the admin panel</p>

                {error && <div className="error-alert">⚠️ {error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@example.com"
                            required
                            autoFocus
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        style={{ justifyContent: 'center', padding: '14px', fontSize: '15px', marginTop: '8px' }}
                        disabled={loading}
                    >
                        {loading ? '⏳ Signing in...' : '🔐 Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}
