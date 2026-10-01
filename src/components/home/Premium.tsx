import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'motion/react'
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  Building2,
  Cable,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Cloud,
  FileSearch,
  GraduationCap,
  Handshake,
  Headphones,
  Headset,
  HeartPulse,
  Laptop,
  Layers,
  LifeBuoy,
  MapPin,
  MessageSquareText,
  MonitorSmartphone,
  Network,
  PackageCheck,
  Presentation,
  Printer,
  Recycle,
  Repeat,
  Rocket,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
  Workflow,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import type { MediaKey } from '../../data/media'
import { paths } from '../../data/routes'
import { cn } from '../../lib/cn'
import { CircuitLines, NetworkMesh } from '../brand/Decor'
import { Button } from '../ui/Button'
import { Reveal, RevealGroup, RevealItem } from '../ui/Reveal'
import { SmartImage } from '../ui/SmartImage'

const cat = paths.category
const H2 = 'text-[32px] leading-[1.06] font-extrabold tracking-[-0.035em] sm:text-[44px]'

function Heading({ eyebrow, title, text, id, center, dark }: { eyebrow: string; title: React.ReactNode; text?: string; id: string; center?: boolean; dark?: boolean }) {
  return (
    <Reveal className={cn('flex max-w-2xl flex-col gap-4', center && 'mx-auto items-center text-center')}>
      <span className={cn('eyebrow', dark && 'text-cyan-accent')}>{eyebrow}</span>
      <h2 id={id} className={cn(H2, dark ? 'text-white' : 'text-ink')}>
        {title}
      </h2>
      {text && <p className={cn('text-[16.5px] leading-relaxed', dark ? 'text-on-dark' : 'text-muted')}>{text}</p>}
    </Reveal>
  )
}

/* ─── 1. Value strip (non-numerical — no unverified figures) ─────────────── */

const values: { icon: LucideIcon; t: string; d: string }[] = [
  { icon: Layers, t: 'End-to-End', d: 'Source, deploy and support' },
  { icon: MapPin, t: 'Pan-India*', d: 'Procurement & support coverage' },
  { icon: Boxes, t: 'Multi-Brand', d: 'Compare leading vendors' },
  { icon: BadgeCheck, t: 'Business-Ready', d: 'GST-ready itemised quotations' },
]

