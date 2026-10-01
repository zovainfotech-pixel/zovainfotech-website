/**
 * Product data model.
 * Optional fields must stay undefined unless the information is CONFIRMED for
 * that specific product/unit. The UI hides or shows "Confirmed on enquiry"
 * for anything that is missing — it never fabricates a value.
 */
import type { MediaKey } from './media'

export type CategorySlug =
  | 'new-laptops'
  | 'refurbished-laptops'
  | 'desktops-workstations'
  | 'apple-products'
  | 'monitors-displays'
  | 'printers-scanners'
  | 'it-accessories'
  | 'components-parts'
  | 'networking'
  | 'servers-storage'
  | 'headsets-audio-solutions'

export type Condition = 'new' | 'refurbished' | 'used'

/** Only assign a grade after product-specific inspection. */
export type Grade = 'excellent' | 'very-good' | 'good' | 'fair'

export type UseCase = 'business' | 'student' | 'performance' | 'premium' | 'budget' | 'creative'

export type Availability = 'in-stock' | 'on-order' | 'enquire'

export interface ProductImage {
  src: string
  alt: string
  width?: number
  height?: number
}

export interface Price {
  /** Amount in INR (rupees). Only set when the price is confirmed. */
  amount: number
  currency: 'INR'
  gstInclusive: boolean
}

export interface ProductSpecs {
  processor?: string
  /** Normalised family used for filtering, e.g. "Intel Core i5". */
  processorFamily?: string
  ramGb?: number
  ramDetail?: string
  storageGb?: number
  storageDetail?: string
  displayInches?: number
  displayDetail?: string
  graphics?: string
  os?: string
  /** Any other label/value pairs shown in the specification table. */
  other?: { label: string; value: string }[]
}

export interface RefurbDetails {
  /** e.g. "86% of design capacity (measured 12 Mar 2026)". */
  batteryHealth?: string
  cosmeticNotes?: string
  /** Every known defect or limitation must be listed here. */
  knownDefects?: string[]
  /** Describe only tests actually performed. */
  inspection?: string
  accessoriesIncluded?: string[]
  returnEligibility?: string
}

export interface Product {
  id: string
  slug: string
  name: string
  brand: string
  model: string
  category: CategorySlug
  subcategory?: string
  condition: Condition
  grade?: Grade
  description: string
  highlights?: string[]
  specs: ProductSpecs
  refurb?: RefurbDetails
  useCases?: UseCase[]
  images: ProductImage[]
  /** Representative image from the media registry, used when `images` is empty. */
  imageKey?: MediaKey
  price?: Price
  /** Warranty text, only when confirmed, e.g. "6 months seller warranty (parts & labour)". */
  warranty?: string
  availability?: Availability
  enquiry: {
    quote: boolean
    whatsapp: boolean
  }
  /** Headset / meeting-room audio attributes — only values verified for the exact model. */
  audio?: AudioSpecs
  /** True for sample records that must be replaced before launch. */
  isDemo: boolean
}

export interface Category {
  slug: CategorySlug
  name: string
  shortName: string
  description: string
  subcategories: string[]
  /** Illustration used when a product has no photograph yet. */
  art: DeviceArtKind
  seoTitle: string
  seoDescription: string
}

export type DeviceArtKind =
  | 'laptop'
  | 'desktop'
  | 'monitor'
  | 'printer'
  | 'keyboard'
  | 'component'
  | 'router'
  | 'server'
  | 'tablet'

export type Connectivity = 'USB-A' | 'USB-C' | 'Bluetooth' | '3.5 mm'
export type Workplace = 'Call Centre' | 'Office' | 'Remote Work' | 'Meeting Room'

export interface AudioSpecs {
  connectivity: Connectivity[]
  /** "Wired", "Wireless" or "Wired & Bluetooth". */
  link: string
  /** "Mono", "Stereo", "Mono or stereo versions" … */
  wearing?: string
  microphone?: string
  /** Supported platforms as the manufacturer states them for this model. */
  platforms?: string
  workplace: Workplace[]
}
