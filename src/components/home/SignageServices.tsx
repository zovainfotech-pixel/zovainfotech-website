import { motion, useReducedMotion } from 'motion/react'
import { ArrowRight, MonitorPlay, MonitorSmartphone, PanelsTopLeft, Presentation, Tv } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { MediaKey } from '../../data/media'
import { paths } from '../../data/routes'
import { cn } from '../../lib/cn'
import { SmartImage } from '../ui/SmartImage'

/**
 * "Our Offered Services" for digital signage — staggered chevron ribbons on a navy
 * panel, following the supplied brand artwork. Text colours are chosen per band so
 * every ribbon meets WCAG AA contrast.
 */
const services: { title: string; text: string; icon: typeof Tv; k: MediaKey; band: string; ink: string; sub: string; width: string }[] = [
  {
    title: 'Indoor / Outdoor Active LED solutions',
    text: 'LED screens and video walls for lobbies, events, storefronts and building façades.',
    icon: PanelsTopLeft,
    k: 'videoWall',
    band: 'bg-[#2d5e9e]',
    ink: 'text-white',
    sub: 'text-blue-100',
    width: 'lg:w-[86%]',
  },
  {
    title: 'Customized KIOSKs & A-frame Standees',
    text: 'Touch and non-touch kiosks and digital standees, customised to your brand and space.',
    icon: MonitorSmartphone,
    k: 'kiosk',
    band: 'bg-[#316fc2]',
    ink: 'text-white',
    sub: 'text-blue-50',
    width: 'lg:w-[96%]',
  },
  {
    title: 'Digital Signage players',
    text: 'Media players and content scheduling for a single screen or a multi-site network.',
    icon: MonitorPlay,
    k: 'mediaPlayer',
    band: 'bg-[#6aacf7]',
    ink: 'text-[#0b2550]',
    sub: 'text-[#123b73]',
    width: 'lg:w-[66%]',
  },
  {
    title: 'Corporate & Commercial Displays',
    text: 'Commercial-grade displays for offices, retail, hospitality and menu boards.',
    icon: Tv,
    k: 'menuBoard',
    band: 'bg-[#74cdf3]',
    ink: 'text-[#0b2a55]',
    sub: 'text-[#123b73]',
    width: 'lg:w-[80%]',
  },
  {
    title: 'Interactive Display solutions',
    text: 'Touch-enabled interactive panels for meeting rooms, classrooms and training.',
    icon: Presentation,
    k: 'conference',
    band: 'bg-[#d8f1fb]',
    ink: 'text-[#0b2a55]',
    sub: 'text-[#2a4a78]',
    width: 'lg:w-[74%]',
  },
]

// Alternating chevron shapes, as in the artwork.
const shapeRight = '[clip-path:polygon(0_0,calc(100%-30px)_0,100%_50%,calc(100%-30px)_100%,0_100%,30px_50%)]'
const shapeLeft = '[clip-path:polygon(30px_0,100%_0,calc(100%-30px)_50%,100%_100%,30px_100%,0_50%)]'

export function SignageServices({ headingLevel = 'h2' }: { headingLevel?: 'h2' | 'h3' }) {
  const reduce = useReducedMotion()
  const H = headingLevel
  return (
    <section className="on-dark relative isolate overflow-hidden bg-[#0b1d3f] py-16 text-white sm:py-20" aria-labelledby="signage-services-heading">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(700px_380px_at_85%_10%,rgb(8_120_232/0.28),transparent_70%),radial-gradient(500px_320px_at_0%_100%,rgb(0_201_232/0.14),transparent_70%)]" aria-hidden />
      <div className="container-x">
        <div className="flex flex-col gap-3">
          <span className="eyebrow text-cyan-accent">Digital signage</span>
          <H id="signage-services-heading" className="text-[36px] leading-[1.05] font-bold tracking-[-0.03em] text-[#6aacf7] sm:text-[52px] lg:text-[60px]">
            Our Offered Services
          </H>
          <p className="max-w-2xl text-[15.5px] leading-relaxed text-on-dark">
            From a single lobby screen to a multi-site LED network — supplied, installed and supported by one partner.
          </p>
        </div>

        <ol className="mt-10 flex flex-col gap-1.5 sm:mt-12">
          {services.map(({ title, text, icon: Icon, k, band, ink, sub, width }, i) => (
            <motion.li
              key={title}
              initial={reduce ? false : { opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '0px 0px -40px 0px' }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 sm:gap-6"
            >
              {/* diamond bullet */}
              <span className="hidden size-9 shrink-0 rotate-45 rounded-[7px] bg-gradient-to-br from-[#8aa3c9] to-[#3b5a8c] shadow-[0_6px_14px_-6px_rgb(0_0_0/0.6)] sm:block" aria-hidden />
              <Link
                to={`${paths.contact}?about=${encodeURIComponent(title)}`}
                className={cn(
                  'group relative flex min-h-[92px] w-full items-center gap-4 py-4 pr-12 pl-10 transition-[filter,transform] duration-300 hover:brightness-110 sm:pr-16 sm:pl-14 motion-reduce:transform-none',
                  i % 2 ? shapeLeft : shapeRight,
                  band,
                  width,
                  'hover:translate-x-1.5',
                )}
                aria-label={`${title} — enquire`}
              >
                <span className={cn('flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/20 ring-1 ring-white/30', ink)}>
                  <Icon size={21} aria-hidden />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className={cn('text-[17px] leading-snug font-bold sm:text-[21px]', ink)}>{title}</span>
                  <span className={cn('text-[13px] leading-snug sm:text-[14px]', sub)}>{text}</span>
                </span>
                <SmartImage k={k} alt="" sizes="96px" className="hidden w-24 shrink-0 drop-shadow-[0_10px_14px_rgb(0_0_0/0.25)] transition-transform duration-500 group-hover:scale-110 md:block" />
                <ArrowRight size={18} className={cn('hidden shrink-0 transition-transform group-hover:translate-x-1 sm:block', ink)} aria-hidden />
              </Link>
            </motion.li>
          ))}
        </ol>
        <p className="mt-6 text-[12px] text-slate-400">Select a service to send an enquiry. Product images are representative renders.</p>
      </div>
    </section>
  )
}
