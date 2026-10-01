export type Errors<T> = Partial<Record<keyof T, string>>

export const validators = {
  required: (label: string) => (v: unknown) =>
    (typeof v === 'string' ? v.trim().length === 0 : v === undefined || v === null || v === false)
      ? `${label} is required.`
      : undefined,
  name: (v: string) => (v.trim().length < 2 ? 'Please enter your full name.' : undefined),
  email: (v: string) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? undefined : 'Enter a valid email address.'),
  /** Indian mobile: 10 digits starting 6–9, optional +91 / 0 prefix. */
  mobile: (v: string) =>
    /^[6-9]\d{9}$/.test(normaliseMobile(v)) ? undefined : 'Enter a valid 10-digit Indian mobile number.',
  pin: (v: string) => (v === '' || /^[1-9]\d{5}$/.test(v.trim()) ? undefined : 'Enter a valid 6-digit PIN code.'),
  pinRequired: (v: string) => (/^[1-9]\d{5}$/.test(v.trim()) ? undefined : 'Enter a valid 6-digit PIN code.'),
  quantity: (v: string) => {
    const n = Number(v)
    return Number.isInteger(n) && n >= 1 && n <= 100000 ? undefined : 'Enter a quantity of 1 or more.'
  },
  futureDate: (v: string) => {
    if (!v) return undefined
    const d = new Date(v + 'T00:00:00')
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return d < today ? 'Choose today or a future date.' : undefined
  },
  consent: (v: boolean) => (v ? undefined : 'Please accept the privacy notice to continue.'),
  gstin: (v: string) =>
    v === '' || /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(v.trim().toUpperCase())
      ? undefined
      : 'Enter a valid 15-character GSTIN, or leave blank.',
  url: (v: string) => (v === '' || /^https?:\/\/[^\s.]+\.[^\s]+$/.test(v.trim()) ? undefined : 'Enter a full URL starting with https://'),
  maxLen: (n: number) => (v: string) => (v.length > n ? `Please keep this under ${n} characters.` : undefined),
}

export function normaliseMobile(v: string) {
  return v.replace(/[\s()-]/g, '').replace(/^(\+91|0091|91(?=\d{10}$)|0)/, '')
}

type Rule<V> = (v: V) => string | undefined

export function validate<T extends object>(values: T, rules: { [K in keyof T]?: Rule<T[K]>[] }): Errors<T> {
  const errors: Errors<T> = {}
  for (const key in rules) {
    for (const rule of rules[key] ?? []) {
      const msg = rule(values[key])
      if (msg) {
        errors[key] = msg
        break
      }
    }
  }
  return errors
}
