import { useInView, useReducedMotion } from 'motion/react'
import { ArrowRight, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { IMG_BASE, type MediaKey } from '../../data/media'
import { paths } from '../../data/routes'
import { Button } from '../ui/Button'
import { Link } from 'react-router-dom'
import { Reveal } from '../ui/Reveal'
import { SmartImage } from '../ui/SmartImage'

const VIDEO = `${IMG_BASE}video/zova-showcase`

/**
 * Decide whether to play the looping showcase video. Falls back to the poster image for
 * reduced motion, data-saver, slow connections and small screens.
 */
function useCanPlayVideo() {
  const reduce = useReducedMotion()
  const [env] = useState(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection
    return {
      slow: !!conn && (!!conn.saveData || /(^|-)2g$/.test(conn.effectiveType ?? '')),
      small: window.matchMedia('(max-width: 639px)').matches,
    }
  })
  return !reduce && !env.slow && !env.small
}

const cat = paths.category
/** Category carousel shown under the showcase video. */
const showcase: { t: string; d: string; k: MediaKey; to: string }[] = [
  { t: 'Business Laptops', d: 'Latitude, ThinkPad, EliteBook and more', k: 'laptopSilver', to: cat('new-laptops') },
  { t: 'Apple Mac', d: 'MacBook, iMac and Mac mini', k: 'laptopGrey', to: `${cat('apple-products')}?subcategory=MacBook` },
  { t: 'Monitors', d: 'Office and professional displays', k: 'monitor', to: cat('monitors-displays') },
  { t: 'Docking Stations', d: 'USB-C and Thunderbolt docks', k: 'dock', to: `${cat('it-accessories')}?subcategory=${encodeURIComponent('USB hubs & docking stations')}` },
  { t: 'Professional Headsets', d: 'Poly, Jabra, Logitech and more', k: 'headsetStereo', to: cat('headsets-audio-solutions') },
  { t: 'Printers', d: 'Laser, ink-tank and multifunction', k: 'printer', to: cat('printers-scanners') },
  { t: 'Networking', d: 'Switches, routers and Wi-Fi', k: 'switch', to: cat('networking') },
  { t: 'Cybersecurity', d: 'Firewalls, endpoint security and DLP', k: 'firewall', to: paths.service('cybersecurity-dlp') },
  { t: 'Meeting Room Equipment', d: 'Cameras, audio and displays', k: 'conference', to: paths.av },
]

