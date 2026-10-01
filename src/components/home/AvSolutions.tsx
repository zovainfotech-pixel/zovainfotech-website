import {
  ArrowRight,
  AudioLines,
  Cable,
  LayoutPanelTop,
  MonitorPlay,
  Presentation,
  Projector,
  SlidersHorizontal,
  Video,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import type { MediaKey } from '../../data/media'
import { paths } from '../../data/routes'
import { cn } from '../../lib/cn'
import { Button } from '../ui/Button'
import { Reveal, RevealGroup, RevealItem } from '../ui/Reveal'
import { SmartImage } from '../ui/SmartImage'
import { ParallaxFrame } from './Story'
import { BoardroomVisual } from './TechSolutions'
import { AvShowcase } from './AvShowcase'

const AV_SLUG = 'audio-visual-digital-signage'
const quoteHref = `${paths.quote}?type=IT%20Services&model=${encodeURIComponent('Audio-Visual solution')}`

const solutions: { title: string; text: string; icon: typeof Video; k: MediaKey }[] = [
  { title: 'Video conferencing rooms', text: 'Displays, PTZ and bar cameras, microphones and speakers for huddle rooms to boardrooms.', icon: Video, k: 'conference' },
  { title: 'Interactive smart displays', text: 'Touch panels for classrooms, training and collaborative meeting spaces.', icon: Presentation, k: 'tablet' },
  { title: 'Digital signage', text: 'Portrait and landscape screens with media players for lobbies, retail and campuses.', icon: MonitorPlay, k: 'signage' },
  { title: 'LED & video walls', text: 'Large-format video walls for control rooms, auditoriums and experience centres.', icon: LayoutPanelTop, k: 'videoWall' },
  { title: 'Projection & auditorium AV', text: 'Projectors, screens and sound for training halls and auditoriums.', icon: Projector, k: 'projector' },
  { title: 'Professional audio & PA', text: 'Speakers, amplifiers, ceiling audio and microphones, tuned to the room.', icon: AudioLines, k: 'speakers' },
]

const capabilities = [
  { icon: Video, t: 'Video conferencing & cameras' },
  { icon: AudioLines, t: 'Conference microphones & speakers' },
  { icon: MonitorPlay, t: 'Professional & interactive displays' },
  { icon: Presentation, t: 'Wireless presentation' },
  { icon: SlidersHorizontal, t: 'Room integration & control' },
  { icon: Cable, t: 'Installation, configuration & maintenance' },
]

const steps = [
  { t: 'Consult', d: 'Understand the room, users and budget.' },
  { t: 'Design', d: 'Recommend equipment and layout.' },
  { t: 'Install', d: 'Mount, cable, configure and test.' },
  { t: 'Support', d: 'Handover, training and AMC on request.' },
]

/**
 * Audio & Video Solutions — crimson-to-midnight banner inspired by the supplied AV creative,
 * followed by solution cards and a short delivery process.
 */
export function AvSolutionsSection({
  compact = false,
  extras = true,
  asPage = false,
  showcaseLimit = 6,
  initialFilter,
}: {
  compact?: boolean
  /** Show the generic solution cards and delivery process under the showcase. */
  extras?: boolean
  /** Render the banner heading as the page <h1> (dedicated AV page). */
  asPage?: boolean
  /** Max products in the showcase; null shows everything. */
  showcaseLimit?: number | null
  initialFilter?: Parameters<typeof AvShowcase>[0]['initialFilter']
}) {
  const H = asPage ? 'h1' : 'h2'
  return (
    <section id="av-solutions" className="scroll-mt-20 bg-[var(--background-primary)]" aria-labelledby="av-heading">
      {/* Banner — light corporate with a small dark technology element */}
      <div className="relative isolate overflow-hidden border-b border-line bg-[radial-gradient(900px_480px_at_85%_40%,rgb(10_123_193/0.12),transparent_70%),linear-gradient(180deg,#ffffff,#f7f9fc)]">
        <div className="dot-bg absolute inset-0 -z-10 opacity-40 [mask-image:linear-gradient(to_right,transparent,black_70%)]" aria-hidden />
        <div className="container-x grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:py-24">
          <div className="flex min-w-0 flex-col gap-6">
            <span className="eyebrow">Audio &amp; video solutions</span>
            <H id="av-heading" className="text-[32px] leading-[1.08] font-extrabold tracking-[-0.035em] text-ink sm:text-[44px]">
              Boardroom Audio &amp; Video <span className="text-gradient-brand">Solutions</span>
            </H>
            <p className="text-[17px] font-semibold text-ink/80">Transform your organisation with industry-leading AV.</p>
            <p className="max-w-xl text-[16px] leading-relaxed text-muted">
              Meeting rooms that just work, displays that get noticed and sound that carries — planned, supplied, installed and maintained by one
              partner. Equipment is sourced from established AV manufacturers to suit your space and budget.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button to={quoteHref} size="lg" iconRight={<ArrowRight size={18} />}>
                Request an AV consultation
              </Button>
              <Button to={asPage ? `${paths.av}#av-products` : paths.av} size="lg" variant="secondary">
                {asPage ? 'Browse AV products' : 'Explore AV Solutions'}
              </Button>
            </div>
            <ul className="mt-1 grid gap-x-5 gap-y-2 sm:grid-cols-2">
              {capabilities.map(({ icon: Icon, t }) => (
                <li key={t} className="flex items-center gap-2.5 text-[14px] font-semibold text-ink">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <Icon size={16} aria-hidden />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <Reveal delay={0.1}>
            <ParallaxFrame tone="light" className="h-[300px] sm:h-[420px]">
              <BoardroomVisual />
            </ParallaxFrame>
          </Reveal>
        </div>
      </div>

      {!compact && (
        <div className="container-x flex flex-col gap-12 py-16 lg:py-24">
          <div id="av-products" className="scroll-mt-24">
            <AvShowcase limit={showcaseLimit ?? undefined} initialFilter={initialFilter} />
          </div>
          {extras && (
            <>
          <div className="flex flex-col gap-2 pt-4">
            <span className="eyebrow">Complete AV integration</span>
            <h3 className="font-display text-2xl font-bold tracking-[-0.02em] sm:text-[28px]">Solutions we design and deliver</h3>
          </div>
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {solutions.map(({ title, text, icon: Icon, k }) => (
              <RevealItem key={title} className="flex">
                <Link to={paths.service(AV_SLUG)} className="glow-border group flex w-full rounded-[var(--radius-card)]">
                  <span className="flex w-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white transition-shadow group-hover:border-transparent group-hover:shadow-[var(--shadow-card-hover)]">
                    <span className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-[radial-gradient(120%_90%_at_50%_100%,rgb(13_80_159/0.12),transparent_60%),linear-gradient(180deg,#f5f9fd,#ebf2fa)]">
                      <SmartImage
                        k={k}
                        alt=""
                        sizes="(min-width: 1024px) 30vw, 90vw"
                        className="w-[76%] drop-shadow-[0_20px_24px_rgb(17_24_39/0.2)] transition-transform duration-700 group-hover:scale-[1.06]"
                      />
                      <span className="absolute top-3 left-3 flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-crimson-accent to-brand-600 text-white shadow-lg transition-transform duration-500 group-hover:-rotate-6">
                        <Icon size={18} aria-hidden />
                      </span>
                    </span>
                    <span className="flex flex-1 flex-col gap-2 p-5">
                      <span className="text-[17px] font-bold group-hover:text-brand-700">{title}</span>
                      <span className="text-[14px] leading-relaxed text-muted">{text}</span>
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[13.5px] font-bold text-brand-600">
                        Learn more <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" aria-hidden />
                      </span>
                    </span>
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal>
            <div className="grid gap-6 rounded-[28px] border border-line bg-surface p-6 sm:p-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-center lg:gap-10">
              <div className="flex flex-col gap-2">
                <span className="eyebrow">How AV projects run</span>
                <h3 className="font-display text-2xl font-bold tracking-[-0.02em]">From site visit to switch-on</h3>
              </div>
              <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {steps.map((s, i) => (
                  <li key={s.t} className="flex gap-3">
                    <span
                      className={cn(
                        'flex size-10 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-semibold text-white',
                        i % 2 ? 'bg-gradient-to-br from-brand-600 to-violet-accent' : 'bg-gradient-to-br from-crimson-accent to-orange-accent',
                      )}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>
                      <span className="block font-bold">{s.t}</span>
                      <span className="text-[13.5px] leading-relaxed text-muted">{s.d}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <p className="mt-3 text-center text-[12.5px] text-muted">
              Site surveys, equipment brands, installation schedules and support coverage are confirmed individually for each project.
            </p>
          </Reveal>
            </>
          )}
        </div>
      )}
    </section>
  )
}
