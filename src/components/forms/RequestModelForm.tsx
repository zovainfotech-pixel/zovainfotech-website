import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { budgetRanges } from '../../data/content'
import { paths } from '../../data/routes'
import { validate, validators as v } from '../../lib/validation'
import { Checkbox, Honeypot, SelectField, SubmitButton, TextAreaField, TextField } from './fields'
import { DemoModeNotice, FormError, FormSuccess } from './FormResult'
import { useEnquiryForm } from './useEnquiryForm'

const ramOptions = ['No preference', '8 GB', '16 GB', '32 GB or more'] as const
const storageOptions = ['No preference', '256 GB SSD', '512 GB SSD', '1 TB SSD or more'] as const
const gradeOptions = ['Any condition', 'Excellent only', 'Very Good or better', 'Good or better'] as const

interface ModelValues {
  fullName: string
  email: string
  mobile: string
  requirementType: string
  productModel: string
  ram: string
  storage: string
  minGrade: string
  quantity: string
  budget: string
  city: string
  pin: string
  details: string
  consent: boolean
}

/** Short form for requesting a specific refurbished model (sent as a quote enquiry). */
export function RequestModelForm() {
  const initial = useMemo<ModelValues>(
    () => ({
      fullName: '',
      email: '',
      mobile: '',
      requirementType: 'Refurbished Laptop',
      productModel: '',
      ram: ramOptions[0],
      storage: storageOptions[0],
      minGrade: gradeOptions[0],
      quantity: '1',
      budget: budgetRanges[0],
      city: '',
      pin: '',
      details: '',
      consent: false,
    }),
    [],
  )
  const form = useEnquiryForm<ModelValues>('quote', initial, (x) =>
    validate(x, {
      fullName: [v.name],
      email: [v.email],
      mobile: [v.mobile],
      productModel: [(m: string) => (m.trim().length < 3 ? 'Tell us the model or the specification you need.' : undefined)],
      quantity: [v.quantity],
      city: [v.required('Delivery city')],
      pin: [v.pinRequired],
      consent: [v.consent],
    }),
  )
  const { values: x, set, errors: e, phase, result, formRef } = form
  if (phase === 'done' && result) return <FormSuccess result={result} onReset={form.reset} noun="model request" />

  return (
    <form ref={formRef} onSubmit={form.onSubmit} noValidate className="relative flex flex-col gap-5" aria-label="Request a specific refurbished model">
      <DemoModeNotice />
      {result?.status === 'error' && <FormError message={result.message} />}
      <TextField
        label="Model or specification"
        value={x.productModel}
        onChange={(ev) => set('productModel', ev.target.value)}
        error={e.productModel}
        placeholder="e.g. ThinkPad T14 Gen 2, or any 14″ i5 business laptop"
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <SelectField label="RAM" options={ramOptions} value={x.ram} onChange={(ev) => set('ram', ev.target.value)} />
        <SelectField label="Storage" options={storageOptions} value={x.storage} onChange={(ev) => set('storage', ev.target.value)} />
        <SelectField label="Minimum condition" options={gradeOptions} value={x.minGrade} onChange={(ev) => set('minGrade', ev.target.value)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Full name" autoComplete="name" value={x.fullName} onChange={(ev) => set('fullName', ev.target.value)} error={e.fullName} />
        <TextField label="Email" type="email" autoComplete="email" value={x.email} onChange={(ev) => set('email', ev.target.value)} error={e.email} />
        <TextField label="Mobile number" type="tel" autoComplete="tel-national" value={x.mobile} onChange={(ev) => set('mobile', ev.target.value)} error={e.mobile} />
        <div className="grid grid-cols-2 gap-3">
          <TextField label="Quantity" type="number" min={1} value={x.quantity} onChange={(ev) => set('quantity', ev.target.value)} error={e.quantity} />
          <SelectField label="Budget" options={budgetRanges} value={x.budget} onChange={(ev) => set('budget', ev.target.value)} />
        </div>
        <TextField label="Delivery city" autoComplete="address-level2" value={x.city} onChange={(ev) => set('city', ev.target.value)} error={e.city} />
        <TextField
          label="PIN code"
          inputMode="numeric"
          maxLength={6}
          value={x.pin}
          onChange={(ev) => set('pin', ev.target.value.replace(/\D/g, ''))}
          error={e.pin}
        />
      </div>
      <TextAreaField label="Anything else?" optional rows={3} value={x.details} onChange={(ev) => set('details', ev.target.value)} placeholder="Battery expectations, OS, accessories, deadline…" />
      <Checkbox checked={x.consent} onChange={(val) => set('consent', val)} error={e.consent}>
        I agree to Zova Infotech processing these details to respond to my request, as described in the{' '}
        <Link to={paths.privacy} className="font-semibold text-brand-600 hover:underline">
          Privacy Policy
        </Link>
        .
      </Checkbox>
      <Honeypot value={form.honeypot} onChange={form.setHoneypot} />
      <SubmitButton loading={phase === 'submitting'} className="self-start">
        Request this model
      </SubmitButton>
    </form>
  )
}
