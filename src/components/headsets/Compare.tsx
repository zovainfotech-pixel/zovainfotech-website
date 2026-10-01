import { AnimatePresence, motion } from 'motion/react'
import { Check, GitCompareArrows, Plus, X } from 'lucide-react'
import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { products } from '../../data/products'
import { paths } from '../../data/routes'
import type { Product } from '../../data/types'
import { cn } from '../../lib/cn'
import { useToast } from '../ui/toast-context'
import { COMPARE_MAX, CompareContext, compareHref, useCompare } from './compare-context'

/** Holds up to three headsets selected for comparison (in memory for this visit). */
export function CompareProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([])
  const toast = useToast()
  const toggle = useCallback(
    (id: string) => {
      if (ids.includes(id)) return setIds(ids.filter((x) => x !== id))
      if (ids.length >= COMPARE_MAX) return toast(`You can compare up to ${COMPARE_MAX} products. Remove one first.`, 'info')
      setIds([...ids, id])
    },
    [ids, toast],
  )
  const value = useMemo(
    () => ({
      ids,
      toggle,
      remove: (id: string) => setIds((cur) => cur.filter((x) => x !== id)),
      clear: () => setIds([]),
      has: (id: string) => ids.includes(id),
      full: ids.length >= COMPARE_MAX,
    }),
    [ids, toggle],
  )
  return (
    <CompareContext.Provider value={value}>
      {children}
      <CompareBar />
    </CompareContext.Provider>
  )
}

/** "Compare" checkbox-style toggle shown on headset product cards. */
export function CompareToggle({ product: p, className }: { product: Product; className?: string }) {
  const c = useCompare()
  if (!c || !p.audio) return null
  const on = c.has(p.id)
  const disabled = !on && c.full
  return (
    <button
      type="button"
      onClick={() => c.toggle(p.id)}
      aria-pressed={on}
      aria-label={on ? `Remove ${p.name} from comparison` : `Add ${p.name} to comparison`}
      title={disabled ? `Up to ${COMPARE_MAX} products` : undefined}
      className={cn(
        'flex h-9 items-center justify-center gap-1.5 rounded-lg border text-[12.5px] font-bold transition-colors',
        on ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-line text-muted hover:border-brand-400 hover:text-brand-700',
        disabled && 'opacity-60',
        className,
      )}
    >
      {on ? <Check size={14} aria-hidden /> : <Plus size={14} aria-hidden />}
      {on ? 'Added to compare' : 'Compare'}
    </button>
  )
}

function CompareBar() {
  const c = useCompare()
  const { pathname } = useLocation()
  const items = (c?.ids ?? []).map((id) => products.find((p) => p.id === id)).filter((p): p is Product => !!p)
  const show = !!c && items.length > 0 && pathname !== paths.compare
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 34 }}
          className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-2xl border border-line bg-white/95 p-3 shadow-[0_24px_60px_-20px_rgb(11_18_32/0.35)] backdrop-blur sm:bottom-5"
          role="region"
          aria-label="Products selected for comparison"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 pr-1 text-[13px] font-bold text-ink">
              <GitCompareArrows size={16} className="text-brand-600" aria-hidden />
              Compare ({items.length}/{COMPARE_MAX})
            </span>
            <ul className="flex min-w-0 flex-1 flex-wrap gap-1.5">
              {items.map((p) => (
                <li key={p.id} className="flex max-w-[220px] items-center gap-1 rounded-full border border-line bg-[var(--background-primary)] py-1 pr-1 pl-3 text-[12px] font-semibold">
                  <span className="truncate">{p.name.replace(/ \(.*\)$/, '')}</span>
                  <button type="button" onClick={() => c!.remove(p.id)} className="rounded-full p-1 text-muted hover:bg-white hover:text-red-600" aria-label={`Remove ${p.name}`}>
                    <X size={12} />
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <button type="button" onClick={c!.clear} className="h-10 rounded-xl px-3 text-[13px] font-semibold text-muted hover:text-ink">
                Clear
              </button>
              <Link
                to={compareHref(c!.ids)}
                aria-disabled={items.length < 2}
                onClick={(e) => items.length < 2 && e.preventDefault()}
                className={cn(
                  'flex h-10 items-center rounded-xl bg-brand-600 px-4 text-[13px] font-bold text-white transition-colors hover:bg-brand-700',
                  items.length < 2 && 'cursor-not-allowed opacity-50',
                )}
              >
                {items.length < 2 ? 'Select 2+' : 'Compare now'}
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
