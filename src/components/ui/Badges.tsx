import { conditionLabel, gradeInfo } from '../../data/products'
import type { Condition, Grade } from '../../data/types'
import { cn } from '../../lib/cn'

const conditionStyle: Record<Condition, string> = {
  new: 'bg-gradient-to-r from-brand-600 to-violet-accent text-white',
  refurbished: 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white',
  used: 'bg-slate-700 text-white',
}

export function ConditionBadge({ condition, className }: { condition: Condition; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-xs font-bold shadow-[0_6px_14px_-6px_rgb(4_22_52/0.5)]',
        conditionStyle[condition],
        className,
      )}
    >
      <span className="relative flex size-1.5" aria-hidden>
        <span className="absolute inline-flex size-full rounded-full bg-white/70 opacity-0 group-hover:animate-ping group-hover:opacity-100 motion-reduce:animate-none" />
        <span className="relative inline-flex size-1.5 rounded-full bg-white" />
      </span>
      {conditionLabel[condition]}
    </span>
  )
}

const gradeStyle: Record<Grade, string> = {
  excellent: 'bg-teal-100 text-teal-900',
  'very-good': 'bg-brand-100 text-blue-900',
  good: 'bg-amber-100 text-amber-900',
  fair: 'bg-orange-100 text-orange-900',
}

export function GradeBadge({ grade, prefix, className }: { grade: Grade; prefix?: boolean; className?: string }) {
  return (
    <span
      className={cn('inline-flex h-6 items-center rounded-full px-2.5 text-xs font-bold whitespace-nowrap', gradeStyle[grade], className)}
      title={gradeInfo[grade].description}
    >
      {prefix ? 'Grade: ' : ''}
      {gradeInfo[grade].label}
    </span>
  )
}

export function DemoTag({ dark, className }: { dark?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        'font-mono text-[10px] font-semibold tracking-[0.08em] uppercase',
        dark ? 'text-slate-400' : 'text-slate-500',
        className,
      )}
    >
      Demo listing
    </span>
  )
}
