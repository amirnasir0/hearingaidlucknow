import { db } from '@/db';
import { products } from '@/db/schema';
import { NextResponse } from 'next/server';

export async function GET() {
    const baseUrl = process.env.SITE_URL || 'https://hear.hearingsolutions.co.in';
    const allProducts = await db.select().from(products);

    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
    <title>HearClear Products</title>
    <link>${baseUrl}</link>
    <description>Latest products from HearClear</description>
    ${allProducts.map(product => `
    <item>
        <title><![CDATA[${product.title}]]></title>
        <link>${baseUrl}/products/${product.slug}</link>
        <description><![CDATA[${product.description || ''}]]></description>
        <pubDate>${new Date(product.createdAt || new Date()).toUTCString()}</pubDate>
    </item>`).join('')}
</channel>
</rss>`;

    return new NextResponse(rss, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}
