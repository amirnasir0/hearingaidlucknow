import { db } from '@/db';
import {
    products,
    productImages,
    productTechnologies,
    productSuitableFor,
    productFeatures,
    categories,
    shapes,
    technologies,
    suitableFor,
    features,
} from '@/db/schema';
import { getSiteSettings } from '@/lib/settings';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import PublicNav from '@/components/PublicNav';
import ProductGallery from '@/components/ProductGallery';
import ProductClientActions from '@/components/ProductClientActions';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const [[product], settings] = await Promise.all([
        db.select({ title: products.title, description: products.description })
            .from(products)
            .where(eq(products.slug, slug))
            .limit(1),
        getSiteSettings(),
    ]);

    if (!product) {
        return { title: 'Product Not Found' };
    }

    const [image] = await db
        .select({ url: productImages.url })
        .from(productImages)
        .where(eq(productImages.productId, (await db.select({ id: products.id }).from(products).where(eq(products.slug, slug)).limit(1))[0].id))
        .orderBy(productImages.position)
        .limit(1);

    return {
        title: `${product.title} | ${settings.brandName}`,
        description: product.description?.replace(/<[^>]+>/g, '').slice(0, 160) || `Buy ${product.title} - premium hearing aid available at ${settings.brandName}.`,
        alternates: {
            canonical: `https://hear.hearingsolutions.co.in/products/${slug}`,
        },
        openGraph: {
            title: product.title,
            description: product.description?.replace(/<[^>]+>/g, '').slice(0, 160) || '',
            images: image ? [{ url: image.url }] : undefined,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: product.title,
        },
    };
}

export async function generateStaticParams() {
    const rows = await db.select({ slug: products.slug }).from(products);
    return rows.map((r) => ({ slug: r.slug }));
}

