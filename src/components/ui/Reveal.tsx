import { motion, useInView, type Variants } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * In-view trigger with a safety net: if the element has already been scrolled past (fast scroll,
 * anchor jumps, programmatic scrolling) without an intersection event, it is revealed anyway,
 * so content can never stay invisible.
 */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' })
  const [passed, setPassed] = useState(false)
  useEffect(() => {
    if (inView || passed) return
    const check = () => {
      const r = ref.current?.getBoundingClientRect()
      if (r && r.top < window.innerHeight) setPassed(true)
    }
    const t = window.setTimeout(check, 1200)
    window.addEventListener('scroll', check, { passive: true })
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('scroll', check)
    }
  }, [inView, passed])
  return [ref, inView || passed] as const
}

const variants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (delay: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay } }),
}

/** Scroll-triggered fade-up. Content is always in the DOM (SEO-safe) and respects reduced motion via MotionConfig. */
export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const [ref, show] = useReveal()
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={show ? 'show' : 'hidden'}
      variants={variants}
      custom={delay}
    >
      {children}
    </motion.div>
  )
}

/** Container that staggers its <RevealItem> children. */
export function RevealGroup({ children, className, stagger = 0.06 }: { children: ReactNode; className?: string; stagger?: number }) {
  const [ref, show] = useReveal()
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={show ? 'show' : 'hidden'}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  )
}
