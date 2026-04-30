import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.SITE_URL || 'https://hear.hearingsolutions.co.in';
    return {
        rules: { userAgent: '*', allow: '/', disallow: '/admin/' },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
