import { ArrowRight, ArrowUpRight, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { categoryBySlug } from '../../data/categories'
import { productMediaKey } from '../../data/media'
import { formatPrice, formatStorage } from '../../data/products'
import { paths } from '../../data/routes'
import type { Product } from '../../data/types'
import { cn } from '../../lib/cn'
import { productWhatsappMessage, quoteLinkFor, whatsappLink } from '../../lib/contact'
import { ConditionBadge, DemoTag, GradeBadge } from '../ui/Badges'
import { SmartImage } from '../ui/SmartImage'
import { AudioBadges } from '../headsets/AudioBadges'
import { CompareToggle } from '../headsets/Compare'

function mediaBg(p: Pick<Product, 'condition'>) {
  return p.condition === 'new' ? 'bg-media' : p.condition === 'refurbished' ? 'bg-media-teal' : 'bg-media'
}

export function ProductMedia({ product, className, eager, sizes }: { product: Product; className?: string; eager?: boolean; sizes?: string }) {
  const img = product.images[0]
  return (
    <div className={cn('relative flex items-center justify-center overflow-hidden', mediaBg(product), className)}>
      <div className="dot-bg absolute inset-0 opacity-60" aria-hidden />
      {img ? (
        <SmartImage
          src={img.src}
          alt={img.alt}
          eager={eager}
          sizes={sizes}
          className="relative size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06] motion-reduce:transform-none"
        />
      ) : (
        <SmartImage
          k={productMediaKey(product)}
          alt={`${product.name} — representative image`}
          eager={eager}
          sizes={sizes}
          className="relative w-[88%] object-contain drop-shadow-[0_18px_22px_rgb(17_24_39/0.18)] transition-transform duration-700 ease-out group-hover:-translate-y-1 group-hover:scale-[1.07] motion-reduce:transform-none"
        />
      )}
    </div>
  )
}

function keySpecs(p: Product): [string, string][] {
  const s = p.specs
  const rows: [string, string][] = []
  if (s.processor) rows.push(['Processor', s.processor.replace(/ \(.*\)$/, '')])
  const mem = [s.ramGb && `${s.ramGb} GB`, formatStorage(s.storageGb)].filter(Boolean).join(' · ')
  if (s.ramGb && s.storageGb) rows.push(['RAM / SSD', mem])
  else if (s.ramGb) rows.push(['RAM', `${s.ramGb} GB`])
  else if (s.storageGb) rows.push(['Storage', formatStorage(s.storageGb)!])
  if (s.displayInches) rows.push(['Display', s.displayDetail?.replace(/\s*\(.*\)/, '') ?? `${s.displayInches}"`])
  if (s.os && rows.length < 4 && p.category !== 'refurbished-laptops') rows.push(['OS', s.os])
  for (const o of s.other ?? []) if (rows.length < 3) rows.push([o.label, o.value])
  if (p.condition !== 'new' && p.refurb?.batteryHealth && rows.length < 4) rows.push(['Battery', 'Details listed'])
  return rows.slice(0, 4)
}

export function ProductCard({ product: p, layout = 'grid', eager }: { product: Product; layout?: 'grid' | 'list'; eager?: boolean }) {
  const price = formatPrice(p.price)
  const specs = keySpecs(p)
  const list = layout === 'list'
  const wa = whatsappLink(productWhatsappMessage(p))

  return (
    <article className="glow-border group flex w-full rounded-[var(--radius-card)] transition-transform duration-300 hover:-translate-y-1 motion-reduce:hover:translate-y-0">
      <div
        className={cn(
          'flex w-full overflow-hidden rounded-[var(--radius-card)] border border-line bg-white transition-shadow duration-300 group-hover:border-transparent group-hover:shadow-[var(--shadow-card-hover)]',
          list ? 'flex-col sm:flex-row' : 'flex-col',
        )}
      >
        <Link to={paths.product(p.slug)} className={cn('relative block', list && 'sm:w-72 sm:shrink-0')} tabIndex={-1} aria-hidden>
          <ProductMedia product={p} eager={eager} className={list ? 'aspect-[4/3] sm:h-full' : 'aspect-[4/3]'} />
          <span className="absolute top-3 left-3 flex gap-1.5">
            <ConditionBadge condition={p.condition} />
          </span>
          {p.isDemo && (
            <span className="absolute top-3.5 right-3 rounded-full bg-white/70 px-2 py-0.5 backdrop-blur">
              <DemoTag />
            </span>
          )}
          <span className="absolute right-3 bottom-3 flex size-9 translate-y-2 items-center justify-center rounded-full bg-navy-950 text-white opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight size={17} />
          </span>
        </Link>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-mono text-[10.5px] tracking-[0.1em] text-muted uppercase">
                {p.brand} · {categoryBySlug[p.category].shortName}
              </p>
              <h3 className="mt-1 text-[16.5px] leading-snug font-bold">
                <Link to={paths.product(p.slug)} className="transition-colors hover:text-brand-600">
                  {p.name}
                </Link>
              </h3>
            </div>
            {p.grade && <GradeBadge grade={p.grade} />}
          </div>
          {p.audio ? (
            <>
              <p className="line-clamp-2 text-[13.5px] leading-relaxed text-muted">{p.description}</p>
              <AudioBadges audio={p.audio} />
            </>
          ) : specs.length > 0 ? (
            <dl className="text-[13px]">
              {specs.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 border-b border-dashed border-line py-1.5 last:border-0">
                  <dt className="text-muted">{k}</dt>
                  <dd className="truncate text-right font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="line-clamp-3 text-[13.5px] leading-relaxed text-muted">{p.description}</p>
          )}
          <div className="mt-auto flex items-end justify-between gap-2 pt-1">
            <div>
              <p className="font-display text-[17px] font-bold">{price ?? 'Request price'}</p>
              {price && p.price && <p className="text-[11.5px] text-muted">{p.price.gstInclusive ? 'Incl. GST' : '+ GST'}</p>}
            </div>
            <p className="text-right text-[12px] text-muted">{p.warranty ? 'Warranty listed' : 'Warranty on enquiry'}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link
              to={paths.product(p.slug)}
              className="flex h-11 items-center justify-center rounded-xl border border-line px-2 text-[13.5px] font-bold whitespace-nowrap transition-colors hover:border-brand-400 hover:text-brand-700"
              aria-label={`View details for ${p.name}`}
            >
              View Details
            </Link>
            <Link
              to={quoteLinkFor(p)}
              className="group/q flex h-11 items-center justify-center gap-1 rounded-xl px-2 whitespace-nowrap bg-gradient-to-r from-brand-600 to-violet-accent bg-[length:200%_100%] bg-left text-[13.5px] font-bold text-white transition-[background-position,transform] duration-500 hover:bg-right active:scale-[0.98]"
              aria-label={`Request a quote for ${p.name}`}
            >
              Request Quote
              <ArrowRight size={14} className="hidden shrink-0 transition-transform group-hover/q:translate-x-0.5 min-[1400px]:block" aria-hidden />
            </Link>
            {p.audio && <CompareToggle product={p} className="col-span-2" />}
            {wa && p.enquiry.whatsapp && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="col-span-2 flex h-10 items-center justify-center gap-2 rounded-xl border border-[#1FAF38]/40 text-[13px] font-bold text-[#15803D] transition-colors hover:bg-[#1FAF38]/10"
                aria-label={`WhatsApp enquiry about ${p.name} (opens in a new tab)`}
              >
                <MessageCircle size={15} aria-hidden /> WhatsApp Enquiry
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
