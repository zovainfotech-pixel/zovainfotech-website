import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { ArrowUp, MessageCircle } from 'lucide-react'
import { Suspense, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { site } from '../../config/site'
import { whatsappLink } from '../../lib/contact'
import { ToastProvider } from '../ui/Toast'
import { CompareProvider } from '../headsets/Compare'
import { PageSkeleton } from '../ui/Skeleton'
import { AnnouncementBar, Header } from './Header'
import { Footer } from './Footer'

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView()
      return
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

function WhatsAppFab() {
  const href = whatsappLink(site.contact.whatsappGreeting)
  if (!href) return null
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp (opens in a new tab)"
      className="fixed right-4 bottom-20 z-40 flex size-14 items-center justify-center rounded-full bg-[#1FAF38] text-white shadow-[0_12px_30px_-10px_rgb(0_0_0/0.45)] transition-transform hover:scale-105 sm:right-6 sm:bottom-24"
    >
      <MessageCircle size={26} />
    </a>
  )
}

function BackToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const on = () => setShow(window.scrollY > 900)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}
          aria-label="Back to top"
          className="fixed right-4 bottom-4 z-40 flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-violet-accent text-white shadow-[0_14px_30px_-10px_rgb(12_93_174/0.8)] sm:right-6 sm:bottom-6"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export function Layout() {
  const { pathname } = useLocation()
  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <CompareProvider>
        <button
          type="button"
          onClick={() => document.getElementById('main')?.focus()}
          className="sr-only z-[100] rounded-lg bg-brand-600 px-4 py-3 font-bold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to main content
        </button>
        <ScrollManager />
        <AnnouncementBar />
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          <Suspense fallback={<PageSkeleton />}>
            <motion.div key={pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, ease: 'easeOut' }}>
              <Outlet />
            </motion.div>
          </Suspense>
        </main>
        <Footer />
        <WhatsAppFab />
        <BackToTop />
        </CompareProvider>
      </ToastProvider>
    </MotionConfig>
  )
}
