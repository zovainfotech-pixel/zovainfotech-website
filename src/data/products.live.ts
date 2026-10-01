/**
 * REAL PRODUCT DATA
 * Add confirmed products here using the same `Product` shape as the demo data,
 * with `isDemo: false`. Only fill in price, warranty, availability, grade and
 * refurbishment details once they are confirmed for that exact item.
 *
 * Product photos: put files in /public/products/<slug>/ and reference them as
 * `{ src: '/products/<slug>/front.webp', alt: 'Front view of …', width: 1200, height: 900 }`.
 */
import type { Product } from './types'

export const liveProducts: Product[] = []
