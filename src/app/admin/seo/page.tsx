import { db } from '@/db';
import { products } from '@/db/schema';
import { sql } from 'drizzle-orm';
import Link from 'next/link';

export default async function SeoAndFeedsPage() {
    const [productCountResult] = await db.select({ count: sql<number>`count(*)` }).from(products);
    const productCount = productCountResult?.count ?? 0;

    return (
        <>
            <div className="admin-header">
                <div>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>SEO & Feeds</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Manage your sitemaps and product feeds</div>
                </div>
            </div>

            <div className="admin-main">
                {/* Stats Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 32 }}>
                    <div className="card" style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 1 }}>ACTIVE PRODUCTS</div>
                        <div style={{ fontSize: 36, fontWeight: 800 }}>{productCount}</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            SYNCING TO FEEDS
                        </div>
                    </div>

                    <div className="card" style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 1 }}>BLOG ARTICLES</div>
                        <div style={{ fontSize: 36, fontWeight: 800 }}>0</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            IN SITEMAP
                        </div>
                    </div>

                    <div className="card" style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 1 }}>LAST CRAWL CHECK</div>
                        <div style={{ fontSize: 36, fontWeight: 800 }}>Active</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: 0.5 }}>ALL FEEDS HEALTHY</div>
                    </div>
                </div>

                {/* Main Cards Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 24 }}>
                    
                    {/* Sitemap XML Card */}
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 32 }}>
                        <div style={{ width: 48, height: 48, background: 'var(--accent-blue)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                        </div>
                        
                        <div>
                            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase' }}>Sitemap XML</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Complete index of products, blogs, and static pages for search engines.</p>
                        </div>

                        <div style={{ display: 'flex', gap: 16 }}>
                            <div style={{ flex: 1, background: 'var(--bg-primary)', padding: 16, borderRadius: 12, border: '1px solid var(--border-color)' }}>
                                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>TOTAL INDEXED PAGES</div>
                                <div style={{ fontSize: 20, fontWeight: 700 }}>{Number(productCount) + 1}</div>
                            </div>
                            <div style={{ flex: 1, background: 'var(--bg-primary)', padding: 16, borderRadius: 12, border: '1px solid var(--border-color)' }}>
                                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>FORMAT</div>
                                <div style={{ fontSize: 20, fontWeight: 700 }}>XML / Text</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 12, marginTop: 'auto' }}>
                            <Link href="/sitemap.xml" target="_blank" style={{ flex: 1, background: '#000', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '14px', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: 13, letterSpacing: 0.5, gap: 8 }}>
                                VIEW FEED
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                            </Link>
                            <button style={{ width: 48, height: 48, background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                            </button>
                        </div>
                    </div>

                    {/* Merchant Center Feed Card */}
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 32 }}>
                        <div style={{ width: 48, height: 48, background: '#ea580c', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </div>
                        
                        <div>
                            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase' }}>Merchant Center Feed</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Product data feed for Google Shopping and Merchant Center integration.</p>
                        </div>

                        <div style={{ display: 'flex', gap: 16 }}>
                            <div style={{ flex: 1, background: 'var(--bg-primary)', padding: 16, borderRadius: 12, border: '1px solid var(--border-color)' }}>
                                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>PRODUCTS IN FEED</div>
                                <div style={{ fontSize: 20, fontWeight: 700 }}>{productCount}</div>
                            </div>
                            <div style={{ flex: 1, background: 'var(--bg-primary)', padding: 16, borderRadius: 12, border: '1px solid var(--border-color)' }}>
                                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>FORMAT</div>
                                <div style={{ fontSize: 20, fontWeight: 700 }}>RSS 2.0 / XML</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 12, marginTop: 'auto' }}>
                            <Link href="/feed.xml" target="_blank" style={{ flex: 1, background: '#000', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '14px', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: 13, letterSpacing: 0.5, gap: 8 }}>
                                VIEW FEED
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                            </Link>
                            <button style={{ width: 48, height: 48, background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
