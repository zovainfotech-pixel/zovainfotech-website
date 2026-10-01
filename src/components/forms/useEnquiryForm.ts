import { useCallback, useRef, useState, type FormEvent } from 'react'
import { submitEnquiry, type EnquiryKind, type EnquiryResult } from '../../lib/enquiry'
import type { Errors } from '../../lib/validation'

type Phase = 'idle' | 'submitting' | 'done'

/**
 * Shared state machine for every enquiry form:
 * values → validate → submit → result (sent | demo | error).
 */
export function useEnquiryForm<T extends object>(
  kind: EnquiryKind,
  initial: T,
  validateFn: (values: T) => Errors<T>,
) {
  const [values, setValues] = useState<T>(initial)
  const [errors, setErrors] = useState<Errors<T>>({})
  const [phase, setPhase] = useState<Phase>('idle')
  const [result, setResult] = useState<EnquiryResult | null>(null)
  const [honeypot, setHoneypot] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  // Guards against double clicks / repeated Enter before React re-renders the disabled button.
  const inFlight = useRef(false)
  // One id per form attempt; retries after an error reuse it so the server can de-duplicate.
  const submissionId = useRef(newId())

  const set = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      setValues((v) => ({ ...v, [key]: value }))
      setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e))
    },
    [],
  )

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      const errs = validateFn(values)
      const hasErrors = Object.values(errs).some(Boolean)
      setErrors(errs)
      if (hasErrors) {
        // Move focus to the first invalid control for keyboard and screen-reader users.
        requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
        return
      }
      if (inFlight.current) return
      inFlight.current = true
      setPhase('submitting')
      setResult(null)
      try {
        const res = await submitEnquiry(kind, values as Record<string, unknown>, { submissionId: submissionId.current, hp: honeypot })
        setResult(res)
        // On error the values stay in the form so the visitor can retry without retyping.
        setPhase(res.status === 'error' ? 'idle' : 'done')
        if (res.status === 'error') requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[role="alert"]')?.scrollIntoView({ block: 'center', behavior: 'smooth' }))
      } finally {
        inFlight.current = false
      }
    },
    [values, validateFn, honeypot, kind],
  )

  const reset = useCallback(() => {
    submissionId.current = newId()
    setValues(initial)
    setErrors({})
    setResult(null)
    setPhase('idle')
  }, [initial])

  return { values, set, setValues, errors, phase, result, onSubmit, reset, formRef, honeypot, setHoneypot }
}

function newId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}
