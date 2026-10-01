import { createContext, useContext } from 'react'

export type Tone = 'success' | 'info' | 'error'

export const ToastCtx = createContext<(message: string, tone?: Tone) => void>(() => {})

/** Show a short, non-blocking notification for local UI actions. */
export function useToast() {
  return useContext(ToastCtx)
}