function Carousel() {
  const track = useRef<HTMLUListElement>(null)
  const scroll = (dir: 1 | -1) => {
    const el = track.current
    if (!el) return
    const card = el.querySelector('li')
    el.scrollBy({ left: dir * ((card?.clientWidth ?? 280) + 16) * 2, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-[18px] font-bold text-white">Explore by category</h3>
        <div className="flex gap-2">
          {([-1, 1] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => scroll(d)}
              aria-label={d < 0 ? 'Previous categories' : 'Next categories'}
              className="flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] text-white transition hover:border-cyan-accent/60 hover:bg-white/10"
            >
              {d < 0 ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          ))}
        </div>
      </div>
      <ul
        ref={track}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
        aria-label="Product categories"
      >
        {showcase.map((c) => (
          <li key={c.t} className="w-[76%] shrink-0 snap-start sm:w-[44%] lg:w-[calc((100%-48px)/4)]">
            <Link
              to={c.to}
              className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.04] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-accent/40 hover:bg-white/[0.07] motion-reduce:hover:translate-y-0"
            >
              <span className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[radial-gradient(70%_65%_at_50%_55%,rgb(226_236_248/0.95),rgb(186_206_230/0.55)_55%,transparent_80%)]">
                <SmartImage k={c.k} alt="" sizes="(min-width: 1024px) 22vw, 70vw" className="w-[82%] transition-transform duration-700 ease-out group-hover:scale-[1.07] motion-reduce:transform-none" />
              </span>
              <span className="flex flex-1 flex-col gap-1 p-5">
                <span className="text-[16.5px] font-bold text-white">{c.t}</span>
                <span className="text-[13px] text-on-dark">{c.d}</span>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[13.5px] font-bold text-cyan-accent">
                  Explore Products <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function VideoShowcase() {
  const canPlay = useCanPlayVideo()
  const wrap = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const visible = useInView(wrap, { margin: '100px' })

  // Only play while on screen (saves CPU and battery).
  useEffect(() => {
    const v = video.current
    if (!v) return
    if (visible) v.play().catch(() => {})
    else v.pause()
  }, [visible, canPlay])

  return (
    <section className="on-dark relative isolate overflow-hidden bg-hero py-20 text-white lg:py-28" aria-labelledby="showcase-heading">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(760px_420px_at_80%_20%,rgb(10_123_193/0.25),transparent_70%)]" aria-hidden />
      <div className="container-x flex flex-col gap-10">
        <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
          <Reveal className="flex max-w-2xl flex-col gap-4">
            <span className="eyebrow text-cyan-accent">Featured product ecosystem</span>
            <h2 id="showcase-heading" className="text-[32px] leading-[1.06] font-extrabold tracking-[-0.035em] sm:text-[44px]">
              Technology Built for the <span className="text-gradient">Modern Workplace</span>
            </h2>
            <p className="text-[16.5px] leading-relaxed text-on-dark">
              Business laptops and Macs, displays, docks, headsets, printers, networking, security and meeting-room equipment — sourced to
              specification from leading brands.
            </p>
          </Reveal>
          <Reveal delay={0.08} className="flex flex-col gap-3 sm:flex-row">
            <Button to={paths.products} size="lg" iconRight={<ArrowRight size={18} />}>
              Explore Products
            </Button>
            <Button to={paths.quote} size="lg" variant="ghost-dark">
              Request a Quote
            </Button>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div ref={wrap} className="relative overflow-hidden rounded-[20px] border border-white/10 bg-navy-900 shadow-[0_40px_90px_-40px_rgb(2_198_220/0.35)]">
            <div className="relative aspect-[16/9] w-full">
              {canPlay ? (
                <video
                  ref={video}
                  className="absolute inset-0 h-full w-full object-cover"
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="metadata"
                  poster={`${VIDEO}-poster.jpg`}
                  aria-label="Animated showcase of laptops, workstations, networking and AV equipment (representative renders)"
                >
                  <source src={`${VIDEO}.webm`} type="video/webm" />
                  <source src={`${VIDEO}.mp4`} type="video/mp4" />
                </video>
              ) : (
                <picture>
                  <source srcSet={`${VIDEO}-poster.webp`} type="image/webp" />
                  <img
                    src={`${VIDEO}-poster.jpg`}
                    alt="Laptop, monitor and docking station on a dark studio background (representative render)"
                    width={1280}
                    height={720}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </picture>
              )}
              {/* Readability overlay */}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgb(7_17_31/0.75),transparent_45%)]" />
              <div className="absolute right-4 bottom-4 left-4 flex flex-wrap items-center justify-between gap-3 sm:right-6 sm:bottom-5 sm:left-6">
                <ul className="flex flex-wrap gap-2" aria-label="Shown in the showcase">
                  {['Laptops & Mac', 'Headsets', 'Networking', 'AV & signage', 'CCTV'].map((t) => (
                    <li key={t} className="rounded-full border border-white/15 bg-hero/60 px-3 py-1 text-[12px] font-semibold text-slate-100 backdrop-blur">
                      {t}
                    </li>
                  ))}
                </ul>
                <span className="inline-flex items-center gap-1.5 text-[11.5px] text-slate-300">
                  <Play size={12} aria-hidden /> Representative 3D renders — not photographs of stock
                </span>
              </div>
            </div>
          </div>
        </Reveal>

        <Carousel />
      </div>
    </section>
  )
}
