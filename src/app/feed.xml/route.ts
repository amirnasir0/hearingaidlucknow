import { db } from '@/db';
import { products, productImages, categories } from '@/db/schema';
import { getSiteSettings } from '@/lib/settings';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const baseUrl = (process.env.SITE_URL || '').replace(/\/$/, '');

    const [settings, allProducts, allImages, allCategories] = await Promise.all([
        getSiteSettings(),
        db.select().from(products),
        db.select().from(productImages),
        db.select().from(categories),
    ]);

    const categoryMap = new Map(allCategories.map((c) => [c.id, c.name]));

    const items = allProducts.map((product) => {
        const image =
            allImages.find((img) => img.productId === product.id && img.position === 0) ||
            allImages.find((img) => img.productId === product.id);

        // Skip items with no real product image — Google rejects favicon/logo fallbacks
        if (!image) return null;

        const imageUrl = image.url.startsWith('http') ? image.url : `${baseUrl}${image.url}`;

        const rawDescription = product.description
            ? product.description.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
            : '';
        const description = rawDescription || `${product.title} — premium hearing aid by ${settings.brandName}. Available in India.`;

        const brandName = product.categoryId
            ? (categoryMap.get(product.categoryId) || settings.brandName)
            : settings.brandName;

        const price = `${parseFloat(product.mrp).toFixed(2)} INR`;

        return `
    <item>
        <g:id>${product.slug}</g:id>
        <g:title><![CDATA[${product.title}]]></g:title>
        <g:description><![CDATA[${description}]]></g:description>
        <g:link>${baseUrl}/products/${product.slug}</g:link>
        <g:image_link>${imageUrl}</g:image_link>
        <g:price>${price}</g:price>
        <g:availability>in_stock</g:availability>
        <g:condition>new</g:condition>
        <g:brand><![CDATA[${brandName}]]></g:brand>
        <g:google_product_category>Electronics &gt; Communications &gt; Hearing Aids</g:google_product_category>
        <g:product_type><![CDATA[Hearing Aids]]></g:product_type>
        <g:identifier_exists>no</g:identifier_exists>
    </item>`;
    }).filter(Boolean).join('');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
    <title><![CDATA[${settings.brandName} Products]]></title>
    <link>${baseUrl}</link>
    <description><![CDATA[Product feed for Google Merchant Center — ${settings.brandName}]]></description>
    ${items}
</channel>
</rss>`;

    return new NextResponse(rss, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
        },
    });
}
