import { ArrowRight, Headphones, Laptop, Plug, Smartphone, Tablet, Watch, type LucideIcon } from 'lucide-react'
import { useRef, type PointerEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { MediaKey } from '../../data/media'
import { paths } from '../../data/routes'
import { cn } from '../../lib/cn'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { SmartImage } from '../ui/SmartImage'

const appleCat = paths.category('apple-products')

const appleLines: { t: string; sub: string; icon: LucideIcon }[] = [
  { t: 'MacBook', sub: 'MacBook', icon: Laptop },
  { t: 'iPhone', sub: 'iPhone', icon: Smartphone },
  { t: 'iPad', sub: 'iPad', icon: Tablet },
  { t: 'AirPods', sub: 'AirPods', icon: Headphones },
  { t: 'Apple Watch', sub: 'Apple Watch', icon: Watch },
  { t: 'Accessories', sub: 'Accessories', icon: Plug },
]

/** Pointer-parallax layer; reads --px/--py set on the frame. */
function L({ d, className, children }: { d: number; className?: string; children: ReactNode }) {
  return (
    <div
      className={cn('absolute transition-transform duration-700 ease-out', className)}
      style={{ transform: `translate3d(calc(var(--px, 0) * ${d * 28}px), calc(var(--py, 0) * ${d * 20}px), 0)` }}
    >
      {children}
    </div>
  )
}

function Img({ k, className, float, delay = 0 }: { k: MediaKey; className?: string; float?: boolean; delay?: number }) {
  return (
    <div className={float ? 'animate-float' : undefined} style={float ? { animationDelay: `${delay}s` } : undefined}>
      <SmartImage k={k} alt="" sizes="(min-width: 1024px) 30vw, 70vw" className={cn('w-full drop-shadow-[0_22px_26px_rgb(11_18_32/0.22)]', className)} />
    </div>
  )
}

function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-lg border border-line bg-white/85 px-2.5 py-1.5 text-[11.5px] font-semibold whitespace-nowrap text-ink shadow-[var(--shadow-card)] backdrop-blur-md', className)}>
      <span className="size-1.5 rounded-full bg-cyan-accent" />
      {children}
    </span>
  )
}

/** Animated Apple-ecosystem composition (representative renders, no Apple logos or product photography). */
export function AppleVisual({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = ref.current!.getBoundingClientRect()
    ref.current!.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3))
    ref.current!.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3))
  }
  const reset = () => {
    ref.current?.style.setProperty('--px', '0')
    ref.current?.style.setProperty('--py', '0')
  }
  return (
    <div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={reset}
      aria-hidden
      className={cn(
        'relative overflow-hidden rounded-[20px] border border-line bg-[radial-gradient(70%_70%_at_50%_40%,rgb(10_123_193/0.14),transparent_70%),linear-gradient(180deg,#ffffff,#eef4fb)] shadow-[var(--shadow-card)]',
        className,
      )}
    >
      <div className="dot-bg absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div className="absolute inset-x-[10%] bottom-[8%] h-[22%] rounded-[50%] bg-gradient-to-r from-brand-300/40 via-cyan-accent/20 to-brand-300/40 blur-3xl" />

      <L d={0.3} className="top-[4%] right-[-4%] w-[44%] opacity-80">
        <Img k="tablet" />
      </L>
      <L d={0.7} className="top-[16%] left-[14%] w-[62%]">
        <Img k="laptopGrey" float delay={0} className="transition-transform duration-700 group-hover:scale-[1.03]" />
      </L>
      <L d={1.2} className="bottom-[-4%] left-[-4%] w-[36%]">
        <Img k="smartphones" float delay={-2.2} />
      </L>
      <L d={1.4} className="top-[6%] left-[2%] w-[22%]">
        <Img k="smartwatch" float delay={-4.1} />
      </L>
      <L d={1.6} className="right-[2%] bottom-[2%] w-[34%]">
        <Img k="earbuds" float delay={-1.3} />
      </L>
      <L d={1.1} className="right-[32%] bottom-[-6%] w-[26%]">
        <Img k="wirelessCharger" />
      </L>

      <L d={1.9} className="top-[10%] right-[6%] hidden sm:block">
        <Tag>MacBook · iMac · Mac mini</Tag>
      </L>
      <L d={2.1} className="top-[52%] left-[4%] hidden sm:block">
        <Tag>iPhone for business</Tag>
      </L>
      <L d={1.8} className="right-[5%] bottom-[34%] hidden sm:block">
        <Tag>AirPods · Watch · Accessories</Tag>
      </L>

      <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-sweep bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      <span className="absolute bottom-3 left-4 text-[10.5px] text-subtle">Representative renders</span>
    </div>
  )
}

/** Dark "Apple for business" band: animated visual + product-line links into the Apple category. */
export function AppleBand({ headingLevel = 'h3' }: { headingLevel?: 'h2' | 'h3' }) {
  const H = headingLevel
  return (
    <Reveal>
      <div className="relative isolate grid items-center gap-8 overflow-hidden rounded-[20px] border border-line bg-white p-6 shadow-[var(--shadow-card)] sm:p-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12 lg:p-12">
        <div className="absolute -top-24 -left-24 -z-10 size-80 rounded-full bg-brand-100/70 blur-[100px]" aria-hidden />
        <div className="flex min-w-0 flex-col gap-5">
          <span className="eyebrow">Apple for business</span>
          <H className="font-display text-[28px] leading-[1.08] font-extrabold tracking-[-0.03em] text-ink sm:text-4xl">
            MacBook, iPhone, AirPods <span className="text-gradient-brand">and more.</span>
          </H>
          <p className="text-[15.5px] leading-relaxed text-muted">
            MacBook, iMac and Mac mini, iPhone, iPad, AirPods, Apple Watch and genuine accessories — sourced for individuals and teams, with setup and
            support on request. Models, pricing and availability are confirmed in your quotation.
          </p>
          <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {appleLines.map(({ t, sub, icon: Icon }) => (
              <li key={t}>
                <Link
                  to={`${appleCat}?subcategory=${encodeURIComponent(sub)}#catalogue`}
                  className="group flex items-center gap-2.5 rounded-xl border border-line bg-[var(--background-primary)] px-3 py-2.5 text-[13.5px] font-semibold text-ink transition hover:-translate-y-0.5 hover:border-brand-300 hover:bg-white hover:text-brand-700"
                >
                  <Icon size={16} className="text-brand-600" aria-hidden />
                  {t}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button to={appleCat} iconRight={<ArrowRight size={17} />}>
              Explore Apple products
            </Button>
            <Button to={`${paths.quote}?type=IT%20Hardware&brand=Apple`} variant="secondary">
              Request an Apple quote
            </Button>
          </div>
        </div>
        <AppleVisual className="h-[300px] sm:h-[400px]" />
        <p className="text-[11.5px] text-subtle lg:col-span-2">
          Apple, MacBook, iPhone, iPad, AirPods and Apple Watch are trademarks of Apple Inc. Images are original representative renders, not Apple
          product photography. Zova Infotech does not claim authorised-reseller status unless stated in your quotation.
        </p>
      </div>
    </Reveal>
  )
}