export function ValueStrip() {
  return (
    <section className="relative border-b border-line bg-white" aria-label="Why work with us">
      <div className="container-x">
        <RevealGroup className="grid grid-cols-2 divide-line lg:grid-cols-4 lg:divide-x">
          {values.map(({ icon: Icon, t, d }) => (
            <RevealItem key={t}>
              <div className="flex items-center gap-3.5 py-6 lg:justify-center lg:px-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon size={20} aria-hidden />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="text-[18px] leading-tight font-extrabold tracking-[-0.02em] text-ink sm:text-[20px]">{t}</span>
                  <span className="text-[12.5px] text-muted sm:text-[13px]">{d}</span>
                </span>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
        <p className="pb-3 text-[11px] text-subtle">* Subject to location and service availability.</p>
      </div>
    </section>
  )
}

/* ─── 2. One partner — interactive ecosystem ─────────────────────────────── */

const ecosystem: { t: string; items: string; icon: LucideIcon; to: string; imgs: [MediaKey, MediaKey] }[] = [
  { t: 'IT Hardware', items: 'Laptops • Desktops • Workstations • Mac • Tablets', icon: Laptop, to: paths.products, imgs: ['laptopSilver', 'desktopTower'] },
  { t: 'IT Accessories', items: 'Monitors • Docking Stations • Keyboards • Mice • Adapters', icon: MonitorSmartphone, to: cat('it-accessories'), imgs: ['monitor', 'dock'] },
  { t: 'Networking', items: 'Switches • Routers • Wi-Fi • Structured Networking', icon: Network, to: cat('networking'), imgs: ['switch', 'accessPoint'] },
  { t: 'Cybersecurity', items: 'Endpoint Security • DLP • Antivirus • XDR', icon: ShieldCheck, to: paths.service('cybersecurity-dlp'), imgs: ['firewall', 'laptopBlack'] },
  { t: 'Cloud & Productivity', items: 'Microsoft 365 • Cloud • Backup • Collaboration', icon: Cloud, to: paths.microsoft, imgs: ['laptopGrey', 'tablet'] },
  { t: 'Workplace Technology', items: 'Printers • Digital Signage • Smart Displays • Meeting Rooms', icon: Printer, to: paths.av, imgs: ['printer', 'signage'] },
  { t: 'Communication', items: 'Poly • Jabra • Logitech • Conference Audio • Call Centre', icon: Headset, to: cat('headsets-audio-solutions'), imgs: ['headsetStereo', 'speakerphone'] },
  { t: 'IT Support', items: 'AMC • Deployment • Troubleshooting • Asset Management • Onsite', icon: Wrench, to: paths.services, imgs: ['laptopPorts', 'server'] },
]

export function OnePartnerSection() {
  return (
    <section id="solutions" className="relative scroll-mt-20 overflow-hidden bg-[var(--background-primary)] py-20 lg:py-28" aria-labelledby="partner-heading">
      <CircuitLines tone="light" className="opacity-40 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_60%)]" />
      <div className="container-x relative flex flex-col gap-12">
        <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
          <Heading
            id="partner-heading"
            eyebrow="Everything your business needs"
            title={
              <>
                One Partner. <span className="text-gradient-brand">Complete Technology Solutions.</span>
              </>
            }
            text="From a single laptop requirement to a complete IT infrastructure project, we connect businesses with the right technology, products and services."
          />
          <Reveal delay={0.06}>
            <Button to={paths.quote} variant="secondary" iconRight={<ArrowRight size={16} />}>
              Discuss a requirement
            </Button>
          </Reveal>
        </div>
        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ecosystem.map(({ t, items, icon: Icon, to, imgs }) => (
            <RevealItem key={t} className="h-full">
              <Link
                to={to}
                className="group relative flex h-full min-h-[236px] flex-col overflow-hidden rounded-[18px] border border-line bg-white p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-[0_24px_50px_-24px_rgb(12_93_174/0.45)] motion-reduce:hover:translate-y-0"
              >
                <span className="absolute inset-0 bg-[radial-gradient(120%_80%_at_100%_100%,rgb(10_123_193/0.10),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden />
                <span className="relative flex size-12 items-center justify-center rounded-2xl bg-[image:var(--gradient-primary)] text-white shadow-[0_10px_24px_-10px_rgb(12_93_174/0.7)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 motion-reduce:transform-none">
                  <Icon size={22} aria-hidden />
                </span>
                <h3 className="relative mt-5 text-[18px] font-bold text-ink">{t}</h3>
                <p className="relative mt-1.5 max-w-[26ch] text-[13.5px] leading-relaxed text-muted">{items}</p>
                <span className="relative mt-auto flex items-end justify-between pt-4">
                  <span className="inline-flex items-center gap-1.5 text-[13.5px] font-bold text-brand-600">
                    Explore <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                  </span>
                  {/* Related products slide in on hover */}
                  <span className="flex translate-y-1 items-end gap-1 opacity-45 grayscale-[35%] transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-hover:grayscale-0 max-lg:opacity-100 max-lg:grayscale-0" aria-hidden>
                    {imgs.map((k) => (
                      <SmartImage key={k} k={k} alt="" sizes="72px" className="w-16 drop-shadow-[0_10px_12px_rgb(11_18_32/0.18)]" />
                    ))}
                  </span>
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

/* ─── 3. Communication (headsets) ────────────────────────────────────────── */

const comms: { t: string; d: string; k: MediaKey; to: string }[] = [
  { t: 'Call Centre Headsets', d: 'Professional headsets for customer support and contact centre environments.', k: 'headsetMono', to: `${cat('headsets-audio-solutions')}?subcategory=Call%20Centre%20Headsets#catalogue` },
  { t: 'USB‑A & USB‑C Headsets', d: 'Wired business headsets for laptops, desktops and softphone users.', k: 'headsetStereo', to: `${cat('headsets-audio-solutions')}?subcategory=USB%20Headsets#catalogue` },
  { t: 'Wireless Headsets', d: 'Bluetooth and wireless solutions for hybrid workplaces.', k: 'headsetWireless', to: `${cat('headsets-audio-solutions')}?subcategory=Wireless%20Bluetooth%20Headsets#catalogue` },
  { t: 'Meeting Room Audio', d: 'Conference speakerphones, microphones and collaboration audio.', k: 'speakerphone', to: `${cat('headsets-audio-solutions')}?subcategory=Meeting%20Room%20Audio#catalogue` },
]
const commBrands = ['Poly / HP Poly', 'Jabra', 'Logitech', 'Yealink', 'EPOS']

export function CommunicationSection() {
  const [active, setActive] = useState(0)
  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-28" aria-labelledby="comms-heading">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
        <div className="flex flex-col gap-8">
          <Heading
            id="comms-heading"
            eyebrow="Headsets & communication"
            title={
              <>
                Professional <span className="text-gradient-brand">Communication Solutions</span>
              </>
            }
            text="Clear communication for call centres, corporate teams and modern meeting rooms."
          />
          <ul className="flex flex-col gap-2" role="list">
            {comms.map((c, i) => (
              <li key={c.t}>
                <Link
                  to={c.to}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className={cn(
                    'group flex items-start gap-4 rounded-2xl border p-4 transition-all duration-300',
                    active === i ? 'border-brand-200 bg-[var(--background-primary)] shadow-[var(--shadow-card)]' : 'border-transparent hover:bg-[var(--background-primary)]',
                  )}
                >
                  <span className={cn('mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors', active === i ? 'bg-[image:var(--gradient-primary)] text-white' : 'bg-brand-50 text-brand-600')}>
                    <Headphones size={18} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16.5px] font-bold text-ink">{c.t}</span>
                    <span className="text-[13.5px] leading-relaxed text-muted">{c.d}</span>
                  </span>
                  <ArrowRight size={17} className={cn('mt-1 shrink-0 text-brand-600 transition-all', active === i ? 'translate-x-0 opacity-100' : '-translate-x-1 opacity-0')} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <ul className="flex flex-wrap gap-2" aria-label="Brands we source">
              {commBrands.map((b) => (
                <li key={b} className="rounded-full border border-line px-3 py-1 text-[12.5px] font-semibold text-slate-700">
                  {b}
                </li>
              ))}
            </ul>
            <Button to={cat('headsets-audio-solutions')} iconRight={<ArrowRight size={16} />} className="shrink-0">
              Explore Headsets
            </Button>
          </div>
        </div>
        <Reveal delay={0.08}>
          <div className="relative overflow-hidden rounded-[24px] border border-line bg-[radial-gradient(70%_70%_at_50%_45%,rgb(10_123_193/0.14),transparent_70%),linear-gradient(180deg,#ffffff,#eef4fb)] shadow-[var(--shadow-card)]">
            <div className="dot-bg absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" aria-hidden />
            <div className="relative aspect-[4/3.2]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 0.96, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.02, y: -6 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <SmartImage k={comms[active].k} alt={`${comms[active].t} (representative render)`} sizes="(min-width: 1024px) 45vw, 90vw" className="w-[86%] drop-shadow-[0_28px_30px_rgb(11_18_32/0.22)]" />
                </motion.div>
              </AnimatePresence>
              <span className="absolute top-5 left-5 rounded-full border border-line bg-white/85 px-3 py-1 text-[12px] font-bold text-brand-700 backdrop-blur">{comms[active].t}</span>
              <span className="absolute bottom-4 left-5 text-[10.5px] text-subtle">Representative render — models and compatibility confirmed per SKU</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ─── 4. Why businesses choose us ────────────────────────────────────────── */

const benefits: { icon: LucideIcon; t: string; d: string }[] = [
  { icon: Handshake, t: 'One Procurement Partner', d: 'Source multiple technology categories through one partner and one point of contact.' },
  { icon: Building2, t: 'Enterprise-Ready Solutions', d: 'Solutions designed around your business requirements, policies and locations.' },
  { icon: Boxes, t: 'Multi-Brand Expertise', d: 'Compare products and technologies across leading brands before you decide.' },
  { icon: MapPin, t: 'Pan-India Support', d: 'Procurement and deployment support across locations, subject to service availability.' },
  { icon: Repeat, t: 'Flexible Procurement', d: 'New, refurbished and project-based IT requirements — one device or a full rollout.' },
  { icon: LifeBuoy, t: 'End-to-End Support', d: 'From requirement identification to deployment and ongoing support.' },
]

export function PartnerSection() {
  return (
    <section className="relative bg-[var(--background-primary)] py-20 lg:py-28" aria-labelledby="why-heading">
      <div className="container-x flex flex-col gap-12">
        <Heading
          id="why-heading"
          center
          eyebrow="Why businesses choose us"
          title={
            <>
              More Than a Supplier. <span className="text-gradient-brand">Your Technology Partner.</span>
            </>
          }
        />
        <RevealGroup className="grid gap-px overflow-hidden rounded-[20px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map(({ icon: Icon, t, d }, i) => (
            <RevealItem key={t} className="h-full">
              <div className="group relative flex h-full flex-col gap-4 bg-white p-7 transition-colors duration-300 hover:bg-[#fbfdff] sm:p-8">
                <span className="absolute top-6 right-7 text-[12px] font-bold tracking-[0.1em] text-slate-300">0{i + 1}</span>
                <span className="flex size-12 items-center justify-center rounded-2xl border border-brand-100 bg-brand-50 text-brand-600 transition-all duration-300 group-hover:border-transparent group-hover:bg-[image:var(--gradient-primary)] group-hover:text-white">
                  <Icon size={22} aria-hidden />
                </span>
                <h3 className="text-[18px] font-bold text-ink">{t}</h3>
                <p className="text-[14px] leading-relaxed text-muted">{d}</p>
                <span className="absolute inset-x-8 bottom-0 h-[3px] origin-left scale-x-0 rounded-full bg-[image:var(--gradient-primary)] transition-transform duration-500 group-hover:scale-x-100" aria-hidden />
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

/* ─── 5. From requirement to deployment ──────────────────────────────────── */

const steps: { icon: LucideIcon; t: string; d: string }[] = [
  { icon: MessageSquareText, t: 'Tell Us What You Need', d: 'Share quantities, specifications, locations and timelines.' },
  { icon: FileSearch, t: 'Requirement Analysis', d: 'We clarify usage, compatibility and budget with your team.' },
  { icon: ClipboardCheck, t: 'Product & Solution Selection', d: 'Recommended options across brands, new or refurbished.' },
  { icon: ClipboardList, t: 'Quotation & Procurement', d: 'Itemised, GST-ready quotation and order coordination.' },
  { icon: Truck, t: 'Delivery & Deployment', d: 'Delivery, installation and configuration where required.' },
  { icon: LifeBuoy, t: 'Ongoing Support', d: 'Troubleshooting, AMC and warranty coordination.' },
]

export function JourneySection() {
  const ref = useRef<HTMLOListElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 55%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-28" aria-labelledby="journey-heading">
      <div className="container-x flex flex-col gap-14">
        <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
          <Heading
            id="journey-heading"
            eyebrow="Procurement experience"
            title={
              <>
                From Requirement <span className="text-gradient-brand">to Deployment</span>
              </>
            }
            text="A clear, accountable process — whether you need five laptops or a multi-site rollout."
          />
          <Reveal delay={0.06}>
            <Button to={paths.corporate} variant="secondary" iconRight={<ArrowRight size={16} />}>
              Start a requirement
            </Button>
          </Reveal>
        </div>
        <ol ref={ref} className="relative grid gap-8 lg:grid-cols-6 lg:gap-5">
          {/* track + animated progress (horizontal on desktop, vertical on mobile) */}
          <span className="absolute top-6 right-[8%] left-[8%] hidden h-[2px] rounded-full bg-line lg:block" aria-hidden />
          <motion.span
            style={{ scaleX: reduce ? 1 : progress }}
            className="absolute top-6 right-[8%] left-[8%] hidden h-[2px] origin-left rounded-full bg-[image:var(--gradient-primary)] lg:block"
            aria-hidden
          />
          <span className="absolute top-2 bottom-2 left-6 w-[2px] rounded-full bg-line lg:hidden" aria-hidden />
          <motion.span
            style={{ scaleY: reduce ? 1 : progress }}
            className="absolute top-2 bottom-2 left-6 w-[2px] origin-top rounded-full bg-[image:var(--gradient-primary)] lg:hidden"
            aria-hidden
          />
          {steps.map(({ icon: Icon, t, d }, i) => (
            <motion.li
              key={t}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -60px 0px' }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex gap-5 lg:flex-col lg:items-center lg:gap-4 lg:text-center"
            >
              <span className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-2xl border border-brand-100 bg-white text-brand-600 shadow-[0_10px_24px_-14px_rgb(12_93_174/0.6)]">
                <Icon size={21} aria-hidden />
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-[12px] font-bold tracking-[0.14em] text-brand-600">0{i + 1}</span>
                <span className="text-[16px] leading-snug font-bold text-ink">{t}</span>
                <span className="text-[13.5px] leading-relaxed text-muted">{d}</span>
              </span>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ─── 6. Secure. Connected. Productive. (dark) ──────────────────────────── */

const pillarsData: { t: string; icon: LucideIcon; items: string[]; to: string; cta: string }[] = [
  { t: 'Secure', icon: ShieldCheck, items: ['Endpoint Security', 'DLP', 'Antivirus', 'XDR'], to: paths.service('cybersecurity-dlp'), cta: 'Cybersecurity & DLP' },
  { t: 'Connected', icon: Network, items: ['Networking', 'Wi-Fi', 'Infrastructure', 'Cloud'], to: paths.service('network-setup'), cta: 'Networking & infrastructure' },
  { t: 'Productive', icon: Rocket, items: ['Microsoft 365', 'Collaboration', 'Meeting Rooms', 'Workplace Technology'], to: paths.microsoft, cta: 'Microsoft 365 & workplace' },
]

export function SecureSection() {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-hero py-20 text-white lg:py-28" aria-labelledby="secure-heading">
      <NetworkMesh className="opacity-70 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(700px_380px_at_50%_0%,rgb(10_123_193/0.30),transparent_70%)]" aria-hidden />
      <div className="container-x flex flex-col gap-14">
        <Heading
          id="secure-heading"
          dark
          center
          eyebrow="Security & infrastructure"
          title={
            <>
              Secure. Connected. <span className="text-gradient">Productive.</span>
            </>
          }
          text="Protect data and devices, keep every site connected, and give teams the tools to work together — planned and supported as one environment."
        />
        <RevealGroup className="grid gap-5 lg:grid-cols-3">
          {pillarsData.map(({ t, icon: Icon, items, to, cta }, i) => (
            <RevealItem key={t} className="h-full">
              <Link
                to={to}
                className="group relative flex h-full flex-col gap-6 overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.04] p-7 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-cyan-accent/40 hover:bg-white/[0.07] sm:p-8 motion-reduce:hover:translate-y-0"
              >
                <span className="absolute -top-16 -right-16 size-48 rounded-full bg-cyan-accent/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100 sm:opacity-60" aria-hidden />
                <div className="flex items-center justify-between">
                  <span className="relative flex size-14 items-center justify-center rounded-2xl border border-cyan-accent/30 bg-navy-900/70 text-cyan-accent">
                    <span className="absolute inset-0 animate-ring rounded-2xl border border-cyan-accent/25" style={{ animationDelay: `${i * 0.6}s` }} />
                    <Icon size={26} aria-hidden />
                  </span>
                  <span className="text-[12px] font-bold tracking-[0.14em] text-slate-500">0{i + 1}</span>
                </div>
                <h3 className="text-[28px] font-extrabold tracking-[-0.03em]">{t}</h3>
                <ul className="flex flex-col gap-2.5">
                  {items.map((x) => (
                    <li key={x} className="flex items-center gap-2.5 text-[15px] text-slate-200">
                      <CheckCircle2 size={16} className="shrink-0 text-cyan-accent" aria-hidden />
                      {x}
                    </li>
                  ))}
                </ul>
                <span className="mt-auto inline-flex items-center gap-1.5 border-t border-white/10 pt-5 text-[14px] font-bold text-cyan-accent">
                  {cta} <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

/* ─── 7. IT procurement, simplified ──────────────────────────────────────── */

const procureItems: { t: string; icon: LucideIcon; to: string }[] = [
  { t: 'Hardware Procurement', icon: Laptop, to: paths.products },
  { t: 'Software & Licensing', icon: Cloud, to: paths.service('software-licensing') },
  { t: 'IT Accessories', icon: Cable, to: cat('it-accessories') },
  { t: 'Networking', icon: Network, to: cat('networking') },
  { t: 'Cybersecurity', icon: ShieldCheck, to: paths.service('cybersecurity-dlp') },
  { t: 'Workplace Technology', icon: Printer, to: paths.av },
  { t: 'Meeting Room Solutions', icon: Presentation, to: paths.av },
  { t: 'AMC & Support', icon: Wrench, to: paths.service('it-amc') },
]

export function ProcurementSimplified() {
  return (
    <section className="relative bg-[var(--background-primary)] py-20 lg:py-28" aria-labelledby="procure-heading">
      <div className="container-x">
        <div className="grid overflow-hidden rounded-[24px] border border-line bg-white shadow-[var(--shadow-card)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="on-dark relative isolate flex flex-col gap-6 overflow-hidden bg-hero p-8 text-white sm:p-12">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(520px_320px_at_0%_0%,rgb(10_123_193/0.4),transparent_70%)]" aria-hidden />
            <CircuitLines className="opacity-30" />
            <span className="eyebrow text-cyan-accent">For procurement teams</span>
            <h2 id="procure-heading" className="text-[32px] leading-[1.06] font-extrabold tracking-[-0.035em] sm:text-[42px]">
              Your IT Procurement, <span className="text-gradient">Simplified.</span>
            </h2>
            <p className="text-[16px] leading-relaxed text-on-dark">
              Consolidate hardware, software, security and services into one itemised, GST-ready quotation — with delivery coordinated across your
              locations.
            </p>
            <ul className="flex flex-col gap-2 text-[14.5px] text-slate-200">
              {['One requirement, one quotation', 'Multi-brand options side by side', 'Multi-site delivery coordination*'].map((x) => (
                <li key={x} className="flex items-center gap-2.5">
                  <PackageCheck size={16} className="text-cyan-accent" aria-hidden /> {x}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-col gap-3 pt-2 sm:flex-row">
              <Button to={paths.corporate} size="lg" iconRight={<ArrowRight size={18} />} className="shadow-[0_0_44px_-8px_rgb(2_198_220/0.7)]">
                Submit Your Requirement
              </Button>
            </div>
            <p className="text-[11.5px] text-slate-400">* Subject to location and service availability.</p>
          </div>
          <RevealGroup className="grid grid-cols-2 gap-3 p-5 sm:p-8 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-2">
            {procureItems.map(({ t, icon: Icon, to }) => (
              <RevealItem key={t} className="h-full">
                <Link
                  to={to}
                  className="group flex h-full flex-col gap-3 rounded-2xl border border-line bg-[var(--background-primary)] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:bg-white hover:shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:p-5"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm transition-colors group-hover:bg-brand-600 group-hover:text-white">
                    <Icon size={19} aria-hidden />
                  </span>
                  <span className="flex-1 text-[14.5px] leading-snug font-bold text-ink">{t}</span>
                  <ArrowRight size={16} className="hidden text-brand-600 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 sm:block" aria-hidden />
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  )
}

/* ─── 8. New & refurbished ──────────────────────────────────────────────── */

export function NewRefurbSection() {
  const panels = [
    {
      tag: 'New IT Equipment',
      icon: Sparkles,
      title: 'Latest business technology',
      chips: ['Manufacturer-new', 'Leading brands', 'Sourced to specification'],
      items: ['Business laptops', 'Desktops', 'Mac', 'Monitors', 'Printers', 'Accessories'],
      k: 'laptopSilver' as MediaKey,
      cta: 'Explore New Products',
      to: `${paths.products}?condition=new`,
      tone: 'bg-[radial-gradient(80%_70%_at_70%_40%,rgb(10_123_193/0.16),transparent_70%),linear-gradient(180deg,#ffffff,#eef4fb)]',
      note: 'Manufacturer-new stock sourced to specification.',
    },
    {
      tag: 'Refurbished IT Equipment',
      icon: Recycle,
      title: 'Business-ready value',
      chips: ['Cost-effective', 'Business-ready', 'Inspected & graded per unit'],
      items: ['Business laptops', 'Corporate desktops', 'Monitors', 'Apple devices', 'IT accessories'],
      k: 'laptopBlack' as MediaKey,
      cta: 'Explore Refurbished Products',
      to: cat('refurbished-laptops'),
      tone: 'bg-[radial-gradient(80%_70%_at_70%_40%,rgb(2_198_220/0.16),transparent_70%),linear-gradient(180deg,#ffffff,#ecf7fa)]',
      note: 'Each unit’s condition grade, battery and known defects are listed before you buy.',
    },
  ]
  return (
    <section className="relative bg-white py-20 lg:py-28" aria-labelledby="nr-heading">
      <div className="container-x flex flex-col gap-12">
        <Heading
          id="nr-heading"
          center
          eyebrow="Flexible procurement"
          title={
            <>
              New & <span className="text-gradient-brand">Refurbished Technology</span>
            </>
          }
          text="Choose the right technology for your business requirements and budget."
        />
        <RevealGroup className="grid gap-6 lg:grid-cols-2">
          {panels.map(({ tag, icon: Icon, title, chips, items, k, cta, to, tone, note }) => (
            <RevealItem key={tag} className="h-full">
              <div className={cn('group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-line shadow-[var(--shadow-card)]', tone)}>
                <div className="relative grid gap-6 p-7 sm:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] sm:p-9">
                  <div className="flex flex-col gap-4">
                    <span className="inline-flex items-center gap-2 self-start rounded-full bg-white px-3 py-1 text-[11.5px] font-bold tracking-[0.12em] text-brand-700 uppercase shadow-sm">
                      <Icon size={14} aria-hidden /> {tag}
                    </span>
                    <h3 className="text-[24px] leading-snug font-extrabold tracking-[-0.025em] text-ink">{title}</h3>
                    <ul className="flex flex-wrap gap-1.5" aria-label="Highlights">
                      {chips.map((c) => (
                        <li key={c} className="rounded-md bg-white/80 px-2 py-1 text-[11.5px] font-bold text-brand-700 ring-1 ring-brand-100">
                          {c}
                        </li>
                      ))}
                    </ul>
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                      {items.map((x) => (
                        <li key={x} className="flex items-center gap-2 text-[14px] whitespace-nowrap text-slate-700">
                          <CheckCircle2 size={15} className="shrink-0 text-brand-600" aria-hidden />
                          {x}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-[18%] rounded-full bg-brand-300/30 blur-3xl" aria-hidden />
                    <SmartImage k={k} alt="" sizes="(min-width: 1024px) 22vw, 60vw" className="relative w-full transition-transform duration-700 group-hover:scale-[1.05] motion-reduce:transform-none" />
                  </div>
                </div>
                <div className="mt-auto flex flex-col gap-3 border-t border-line/80 bg-white/70 px-7 py-5 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-9">
                  <p className="text-[12.5px] text-muted">{note}</p>
                  <Button to={to} size="sm" iconRight={<ArrowRight size={15} />} className="shrink-0">
                    {cta}
                  </Button>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

/* ─── 9. Solutions for every business environment (tabs) ───────────────── */

const envs: { t: string; icon: LucideIcon; d: string; points: { label: string; to: string }[]; k: MediaKey }[] = [
  {
    t: 'Corporate',
    icon: Building2,
    d: 'Enterprise IT infrastructure and workplace technology for offices of every size.',
    points: [
      { label: 'Business laptops & desktops', to: cat('new-laptops') },
      { label: 'Meeting rooms & AV', to: paths.av },
      { label: 'Microsoft 365 & security', to: paths.microsoft },
    ],
    k: 'laptopHero',
  },
  {
    t: 'Healthcare',
    icon: HeartPulse,
    d: 'Secure IT hardware, networking and workplace solutions for clinics, hospitals and help desks.',
    points: [
      { label: 'Endpoint security & DLP', to: paths.service('cybersecurity-dlp') },
      { label: 'Networking & Wi-Fi', to: paths.service('network-setup') },
      { label: 'Help-desk headsets', to: cat('headsets-audio-solutions') },
    ],
    k: 'allInOne',
  },
  {
    t: 'Call Centres',
    icon: Headset,
    d: 'Headsets, workstations, networking and support for contact-centre floors.',
    points: [
      { label: 'Call centre headsets', to: `${cat('headsets-audio-solutions')}?subcategory=Call%20Centre%20Headsets#catalogue` },
      { label: 'Agent desktops', to: cat('desktops-workstations') },
      { label: 'Network setup & support', to: paths.service('network-setup') },
    ],
    k: 'headsetWorkstation',
  },
  {
    t: 'Education',
    icon: GraduationCap,
    d: 'Computing devices, displays and classroom technology for schools, colleges and training centres.',
    points: [
      { label: 'Laptops & tablets', to: cat('new-laptops') },
      { label: 'Interactive displays', to: paths.av },
      { label: 'Refurbished devices', to: cat('refurbished-laptops') },
    ],
    k: 'conference',
  },
  {
    t: 'Small & Medium Business',
    icon: Store,
    d: 'Affordable, end-to-end IT procurement and support — without a large in-house IT team.',
    points: [
      { label: 'Refurbished laptops', to: cat('refurbished-laptops') },
      { label: 'IT AMC & support', to: paths.service('it-amc') },
      { label: 'Cloud & licensing', to: paths.service('software-licensing') },
    ],
    k: 'laptopSilver',
  },
  {
    t: 'Enterprise',
    icon: Workflow,
    d: 'Multi-location procurement and technology deployment, coordinated through one partner.',
    points: [
      { label: 'Corporate procurement', to: paths.corporate },
      { label: 'Servers & storage', to: cat('servers-storage') },
      { label: 'Digital signage', to: `${paths.av}?cat=signage` },
    ],
    k: 'server',
  },
]

export function EnvironmentsSection() {
  const [tab, setTab] = useState(0)
  const id = useId()
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (!dir) return
    e.preventDefault()
    const next = (tab + dir + envs.length) % envs.length
    setTab(next)
    refs.current[next]?.focus()
  }
  const env = envs[tab]
  return (
    <section id="environments" className="relative scroll-mt-20 bg-[var(--background-primary)] py-20 lg:py-28" aria-labelledby="env-heading">
      <div className="container-x flex flex-col gap-10">
        <Heading
          id="env-heading"
          eyebrow="Industries"
          title={
            <>
              Solutions for Every <span className="text-gradient-brand">Business Environment</span>
            </>
          }
        />
        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          <div role="tablist" aria-label="Business environments" aria-orientation="vertical" onKeyDown={onKey} className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
            {envs.map(({ t, icon: Icon }, i) => (
              <button
                key={t}
                ref={(el) => {
                  refs.current[i] = el
                }}
                role="tab"
                id={`${id}-tab-${i}`}
                aria-selected={tab === i}
                aria-controls={`${id}-panel`}
                tabIndex={tab === i ? 0 : -1}
                onClick={() => setTab(i)}
                className={cn(
                  'flex shrink-0 items-center gap-3 rounded-2xl border px-4 py-3 text-left text-[14.5px] font-bold whitespace-nowrap transition-all duration-300 lg:py-4',
                  tab === i ? 'border-brand-600 bg-white text-brand-700 shadow-[var(--shadow-card)]' : 'border-transparent text-slate-600 hover:bg-white/70 hover:text-ink',
                )}
              >
                <span className={cn('flex size-9 items-center justify-center rounded-xl transition-colors', tab === i ? 'bg-[image:var(--gradient-primary)] text-white' : 'bg-white text-brand-600')}>
                  <Icon size={17} aria-hidden />
                </span>
                {t}
              </button>
            ))}
          </div>
          <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${tab}`} className="relative overflow-hidden rounded-[24px] border border-line bg-white shadow-[var(--shadow-card)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="grid items-center gap-6 p-7 sm:p-10 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]"
              >
                <div className="flex flex-col gap-5">
                  <h3 className="text-[26px] leading-tight font-extrabold tracking-[-0.03em] text-ink sm:text-[30px]">{env.t}</h3>
                  <p className="text-[15.5px] leading-relaxed text-muted">{env.d}</p>
                  <ul className="flex flex-col gap-2">
                    {env.points.map((pt) => (
                      <li key={pt.label}>
                        <Link to={pt.to} className="group inline-flex items-center gap-2 text-[15px] font-semibold text-ink hover:text-brand-700">
                          <CheckCircle2 size={17} className="text-brand-600" aria-hidden />
                          {pt.label}
                          <ArrowRight size={14} className="opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Button to={`${paths.quote}?type=${encodeURIComponent('Bulk Procurement')}`} variant="secondary" size="sm" iconRight={<ArrowRight size={15} />} className="self-start">
                    Discuss your {env.t.toLowerCase()} requirement
                  </Button>
                </div>
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-[16%] rounded-full bg-brand-200/40 blur-3xl" aria-hidden />
                  <SmartImage k={env.k} alt="" sizes="(min-width: 1024px) 30vw, 80vw" className="relative w-full max-w-[420px] drop-shadow-[0_24px_28px_rgb(11_18_32/0.2)]" />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── 10. Final CTA (dark) ──────────────────────────────────────────────── */

export function RequirementCta() {
  return (
    <section className="bg-[var(--background-primary)] pb-20 lg:pb-24" aria-labelledby="req-cta-heading">
      <div className="container-x">
        <Reveal>
          <div className="on-dark relative isolate overflow-hidden rounded-[28px] bg-hero p-8 text-white shadow-[0_40px_90px_-40px_rgb(12_93_174/0.6)] sm:p-14 lg:p-16">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(600px_360px_at_85%_20%,rgb(10_123_193/0.45),transparent_70%),radial-gradient(500px_300px_at_10%_100%,rgb(2_198_220/0.18),transparent_70%)]" aria-hidden />
            <NetworkMesh className="opacity-50 [mask-image:linear-gradient(to_left,black,transparent_70%)]" />
            <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
              <div className="flex max-w-2xl flex-col gap-5">
                <span className="eyebrow text-cyan-accent">Let’s talk</span>
                <h2 id="req-cta-heading" className="text-[34px] leading-[1.05] font-extrabold tracking-[-0.04em] sm:text-[52px]">
                  Have an IT <span className="text-gradient">Requirement?</span>
                </h2>
                <p className="text-[16.5px] leading-relaxed text-on-dark">
                  Tell us what your business needs. We’ll help you identify the right products, solutions and procurement options.
                </p>
              </div>
              <div className="flex w-full flex-col gap-3">
                <Button to={paths.quote} size="lg" iconRight={<ArrowRight size={18} />}>
                  Request a Quote
                </Button>
                <Button to={paths.contact} variant="ghost-dark" size="lg">
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
