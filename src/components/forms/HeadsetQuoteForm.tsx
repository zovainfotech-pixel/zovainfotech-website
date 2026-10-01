import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { products } from '../../data/products'
import { paths } from '../../data/routes'
import { cn } from '../../lib/cn'
import { validate, validators as v } from '../../lib/validation'
import { Checkbox, Honeypot, SelectField, SubmitButton, TextAreaField, TextField } from './fields'
import { DemoModeNotice, FormError, FormSuccess } from './FormResult'
import { useEnquiryForm } from './useEnquiryForm'

const requirements = [
  'Professional USB headsets',
  'Wireless Bluetooth headsets',
  'Call centre / contact centre headsets',
  'Conference speakerphones / meeting room audio',
  'Headset accessories',
  'Mixed requirement / not sure',
] as const
const brands = ['Poly (HP Poly)', 'Jabra', 'Logitech', 'EPOS', 'Yealink', 'Cisco', 'Other', 'No preference'] as const
const connectivityOptions = ['USB-A', 'USB-C', 'Bluetooth', 'Wireless', 'Not Sure'] as const
const useOptions = ['Call Centre', 'Office', 'Meeting Room', 'Remote Work'] as const
const budgets = ['Under ₹2,000 per unit', '₹2,000–5,000 per unit', '₹5,000–10,000 per unit', 'Above ₹10,000 per unit', 'To be discussed'] as const

interface HeadsetValues {
  company: string
  contactName: string
  email: string
  mobile: string
  requirement: string
  brand: string
  connectivity: string[]
  intendedUse: string[]
  quantity: string
  budget: string
  notes: string
  product: string
  consent: boolean
}

function Chips({ legend, options, value, onChange, optional }: { legend: string; options: readonly string[]; value: string[]; onChange: (v: string[]) => void; optional?: boolean }) {
  return (
    <fieldset>
      <legend className="mb-2.5 text-[13.5px] font-bold text-ink">
        {legend} {optional && <span className="font-medium text-muted">(optional)</span>}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value.includes(o)
          return (
            <label
              key={o}
              className={cn(
                'flex h-10 cursor-pointer items-center rounded-full border px-4 text-[13.5px] font-semibold transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-600/25',
                on ? 'border-brand-600 bg-brand-600 text-white' : 'border-line bg-white hover:border-slate-400',
              )}
            >
              <input type="checkbox" className="sr-only" checked={on} onChange={() => onChange(on ? value.filter((x) => x !== o) : [...value, o])} />
              {o}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

/** Headset & meeting-room audio requirement form — submits through the shared enquiry system (kind "headset"). */
export function HeadsetQuoteForm() {
  const [params] = useSearchParams()
  const selected = products.find((p) => p.slug === params.get('product') && p.audio)

  const initial = useMemo<HeadsetValues>(
    () => ({
      company: '',
      contactName: '',
      email: '',
      mobile: '',
      requirement: selected
        ? (
            {
              'USB Headsets': requirements[0],
              'Wireless Bluetooth Headsets': requirements[1],
              'Call Centre Headsets': requirements[2],
              'Meeting Room Audio': requirements[3],
              'Headset Accessories': requirements[4],
            } as Record<string, string>
          )[selected.subcategory ?? ''] ?? ''
        : '',
      brand: selected ? (brands.find((b) => b.startsWith(selected.brand)) ?? '') : '',
      connectivity: [],
      intendedUse: [],
      quantity: '',
      budget: '',
      notes: '',
      product: selected ? `${selected.name} (${selected.id})` : '',
      consent: false,
    }),
    [selected],
  )

  const form = useEnquiryForm<HeadsetValues>('headset', initial, (x) =>
    validate(x, {
      company: [v.required('Company name')],
      contactName: [v.name],
      email: [v.email],
      mobile: [v.mobile],
      requirement: [v.required('Headset requirement')],
      quantity: [v.quantity],
      notes: [v.maxLen(2000)],
      consent: [v.consent],
    }),
  )
  const { values: x, set, errors: e, phase, result, formRef } = form

  if (phase === 'done' && result) return <FormSuccess result={result} onReset={form.reset} noun="headset requirement" />

  return (
    <form ref={formRef} onSubmit={form.onSubmit} noValidate className="flex flex-col gap-6" aria-label="Headset and meeting room audio quote request">
      <DemoModeNotice />
      {result?.status === 'error' && <FormError message={result.message} />}
      {x.product && (
        <p className="rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-[13.5px] text-brand-800">
          Enquiring about: <strong>{x.product}</strong>
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Company name" autoComplete="organization" value={x.company} onChange={(ev) => set('company', ev.target.value)} error={e.company} />
        <TextField label="Contact person" autoComplete="name" value={x.contactName} onChange={(ev) => set('contactName', ev.target.value)} error={e.contactName} />
        <TextField label="Business email" type="email" autoComplete="email" value={x.email} onChange={(ev) => set('email', ev.target.value)} error={e.email} />
        <TextField label="Phone number" type="tel" autoComplete="tel-national" value={x.mobile} onChange={(ev) => set('mobile', ev.target.value)} error={e.mobile} />
        <SelectField label="Headset requirement" options={requirements} placeholder="Select…" value={x.requirement} onChange={(ev) => set('requirement', ev.target.value)} error={e.requirement} />
        <SelectField label="Preferred brand" optional options={brands} placeholder="Select…" value={x.brand} onChange={(ev) => set('brand', ev.target.value)} />
      </div>
      <Chips legend="Connectivity" optional options={connectivityOptions} value={x.connectivity} onChange={(val) => set('connectivity', val)} />
      <Chips legend="Intended use" optional options={useOptions} value={x.intendedUse} onChange={(val) => set('intendedUse', val)} />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Quantity" type="number" inputMode="numeric" min={1} value={x.quantity} onChange={(ev) => set('quantity', ev.target.value)} error={e.quantity} />
        <SelectField label="Budget range" optional options={budgets} placeholder="Select…" value={x.budget} onChange={(ev) => set('budget', ev.target.value)} />
      </div>
      <TextAreaField
        label="Additional requirements"
        optional
        value={x.notes}
        onChange={(ev) => set('notes', ev.target.value)}
        error={e.notes}
        placeholder="Calling platform (Teams, Zoom, Webex, softphone), mono or stereo, room sizes, delivery locations, timeline…"
      />
      <Checkbox checked={x.consent} onChange={(val) => set('consent', val)} error={e.consent}>
        I agree to Zova Infotech processing these details to prepare a quotation, as described in the{' '}
        <Link to={paths.privacy} className="font-semibold text-brand-600 hover:underline">
          Privacy Policy
        </Link>
        .
      </Checkbox>
      <Honeypot value={form.honeypot} onChange={form.setHoneypot} />
      <div className="flex flex-col-reverse items-start justify-between gap-4 border-t border-line pt-5 sm:flex-row sm:items-center">
        <p className="text-[12.5px] text-muted">Models, platform compatibility, pricing and warranty are confirmed in your written quotation.</p>
        <SubmitButton loading={phase === 'submitting'} className="w-full shrink-0 sm:w-auto">
          Submit Enquiry
        </SubmitButton>
      </div>
    </form>
  )
}
