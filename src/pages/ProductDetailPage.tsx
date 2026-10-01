import { ArrowRight, Check, CircleAlert, FlaskConical, MessageCircle, Phone } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { SmartImage } from '../components/ui/SmartImage'
import { productMediaKey, type MediaKey } from '../data/media'
import { Breadcrumbs } from '../components/layout/PageHero'
import { ProductCard } from '../components/product/ProductCard'
import { ConditionBadge, GradeBadge } from '../components/ui/Badges'
import { Button } from '../components/ui/Button'
import { Reveal } from '../components/ui/Reveal'
import { useToast } from '../components/ui/toast-context'
import { site } from '../config/site'
import { categoryBySlug } from '../data/categories'
import { conditionDescription, conditionLabel, formatPrice, formatStorage, gradeInfo, productBySlug, products } from '../data/products'
import { paths } from '../data/routes'
import type { Product } from '../data/types'
import { cn } from '../lib/cn'
import { productWhatsappMessage, quoteLinkFor, telLink, whatsappLink } from '../lib/contact'
import { AudioBadges } from '../components/headsets/AudioBadges'
import { audioRows } from '../components/headsets/audio'
import { CompareToggle } from '../components/headsets/Compare'
import { usePageMeta } from '../lib/seo'
import NotFoundPage from './NotFoundPage'

const TBC = 'To be confirmed for this unit'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const product = slug ? productBySlug.get(slug) : undefined
  if (!product) return <NotFoundPage />
  return <ProductDetail key={product.id} p={product} />
}

function buildJsonLd(p: Product) {
  // Structured data is only emitted for real (non-demo) products, and offers only when price is confirmed.
  if (p.isDemo) return null
  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    sku: p.id,
    brand: { '@type': 'Brand', name: p.brand },
    model: p.model,
    description: p.description,
    itemCondition:
      p.condition === 'new' ? 'https://schema.org/NewCondition' : p.condition === 'refurbished' ? 'https://schema.org/RefurbishedCondition' : 'https://schema.org/UsedCondition',
  }
  if (p.images.length && site.siteUrl) ld.image = p.images.map((i) => new URL(i.src, site.siteUrl!).toString())
  if (p.price && p.availability) {
    ld.offers = {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: p.price.amount,
      availability: p.availability === 'in-stock' ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
      itemCondition: ld.itemCondition,
    }
  }
  return ld
}

function specRows(p: Product): [string, string][] {
  const s = p.specs
  const rows: [string, string | undefined][] = [
    ['Brand', p.brand],
    ['Model', p.model],
    ['Product ID', p.id],
    ...(p.audio ? audioRows(p.audio) : []),
    ['Processor', s.processor],
    ['Memory (RAM)', s.ramDetail ?? (s.ramGb ? `${s.ramGb} GB` : undefined)],
    ['Storage', s.storageDetail ?? formatStorage(s.storageGb)],
    ['Display', s.displayDetail ?? (s.displayInches ? `${s.displayInches}"` : undefined)],
    ['Graphics', s.graphics],
    ['Operating system', s.os],
    ...(s.other ?? []).map((o) => [o.label, o.value] as [string, string]),
    ['Condition', conditionLabel[p.condition]],
    ['Warranty', p.warranty ?? 'Confirmed with your quotation'],
  ]
  return rows.filter((r): r is [string, string] => !!r[1])
}

