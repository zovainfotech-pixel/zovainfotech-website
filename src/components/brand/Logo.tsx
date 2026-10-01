import { cn } from '../../lib/cn'

/**
 * Official Zova Infotech logo (supplied artwork, processed by scripts/brand/process_logo.py).
 * - default: full-colour wordmark for light backgrounds
 * - dark: white wordmark variant for dark backgrounds
 * - tagline: includes "Complete IT Solutions & Procurement Partner"
 */
const BASE = import.meta.env.VITE_IMAGE_BASE || '/'

const files = {
  logo: { src: 'brand/zova-logo', w: 720, h: 187 },
  logoLight: { src: 'brand/zova-logo-light', w: 720, h: 187 },
  tagline: { src: 'brand/zova-logo-tagline', w: 900, h: 294 },
  taglineLight: { src: 'brand/zova-logo-tagline-light', w: 900, h: 294 },
  mark: { src: 'brand/zova-mark', w: 364, h: 364 },
}

function BrandImg({ f, className, alt = 'Zova Infotech', eager = true }: { f: (typeof files)[keyof typeof files]; className?: string; alt?: string; eager?: boolean }) {
  return (
    <picture>
      <source srcSet={`${BASE}${f.src}.webp`} type="image/webp" />
      <img
        src={`${BASE}${f.src}.png`}
        alt={alt}
        width={f.w}
        height={f.h}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={cn('block max-w-full select-none', className)}
        draggable={false}
      />
    </picture>
  )
}

export function LogoMark({ size = 38, className }: { size?: number; className?: string }) {
  return (
    <span style={{ width: size, height: size }} className={cn('inline-block shrink-0', className)}>
      <BrandImg f={files.mark} alt="" className="size-full" />
    </span>
  )
}

export function Logo({
  dark,
  compact,
  tagline,
  className,
}: {
  dark?: boolean
  /** Smaller rendering for tight spaces (mobile header, drawer). */
  compact?: boolean
  tagline?: boolean
  className?: string
}) {
  const f = tagline ? (dark ? files.taglineLight : files.tagline) : dark ? files.logoLight : files.logo
  return (
    <span className={cn('inline-flex items-center', className)}>
      <BrandImg
        f={f}
        className={cn(tagline ? 'h-auto w-[260px] sm:w-[300px]' : compact ? 'h-9 w-auto' : 'h-11 w-auto lg:h-12')}
      />
    </span>
  )
}
