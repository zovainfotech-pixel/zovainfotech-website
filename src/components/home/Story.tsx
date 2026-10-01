import {
  ArrowRight,
  Cloud,
  CloudCog,
  FileLock2,
  Fingerprint,
  HardDrive,
  Headset,
  Info,
  Laptop,
  MonitorPlay,
  Network,
  PackageCheck,
  ShieldCheck,
  Smartphone,
  UserCheck,
  Video,
  type LucideIcon,
} from 'lucide-react'
import { useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { signageUseCases } from '../../data/avProducts'
import type { MediaKey } from '../../data/media'
import { productBySlug } from '../../data/products'
import { paths } from '../../data/routes'
import { cn } from '../../lib/cn'
import { LogoMark } from '../brand/Logo'
import { ProductCard } from '../product/ProductCard'
import { Button } from '../ui/Button'
import { Reveal, RevealGroup, RevealItem } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import { SmartImage } from '../ui/SmartImage'
import { AppleBand } from './AppleShowcase'
import { MicrosoftVisual, SignageVisual } from './TechSolutions'

/** Glass frame whose children shift slightly with the pointer (reads --px/--py). */
export function ParallaxFrame({ children, className, tone = 'dark' }: { children: ReactNode; className?: string; tone?: 'dark' | 'light' }) {
  const ref = useRef<HTMLDivElement>(null)
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = ref.current!.getBoundingClientRect()
    ref.current!.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3))
    ref.current!.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3))
  }
  return (
    <div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={() => {
        ref.current?.style.setProperty('--px', '0')
        ref.current?.style.setProperty('--py', '0')
      }}
      className={cn(
        'group relative overflow-hidden rounded-[20px] border',
        tone === 'dark'
          ? 'border-white/10 bg-white/[0.04] shadow-[0_40px_90px_-50px_rgb(2_198_220/0.5)] backdrop-blur-sm'
          : 'border-line bg-[radial-gradient(70%_70%_at_60%_40%,rgb(10_123_193/0.14),transparent_70%),linear-gradient(180deg,#ffffff,#eef4fb)] shadow-[var(--shadow-card)]',
        className,
      )}
      aria-hidden
    >
      {children}
      <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-sweep bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
    </div>
  )
}

function DarkSection({ id, labelledBy, children, className }: { id?: string; labelledBy: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn('on-dark relative isolate scroll-mt-16 overflow-hidden bg-hero py-20 text-white lg:py-28', className)}>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(700px_420px_at_10%_0%,rgb(12_93_174/0.28),transparent_70%),radial-gradient(640px_420px_at_95%_100%,rgb(2_198_220/0.10),transparent_70%)]" aria-hidden />
      <div className="grid-bg absolute inset-0 -z-10 opacity-35 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" aria-hidden />
      {children}
    </section>
  )
}

function LightSection({ id, labelledBy, children, className }: { id?: string; labelledBy: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn('relative isolate scroll-mt-16 overflow-hidden bg-[var(--background-primary)] py-20 lg:py-28', className)}>
      <div className="absolute top-0 right-[-10%] -z-10 size-[560px] rounded-full bg-[radial-gradient(circle,rgb(10_123_193/0.10),transparent_65%)]" aria-hidden />
      {children}
    </section>
  )
}

/* ——— 3. Digital signage ——— */

const signageSolutions = [
  'Commercial & professional displays',
  'Indoor & outdoor signage',
  'Interactive displays & kiosks',
  'Video wall controllers',
  'Media players',
  'Content management & scheduling',
  'Installation & configuration',
  'Maintenance & AMC',
]

const signageTiles: { t: string; d: string; k: MediaKey }[] = [
  { t: 'LED displays & video walls', d: 'Lobbies, control rooms, experience centres', k: 'videoWall' },
  { t: 'Digital menu boards', d: 'Cafeterias, QSRs and food courts', k: 'menuBoard' },
  { t: 'Interactive kiosks', d: 'Wayfinding, check-in, self-service', k: 'kiosk' },
  { t: 'Media players & CMS', d: 'Scheduled content across every screen', k: 'mediaPlayer' },
]

