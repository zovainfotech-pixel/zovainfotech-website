import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { site } from '../config/site'

interface PageMeta {
  title: string
  description: string
  /** Set false for pages that should not be indexed (e.g. demo product pages, 404). */
  index?: boolean
  ogType?: 'website' | 'product' | 'article'
  image?: string
  /** Optional JSON-LD object. Only pass verified data. */
  jsonLd?: Record<string, unknown> | null
}

function setMeta(attr: 'name' | 'property', key: string, content: string | null) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (content === null) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

function setLink(rel: string, href: string | null) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (href === null) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    document.head.appendChild(el)
  }
  el.href = href
}

/**
 * Sets the document title, description, robots, canonical and Open Graph tags.
 * Canonical / og:url are only emitted when `site.siteUrl` is configured.
 */
export function usePageMeta({ title, description, index = true, ogType = 'website', image = '/brand/og-image.jpg', jsonLd }: PageMeta) {
  const { pathname } = useLocation()

  useEffect(() => {
    const fullTitle = pathname === '/' ? `${site.tagline} | ${site.shortName}` : `${title} | ${site.shortName}`
    document.title = fullTitle
    const url = site.siteUrl ? `${site.siteUrl.replace(/\/$/, '')}${pathname === '/' ? '/' : pathname}` : null

    setMeta('name', 'description', description)
    setMeta('name', 'robots', index ? 'index, follow' : 'noindex, follow')
    setLink('canonical', url)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:type', ogType)
    setMeta('property', 'og:site_name', site.shortName)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', image ? (site.siteUrl ? new URL(image, site.siteUrl).toString() : image) : null)
    setMeta('name', 'twitter:card', 'summary_large_image')

    const id = 'page-jsonld'
    document.getElementById(id)?.remove()
    if (jsonLd) {
      const s = document.createElement('script')
      s.type = 'application/ld+json'
      s.id = id
      s.textContent = JSON.stringify(jsonLd)
      document.head.appendChild(s)
    }
  }, [title, description, index, ogType, image, jsonLd, pathname])
}
