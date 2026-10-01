import { ArrowRight, Cloud, FileLock2, KeyRound, Laptop, MonitorSmartphone, ShieldCheck, User } from 'lucide-react'
import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { MediaKey } from '../../data/media'
import { paths } from '../../data/routes'
import { cn } from '../../lib/cn'
import { LogoMark } from '../brand/Logo'
import { Reveal, RevealGroup, RevealItem } from '../ui/Reveal'
import { SmartImage } from '../ui/SmartImage'

interface Solution {
  n: string
  id: string
  title: string
  text: string
  cta: string
  to: string
  tags: string[]
  /** Tailwind gradient stops for this practice's accent. */
  accent: string
  glow: string
  /** Literal hover classes (Tailwind must see full class names). */
  ctaHover: string
  Visual: () => ReactNode
  credit?: string
}

const solutions: Solution[] = [
  {
    n: '01',
    id: 'signage',
    title: 'Digital Signage Solutions',
    text: 'Transform spaces with professional digital displays, LED video walls, interactive kiosks and centralised content solutions.',
    cta: 'Explore Digital Signage',
    to: `${paths.av}?cat=signage`,
    tags: ['LED video walls', 'Menu boards', 'Kiosks', 'Content scheduling'],
    accent: 'from-orange-accent via-crimson-accent to-purple-accent',
    ctaHover: 'group-hover:from-orange-accent group-hover:via-crimson-accent group-hover:to-purple-accent',
    glow: 'rgb(2 198 220 / 0.55)',
    Visual: SignageVisual,
  },
  {
    n: '02',
    id: 'boardroom',
    title: 'Boardroom Audio & Video Solutions',
    text: 'Complete meeting-room and collaboration solutions designed for modern boardrooms, conference rooms and hybrid workplaces.',
    cta: 'Explore AV Solutions',
    to: paths.av,
    tags: ['Video conferencing', 'Cameras', 'Speakerphones', 'Ceiling audio'],
    accent: 'from-brand-600 via-brand-500 to-cyan-accent',
    ctaHover: 'group-hover:from-brand-600 group-hover:via-brand-500 group-hover:to-cyan-accent',
    glow: 'rgb(12 93 174 / 0.6)',
    Visual: BoardroomVisual,
    credit: 'Featuring PeopleLink products',
  },
  {
    n: '03',
    id: 'laptops',
    title: 'Laptop & MacBook Solutions',
    text: 'New and refurbished laptops, MacBooks, accessories and complete business computing solutions tailored to your requirements.',
    cta: 'Explore IT Hardware',
    to: paths.products,
    tags: ['Business laptops', 'MacBooks', 'Refurbished', 'Docks & monitors'],
    accent: 'from-violet-accent via-purple-accent to-brand-500',
    ctaHover: 'group-hover:from-violet-accent group-hover:via-purple-accent group-hover:to-brand-500',
    glow: 'rgb(16 165 230 / 0.6)',
    Visual: LaptopVisual,
  },
  {
    n: '04',
    id: 'microsoft',
    title: 'Microsoft Licensing & DLP Security',
    text: 'Microsoft 365 licensing, data protection, compliance and DLP solutions to help organisations manage productivity and protect sensitive information.',
    cta: 'Explore Security Solutions',
    to: paths.microsoft,
    tags: ['Microsoft 365', 'Microsoft Purview', 'Endpoint DLP', 'Intune'],
    accent: 'from-teal-accent via-cyan-accent to-brand-500',
    ctaHover: 'group-hover:from-teal-accent group-hover:via-cyan-accent group-hover:to-brand-500',
    glow: 'rgb(6 182 204 / 0.55)',
    Visual: MicrosoftVisual,
  },
]

