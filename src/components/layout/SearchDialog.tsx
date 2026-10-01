import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Search, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { categoryBySlug } from '../../data/categories'
import { products } from '../../data/products'
import { paths } from '../../data/routes'
import { services } from '../../data/services'
import { searchProducts } from '../product/filtering'
import { solutionLinks } from './nav'
import { ConditionBadge } from '../ui/Badges'

interface Hit {
  label: string
  sub: string
  to: string
  text: string
}

/** Solutions and services are searchable alongside products. */
const solutionIndex: Hit[] = [
  ...solutionLinks.map((l) => ({ label: l.label, sub: 'Solution', to: l.to, text: `${l.label} ${l.text}` })),
  ...services.map((sv) => ({
    label: sv.name,
    sub: 'Service',
    to: paths.service(sv.slug),
    text: [sv.name, sv.navLabel, sv.short, ...sv.offerings.map((o) => o.title)].join(' '),
  })),
  { label: 'Microsoft 365 licensing & security', sub: 'Solution', to: paths.microsoft, text: 'microsoft 365 m365 office teams intune purview defender cloud licensing' },
  { label: 'IT procurement for businesses', sub: 'Solution', to: paths.corporate, text: 'procurement bulk corporate enterprise rfq quotation' },
]

function searchSolutions(q: string): Hit[] {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean)
  if (!terms.length) return []
  const seen = new Set<string>()
  return solutionIndex
    .filter((h) => terms.every((t) => h.text.toLowerCase().includes(t)))
    .filter((h) => (seen.has(h.to) ? false : (seen.add(h.to), true)))
    .slice(0, 3)
}

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const results = useMemo(() => (q.trim() ? searchProducts(products, q).slice(0, 6) : []), [q])
  const hits = useMemo(() => searchSolutions(q), [q])

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    setTimeout(() => inputRef.current?.focus(), 30)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      prev?.focus?.()
    }
  }, [open, onClose])

  const go = (to: string) => {
    onClose()
    setQ('')
    navigate(to)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-start justify-center bg-navy-950/60 px-4 pt-[10vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search products, solutions or services"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-float)]"
          >
            <form
              role="search"
              onSubmit={(e) => {
                e.preventDefault()
                go(`${paths.products}?q=${encodeURIComponent(q.trim())}`)
              }}
              className="flex items-center gap-3 border-b border-line px-5"
            >
              <Search size={20} className="text-muted" aria-hidden />
              <label htmlFor="site-search" className="sr-only">
                Search products, solutions or services
              </label>
              <input
                ref={inputRef}
                id="site-search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products, solutions or services..."
                className="h-16 flex-1 bg-transparent text-base outline-none placeholder:text-slate-400"
                autoComplete="off"
              />
              <button type="button" onClick={onClose} className="rounded-lg p-2 text-muted hover:bg-surface hover:text-ink" aria-label="Close search">
                <X size={20} />
              </button>
            </form>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {!q.trim() && (
                <div className="p-4">
                  <p className="mb-3 text-xs font-bold tracking-wider text-muted uppercase">Popular searches</p>
                  <div className="flex flex-wrap gap-2">
                    {['Dell Latitude', 'MacBook', 'Poly Headset', 'USB-C Dock', 'Printer', 'DLP', 'Microsoft 365', 'Networking'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setQ(s)}
                        className="h-9 rounded-full border border-line px-3.5 text-sm font-semibold hover:border-brand-600 hover:text-brand-700"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {hits.length > 0 && (
                <div className="border-b border-line pb-1">
                  <p className="px-4 pt-2 pb-1 text-[11px] font-bold tracking-wider text-muted uppercase">Solutions & services</p>
                  {hits.map((h) => (
                    <button
                      key={h.to + h.label}
                      type="button"
                      onClick={() => go(h.to)}
                      className="flex w-full items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-left hover:bg-surface focus-visible:bg-surface"
                    >
                      <span className="font-semibold">{h.label}</span>
                      <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11.5px] font-bold text-brand-700">{h.sub}</span>
                    </button>
                  ))}
                </div>
              )}
              {results.length > 0 && hits.length > 0 && <p className="px-4 pt-2 pb-1 text-[11px] font-bold tracking-wider text-muted uppercase">Products</p>}
              {q.trim() && results.length === 0 && hits.length === 0 && (
                <div className="p-6 text-center">
                  <p className="font-bold">No products match “{q}”.</p>
                  <p className="mt-1 text-sm text-muted">We can still source it for you.</p>
                  <Link
                    to={`${paths.quote}?model=${encodeURIComponent(q)}`}
                    onClick={onClose}
                    className="mt-4 inline-flex items-center gap-1.5 font-bold text-brand-600"
                  >
                    Request this product <ArrowRight size={16} />
                  </Link>
                </div>
              )}
              {results.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => go(paths.product(p.slug))}
                  className="flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left hover:bg-surface focus-visible:bg-surface"
                >
                  <span className="flex flex-col">
                    <span className="font-semibold">{p.name}</span>
                    <span className="text-[13px] text-muted">{categoryBySlug[p.category].shortName}</span>
                  </span>
                  <ConditionBadge condition={p.condition} />
                </button>
              ))}
              {results.length > 0 && (
                <button
                  type="button"
                  onClick={() => go(`${paths.products}?q=${encodeURIComponent(q.trim())}`)}
                  className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-bold text-brand-600 hover:bg-brand-50"
                >
                  See all results for “{q}” <ArrowRight size={16} />
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
