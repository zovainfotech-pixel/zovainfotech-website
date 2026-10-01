import { demoProducts } from './products.demo'
import { headsetProducts } from './products.headsets'
import { liveProducts } from './products.live'
import type { CategorySlug, Condition, Grade, Product } from './types'

/**
 * Set to `false` once real products have been added to `products.live.ts`.
 * While true, demo records are appended after any live products.
 */
export const SHOW_DEMO_PRODUCTS = true

export const products: Product[] = SHOW_DEMO_PRODUCTS ? [...liveProducts, ...demoProducts, ...headsetProducts] : liveProducts

export const productBySlug = new Map(products.map((p) => [p.slug, p]))
export const productById = new Map(products.map((p) => [p.id, p]))

export function productsInCategory(slug: CategorySlug) {
  return products.filter((p) => p.category === slug)
}

export const conditionLabel: Record<Condition, string> = {
  new: 'New',
  refurbished: 'Refurbished',
  used: 'Used',
}

export const conditionDescription: Record<Condition, string> = {
  new: 'Factory-new, unused product in original packaging.',
  refurbished:
    'Pre-owned product that has been inspected, cleaned and restored to working order. Condition, battery and any defects are disclosed per unit.',
  used: 'Pre-owned product sold in its current condition. Condition and any known limitations are disclosed per unit.',
}

export const gradeInfo: Record<Grade, { label: string; description: string }> = {
  excellent: { label: 'Excellent', description: 'Minimal to no visible signs of use. Fully functional.' },
  'very-good': { label: 'Very Good', description: 'Light cosmetic marks visible on close inspection. Fully functional.' },
  good: { label: 'Good', description: 'Visible scuffs, scratches or wear from regular use. Fully functional.' },
  fair: {
    label: 'Fair',
    description: 'Heavy cosmetic wear. Any functional limitation is disclosed on the listing.',
  },
}

export const gradeOrder: Grade[] = ['excellent', 'very-good', 'good', 'fair']

export function formatStorage(gb?: number) {
  if (!gb) return undefined
  return gb >= 1024 ? `${+(gb / 1024).toFixed(1)} TB` : `${gb} GB`
}

export function formatPrice(p: Product['price']) {
  if (!p) return null
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p.amount)
}
