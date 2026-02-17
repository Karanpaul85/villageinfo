import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            disallow: "/",
        },
        sitemap: 'https://yourdomain.com/sitemap.xml',
    }
}