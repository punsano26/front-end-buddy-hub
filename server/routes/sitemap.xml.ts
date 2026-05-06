import type { H3Event } from 'h3'

type SitemapRoute = {
  path: string
  changefreq: 'daily' | 'weekly' | 'monthly'
  priority: string
}

const crawlableRoutes: SitemapRoute[] = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/public/home', changefreq: 'daily', priority: '0.9' },
  { path: '/policy', changefreq: 'monthly', priority: '0.6' },
  { path: '/policy/protect', changefreq: 'monthly', priority: '0.6' }
]

export default defineEventHandler((event: H3Event): string => {
  const runtimeConfig = useRuntimeConfig()
  const siteUrl = String(runtimeConfig.public.siteUrl || 'http://localhost:5000').replace(/\/$/, '')
  const lastModified = new Date().toISOString()

  const urls = crawlableRoutes
    .map((route: SitemapRoute): string => {
      const loc = route.path === '/' ? siteUrl : `${siteUrl}${route.path}`

      return [
        '<url>',
        `<loc>${loc}</loc>`,
        `<lastmod>${lastModified}</lastmod>`,
        `<changefreq>${route.changefreq}</changefreq>`,
        `<priority>${route.priority}</priority>`,
        '</url>'
      ].join('')
    })
    .join('')

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>'
  ].join('')

  setHeader(event, 'Content-Type', 'application/xml; charset=UTF-8')

  return xml
})
