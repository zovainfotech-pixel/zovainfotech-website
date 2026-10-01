import { ArrowRight, BatteryMedium, CircleAlert, ClipboardCheck, Cpu, Monitor, Package, ShieldCheck, Sparkles } from 'lucide-react'
import { useMemo } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { RequestModelForm } from '../components/forms/RequestModelForm'
import { AppleBand } from '../components/home/AppleShowcase'
import { HeadsetB2BSection, HeadsetBrands, HeadsetQuoteSection, HeadsetsHomeSection, PolyCollection, headsetQuoteHref } from '../components/headsets/HeadsetSections'
import { PageHero } from '../components/layout/PageHero'
import { Catalogue } from '../components/product/Catalogue'
import { GradeBadge } from '../components/ui/Badges'
import { Button } from '../components/ui/Button'
import { Reveal, RevealGroup, RevealItem } from '../components/ui/Reveal'
import { SmartImage } from '../components/ui/SmartImage'
import { categoryBySlug, isCategorySlug } from '../data/categories'
import { categoryMedia } from '../data/media'
import { conditionDescription, gradeInfo, gradeOrder, products, productsInCategory } from '../data/products'
import { paths } from '../data/routes'
import type { CategorySlug } from '../data/types'
import { usePageMeta } from '../lib/seo'
import NotFoundPage from './NotFoundPage'

const slugify = (s: string) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const headsetAliases: Record<string, string> = {
  '': '',
  'usb-headsets': '?subcategory=USB%20Headsets',
  'usb-c-headsets': '?connectivity=USB-C',
  'call-centre-headsets': '?subcategory=Call%20Centre%20Headsets',
  'wireless-headsets': '?subcategory=Wireless%20Bluetooth%20Headsets',
  'poly-headsets': '?brand=Poly',
  'accessories': '?subcategory=Headset%20Accessories',
  'meeting-room-audio': '?subcategory=Meeting%20Room%20Audio',
}

export default function CataloguePage() {
  const { category, sub } = useParams()
  // Short headset URLs from the brief map onto the category's filters.
  const alias = category === 'headsets' || category === 'meeting-room-audio' ? headsetAliases[category === 'headsets' ? (sub ?? '') : 'meeting-room-audio'] : undefined
  if (alias !== undefined) return <Navigate replace to={`${paths.category('headsets-audio-solutions')}${alias}#catalogue`} />
  if (category !== undefined && !isCategorySlug(category)) return <NotFoundPage />
  if (category && sub) {
    // Friendly sub-URLs (e.g. /products/headsets-audio-solutions/usb-headsets) map onto the ?subcategory= filter.
    const match = categoryBySlug[category].subcategories.find((s) => slugify(s) === sub)
    if (!match) return <NotFoundPage />
    return <Navigate replace to={`${paths.category(category)}?subcategory=${encodeURIComponent(match)}#catalogue`} />
  }
  return <CatalogueInner key={category ?? 'all'} categorySlug={category} />
}

function CatalogueInner({ categorySlug }: { categorySlug?: CategorySlug }) {
  const cat = categorySlug ? categoryBySlug[categorySlug] : null
  const list = useMemo(() => (cat ? productsInCategory(cat.slug) : products), [cat])
  const isRefurb = cat?.slug === 'refurbished-laptops'
  const isHeadsets = cat?.slug === 'headsets-audio-solutions'

  usePageMeta({
    title: cat ? cat.seoTitle : 'All Products — Laptops, Desktops, Accessories & IT Hardware',
    description: cat
      ? cat.seoDescription
      : 'Browse new and refurbished laptops, desktops, Apple products, monitors, printers, accessories, components, networking and servers. Enquire for pricing and availability.',
  })

  const crumbs = [{ label: 'Home', to: '/' }, ...(cat ? [{ label: 'Products', to: paths.products }, { label: cat.name }] : [{ label: 'Products' }])]

  return (
    <>
      {isRefurb ? (
        <PageHero
          tone="teal"
          crumbs={crumbs}
          eyebrow="Refurbished & used laptops"
          title={
            <>
              Premium Performance.{' '}
              <span className="bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-accent bg-clip-text text-transparent">Smarter Value.</span>
            </>
          }
          description="Explore refurbished business laptops with transparent specifications and condition information."
          image="laptopBlack"
        >
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <Button to={`${paths.category('refurbished-laptops')}#catalogue`} size="lg" iconRight={<ArrowRight size={18} />}>
              Browse laptops
            </Button>
            <Button to={`${paths.category('refurbished-laptops')}#request-model`} size="lg" variant="ghost-dark">
              Request a specific model
            </Button>
          </div>
        </PageHero>
      ) : (
        <PageHero
          crumbs={crumbs}
          eyebrow={cat ? 'Product category' : 'Product catalogue'}
          title={cat ? cat.name : 'All Products'}
          description={
            cat
              ? cat.description
              : 'New and refurbished laptops, business hardware, accessories and infrastructure — sourced across multiple vendors. Pricing and availability are confirmed with each quotation.'
          }
          image={cat ? categoryMedia[cat.slug] : 'laptopHero'}
        >
          {isHeadsets && (
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <Button to={`${paths.category('headsets-audio-solutions')}#catalogue`} size="lg" iconRight={<ArrowRight size={18} />}>
                Browse headsets
              </Button>
              <Button to={headsetQuoteHref} size="lg" variant="ghost-dark">
                Request a Quote
              </Button>
            </div>
          )}
        </PageHero>
      )}

      {isRefurb && <RefurbExplainer />}
      {cat?.slug === 'apple-products' && (
        <section className="container-x pt-12 sm:pt-16" aria-label="Apple for business">
          <AppleBand headingLevel="h2" />
        </section>
      )}

      {isHeadsets && (
        <>
          <HeadsetsHomeSection eyebrow="Solutions by workplace" />
          <PolyCollection />
        </>
      )}

      <section id="catalogue" className="container-x scroll-mt-24 py-10 sm:py-14">
        <Catalogue
          products={list}
          hideCategory={!!cat}
          facetOrder={
            isRefurb
              ? ['condition', 'grade', 'brand', 'processor', 'ram', 'storage', 'display', 'use', 'subcategory']
              : isHeadsets
                ? ['subcategory', 'brand', 'connectivity', 'workplace']
                : undefined
          }
        />
      </section>

      {isHeadsets && (
        <>
          <HeadsetBrands />
          <HeadsetB2BSection />
          <HeadsetQuoteSection />
        </>
      )}

      {isRefurb && <RequestModelSection />}
    </>
  )
}

