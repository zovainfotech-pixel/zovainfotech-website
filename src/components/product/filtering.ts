import { categoryBySlug } from '../../data/categories'
import { conditionLabel, formatStorage, gradeInfo, gradeOrder } from '../../data/products'
import type { Product, UseCase } from '../../data/types'

export type SortKey = 'featured' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc'

export interface FilterState {
  q: string
  category: string[]
  subcategory: string[]
  brand: string[]
  condition: string[]
  grade: string[]
  processor: string[]
  ram: string[]
  storage: string[]
  display: string[]
  use: string[]
  connectivity: string[]
  workplace: string[]
  priceMin: string
  priceMax: string
  sort: SortKey
}

export const multiKeys = ['category', 'subcategory', 'brand', 'condition', 'grade', 'processor', 'ram', 'storage', 'display', 'use', 'connectivity', 'workplace'] as const
export type MultiKey = (typeof multiKeys)[number]

export const emptyFilters: FilterState = {
  q: '',
  category: [],
  subcategory: [],
  brand: [],
  condition: [],
  grade: [],
  processor: [],
  ram: [],
  storage: [],
  display: [],
  use: [],
  connectivity: [],
  workplace: [],
  priceMin: '',
  priceMax: '',
  sort: 'featured',
}

export const useCaseLabel: Record<UseCase, string> = {
  business: 'Business',
  student: 'Student',
  performance: 'Performance',
  premium: 'Premium',
  budget: 'Budget',
  creative: 'Creative work',
}

export function displayBucket(inches?: number): string | undefined {
  if (!inches) return undefined
  if (inches < 14) return 'Up to 13.9"'
  if (inches < 15) return '14 – 14.9"'
  if (inches < 17) return '15 – 16.9"'
  return '17" and above'
}

/** Returns the facet value(s) a product has for a given key. */
function facetValues(p: Product, key: MultiKey): string[] {
  switch (key) {
    case 'category':
      return [p.category]
    case 'subcategory':
      return p.subcategory ? [p.subcategory] : []
    case 'brand':
      return [p.brand]
    case 'condition':
      return [p.condition]
    case 'grade':
      return p.grade ? [p.grade] : []
    case 'processor':
      return p.specs.processorFamily ? [p.specs.processorFamily] : []
    case 'ram':
      return p.specs.ramGb ? [`${p.specs.ramGb} GB`] : []
    case 'storage': {
      const s = formatStorage(p.specs.storageGb)
      return s ? [s] : []
    }
    case 'display': {
      const b = displayBucket(p.specs.displayInches)
      return b ? [b] : []
    }
    case 'use':
      return p.useCases ?? []
    case 'connectivity':
      return p.audio?.connectivity ?? []
    case 'workplace':
      return p.audio?.workplace ?? []
  }
}

export function facetLabel(key: MultiKey, value: string): string {
  switch (key) {
    case 'category':
      return categoryBySlug[value as keyof typeof categoryBySlug]?.shortName ?? value
    case 'condition':
      return conditionLabel[value as keyof typeof conditionLabel] ?? value
    case 'grade':
      return gradeInfo[value as keyof typeof gradeInfo]?.label ?? value
    case 'use':
      return useCaseLabel[value as UseCase] ?? value
    default:
      return value
  }
}

const normalise = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()

export function searchProducts(list: Product[], q: string): Product[] {
  const terms = normalise(q).split(' ').filter(Boolean)
  if (!terms.length) return list
  return list.filter((p) => {
    const hay = normalise(
      [p.name, p.brand, p.model, p.id, p.subcategory, categoryBySlug[p.category]?.name, p.specs.processor, conditionLabel[p.condition], ...(p.audio ? [p.audio.link, p.audio.wearing, ...p.audio.connectivity, ...p.audio.workplace] : [])]
        .filter(Boolean)
        .join(' '),
    )
    return terms.every((t) => hay.includes(t))
  })
}

