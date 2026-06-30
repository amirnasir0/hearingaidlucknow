import { db } from '@/db';
import { products, productImages, categories } from '@/db/schema';
import { getSiteSettings } from '@/lib/settings';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import PublicNav from '@/components/PublicNav';
import CheckoutForm from '@/components/CheckoutForm';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const [[product], settings] = await Promise.all([
        db.select({ title: products.title }).from(products).where(eq(products.slug, slug)).limit(1),
        getSiteSettings(),
    ]);
    return {
        title: product ? `Checkout — ${product.title} | ${settings.brandName}` : 'Checkout',
        robots: { index: false },
    };
}

export default async function CheckoutPage({ params }: Props) {
    const { slug } = await params;

    const [product] = await db
        .select()
        .from(products)
        .where(eq(products.slug, slug))
        .limit(1);

    if (!product) notFound();

    const [settings, images] = await Promise.all([
        getSiteSettings(),
        db.select().from(productImages)
            .where(eq(productImages.productId, product.id))
            .orderBy(productImages.position),
    ]);

    const [category] = product.categoryId
        ? await db.select().from(categories).where(eq(categories.id, product.categoryId)).limit(1)
        : [null];

    const mainImage = images[0]?.url;

    return (
        <>
            <PublicNav
                brandName={settings.brandName}
                brandLogoUrl={settings.brandLogoUrl}
                phone={settings.phone}
            />

            <div className="checkout-page">
                <nav className="breadcrumb" aria-label="Breadcrumb">
                    <Link href="/">Home</Link>
                    <span aria-hidden="true"> / </span>
                    <Link href={`/products/${product.slug}`}>{product.title}</Link>
                    <span aria-hidden="true"> / </span>
                    <span aria-current="page">Checkout</span>
                </nav>

                <div className="checkout-layout">
                    <div className="checkout-product-summary">
                        {mainImage && (
                            <img
                                src={mainImage}
                                alt={product.title}
                                className="checkout-product-img"
                            />
                        )}
                        <div className="checkout-product-info">
                            {category && (
                                <div className="checkout-product-brand">{category.name}</div>
                            )}
                            <h2 className="checkout-product-name">{product.title}</h2>
                            <div className="checkout-product-price">
                                ₹{parseFloat(product.mrp).toLocaleString('en-IN')}
                            </div>
                            <div className="checkout-product-tags">
                                <span className="checkout-tag">✅ In Stock</span>
                                <span className="checkout-tag">🚚 Free Shipping</span>
                                <span className="checkout-tag">🛡️ Warranty Included</span>
                            </div>
                            <Link href={`/products/${product.slug}`} className="checkout-back-link">
                                ← Back to product
                            </Link>
                        </div>
                    </div>

                    <div className="checkout-form-section">
                        <h1 className="checkout-form-title">Complete Your Order</h1>
                        <p className="checkout-form-subtitle">
                            Fill in your delivery details — we&apos;ll confirm via call within 15 minutes.
                        </p>
                        <CheckoutForm
                            phone={settings.phone || '+919335676749'}
                            productTitle={product.title}
                            productSlug={product.slug}
                            productId={product.id}
                            mrp={product.mrp}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
