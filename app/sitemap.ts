import { getStates } from '@/utils/common'
import { MetadataRoute } from 'next'

const baseUrl = process.env.baseURL || 'http://localhost:3000'
export const revalidate = 86400



interface State {
    _id: string
    state: string
    state_slug: string
}
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const states = await getStates();
    const stateUrls: MetadataRoute.Sitemap = states.map((state: State) => ({
        url: `${baseUrl}/${state?.state_slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1.0,
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        ...stateUrls,
    ]
}