const disclosures = [
  { icon: Cpu, t: 'Processor, RAM & SSD', d: 'Exact configuration of the unit you receive.' },
  { icon: Monitor, t: 'Screen & operating system', d: 'Display size, resolution and OS licence status.' },
  { icon: BatteryMedium, t: 'Battery condition', d: 'Measured capacity or cycle count, when available.' },
  { icon: Sparkles, t: 'Cosmetic condition', d: 'A grade plus notes on marks, scuffs or wear.' },
  { icon: CircleAlert, t: 'Known defects', d: 'Every known limitation listed — never hidden.' },
  { icon: ClipboardCheck, t: 'Inspection status', d: 'Only tests actually performed are stated.' },
  { icon: ShieldCheck, t: 'Warranty', d: 'Duration and coverage only once confirmed.' },
  { icon: Package, t: 'Included accessories', d: 'Charger and anything else in the box.' },
]

function RefurbExplainer() {
  return (
    <section className="relative border-b border-teal-100 bg-gradient-to-b from-[#eef8fb] to-white">
      <div className="container-x flex flex-col gap-12 py-14 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-14">
          <Reveal className="flex flex-col gap-4">
            <span className="eyebrow text-teal-700">Condition, spelled out</span>
            <h2 className="text-3xl leading-tight font-bold tracking-[-0.03em] sm:text-4xl">What every listing tells you</h2>
            <p className="leading-relaxed text-muted">
              Refurbished and used laptops can be excellent value — when you know exactly what you’re buying. Each unit’s listing covers the
              points on the right. Anything not yet confirmed is marked “To be confirmed for this unit”.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-teal-100 bg-white p-4">
                <p className="font-bold text-teal-800">Refurbished</p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-muted">{conditionDescription.refurbished}</p>
              </div>
              <div className="rounded-2xl border border-line bg-white p-4">
                <p className="font-bold">Used</p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-muted">{conditionDescription.used}</p>
              </div>
            </div>
          </Reveal>
          <RevealGroup className="grid gap-3 sm:grid-cols-2">
            {disclosures.map(({ icon: Icon, t, d }) => (
              <RevealItem key={t}>
                <div className="flex h-full items-start gap-3 rounded-2xl border border-teal-100 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgb(6_182_204/0.6)]">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-accent to-emerald-500 text-white">
                    <Icon size={18} aria-hidden />
                  </span>
                  <span>
                    <span className="block font-bold">{t}</span>
                    <span className="text-[13px] leading-relaxed text-muted">{d}</span>
                  </span>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
        <Reveal>
          <div className="grid gap-3 rounded-3xl border border-teal-100 bg-white p-5 sm:grid-cols-2 lg:grid-cols-4">
            {gradeOrder.map((g) => (
              <div key={g} className="flex items-start gap-3 p-2">
                <GradeBadge grade={g} />
                <span className="text-[13px] leading-relaxed text-slate-600">{gradeInfo[g].description}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[13px] text-muted">
            Grades are assigned only after inspection of the specific unit. We never call a product “certified refurbished” without a verifiable basis.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

function RequestModelSection() {
  return (
    <section id="request-model" className="scroll-mt-24 border-t border-teal-100 bg-gradient-to-b from-white to-[#eef8fb] py-16 lg:py-24">
      <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
        <div className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start">
          <span className="eyebrow text-teal-700">Request a specific model</span>
          <h2 className="text-3xl leading-tight font-bold tracking-[-0.03em] sm:text-4xl">Looking for a particular laptop?</h2>
          <p className="leading-relaxed text-muted">
            Tell us the model or the specification you need. We’ll check our vendor network and come back with units that match — with their
            condition details — and a price.
          </p>
          <div className="relative mx-auto hidden aspect-[4/3] w-full max-w-md lg:block" aria-hidden>
            <div className="absolute inset-[15%] rounded-full bg-teal-accent/25 blur-3xl" />
            <SmartImage k="laptopSilver" alt="" className="relative w-full animate-float" />
          </div>
        </div>
        <div className="rounded-3xl border border-teal-100 bg-white p-5 shadow-[0_30px_60px_-40px_rgb(6_182_204/0.6)] sm:p-8">
          <RequestModelForm />
        </div>
      </div>
    </section>
  )
}
