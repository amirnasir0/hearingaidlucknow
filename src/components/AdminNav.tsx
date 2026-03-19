'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const navItems = [
    { href: '/admin/dashboard', icon: '🏠', label: 'Dashboard' },
    { href: '/admin/products', icon: '🎧', label: 'Products' },
    { href: '/admin/attributes', icon: '🏷️', label: 'Attributes' },
    { href: '/admin/settings', icon: '⚙️', label: 'Settings' },
];

export default function AdminNav({ brandName }: { brandName: string }) {
    const pathname = usePathname();

    return (
        <aside className="admin-sidebar">
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">🎧</div>
                <div>
                    <div className="sidebar-logo-text">{brandName}</div>
                    <div className="sidebar-logo-sub">Admin Panel</div>
                </div>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-section-title">Navigation</div>
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`nav-link ${pathname.startsWith(item.href) ? 'active' : ''}`}
                    >
                        <span className="nav-link-icon">{item.icon}</span>
                        {item.label}
                    </Link>
                ))}

                <div className="nav-section-title" style={{ marginTop: 16 }}>Site</div>
                <Link href="/" target="_blank" className="nav-link">
                    <span className="nav-link-icon">🌐</span>
                    View Website
                </Link>
            </nav>

            <div className="sidebar-footer">
                <button
                    onClick={() => signOut({ callbackUrl: '/admin/login' })}
                    className="btn btn-secondary w-full"
                    style={{ justifyContent: 'center' }}
                >
                    🚪 Sign Out
                </button>
            </div>
        </aside>
    );
}
