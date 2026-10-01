import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue, type Variants } from 'motion/react'
import {
  Apple,
  ArrowRight,
  Building2,
  CheckCircle2,
  FileLock2,
  Headphones,
  Laptop,
  Lock,
  Recycle,
  ShieldCheck,
  Usb,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useState, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import type { MediaKey } from '../../data/media'
import { paths } from '../../data/routes'
import { cn } from '../../lib/cn'
import { Button } from '../ui/Button'
import { SmartImage } from '../ui/SmartImage'

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } }
const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
}

const cat = paths.category
const offerings = ['New & Refurbished IT Hardware', 'Apple Products', 'IT Accessories', 'Cybersecurity', 'DLP', 'Endpoint Security', 'Business IT Solutions']
const trust = ['Pan-India IT Procurement', 'Enterprise Support', 'Genuine Products', 'Business-Focused Solutions']

function useFinePointer() {
  const [fine, setFine] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine) and (min-width: 1024px)')
    const on = () => setFine(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return fine
}

/* ─── Hero ───────────────────────────────────────────────────────────────── */

export function Hero() {
  const reduce = useReducedMotion()
  const fine = useFinePointer()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 18 })
  const sy = useSpring(my, { stiffness: 60, damping: 18 })
  const interactive = fine && !reduce

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (!interactive) return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <section className="relative isolate overflow-hidden bg-[var(--background-primary)]" aria-labelledby="hero-heading">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(900px_520px_at_85%_10%,rgb(8_120_232/0.10),transparent_70%),radial-gradient(700px_420px_at_0%_100%,rgb(0_201_232/0.08),transparent_70%)]" aria-hidden />
      <div className="dot-bg absolute inset-0 -z-10 opacity-50 [mask-image:radial-gradient(ellipse_at_30%_40%,black,transparent_70%)]" aria-hidden />

      <div className="container-x grid items-center gap-10 pt-10 pb-10 sm:pt-14 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-10 lg:pt-16 lg:pb-12">
        <motion.div variants={container} initial="hidden" animate="show" className="relative z-10 flex min-w-0 flex-col gap-6">
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 self-start rounded-full border border-brand-100 bg-white px-3.5 py-1.5 text-[11px] font-bold tracking-[0.14em] text-brand-700 uppercase shadow-sm"
          >
            <span className="size-1.5 rounded-full bg-cyan-accent shadow-[0_0_10px_2px_rgb(0_201_232/0.6)]" />
            Hardware to security — under one roof
          </motion.span>
          <motion.h1 id="hero-heading" variants={item} className="text-[36px] leading-[1.04] font-extrabold tracking-[-0.045em] text-ink sm:text-[50px] lg:text-[44px] xl:text-[54px]">
            Complete IT Solutions &amp; <span className="text-gradient-brand">Procurement Partner</span>
          </motion.h1>
          <motion.ul variants={item} className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[14.5px] font-semibold text-slate-600 sm:text-[15.5px]" aria-label="What we supply">
            {offerings.map((o, i) => (
              <li key={o} className="flex items-center gap-2.5">
                {i > 0 && <span className="h-3.5 w-px bg-slate-300" aria-hidden />}
                {o}
              </li>
            ))}
          </motion.ul>
          <motion.div variants={item} className="flex flex-col gap-3 sm:flex-row">
            <Button to={`${paths.home}#solutions`} size="lg" iconRight={<ArrowRight size={18} />}>
              Explore IT Solutions
            </Button>
            <Button to={paths.quote} size="lg" variant="secondary">
              Request a Quote
            </Button>
          </motion.div>
          <motion.ul variants={item} className="flex flex-wrap gap-x-4 gap-y-2 border-t border-line pt-5 text-[13px] font-semibold text-slate-600" aria-label="Why businesses work with us">
            {trust.map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-brand-600" aria-hidden />
                {t}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        <div onPointerMove={onMove} onPointerLeave={onLeave}>
          <Ecosystem sx={sx} sy={sy} />
        </div>
      </div>

      <InfoCards />
    </section>
  )
}

