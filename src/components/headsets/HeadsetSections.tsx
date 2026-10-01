import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Cable,
  ClipboardList,
  GitCompareArrows,
  GraduationCap,
  Headset,
  HeartPulse,
  Home,
  Layers,
  Package,
  Presentation,
  ShieldCheck,
  Truck,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import type { MediaKey } from '../../data/media'
import { products } from '../../data/products'
import { paths } from '../../data/routes'
import { HeadsetQuoteForm } from '../forms/HeadsetQuoteForm'
import { Button } from '../ui/Button'
import { Reveal, RevealGroup, RevealItem } from '../ui/Reveal'
import { SmartImage } from '../ui/SmartImage'
import { AudioBadges } from './AudioBadges'
import { CompareToggle } from './Compare'

const CAT = 'headsets-audio-solutions'
const catHref = paths.category(CAT)
const subHref = (sub: string) => `${catHref}?subcategory=${encodeURIComponent(sub)}#catalogue`
export const headsetQuoteHref = `${catHref}#headset-quote`

/* ─── Homepage: "Professional Headsets for Every Workplace" ─────────────── */

const solutions: { title: string; text: string; sub: string; k: MediaKey; icon: LucideIcon; tags: string[] }[] = [
  {
    title: 'Call Centre Headsets',
    text: 'Lightweight mono and stereo headsets with noise-cancelling microphones for high-volume, all-day calling.',
    sub: 'Call Centre Headsets',
    k: 'headsetMono',
    icon: Headset,
    tags: ['Mono / stereo', 'NC microphone'],
  },
  {
    title: 'USB\u2011A & USB\u2011C Office Headsets',
    text: 'Plug-and-play corded headsets for desks and hot-desks, matched to the ports on your laptops and PCs.',
    sub: 'USB Headsets',
    k: 'headsetStereo',
    icon: Cable,
    tags: ['USB-A', 'USB-C'],
  },
  {
    title: 'Wireless Bluetooth Headsets',
    text: 'Freedom to move around the office, with USB Bluetooth adapters for PCs and optional charging stands.',
    sub: 'Wireless Bluetooth Headsets',
    k: 'headsetWireless',
    icon: Home,
    tags: ['Bluetooth', 'Hybrid work'],
  },
  {
    title: 'Conference Speakerphones & Meeting Room Audio',
    text: 'USB and Bluetooth speakerphones for huddle spaces, meeting rooms and shared desks.',
    sub: 'Meeting Room Audio',
    k: 'speakerphone',
    icon: Presentation,
    tags: ['USB', 'Bluetooth'],
  },
]

