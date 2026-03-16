import { SITE_URL } from '@/lib/seo'

const routes = [
    { path: '/', changeFrequency: 'daily', priority: 1 },
    { path: '/ranking', changeFrequency: 'hourly', priority: 0.9 },
    { path: '/mural', changeFrequency: 'hourly', priority: 0.8 },
]

export default function sitemap() {
    const lastModified = new Date()

    return routes.map((route) => ({
        url: new URL(route.path, SITE_URL).toString(),
        lastModified,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
    }))
}