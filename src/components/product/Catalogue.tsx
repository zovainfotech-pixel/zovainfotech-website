import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, LayoutGrid, List, PackageSearch, Search, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { paths } from '../../data/routes'
import type { Product } from '../../data/types'
import { cn } from '../../lib/cn'
import { useToast } from '../ui/toast-context'
import {
  activeFilterCount,
  applyFilters,
  emptyFilters,
  facetLabel,
  facetOptions,
  filtersFromParams,
  hasPrices,
  paramsFromFilters,
  sortProducts,
  type FilterState,
  type MultiKey,
  type SortKey,
} from './filtering'
import { ProductCard } from './ProductCard'

const facetTitles: Record<MultiKey, string> = {
  category: 'Category',
  subcategory: 'Type',
  connectivity: 'Connectivity',
  workplace: 'Workplace',
  brand: 'Brand',
  condition: 'Condition',
  grade: 'Condition grade',
  processor: 'Processor',
  ram: 'RAM',
  storage: 'Storage',
  display: 'Display size',
  use: 'Intended use',
}

const pillFacets: MultiKey[] = ['ram', 'storage', 'display']

interface Props {
  products: Product[]
  /** Hide the category facet (used on category pages). */
  hideCategory?: boolean
  facetOrder?: MultiKey[]
}

