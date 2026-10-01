/**
 * Route map shared by the router, navigation, footer and the build-time
 * sitemap generator (vite.config.ts). Keep this file free of React imports.
 */
import { categories } from './categories'
import { products } from './products'
import { services } from './services'

export const paths = {
  home: '/',
  products: '/products',
  category: (slug: string) => `/products/${slug}`,
  product: (slug: string) => `/product/${slug}`,
  services: '/services',
  service: (slug: string) => `/services/${slug}`,
  av: '/audio-video-solutions',
  microsoft: '/microsoft-security',
  corporate: '/corporate-it-procurement',
  about: '/about',
  contact: '/contact',
  quote: '/request-a-quote',
  vendor: '/become-a-vendor',
  privacy: '/privacy-policy',
  terms: '/terms-and-conditions',
  shipping: '/shipping-and-delivery-policy',
  returns: '/returns-and-refunds-policy',
  warranty: '/warranty-policy',
  compare: '/compare-headsets',
} as const

/** Every indexable URL, used for sitemap.xml. Demo product pages are excluded. */
export function allIndexablePaths(): string[] {
  return [
    paths.home,
    paths.products,
    ...categories.map((c) => paths.category(c.slug)),
    ...products.filter((p) => !p.isDemo).map((p) => paths.product(p.slug)),
    paths.services,
    ...services.map((s) => paths.service(s.slug)),
    paths.av,
    paths.microsoft,
    paths.corporate,
    paths.about,
    paths.contact,
    paths.quote,
    paths.vendor,
    paths.privacy,
    paths.terms,
    paths.shipping,
    paths.returns,
    paths.warranty,
  ]
}