/** Four connected practice cards, shown directly below the hero. */
export function TechSolutionsSection() {
  return (
    <section id="solutions" aria-labelledby="solutions-heading" className="relative isolate scroll-mt-16 overflow-hidden bg-[var(--background-primary)] py-20 lg:py-28">
      <div className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(700px_360px_at_50%_0%,rgb(10_123_193/0.10),transparent_70%)]" aria-hidden />
      <div className="dot-bg absolute inset-0 -z-10 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_60%)]" aria-hidden />
      <div className="container-x flex flex-col gap-12">
        <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <span className="eyebrow">Our technology solutions</span>
          <h2 id="solutions-heading" className="text-[32px] leading-[1.08] font-extrabold tracking-[-0.035em] text-ink sm:text-[44px]">
            Four specialist practices. <span className="text-gradient-brand">One trusted partner.</span>
          </h2>
          <p className="text-[16.5px] leading-relaxed text-muted">
            From the screens in your lobby and the cameras in your boardroom to the laptops on every desk and the policies that protect your data —
            sourced, deployed and supported by one team.
          </p>
        </Reveal>

        <div className="relative">
          <Connector />
          <RevealGroup className="relative grid gap-6 lg:grid-cols-2 lg:gap-10" stagger={0.1}>
            {solutions.map((s) => (
              <RevealItem key={s.id} className="flex min-w-0">
                <SolutionCard s={s} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  )
}

/** Hub and animated lines that visually join the four cards on large screens. */
function Connector() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 hidden lg:block" aria-hidden>
      <div className="absolute top-[8%] bottom-[8%] left-1/2 w-px -translate-x-1/2 overflow-hidden bg-brand-200/70">
        <div className="h-1/4 w-full animate-flow-y bg-gradient-to-b from-transparent via-cyan-accent to-transparent" />
      </div>
      <div className="absolute top-1/2 right-[8%] left-[8%] h-px -translate-y-1/2 overflow-hidden bg-brand-200/70">
        <div className="h-full w-1/4 animate-flow-x bg-gradient-to-r from-transparent via-violet-accent to-transparent" />
      </div>
      <div className="absolute top-1/2 left-1/2 flex size-[84px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white shadow-[0_12px_40px_-10px_rgb(12_93_174/0.35)]">
        <span className="absolute inset-[-6px] rounded-full bg-[conic-gradient(from_0deg,transparent,rgb(2_198_220/0.9),transparent_40%,rgb(10_123_193/0.9),transparent_75%)] [mask:radial-gradient(farthest-side,transparent_calc(100%-2px),black_calc(100%-1px))]" />
        <span className="absolute inset-0 animate-ring rounded-full border border-cyan-accent/40" />
        <LogoMark size={46} />
      </div>
    </div>
  )
}