export function Catalogue({ products, hideCategory, facetOrder }: Props) {
  const [params, setParams] = useSearchParams()
  const f = useMemo(() => filtersFromParams(params), [params])
  const [layout, setLayout] = useState<'grid' | 'list'>(() => {
    try {
      return (localStorage.getItem('zova-layout') as 'grid' | 'list') || 'grid'
    } catch {
      return 'grid'
    }
  })
  const [sheetOpen, setSheetOpen] = useState(false)
  const toast = useToast()
  const priced = hasPrices(products)

  const update = (next: Partial<FilterState>) => setParams(paramsFromFilters({ ...f, ...next }), { replace: true, preventScrollReset: true })

  const toggle = (key: MultiKey, value: string) => {
    const cur = f[key]
    update({ [key]: cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value] })
  }

  const clearAll = () => {
    setParams(paramsFromFilters({ ...emptyFilters, sort: f.sort }), { replace: true, preventScrollReset: true })
    toast('All filters cleared', 'info')
  }

  const setLayoutPersist = (l: 'grid' | 'list') => {
    setLayout(l)
    try {
      localStorage.setItem('zova-layout', l)
    } catch {
      /* storage unavailable — ignore */
    }
  }

  const results = useMemo(() => sortProducts(applyFilters(products, f), f.sort), [products, f])
  const count = activeFilterCount(f)

  const order: MultiKey[] =
    facetOrder ?? ['category', 'subcategory', 'condition', 'grade', 'brand', 'processor', 'ram', 'storage', 'display', 'use', 'connectivity', 'workplace']
  const facets = order
    .filter((k) => !(hideCategory && k === 'category'))
    // Sub-types are only useful inside a single category.
    .filter((k) => k !== 'subcategory' || hideCategory || f.subcategory.length > 0)
    .map((k) => ({ key: k, options: facetOptions(products, f, k) }))
    .filter((fc) => fc.options.length >= 2 || f[fc.key].length > 0)

  const activeChips = [
    ...(f.q ? [{ label: `“${f.q}”`, remove: () => update({ q: '' }) }] : []),
    ...facets.flatMap((fc) => f[fc.key].map((v) => ({ label: facetLabel(fc.key, v), remove: () => toggle(fc.key, v) }))),
    ...(f.priceMin ? [{ label: `Min ₹${f.priceMin}`, remove: () => update({ priceMin: '' }) }] : []),
    ...(f.priceMax ? [{ label: `Max ₹${f.priceMax}`, remove: () => update({ priceMax: '' }) }] : []),
  ]

  const panel = (
    <FilterPanel
      facets={facets}
      f={f}
      toggle={toggle}
      priced={priced}
      onPrice={(min, max) => update({ priceMin: min, priceMax: max })}
      clearAll={clearAll}
      count={count}
    />
  )

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10">
      <aside className="hidden lg:block" aria-label="Product filters">
        <div className="sticky top-28 -mr-3 max-h-[calc(100vh-8rem)] overflow-y-auto pr-3 pb-6 [scrollbar-width:thin]">{panel}</div>
      </aside>

      <div className="flex min-w-0 flex-col gap-5">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBox value={f.q} onChange={(q) => update({ q })} />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-line px-4 text-sm font-bold lg:hidden"
            >
              <SlidersHorizontal size={17} aria-hidden /> Filters
              {count > 0 && <span className="rounded-full bg-brand-600 px-2 py-0.5 text-xs text-white">{count}</span>}
            </button>
            <label className="flex h-12 items-center gap-2 rounded-xl border border-line pl-4 text-sm text-muted">
              <span className="hidden sm:inline">Sort</span>
              <span className="sr-only sm:hidden">Sort products</span>
              <select
                value={f.sort}
                onChange={(e) => update({ sort: e.target.value as SortKey })}
                className="h-full cursor-pointer rounded-xl bg-transparent pr-3 font-bold text-ink outline-none"
              >
                <option value="featured">Featured</option>
                <option value="name-asc">Name: A–Z</option>
                <option value="name-desc">Name: Z–A</option>
                {priced && <option value="price-asc">Price: low to high</option>}
                {priced && <option value="price-desc">Price: high to low</option>}
              </select>
            </label>
            <div className="hidden h-12 items-center rounded-xl border border-line p-1 sm:flex" role="group" aria-label="Layout">
              {(['grid', 'list'] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLayoutPersist(l)}
                  aria-pressed={layout === l}
                  aria-label={l === 'grid' ? 'Grid view' : 'List view'}
                  className={cn(
                    'flex size-10 items-center justify-center rounded-lg transition-colors',
                    layout === l ? 'bg-navy-950 text-white' : 'text-muted hover:text-ink',
                  )}
                >
                  {l === 'grid' ? <LayoutGrid size={17} /> : <List size={17} />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Result summary & chips */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted" aria-live="polite">
          <span>
            <strong className="text-ink">{results.length}</strong> {results.length === 1 ? 'product' : 'products'}
            {results.some((p) => p.isDemo) && ' (demonstration listings)'}
          </span>
          <AnimatePresence initial={false}>
            {activeChips.map((c) => (
              <motion.button
                key={c.label}
                type="button"
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={c.remove}
                className="inline-flex h-8 items-center gap-1.5 rounded-full bg-brand-50 pr-2 pl-3 text-[13px] font-semibold text-blue-900 hover:bg-brand-100"
                aria-label={`Remove filter ${c.label}`}
              >
                {c.label} <X size={14} aria-hidden />
              </motion.button>
            ))}
          </AnimatePresence>
          {activeChips.length > 1 && (
            <button type="button" onClick={clearAll} className="h-8 px-2 text-[13px] font-bold text-brand-600 hover:text-brand-700">
              Clear all
            </button>
          )}
        </div>

        {results.length === 0 ? (
          <EmptyState query={f.q} onClear={clearAll} />
        ) : (
          <motion.ul
            layout
            className={cn('grid grid-cols-1 gap-5', layout === 'grid' && 'sm:grid-cols-2 xl:grid-cols-3')}
            aria-label="Products"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {results.map((p) => (
                <motion.li
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                  className="flex min-w-0"
                >
                  <div className="flex w-full min-w-0 [&>article]:w-full">
                    <ProductCard product={p} layout={layout} />
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </div>

      <FilterSheet open={sheetOpen} onClose={() => setSheetOpen(false)} resultCount={results.length}>
        {panel}
      </FilterSheet>
    </div>
  )
}

function SearchBox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [local, setLocal] = useState(value)
  const [synced, setSynced] = useState(value)
  const timer = useRef<number | undefined>(undefined)
  if (value !== synced) {
    // External change (e.g. "Clear all") — sync the local input.
    setSynced(value)
    setLocal(value)
  }
  return (
    <div className="relative flex-1">
      <Search size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted" aria-hidden />
      <label htmlFor="catalogue-search" className="sr-only">
        Search by product name or model
      </label>
      <input
        id="catalogue-search"
        type="search"
        value={local}
        onChange={(e) => {
          setLocal(e.target.value)
          window.clearTimeout(timer.current)
          const v = e.target.value
          timer.current = window.setTimeout(() => {
            setSynced(v)
            onChange(v)
          }, 180)
        }}
        placeholder="Search by name or model, e.g. ThinkPad T480"
        className="h-12 w-full rounded-xl border border-line bg-white pr-4 pl-11 text-[15px] outline-none placeholder:text-slate-400 focus:border-brand-600 focus:ring-4 focus:ring-brand-600/15"
      />
    </div>
  )
}

function FilterPanel({
  facets,
  f,
  toggle,
  priced,
  onPrice,
  clearAll,
  count,
}: {
  facets: { key: MultiKey; options: { value: string; count: number }[] }[]
  f: FilterState
  toggle: (k: MultiKey, v: string) => void
  priced: boolean
  onPrice: (min: string, max: string) => void
  clearAll: () => void
  count: number
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[17px] font-bold">Filters</h2>
        {count > 0 && (
          <button type="button" onClick={clearAll} className="py-2 text-[13px] font-bold text-brand-600 hover:text-brand-700">
            Clear all
          </button>
        )}
      </div>
      {facets.map(({ key, options }) => (
        <fieldset key={key} className="flex flex-col gap-1.5 border-t border-line pt-5 first-of-type:border-0 first-of-type:pt-0">
          <legend className="mb-2 font-mono text-[11.5px] font-semibold tracking-[0.1em] text-muted uppercase">{facetTitles[key]}</legend>
          {pillFacets.includes(key) ? (
            <div className="flex flex-wrap gap-2">
              {options.map((o) => {
                const on = f[key].includes(o.value)
                return (
                  <button
                    key={o.value}
                    type="button"
                    aria-pressed={on}
                    disabled={!on && o.count === 0}
                    onClick={() => toggle(key, o.value)}
                    className={cn(
                      'h-9 rounded-full border px-3.5 text-[13px] font-semibold transition-colors disabled:opacity-40',
                      on ? 'border-navy-950 bg-navy-950 text-white' : 'border-line bg-white hover:border-slate-400',
                    )}
                  >
                    {facetLabel(key, o.value)}
                  </button>
                )
              })}
            </div>
          ) : (
            options.map((o) => {
              const on = f[key].includes(o.value)
              return (
                <label
                  key={o.value}
                  className={cn('flex min-h-9 cursor-pointer items-center gap-3 text-[14px]', !on && o.count === 0 && 'opacity-45')}
                >
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => toggle(key, o.value)}
                    className="size-[18px] cursor-pointer accent-brand-600"
                  />
                  <span className="flex-1">{facetLabel(key, o.value)}</span>
                  <span className="font-mono text-xs text-muted">{o.count}</span>
                </label>
              )
            })
          )}
        </fieldset>
      ))}
      {priced && <PriceFilter min={f.priceMin} max={f.priceMax} onApply={onPrice} />}
      <div className="rounded-2xl border border-line bg-surface p-4 text-[13px] leading-relaxed text-muted">
        <p className="mb-1 font-bold text-ink">Can’t see what you need?</p>
        We source across multiple vendors.{' '}
        <Link to={paths.quote} className="font-bold text-brand-600">
          Request a product →
        </Link>
      </div>
    </div>
  )
}

function PriceFilter({ min, max, onApply }: { min: string; max: string; onApply: (min: string, max: string) => void }) {
  const [a, setA] = useState(min)
  const [b, setB] = useState(max)
  return (
    <fieldset className="flex flex-col gap-2 border-t border-line pt-5">
      <legend className="mb-2 font-mono text-[11.5px] font-semibold tracking-[0.1em] text-muted uppercase">Price (₹)</legend>
      <div className="flex gap-2">
        <input
          inputMode="numeric"
          aria-label="Minimum price"
          placeholder="Min"
          value={a}
          onChange={(e) => setA(e.target.value.replace(/\D/g, ''))}
          className="h-10 w-full rounded-lg border border-line px-3 text-sm"
        />
        <input
          inputMode="numeric"
          aria-label="Maximum price"
          placeholder="Max"
          value={b}
          onChange={(e) => setB(e.target.value.replace(/\D/g, ''))}
          className="h-10 w-full rounded-lg border border-line px-3 text-sm"
        />
      </div>
      <button type="button" onClick={() => onApply(a, b)} className="h-10 rounded-lg bg-navy-950 text-sm font-bold text-white">
        Apply
      </button>
      <p className="text-xs text-muted">Only products with confirmed prices are included when a price filter is set.</p>
    </fieldset>
  )
}

function EmptyState({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-slate-300 px-6 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <PackageSearch size={26} aria-hidden />
      </span>
      <h2 className="text-xl font-bold">No products match {query ? `“${query}”` : 'these filters'}</h2>
      <p className="max-w-md text-[15px] text-muted">
        Try removing a filter or searching a different model. We can also source specific products for you on request.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        <button type="button" onClick={onClear} className="h-11 rounded-xl border border-line px-5 text-sm font-bold hover:border-slate-400">
          Clear filters
        </button>
        <Link
          to={`${paths.quote}${query ? `?model=${encodeURIComponent(query)}` : ''}`}
          className="flex h-11 items-center gap-1.5 rounded-xl bg-brand-600 px-5 text-sm font-bold text-white hover:bg-brand-700"
        >
          Request this product <ArrowRight size={16} aria-hidden />
        </Link>
      </div>
    </div>
  )
}

function FilterSheet({ open, onClose, children, resultCount }: { open: boolean; onClose: () => void; children: ReactNode; resultCount: number }) {
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[60] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-navy-950/60" onClick={onClose} aria-hidden />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 34, stiffness: 340 }}
            className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-3xl bg-white"
          >
            <div className="flex items-center justify-end px-4 pt-3">
              <button type="button" onClick={onClose} className="flex size-11 items-center justify-center rounded-xl" aria-label="Close filters">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-4">{children}</div>
            <div className="border-t border-line p-4">
              <button type="button" onClick={onClose} className="h-12 w-full rounded-xl bg-brand-600 font-bold text-white">
                Show {resultCount} {resultCount === 1 ? 'product' : 'products'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