/* ─── Composite technology visual ────────────────────────────────────────── */

function Layer({ k, depth, sx, sy, className, delay, float, eager }: { k: MediaKey; depth: number; sx: MotionValue<number>; sy: MotionValue<number>; className: string; delay: number; float?: boolean; eager?: boolean }) {
  const x = useTransform(sx, (v) => v * depth * 34)
  const y = useTransform(sy, (v) => v * depth * 24)
  return (
    <motion.div className={`absolute ${className}`} style={{ x, y }}>
      <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}>
        <div className={float ? 'animate-float' : undefined} style={float ? { animationDelay: `${-delay * 4}s` } : undefined}>
          <SmartImage k={k} eager={eager} sizes="(min-width: 1024px) 30vw, 60vw" className="w-full drop-shadow-[0_24px_30px_rgb(0_0_0/0.5)]" />
        </div>
      </motion.div>
    </motion.div>
  )
}

function Zone({ label, sub, className, delay, tone = 'light' }: { label: string; sub?: string; className: string; delay: number; tone?: 'light' | 'cyan' }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn('absolute z-30 flex flex-col rounded-lg border px-2.5 py-1 backdrop-blur-md', tone === 'cyan' ? 'border-cyan-accent/40 bg-cyan-accent/10' : 'border-white/15 bg-[#0b1220]/70', className)}
    >
      <span className={cn('text-[9px] font-bold tracking-[0.16em] whitespace-nowrap sm:text-[10.5px]', tone === 'cyan' ? 'text-cyan-accent' : 'text-white')}>{label}</span>
      {sub && <span className="hidden text-[9.5px] whitespace-nowrap text-slate-300 sm:block">{sub}</span>}
    </motion.span>
  )
}

/** Animated data links converging on the central laptop. */
function DataLinks() {
  const d = [
    'M330 330 C 260 250, 180 220, 90 200',
    'M330 330 C 330 240, 330 170, 330 110',
    'M330 330 C 420 260, 490 220, 560 190',
    'M330 330 C 250 400, 170 430, 100 440',
    'M330 330 C 420 420, 500 460, 570 470',
    'M330 330 C 330 420, 330 480, 330 540',
  ]
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 660 600" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="eco-link" x1="0" x2="1">
          <stop offset="0" stopColor="#00c9e8" stopOpacity="0" />
          <stop offset="0.5" stopColor="#00c9e8" stopOpacity="0.85" />
          <stop offset="1" stopColor="#0878e8" stopOpacity="0" />
        </linearGradient>
      </defs>
      {d.map((p, i) => (
        <g key={p}>
          <path d={p} fill="none" stroke="rgb(8 120 232 / 0.18)" strokeWidth="1" />
          <path d={p} fill="none" stroke="url(#eco-link)" strokeWidth="1.6" strokeDasharray="5 13" className="animate-dash motion-reduce:animate-none" style={{ animationDuration: `${7 + i}s` }} />
        </g>
      ))}
    </svg>
  )
}