function SolutionCard({ s }: { s: Solution }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = ref.current!
    const r = el.getBoundingClientRect()
    el.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3))
    el.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3))
  }
  const reset = () => {
    ref.current?.style.setProperty('--px', '0')
    ref.current?.style.setProperty('--py', '0')
  }
  const Visual = s.Visual
  return (
    <Link
      ref={ref}
      to={s.to}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ '--glow': s.glow, transform: 'perspective(1400px) rotateX(calc(var(--py, 0) * -3deg)) rotateY(calc(var(--px, 0) * 4deg))' } as CSSProperties}
      className="group relative isolate flex w-full flex-col overflow-hidden rounded-[20px] border border-line bg-white shadow-[var(--shadow-card)] transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:scale-[1.012] hover:border-brand-300 hover:shadow-[0_18px_44px_-14px_var(--glow)] motion-reduce:hover:transform-none"
    >
      {/* Accent wash strengthens on hover */}
      <span className={cn('absolute inset-x-0 top-0 h-px bg-gradient-to-r opacity-60 group-hover:opacity-100', s.accent)} aria-hidden />

      <div className="on-dark relative m-2 h-[230px] overflow-hidden rounded-[14px] bg-[linear-gradient(160deg,#07111f,#0b1220_60%,#0c2a55)] sm:h-[280px]" aria-hidden>
        <Visual />
        <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-sweep bg-gradient-to-r from-transparent via-white/[0.09] to-transparent" />
        
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6 pt-4 sm:p-8 sm:pt-5">
        <div className="flex items-center gap-3">
          <span className={cn('bg-gradient-to-r bg-clip-text text-sm font-extrabold text-transparent', s.accent)}>{s.n}</span>
          <span className={cn('h-px flex-1 bg-gradient-to-r opacity-40', s.accent)} />
        </div>
        <h3 className="font-display text-2xl leading-tight font-bold tracking-[-0.02em] text-ink sm:text-[26px]">{s.title}</h3>
        <p className="text-[15.5px] leading-relaxed text-muted">{s.text}</p>
        <ul className="flex flex-wrap gap-2">
          {s.tags.map((t) => (
            <li key={t} className="rounded-full border border-line bg-[var(--background-primary)] px-3 py-1 text-[12.5px] font-semibold text-slate-600">
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
          <span
            className={cn(
              'inline-flex h-11 items-center gap-2 rounded-xl border border-line bg-white px-5 text-[14.5px] font-bold text-brand-700 transition-all duration-300 group-hover:border-transparent group-hover:bg-gradient-to-r group-hover:text-white group-hover:shadow-[0_12px_30px_-12px_var(--glow)]',
              s.ctaHover,
            )}
          >
            {s.cta} <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
          </span>
          {s.credit && <span className="text-[11.5px] text-subtle">{s.credit}</span>}
        </div>
      </div>
    </Link>
  )
}

/* ———————————————————— Visuals ———————————————————— */

/** A layer that shifts with the pointer (CSS variables set on the card). */
function P({ d, className, children }: { d: number; className?: string; children: ReactNode }) {
  return (
    <div
      className={cn('absolute transition-transform duration-700 ease-out', className)}
      style={{ transform: `translate3d(calc(var(--px, 0) * ${d * 26}px), calc(var(--py, 0) * ${d * 18}px), 0)` }}
    >
      {children}
    </div>
  )
}

function Img({ k, className }: { k: MediaKey; className?: string }) {
  return <SmartImage k={k} alt="" tone="dark" sizes="(min-width: 1024px) 26vw, 70vw" className={cn('w-full', className)} />
}

function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-navy-900/75 px-2.5 py-1.5 text-[11px] font-semibold whitespace-nowrap text-slate-100 shadow-lg backdrop-blur-md', className)}>
      {children}
    </span>
  )
}

export function SignageVisual() {
  const slides = ['from-brand-700 to-cyan-accent', 'from-brand-500 to-violet-accent', 'from-teal-accent to-cyan-accent']
  return (
    <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_70%_40%,rgb(2_198_220/0.28),transparent_70%)]">
      <P d={0.6} className="top-[6%] left-[-4%] w-[64%]">
        <Img k="videoWall" className="drop-shadow-[0_24px_30px_rgb(0_0_0/0.5)] transition-transform duration-700 group-hover:scale-[1.04]" />
      </P>
      <P d={0.35} className="top-[-8%] right-[-10%] w-[54%] opacity-90">
        <Img k="menuBoard" />
      </P>
      <P d={1.2} className="right-[38%] bottom-[-22%] w-[27%]">
        <div className="animate-float">
          <Img k="kiosk" className="drop-shadow-[0_24px_30px_rgb(0_0_0/0.5)]" />
        </div>
      </P>
      {/* Content-management concept: a playlist whose preview cycles */}
      <P d={1.6} className="right-[4%] bottom-[10%] w-[36%] max-w-[190px]">
        <div className="rounded-xl border border-white/15 bg-navy-900/80 p-2.5 shadow-2xl backdrop-blur-md">
          <div className="mb-2 flex items-center justify-between text-[10px] font-bold tracking-wide text-slate-300 uppercase">
            Content schedule <span className="size-1.5 rounded-full bg-orange-accent shadow-[0_0_8px_2px_rgb(2_198_220/0.8)]" />
          </div>
          <div className="overflow-hidden rounded-md">
            <div className="flex w-[300%] animate-slides">
              {slides.map((g, i) => (
                <div key={i} className={cn('flex aspect-[16/7] w-1/3 flex-col justify-end gap-1 bg-gradient-to-br p-2', g)}>
                  <span className="h-1.5 w-3/5 rounded bg-white/80" />
                  <span className="h-1.5 w-2/5 rounded bg-white/50" />
                </div>
              ))}
            </div>
          </div>
          <ul className="mt-2 flex flex-col gap-1 text-[10px] text-slate-300">
            {['08:00  Morning menu', '12:00  Promotions', '18:00  Events'].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-slate-400" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </P>
    </div>
  )
}

