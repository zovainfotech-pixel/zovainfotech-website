import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Info, MessageCircle, Search, Sparkles, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { avCategories, avItems, avSourceNote, signageUseCases, type AvCategoryId, type AvItem } from '../../data/avProducts'
import { IMG_BASE } from '../../data/media'
import { paths } from '../../data/routes'
import { cn } from '../../lib/cn'
import { whatsappLink } from '../../lib/contact'
import { Button } from '../ui/Button'
import { SmartImage } from '../ui/SmartImage'

type Filter = AvCategoryId | 'all'

const accent: Record<AvCategoryId, string> = {
  'vc-endpoints': 'from-brand-600 to-violet-accent',
  cameras: 'from-cyan-accent to-brand-600',
  'conference-audio': 'from-teal-accent to-cyan-accent',
  signage: 'from-orange-accent to-crimson-accent',
  'ai-cameras': 'from-violet-accent to-purple-accent',
  'audio-control': 'from-purple-accent to-brand-600',
  classroom: 'from-lime-accent to-teal-accent',
  healthcare: 'from-crimson-accent to-purple-accent',
}

const catLabel = new Map(avCategories.map((c) => [c.id, c]))
const order = new Map(avCategories.map((c, i) => [c.id, i]))
const sorted = [...avItems].sort((a, b) => order.get(a.category)! - order.get(b.category)!)

/** One item from each category — used for the compact "All" view on the home page. */
const featured = avCategories.map((c) => sorted.find((i) => i.category === c.id)!).filter(Boolean)

function quoteHrefFor(i: AvItem) {
  const q = new URLSearchParams({ type: i.kind === 'solution' ? 'IT Services' : 'IT Hardware', model: i.kind === 'solution' ? `Digital signage – ${i.name}` : i.name })
  if (i.brand) q.set('brand', i.brand)
  return `${paths.quote}?${q.toString()}`
}

function matches(i: AvItem, q: string) {
  const hay = [i.name, i.brand, i.summary, catLabel.get(i.category)?.label, ...(i.models ?? []), ...i.specs].join(' ').toLowerCase()
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((t) => hay.includes(t))
}

/**
 * Filterable AV product showcase: category chips, search, animated grid and a detail dialog.
 * `limit` caps the grid (home page) and shows a "View all" link to the full AV page.
 */
