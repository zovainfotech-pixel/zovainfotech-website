import {
  ArrowRight,
  BadgeCheck,
  Headphones,
  Laptop,
  Lock,
  MapPin,
  Network,
  Recycle,
  ShieldCheck,
  Smartphone,
  TrendingDown,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import type { MediaKey } from '../../data/media'
import { paths } from '../../data/routes'
import { CircuitLines, NetworkMesh } from '../brand/Decor'
import { Button } from '../ui/Button'
import { Reveal, RevealGroup, RevealItem } from '../ui/Reveal'
import { SmartImage } from '../ui/SmartImage'

const cat = paths.category
const cyber = paths.service('cybersecurity-dlp')

/* ─── Quick service strip (directly under the hero) ─────────────────────── */

const strip: { t: string; to: string; icon: LucideIcon }[] = [
  { t: 'IT Hardware', to: cat('new-laptops'), icon: Laptop },
  { t: 'Refurbished Laptops', to: cat('refurbished-laptops'), icon: Recycle },
  { t: 'Apple Solutions', to: cat('apple-products'), icon: Smartphone },
  { t: 'IT Accessories', to: cat('it-accessories'), icon: Headphones },
  { t: 'Cybersecurity', to: cyber, icon: ShieldCheck },
  { t: 'DLP Solutions', to: cyber, icon: Lock },
  { t: 'Networking', to: cat('networking'), icon: Network },
  { t: 'AMC & Support', to: paths.service('it-amc'), icon: Wrench },
]

export function ServiceStrip() {
  return (
    <nav className="on-dark relative bg-[#0b1220]" aria-label="Quick links to our services">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-accent/60 to-transparent" aria-hidden />
      <ul className="container-x flex snap-x gap-1 overflow-x-auto py-2 [scrollbar-width:none] lg:justify-between [&::-webkit-scrollbar]:hidden">
        {strip.map(({ t, to, icon: Icon }, i) => (
          <li key={t} className="flex shrink-0 snap-start items-center">
            {i > 0 && <span className="mr-1 hidden h-5 w-px bg-white/10 lg:block" aria-hidden />}
            <Link to={to} className="group flex h-12 items-center gap-2 rounded-lg px-3 text-[13.5px] font-semibold whitespace-nowrap text-slate-200 transition-colors hover:bg-white/[0.06] hover:text-white">
              <Icon size={16} className="text-cyan-accent transition-transform group-hover:scale-110" aria-hidden />
              {t}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/* ─── Business value ────────────────────────────────────────────────────── */

const values: { t: string; d: string; icon: LucideIcon }[] = [
  { t: 'Genuine Products', d: 'Business-grade hardware from leading brands.', icon: BadgeCheck },
  { t: 'Competitive Procurement', d: 'Smart sourcing and competitive commercial pricing.', icon: TrendingDown },
  { t: 'Enterprise Security', d: 'Endpoint security, antivirus, DLP and data protection solutions.', icon: ShieldCheck },
  { t: 'Pan-India Support', d: 'Procurement, deployment and IT support across India.*', icon: MapPin },
]

export function BusinessValue() {
  return (
    <section className="relative bg-white py-16 lg:py-24" aria-labelledby="value-heading">
      <div className="container-x grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <Reveal className="flex flex-col gap-4">
          <span className="eyebrow">Why ZOVA INFOTECH</span>
          <h2 id="value-heading" className="text-[32px] leading-[1.06] font-extrabold tracking-[-0.035em] text-ink sm:text-[42px]">
            One Partner. <span className="text-gradient-brand">Complete Technology Solutions.</span>
          </h2>
          <p className="text-[16.5px] leading-relaxed text-muted">
            We help businesses source, deploy, secure and manage their IT infrastructure with reliable hardware, Apple devices, accessories,
            cybersecurity and enterprise IT solutions.
          </p>
          <p className="text-[11.5px] text-subtle">* Subject to location and service availability.</p>
        </Reveal>
        <RevealGroup className="grid gap-4 sm:grid-cols-2">
          {values.map(({ t, d, icon: Icon }) => (
            <RevealItem key={t} className="h-full">
              <div className="group relative flex h-full gap-4 overflow-hidden rounded-2xl border border-line bg-[var(--background-primary)] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:bg-white hover:shadow-[var(--shadow-card)] motion-reduce:hover:translate-y-0">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-white shadow-[0_10px_22px_-10px_rgb(8_120_232/0.8)]">
                  <Icon size={20} aria-hidden />
                </span>
                <span>
                  <span className="block text-[16px] font-bold text-ink">{t}</span>
                  <span className="mt-1 block text-[13.5px] leading-relaxed text-muted">{d}</span>
                </span>
                <span className="absolute inset-x-5 bottom-0 h-[3px] origin-left scale-x-0 rounded-full bg-[image:var(--gradient-primary)] transition-transform duration-500 group-hover:scale-x-100" aria-hidden />
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

/* ─── Everything your business needs in IT ──────────────────────────────── */

const categories: { t: string; items: string[]; k: MediaKey; to: string; icon: LucideIcon }[] = [
  { t: 'New Laptops', items: ['Dell', 'HP', 'Lenovo', 'ASUS', 'Acer'], k: 'laptopSilver', to: cat('new-laptops'), icon: Laptop },
  { t: 'Refurbished Laptops', items: ['Dell Latitude', 'HP EliteBook', 'Lenovo ThinkPad'], k: 'laptopBlack', to: cat('refurbished-laptops'), icon: Recycle },
  { t: 'Apple Products', items: ['MacBook', 'iPhone', 'iPad', 'AirPods', 'Accessories'], k: 'smartphones', to: cat('apple-products'), icon: Smartphone },
  { t: 'IT Accessories', items: ['Poly Headsets', 'Monitors', 'Docking Stations', 'Keyboards', 'Mice', 'Webcams'], k: 'headsetStereo', to: cat('it-accessories'), icon: Headphones },
  { t: 'Cybersecurity', items: ['Antivirus', 'EDR', 'XDR', 'Endpoint Security'], k: 'firewall', to: cyber, icon: ShieldCheck },
  { t: 'DLP Solutions', items: ['Data Loss Prevention', 'USB Control', 'Email Security', 'Cloud DLP'], k: 'externalDrive', to: cyber, icon: Lock },
  { t: 'Networking', items: ['Switches', 'Wi-Fi', 'Routers', 'Firewalls'], k: 'switch', to: cat('networking'), icon: Network },
  { t: 'IT Support & AMC', items: ['Deployment', 'Installation', 'Maintenance', 'Support'], k: 'server', to: paths.service('it-amc'), icon: Wrench },
]

export function ITCategories() {
  return (
    <section id="solutions" className="relative scroll-mt-20 overflow-hidden bg-[var(--background-primary)] py-16 lg:py-24" aria-labelledby="itcat-heading">
      <CircuitLines tone="light" className="opacity-35 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_60%)]" />
      <div className="container-x relative flex flex-col gap-10">
        <Reveal className="flex max-w-2xl flex-col gap-3">
          <span className="eyebrow">Products & solutions</span>
          <h2 id="itcat-heading" className="text-[32px] leading-[1.06] font-extrabold tracking-[-0.035em] text-ink sm:text-[44px]">
            Everything Your Business <span className="text-gradient-brand">Needs in IT</span>
          </h2>
        </Reveal>
        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map(({ t, items, k, to, icon: Icon }) => (
            <RevealItem key={t} className="h-full">
              <Link
                to={to}
                className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-line bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-[0_26px_50px_-26px_rgb(8_120_232/0.5)] motion-reduce:hover:translate-y-0"
              >
                <span className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-[radial-gradient(70%_70%_at_50%_60%,rgb(8_120_232/0.14),transparent_70%),linear-gradient(180deg,#ffffff,#eef4fb)]">
                  <span className="dot-bg absolute inset-0 opacity-50" aria-hidden />
                  <SmartImage k={k} alt="" sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw" className="relative w-[70%] drop-shadow-[0_18px_22px_rgb(11_18_32/0.2)] transition-transform duration-700 ease-out group-hover:-translate-y-1 group-hover:scale-[1.07] motion-reduce:transform-none" />
                  <span className="absolute top-3 left-3 flex size-9 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-white shadow-md transition-transform duration-300 group-hover:-rotate-6">
                    <Icon size={17} aria-hidden />
                  </span>
                </span>
                <span className="flex flex-1 flex-col gap-2 p-5">
                  <span className="text-[17px] font-bold text-ink">{t}</span>
                  <span className="text-[13px] leading-relaxed text-muted">{items.join(' | ')}</span>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[13.5px] font-bold text-brand-600">
                    Explore <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                  </span>
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
        <p className="text-[11.5px] text-subtle">Images are original representative renders. Brand names identify products we can source and do not imply partnership.</p>
      </div>
    </section>
  )
}

/* ─── CTA closing the first major section ───────────────────────────────── */

export function SolutionCta() {
  return (
    <section className="bg-[var(--background-primary)] pb-16 lg:pb-24" aria-labelledby="solution-cta-heading">
      <div className="container-x">
        <Reveal>
          <div className="on-dark relative isolate overflow-hidden rounded-[28px] bg-[#0b1220] p-8 text-white shadow-[0_40px_90px_-40px_rgb(8_120_232/0.6)] sm:p-12 lg:p-14">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(600px_340px_at_90%_10%,rgb(8_120_232/0.45),transparent_70%),radial-gradient(420px_280px_at_0%_100%,rgb(0_201_232/0.2),transparent_70%)]" aria-hidden />
            <NetworkMesh className="opacity-40 [mask-image:linear-gradient(to_left,black,transparent_75%)]" />
            <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
              <div className="flex flex-col gap-4">
                <h2 id="solution-cta-heading" className="text-[30px] leading-[1.08] font-extrabold tracking-[-0.035em] sm:text-[42px]">
                  Looking for the Right IT Solution <span className="text-gradient">for Your Business?</span>
                </h2>
                <p className="text-[16.5px] leading-relaxed text-on-dark">
                  Whether you need <strong className="text-white">1 laptop or complete IT infrastructure</strong>, our team can help you source the
                  right technology solution.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Button to={paths.quote} size="lg" iconRight={<ArrowRight size={18} />}>
                  Request a Quote
                </Button>
                <Button to={paths.contact} size="lg" variant="ghost-dark">
                  Talk to Our IT Team
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
