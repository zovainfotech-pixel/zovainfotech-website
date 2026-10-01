import { AnimatePresence, motion } from 'motion/react'
import { Plus, Trash } from 'lucide-react'
import { useId, useMemo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { paths } from '../../data/routes'
import { cn } from '../../lib/cn'
import { validate, validators as v } from '../../lib/validation'
import { useToast } from '../ui/toast-context'
import { Checkbox, Honeypot, SelectField, SubmitButton, TextAreaField, TextField } from './fields'
import { DemoModeNotice, FormError, FormSuccess } from './FormResult'
import { useEnquiryForm } from './useEnquiryForm'

const itemCategories = [
  'Laptops (new)',
  'Laptops (refurbished)',
  'Desktops / workstations',
  'Monitors & displays',
  'Printers & scanners',
  'Networking',
  'Servers & storage',
  'Accessories',
  'Software licences',
  'Other',
] as const

const serviceOptions = ['Installation & configuration', 'Data migration', 'IT AMC', 'Network setup', 'Cybersecurity / DLP', 'Audio-visual / signage']

const orgTypes = ['Company / enterprise', 'Startup', 'School / college', 'Clinic / hospital', 'Retail', 'Hospitality', 'Training centre', 'Government / PSU', 'Other'] as const
const timelines = ['Within 1 week', '1–2 weeks', '2–4 weeks', '1–3 months', 'Planning / budgeting stage'] as const

interface LineItem {
  key: string
  category: string
  description: string
  quantity: string
  condition: string
}

interface CorpValues {
  fullName: string
  designation: string
  company: string
  orgType: string
  email: string
  mobile: string
  gstin: string
  items: LineItem[]
  services: string[]
  locations: string
  timeline: string
  brand: string
  budget: string
  notes: string
  consent: boolean
}

let counter = 0
const newItem = (): LineItem => ({ key: `li-${++counter}`, category: '', description: '', quantity: '', condition: 'New' })

export function CorporateForm() {
  const toast = useToast()
  const initial = useMemo<CorpValues>(
    () => ({
      fullName: '',
      designation: '',
      company: '',
      orgType: '',
      email: '',
      mobile: '',
      gstin: '',
      items: [newItem(), newItem()],
      services: [],
      locations: '',
      timeline: '',
      brand: '',
      budget: '',
      notes: '',
      consent: false,
    }),
    [],
  )

  const form = useEnquiryForm<CorpValues>('corporate', initial, (x) => {
    const errs = validate(x, {
      fullName: [v.name],
      company: [v.required('Organisation name')],
      orgType: [v.required('Organisation type')],
      email: [v.email],
      mobile: [v.mobile],
      gstin: [v.gstin],
      locations: [v.required('Delivery location(s)')],
      timeline: [v.required('Timeline')],
      consent: [v.consent],
    })
    const filled = x.items.filter((i) => i.category || i.description || i.quantity)
    if (filled.length === 0) errs.items = 'Add at least one item to your requirement.'
    else if (filled.some((i) => !i.category || !i.description.trim() || v.quantity(i.quantity)))
      errs.items = 'Each item needs a category, a description and a quantity of 1 or more.'
    return errs
  })
  const { values: x, set, errors: e, phase, result, formRef } = form

  if (phase === 'done' && result) return <FormSuccess result={result} onReset={form.reset} noun="procurement requirement" />

  const updateItem = (key: string, patch: Partial<LineItem>) => set('items', x.items.map((i) => (i.key === key ? { ...i, ...patch } : i)))
  const addItem = () => {
    set('items', [...x.items, newItem()])
    toast('Item row added', 'info')
  }
  const removeItem = (key: string) => set('items', x.items.filter((i) => i.key !== key))
  const toggleService = (s: string) => set('services', x.services.includes(s) ? x.services.filter((y) => y !== s) : [...x.services, s])
  const totalUnits = x.items.reduce((n, i) => n + (Number(i.quantity) || 0), 0)

  return (
    <form ref={formRef} onSubmit={form.onSubmit} noValidate className="relative flex flex-col gap-8" aria-label="Corporate procurement requirement">
      <DemoModeNotice />
      {result?.status === 'error' && <FormError message={result.message} />}

      <FormSection n="01" title="Your organisation">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Full name" autoComplete="name" value={x.fullName} onChange={(ev) => set('fullName', ev.target.value)} error={e.fullName} />
          <TextField label="Designation" optional value={x.designation} onChange={(ev) => set('designation', ev.target.value)} />
          <TextField label="Organisation name" autoComplete="organization" value={x.company} onChange={(ev) => set('company', ev.target.value)} error={e.company} />
          <SelectField label="Organisation type" options={orgTypes} placeholder="Select…" value={x.orgType} onChange={(ev) => set('orgType', ev.target.value)} error={e.orgType} />
          <TextField label="Business email" type="email" autoComplete="email" value={x.email} onChange={(ev) => set('email', ev.target.value)} error={e.email} />
          <TextField label="Mobile number" type="tel" autoComplete="tel-national" value={x.mobile} onChange={(ev) => set('mobile', ev.target.value)} error={e.mobile} />
          <TextField
            label="GSTIN"
            optional
            value={x.gstin}
            onChange={(ev) => set('gstin', ev.target.value.toUpperCase())}
            error={e.gstin}
            hint="For GST-compliant quotations"
            maxLength={15}
          />
        </div>
      </FormSection>

      <FormSection n="02" title="Items required" aside={totalUnits > 0 ? `${totalUnits} unit${totalUnits === 1 ? '' : 's'} across ${x.items.filter((i) => i.quantity).length} line(s)` : undefined}>
        <div className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {x.items.map((item, idx) => (
              <motion.div
                key={item.key}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <LineItemRow
                  index={idx}
                  item={item}
                  onChange={(patch) => updateItem(item.key, patch)}
                  onRemove={x.items.length > 1 ? () => removeItem(item.key) : undefined}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          {e.items && (
            <p className="text-[13px] font-semibold text-red-700" role="alert">
              {e.items}
            </p>
          )}
          <button
            type="button"
            onClick={addItem}
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 text-sm font-bold text-brand-700 transition-colors hover:border-brand-600 hover:bg-brand-50"
          >
            <Plus size={17} aria-hidden /> Add another item
          </button>
        </div>
      </FormSection>

      <FormSection n="03" title="Services & delivery">
        <fieldset>
          <legend className="mb-3 text-[13.5px] font-bold">Services needed <span className="font-medium text-muted">(optional)</span></legend>
          <div className="flex flex-wrap gap-2">
            {serviceOptions.map((s) => {
              const on = x.services.includes(s)
              return (
                <label
                  key={s}
                  className={cn(
                    'flex h-10 cursor-pointer items-center rounded-full border px-4 text-[13.5px] font-semibold transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-600/25',
                    on ? 'border-navy-950 bg-navy-950 text-white' : 'border-line hover:border-slate-400',
                  )}
                >
                  <input type="checkbox" className="sr-only" checked={on} onChange={() => toggleService(s)} />
                  {s}
                </label>
              )
            })}
          </div>
        </fieldset>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <TextField
            label="Delivery location(s)"
            value={x.locations}
            onChange={(ev) => set('locations', ev.target.value)}
            error={e.locations}
            placeholder="City / PIN code — list all sites"
            className="sm:col-span-2"
          />
          <SelectField label="Timeline" options={timelines} placeholder="Select…" value={x.timeline} onChange={(ev) => set('timeline', ev.target.value)} error={e.timeline} />
          <TextField label="Indicative budget" optional value={x.budget} onChange={(ev) => set('budget', ev.target.value)} placeholder="e.g. ₹5–8 lakh" />
          <TextField
            label="Preferred brand(s)"
            optional
            value={x.brand}
            onChange={(ev) => set('brand', ev.target.value)}
            placeholder="e.g. Dell, Lenovo, HP — or no preference"
            className="sm:col-span-2"
          />
        </div>
        <TextAreaField
          className="mt-5"
          label="Additional notes"
          optional
          value={x.notes}
          onChange={(ev) => set('notes', ev.target.value)}
          placeholder="Standard configurations, preferred brands, billing entities, installation requirements…"
        />
      </FormSection>

      <Checkbox checked={x.consent} onChange={(val) => set('consent', val)} error={e.consent}>
        I agree to Zova Infotech processing these details to prepare a quotation, as described in the{' '}
        <Link to={paths.privacy} className="font-semibold text-brand-600 hover:underline">
          Privacy Policy
        </Link>
        .
      </Checkbox>
      <Honeypot value={form.honeypot} onChange={form.setHoneypot} />
      <div className="flex justify-end border-t border-line pt-6">
        <SubmitButton loading={phase === 'submitting'} className="w-full sm:w-auto">
          Submit requirement
        </SubmitButton>
      </div>
    </form>
  )
}

function FormSection({ n, title, aside, children }: { n: string; title: string; aside?: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-baseline justify-between gap-3 border-b border-line pb-3">
        <h3 className="flex items-baseline gap-3 text-lg font-bold">
          <span className="font-mono text-sm text-brand-600">{n}</span> {title}
        </h3>
        {aside && <span className="text-[13px] font-semibold text-muted">{aside}</span>}
      </div>
      {children}
    </section>
  )
}

function LineItemRow({
  index,
  item,
  onChange,
  onRemove,
}: {
  index: number
  item: LineItem
  onChange: (patch: Partial<LineItem>) => void
  onRemove?: () => void
}) {
  const id = useId()
  const ctl = 'h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-[14.5px] outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-600/15'
  return (
    <div className="grid gap-3 rounded-2xl border border-line bg-surface p-4 sm:grid-cols-[180px_minmax(0,1fr)_110px_90px_44px] sm:items-end">
      <div className="flex flex-col gap-1">
        <label htmlFor={`${id}-c`} className="text-xs font-bold text-muted">
          Item {index + 1} · Category
        </label>
        <select id={`${id}-c`} value={item.category} onChange={(e) => onChange({ category: e.target.value })} className={ctl}>
          <option value="">Select…</option>
          {itemCategories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor={`${id}-d`} className="text-xs font-bold text-muted">
          Description / specification
        </label>
        <input
          id={`${id}-d`}
          value={item.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="e.g. 14&quot; laptop, i5, 16 GB, 512 GB SSD"
          className={ctl}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor={`${id}-k`} className="text-xs font-bold text-muted">
          Condition
        </label>
        <select id={`${id}-k`} value={item.condition} onChange={(e) => onChange({ condition: e.target.value })} className={ctl}>
          <option>New</option>
          <option>Refurbished</option>
          <option>Either</option>
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor={`${id}-q`} className="text-xs font-bold text-muted">
          Qty
        </label>
        <input
          id={`${id}-q`}
          type="number"
          min={1}
          inputMode="numeric"
          value={item.quantity}
          onChange={(e) => onChange({ quantity: e.target.value })}
          className={ctl}
        />
      </div>
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          className="flex h-11 items-center justify-center rounded-lg border border-line bg-white text-muted hover:border-red-300 hover:text-red-600"
          aria-label={`Remove item ${index + 1}`}
        >
          <Trash size={17} />
        </button>
      ) : (
        <span className="hidden sm:block" />
      )}
    </div>
  )
}
