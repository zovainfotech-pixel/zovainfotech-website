import { LoaderCircle } from 'lucide-react'
import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

const control =
  'w-full rounded-xl border bg-white px-3.5 text-[15px] text-ink placeholder:text-slate-400 transition-[border-color,box-shadow] outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-600/15 disabled:bg-slate-50'

interface FieldProps {
  label: string
  error?: string
  hint?: string
  optional?: boolean
  className?: string
}

function FieldShell({
  id,
  label,
  error,
  hint,
  optional,
  className,
  children,
}: FieldProps & { id: string; children: ReactNode }) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-[13.5px] font-bold text-ink">
        {label} {optional && <span className="font-medium text-muted">(optional)</span>}
      </label>
      {children}
      {hint && !error && (
        <span id={`${id}-hint`} className="text-[12.5px] text-muted">
          {hint}
        </span>
      )}
      {error && (
        <span id={`${id}-err`} className="text-[12.5px] font-semibold text-red-700">
          {error}
        </span>
      )}
    </div>
  )
}

function describedBy(id: string, error?: string, hint?: string) {
  return error ? `${id}-err` : hint ? `${id}-hint` : undefined
}

export function TextField({
  label,
  error,
  hint,
  optional,
  className,
  ...input
}: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} optional={optional} className={className}>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={describedBy(id, error, hint)}
        required={!optional}
        className={cn(control, 'h-12', error ? 'border-red-400' : 'border-slate-300')}
        {...input}
      />
    </FieldShell>
  )
}

export function SelectField({
  label,
  error,
  hint,
  optional,
  className,
  options,
  placeholder,
  ...select
}: FieldProps & SelectHTMLAttributes<HTMLSelectElement> & { options: readonly string[]; placeholder?: string }) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} optional={optional} className={className}>
      <select
        id={id}
        aria-invalid={!!error}
        aria-describedby={describedBy(id, error, hint)}
        required={!optional}
        className={cn(control, 'h-12 appearance-none bg-[length:18px] bg-[right_12px_center] bg-no-repeat pr-10', error ? 'border-red-400' : 'border-slate-300')}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
        }}
        {...select}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}

export function TextAreaField({
  label,
  error,
  hint,
  optional,
  className,
  ...ta
}: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} optional={optional} className={className}>
      <textarea
        id={id}
        aria-invalid={!!error}
        aria-describedby={describedBy(id, error, hint)}
        required={!optional}
        rows={4}
        className={cn(control, 'min-h-28 resize-y py-3', error ? 'border-red-400' : 'border-slate-300')}
        {...ta}
      />
    </FieldShell>
  )
}

export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: readonly T[]
  onChange: (v: T) => void
}) {
  const name = useId()
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="mb-1.5 text-[13.5px] font-bold text-ink">{label}</legend>
      <div className="grid grid-cols-2 gap-2 sm:flex">
        {options.map((o) => (
          <label
            key={o}
            className={cn(
              'relative flex h-12 cursor-pointer items-center justify-center rounded-xl border px-5 text-[14.5px] font-bold transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-600/25 sm:flex-1',
              value === o ? 'border-navy-950 bg-navy-950 text-white' : 'border-slate-300 bg-white text-ink hover:border-slate-400',
            )}
          >
            <input type="radio" name={name} value={o} checked={value === o} onChange={() => onChange(o)} className="sr-only" />
            {o}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function Checkbox({
  checked,
  onChange,
  children,
  error,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  children: ReactNode
  error?: string
}) {
  const id = useId()
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          className="mt-0.5 size-5 shrink-0 cursor-pointer accent-brand-600"
        />
        <label htmlFor={id} className="cursor-pointer text-sm leading-relaxed text-slate-600">
          {children}
        </label>
      </div>
      {error && (
        <span id={`${id}-err`} className="text-[12.5px] font-semibold text-red-700">
          {error}
        </span>
      )}
    </div>
  )
}

/** Hidden honeypot field — bots fill it, humans never see it. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Leave this field empty
        <input tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  )
}

export function SubmitButton({ loading, children, className }: { loading: boolean; children: ReactNode; className?: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      aria-busy={loading}
      className={cn(
        'inline-flex h-[54px] items-center justify-center gap-2 rounded-xl bg-brand-600 bg-gradient-to-r from-brand-600 to-violet-accent px-7 text-base font-bold text-white shadow-[0_12px_28px_-10px_rgb(12_93_174/0.75)] transition-[filter,transform] hover:brightness-110 active:scale-[0.98] disabled:opacity-70',
        className,
      )}
    >
      {loading && <LoaderCircle size={18} className="animate-spin" aria-hidden />}
      {loading ? 'Submitting…' : children}
    </button>
  )
}