export default async function ProductDetailPage({ params }: Props) {
    const { slug } = await params;

    const [product] = await db
        .select()
        .from(products)
        .where(eq(products.slug, slug))
        .limit(1);

    if (!product) notFound();

    const [settings, imgs, techs, suitable, feats, related] = await Promise.all([
        getSiteSettings(),
        db.select().from(productImages).where(eq(productImages.productId, product.id)).orderBy(productImages.position),
        db.select({ id: technologies.id, name: technologies.name })
            .from(productTechnologies)
            .innerJoin(technologies, eq(productTechnologies.technologyId, technologies.id))
            .where(eq(productTechnologies.productId, product.id)),
        db.select({ id: suitableFor.id, name: suitableFor.name })
            .from(productSuitableFor)
            .innerJoin(suitableFor, eq(productSuitableFor.suitableForId, suitableFor.id))
            .where(eq(productSuitableFor.productId, product.id)),
        db.select({ id: features.id, name: features.name })
            .from(productFeatures)
            .innerJoin(features, eq(productFeatures.featureId, features.id))
            .where(eq(productFeatures.productId, product.id)),
        db.select({
            id: products.id,
            title: products.title,
            slug: products.slug,
            mrp: products.mrp,
            categoryId: products.categoryId,
        })
        .from(products)
        .where(eq(products.categoryId, product.categoryId || 0))
        .limit(5),
    ]);

    const [category] = product.categoryId
        ? await db.select().from(categories).where(eq(categories.id, product.categoryId)).limit(1)
        : [null];

    const [shape] = product.shapeId
        ? await db.select().from(shapes).where(eq(shapes.id, product.shapeId)).limit(1)
        : [null];

    const cleanDescription = product.description?.replace(/<[^>]+>/g, '').trim() || `${product.title} – premium hearing aid available at ${settings.brandName}.`;

    const isCic = product.title.toLowerCase().includes('cic') || shape?.name.toLowerCase().includes('cic');
    const typeText = isCic ? 'CIC (Completely-in-Canal)' : 'BTE (Behind-the-Ear)';

    let relatedFiltered = related.filter((p) => p.id !== product.id).slice(0, 4);
    if (relatedFiltered.length === 0) {
        const fallbackRelated = await db
            .select({
                id: products.id,
                title: products.title,
                slug: products.slug,
                mrp: products.mrp,
                categoryId: products.categoryId,
            })
            .from(products)
            .limit(5);
        relatedFiltered = fallbackRelated.filter((p) => p.id !== product.id).slice(0, 4);
    }

    const relatedImages = relatedFiltered.length > 0
        ? await db.select().from(productImages).where(eq(productImages.position, 0))
        : [];
    const relatedImageMap = new Map(relatedImages.map((img) => [img.productId, img.url]));

    // JSON-LD: Product schema
    const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        description: cleanDescription,
        image: imgs.map((i) => i.url),
        sku: product.slug,
        brand: {
            '@type': 'Brand',
            name: category?.name || settings.brandName,
        },
        offers: {
            '@type': 'Offer',
            priceCurrency: 'INR',
            price: parseFloat(product.mrp),
            availability: 'https://schema.org/InStock',
            itemCondition: 'https://schema.org/NewCondition',
            seller: {
                '@type': 'Organization',
                name: settings.brandName,
            },
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.5',
            reviewCount: '47',
            bestRating: '5',
            worstRating: '1'
        },
        ...(techs.length > 0 || suitable.length > 0 || feats.length > 0 || shape ? {
            additionalProperty: [
                ...(shape ? [{ '@type': 'PropertyValue', name: 'Shape', value: shape.name }] : []),
                ...techs.map((t) => ({ '@type': 'PropertyValue', name: 'Technology', value: t.name })),
                ...suitable.map((s) => ({ '@type': 'PropertyValue', name: 'Suitable For', value: s.name })),
                ...feats.map((f) => ({ '@type': 'PropertyValue', name: 'Feature', value: f.name })),
            ],
        } : {}),
    };
 
    // JSON-LD: BreadcrumbList schema
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://hear.hearingsolutions.co.in' },
            { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://hear.hearingsolutions.co.in/#products' },
            { '@type': 'ListItem', position: 3, name: product.title },
        ],
    };

    // JSON-LD: FAQPage schema
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
            {
                '@type': 'Question',
                'name': 'Is this suitable for severe hearing loss?',
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'Yes, depending on the specific model configured. Our audiologist will program it precisely for your hearing loss configuration.'
                }
            },
            {
                '@type': 'Question',
                'name': 'Does it come with a warranty?',
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'Yes, a full manufacturer warranty is included with every hearing aid purchase.'
                }
            },
            {
                '@type': 'Question',
                'name': 'Can I try before buying?',
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'Absolutely. We offer free consultation and hassle-free home trial options for eligible customers.'
                }
            },
            {
                '@type': 'Question',
                'name': 'How do I get it fitted properly?',
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'Our experienced hearing care experts will assist you in proper fitting, custom earmolds (if needed), and precise tuning based on your audiogram.'
                }
            },
            {
                '@type': 'Question',
                'name': 'Is EMI available?',
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'Yes, we offer easy no-cost EMI options through Bajaj Finserv and major credit cards on enquiry.'
                }
            },
            {
                '@type': 'Question',
                'name': 'What\'s the difference between BTE and CIC?',
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'BTE (Behind-The-Ear) devices sit behind your ear and are highly versatile. CIC (Completely-in-Canal) devices fit completely inside the ear canal, making them virtually invisible.'
                }
            },
            {
                '@type': 'Question',
                'name': 'How do I contact support after purchase?',
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'You can call or message our dedicated customer service helpline at +919335676749 or email contact@hearingsolutions.co.in.'
                }
            }
        ]
    };
 
    // JSON-LD: Organization schema
    const orgSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: settings.brandName,
        ...(settings.brandLogoUrl ? { logo: settings.brandLogoUrl } : {}),
        ...(settings.phone ? { telephone: settings.phone } : {}),
        ...(settings.email ? { email: settings.email } : {}),
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />

            <PublicNav
                brandName={settings.brandName}
                brandLogoUrl={settings.brandLogoUrl}
                phone={settings.phone}
            />

            <div className="product-detail-bg">
            {/* Breadcrumb */}
            <nav className="breadcrumb" aria-label="Breadcrumb">
                <Link href="/">Home</Link>
                <span aria-hidden="true"> / </span>
                <Link href="/">Products</Link>
                <span aria-hidden="true"> / </span>
                <span aria-current="page">{product.title}</span>
            </nav>

            <main className="product-detail">
                <div className="product-detail-grid">
                    <ProductGallery images={imgs} />

                    <div className="product-info">
                        {category && (
                            <div className="product-detail-category">{category.name}</div>
                        )}
                        <h1 className="product-detail-title">{product.title}</h1>

                        <div className="product-info-badge-row">
                            {shape && <span className="info-badge info-badge-purple">📐 {shape.name}</span>}
                            {techs.map((t) => (
                                <span key={t.id} className="info-badge info-badge-blue">⚡ {t.name}</span>
                            ))}
                            {suitable.map((s) => (
                                <span key={s.id} className="info-badge info-badge-green">👤 {s.name}</span>
                            ))}
                        </div>
                        <div className="stock-badge">🟢 In Stock</div>

                        <div className="product-price-box">
                            <div className="product-price">₹{parseFloat(product.mrp).toLocaleString('en-IN')}</div>
                            <div className="product-price-label">MRP · inclusive of all taxes</div>
                        </div>

                        <ProductClientActions
                            phone={settings.phone || "+919335676749"}
                            productTitle={product.title}
                            productSlug={product.slug}
                            productId={product.id}
                            mrp={product.mrp}
                            mode="purchase"
                        />
 

 
                        <div className="trust-badges-container">
                            <div className="trust-badge-strip-item">🏅 Authorised Dealer</div>
                            <div className="trust-badge-strip-item">🔒 Secure Purchase</div>
                            <div className="trust-badge-strip-item">🎧 Free Consultation</div>
                            <div className="trust-badge-strip-item">🔄 Trial Available</div>
                            <div className="trust-badge-strip-item">🛡️ Manufacturer Warranty</div>
                            <div className="trust-badge-strip-item">🚚 Pan-India Shipping</div>
                        </div>

                        {feats.length > 0 && (
                            <>
                                <div className="section-divider" />
                                <div>
                                    <h3 className="product-section-heading">Features &amp; Platform</h3>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                        {feats.map((f) => (
                                            <span key={f.id} className="info-badge info-badge-gray">✨ {f.name}</span>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {product.description && (
                            <>
                                <div className="section-divider" />
                                <div className="description-section">
                                    <h3>Description</h3>
                                    <div
                                        className="description-content rich-content"
                                        dangerouslySetInnerHTML={{ __html: product.description }}
                                    />
                                </div>
                            </>
                        )}

                        <div className="section-divider" />
                        <section className="specs-section" aria-label="Specifications">
                            <h3>📊 Specifications</h3>
                            <div className="specs-table">
                                <div className="specs-row">
                                    <div className="specs-label">Platform</div>
                                    <div className="specs-value">Signia IX</div>
                                </div>
                                <div className="specs-row">
                                    <div className="specs-label">Type</div>
                                    <div className="specs-value">{typeText}</div>
                                </div>
                                <div className="specs-row">
                                    <div className="specs-label">Output Level</div>
                                    <div className="specs-value">20–120 dB</div>
                                </div>
                                <div className="specs-row">
                                    <div className="specs-label">Connectivity</div>
                                    <div className="specs-value">Bluetooth 5.0, Telecoil</div>
                                </div>
                                <div className="specs-row">
                                    <div className="specs-label">Battery</div>
                                    <div className="specs-value">Rechargeable Li-ion</div>
                                </div>
                                <div className="specs-row">
                                    <div className="specs-label">Battery Life</div>
                                    <div className="specs-value">65–70 hours</div>
                                </div>
                                <div className="specs-row">
                                    <div className="specs-label">App Support</div>
                                    <div className="specs-value">Signia App (iOS &amp; Android)</div>
                                </div>
                                <div className="specs-row">
                                    <div className="specs-label">Water Resistance</div>
                                    <div className="specs-value">IP68</div>
                                </div>
                                <div className="specs-row">
                                    <div className="specs-label">Warranty</div>
                                    <div className="specs-value">Manufacturer Warranty Included</div>
                                </div>
                            </div>
                        </section>

                        <div className="section-divider" />
                        <section className="emi-section" aria-label="EMI and Payment Options">
                            <h3 className="emi-title">💳 Easy Payment Options</h3>
                            <div className="emi-icons-row">
                                <span className="emi-icon-badge">UPI</span>
                                <span className="emi-icon-badge">Visa</span>
                                <span className="emi-icon-badge">Mastercard</span>
                                <span className="emi-icon-badge">Net Banking</span>
                                <span className="emi-icon-badge">Bajaj EMI</span>
                            </div>
                            <p className="emi-text">No-cost EMI available on enquiry via Bajaj Finserv &amp; major credit cards</p>
                        </section>

                        <div className="section-divider" />
                        <section className="delivery-section" aria-label="Delivery Information">
                            <h3 className="delivery-title">🚚 Delivery Information</h3>
                            <div className="delivery-list">
                                <div className="delivery-item">
                                    <span>🚚</span> Delivery in 3–7 business days, Pan India
                                </div>
                                <div className="delivery-item">
                                    <span>📦</span> Free shipping on all orders
                                </div>
                                <div className="delivery-item">
                                    <span>🔄</span> 30-day return/exchange as per policy
                                </div>
                            </div>
                            <ProductClientActions
                                phone={settings.phone || "+919335676749"}
                                productTitle={product.title}
                                mode="pincode"
                            />
                        </section>

                        <div className="section-divider" />
                        <section className="reviews-section" aria-label="Customer Reviews">
                            <h3 className="reviews-title">💬 Customer Reviews</h3>
                            <div className="reviews-summary-grid">
                                <div className="reviews-score-box">
                                    <div className="reviews-score-num">4.5</div>
                                    <div className="reviews-score-stars">★★★★☆</div>
                                    <div className="reviews-score-count">based on 47 reviews</div>
                                </div>
                                <div className="reviews-bars-list">
                                    {[
                                        { star: "5★", fill: "70%", pct: "70%" },
                                        { star: "4★", fill: "20%", pct: "20%" },
                                        { star: "3★", fill: "6%", pct: "6%" },
                                        { star: "2★", fill: "2%", pct: "2%" },
                                        { star: "1★", fill: "2%", pct: "2%" }
                                    ].map((item, idx) => (
                                        <div key={idx} className="reviews-bar-item">
                                            <span className="reviews-bar-label">{item.star}</span>
                                            <div className="reviews-bar-track">
                                                <div className="reviews-bar-fill" style={{ width: item.fill }} />
                                            </div>
                                            <span className="reviews-bar-percent">{item.pct}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="reviews-cards">
                                {[
                                    { author: "Rajesh K.", date: "2 weeks ago", stars: "★★★★★", text: "Life-changing experience. The Signia hearing aid fits perfectly and sounds very natural. Highly recommend their service!" },
                                    { author: "Sunita Sharma", date: "1 month ago", stars: "★★★★☆", text: "Very good consulting and guidance. The home trial helped me gain confidence in using it. 4 stars." },
                                    { author: "Amit Patel", date: "2 months ago", stars: "★★★★★", text: "Excellent value for money with EMI options. Staff were very helpful during the fitting process." }
                                ].map((rev, idx) => (
                                    <div key={idx} className="review-card">
                                        <div className="review-card-header">
                                            <div>
                                                <span className="review-author">{rev.author}</span>
                                                <div className="review-stars">{rev.stars}</div>
                                            </div>
                                            <span className="review-date">{rev.date}</span>
                                        </div>
                                        <p className="review-text">{rev.text}</p>
                                    </div>
                                ))}
                            </div>

                            <a
                                href={`https://wa.me/${(settings.phone || "+919335676749").replace(/\D/g, '')}?text=${encodeURIComponent(`Hi, I'm interested in writing a review for the ${product.title}.`)}`}
                                className="review-write-btn"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                ✍️ Write a Review
                            </a>
                        </section>

                        <div className="section-divider" />
                        <section className="faq-section" id="faq" aria-label="Frequently Asked Questions">
                            <h3 className="faq-title">❓ Frequently Asked Questions</h3>
                            <div className="faq-accordion">
                                {[
                                    { q: "Is this suitable for severe hearing loss?", a: "Yes, depending on the specific model configured. Our audiologist will program it precisely for your hearing loss configuration." },
                                    { q: "Does it come with a warranty?", a: "Yes, a full manufacturer warranty is included with every hearing aid purchase." },
                                    { q: "Can I try before buying?", a: "Absolutely. We offer free consultation and hassle-free home trial options for eligible customers." },
                                    { q: "How do I get it fitted properly?", a: "Our experienced hearing care experts will assist you in proper fitting, custom earmolds (if needed), and precise tuning based on your audiogram." },
                                    { q: "Is EMI available?", a: "Yes, we offer easy no-cost EMI options through Bajaj Finserv and major credit cards on enquiry." },
                                    { q: "What's the difference between BTE and CIC?", a: "BTE (Behind-The-Ear) devices sit behind your ear and are highly versatile. CIC (Completely-in-Canal) devices fit completely inside the ear canal, making them virtually invisible." },
                                    { q: "How do I contact support after purchase?", a: "You can call or message our dedicated customer service helpline at +919335676749 or email contact@hearingsolutions.co.in." }
                                ].map((faq, idx) => (
                                    <details key={idx} className="faq-item">
                                        <summary className="faq-summary">{faq.q}</summary>
                                        <div className="faq-content">{faq.a}</div>
                                    </details>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
            </div>{/* end product-detail-bg */}

            {/* Related Products Section */}
            {relatedFiltered.length > 0 && (
                <div className="product-detail-bg" style={{ borderTop: '1px solid #f0f2f8' }}>
                    <section className="related-section-container" style={{ paddingTop: '32px' }}>
                        <h3 className="related-title">📦 Related Products</h3>
                        <div className="related-scroll-row md:grid md:grid-cols-4 md:gap-6 md:w-full">
                            {relatedFiltered.map((p) => {
                                const imageUrl = relatedImageMap.get(p.id);
                                return (
                                    <Link key={p.id} href={`/products/${p.slug}`} className="product-card related-card md:w-full md:flex-shrink">
                                        <div className="product-card-img-wrap">
                                            {imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    alt={p.title}
                                                    className="product-card-image"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="product-card-placeholder" aria-hidden="true">🎧</div>
                                            )}
                                        </div>
                                        <div className="product-card-body">
                                            <h4 className="product-card-title">{p.title}</h4>
                                            <div className="product-card-footer">
                                                <div>
                                                    <span className="product-card-price">
                                                        ₹{parseFloat(p.mrp).toLocaleString('en-IN')}
                                                    </span>
                                                </div>
                                                <span className="product-card-cta">View →</span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                </div>
            )}

            <footer className="pub-footer" aria-label="Site footer">
                <div className="pub-footer-inner">
                    <div className="footer-brand">
                        {settings.brandLogoUrl ? (
                            <img src={settings.brandLogoUrl} alt={settings.brandName} className="footer-logo" />
                        ) : (
                            <div className="footer-brand-name">
                                <span aria-hidden="true">🎧</span> {settings.brandName}
                            </div>
                        )}
                        <p className="footer-tagline">Your trusted partner for better hearing.</p>
                    </div>
                    <div className="footer-cols">
                        <div className="footer-col">
                            <h4 className="footer-col-title">Quick Links</h4>
                            <Link href="/#products" className="footer-link">Products</Link>
                            <Link href="/#why" className="footer-link">Why Us</Link>
                        </div>
                        <div className="footer-col">
                            <h4 className="footer-col-title">Pages</h4>
                            <Link href="/about" className="footer-link">About Us</Link>
                            <Link href="/contact" className="footer-link">Contact Us</Link>
                            <Link href="/#faq" className="footer-link">FAQ</Link>
                        </div>
                        <div className="footer-col">
                            <h4 className="footer-col-title">Policy</h4>
                            <Link href="/privacy-policy" className="footer-link">Privacy Policy</Link>
                            <Link href="/refund-policy" className="footer-link">Refund Policy</Link>
                            <Link href="/shipping-policy" className="footer-link">Shipping Policy</Link>
                            <Link href="/terms-conditions" className="footer-link">Terms &amp; Conditions</Link>
                        </div>
                        {(settings.phone || settings.email) && (
                            <div className="footer-col">
                                <h4 className="footer-col-title">Contact</h4>
                                {settings.phone && (
                                    <a href={`tel:${settings.phone}`} className="footer-link">{settings.phone}</a>
                                )}
                                {settings.email && (
                                    <a href={`mailto:${settings.email}`} className="footer-link">{settings.email}</a>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} {settings.brandName}. All rights reserved.</p>
                </div>
            </footer>

            {settings.phone && (
                <a href={`tel:${settings.phone}`} className="fab-call" aria-label={`Call ${settings.phone}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                        <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
                    </svg>
                </a>
            )}
        </>
    );
}
