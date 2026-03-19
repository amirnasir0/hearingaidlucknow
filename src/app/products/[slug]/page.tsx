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

    const [settings, imgs, techs, suitable, feats] = await Promise.all([
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
    ]);

    const [category] = product.categoryId
        ? await db.select().from(categories).where(eq(categories.id, product.categoryId)).limit(1)
        : [null];

    const [shape] = product.shapeId
        ? await db.select().from(shapes).where(eq(shapes.id, product.shapeId)).limit(1)
        : [null];

    const cleanDescription = product.description?.replace(/<[^>]+>/g, '').trim() || `${product.title} – premium hearing aid available at ${settings.brandName}.`;

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
            price: product.mrp,
            availability: 'https://schema.org/InStock',
            itemCondition: 'https://schema.org/NewCondition',
            seller: {
                '@type': 'Organization',
                name: settings.brandName,
            },
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
            { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
            { '@type': 'ListItem', position: 2, name: 'Products', item: '/#products' },
            { '@type': 'ListItem', position: 3, name: product.title },
        ],
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

                        <div className="product-price-box">
                            <div className="product-price">₹{parseFloat(product.mrp).toLocaleString('en-IN')}</div>
                            <div className="product-price-label">MRP · inclusive of all taxes</div>
                        </div>

                        <div className="product-cta-row">
                            {settings.phone && (
                                <a href={`tel:${settings.phone}`} className="product-call-btn">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                        <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
                                    </svg>
                                    Call to Enquire
                                </a>
                            )}
                            {settings.phone && (
                                <a
                                    href={`https://wa.me/${settings.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi, I'm interested in the ${product.title}. Can you share more details?`)}`}
                                    className="product-whatsapp-btn"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                    WhatsApp
                                </a>
                            )}
                        </div>

                        <div className="product-trust-row">
                            <div className="product-trust-item"><span className="product-trust-icon">✓</span> Free Consultation</div>
                            <div className="product-trust-item"><span className="product-trust-icon">✓</span> Trial Available</div>
                            <div className="product-trust-item"><span className="product-trust-icon">✓</span> Authorised Dealer</div>
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
                    </div>
                </div>
            </main>
            </div>{/* end product-detail-bg */}

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
                            <Link href="/" className="footer-link">All Products</Link>
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