/** Cybersecurity & DLP: a compact security-platform panel. */
function SecurityPanel({ sx, sy }: { sx: MotionValue<number>; sy: MotionValue<number> }) {
  const x = useTransform(sx, (v) => v * 10)
  const y = useTransform(sy, (v) => v * 8)
  const rows: [string, LucideIcon, number][] = [
    ['Endpoint security · EDR/XDR', ShieldCheck, 92],
    ['DLP · data protection', FileLock2, 86],
    ['USB & device control', Usb, 78],
    ['Email & cloud security', Lock, 88],
  ]
  return (
    <motion.div style={{ x, y }} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }} className="absolute top-[3%] left-[3%] z-20 w-[40%] min-w-[140px]">
      <div className="rounded-xl border border-cyan-accent/25 bg-[#0e1a33]/85 p-2.5 shadow-[0_20px_40px_-20px_rgb(0_201_232/0.5)] backdrop-blur-md sm:p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[9px] font-bold tracking-[0.16em] whitespace-nowrap text-cyan-accent sm:text-[10.5px]">CYBERSECURITY &amp; DLP</span>
          <span className="hidden items-center gap-1 text-[9px] font-semibold text-emerald-300 sm:flex">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-400 motion-reduce:animate-none" /> Platform
          </span>
        </div>
        <ul className="mt-2 hidden flex-col gap-1.5 sm:flex">
          {rows.map(([t, Icon, pct], i) => (
            <li key={t} className="flex items-center gap-2 text-[10.5px] text-slate-200">
              <Icon size={12} className="shrink-0 text-cyan-accent" aria-hidden />
              <span className="flex-1 truncate">{t}</span>
              <span className="h-1 w-10 overflow-hidden rounded-full bg-white/10">
                <motion.span className="block h-full rounded-full bg-gradient-to-r from-[#0878e8] to-cyan-accent" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.2, delay: 0.9 + i * 0.12 }} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

function Shield() {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.35 }} className="absolute top-[6%] left-[52%] z-10 w-[15%]" aria-hidden>
      <span className="absolute inset-[-18%] animate-ring rounded-full border border-cyan-accent/40 motion-reduce:animate-none" />
      <span className="absolute inset-[-40%] animate-ring rounded-full border border-cyan-accent/20 motion-reduce:animate-none" style={{ animationDelay: '1.2s' }} />
      <svg viewBox="0 0 64 72" className="relative w-full drop-shadow-[0_0_24px_rgb(0_201_232/0.55)]">
        <defs>
          <linearGradient id="shield-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#0878e8" />
            <stop offset="1" stopColor="#00c9e8" />
          </linearGradient>
        </defs>
        <path d="M32 3 L58 13 V34 C58 52 46 63 32 69 C18 63 6 52 6 34 V13 Z" fill="url(#shield-g)" fillOpacity="0.22" stroke="url(#shield-g)" strokeWidth="2.2" />
        <rect x="23" y="33" width="18" height="14" rx="3" fill="#00c9e8" fillOpacity="0.9" />
        <path d="M26.5 33 v-4 a5.5 5.5 0 0 1 11 0 v4" fill="none" stroke="#00c9e8" strokeWidth="2.4" />
      </svg>
    </motion.div>
  )
}

