import { Check } from 'lucide-react'
import { VendorForm } from '../components/forms/VendorForm'
import { PageHero } from '../components/layout/PageHero'
import { usePageMeta } from '../lib/seo'

export default function VendorPage() {
  usePageMeta({
    title: 'Become a Vendor',
    description: 'Distributors, refurbishers, dealers and service partners can register to supply IT products and services to Zova Infotech.',
  })
  return (
    <>
      <PageHero
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Become a Vendor' }]}
        eyebrow="Vendor registration"
        title="Partner with Zova Infotech."
        image="switch"
        description="We work with distributors, dealers, refurbishers and service partners to source the right products for our customers. Register your interest below."
      />
      <section className="container-x grid gap-10 py-14 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-14">
        <aside className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start">
          <h2 className="text-xl font-bold">What we look for</h2>
          <ul className="flex flex-col gap-3">
            {[
              'Genuine products with clear sourcing',
              'Accurate specifications and condition disclosure',
              'Documented warranty terms',
              'GST-compliant invoicing',
              'Reliable lead times and communication',
            ].map((t) => (
              <li key={t} className="flex items-start gap-2.5 text-[15px]">
                <Check size={18} className="mt-0.5 shrink-0 text-brand-600" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
          <p className="rounded-2xl border border-line bg-surface p-4 text-[13.5px] leading-relaxed text-muted">
            Registration does not create a commercial agreement. We will contact vendors whose offering matches current customer requirements.
          </p>
        </aside>
        <div className="rounded-3xl border border-line bg-white p-5 sm:p-8 lg:p-10">
          <VendorForm />
        </div>
      </section>
    </>
  )
}
