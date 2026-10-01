import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { paths } from '../../data/routes'
import { cn } from '../../lib/cn'
import { validate, validators as v } from '../../lib/validation'
import { Checkbox, Honeypot, SelectField, SubmitButton, TextAreaField, TextField } from './fields'
import { DemoModeNotice, FormError, FormSuccess } from './FormResult'
import { useEnquiryForm } from './useEnquiryForm'

const vendorTypes = ['Distributor', 'Wholesaler / dealer', 'Refurbisher', 'OEM / brand', 'Service partner', 'Logistics partner', 'Other'] as const
const supplyCategories = [
  'New laptops & desktops',
  'Refurbished / used laptops',
  'Apple products',
  'Monitors & displays',
  'Printers & consumables',
  'Accessories',
  'Components & parts',
  'Networking',
  'Servers & storage',
  'Software licences',
  'AV & signage',
  'Services',
]

interface VendorValues {
  company: string
  contactName: string
  email: string
  mobile: string
  vendorType: string
  gstin: string
  city: string
  website: string
  categories: string[]
  brands: string
  coverage: string
  notes: string
  consent: boolean
}

export function VendorForm() {
  const initial = useMemo<VendorValues>(
    () => ({
      company: '',
      contactName: '',
      email: '',
      mobile: '',
      vendorType: '',
      gstin: '',
      city: '',
      website: '',
      categories: [],
      brands: '',
      coverage: '',
      notes: '',
      consent: false,
    }),
    [],
  )
  const form = useEnquiryForm<VendorValues>('vendor', initial, (x) => {
    const errs = validate(x, {
      company: [v.required('Company name')],
      contactName: [v.name],
      email: [v.email],
      mobile: [v.mobile],
      vendorType: [v.required('Vendor type')],
      gstin: [v.gstin],
      city: [v.required('City')],
      website: [v.url],
      consent: [v.consent],
    })
    if (x.categories.length === 0) errs.categories = 'Select at least one category you supply.'
    return errs
  })
  const { values: x, set, errors: e, phase, result, formRef } = form

  if (phase === 'done' && result) return <FormSuccess result={result} onReset={form.reset} noun="vendor registration" />

  const toggle = (c: string) => set('categories', x.categories.includes(c) ? x.categories.filter((y) => y !== c) : [...x.categories, c])

  return (
    <form ref={formRef} onSubmit={form.onSubmit} noValidate className="relative flex flex-col gap-6" aria-label="Vendor registration">
      <DemoModeNotice />
      {result?.status === 'error' && <FormError message={result.message} />}
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Company name" autoComplete="organization" value={x.company} onChange={(ev) => set('company', ev.target.value)} error={e.company} />
        <SelectField label="Vendor type" options={vendorTypes} placeholder="Select…" value={x.vendorType} onChange={(ev) => set('vendorType', ev.target.value)} error={e.vendorType} />
        <TextField label="Contact person" autoComplete="name" value={x.contactName} onChange={(ev) => set('contactName', ev.target.value)} error={e.contactName} />
        <TextField label="Business email" type="email" autoComplete="email" value={x.email} onChange={(ev) => set('email', ev.target.value)} error={e.email} />
        <TextField label="Mobile number" type="tel" autoComplete="tel-national" value={x.mobile} onChange={(ev) => set('mobile', ev.target.value)} error={e.mobile} />
        <TextField label="GSTIN" optional maxLength={15} value={x.gstin} onChange={(ev) => set('gstin', ev.target.value.toUpperCase())} error={e.gstin} />
        <TextField label="City" autoComplete="address-level2" value={x.city} onChange={(ev) => set('city', ev.target.value)} error={e.city} />
        <TextField label="Website" optional type="url" value={x.website} onChange={(ev) => set('website', ev.target.value)} error={e.website} placeholder="https://" />
      </div>
      <fieldset>
        <legend className="mb-3 text-[13.5px] font-bold">Categories you supply</legend>
        <div className="flex flex-wrap gap-2">
          {supplyCategories.map((c) => {
            const on = x.categories.includes(c)
            return (
              <label
                key={c}
                className={cn(
                  'flex h-10 cursor-pointer items-center rounded-full border px-4 text-[13.5px] font-semibold transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-600/25',
                  on ? 'border-navy-950 bg-navy-950 text-white' : 'border-line hover:border-slate-400',
                )}
              >
                <input type="checkbox" className="sr-only" checked={on} onChange={() => toggle(c)} />
                {c}
              </label>
            )
          })}
        </div>
        {e.categories && <p className="mt-2 text-[12.5px] font-semibold text-red-700">{e.categories}</p>}
      </fieldset>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Brands handled" optional value={x.brands} onChange={(ev) => set('brands', ev.target.value)} placeholder="e.g. Dell, HP, Lenovo" />
        <TextField label="Service / supply coverage" optional value={x.coverage} onChange={(ev) => set('coverage', ev.target.value)} placeholder="Cities, states or Pan-India" />
      </div>
      <TextAreaField
        label="About your business"
        optional
        value={x.notes}
        onChange={(ev) => set('notes', ev.target.value)}
        placeholder="Authorisations held, typical lead times, payment terms, refurbishment process…"
      />
      <Checkbox checked={x.consent} onChange={(val) => set('consent', val)} error={e.consent}>
        I confirm these details are accurate and agree to Zova Infotech processing them for vendor evaluation, as described in the{' '}
        <Link to={paths.privacy} className="font-semibold text-brand-600 hover:underline">
          Privacy Policy
        </Link>
        .
      </Checkbox>
      <Honeypot value={form.honeypot} onChange={form.setHoneypot} />
      <SubmitButton loading={phase === 'submitting'} className="self-start">
        Register as a vendor
      </SubmitButton>
    </form>
  )
}