function Ecosystem({ sx, sy }: { sx: MotionValue<number>; sy: MotionValue<number> }) {
  return (
    <div
      className="relative mx-auto aspect-[660/600] w-full max-w-[700px] overflow-hidden rounded-[28px] border border-white/10 bg-[#0b1220] shadow-[0_40px_90px_-40px_rgb(11_18_32/0.75)]"
      role="img"
      aria-label="Technology ecosystem: new and refurbished business laptops, a MacBook-style laptop, phones, tablet, watch and earbuds, a headset, docking station, webcam, keyboard and mouse, with a cybersecurity and data-protection shield (representative renders)"
    >
      <div className="grid-bg absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(420px_300px_at_50%_55%,rgb(8_120_232/0.35),transparent_70%),radial-gradient(300px_200px_at_58%_10%,rgb(0_201_232/0.22),transparent_70%)]" aria-hidden />
      <DataLinks />
      <Shield />
      <SecurityPanel sx={sx} sy={sy} />

      {/* Apple (right) */}
      <Layer k="tablet" depth={0.35} sx={sx} sy={sy} delay={0.45} className="top-[5%] right-[1%] w-[24%] opacity-90" />
      <Layer k="laptopGrey" depth={0.6} sx={sx} sy={sy} delay={0.4} className="top-[27%] right-[-3%] w-[35%]" />
      <Layer k="smartphones" depth={1.1} sx={sx} sy={sy} delay={0.6} className="top-[49%] right-[2%] w-[18%]" float />
      <Layer k="earbuds" depth={1.3} sx={sx} sy={sy} delay={0.75} className="top-[60%] right-[20%] w-[11%]" float />

      {/* New + refurbished laptops (left) */}
      <Layer k="laptopSilver" depth={0.5} sx={sx} sy={sy} delay={0.3} className="top-[33%] left-[-3%] w-[33%]" />
      <Layer k="laptopBlack" depth={0.9} sx={sx} sy={sy} delay={0.5} className="top-[55%] left-[-1%] w-[30%]" />

      {/* Center laptop */}
      <Layer k="laptopHero" depth={0.8} sx={sx} sy={sy} delay={0.2} eager className="top-[27%] left-[23%] w-[53%]" float />

      {/* Accessories (lower) */}
      <Layer k="webcam" depth={1.3} sx={sx} sy={sy} delay={0.95} className="bottom-[13%] left-[27%] w-[10%]" float />
      <Layer k="dock" depth={1.2} sx={sx} sy={sy} delay={0.8} className="bottom-[4%] left-[33%] w-[19%]" />
      <Layer k="headsetStereo" depth={1.4} sx={sx} sy={sy} delay={0.85} className="bottom-[1%] left-[51%] w-[19%]" float />
      <Layer k="keyboardMouse" depth={1.1} sx={sx} sy={sy} delay={0.9} className="right-[1%] bottom-[0%] w-[26%]" />

      <Zone label="NEW IT HARDWARE" sub="Business laptops & desktops" className="top-[29%] left-[3%]" delay={1.0} />
      <Zone label="REFURBISHED & PRE-OWNED" sub="Quality checked · Tested · Business ready" className="top-[78%] left-[3%]" delay={1.1} />
      <Zone label="APPLE PRODUCTS" sub="MacBook · iPhone · iPad" className="top-[20%] right-[3%]" delay={1.2} />
      <Zone label="IT ACCESSORIES" sub="Headsets · Docks · Peripherals" className="right-[3%] bottom-[22%]" delay={1.3} tone="cyan" />

      <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-sweep bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" aria-hidden />
      <span className="absolute right-4 bottom-2 z-30 text-[9.5px] text-slate-500">Representative renders</span>
    </div>
  )
}

/* ─── Six info cards under the hero ──────────────────────────────────────── */

const infoCards: { t: string; d: string; icon: LucideIcon; to: string }[] = [
  { t: 'New IT Hardware', d: 'Dell • HP • Lenovo • ASUS • Acer', icon: Laptop, to: cat('new-laptops') },
  { t: 'Refurbished Laptops', d: 'Quality Checked • Tested • Business Ready', icon: Recycle, to: cat('refurbished-laptops') },
  { t: 'Apple', d: 'MacBook • iPhone • iPad • Accessories', icon: Apple, to: cat('apple-products') },
  { t: 'IT Accessories', d: 'Headsets • Docking • Monitors • Peripherals', icon: Headphones, to: cat('it-accessories') },
  { t: 'Cybersecurity', d: 'Antivirus • EDR/XDR • DLP • Endpoint Security', icon: ShieldCheck, to: paths.service('cybersecurity-dlp') },
  { t: 'Enterprise IT', d: 'Procurement • Deployment • Support • AMC', icon: Building2, to: paths.corporate },
]

function InfoCards() {
  return (
    <div className="container-x pb-12 lg:pb-16">
      <motion.ul
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.6 } } }}
        className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6"
        aria-label="What we offer"
      >
        {infoCards.map(({ t, d, icon: Icon, to }) => (
          <motion.li key={t} variants={item} className="h-full">
            <Link
              to={to}
              className="group flex h-full flex-col gap-2.5 rounded-2xl border border-line bg-white p-4 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_20px_40px_-22px_rgb(8_120_232/0.5)] motion-reduce:hover:translate-y-0"
            >
              <span className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-white transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 motion-reduce:transform-none">
                  <Icon size={19} aria-hidden />
                </span>
                <ArrowRight size={15} className="text-brand-600 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden />
              </span>
              <span className="text-[12px] font-extrabold tracking-[0.1em] text-ink uppercase">{t}</span>
              <span className="text-[12.5px] leading-snug text-muted">{d}</span>
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  )
}
