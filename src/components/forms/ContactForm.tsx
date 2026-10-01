import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { paths } from '../../data/routes'
import { validate, validators as v } from '../../lib/validation'
import { Checkbox, Honeypot, SelectField, SubmitButton, TextAreaField, TextField } from './fields'
import { DemoModeNotice, FormError, FormSuccess } from './FormResult'
import { useEnquiryForm } from './useEnquiryForm'

const serviceOptions = [
  'IT Hardware & Laptop Procurement',
  'New and Refurbished Laptops',
  'Apple Devices and Accessories',
  'Printers and Office Equipment',
  'Networking and IT Infrastructure',
  'Cybersecurity and Endpoint Protection',
  'Software and Licensing',
  'Cloud Solutions',
  'AMC and IT Support',
  'Headsets and Meeting Room Solutions',
  'CCTV and Audio-Visual Solutions',
  'Other IT Requirements',
] as const

interface ContactValues {
  fullName: string
  company: string
  email: string
  mobile: string
  service: string
  message: string
  consent: boolean
}

export function ContactForm({ defaultService }: { defaultService?: (typeof serviceOptions)[number] }) {
  const [params] = useSearchParams()
  // ?about=<product name> pre-fills an enquiry (e.g. from the AV product showcase).
  const about = params.get('about')?.slice(0, 160)
  const initial = useMemo<ContactValues>(
    () => ({
      fullName: '',
      company: '',
      email: '',
      mobile: '',
      service: defaultService ?? '',
      message: about ? `I'd like to know more about: ${about}.\n\n` : '',
      consent: false,
    }),
    [defaultService, about],
  )
  const form = useEnquiryForm<ContactValues>('contact', initial, (x) =>
    validate(x, {
      fullName: [v.name],
      email: [v.email],
      mobile: [v.mobile],
      service: [v.required('Service required')],
      message: [(m: string) => (m.trim().length < 10 ? 'Please add a few more details (at least 10 characters).' : undefined), v.maxLen(3000)],
      consent: [v.consent],
    }),
  )
  const { values: x, set, errors: e, phase, result, formRef } = form

  if (phase === 'done' && result) return <FormSuccess result={result} onReset={form.reset} noun="enquiry" />

  return (
    <form ref={formRef} onSubmit={form.onSubmit} noValidate className="relative flex flex-col gap-5" aria-label="Contact enquiry form">
      <DemoModeNotice />
      {result?.status === 'error' && <FormError message={result.message} />}
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Full name" autoComplete="name" value={x.fullName} onChange={(ev) => set('fullName', ev.target.value)} error={e.fullName} />
        <TextField label="Company name" optional autoComplete="organization" value={x.company} onChange={(ev) => set('company', ev.target.value)} />
        <TextField label="Business email" type="email" autoComplete="email" value={x.email} onChange={(ev) => set('email', ev.target.value)} error={e.email} />
        <TextField label="Phone number" type="tel" autoComplete="tel-national" value={x.mobile} onChange={(ev) => set('mobile', ev.target.value)} error={e.mobile} hint="10-digit Indian mobile number" />
      </div>
      <SelectField label="Service required" options={serviceOptions} placeholder="Select a service…" value={x.service} onChange={(ev) => set('service', ev.target.value)} error={e.service} />
      <TextAreaField
        label="Message / requirement"
        value={x.message}
        onChange={(ev) => set('message', ev.target.value)}
        error={e.message}
        rows={5}
        placeholder="Quantities, models or specifications, locations and timeline…"
      />
      <Checkbox checked={x.consent} onChange={(val) => set('consent', val)} error={e.consent}>
        I agree to Zova Infotech processing these details to respond to my message, as described in the{' '}
        <Link to={paths.privacy} className="font-semibold text-brand-600 hover:underline">
          Privacy Policy
        </Link>
        .
      </Checkbox>
      <Honeypot value={form.honeypot} onChange={form.setHoneypot} />
      <div className="flex flex-col-reverse items-start justify-between gap-4 border-t border-line pt-5 sm:flex-row sm:items-center">
        <p className="text-[12.5px] text-muted">We reply to every enquiry individually. Pricing and availability are confirmed in writing.</p>
        <SubmitButton loading={phase === 'submitting'} className="w-full shrink-0 sm:w-auto">
          Submit Enquiry
        </SubmitButton>
      </div>
    </form>
  )
}