export function BoardroomVisual() {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_45%_35%,rgb(12_93_174/0.3),transparent_70%)]">
      {/* Meeting display with a speaker-tracking frame */}
      <P d={0.4} className="top-[17%] left-[7%] w-[60%]">
        <div className="relative">
          <div className="absolute -top-[15%] left-1/2 z-10 w-[56%] -translate-x-1/2">
            <Img k="avSoundbar" />
          </div>
          <div className="relative aspect-video overflow-hidden rounded-lg border-[3px] border-slate-800 bg-navy-900 shadow-[0_30px_50px_-20px_rgb(0_0_0/0.8)]">
            <div className="grid h-full grid-cols-2 grid-rows-2 gap-[3%] p-[3%]">
              {['from-brand-600/60 to-violet-accent/40', 'from-teal-accent/50 to-brand-600/40', 'from-violet-accent/50 to-brand-600/40', 'from-cyan-accent/40 to-teal-accent/40'].map(
                (g, i) => (
                  <div key={i} className={cn('flex items-center justify-center rounded bg-gradient-to-br', g)}>
                    <User className="size-[40%] text-white/70" strokeWidth={1.5} />
                  </div>
                ),
              )}
            </div>
            <span className="absolute h-[42%] w-[46%] animate-track rounded border-2 border-cyan-accent shadow-[0_0_14px_rgb(2_198_220/0.8)]" />
          </div>
          <div className="mx-auto h-[10%] w-[6%] bg-slate-700" />
        </div>
      </P>
      <P d={0.7} className="top-[-4%] right-[-4%] w-[40%] opacity-90">
        <Img k="avCeilingMic" />
      </P>
      {/* Table */}
      <div className="absolute right-[-10%] bottom-[-18%] left-[-10%] h-[42%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgb(148_163_184/0.22),rgb(15_23_42/0.1)_60%,transparent_72%)]" />
      <P d={1.3} className="right-[6%] bottom-[4%] w-[40%]">
        <Img k="avQuadro" className="drop-shadow-[0_18px_22px_rgb(0_0_0/0.6)] transition-transform duration-700 group-hover:scale-[1.05]" />
      </P>
      {/* Audio wave */}
      <P d={1.6} className="right-[44%] bottom-[12%]">
        <Chip>
          <span className="flex h-3.5 items-end gap-[3px]">
            {[0, 0.2, 0.4, 0.1, 0.3].map((dl, i) => (
              <span key={i} className="block h-full w-[3px] origin-bottom animate-eq rounded-full bg-cyan-accent" style={{ animationDelay: `${dl}s` }} />
            ))}
          </span>
          Speaker tracking
        </Chip>
      </P>
    </div>
  )
}

function LaptopVisual() {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_45%,rgb(16_165_230/0.3),transparent_70%)]">
      <P d={0.35} className="top-[2%] right-[-6%] w-[54%] opacity-80">
        <Img k="monitor" />
      </P>
      <P d={0.9} className="bottom-[-6%] left-[2%] w-[76%]">
        <div className="animate-float">
          <Img k="laptopHero" className="drop-shadow-[0_30px_40px_rgb(0_0_0/0.55)] transition-transform duration-700 group-hover:scale-[1.04] group-hover:-rotate-1" />
        </div>
      </P>
      <P d={1.3} className="right-[2%] bottom-[2%] w-[34%]">
        <Img k="laptopGrey" className="drop-shadow-[0_20px_28px_rgb(0_0_0/0.55)]" />
      </P>
      <P d={1.6} className="bottom-[4%] left-[-2%] w-[18%]">
        <Img k="dock" />
      </P>
      <P d={1.8} className="top-[10%] left-[5%] flex flex-col items-start gap-2">
        <Chip>
          <Laptop size={13} className="text-cyan-300" /> Windows & macOS
        </Chip>
        <Chip className="ml-6">New · Refurbished</Chip>
        <Chip className="ml-2">Docks · Monitors · Accessories</Chip>
      </P>
    </div>
  )
}

