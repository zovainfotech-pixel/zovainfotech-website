import type { ComponentProps, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost-dark' | 'dark' | 'white' | 'link'
type Size = 'sm' | 'md' | 'lg'

const base =
  'group/btn inline-flex items-center justify-center gap-2 rounded-xl font-bold whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 motion-reduce:active:scale-100'

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-brand-600 via-brand-500 to-violet-accent bg-[length:200%_100%] bg-left text-white shadow-[0_10px_28px_-10px_rgb(12_93_174/0.75)] transition-[background-position,box-shadow,transform] duration-500 hover:bg-right hover:shadow-[0_14px_34px_-10px_rgb(16_165_230/0.8)]',
  secondary: 'border border-line bg-white text-ink hover:border-brand-400 hover:text-brand-700',
  'ghost-dark': 'border border-white/20 bg-white/[0.07] text-white backdrop-blur hover:border-cyan-accent/50 hover:bg-white/[0.14]',
  dark: 'bg-navy-950 text-white hover:bg-navy-800',
  white: 'bg-white text-brand-700 hover:bg-brand-50',
  link: 'px-0! text-brand-600 hover:text-brand-700',
}

const sizes: Record<Size, string> = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-5 text-[15px]',
  lg: 'h-[54px] px-6 text-base',
}

interface Common {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
  iconRight?: ReactNode
}

type AsLink = Common & { to: string } & Omit<ComponentProps<typeof Link>, 'to' | 'className' | 'children'>
type AsAnchor = Common & { href: string } & Omit<ComponentProps<'a'>, 'href' | 'className' | 'children'>
type AsButton = Common & Omit<ComponentProps<'button'>, 'className' | 'children'>

export function Button(props: AsLink | AsAnchor | AsButton) {
  const { variant = 'primary', size = 'md', className, children, iconRight, ...rest } = props
  const cls = cn(base, variants[variant], sizes[size], className)
  const inner = (
    <>
      {children}
      {iconRight && (
        <span className="transition-transform duration-200 group-hover/btn:translate-x-0.5 motion-reduce:transform-none">{iconRight}</span>
      )}
    </>
  )
  if ('to' in rest) {
    return (
      <Link className={cls} {...(rest as Omit<AsLink, keyof Common>)}>
        {inner}
      </Link>
    )
  }
  if ('href' in rest) {
    const a = rest as Omit<AsAnchor, keyof Common>
    const external = /^https?:/.test(a.href)
    return (
      <a className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...a}>
        {inner}
      </a>
    )
  }
  const b = rest as Omit<AsButton, keyof Common>
  return (
    <button className={cls} type={b.type ?? 'button'} {...b}>
      {inner}
    </button>
  )
}
