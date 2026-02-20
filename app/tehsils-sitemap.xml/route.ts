import { getStates, getDistricts, getTehsils } from '@/utils/common';
import { NextResponse } from 'next/server';

const baseUrl = process.env.baseURL || 'http://localhost:3000'

export const revalidate = 86400

export async function GET() {
    const states = await getStates();

    const districtsByState = await Promise.all(
        states.map((s: { state_slug: string }) => getDistricts({ state_slug: s.state_slug }))
    );
    const districts = districtsByState.flat();



    const tehsilsByDistrict = await Promise.all(
        districts.map((d: { state_slug: string, district_slug: string }) =>
            getTehsils({ state_slug: d.state_slug, district_slug: d.district_slug })
        )
    );




    const tehsils = tehsilsByDistrict.flat();



    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${tehsils.map((t: { state_slug: string, district_slug: string, block_slug: string }) => `  <url>
    <loc>${baseUrl}/${t.state_slug}/${t.district_slug}/${t.block_slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`

    return new NextResponse(xml, {
        headers: { 'Content-Type': 'application/xml' },
    })
}