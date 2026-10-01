import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface Props {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  dark?: boolean
  action?: ReactNode
  as?: 'h1' | 'h2'
  className?: string
}

export function SectionHeading({ eyebrow, title, description, align = 'left', dark, action, as = 'h2', className }: Props) {
  const H = as
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'center' && 'items-center text-center',
        action && 'md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div className={cn('flex max-w-2xl flex-col gap-3', align === 'center' && 'items-center')}>
        {eyebrow && <span className={cn('eyebrow', dark && 'text-cyan-accent')}>{eyebrow}</span>}
        <H className={cn('text-3xl font-bold tracking-[-0.03em] sm:text-4xl lg:text-[40px] lg:leading-[1.1]', dark && 'text-white')}>
          {title}
        </H>
        {description && <p className={cn('text-base leading-relaxed sm:text-[17px]', dark ? 'text-on-dark' : 'text-muted')}>{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
