import { db } from '@/db';
import { products } from '@/db/schema';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://hearclear.com';

    const allProducts = await db.select({ slug: products.slug, updatedAt: products.updatedAt }).from(products);

    const productUrls: MetadataRoute.Sitemap = allProducts.map((p) => ({
        url: `${baseUrl}/products/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    return [
        { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
        ...productUrls,
    ];
}