export function AvShowcase({ limit, initialFilter = 'all' }: { limit?: number; initialFilter?: Filter }) {
  const [filter, setFilter] = useState<Filter>(initialFilter)
  const [q, setQ] = useState('')
  const [open, setOpen] = useState<AvItem | null>(null)

  const counts = useMemo(() => {
    const m = new Map<Filter, number>([['all', avItems.length]])
    for (const i of avItems) m.set(i.category, (m.get(i.category) ?? 0) + 1)
    return m
  }, [])

  const results = useMemo(() => {
    const base = filter === 'all' ? (limit && !q.trim() ? featured : sorted) : sorted.filter((i) => i.category === filter)
    return q.trim() ? base.filter((i) => matches(i, q)) : base
  }, [filter, q, limit])

  const shown = limit ? results.slice(0, limit) : results
  const viewAllHref = filter === 'all' ? paths.av : `${paths.av}?cat=${filter}`
  const close = useCallback(() => setOpen(null), [])

  return (
    <div className="flex min-w-0 flex-col gap-7">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex max-w-2xl flex-col gap-2">
          <span className="eyebrow">AV product showcase</span>
          <h3 className="font-display text-[26px] leading-tight font-bold tracking-[-0.02em] sm:text-3xl">
            Conferencing, audio, control and <span className="text-gradient-brand">digital signage</span>
          </h3>
          <p className="text-[15px] leading-relaxed text-muted">
            Browse the equipment we procure, install and support. Open any product for its full specifications, or request a quote for your room.
          </p>
        </div>
        <label className="relative w-full lg:w-80">
          <span className="sr-only">Search AV products</span>
          <Search size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search cameras, speakerphones…"
            className="h-12 w-full rounded-xl border border-line bg-white pr-4 pl-11 text-[15px] shadow-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
          />
        </label>
      </div>

      {/* Category filters — scroll horizontally on small screens */}
      <div className="-mx-4 min-w-0 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0" role="toolbar" aria-label="Filter AV products by category">
        <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
          {(['all', ...avCategories.map((c) => c.id)] as Filter[]).map((id) => {
            const active = filter === id
            return (
              <button
                key={id}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(id)}
                className={cn(
                  'relative inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-[13.5px] font-semibold transition-colors',
                  active ? 'border-transparent text-white' : 'border-line bg-white text-slate-700 hover:border-brand-300 hover:text-brand-700',
                )}
              >
                {active && (
                  <motion.span
                    layoutId="av-chip"
                    className={cn('absolute inset-0 -z-0 rounded-full bg-gradient-to-r shadow-[0_8px_20px_-8px_rgb(12_93_174/0.6)]', id === 'all' ? 'from-brand-600 to-violet-accent' : accent[id])}
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">{id === 'all' ? 'All products' : catLabel.get(id)!.short}</span>
                <span className={cn('relative rounded-full px-1.5 text-[11px] font-bold', active ? 'bg-white/20' : 'bg-surface text-muted')}>{counts.get(id)}</span>
              </button>
            )
          })}
        </div>
      </div>

      {filter !== 'all' && (
        <p className="-mt-3 text-[14px] font-semibold text-slate-600">
          {catLabel.get(filter)!.label} <span className="font-normal text-muted">· {results.length} {results.length === 1 ? 'item' : 'items'}</span>
        </p>
      )}

      <AnimatePresence initial={false}>{filter === 'signage' && !q.trim() && <SignageIntro key="signage-intro" />}</AnimatePresence>

      {shown.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-[var(--radius-card)] border border-dashed border-line py-14 text-center">
          <p className="font-semibold">No AV products match “{q}”.</p>
          <Button variant="secondary" size="sm" onClick={() => {
              setQ('')
              setFilter('all')
            }}>
            Clear search
          </Button>
        </div>
      ) : (
        <motion.ul layout className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((i) => (
              <motion.li
                key={i.slug}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="flex min-w-0"
              >
                <AvCard item={i} onOpen={() => setOpen(i)} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}

      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-line bg-surface px-5 py-4 sm:flex-row">
        <p className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-muted">
          <Info size={16} className="mt-0.5 shrink-0 text-brand-600" aria-hidden />
          <span>
            {avSourceNote} Digital signage items are solution types shown with representative renders; makes and models are proposed per project.
          </span>
        </p>
        {limit && results.length > shown.length && (
          <Button to={viewAllHref} size="sm" className="shrink-0" iconRight={<ArrowRight size={16} />}>
            View all {filter === 'all' ? avItems.length : results.length} AV products
          </Button>
        )}
      </div>

      <AvDetailDialog item={open} onClose={close} />
    </div>
  )
}

function SignageIntro() {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.35 }}
      className="overflow-hidden"
    >
      <div className="on-dark relative isolate grid gap-6 overflow-hidden rounded-[28px] bg-[linear-gradient(115deg,#0a7bc1_0%,#062049_45%,#062f65_100%)] p-6 text-white sm:p-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
        <div className="absolute -top-20 -right-16 -z-10 size-72 rounded-full bg-orange-accent/30 blur-[90px]" aria-hidden />
        <div className="flex flex-col gap-3">
          <span className="inline-flex items-center gap-2 self-start rounded-full bg-white/10 px-3 py-1 font-mono text-[11px] font-semibold tracking-[0.12em] text-orange-100 uppercase">
            <Sparkles size={13} aria-hidden /> Digital signage
          </span>
          <h4 className="font-display text-2xl leading-tight font-bold tracking-[-0.02em] sm:text-[28px]">Driving digital engagement</h4>
          <p className="text-[14.5px] leading-relaxed text-white/75">
            Screens, video walls, players and content scheduling — supplied, installed and maintained as one project for offices, retail, hospitals and campuses.
          </p>
        </div>
        <ul className="flex flex-wrap gap-2">
          {signageUseCases.map((u) => (
            <li key={u} className="rounded-full border border-white/15 bg-white/[0.08] px-3.5 py-1.5 text-[13px] font-semibold text-white/90 backdrop-blur">
              {u}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

function ItemImage({ item, index = 0, sizes, className }: { item: AvItem; index?: number; sizes: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  const im = item.images[index]
  if (!im && item.render) return <SmartImage k={item.render} alt={item.name} sizes={sizes} className={cn('max-h-full w-auto', className)} />
  if (!im || failed)
    return (
      <span className="flex flex-col items-center gap-2 text-center text-[12px] text-muted">
        <Info size={20} aria-hidden /> Image unavailable
      </span>
    )
  return (
    <img
      src={`${IMG_BASE}${im.src}`}
      alt={`${item.brand ? `${item.brand} ` : ''}${item.name}${index ? ` — view ${index + 1}` : ''}`}
      width={im.w}
      height={im.h}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={cn('h-auto max-h-full w-auto max-w-full object-contain mix-blend-multiply', className)}
    />
  )
}

function AvCard({ item, onOpen }: { item: AvItem; onOpen: () => void }) {
  const cat = catLabel.get(item.category)!
  return (
    <article className="glow-border group flex w-full rounded-[var(--radius-card)]">
      <div className="flex w-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white transition-[box-shadow,border-color] duration-300 group-hover:border-transparent group-hover:shadow-[var(--shadow-card-hover)]">
        <button
          type="button"
          onClick={onOpen}
          aria-label={`View details: ${item.name}`}
          className={cn(
            'relative block aspect-[4/3] w-full overflow-hidden',
            item.kind === 'solution'
              ? 'bg-[radial-gradient(90%_80%_at_50%_100%,rgb(2_198_220/0.22),transparent_65%),linear-gradient(180deg,#f1f9fd,#ebf2fa)]'
              : 'bg-[radial-gradient(90%_80%_at_50%_110%,rgb(12_93_174/0.12),transparent_60%),linear-gradient(180deg,#ffffff,#f1f6fb)]',
          )}
        >
          <span className="absolute inset-[10%] flex items-center justify-center transition-transform duration-700 ease-out group-hover:scale-[1.07] motion-reduce:transform-none">
            <ItemImage item={item} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw" />
          </span>
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11.5px] font-bold text-slate-700 shadow-sm backdrop-blur">
            <span className={cn('size-2 rounded-full bg-gradient-to-r', accent[item.category])} />
            {cat.short}
          </span>
          <span
            className={cn(
              'absolute top-3 right-3 rounded-full px-2.5 py-1 font-mono text-[10.5px] font-semibold tracking-[0.08em] uppercase',
              item.kind === 'solution' ? 'bg-cyan-100 text-brand-800' : 'bg-navy-950 text-white',
            )}
          >
            {item.brand ?? 'Solution'}
          </span>
          {item.kind === 'solution' && (
            <span className="absolute bottom-2.5 left-3 text-[10.5px] font-semibold text-slate-500">Representative render</span>
          )}
          <span className={cn('absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r transition-transform duration-500 group-hover:scale-x-100', accent[item.category])} />
        </button>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex flex-col gap-1.5">
            <h4 className="text-[17px] leading-snug font-bold group-hover:text-brand-700">{item.name}</h4>
            <p className="line-clamp-2 text-[14px] leading-relaxed text-muted">{item.summary}</p>
          </div>
          {item.kind === 'product' && (
            <ul className="flex flex-wrap gap-1.5">
              {item.specs.slice(0, 3).map((s) => (
                <li key={s} className="max-w-full truncate rounded-md bg-surface px-2 py-1 text-[12px] font-semibold text-slate-600" title={s}>
                  {s}
                </li>
              ))}
            </ul>
          )}
          {item.models && <p className="text-[12.5px] text-muted">{item.models.length} variants available</p>}
          <div className="mt-auto grid grid-cols-2 gap-2 pt-1">
            <Button variant="secondary" size="sm" className="px-3 text-[13px]" onClick={onOpen}>
              View details
            </Button>
            <Button to={quoteHrefFor(item)} size="sm" className="px-3 text-[13px]">
              Request a quote
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}

function AvDetailDialog({ item, onClose }: { item: AvItem | null; onClose: () => void }) {
  const [sel, setSel] = useState({ slug: '', i: 0 })
  const idx = item && sel.slug === item.slug ? sel.i : 0
  const setIdx = (i: number) => item && setSel({ slug: item.slug, i })
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!item) return
    const prev = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    setTimeout(() => panel.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus(), 40)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
      prev?.focus?.()
    }
  }, [item, onClose])

  const wa = item ? whatsappLink(`Hello, I'd like to enquire about ${item.brand ? `${item.brand} ` : ''}${item.name}.`) : null
  const enquireHref = item ? `${paths.contact}?about=${encodeURIComponent(`${item.brand ? `${item.brand} ` : ''}${item.name}`)}` : paths.contact

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-navy-950/65 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="av-dialog-title"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative grid max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-t-[28px] bg-white shadow-[var(--shadow-float)] sm:rounded-[28px] md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
          >
            <button
              type="button"
              onClick={onClose}
              data-autofocus
              aria-label="Close product details"
              className="absolute top-3 right-3 z-10 flex size-10 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-md hover:text-ink"
            >
              <X size={20} />
            </button>

            {/* Gallery */}
            <div className="flex flex-col gap-3 bg-[linear-gradient(180deg,#ffffff,#ebf2f9)] p-5 sm:p-7">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="absolute inset-[6%] flex items-center justify-center"
                  >
                    <ItemImage item={item} index={idx} sizes="(min-width: 768px) 45vw, 90vw" />
                  </motion.span>
                </AnimatePresence>
              </div>
              {item.images.length > 1 && (
                <div className="flex flex-wrap gap-2" role="group" aria-label="Product images">
                  {item.images.map((im, n) => (
                    <button
                      key={im.src}
                      type="button"
                      onClick={() => setIdx(n)}
                      aria-label={`Show image ${n + 1}`}
                      aria-pressed={n === idx}
                      className={cn(
                        'flex h-16 w-20 items-center justify-center overflow-hidden rounded-xl border-2 bg-white p-1.5 transition',
                        n === idx ? 'border-brand-500 shadow-md' : 'border-line hover:border-brand-300',
                      )}
                    >
                      <img src={`${IMG_BASE}${im.src}`} alt="" loading="lazy" className="max-h-full max-w-full object-contain mix-blend-multiply" />
                    </button>
                  ))}
                </div>
              )}
              {item.kind === 'solution' && <p className="text-[12px] text-muted">Representative render. Actual make, model and size are proposed for your site.</p>}
            </div>

            {/* Details */}
            <div className="flex flex-col gap-5 p-5 sm:p-7">
              <div className="flex flex-col gap-2 pr-10">
                <span className="inline-flex items-center gap-2 text-[12.5px] font-bold text-slate-600">
                  <span className={cn('size-2.5 rounded-full bg-gradient-to-r', accent[item.category])} />
                  {catLabel.get(item.category)!.label}
                </span>
                <h3 id="av-dialog-title" className="font-display text-2xl leading-tight font-bold tracking-[-0.02em]">
                  {item.name}
                </h3>
                {item.brand && (
                  <p className="text-[13.5px]">
                    <span className="text-muted">Brand:</span> <span className="font-semibold">{item.brand}</span>
                  </p>
                )}
                <p className="leading-relaxed text-slate-600">{item.summary}</p>
              </div>

              {item.models && (
                <div>
                  <h4 className="mb-2 text-[13px] font-bold tracking-wide text-slate-500 uppercase">Models / variants</h4>
                  <ul className="flex flex-wrap gap-1.5">
                    {item.models.map((m) => (
                      <li key={m} className="rounded-lg border border-line bg-surface px-2.5 py-1 text-[12.5px] font-semibold">
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 className="mb-2 text-[13px] font-bold tracking-wide text-slate-500 uppercase">{item.kind === 'product' ? 'Specifications' : 'What’s included'}</h4>
                <ul className="flex flex-col divide-y divide-line rounded-xl border border-line">
                  {item.specs.map((s) => (
                    <li key={s} className="px-3.5 py-2 text-[13.5px] leading-relaxed">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {item.idealFor && (
                <p className="rounded-xl bg-brand-50 px-4 py-3 text-[13.5px] text-blue-950">
                  <span className="font-bold">Ideal for:</span> {item.idealFor}
                </p>
              )}

              <div className="mt-auto flex flex-col gap-2.5 sm:flex-row">
                <Button to={quoteHrefFor(item)} iconRight={<ArrowRight size={17} />} onClick={onClose}>
                  Request a quote
                </Button>
                {wa ? (
                  <Button href={wa} variant="secondary" iconRight={<MessageCircle size={17} />}>
                    Enquire now
                  </Button>
                ) : (
                  <Button to={enquireHref} variant="secondary" onClick={onClose}>
                    Enquire now
                  </Button>
                )}
              </div>
              <p className="text-[11.5px] leading-relaxed text-muted">
                {item.kind === 'product' ? 'Specifications as published by the manufacturer. ' : ''}Price, availability and warranty are confirmed in your quotation.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

