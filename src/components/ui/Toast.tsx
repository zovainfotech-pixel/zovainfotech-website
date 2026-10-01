import { AnimatePresence, motion } from 'motion/react'
import { CircleAlert, Check, Info, X } from 'lucide-react'
import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { ToastCtx, type Tone } from './toast-context'

interface Toast {
  id: number
  message: string
  tone: Tone
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), [])
  const push = useCallback(
    (message: string, tone: Tone = 'info') => {
      const id = Date.now() + Math.random()
      setToasts((t) => [...t.slice(-2), { id, message, tone }])
      setTimeout(() => dismiss(id), 4200)
    },
    [dismiss],
  )
  const value = useMemo(() => push, [push])

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        role="status"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[80] flex flex-col items-center gap-2 px-4 sm:right-6 sm:left-auto sm:items-end"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.22 }}
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-white/10 bg-navy-950 px-4 py-3.5 text-sm text-white shadow-[var(--shadow-float)]"
            >
              <span
                className={
                  t.tone === 'success' ? 'text-emerald-400' : t.tone === 'error' ? 'text-rose-400' : 'text-cyan-accent'
                }
              >
                {t.tone === 'success' ? <Check size={18} /> : t.tone === 'error' ? <CircleAlert size={18} /> : <Info size={18} />}
              </span>
              <span className="flex-1 leading-snug">{t.message}</span>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="-m-1 rounded-md p-1 text-slate-400 hover:text-white"
                aria-label="Dismiss notification"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  )
}
