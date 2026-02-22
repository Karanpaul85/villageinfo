import { HOST } from '@/lib/constants/constants'
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            disallow: "/",
        },
        sitemap: [
            `${HOST}/sitemap.xml`,
            `${HOST}/districts-sitemap.xml`,
            `${HOST}/tehsils-sitemap.xml`,
            `${HOST}/villages-sitemap.xml`,
        ],
    }
}