export function MicrosoftVisual() {
  const chips = [
    ['Microsoft 365', 'top-[7%] left-[3%]'],
    ['Entra ID', 'top-[7%] left-1/2 -translate-x-1/2 hidden sm:inline-flex'],
    ['Microsoft Purview', 'top-[7%] right-[3%]'],
    ['Sensitivity labels', 'top-[62%] left-[2%]'],
    ['Endpoint DLP', 'top-[62%] right-[2%]'],
    ['Intune', 'bottom-[5%] left-[3%] hidden sm:inline-flex'],
    ['Defender', 'bottom-[5%] right-[3%] hidden sm:inline-flex'],
  ] as const
  return (
    <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_45%,rgb(6_182_204/0.28),transparent_70%)]">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 300" preserveAspectRatio="none">
        <g fill="none" strokeWidth="1.4" strokeDasharray="5 7" className="animate-dash">
          <path d="M70 150 C 130 150, 150 130, 200 128" stroke="rgb(2 198 220 / 0.7)" />
          <path d="M330 150 C 270 150, 250 130, 200 128" stroke="rgb(6 182 204 / 0.7)" />
          <path d="M200 250 C 200 210, 200 180, 200 150" stroke="rgb(16 165 230 / 0.7)" />
        </g>
      </svg>
      {/* Device, cloud and document nodes */}
      <P d={0.9} className="top-[40%] left-[10%] -translate-y-1/2">
        <Node icon={<MonitorSmartphone size={22} />} label="Devices" />
      </P>
      <P d={0.9} className="top-[40%] right-[10%] -translate-y-1/2">
        <Node icon={<Cloud size={22} />} label="Cloud" />
      </P>
      <P d={1.1} className="bottom-[4%] left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-navy-900/80 px-3 py-2 shadow-xl backdrop-blur-md">
          <FileLock2 size={18} className="text-teal-300" />
          <span className="text-[11px] font-semibold whitespace-nowrap text-slate-200">Q3-report.xlsx</span>
          <span className="rounded bg-amber-400/90 px-1.5 py-0.5 text-[9.5px] font-bold text-amber-950">Confidential</span>
        </div>
      </P>
      {/* Shield core */}
      <P d={0.5} className="top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative flex size-24 items-center justify-center sm:size-28">
          <span className="absolute inset-0 animate-ring rounded-full border border-teal-300/50" />
          <span className="absolute inset-0 animate-ring rounded-full border border-cyan-accent/40 [animation-delay:1.3s]" />
          <span className="absolute inset-2 rounded-full bg-gradient-to-br from-teal-accent/40 via-cyan-accent/20 to-brand-600/40 blur-md" />
          <span className="relative flex size-full items-center justify-center rounded-full border border-white/20 bg-navy-900/70 backdrop-blur">
            <ShieldCheck className="size-11 text-teal-200 drop-shadow-[0_0_14px_rgb(2_198_220/0.9)] sm:size-12" strokeWidth={1.5} />
            <KeyRound className="absolute right-3 bottom-3 size-4 text-cyan-200" />
          </span>
        </div>
      </P>
      {chips.map(([t, pos], i) => (
        <P key={t} d={1.4 + (i % 3) * 0.2} className={pos}>
          <Chip>
            <span className="size-1.5 rounded-full bg-teal-300" /> {t}
          </Chip>
        </P>
      ))}
    </div>
  )
}

function Node({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="flex size-12 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.08] text-cyan-100 shadow-xl backdrop-blur">{icon}</span>
      <span className="text-[10.5px] font-semibold text-slate-300">{label}</span>
    </div>
  )
}
