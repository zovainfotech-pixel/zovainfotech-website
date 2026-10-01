import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react'
import { ArrowRight, Cctv, Mail, Phone, ChevronDown, ClipboardList, Cloud, Headset, Menu, MonitorPlay, Network, Search, ShieldCheck, Video, X, type LucideIcon } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { site } from '../../config/site'
import { categories } from '../../data/categories'
import { paths } from '../../data/routes'
import { cn } from '../../lib/cn'
import { categoryIcon } from '../brand/icons'
import { SmartImage } from '../ui/SmartImage'
import { Logo } from '../brand/Logo'
import { Button } from '../ui/Button'
import { mailLink, telLink } from '../../lib/contact'
import { mainNav, navActive, productGroups, solutionLinks, type MenuKind, type NavItem, type SolutionLink } from './nav'
import { SearchDialog } from './SearchDialog'

/** Slim contact strip above the main header: phone and email on every page, tagline on wide screens. */
export function AnnouncementBar() {
  const tel = telLink()
  const mail = mailLink('Enquiry from website')
  return (
    <div className="on-dark relative overflow-hidden border-b border-white/5 bg-[linear-gradient(90deg,#0b1f3f,#123b73_40%,#0d4f9c_70%,#0b1f3f)] bg-[length:200%_100%] animate-grad text-[12.5px] text-slate-200 sm:text-[13px]">
      <div className="container-x flex min-h-10 items-center justify-between gap-4 py-1.5">
        <span className="hidden items-center gap-2 lg:flex">
          <span className="size-1.5 rounded-full bg-cyan-accent" aria-hidden />
          {site.tagline} <span className="text-slate-400">· {site.coverage}</span>
        </span>
        <ul className="flex w-full items-center justify-center gap-x-5 gap-y-1 sm:justify-start lg:w-auto lg:justify-end" aria-label="Contact details">
          {tel && (
            <li>
              <a href={tel} className="group inline-flex items-center gap-1.5 font-semibold whitespace-nowrap text-white transition-colors hover:text-cyan-accent" aria-label={`Call ${site.contact.phoneDisplay}`}>
                <Phone size={14} className="text-cyan-accent transition-transform group-hover:-rotate-12" aria-hidden />
                {site.contact.phoneDisplay}
              </a>
            </li>
          )}
          {mail && (
            <li>
              <a href={mail} className="group inline-flex items-center gap-1.5 font-semibold whitespace-nowrap text-white transition-colors hover:text-cyan-accent" aria-label={`Email ${site.contact.email}`}>
                <Mail size={14} className="text-cyan-accent transition-transform group-hover:-translate-y-0.5" aria-hidden />
                <span className="max-[359px]:hidden">{site.contact.email}</span>
                <span className="hidden max-[359px]:inline">Email</span>
              </a>
            </li>
          )}
          <li className="hidden md:block">
            <Link to={paths.quote} className="font-bold whitespace-nowrap text-cyan-accent hover:text-white">
              Request a quote →
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

const solutionIcon: Record<SolutionLink['icon'], LucideIcon> = {
  network: Network,
  shield: ShieldCheck,
  cloud: Cloud,
  video: Video,
  signage: MonitorPlay,
  cctv: Cctv,
  headset: Headset,
  procure: ClipboardList,
}

function MenuAside({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="on-dark aurora relative flex flex-col gap-4 overflow-hidden p-7 text-white">
      <span className="eyebrow text-cyan-accent">Can’t find it?</span>
      <p className="font-display text-xl leading-snug font-bold">We source across multiple vendors — tell us the exact model you need.</p>
      <p className="text-sm text-on-dark">Availability and pricing are confirmed in your quotation.</p>
      <SmartImage k="laptopPerformance" alt="" sizes="260px" className="my-1 w-[82%] self-center drop-shadow-[0_20px_30px_rgb(0_0_0/0.5)]" />
      <div className="mt-auto flex flex-col gap-2">
        <Button to={paths.quote} onClick={onNavigate} size="sm" iconRight={<ArrowRight size={16} />}>
          Request a Quote
        </Button>
        <Button to={paths.products} onClick={onNavigate} size="sm" variant="ghost-dark">
          View all products
        </Button>
      </div>
    </div>
  )
}

function ProductsMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="grid grid-cols-[1fr_300px] overflow-hidden rounded-b-3xl border border-t-0 border-line bg-white shadow-[0_40px_80px_-30px_rgb(4_22_52/0.45)]">
      <div className="flex flex-col gap-5 p-7">
        <ul className="grid grid-cols-4 gap-x-6 gap-y-7">
          {productGroups.map((g, i) => (
            <motion.li key={g.title} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.025 * i, duration: 0.22 }}>
              <Link to={g.to} onClick={onNavigate} className="group flex items-center gap-1.5 text-[12px] font-bold tracking-[0.12em] text-brand-700 uppercase">
                {g.title}
                <ArrowRight size={13} className="opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden />
              </Link>
              <ul className="mt-2.5 flex flex-col gap-1">
                {g.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} onClick={onNavigate} className="block rounded-md py-1 text-[14px] font-medium text-slate-700 transition-colors hover:text-brand-600">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
          <li className="rounded-2xl border border-dashed border-brand-200 bg-brand-50/60 p-4">
            <p className="text-[12px] font-bold tracking-[0.12em] text-brand-700 uppercase">All categories</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{categories.length} product categories, new and refurbished.</p>
            <Link to={paths.products} onClick={onNavigate} className="mt-2 inline-flex items-center gap-1 text-[13.5px] font-bold text-brand-600 hover:text-brand-700">
              Browse catalogue <ArrowRight size={14} aria-hidden />
            </Link>
          </li>
        </ul>
        <ul className="flex flex-wrap gap-2 border-t border-line pt-5" aria-label="Product categories">
          {categories.map((c) => {
            const Icon = categoryIcon[c.slug]
            return (
              <li key={c.slug}>
                <Link
                  to={paths.category(c.slug)}
                  onClick={onNavigate}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[12.5px] font-semibold text-slate-700 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                >
                  <Icon size={13} className="text-brand-600" aria-hidden />
                  {c.shortName}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
      <MenuAside onNavigate={onNavigate} />
    </div>
  )
}

function SolutionsMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="grid grid-cols-[1fr_300px] overflow-hidden rounded-b-3xl border border-t-0 border-line bg-white shadow-[0_40px_80px_-30px_rgb(4_22_52/0.45)]">
      <ul className="grid grid-cols-2 gap-2 p-6 xl:grid-cols-4">
        {solutionLinks.map((s, i) => {
          const Icon = solutionIcon[s.icon]
          return (
            <motion.li key={s.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.025 * i, duration: 0.22 }}>
              <Link to={s.to} onClick={onNavigate} className="group flex h-full items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-[var(--background-primary)]">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-white transition-transform group-hover:scale-105">
                  <Icon size={18} aria-hidden />
                </span>
                <span>
                  <span className="block text-[14px] leading-snug font-bold text-ink group-hover:text-brand-700">{s.label}</span>
                  <span className="text-[12.5px] text-muted">{s.text}</span>
                </span>
              </Link>
            </motion.li>
          )
        })}
      </ul>
      <MenuAside onNavigate={onNavigate} />
    </div>
  )
}

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { pathname, search } = useLocation()
  const panelRef = useRef<HTMLDivElement>(null)
  const [openGroup, setOpenGroup] = useState<MenuKind | null>(null)

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    setTimeout(() => panelRef.current?.querySelector<HTMLElement>('button, a')?.focus(), 50)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
      prev?.focus?.()
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[60] nav:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm" onClick={onClose} aria-hidden />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white shadow-2xl"
          >
            <div className="flex h-16 items-center justify-between border-b border-line px-4">
              <Logo compact />
              <button
                type="button"
                onClick={onClose}
                className="flex size-11 items-center justify-center rounded-xl border border-line"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Mobile">
              <ul className="flex flex-col">
                {mainNav.map((item) =>
                  item.mega ? (
                    <li key={item.label}>
                      <button
                        type="button"
                        onClick={() => setOpenGroup((v) => (v === item.mega ? null : item.mega!))}
                        aria-expanded={openGroup === item.mega}
                        className="flex min-h-12 w-full items-center justify-between rounded-xl px-3 text-base font-bold"
                      >
                        {item.label}
                        <ChevronDown size={18} className={cn('transition-transform', openGroup === item.mega && 'rotate-180')} />
                      </button>
                      <AnimatePresence initial={false}>
                        {openGroup === item.mega && item.mega === 'solutions' && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden pl-3"
                          >
                            {solutionLinks.map((l) => {
                              const Icon = solutionIcon[l.icon]
                              return (
                                <li key={l.label}>
                                  <Link to={l.to} onClick={onClose} className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-[15px] text-slate-700">
                                    <Icon size={17} className="text-muted" aria-hidden />
                                    {l.label}
                                  </Link>
                                </li>
                              )
                            })}
                          </motion.ul>
                        )}
                        {openGroup === item.mega && item.mega === 'products' && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden pl-3"
                          >
                            <li>
                              <NavLink to={paths.products} end onClick={onClose} className="flex min-h-11 items-center rounded-lg px-3 text-[15px] font-semibold text-brand-700">
                                All products
                              </NavLink>
                            </li>
                            {categories.map((c) => {
                              const Icon = categoryIcon[c.slug]
                              return (
                                <li key={c.slug}>
                                  <NavLink
                                    to={paths.category(c.slug)}
                                    onClick={onClose}
                                    className={({ isActive }) =>
                                      cn('flex min-h-11 items-center gap-3 rounded-lg px-3 text-[15px]', isActive ? 'bg-brand-50 font-bold text-brand-700' : 'text-slate-700')
                                    }
                                  >
                                    <Icon size={17} className="text-muted" aria-hidden />
                                    {c.shortName}
                                  </NavLink>
                                </li>
                              )
                            })}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </li>
                  ) : (
                    <li key={item.label}>
                      <Link
                        to={item.to}
                        onClick={onClose}
                        aria-current={navActive(item, pathname, search) ? 'page' : undefined}
                        className={cn(
                          'flex min-h-12 items-center rounded-xl px-3 text-base font-bold',
                          navActive(item, pathname, search) ? 'bg-brand-50 text-brand-700' : 'text-ink',
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </nav>
            <div className="flex flex-col gap-2 border-t border-line p-4">
              <Button to={paths.quote} onClick={onClose}>
                Request a Quote
              </Button>
              <Button to={paths.contact} onClick={onClose} variant="secondary">
                Talk to an IT Expert
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Full label on wide screens; condensed label between the nav breakpoint and 2xl. */
function NavLabel({ item }: { item: NavItem }) {
  if (item.short === undefined) return <>{item.label}</>
  return (
    <>
      {item.short && <span className="2xl:hidden">{item.short}</span>}
      <span className="hidden 2xl:inline">{item.label}</span>
    </>
  )
}

export function Header() {
  const [menu, setMenu] = useState<MenuKind | null>(null)
  const menuRef = useRef<MenuKind | null>(null)
  useEffect(() => {
    menuRef.current = menu
  }, [menu])
  const megaOpen = menu !== null
  const setMegaOpen = (v: false) => setMenu(v || null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const closeTimer = useRef<number | undefined>(undefined)
  const megaRef = useRef<HTMLDivElement>(null)
  const { pathname, search } = useLocation()

  useEffect(() => {
    // Hysteresis avoids flicker when the compact header changes the page height.
    const onScroll = () => setScrolled((was) => (was ? window.scrollY > 8 : window.scrollY > 48))
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menus on route change (state adjusted during render rather than in an effect).
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setMegaOpen(false)
    setDrawerOpen(false)
  }

  useEffect(() => {
    if (!megaOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMegaOpen(false)
    const onClick = (e: MouseEvent) => !megaRef.current?.contains(e.target as Node) && setMegaOpen(false)
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [megaOpen])

  const hoverOpenedAt = useRef(0)
  const openMega = (kind: MenuKind, t: number) => {
    window.clearTimeout(closeTimer.current)
    if (menuRef.current !== kind) hoverOpenedAt.current = t
    menuRef.current = kind
    setMenu(kind)
  }
  // A click right after a hover-open must not immediately close the menu; otherwise it toggles (keyboard / touch).
  const clickMega = (kind: MenuKind, t: number) => {
    const next = t - hoverOpenedAt.current < 400 ? kind : menuRef.current === kind ? null : kind
    menuRef.current = next
    setMenu(next)
  }
  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setMegaOpen(false), 140)
  }
  const closeSearch = useCallback(() => setSearchOpen(false), [])
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  // Dark, see-through header while resting on a dark page hero; light glass once scrolled (product pages start light).
  // The homepage hero is light, so the header starts light there too.
  const dark = !scrolled && !megaOpen && !pathname.startsWith('/product/') && pathname !== '/'

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 border-b backdrop-blur-xl transition-[background-color,box-shadow,border-color] duration-300',
          dark
            ? 'on-dark border-white/10 bg-hero'
            : scrolled
              ? 'border-line bg-white/90 shadow-[0_10px_30px_-18px_rgb(11_18_32/0.25)]'
              : 'border-line bg-white/95',
        )}
      >
        <div ref={megaRef} onMouseLeave={scheduleClose}>
          <div
            className={cn(
              'mx-auto flex w-full max-w-[1400px] items-center gap-6 px-4 transition-[height] duration-300 sm:px-6 lg:px-8',
              scrolled ? 'h-14 lg:h-16' : 'h-16 lg:h-20',
            )}
          >
            <Link to="/" aria-label={`${site.shortName} — home`} className="shrink-0 rounded-lg">
              <span className="hidden sm:block">
                <Logo dark={dark} />
              </span>
              <span className="sm:hidden">
                <Logo dark={dark} compact />
              </span>
            </Link>

            <nav aria-label="Main" className="ml-2 hidden flex-1 items-center nav:flex">
              <ul className="flex items-center min-[1880px]:gap-1">
                {mainNav.map((item) =>
                  item.mega ? (
                    <li key={item.label} onMouseEnter={(e) => openMega(item.mega!, e.timeStamp)}>
                      <button
                        type="button"
                        aria-expanded={menu === item.mega}
                        aria-haspopup="true"
                        onClick={(e) => clickMega(item.mega!, e.timeStamp)}
                        className={cn(
                          'relative flex h-10 items-center gap-1 rounded-lg px-3 text-[14.5px] font-semibold whitespace-nowrap transition-colors',
                          navActive(item, pathname, search) || menu === item.mega
                            ? dark
                              ? 'text-cyan-accent'
                              : 'text-brand-600'
                            : dark
                              ? 'text-white/85 hover:text-white'
                              : 'text-ink hover:text-brand-600',
                        )}
                      >
                        <NavLabel item={item} />
                        <ChevronDown size={15} className={cn('transition-transform duration-200', menu === item.mega && 'rotate-180')} aria-hidden />
                        {navActive(item, pathname, search) && <ActiveBar />}
                      </button>
                    </li>
                  ) : (
                    <li key={item.label} onMouseEnter={scheduleClose}>
                      <Link
                        to={item.to}
                        aria-current={navActive(item, pathname, search) ? 'page' : undefined}
                        className={cn(
                          'relative flex h-10 items-center rounded-lg px-3 text-[14.5px] font-semibold whitespace-nowrap transition-colors',
                          navActive(item, pathname, search)
                            ? dark
                              ? 'text-cyan-accent'
                              : 'text-brand-600'
                            : dark
                              ? 'text-white/85 hover:text-white'
                              : 'text-ink hover:text-brand-600',
                        )}
                      >
                        <NavLabel item={item} />
                        {navActive(item, pathname, search) && <ActiveBar />}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </nav>

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className={cn(
                  'flex size-11 items-center justify-center rounded-xl border transition-colors',
                  dark ? 'border-white/20 text-white hover:border-white/50' : 'border-line text-ink hover:border-slate-400',
                )}
                aria-label="Search products, solutions or services"
              >
                <Search size={19} />
              </button>
              <span className="hidden sm:block">
                <Button to={paths.quote} size="sm" className="h-11 px-5">
                  Request a Quote
                </Button>
              </span>
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className={cn('flex size-11 items-center justify-center rounded-xl text-white nav:hidden', dark ? 'bg-white/10' : 'bg-navy-950')}
                aria-label="Open menu"
                aria-expanded={drawerOpen}
              >
                <Menu size={20} />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {megaOpen && (
              <motion.div
                className="absolute inset-x-0 top-full hidden nav:block"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                onMouseEnter={() => window.clearTimeout(closeTimer.current)}
              >
                <div className="container-x">
                  {menu === 'solutions' ? <SolutionsMenu onNavigate={() => setMenu(null)} /> : <ProductsMenu onNavigate={() => setMenu(null)} />}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <ScrollProgress />
      </header>
      <MobileDrawer open={drawerOpen} onClose={closeDrawer} />
      <SearchDialog open={searchOpen} onClose={closeSearch} />
    </>
  )
}

function ActiveBar() {
  return (
    <motion.span
      layoutId="nav-active"
      className="absolute inset-x-2.5 -bottom-0.5 h-[3px] rounded-full bg-gradient-to-r from-brand-600 via-cyan-accent to-violet-accent"
      aria-hidden
    />
  )
}

/** Thin reading-progress bar along the bottom edge of the header. */
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })
  return (
    <motion.div
      style={{ scaleX }}
      className="absolute inset-x-0 -bottom-px h-[2px] origin-left bg-gradient-to-r from-brand-600 via-cyan-accent to-purple-accent"
      aria-hidden
    />
  )
}
