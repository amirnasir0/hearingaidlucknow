'use client';

import Link from 'next/link';
import { useState } from 'react';

type Props = {
    brandName: string;
    brandLogoUrl: string | null;
    phone: string | null;
};

export default function PublicNav({ brandName, brandLogoUrl, phone }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <header className="pub-header">
            <nav className="pub-nav" aria-label="Main navigation">
                <Link href="/" className="pub-logo" aria-label={brandName}>
                    {brandLogoUrl ? (
                        <img src={brandLogoUrl} alt={brandName} className="pub-logo-img" />
                    ) : (
                        <>
                            <div className="pub-logo-icon" aria-hidden="true">🎧</div>
                            <span className="pub-logo-text">{brandName}</span>
                        </>
                    )}
                </Link>

                <div className={`pub-nav-links${open ? ' open' : ''}`}>
                    <Link href="/#products" className="pub-nav-link" onClick={() => setOpen(false)}>Products</Link>
                    {phone && (
                        <a href={`tel:${phone}`} className="pub-nav-phone" onClick={() => setOpen(false)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
                            </svg>
                            {phone}
                        </a>
                    )}
                </div>

                <button
                    className="pub-hamburger"
                    onClick={() => setOpen(!open)}
                    aria-label={open ? 'Close menu' : 'Open menu'}
                    aria-expanded={open}
                >
                    <span className={`ham-line${open ? ' open' : ''}`} />
                    <span className={`ham-line${open ? ' open' : ''}`} />
                    <span className={`ham-line${open ? ' open' : ''}`} />
                </button>
            </nav>

            {open && <div className="pub-nav-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />}
        </header>
    );
}