export function applyFilters(list: Product[], f: FilterState, except?: MultiKey): Product[] {
  let out = searchProducts(list, f.q)
  for (const key of multiKeys) {
    if (key === except || f[key].length === 0) continue
    out = out.filter((p) => facetValues(p, key).some((v) => f[key].includes(v)))
  }
  const min = Number(f.priceMin)
  const max = Number(f.priceMax)
  if (f.priceMin && !Number.isNaN(min)) out = out.filter((p) => p.price && p.price.amount >= min)
  if (f.priceMax && !Number.isNaN(max)) out = out.filter((p) => p.price && p.price.amount <= max)
  return out
}

export function sortProducts(list: Product[], sort: SortKey): Product[] {
  const arr = [...list]
  switch (sort) {
    case 'name-asc':
      return arr.sort((a, b) => a.name.localeCompare(b.name))
    case 'name-desc':
      return arr.sort((a, b) => b.name.localeCompare(a.name))
    case 'price-asc':
      return arr.sort((a, b) => (a.price?.amount ?? Infinity) - (b.price?.amount ?? Infinity))
    case 'price-desc':
      return arr.sort((a, b) => (b.price?.amount ?? -Infinity) - (a.price?.amount ?? -Infinity))
    default:
      return arr
  }
}

/** Facet options with counts, computed against all other active filters (standard faceted-search behaviour). */
export function facetOptions(list: Product[], f: FilterState, key: MultiKey): { value: string; count: number }[] {
  const base = applyFilters(list, f, key)
  const all = new Set(list.flatMap((p) => facetValues(p, key)))
  const counts = new Map<string, number>()
  for (const p of base) for (const v of facetValues(p, key)) counts.set(v, (counts.get(v) ?? 0) + 1)
  const values = [...all]
  if (key === 'grade') values.sort((a, b) => gradeOrder.indexOf(a as never) - gradeOrder.indexOf(b as never))
  else if (key === 'ram' || key === 'storage') values.sort((a, b) => parseSize(a) - parseSize(b))
  else if (key === 'condition') values.sort((a, b) => ['new', 'refurbished', 'used'].indexOf(a) - ['new', 'refurbished', 'used'].indexOf(b))
  else if (key !== 'category' && key !== 'display' && key !== 'subcategory') values.sort()
  return values.map((value) => ({ value, count: counts.get(value) ?? 0 }))
}

function parseSize(s: string) {
  const n = parseFloat(s)
  return s.includes('TB') ? n * 1024 : n
}

export function hasPrices(list: Product[]) {
  return list.some((p) => !!p.price)
}

// ── URL <-> state ──────────────────────────────────────────────────────────
export function filtersFromParams(sp: URLSearchParams): FilterState {
  const f: FilterState = { ...emptyFilters }
  f.q = sp.get('q') ?? ''
  for (const key of multiKeys) f[key] = sp.getAll(key)
  f.priceMin = sp.get('min') ?? ''
  f.priceMax = sp.get('max') ?? ''
  const sort = sp.get('sort') as SortKey | null
  f.sort = sort && ['featured', 'name-asc', 'name-desc', 'price-asc', 'price-desc'].includes(sort) ? sort : 'featured'
  return f
}

export function paramsFromFilters(f: FilterState): URLSearchParams {
  const sp = new URLSearchParams()
  if (f.q) sp.set('q', f.q)
  for (const key of multiKeys) for (const v of f[key]) sp.append(key, v)
  if (f.priceMin) sp.set('min', f.priceMin)
  if (f.priceMax) sp.set('max', f.priceMax)
  if (f.sort !== 'featured') sp.set('sort', f.sort)
  return sp
}

export function activeFilterCount(f: FilterState) {
  return multiKeys.reduce((n, k) => n + f[k].length, 0) + (f.q ? 1 : 0) + (f.priceMin ? 1 : 0) + (f.priceMax ? 1 : 0)
}
