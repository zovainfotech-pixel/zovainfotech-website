import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, BadgeCheck, Boxes, FileSpreadsheet, MapPin, Tags } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { categories, categoryBySlug } from '../../data/categories'
import { brands, faqs, industries, processSteps, whyChoose } from '../../data/content'
import { categoryMedia, productMediaKey, type MediaKey } from '../../data/media'
import { gradeInfo, gradeOrder, products, productsInCategory } from '../../data/products'
import { paths } from '../../data/routes'
import type { CategorySlug, Product, UseCase } from '../../data/types'
import { cn } from '../../lib/cn'
import { quoteLinkFor } from '../../lib/contact'
import { CircuitLines, NetworkMesh, Orbs } from '../brand/Decor'
import { categoryIcon, miscIcon, serviceIcon } from '../brand/icons'
import { ProductCard } from '../product/ProductCard'
import { Accordion } from '../ui/Accordion'
import { GradeBadge } from '../ui/Badges'
import { Button } from '../ui/Button'
import { Reveal, RevealGroup, RevealItem } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import { SmartImage } from '../ui/SmartImage'

/** Horizontal snap rail on phones, grid from tablet up. */
const rail =
  '-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4'
const railItem = 'flex w-[84%] shrink-0 snap-start sm:w-auto'

