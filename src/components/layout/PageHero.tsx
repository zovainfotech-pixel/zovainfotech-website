import { ChevronRight } from 'lucide-react'
import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'
import type { MediaKey } from '../../data/media'
import { CircuitLines } from '../brand/Decor'
import { SmartImage } from '../ui/SmartImage'

export interface Crumb {
  label: string
  to?: string
}

export function Breadcrumbs({ items, dark }: { items: Crumb[]; dark?: boolean }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className={cn('flex flex-wrap items-center gap-1.5 text-[13px]', dark ? 'text-slate-400' : 'text-muted')}>
        {items.map((c, i) => (
          <li key={c.label} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={13} aria-hidden className="opacity-60" />}
            {c.to ? (
              <Link to={c.to} className={cn('hover:underline', dark ? 'hover:text-white' : 'hover:text-ink')}>
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className={dark ? 'text-slate-200' : 'text-ink'}>
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
  children,
  aside,
  image,
  tone = 'default',
}: {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  crumbs: Crumb[]
  children?: ReactNode
  aside?: ReactNode
  image?: MediaKey
  tone?: 'default' | 'teal'
}) {
  return (
    <section className={cn('on-dark relative isolate overflow-hidden text-white', tone === 'teal' ? 'bg-[#061a24]' : 'aurora')}>
      {tone === 'teal' && (
        <div
          className="absolute inset-0 -z-10 bg-[radial-gradient(700px_400px_at_85%_10%,rgb(6_182_204/0.4),transparent_70%),radial-gradient(500px_300px_at_5%_100%,rgb(12_93_174/0.35),transparent_70%)]"
          aria-hidden
        />
      )}
      <div className="grid-bg absolute inset-0 -z-10 opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden />
      <CircuitLines className="opacity-50 [mask-image:linear-gradient(to_left,black,transparent_70%)]" />
      <div
        className={cn(
          'container-x grid gap-10 py-12 sm:py-16',
          (aside || image) && 'lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:items-center',
        )}
      >
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <Breadcrumbs items={crumbs} dark />
          {eyebrow && <span className="eyebrow mt-2 text-cyan-accent">{eyebrow}</span>}
          <h1 className="max-w-3xl text-[34px] leading-[1.06] font-bold tracking-[-0.035em] sm:text-5xl">{title}</h1>
          {description && <p className="max-w-2xl text-base leading-relaxed text-on-dark sm:text-[17px]">{description}</p>}
          {children}
        </motion.div>
        {aside}
        {image && !aside && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block"
            aria-hidden
          >
            <div className="absolute inset-[12%] rounded-full bg-gradient-to-tr from-brand-600/40 via-cyan-accent/20 to-purple-accent/40 blur-3xl" />
            <SmartImage k={image} alt="" eager sizes="40vw" className="relative mx-auto w-[92%] animate-float drop-shadow-[0_30px_40px_rgb(0_0_0/0.5)]" />
          </motion.div>
        )}
      </div>
    </section>
  )
}
