import { useState } from 'react'
import { media, type MediaKey } from '../../data/media'
import { cn } from '../../lib/cn'
import { DeviceArt } from '../brand/DeviceArt'

/**
 * Registry-backed image with explicit dimensions (no layout shift), lazy
 * loading, a soft fade-in, and an illustrated fallback if the file fails.
 */
export function SmartImage({
  k,
  src,
  alt,
  className,
  eager,
  sizes = '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 90vw',
  tone = 'light',
}: {
  k?: MediaKey
  src?: string
  alt?: string
  className?: string
  eager?: boolean
  sizes?: string
  tone?: 'light' | 'dark'
}) {
  const m = k ? media[k] : undefined
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const url = src ?? m?.src
  if (!url || failed) {
    return <DeviceArt kind={m?.art ?? 'laptop'} tone={tone} className={cn('mx-auto w-[62%]', className)} />
  }
  return (
    <img
      src={url}
      alt={alt ?? m?.alt ?? ''}
      width={m?.width ?? 1000}
      height={m?.height ?? 750}
      sizes={sizes}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : undefined}
      ref={(el) => {
        if (el?.complete && el.naturalWidth > 0 && !loaded) setLoaded(true)
      }}
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      className={cn('h-auto max-w-full transition-opacity duration-500', loaded ? 'opacity-100' : 'opacity-0', className)}
    />
  )
}
