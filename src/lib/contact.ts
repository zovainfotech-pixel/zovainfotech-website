import { site } from '../config/site'
import type { Product } from '../data/types'

export const hasWhatsApp = !!site.contact.whatsappNumber
export const hasPhone = !!(site.contact.phoneE164 && site.contact.phoneDisplay)
export const hasEmail = !!site.contact.email

export function whatsappLink(message: string): string | null {
  const n = site.contact.whatsappNumber?.replace(/\D/g, '')
  if (!n) return null
  return `https://wa.me/${n}?text=${encodeURIComponent(message)}`
}

export function productWhatsappMessage(p: Product) {
  return `Hello ${site.shortName}, I'd like to enquire about: ${p.name} (Product ID: ${p.id}). Please share price, availability and warranty details.`
}

export function telLink() {
  return site.contact.phoneE164 ? `tel:${site.contact.phoneE164}` : null
}

export function mailLink(subject?: string) {
  if (!site.contact.email) return null
  return `mailto:${site.contact.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`
}

/** Google Maps search for the office address (opens directions from the visitor's location). */
export function mapsLink() {
  const q = site.contact.addressFull?.replace(/\.$/, '')
  return q ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}` : null
}

export function quoteLinkFor(p: Pick<Product, 'slug' | 'id' | 'category'>) {
  // Headsets use the dedicated headset requirement form on their category page.
  if (p.category === 'headsets-audio-solutions') return `/products/headsets-audio-solutions?product=${encodeURIComponent(p.slug)}#headset-quote`
  return `/request-a-quote?product=${encodeURIComponent(p.slug)}`
}
