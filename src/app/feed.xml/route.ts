import { db } from '@/db';
import { products, productImages } from '@/db/schema';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const baseUrl = process.env.SITE_URL || 'https://hear.hearingsolutions.co.in';
    const allProducts = await db.select().from(products);
    const allImages = await db.select().from(productImages);

    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
    <title>HearClear Products</title>
    <link>${baseUrl}</link>
    <description>Product data feed for Google Merchant Center</description>
    ${allProducts.map(product => {
        const image = allImages.find(img => img.productId === product.id && img.position === 0) || allImages.find(img => img.productId === product.id);
        const imageUrl = image ? (image.url.startsWith('http') ? image.url : `${baseUrl}${image.url}`) : `${baseUrl}/favicon.ico`;

        return `
    <item>
        <g:id>${product.id}</g:id>
        <g:title><![CDATA[${product.title}]]></g:title>
        <g:description><![CDATA[${product.description || product.title}]]></g:description>
        <g:link>${baseUrl}/products/${product.slug}</g:link>
        <g:image_link>${imageUrl}</g:image_link>
        <g:price>${product.mrp} INR</g:price>
        <g:availability>in_stock</g:availability>
        <g:condition>new</g:condition>
        <g:identifier_exists>no</g:identifier_exists>
    </item>`;
    }).join('')}
</channel>
</rss>`;

    return new NextResponse(rss, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}