function ProductDetail({ p }: { p: Product }) {
  const cat = categoryBySlug[p.category]
  const price = formatPrice(p.price)
  const wa = p.enquiry.whatsapp ? whatsappLink(productWhatsappMessage(p)) : null
  const tel = telLink()
  const toast = useToast()
  const [active, setActive] = useState(0)
  const mainKey = productMediaKey(p)
  const gallery: MediaKey[] =
    p.category === 'new-laptops' || p.category === 'refurbished-laptops'
      ? [mainKey, 'laptopPorts']
      : p.category === 'headsets-audio-solutions'
        ? [mainKey, mainKey === 'speakerphone' ? 'headsetWorkstation' : 'headsetAccessories']
        : [mainKey]
  const jsonLd = useMemo(() => buildJsonLd(p), [p])

  usePageMeta({
    title: `${p.name}${p.condition !== 'new' ? ` (${conditionLabel[p.condition]})` : ''}`,
    description: `${p.name} — ${conditionLabel[p.condition]}. ${p.description}`.slice(0, 158),
    ogType: 'product',
    image: p.images[0]?.src,
    index: !p.isDemo,
    jsonLd,
  })

  const related = products
    .filter((x) => x.category === p.category && x.id !== p.id)
    .sort((a, b) => Number(b.subcategory === p.subcategory) - Number(a.subcategory === p.subcategory))
    .slice(0, 4)
  const tiles = [
    ['CPU', p.specs.processor?.replace(/ \(.*\)$/, '')],
    ['RAM', p.specs.ramGb ? `${p.specs.ramGb} GB` : undefined],
    ['Storage', formatStorage(p.specs.storageGb)],
    ['Display', p.specs.displayInches ? `${p.specs.displayInches}"` : undefined],
  ].filter((t): t is [string, string] => !!t[1])

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(p.id)
      toast(`Product ID ${p.id} copied`, 'success')
    } catch {
      toast('Could not copy — please note the Product ID manually', 'error')
    }
  }

  return (
    <>
      {p.isDemo && (
        <div className="border-b border-amber-200 bg-amber-50">
          <div className="container-x flex items-center gap-2.5 py-2.5 text-[13px] text-amber-900">
            <FlaskConical size={16} className="shrink-0" aria-hidden />
            <span>
              <strong>Demonstration listing.</strong> This sample product shows how listings will look. It is not an offer of available stock.
            </span>
          </div>
        </div>
      )}
      <div className="container-x pt-6">
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Products', to: paths.products },
            { label: cat.shortName, to: paths.category(cat.slug) },
            { label: p.name },
          ]}
        />
      </div>

      <section className="container-x grid gap-10 pt-6 pb-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14">
        {/* Gallery */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col gap-3">
          <div
            className={cn(
              'relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl border border-line',
              p.condition === 'refurbished' ? 'bg-media-teal' : 'bg-media',
            )}
          >
            <div className="dot-bg absolute inset-0 opacity-70" aria-hidden />
            <div className="absolute inset-[18%] rounded-full bg-gradient-to-tr from-brand-600/20 via-cyan-accent/10 to-purple-accent/20 blur-3xl" aria-hidden />
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.35 }}
                className="relative flex size-full items-center justify-center"
              >
                {p.images[active] ? (
                  <SmartImage src={p.images[active].src} alt={p.images[active].alt} eager sizes="(min-width: 1024px) 50vw, 100vw" className="size-full object-cover" />
                ) : (
                  <SmartImage
                    k={gallery[active] ?? gallery[0]}
                    alt={`${p.name} — representative image`}
                    eager
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="w-[86%] drop-shadow-[0_28px_30px_rgb(17_24_39/0.22)]"
                  />
                )}
              </motion.div>
            </AnimatePresence>
            {!p.images.length && (
              <span className="absolute bottom-3 left-3 rounded-full bg-white/80 px-3 py-1 font-mono text-[10.5px] tracking-[0.06em] text-slate-600 uppercase backdrop-blur">
                Representative render — photos of the actual unit to be added
              </span>
            )}
          </div>
          {(p.images.length > 1 || (!p.images.length && gallery.length > 1)) && (
            <div className="grid grid-cols-4 gap-3">
              {(p.images.length ? p.images.map((img) => ({ key: img.src, src: img.src as string | undefined, k: undefined, alt: img.alt })) : gallery.map((g) => ({ key: g, src: undefined, k: g, alt: '' }))).map(
                (t, i) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Show image ${i + 1}`}
                    aria-pressed={active === i}
                    className={cn(
                      'bg-media flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border-2 transition-all',
                      active === i ? 'border-brand-600 shadow-[0_10px_24px_-12px_rgb(12_93_174/0.7)]' : 'border-transparent hover:border-brand-200',
                    )}
                  >
                    {t.src ? <img src={t.src} alt="" loading="lazy" className="size-full object-cover" /> : <SmartImage k={t.k} alt="" sizes="120px" className="w-[88%]" />}
                  </button>
                ),
              )}
            </div>
          )}
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-wrap gap-2">
            <ConditionBadge condition={p.condition} className="h-7 px-3 text-[12.5px]" />
            {p.grade && <GradeBadge grade={p.grade} prefix className="h-7 px-3 text-[12.5px]" />}
            {p.condition !== 'new' && !p.grade && (
              <span className="inline-flex h-7 items-center rounded-full bg-slate-100 px-3 text-[12.5px] font-bold text-slate-700">
                Grade pending inspection
              </span>
            )}
          </div>
          <div>
            <p className="font-mono text-xs tracking-[0.1em] text-muted uppercase">
              {p.brand} ·{' '}
              <button type="button" onClick={copyId} className="underline decoration-dotted underline-offset-4 hover:text-ink" title="Copy product ID">
                {p.id}
              </button>
            </p>
            <h1 className="mt-2 text-[32px] leading-[1.1] font-bold tracking-[-0.03em] sm:text-[40px]">{p.name}</h1>
          </div>
          <p className="text-base leading-relaxed text-muted sm:text-[16.5px]">{p.description}</p>
          {p.audio && (
            <div className="flex flex-col gap-3">
              <AudioBadges audio={p.audio} />
              <CompareToggle product={p} className="h-10 w-full px-4 sm:w-auto sm:self-start" />
            </div>
          )}

          {tiles.length > 0 && (
            <dl className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {tiles.map(([k, v]) => (
                <div key={k} className="rounded-2xl border border-line p-3.5">
                  <dt className="font-mono text-[10.5px] tracking-[0.08em] text-muted uppercase">{k}</dt>
                  <dd className="mt-1.5 text-[14.5px] leading-snug font-bold">{v}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-5 sm:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-[28px] font-bold tracking-[-0.02em]">{price ?? 'Request price'}</span>
              <span className="text-[13px] text-muted">
                {price ? (p.price?.gstInclusive ? 'Inclusive of GST' : 'Excluding GST') : 'Price & availability confirmed on enquiry'}
              </span>
            </div>
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <Button to={quoteLinkFor(p)} size="lg" className="flex-1" iconRight={<ArrowRight size={18} />}>
                Get a Quote
              </Button>
              {wa && (
                <Button href={wa} size="lg" variant="secondary">
                  <MessageCircle size={18} aria-hidden /> WhatsApp
                </Button>
              )}
              {!wa && tel && (
                <Button href={tel} size="lg" variant="secondary">
                  <Phone size={18} aria-hidden /> Call us
                </Button>
              )}
            </div>
            <p className="text-[12.5px] leading-relaxed text-muted">
              Your quote request will include this product’s name and ID ({p.id}). Warranty, delivery to your PIN code and final price are
              confirmed in writing.
            </p>
          </div>

          {p.highlights && (
            <ul className="flex flex-col gap-2">
              {p.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-[15px]">
                  <Check size={18} className="mt-0.5 shrink-0 text-brand-600" aria-hidden /> {h}
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </section>

      <section className="container-x grid gap-12 pb-16 lg:grid-cols-2">
        {p.condition !== 'new' && (
          <Reveal>
            <h2 className="text-2xl font-bold tracking-[-0.02em]">Condition report</h2>
            <p className="mt-2 text-sm text-muted">{conditionDescription[p.condition]}</p>
            <dl className="mt-4">
              <Row label="Condition grade">
                {p.grade ? (
                  <>
                    <strong>{gradeInfo[p.grade].label}</strong> — {gradeInfo[p.grade].description}
                  </>
                ) : (
                  'Pending inspection'
                )}
              </Row>
              <Row label="Cosmetic notes">{p.refurb?.cosmeticNotes ?? TBC}</Row>
              <Row label="Battery">{p.refurb?.batteryHealth ?? TBC}</Row>
              <Row label="Known defects">
                {p.refurb?.knownDefects === undefined ? (
                  TBC
                ) : p.refurb.knownDefects.length === 0 ? (
                  'None known'
                ) : (
                  <ul className="flex flex-col gap-1">
                    {p.refurb.knownDefects.map((d) => (
                      <li key={d} className="flex items-start gap-2">
                        <CircleAlert size={16} className="mt-0.5 shrink-0 text-amber-600" aria-hidden />
                        {d}
                      </li>
                    ))}
                  </ul>
                )}
              </Row>
              <Row label="Inspection / testing">{p.refurb?.inspection ?? TBC}</Row>
              <Row label="Included accessories">{p.refurb?.accessoriesIncluded?.join(', ') ?? TBC}</Row>
              <Row label="Return eligibility">
                {p.refurb?.returnEligibility ?? (
                  <>
                    As per our{' '}
                    <Link to={paths.returns} className="font-semibold text-brand-600">
                      Returns Policy
                    </Link>{' '}
                    — confirmed with your quote
                  </>
                )}
              </Row>
            </dl>
          </Reveal>
        )}
        <Reveal delay={0.05} className={p.condition === 'new' ? 'lg:col-span-2 lg:max-w-3xl' : ''}>
          <h2 className="text-2xl font-bold tracking-[-0.02em]">Specifications</h2>
          <dl className="mt-4">
            {specRows(p).map(([k, v]) => (
              <Row key={k} label={k}>
                {v}
              </Row>
            ))}
          </dl>
          <p className="mt-3 text-[12.5px] text-muted">
            Specifications can vary by configuration and source. The exact configuration is confirmed in your quotation.
          </p>
        </Reveal>
      </section>

      <section className="container-x pb-16">
        <div className="on-dark grid gap-8 rounded-3xl bg-navy-950 p-8 text-white sm:grid-cols-3 sm:p-10">
          {[
            ['Warranty', p.warranty ?? 'Warranty is only stated once confirmed for this product — ask us for the exact duration and coverage.', paths.warranty],
            ['Returns', 'Return eligibility and terms are shared with your quotation and follow our Returns & Refunds Policy.', paths.returns],
            ['Delivery', 'Pan-India delivery subject to location. Charges and timelines are confirmed with each order.', paths.shipping],
          ].map(([t, d, to]) => (
            <div key={t} className="flex flex-col gap-2">
              <h2 className="text-sm font-bold text-cyan-accent">{t}</h2>
              <p className="text-sm leading-relaxed text-on-dark">{d}</p>
              <Link to={to} className="text-sm font-semibold text-white hover:underline">
                Read policy →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line bg-surface py-16">
          <div className="container-x flex flex-col gap-8">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-2xl font-bold tracking-[-0.02em] sm:text-3xl">More in {cat.shortName}</h2>
              <Link to={paths.category(cat.slug)} className="shrink-0 font-bold text-brand-600">
                View all →
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => (
                <ProductCard key={r.id} product={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[140px_minmax(0,1fr)] gap-4 border-b border-line py-3.5 text-[14.5px] sm:grid-cols-[190px_minmax(0,1fr)]">
      <dt className="text-muted">{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}