function ProductRail({ list, label }: { list: Product[]; label: string }) {
  return (
    <div className={rail} aria-label={label}>
      {list.map((p) => (
        <div key={p.id} className={railItem}>
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  )
}

function ViewAll({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="group inline-flex items-center gap-1.5 font-bold text-brand-600 hover:text-brand-700">
      {children}
      <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" aria-hidden />
    </Link>
  )
}

// ── Trust strip ────────────────────────────────────────────────────────────
export function TrustStrip() {
  const items = [
    { icon: BadgeCheck, t: 'Condition clearly labelled', d: 'New, refurbished or used' },
    { icon: Boxes, t: 'Multi-vendor sourcing', d: 'Brands and models on request' },
    { icon: FileSpreadsheet, t: 'Itemised quotations', d: 'GST-ready for businesses' },
    { icon: MapPin, t: 'Pan-India service', d: 'Subject to location' },
  ]
  return (
    <section className="relative border-b border-line bg-white" aria-label="How we work">
      <div className="container-x grid grid-cols-2 gap-4 py-6 lg:grid-cols-4">
        {items.map(({ icon: Icon, t, d }) => (
          <div key={t} className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Icon size={19} aria-hidden />
            </span>
            <span className="flex flex-col">
              <span className="text-[14px] font-bold text-ink">{t}</span>
              <span className="text-[12.5px] text-muted">{d}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Categories ─────────────────────────────────────────────────────────────
const catGlow = ['from-brand-600/15', 'from-teal-accent/15', 'from-violet-accent/15', 'from-cyan-accent/15', 'from-purple-accent/15']

export function CategoriesSection() {
  return (
    <section className="relative bg-white py-20 lg:py-28" aria-labelledby="cat-heading">
      <div className="container-x flex flex-col gap-10">
        <Reveal>
          <SectionHeading
            eyebrow="IT hardware"
            title={<span id="cat-heading">Quality IT hardware for every desk, team and site.</span>}
            description="Business laptops, MacBooks and Apple devices, desktops, monitors, printers, docking stations, peripherals and refurbished equipment — sourced to your specification."
            action={<ViewAll to={paths.products}>View all products</ViewAll>}
          />
        </Reveal>
        <RevealGroup className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {categories.map((c, i) => {
            const Icon = categoryIcon[c.slug]
            return (
              <RevealItem key={c.slug} className="flex">
                <Link
                  to={paths.category(c.slug)}
                  className="glow-border group flex w-full rounded-[var(--radius-card)] transition-transform duration-300 hover:-translate-y-1"
                >
                  <span className="flex w-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white transition-shadow group-hover:border-transparent group-hover:shadow-[var(--shadow-card-hover)]">
                    <span className={cn('relative flex aspect-[4/3] items-center justify-center bg-gradient-to-b to-white', catGlow[i % catGlow.length])}>
                      <SmartImage
                        k={categoryMedia[c.slug]}
                        alt=""
                        sizes="(min-width: 1024px) 18vw, 45vw"
                        className="w-[86%] drop-shadow-[0_14px_18px_rgb(17_24_39/0.18)] transition-transform duration-700 group-hover:scale-[1.08]"
                      />
                      <span className="absolute top-3 left-3 flex size-9 items-center justify-center rounded-xl bg-white/90 text-brand-600 shadow-sm backdrop-blur transition-all duration-500 group-hover:rotate-[-8deg] group-hover:bg-brand-600 group-hover:text-white">
                        <Icon size={17} aria-hidden />
                      </span>
                    </span>
                    <span className="flex flex-col gap-1 p-4">
                      <span className="text-[14.5px] leading-snug font-bold sm:text-[15px]">{c.name}</span>
                      <span className="line-clamp-1 text-[12.5px] text-muted">{c.subcategories.slice(0, 3).join(' · ')}</span>
                    </span>
                  </span>
                </Link>
              </RevealItem>
            )
          })}
        </RevealGroup>
      </div>
    </section>
  )
}

// ── New laptops ────────────────────────────────────────────────────────────
const newTabs: { label: string; use: UseCase }[] = [
  { label: 'Business', use: 'business' },
  { label: 'Student', use: 'student' },
  { label: 'Performance', use: 'performance' },
  { label: 'Premium', use: 'premium' },
]

export function NewLaptopsSection() {
  const [tab, setTab] = useState(newTabs[0])
  const list = products.filter((p) => p.category === 'new-laptops' && p.useCases?.includes(tab.use)).slice(0, 4)
  return (
    <section className="py-20 lg:py-24" aria-labelledby="new-heading">
      <div className="container-x flex flex-col gap-8">
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading eyebrow="New laptops" title={<span id="new-heading">Factory-new machines, sourced to spec.</span>} />
          <div className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0" role="tablist" aria-label="Laptop type">
            <div className="flex gap-1 rounded-full border border-line bg-surface p-1">
              {newTabs.map((t) => (
                <button
                  key={t.label}
                  role="tab"
                  type="button"
                  aria-selected={tab.label === t.label}
                  onClick={() => setTab(t)}
                  className={cn(
                    'relative h-9 shrink-0 rounded-full px-4 text-sm font-bold transition-colors',
                    tab.label === t.label ? 'text-white' : 'text-ink hover:text-brand-600',
                  )}
                >
                  {tab.label === t.label && (
                    <motion.span layoutId="new-tab" className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-600 to-violet-accent" />
                  )}
                  <span className="relative">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </Reveal>
        <AnimatePresence mode="wait">
          <motion.div
            key={tab.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            role="tabpanel"
            aria-label={`${tab.label} laptops`}
          >
            <ProductRail list={list} label={`${tab.label} laptops`} />
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-center">
          <Button to={`${paths.category('new-laptops')}?use=${tab.use}`} variant="secondary" iconRight={<ArrowRight size={17} />}>
            View all {tab.label.toLowerCase()} laptops
          </Button>
        </div>
      </div>
    </section>
  )
}

// ── Refurbished ────────────────────────────────────────────────────────────
export function RefurbishedSection() {
  const list = products.filter((p) => p.category === 'refurbished-laptops').slice(0, 4)
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-[#eef8fb] via-white to-[#eef5ff] py-20 lg:py-28" aria-labelledby="refurb-heading">
      <div className="absolute top-0 right-0 -z-10 size-[520px] rounded-full bg-teal-accent/15 blur-[120px]" aria-hidden />
      <div className="absolute bottom-0 left-0 -z-10 size-[420px] rounded-full bg-brand-600/10 blur-[120px]" aria-hidden />
      <div className="container-x flex flex-col gap-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
          <Reveal className="flex flex-col gap-5">
            <span className="eyebrow text-teal-700">Refurbished &amp; used laptops</span>
            <h2 id="refurb-heading" className="text-4xl leading-[1.05] font-bold tracking-[-0.035em] sm:text-5xl">
              Premium Performance.{' '}
              <span className="bg-gradient-to-r from-teal-600 via-emerald-500 to-brand-600 bg-clip-text text-transparent">Smarter Value.</span>
            </h2>
            <p className="max-w-xl text-[17px] leading-relaxed text-muted">
              Explore refurbished business laptops with transparent specifications and condition information — battery, cosmetic notes, known
              defects and warranty, stated only where confirmed for that unit.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button to={paths.category('refurbished-laptops')} iconRight={<ArrowRight size={17} />}>
                Browse refurbished laptops
              </Button>
              <Button to={`${paths.category('refurbished-laptops')}#request-model`} variant="secondary">
                Request a specific model
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="relative">
            <div className="relative mx-auto aspect-[4/3] w-full max-w-[560px]">
              <div className="absolute inset-[10%] rounded-full bg-gradient-to-tr from-teal-accent/30 to-brand-600/20 blur-3xl" aria-hidden />
              <SmartImage k="laptopBlack" alt="Refurbished business laptop" className="absolute top-[4%] left-0 w-[78%] animate-float drop-shadow-[0_30px_30px_rgb(17_24_39/0.25)]" />
              <SmartImage
                k="laptopPorts"
                alt="Close-up of a laptop's ports and keyboard"
                className="absolute right-0 bottom-0 w-[48%] rounded-2xl border-4 border-white bg-white shadow-[var(--shadow-card-hover)]"
              />
              <span className="absolute top-[6%] right-[6%] flex items-center gap-2 rounded-full border border-teal-200 bg-white/90 px-3 py-1.5 text-[12.5px] font-bold text-teal-800 shadow-sm backdrop-blur">
                <Tags size={14} aria-hidden /> Graded per unit
              </span>
            </div>
          </Reveal>
        </div>
        <RevealGroup className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {gradeOrder.map((g) => (
            <RevealItem key={g}>
              <div className="flex h-full items-start gap-3 rounded-2xl border border-teal-100 bg-white/80 p-4 backdrop-blur">
                <GradeBadge grade={g} />
                <span className="text-[13px] leading-relaxed text-slate-600">{gradeInfo[g].description}</span>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
        <ProductRail list={list} label="Refurbished laptops" />
      </div>
    </section>
  )
}

// ── Best-value business laptops ────────────────────────────────────────────
export function BestValueSection() {
  const list = products
    .filter((p) => (p.category === 'refurbished-laptops' || p.category === 'new-laptops') && p.useCases?.includes('business') && (p.condition !== 'new' || p.useCases.includes('budget') || p.specs.processorFamily?.includes('i5')))
    .slice(0, 4)
  return (
    <section className="py-20 lg:py-24" aria-labelledby="value-heading">
      <div className="container-x flex flex-col gap-8">
        <Reveal>
          <SectionHeading
            eyebrow="Best-value business laptops"
            title={<span id="value-heading">Dependable business machines for growing teams.</span>}
            description="A mix of new mainstream and refurbished business-class models — ideal for office staff, field teams and training labs."
            action={<ViewAll to={`${paths.products}?use=business`}>View all business laptops</ViewAll>}
          />
        </Reveal>
        <ProductRail list={list} label="Best-value business laptops" />
      </div>
    </section>
  )
}

// ── Store spotlights (category panels) ─────────────────────────────────────
const spotlights: { slug: CategorySlug; tone: string }[] = [
  { slug: 'desktops-workstations', tone: 'from-brand-600/20 via-brand-50' },
  { slug: 'apple-products', tone: 'from-slate-300/40 via-slate-50' },
  { slug: 'monitors-displays', tone: 'from-violet-accent/20 via-lavender' },
  { slug: 'components-parts', tone: 'from-teal-accent/20 via-teal-50' },
  { slug: 'printers-scanners', tone: 'from-cyan-accent/20 via-cyan-50' },
  { slug: 'networking', tone: 'from-purple-accent/20 via-brand-50' },
]

export function StoreSpotlights() {
  return (
    <section className="relative border-y border-line bg-surface py-20 lg:py-28" aria-labelledby="store-heading">
      <div className="container-x flex flex-col gap-10">
        <Reveal>
          <SectionHeading
            eyebrow="Explore the store"
            title={<span id="store-heading">Hardware for every workstation, rack and reception desk.</span>}
            action={<ViewAll to={paths.products}>Browse the full catalogue</ViewAll>}
          />
        </Reveal>
        <RevealGroup className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {spotlights.map(({ slug, tone }) => {
            const c = categoryBySlug[slug]
            const items = productsInCategory(slug).slice(0, 3)
            return (
              <RevealItem key={slug} className="flex">
                <article className="glow-border group flex w-full rounded-[var(--radius-card)]">
                  <div className="flex w-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white group-hover:border-transparent">
                    <div className={cn('relative flex h-48 items-end justify-between overflow-hidden bg-gradient-to-br to-white px-6 pb-4', tone)}>
                      <div className="relative z-10 flex max-w-[55%] flex-col gap-1 self-start pt-6">
                        <h3 className="font-display text-xl font-bold">{c.shortName}</h3>
                        <p className="text-[13px] leading-snug text-muted">{c.subcategories.slice(0, 3).join(' · ')}</p>
                      </div>
                      <SmartImage
                        k={categoryMedia[slug]}
                        alt=""
                        sizes="(min-width: 1280px) 20vw, 45vw"
                        className="absolute right-[-6%] bottom-[-8%] w-[62%] drop-shadow-[0_18px_22px_rgb(17_24_39/0.22)] transition-transform duration-700 group-hover:scale-[1.06] group-hover:-rotate-1"
                      />
                    </div>
                    <ul className="flex flex-1 flex-col divide-y divide-line px-5">
                      {items.map((p) => (
                        <li key={p.id} className="flex items-center gap-3 py-3">
                          <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-surface">
                            <SmartImage k={productMediaKey(p)} alt="" sizes="48px" className="w-11" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <Link to={paths.product(p.slug)} className="line-clamp-1 text-[14px] font-bold hover:text-brand-600">
                              {p.name}
                            </Link>
                            <span className="line-clamp-1 text-[12px] text-muted">{p.subcategory ?? p.brand}</span>
                          </span>
                          <Link
                            to={quoteLinkFor(p)}
                            className="shrink-0 rounded-lg px-2.5 py-1.5 text-[12.5px] font-bold text-brand-600 transition-colors hover:bg-brand-50"
                            aria-label={`Request a quote for ${p.name}`}
                          >
                            Quote
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link
                      to={paths.category(slug)}
                      className="m-5 mt-2 flex h-11 items-center justify-center gap-1.5 rounded-xl border border-line text-sm font-bold transition-colors hover:border-brand-400 hover:text-brand-700"
                    >
                      View all {c.shortName.toLowerCase()} <ArrowRight size={16} aria-hidden />
                    </Link>
                  </div>
                </article>
              </RevealItem>
            )
          })}
        </RevealGroup>
      </div>
    </section>
  )
}

// ── Accessories ────────────────────────────────────────────────────────────
type AccGroup = 'All' | 'Input' | 'Audio & video' | 'Power' | 'Storage' | 'Connectivity' | 'Parts'
const accessories: { name: string; k: MediaKey; group: Exclude<AccGroup, 'All'>; to: string }[] = [
  { name: 'Keyboard & mouse combos', k: 'keyboardMouse', group: 'Input', to: `${paths.category('it-accessories')}?subcategory=Keyboards%20%26%20mice` },
  { name: 'Headsets', k: 'headset', group: 'Audio & video', to: `${paths.category('it-accessories')}?subcategory=Headsets%20%26%20webcams` },
  { name: 'Webcams', k: 'webcam', group: 'Audio & video', to: `${paths.category('it-accessories')}?subcategory=Headsets%20%26%20webcams` },
  { name: 'Laptop chargers & adapters', k: 'charger', group: 'Power', to: `${paths.category('it-accessories')}?subcategory=Chargers%20%26%20adapters` },
  { name: 'RAM & SSD storage', k: 'ssdRam', group: 'Storage', to: paths.category('components-parts') },
  { name: 'External storage', k: 'externalDrive', group: 'Storage', to: `${paths.category('components-parts')}?subcategory=External%20drives` },
  { name: 'USB hubs & docking stations', k: 'dock', group: 'Connectivity', to: `${paths.category('it-accessories')}?subcategory=USB%20hubs%20%26%20docking%20stations` },
  { name: 'Computer cables', k: 'cables', group: 'Connectivity', to: `${paths.category('it-accessories')}?subcategory=Cables` },
  { name: 'Laptop stands', k: 'laptopStand', group: 'Input', to: `${paths.category('it-accessories')}?subcategory=Laptop%20stands` },
  { name: 'Monitors', k: 'monitor', group: 'Audio & video', to: paths.category('monitors-displays') },
  { name: 'Batteries & replacement parts', k: 'batteryParts', group: 'Parts', to: paths.category('components-parts') },
  { name: 'Wireless mice', k: 'mouse', group: 'Input', to: `${paths.category('it-accessories')}?subcategory=Keyboards%20%26%20mice` },
]
const accGroups: AccGroup[] = ['All', 'Input', 'Audio & video', 'Power', 'Storage', 'Connectivity', 'Parts']

export function AccessoriesSection() {
  const [group, setGroup] = useState<AccGroup>('All')
  const list = accessories.filter((a) => group === 'All' || a.group === group)
  return (
    <section className="py-20 lg:py-28" aria-labelledby="acc-heading">
      <div className="container-x flex flex-col gap-8">
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="IT accessories"
            title={<span id="acc-heading">The right part, charger or cable — first time.</span>}
            description="Share your device model or part number and we’ll source a compatible match from our vendor network."
          />
          <div className="flex shrink-0 gap-2">
            <Button to={paths.category('it-accessories')}>Find Your Accessory</Button>
            <Button to={`${paths.quote}?type=IT%20Accessories`} variant="secondary">
              Request a Quote
            </Button>
          </div>
        </Reveal>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filter accessories">
          {accGroups.map((g) => (
            <button
              key={g}
              type="button"
              aria-pressed={group === g}
              onClick={() => setGroup(g)}
              className={cn(
                'h-10 shrink-0 rounded-full border px-4 text-sm font-bold transition-all',
                group === g
                  ? 'border-transparent bg-navy-950 text-white shadow-[0_8px_20px_-10px_rgb(4_22_52/0.6)]'
                  : 'border-line bg-white hover:border-brand-400 hover:text-brand-700',
              )}
            >
              {g}
            </button>
          ))}
        </div>
        <motion.ul layout className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((a) => (
              <motion.li
                key={a.name}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.25 }}
                className="flex"
              >
                <Link to={a.to} className="glow-border group flex w-full rounded-[var(--radius-card)]">
                  <span className="flex w-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white group-hover:border-transparent group-hover:shadow-[var(--shadow-card-hover)]">
                    <span className="bg-media relative flex aspect-[4/3] items-center justify-center">
                      <SmartImage
                        k={a.k}
                        alt=""
                        sizes="(min-width: 1024px) 22vw, 45vw"
                        className="w-[84%] drop-shadow-[0_14px_16px_rgb(17_24_39/0.2)] transition-transform duration-700 group-hover:scale-[1.08]"
                      />
                      <span className="absolute top-3 left-3 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-bold text-muted backdrop-blur">{a.group}</span>
                    </span>
                    <span className="flex items-center justify-between gap-2 p-4">
                      <span className="text-[14px] leading-snug font-bold">{a.name}</span>
                      <ArrowRight size={16} className="shrink-0 text-brand-600 transition-transform group-hover:translate-x-1" aria-hidden />
                    </span>
                  </span>
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  )
}

// ── Brands (slow marquee) ──────────────────────────────────────────────────
export function BrandsSection() {
  const row = [...brands, ...brands]
  return (
    <section className="border-y border-line bg-white py-14" aria-labelledby="brand-heading">
      <div className="container-x mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-3">
          <span className="eyebrow">Shop by brand</span>
          <h2 id="brand-heading" className="text-2xl font-bold tracking-[-0.02em] sm:text-3xl">
            Multi-brand sourcing across leading manufacturers.
          </h2>
        </div>
        <p className="max-w-xs text-[13px] text-muted md:text-right">
          Brand names are trademarks of their owners. Listing a brand does not imply authorised-reseller status.
        </p>
      </div>
      <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <ul className="flex w-max animate-[marquee_40s_linear_infinite] gap-3 group-hover:[animation-play-state:paused] motion-reduce:animate-none motion-reduce:flex-wrap">
          {row.map((b, i) => (
            <li key={`${b}-${i}`} aria-hidden={i >= brands.length}>
              <Link
                to={`${paths.products}?brand=${encodeURIComponent(b)}`}
                tabIndex={i >= brands.length ? -1 : undefined}
                className="flex h-16 w-40 items-center justify-center rounded-2xl border border-line bg-surface font-display text-[17px] font-bold tracking-[-0.01em] text-slate-600 transition-all hover:border-brand-400 hover:bg-white hover:text-brand-700 hover:shadow-[var(--shadow-card-hover)]"
              >
                {b}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <style>{'@keyframes marquee{to{transform:translateX(-50%)}}'}</style>
    </section>
  )
}

// ── Why choose ─────────────────────────────────────────────────────────────
export function WhyChooseSection() {
  return (
    <section className="bg-white py-20 lg:py-28" aria-labelledby="why-heading">
      <div className="container-x flex flex-col gap-12">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Why choose us"
            title={<span id="why-heading">One accountable partner, from quote to support.</span>}
            description="Enterprise technology solutions with the flexibility of a procurement partner — new and refurbished assets, multiple vendors, and the team to install and support them."
          />
        </Reveal>
        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {whyChoose.map((w, i) => {
            const Icon = miscIcon[w.icon]
            const tones = ['from-brand-600 to-cyan-accent', 'from-violet-accent to-purple-accent', 'from-teal-accent to-cyan-accent', 'from-orange-accent to-crimson-accent']
            return (
              <RevealItem key={w.title} className="flex">
                <div className="glow-border group flex w-full rounded-[var(--radius-card)]">
                  <div className="flex w-full flex-col gap-4 rounded-[var(--radius-card)] border border-line bg-white p-7 transition-shadow group-hover:border-transparent group-hover:shadow-[var(--shadow-card-hover)]">
                    <span
                      className={cn(
                        'flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-[0_10px_24px_-10px_rgb(12_93_174/0.7)] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6',
                        tones[i % 4],
                      )}
                    >
                      <Icon size={21} aria-hidden />
                    </span>
                    <h3 className="text-[19px] font-bold tracking-[-0.01em]">{w.title}</h3>
                    <p className="text-[14.5px] leading-relaxed text-muted">{w.text}</p>
                  </div>
                </div>
              </RevealItem>
            )
          })}
        </RevealGroup>
      </div>
    </section>
  )
}

// ── IT & cybersecurity solutions (dark) ────────────────────────────────────
const solutions: { title: string; text: string; icon: Parameters<typeof pickIcon>[0]; slug: string; k?: MediaKey }[] = [
  { title: 'Cybersecurity', text: 'Firewalls, secure access and security hygiene reviews.', icon: 'shield', slug: 'cybersecurity-dlp', k: 'firewall' },
  { title: 'Endpoint protection', text: 'Antivirus, EDR and patch management for every device.', icon: 'shield', slug: 'cybersecurity-dlp' },
  { title: 'Data Loss Prevention', text: 'Policies that control how sensitive data moves.', icon: 'lock', slug: 'cybersecurity-dlp' },
  { title: 'Network infrastructure', text: 'Switching, Wi-Fi coverage and structured cabling.', icon: 'network', slug: 'network-setup', k: 'switch' },
  { title: 'Cloud & software licensing', text: 'Microsoft 365, Google Workspace, OS and security licences.', icon: 'cloud', slug: 'software-licensing' },
  { title: 'Enterprise IT support', text: 'AMC, remote and on-site support scoped to your sites.', icon: 'calendar', slug: 'it-amc', k: 'server' },
  { title: 'Audio-visual integration', text: 'Meeting rooms and video conferencing systems.', icon: 'presentation', slug: 'audio-visual-digital-signage', k: 'conference' },
  { title: 'Digital signage', text: 'Displays and players for lobbies, retail and campuses.', icon: 'tv', slug: 'audio-visual-digital-signage' },
]
function pickIcon(k: keyof typeof serviceIcon) {
  return serviceIcon[k]
}

export function SolutionsSection() {
  const featured = solutions.filter((s) => s.k)
  const rest = solutions.filter((s) => !s.k)
  return (
    <section className="on-dark relative isolate overflow-hidden bg-navy-950 py-20 text-white lg:py-28" aria-labelledby="sol-heading">
      <Orbs className="opacity-70" />
      <NetworkMesh className="opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div className="container-x flex flex-col gap-12">
        <Reveal>
          <SectionHeading
            dark
            eyebrow="IT & cybersecurity solutions"
            title={
              <span id="sol-heading">
                Secure, connected and <span className="text-gradient">ready for work.</span>
              </span>
            }
            description="Security, networking, cloud, support and AV — scoped to your organisation and available on enquiry."
            action={
              <Link to={paths.services} className="group inline-flex items-center gap-1.5 font-bold text-cyan-accent hover:text-white">
                All IT services <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            }
          />
        </Reveal>
        <RevealGroup className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {featured.map((s) => {
            const Icon = pickIcon(s.icon)
            return (
              <RevealItem key={s.title} className="flex">
                <Link
                  to={paths.service(s.slug)}
                  className="group flex w-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-white/10 bg-white/[0.04] backdrop-blur transition-all hover:-translate-y-1 hover:border-cyan-accent/40 hover:shadow-[var(--shadow-glow)]"
                >
                  <span className="bg-media-dark relative flex aspect-[4/3] items-center justify-center overflow-hidden">
                    <CircuitLines className="opacity-60" />
                    <SmartImage k={s.k} alt="" tone="dark" sizes="(min-width: 1024px) 22vw, 45vw" className="w-[82%] drop-shadow-[0_20px_24px_rgb(0_0_0/0.5)] transition-transform duration-700 group-hover:scale-[1.07]" />
                  </span>
                  <span className="flex flex-col gap-2 p-5">
                    <span className="flex items-center gap-2 font-bold">
                      <Icon size={17} className="text-cyan-accent" aria-hidden /> {s.title}
                    </span>
                    <span className="text-[13.5px] leading-relaxed text-on-dark">{s.text}</span>
                  </span>
                </Link>
              </RevealItem>
            )
          })}
        </RevealGroup>
        <RevealGroup className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {rest.map((s) => {
            const Icon = pickIcon(s.icon)
            return (
              <RevealItem key={s.title} className="flex">
                <Link
                  to={paths.service(s.slug)}
                  className="group flex w-full items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all hover:border-violet-accent/50 hover:bg-white/[0.06]"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-accent/30 to-cyan-accent/20 text-cyan-accent transition-transform group-hover:scale-110">
                    <Icon size={19} aria-hidden />
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="font-bold">{s.title}</span>
                    <span className="text-[13px] leading-relaxed text-on-dark">{s.text}</span>
                  </span>
                </Link>
              </RevealItem>
            )
          })}
        </RevealGroup>
        <p className="text-center text-[12.5px] text-slate-500">
          Network graphics are decorative illustrations, not a live monitoring system. Service scope and coverage are confirmed per enquiry.
        </p>
      </div>
    </section>
  )
}

// ── Corporate procurement ──────────────────────────────────────────────────
const corpCards = [
  { t: 'Bulk Laptop Procurement', d: 'Standardised fleets or mixed specifications for teams of any size.', k: 'laptopSilver' as MediaKey },
  { t: 'Desktop & Workstation Procurement', d: 'Office towers, all-in-ones and professional workstations.', k: 'desktopTower' as MediaKey },
  { t: 'IT Accessories', d: 'Docks, headsets, keyboards, monitors and cables in bulk.', k: 'keyboardMouse' as MediaKey },
  { t: 'Printer & Networking Procurement', d: 'MFPs, scanners, switches, routers and Wi-Fi.', k: 'router' as MediaKey },
  { t: 'Software & Cybersecurity', d: 'Licences, endpoint security, firewalls and DLP.', k: 'firewall' as MediaKey },
  { t: 'Installation & IT Support', d: 'Deployment, configuration and AMC after delivery.', k: 'server' as MediaKey },
]

export function CorporateSection() {
  return (
    <section className="bg-white py-20 lg:py-28" aria-labelledby="corp-heading">
      <div className="container-x">
        <Reveal>
          <div className="on-dark relative isolate overflow-hidden rounded-[32px] bg-gradient-to-br from-navy-950 via-navy-800 to-[#0a2a5c] p-7 text-white sm:p-12 lg:p-16">
            <CircuitLines className="opacity-60" />
            <div className="absolute -top-24 -right-24 -z-10 size-96 rounded-full bg-purple-accent/40 blur-[100px]" aria-hidden />
            <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
              <div className="flex flex-col gap-6">
                <span className="eyebrow text-cyan-accent">Corporate IT procurement</span>
                <h2 id="corp-heading" className="text-4xl leading-[1.05] font-bold tracking-[-0.035em] sm:text-5xl">
                  Your IT Procurement, <span className="text-gradient">Simplified.</span>
                </h2>
                <p className="text-[16.5px] leading-relaxed text-on-dark">
                  From individual laptops to bulk business hardware, Zova Infotech helps customers source technology products and IT solutions
                  according to their requirements.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button to={`${paths.corporate}#requirement`} size="lg" iconRight={<ArrowRight size={18} />}>
                    Submit Your Requirement
                  </Button>
                  <Button to={paths.contact} size="lg" variant="ghost-dark">
                    Talk to our team
                  </Button>
                </div>
                <div className="relative mt-4 hidden h-56 lg:block" aria-hidden>
                  <SmartImage k="server" alt="" className="absolute bottom-0 left-0 w-[46%] animate-float opacity-90" />
                  <SmartImage k="laptopGrey" alt="" className="absolute right-[4%] bottom-0 w-[56%] animate-float [animation-delay:-3s]" />
                </div>
              </div>
              <ul className="grid content-start gap-3 sm:grid-cols-2">
                {corpCards.map((c) => (
                  <li
                    key={c.t}
                    className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-cyan-accent/40 hover:bg-white/[0.1]"
                  >
                    <span className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-white/[0.06]">
                      <SmartImage k={c.k} alt="" sizes="64px" className="w-[58px] transition-transform duration-500 group-hover:scale-110" />
                    </span>
                    <span className="flex flex-col gap-1">
                      <span className="leading-snug font-bold">{c.t}</span>
                      <span className="text-[13px] leading-relaxed text-slate-300">{c.d}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ── How it works ───────────────────────────────────────────────────────────
export function HowItWorksSection() {
  return (
    <section className="bg-surface py-20 lg:py-28" aria-labelledby="how-heading">
      <div className="container-x flex flex-col gap-14">
        <Reveal>
          <SectionHeading align="center" eyebrow="How it works" title={<span id="how-heading">From requirement to deployment in four steps.</span>} />
        </Reveal>
        <RevealGroup className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6" stagger={0.12}>
          <div className="absolute top-8 right-[12%] left-[12%] hidden h-0.5 bg-gradient-to-r from-brand-600 via-cyan-accent to-purple-accent opacity-40 lg:block" aria-hidden />
          {processSteps.map((s, i) => (
            <RevealItem key={s.title}>
              <div className="relative flex flex-col items-center gap-4 text-center">
                <span className="flex size-16 items-center justify-center rounded-[20px] bg-gradient-to-br from-brand-600 to-violet-accent font-mono text-xl font-semibold text-white shadow-[0_14px_30px_-12px_rgb(12_93_174/0.8)] ring-8 ring-surface">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-lg font-bold">{s.title}</h3>
                <p className="max-w-64 text-[14.5px] leading-relaxed text-muted">{s.text}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
        <p className="mx-auto max-w-2xl rounded-2xl border border-line bg-white px-5 py-3 text-center text-[13.5px] text-muted sm:rounded-full">
          Quotations, fulfilment timelines and service schedules are confirmed individually for each enquiry.
        </p>
      </div>
    </section>
  )
}

// ── Industries ─────────────────────────────────────────────────────────────
export function IndustriesSection() {
  const tones = ['text-brand-600 bg-brand-50', 'text-violet-accent bg-lavender', 'text-teal-accent bg-teal-50', 'text-cyan-600 bg-cyan-50']
  return (
    <section className="py-20 lg:py-24" aria-labelledby="ind-heading">
      <div className="container-x flex flex-col gap-8">
        <Reveal>
          <SectionHeading eyebrow="Industries we serve" title={<span id="ind-heading">Built for teams of every shape.</span>} />
        </Reveal>
        <RevealGroup className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7" stagger={0.04}>
          {industries.map((ind, i) => {
            const Icon = miscIcon[ind.icon]
            return (
              <RevealItem key={ind.title} className="flex">
                <div className="group flex w-full flex-col gap-3 rounded-2xl border border-line bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]" title={ind.text}>
                  <span className={cn('flex size-11 items-center justify-center rounded-xl transition-transform group-hover:scale-110', tones[i % 4])}>
                    <Icon size={21} aria-hidden />
                  </span>
                  <span className="text-[14.5px] leading-snug font-bold">{ind.title}</span>
                </div>
              </RevealItem>
            )
          })}
        </RevealGroup>
      </div>
    </section>
  )
}

// ── FAQ ────────────────────────────────────────────────────────────────────
export function FaqSection() {
  return (
    <section className="relative border-t border-line bg-gradient-to-b from-surface to-white py-20 lg:py-28" aria-labelledby="faq-heading">
      <div className="container-x grid gap-10 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-16">
        <Reveal className="flex flex-col gap-5">
          <SectionHeading
            eyebrow="FAQ"
            title={<span id="faq-heading">Questions, answered plainly.</span>}
            description="Availability, pricing, warranty, delivery and support coverage are confirmed for each enquiry."
          />
          <Button to={paths.contact} variant="secondary" className="self-start">
            Contact Our Team
          </Button>
        </Reveal>
        <Reveal delay={0.1}>
          <Accordion items={faqs} />
        </Reveal>
      </div>
    </section>
  )
}

// ── Final CTA ──────────────────────────────────────────────────────────────
export function FinalCta() {
  return (
    <section className="bg-[var(--background-primary)] py-20 lg:py-24" aria-labelledby="cta-heading">
      <div className="container-x">
        <Reveal>
          <div className="on-dark relative isolate overflow-hidden rounded-[24px] p-8 text-white shadow-[0_30px_70px_-30px_rgb(12_93_174/0.55)] sm:p-12 lg:p-16">
            <div className="absolute inset-0 -z-10 animate-grad bg-[linear-gradient(120deg,#0d509f,#0c5dae_35%,#0a7bc1_65%,#02a9c4)] bg-[length:200%_200%]" aria-hidden />
            <div className="grid-bg absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_at_70%_50%,black,transparent_75%)]" aria-hidden />
            <CircuitLines className="opacity-25" />
            <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
              <div className="flex max-w-2xl flex-col gap-5">
                <h2 id="cta-heading" className="text-3xl leading-[1.08] font-extrabold tracking-[-0.035em] sm:text-[44px]">
                  Need a Complete Technology Solution?
                </h2>
                <p className="text-[16px] leading-relaxed font-semibold text-blue-50/90">
                  IT Hardware • AV • Digital Signage • Microsoft • Cybersecurity • DLP • Procurement
                </p>
                <p className="text-[15.5px] leading-relaxed text-blue-50/80">
                  Tell us what you need — one device or a company-wide rollout — and we will come back with options and an itemised quotation.
                </p>
              </div>
              <div className="flex w-full flex-col gap-3">
                <Button to={paths.quote} variant="white" size="lg" iconRight={<ArrowRight size={18} />}>
                  Request a Quote
                </Button>
                <Button to={paths.contact} variant="ghost-dark" size="lg" className="border-white/50">
                  Talk to an IT Expert
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