export function HeadsetsHomeSection({ headingLevel = 'h2', eyebrow = 'Headsets & meeting room audio' }: { headingLevel?: 'h2' | 'h3'; eyebrow?: string }) {
  const H = headingLevel
  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-24" aria-labelledby="headsets-heading">
      <div className="absolute -top-40 right-[-10%] size-[520px] rounded-full bg-brand-100/60 blur-[120px]" aria-hidden />
      <div className="container-x relative flex flex-col gap-10">
        <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
          <Reveal className="flex max-w-2xl flex-col gap-4">
            <span className="eyebrow">{eyebrow}</span>
            <H id="headsets-heading" className="text-[32px] leading-[1.08] font-extrabold tracking-[-0.035em] text-ink sm:text-[44px]">
              Professional Headsets for <span className="text-gradient-brand">Every Workplace</span>
            </H>
            <p className="text-[16.5px] leading-relaxed text-muted">
              From high-volume contact centres to executive meeting rooms, explore professional audio solutions designed for clear communication,
              comfortable daily use and productive collaboration.
            </p>
          </Reveal>
          <Reveal delay={0.06} className="flex flex-col gap-3 sm:flex-row">
            <Button to={catHref} iconRight={<ArrowRight size={17} />}>
              View all headsets
            </Button>
            <Button to={headsetQuoteHref} variant="secondary">
              Request a Quote
            </Button>
          </Reveal>
        </div>
        <RevealGroup className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {solutions.map(({ title, text, sub, k, icon: Icon, tags }) => (
            <RevealItem key={title} className="h-full">
              <article className="glow-border group flex h-full rounded-[var(--radius-card)] transition-transform duration-300 hover:-translate-y-1 motion-reduce:hover:translate-y-0">
                <div className="flex w-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white transition-shadow group-hover:border-transparent group-hover:shadow-[var(--shadow-card-hover)]">
                  <div className="bg-media relative flex aspect-[4/3] items-center justify-center overflow-hidden">
                    <div className="dot-bg absolute inset-0 opacity-60" aria-hidden />
                    <div className="absolute inset-x-[18%] bottom-[12%] h-[24%] rounded-[50%] bg-brand-300/30 blur-2xl" aria-hidden />
                    <SmartImage
                      k={k}
                      alt=""
                      sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 90vw"
                      className="relative w-[90%] transition-transform duration-700 ease-out group-hover:-translate-y-1 group-hover:scale-[1.06] motion-reduce:transform-none"
                    />
                    <span className="absolute top-3 left-3 flex size-9 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-white shadow-md">
                      <Icon size={17} aria-hidden />
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <h3 className="text-[17px] leading-snug font-bold text-ink">{title}</h3>
                    <p className="text-[13.5px] leading-relaxed text-muted">{text}</p>
                    <ul className="flex flex-wrap gap-1.5">
                      {tags.map((t) => (
                        <li key={t} className="rounded-md bg-brand-50 px-2 py-1 text-[11.5px] font-bold text-brand-700">
                          {t}
                        </li>
                      ))}
                    </ul>
                    <Link
                      to={subHref(sub)}
                      className="mt-auto inline-flex items-center gap-1.5 pt-1 text-[14px] font-bold text-brand-600 hover:text-brand-700"
                      aria-label={`Explore solutions: ${title}`}
                    >
                      Explore Solutions <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </Link>
                  </div>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
        <p className="text-[11.5px] text-subtle">Images are original representative 3D renders, not photographs of specific branded products.</p>
      </div>
    </section>
  )
}

/* ─── Featured collection: HP Poly ──────────────────────────────────────── */

export function PolyCollection() {
  const poly = products.filter((p) => p.category === CAT && p.brand === 'Poly')
  if (!poly.length) return null
  return (
    <section className="bg-[var(--background-primary)] py-16 lg:py-20" aria-labelledby="poly-heading">
      <div className="container-x flex flex-col gap-8">
        <Reveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="flex max-w-2xl flex-col gap-3">
            <span className="eyebrow">Featured collection</span>
            <h2 id="poly-heading" className="text-[28px] leading-[1.1] font-extrabold tracking-[-0.03em] text-ink sm:text-4xl">
              HP Poly Professional Headsets
            </h2>
            <p className="text-[15.5px] leading-relaxed text-muted">
              Blackwire corded, EncorePro contact-centre and Voyager wireless headsets, plus Poly Sync speakerphones — sourced to your exact SKU.
            </p>
          </div>
          <Button to={`${catHref}?brand=Poly#catalogue`} variant="secondary" iconRight={<ArrowRight size={16} />}>
            View all Poly
          </Button>
        </Reveal>
        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {poly.map((p) => (
            <RevealItem key={p.id} className="h-full">
              <div className="flex h-full flex-col gap-3 rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:border-brand-200">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold tracking-[0.1em] text-muted uppercase">{p.subcategory}</p>
                    <h3 className="mt-1 text-[16px] leading-snug font-bold">
                      <Link to={paths.product(p.slug)} className="hover:text-brand-600">
                        {p.name}
                      </Link>
                    </h3>
                  </div>
                  <SmartImage k={p.subcategory === 'Meeting Room Audio' ? 'speakerphone' : p.subcategory === 'Wireless Bluetooth Headsets' ? 'headsetWireless' : p.subcategory === 'Call Centre Headsets' ? 'headsetMono' : 'headsetStereo'} alt="" sizes="96px" className="w-20 shrink-0" />
                </div>
                <p className="text-[13.5px] leading-relaxed text-muted">{p.description}</p>
                {p.audio && <AudioBadges audio={p.audio} />}
                <div className="mt-auto grid grid-cols-2 gap-2 pt-1">
                  <Link to={paths.product(p.slug)} className="flex h-10 items-center justify-center rounded-xl border border-line text-[13px] font-bold hover:border-brand-400 hover:text-brand-700">
                    View Details
                  </Link>
                  <Link
                    to={`${catHref}?product=${encodeURIComponent(p.slug)}#headset-quote`}
                    className="flex h-10 items-center justify-center rounded-xl bg-brand-600 text-[13px] font-bold text-white hover:bg-brand-700"
                  >
                    Request a Quote
                  </Link>
                  <CompareToggle product={p} className="col-span-2" />
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

/* ─── Brands ────────────────────────────────────────────────────────────── */

const brandCards: { name: string; filter?: string; text: string }[] = [
  { name: 'Poly (HP Poly)', filter: 'Poly', text: 'Blackwire, EncorePro, Voyager and Sync ranges.' },
  { name: 'Jabra', filter: 'Jabra', text: 'Evolve2 office and Engage contact-centre ranges.' },
  { name: 'Logitech', filter: 'Logitech', text: 'Zone headsets for office and hybrid work.' },
  { name: 'EPOS', filter: 'EPOS', text: 'Office and contact-centre headsets — models on request.' },
  { name: 'Yealink', filter: 'Yealink', text: 'UH-series USB headsets with UC and Teams variants.' },
  { name: 'Cisco', filter: 'Cisco', text: 'Cisco headsets for Webex and other calling platforms.' },
  { name: 'Microsoft Teams–certified models', text: 'Available across several brands — certification is confirmed per exact SKU.' },
  { name: 'Other brands', text: 'Tell us the model you use today and we will source a match.' },
]

export function HeadsetBrands() {
  return (
    <section className="bg-white py-16 lg:py-20" aria-labelledby="hs-brands">
      <div className="container-x flex flex-col gap-8">
        <Reveal className="flex max-w-2xl flex-col gap-3">
          <span className="eyebrow">Brands we source</span>
          <h2 id="hs-brands" className="text-[28px] leading-[1.1] font-extrabold tracking-[-0.03em] text-ink sm:text-4xl">
            Leading headset and speakerphone brands
          </h2>
          <p className="text-[15.5px] leading-relaxed text-muted">
            Compatibility and platform certification differ between models and variants, so we confirm them for the exact SKU in your quotation.
          </p>
        </Reveal>
        <RevealGroup className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {brandCards.map((b) => (
            <RevealItem key={b.name} className="h-full">
              <Link
                to={b.filter ? `${catHref}?brand=${encodeURIComponent(b.filter)}#catalogue` : headsetQuoteHref}
                className="group flex h-full flex-col gap-1.5 rounded-2xl border border-line bg-[var(--background-primary)] p-5 transition hover:-translate-y-0.5 hover:border-brand-300 hover:bg-white"
              >
                <span className="text-[16px] font-bold text-ink group-hover:text-brand-700">{b.name}</span>
                <span className="text-[13px] leading-relaxed text-muted">{b.text}</span>
                <span className="mt-auto inline-flex items-center gap-1 pt-2 text-[12.5px] font-bold text-brand-600">
                  {b.filter ? 'View models' : 'Ask us'} <ArrowRight size={13} aria-hidden />
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
        <p className="text-[11.5px] text-subtle">
          Brand names are trademarks of their respective owners and are used only to identify products we can source. Zova Infotech does not claim
          partnership or authorised-reseller status with any brand unless stated in your quotation.
        </p>
      </div>
    </section>
  )
}

/* ─── B2B solutions (dark band) ─────────────────────────────────────────── */

const useCases: { t: string; icon: LucideIcon }[] = [
  { t: 'Call centres & BPO operations', icon: Headset },
  { t: 'Corporate IT departments', icon: Building2 },
  { t: 'Healthcare help desks', icon: HeartPulse },
  { t: 'Enterprise & hybrid teams', icon: Users },
  { t: 'Training & conference rooms', icon: GraduationCap },
  { t: 'Remote employees', icon: Home },
  { t: 'Bulk corporate deployment', icon: Layers },
]

const b2bServices: { t: string; d: string; icon: LucideIcon }[] = [
  { t: 'Bulk headset procurement', d: 'One quotation for every team, site and headset type.', icon: Package },
  { t: 'USB-A / USB-C consultation', d: 'Match connectors to the laptops and PCs you actually use.', icon: Cable },
  { t: 'Model comparison', d: 'Side-by-side options for mono, stereo, wired and wireless.', icon: GitCompareArrows },
  { t: 'Enterprise quotations', d: 'GST-compliant quotations with exact SKUs.', icon: ClipboardList },
  { t: 'Bulk delivery coordination', d: 'Staggered or multi-site delivery, subject to location.', icon: Truck },
  { t: 'Warranty & after-sales guidance', d: 'Manufacturer warranty and support terms, as agreed per order.', icon: ShieldCheck },
]

export function HeadsetB2BSection() {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-hero py-20 text-white lg:py-24" aria-labelledby="hs-b2b">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(700px_380px_at_15%_10%,rgb(10_123_193/0.28),transparent_70%),radial-gradient(600px_360px_at_90%_90%,rgb(2_198_220/0.14),transparent_70%)]" aria-hidden />
      <div className="container-x grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <Reveal className="flex flex-col gap-5">
          <span className="eyebrow text-cyan-accent">For business</span>
          <h2 id="hs-b2b" className="text-[30px] leading-[1.08] font-extrabold tracking-[-0.03em] sm:text-[40px]">
            Audio & Communication Solutions for <span className="text-gradient">Every Business</span>
          </h2>
          <p className="text-[16px] leading-relaxed text-on-dark">
            Standardise headsets across teams, equip meeting rooms and support remote staff — with the right connector, wearing style and platform
            variant for each user.
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {useCases.map(({ t, icon: Icon }) => (
              <li key={t} className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-[13.5px] font-semibold text-slate-100">
                <Icon size={16} className="shrink-0 text-cyan-accent" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button to={headsetQuoteHref} size="lg" iconRight={<ArrowRight size={18} />}>
              Request a Bulk Procurement Quote
            </Button>
          </div>
        </Reveal>
        <RevealGroup className="grid content-start gap-3 sm:grid-cols-2">
          {b2bServices.map(({ t, d, icon: Icon }) => (
            <RevealItem key={t} className="h-full">
              <div className="flex h-full items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur transition hover:border-cyan-accent/40 hover:bg-white/[0.08]">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-white">
                  <Icon size={18} aria-hidden />
                </span>
                <span>
                  <span className="block text-[15px] font-bold text-white">{t}</span>
                  <span className="text-[13px] leading-relaxed text-on-dark">{d}</span>
                </span>
              </div>
            </RevealItem>
          ))}
          <RevealItem className="sm:col-span-2">
            <p className="flex items-start gap-2 text-[12px] text-slate-400">
              <BadgeCheck size={14} className="mt-0.5 shrink-0" aria-hidden />
              Warranty, delivery and after-sales support are subject to the manufacturer’s terms and the agreement in your quotation.
            </p>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  )
}

/* ─── Quote form section ────────────────────────────────────────────────── */

export function HeadsetQuoteSection() {
  return (
    <section id="headset-quote" className="scroll-mt-24 bg-[var(--background-primary)] py-16 lg:py-24" aria-labelledby="hs-quote">
      <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
        <Reveal className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start">
          <span className="eyebrow">Request a quote</span>
          <h2 id="hs-quote" className="text-[28px] leading-[1.1] font-extrabold tracking-[-0.03em] text-ink sm:text-4xl">
            Tell us about your headset requirement
          </h2>
          <p className="text-[15.5px] leading-relaxed text-muted">
            Share the number of users, how they work and the ports on their devices. We’ll come back with suitable models and a written quotation.
          </p>
          <div className="relative mx-auto hidden aspect-[4/3] w-full max-w-md lg:block" aria-hidden>
            <div className="absolute inset-[15%] rounded-full bg-brand-300/30 blur-3xl" />
            <SmartImage k="headsetWorkstation" alt="" sizes="420px" className="relative w-full animate-float" />
          </div>
        </Reveal>
        <div className="rounded-3xl border border-line bg-white p-5 shadow-[var(--shadow-card)] sm:p-8">
          <HeadsetQuoteForm />
        </div>
      </div>
    </section>
  )
}