export function SignageSection() {
  const to = `${paths.av}?cat=signage`
  return (
    <LightSection id="digital-signage" labelledBy="sig-heading">
      <div className="container-x flex flex-col gap-12">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <Reveal className="flex min-w-0 flex-col gap-6">
            <span className="eyebrow">Digital signage solutions</span>
            <h2 id="sig-heading" className="text-[32px] leading-[1.08] font-extrabold tracking-[-0.035em] text-ink sm:text-[44px]">
              Screens that inform, sell and <span className="text-gradient-brand">welcome.</span>
            </h2>
            <p className="max-w-xl text-[16.5px] leading-relaxed text-muted">
              Commercial displays, LED video walls, menu boards and kiosks — with players and content scheduling — supplied, installed and
              maintained as one project.
            </p>
            <ul className="grid gap-x-5 gap-y-2 sm:grid-cols-2" aria-label="Signage solutions">
              {signageSolutions.map((u) => (
                <li key={u} className="flex items-center gap-2 text-[14px] font-semibold text-ink">
                  <span className="size-1.5 rounded-full bg-[image:var(--gradient-primary)]" aria-hidden />
                  {u}
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button to={to} size="lg" iconRight={<ArrowRight size={18} />}>
                Explore Digital Signage
              </Button>
              <Button to={`${paths.quote}?type=IT%20Services&model=${encodeURIComponent('Digital signage solution')}`} size="lg" variant="secondary">
                Request a Quote
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <ParallaxFrame tone="light" className="h-[300px] sm:h-[420px]">
              <SignageVisual />
            </ParallaxFrame>
          </Reveal>
        </div>
        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {signageTiles.map((s) => (
            <RevealItem key={s.t} className="flex">
              <Link
                to={to}
                className="group flex w-full flex-col overflow-hidden rounded-[18px] border border-line bg-white shadow-[var(--shadow-card)] transition duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:border-brand-300 hover:shadow-[var(--shadow-card-hover)] motion-reduce:hover:transform-none"
              >
                <span className="relative m-2 flex aspect-[16/10] items-center justify-center overflow-hidden rounded-[12px] bg-[radial-gradient(80%_80%_at_50%_100%,rgb(10_123_193/0.12),transparent_70%),linear-gradient(180deg,#f7f9fc,#edf2f8)]">
                  <SmartImage k={s.k} alt="" sizes="(min-width: 1024px) 22vw, 45vw" className="w-[82%] transition-transform duration-500 group-hover:scale-[1.05]" />
                  <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 group-hover:translate-x-[320%]" />
                </span>
                <span className="flex flex-col gap-1 px-4 pt-1 pb-4">
                  <span className="font-bold text-ink group-hover:text-brand-700">{s.t}</span>
                  <span className="text-[13px] text-muted">{s.d}</span>
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-[13px] text-muted">
            Where it helps: {signageUseCases.join(' · ')}
          </p>
          <p className="text-[12px] text-subtle">Representative renders. Makes, models and sizes are proposed for each site.</p>
        </div>
      </div>
    </LightSection>
  )
}

/* ——— 5. Laptops & MacBooks ——— */

const laptopPicks = ['dell-latitude-5450', 'apple-macbook-air-13-m3', 'apple-iphone-18-pro', 'apple-airpods-5']
const laptopPaths: { t: string; to: string; icon: LucideIcon }[] = [
  { t: 'New business laptops', to: paths.category('new-laptops'), icon: Laptop },
  { t: 'MacBook, iPhone & Apple', to: paths.category('apple-products'), icon: Laptop },
  { t: 'Refurbished laptops', to: paths.category('refurbished-laptops'), icon: PackageCheck },
  { t: 'Docks, monitors & accessories', to: paths.category('it-accessories'), icon: HardDrive },
]

export function LaptopSection() {
  const picks = laptopPicks.map((s) => productBySlug.get(s)).filter((p) => !!p)
  return (
    <section id="laptops" className="relative scroll-mt-16 overflow-hidden bg-white py-20 lg:py-28" aria-labelledby="lap-heading">
      <div className="absolute -top-40 right-[-10%] -z-0 size-[520px] rounded-full bg-brand-200/40 blur-[120px]" aria-hidden />
      <div className="container-x relative flex flex-col gap-10">
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Laptop, MacBook & Apple solutions"
            title={<span id="lap-heading">Business computing, sourced to your specification.</span>}
            description="New and refurbished laptops, MacBooks, iPhones, AirPods, monitors, docks and accessories — from single units to company-wide rollouts."
          />
          <Button to={paths.products} className="shrink-0" iconRight={<ArrowRight size={17} />}>
            Explore IT Hardware
          </Button>
        </Reveal>
        <RevealGroup className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {laptopPaths.map(({ t, to, icon: Icon }) => (
            <RevealItem key={t} className="flex">
              <Link
                to={to}
                className="group flex w-full items-center gap-3 rounded-2xl border border-line bg-white p-3.5 text-[14px] font-bold transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-[var(--shadow-card-hover)] sm:p-4"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-white">
                  <Icon size={18} aria-hidden />
                </span>
                <span className="flex-1 leading-snug group-hover:text-brand-700">{t}</span>
                <ArrowRight size={16} className="hidden text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-600 sm:block" aria-hidden />
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
        <AppleBand />
        <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {picks.map((p) => (
            <RevealItem key={p.slug} className="flex min-w-0">
              <ProductCard product={p} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

/* ——— 6. Microsoft & DLP ——— */

const msCaps: { t: string; icon: LucideIcon }[] = [
  { t: 'Microsoft 365 licensing & renewals', icon: Cloud },
  { t: 'Microsoft Intune device management', icon: Smartphone },
  { t: 'Microsoft Entra ID identity & access', icon: UserCheck },
  { t: 'Microsoft Defender protection', icon: ShieldCheck },
  { t: 'Purview Information Protection & labels', icon: Fingerprint },
  { t: 'Data Loss Prevention, incl. Endpoint DLP', icon: FileLock2 },
  { t: 'Endpoint security & policy management', icon: ShieldCheck },
  { t: 'IT compliance & audit readiness', icon: FileLock2 },
]

export function MicrosoftSection() {
  return (
    <DarkSection id="microsoft-dlp" labelledBy="msdlp-heading">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Reveal className="order-2 lg:order-1">
          <ParallaxFrame className="h-[320px] sm:h-[420px]">
            <MicrosoftVisual />
          </ParallaxFrame>
        </Reveal>
        <Reveal delay={0.1} className="order-1 flex min-w-0 flex-col gap-6 lg:order-2">
          <span className="eyebrow text-cyan-accent">Cybersecurity & DLP</span>
          <h2 id="msdlp-heading" className="text-[32px] leading-[1.08] font-extrabold tracking-[-0.035em] sm:text-[44px]">
            Microsoft Solutions & <span className="text-gradient">Data Security</span>
          </h2>
          <p className="text-[16.5px] leading-relaxed text-on-dark">
            Microsoft licensing, endpoint security and data protection — planned together so your people can share and collaborate without putting
            sensitive information at risk.
          </p>
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {msCaps.map(({ t, icon: Icon }) => (
              <li key={t} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-[13.5px] font-semibold text-slate-100">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-cyan-accent/15 text-cyan-accent">
                  <Icon size={16} aria-hidden />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <p className="flex items-start gap-2 text-[12.5px] leading-relaxed text-slate-400">
            <Info size={15} className="mt-0.5 shrink-0" aria-hidden />
            Feature availability depends on your Microsoft 365 plan and add-ons; we confirm requirements before quoting.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button to={paths.microsoft} size="lg" iconRight={<ArrowRight size={18} />}>
              Explore Security Solutions
            </Button>
            <Button to={paths.service('cybersecurity-dlp')} size="lg" variant="ghost-dark">
              Cybersecurity & DLP services
            </Button>
          </div>
        </Reveal>
      </div>
    </DarkSection>
  )
}

/* ——— Technology ecosystem hub ——— */

const nodes: { t: string; d: string; to: string; icon: LucideIcon }[] = [
  { t: 'IT Hardware', d: 'Laptops, MacBooks, desktops, monitors, printers and accessories.', to: paths.products, icon: Laptop },
  { t: 'Networking', d: 'Switches, Wi-Fi, firewalls and structured networking.', to: paths.service('network-setup'), icon: Network },
  { t: 'Cloud', d: 'Microsoft 365 and cloud productivity, set up and migrated.', to: paths.service('software-licensing'), icon: CloudCog },
  { t: 'Microsoft', d: 'Microsoft 365 licensing, Intune, Entra ID and Defender.', to: paths.microsoft, icon: Cloud },
  { t: 'Cybersecurity', d: 'Endpoint protection, firewalls and security policies.', to: paths.service('cybersecurity-dlp'), icon: ShieldCheck },
  { t: 'DLP', d: 'Microsoft Purview DLP and sensitivity labels to protect data.', to: `${paths.microsoft}#security`, icon: FileLock2 },
  { t: 'Audio & Video', d: 'Boardrooms, video conferencing, audio and room control.', to: paths.av, icon: Video },
  { t: 'Digital Signage', d: 'Displays, LED walls, kiosks and content scheduling.', to: `${paths.av}?cat=signage`, icon: MonitorPlay },
  { t: 'IT Procurement', d: 'New and refurbished assets, bulk and multi-vendor sourcing.', to: paths.corporate, icon: PackageCheck },
  { t: 'IT Support', d: 'Installation, AMC, on-site and remote support.', to: paths.service('it-amc'), icon: Headset },
]

const pos = nodes.map((_, i) => {
  const a = (-90 + (360 / nodes.length) * i) * (Math.PI / 180)
  return { x: 50 + 41 * Math.cos(a), y: 50 + 40 * Math.sin(a) }
})

export function EcosystemHub() {
  const [active, setActive] = useState<number | null>(null)
  const cur = active === null ? null : nodes[active]
  return (
    <LightSection labelledBy="hub-heading">
      <div className="container-x flex flex-col gap-12">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Complete IT ecosystem"
            title={<span id="hub-heading">Everything your business runs on, connected.</span>}
            description="One partner across hardware, AV, signage, Microsoft, security, networking, procurement and support — so every piece works with the rest."
          />
        </Reveal>

        {/* Desktop: interactive hub */}
        <Reveal className="relative mx-auto hidden aspect-[16/9] w-full max-w-5xl lg:block">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            <defs>
              <linearGradient id="hub-line" x1="0" x2="1">
                <stop offset="0" stopColor="#0a7bc1" />
                <stop offset="1" stopColor="#02c6dc" />
              </linearGradient>
            </defs>
            {pos.map((p, i) => (
              <line
                key={i}
                x1="50"
                y1="50"
                x2={p.x}
                y2={p.y}
                vectorEffect="non-scaling-stroke"
                stroke={active === i ? 'url(#hub-line)' : 'rgb(12 93 174 / 0.22)'}
                strokeWidth={active === i ? 2.5 : 1.2}
                strokeDasharray="4 6"
                className={cn('transition-all duration-300', active === i ? '[animation-duration:1.6s]' : '', 'animate-dash')}
              />
            ))}
          </svg>

          {/* Centre */}
          <div className="absolute top-1/2 left-1/2 flex w-[260px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3 text-center">
            <div className="relative flex size-28 items-center justify-center rounded-full border border-line bg-white shadow-[0_18px_50px_-12px_rgb(12_93_174/0.35)]">
              <span className="absolute inset-0 animate-ring rounded-full border border-cyan-accent/40" aria-hidden />
              <span className="absolute inset-[-3px] rounded-full bg-[image:var(--gradient-primary)] opacity-60 [mask:radial-gradient(farthest-side,transparent_calc(100%-2px),black_calc(100%-1px))]" aria-hidden />
              <LogoMark size={54} />
            </div>
            <span className="text-[11.5px] font-bold tracking-[0.16em] text-brand-700 uppercase">Your business</span>
            <div className="min-h-[72px] rounded-xl border border-line bg-[var(--background-primary)] px-4 py-3 text-[13px] leading-snug text-muted" aria-live="polite">
              {cur ? (
                <>
                  <span className="block font-bold text-ink">{cur.t}</span>
                  {cur.d}
                </>
              ) : (
                'Hover or focus a solution to see how it connects.'
              )}
            </div>
          </div>

          {nodes.map((n, i) => {
            const Icon = n.icon
            const on = active === i
            return (
              <Link
                key={n.t}
                to={n.to}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                style={{ left: `${pos[i].x}%`, top: `${pos[i].y}%` }}
                className={cn(
                  'absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2.5 rounded-2xl border px-3.5 py-2.5 text-[14px] font-bold whitespace-nowrap backdrop-blur-md transition-all duration-300',
                  on
                    ? 'scale-105 border-brand-400 bg-white text-brand-700 shadow-[0_14px_36px_-12px_rgb(12_93_174/0.45)]'
                    : 'border-line bg-white text-ink shadow-[var(--shadow-card)] hover:text-brand-700',
                  active !== null && !on && 'opacity-60',
                )}
              >
                <span className={cn('flex size-8 items-center justify-center rounded-lg transition-colors', on ? 'bg-[image:var(--gradient-primary)] text-white' : 'bg-brand-50 text-brand-600')}>
                  <Icon size={16} aria-hidden />
                </span>
                {n.t}
              </Link>
            )
          })}
        </Reveal>

        {/* Mobile & tablet: list */}
        <RevealGroup className="grid gap-3 sm:grid-cols-2 lg:hidden">
          {nodes.map(({ t, d, to, icon: Icon }) => (
            <RevealItem key={t} className="flex">
              <Link to={to} className="flex w-full items-start gap-3 rounded-2xl border border-line bg-white p-4 shadow-[var(--shadow-card)] transition hover:border-brand-300">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-white">
                  <Icon size={18} aria-hidden />
                </span>
                <span>
                  <span className="block font-bold text-ink">{t}</span>
                  <span className="text-[13.5px] leading-relaxed text-muted">{d}</span>
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </LightSection>
  )
}

