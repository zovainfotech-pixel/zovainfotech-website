import { Package, X } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { budgetRanges, requirementTypes } from '../../data/content'
import { productBySlug } from '../../data/products'
import { paths } from '../../data/routes'
import type { Product } from '../../data/types'
import { validate, validators as v } from '../../lib/validation'
import { Checkbox, Honeypot, Segmented, SelectField, SubmitButton, TextAreaField, TextField } from './fields'
import { DemoModeNotice, FormError, FormSuccess } from './FormResult'
import { useEnquiryForm } from './useEnquiryForm'

type CustomerType = 'Individual' | 'Business'

interface QuoteValues {
  fullName: string
  company: string
  email: string
  mobile: string
  customerType: CustomerType
  requirementType: string
  brand: string
  productModel: string
  productId: string
  quantity: string
  budget: string
  city: string
  pin: string
  requiredBy: string
  details: string
  consent: boolean
}

function defaultRequirement(p?: Product) {
  if (!p) return ''
  if (p.category === 'new-laptops') return 'New Laptop'
  if (p.category === 'refurbished-laptops') return 'Refurbished Laptop'
  if (p.category === 'it-accessories') return 'IT Accessories'
  return 'IT Hardware'
}

export function QuoteForm() {
  const [params, setParams] = useSearchParams()
  const product = params.get('product') ? productBySlug.get(params.get('product')!) : undefined
  const typeParam = params.get('type')
  const modelParam = params.get('model')
  const brandParam = params.get('brand')?.slice(0, 60)

  const initial = useMemo<QuoteValues>(
    () => ({
      fullName: '',
      company: '',
      email: '',
      mobile: '',
      customerType: 'Individual',
      requirementType: defaultRequirement(product) || (typeParam && (requirementTypes as readonly string[]).includes(typeParam) ? typeParam : ''),
      brand: product?.brand ?? brandParam ?? '',
      productModel: product ? product.name : (modelParam ?? ''),
      productId: product?.id ?? '',
      quantity: '1',
      budget: budgetRanges[0],
      city: '',
      pin: '',
      requiredBy: '',
      details: '',
      consent: false,
    }),
    [product, typeParam, modelParam, brandParam],
  )

  const form = useEnquiryForm<QuoteValues>('quote', initial, (x) =>
    validate(x, {
      fullName: [v.name],
      company: [v.maxLen(120)],
      email: [v.email],
      mobile: [v.mobile],
      requirementType: [v.required('Requirement type')],
      quantity: [v.quantity],
      city: [v.required('Delivery city')],
      pin: [v.pinRequired],
      requiredBy: [v.futureDate],
      details: [v.maxLen(2000)],
      consent: [v.consent],
    }),
  )
  const { values: x, set, errors: e, phase, result, formRef } = form

  if (phase === 'done' && result) return <FormSuccess result={result} onReset={form.reset} noun="quote request" />

  const clearProduct = () => {
    const next = new URLSearchParams(params)
    next.delete('product')
    setParams(next, { replace: true })
    set('productId', '')
    set('productModel', '')
    set('brand', '')
  }

  return (
    <form ref={formRef} onSubmit={form.onSubmit} noValidate className="relative flex flex-col gap-6" aria-label="Request a quote">
      <DemoModeNotice />
      {result?.status === 'error' && <FormError message={result.message} />}

      {x.productId && (
        <div className="flex items-center gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600">
            <Package size={20} aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] text-muted">Quote for selected product</p>
            <p className="truncate font-bold">
              {x.productModel} <span className="font-mono text-xs font-medium text-muted">({x.productId})</span>
            </p>
          </div>
          <button type="button" onClick={clearProduct} className="rounded-lg p-2 text-muted hover:bg-white hover:text-ink" aria-label="Remove selected product">
            <X size={18} />
          </button>
        </div>
      )}

      <Segmented<CustomerType> label="I’m enquiring as" value={x.customerType} options={['Individual', 'Business']} onChange={(val) => set('customerType', val)} />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Full name" autoComplete="name" value={x.fullName} onChange={(ev) => set('fullName', ev.target.value)} error={e.fullName} />
        <TextField
          label="Company name"
          optional
          autoComplete="organization"
          value={x.company}
          onChange={(ev) => set('company', ev.target.value)}
          error={e.company}
        />
        <TextField
          label={x.customerType === 'Business' ? 'Business email' : 'Email'}
          type="email"
          autoComplete="email"
          inputMode="email"
          value={x.email}
          onChange={(ev) => set('email', ev.target.value)}
          error={e.email}
          placeholder="name@company.com"
        />
        <TextField
          label="Mobile number"
          type="tel"
          autoComplete="tel-national"
          inputMode="tel"
          value={x.mobile}
          onChange={(ev) => set('mobile', ev.target.value)}
          error={e.mobile}
          placeholder="10-digit mobile number"
        />
        <SelectField
          label="Requirement type"
          options={requirementTypes}
          placeholder="Select a requirement…"
          value={x.requirementType}
          onChange={(ev) => set('requirementType', ev.target.value)}
          error={e.requirementType}
        />
        <TextField label="Brand preference" optional value={x.brand} onChange={(ev) => set('brand', ev.target.value)} placeholder="Any, Dell, Lenovo, HP…" />
        <TextField
          label="Product or model"
          optional
          value={x.productModel}
          onChange={(ev) => set('productModel', ev.target.value)}
          placeholder="e.g. ThinkPad T480, 16 GB RAM"
          className="sm:col-span-2"
        />
        <div className="grid grid-cols-2 gap-3">
          <TextField label="Quantity" type="number" min={1} inputMode="numeric" value={x.quantity} onChange={(ev) => set('quantity', ev.target.value)} error={e.quantity} />
          <SelectField label="Budget" options={budgetRanges} value={x.budget} onChange={(ev) => set('budget', ev.target.value)} />
        </div>
        <TextField
          label="Required by"
          optional
          type="date"
          value={x.requiredBy}
          onChange={(ev) => set('requiredBy', ev.target.value)}
          error={e.requiredBy}
        />
        <TextField label="Delivery city" autoComplete="address-level2" value={x.city} onChange={(ev) => set('city', ev.target.value)} error={e.city} />
        <TextField
          label="PIN code"
          autoComplete="postal-code"
          inputMode="numeric"
          maxLength={6}
          value={x.pin}
          onChange={(ev) => set('pin', ev.target.value.replace(/\D/g, ''))}
          error={e.pin}
          placeholder="6 digits"
        />
      </div>

      <TextAreaField
        label="Additional requirements"
        optional
        value={x.details}
        onChange={(ev) => set('details', ev.target.value)}
        error={e.details}
        placeholder="Configuration, software, installation, delivery or billing notes…"
      />

      <Checkbox checked={x.consent} onChange={(val) => set('consent', val)} error={e.consent}>
        I agree to Zova Infotech processing these details to respond to my enquiry, as described in the{' '}
        <Link to={paths.privacy} className="font-semibold text-brand-600 underline-offset-2 hover:underline">
          Privacy Policy
        </Link>
        .
      </Checkbox>

      <Honeypot value={form.honeypot} onChange={form.setHoneypot} />

      <div className="flex flex-col-reverse gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-muted">
          Buying for a business in bulk?{' '}
          <Link to={`${paths.corporate}#requirement`} className="font-bold text-brand-600">
            Use the corporate procurement form
          </Link>
        </p>
        <SubmitButton loading={phase === 'submitting'}>Submit quote request</SubmitButton>
      </div>
    </form>
  )
}
