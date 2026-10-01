import { Clock, FileText, Search } from 'lucide-react'
import { QuoteForm } from '../components/forms/QuoteForm'
import { Breadcrumbs } from '../components/layout/PageHero'
import { ContactMethods } from '../components/layout/ContactMethods'
import { usePageMeta } from '../lib/seo'

export default function QuotePage() {
  usePageMeta({
    title: 'Request a Quote',
    description: 'Request a quotation for new or refurbished laptops, IT accessories, hardware, software or IT services. Pricing and availability confirmed individually.',
  })
  return (
    <section className="bg-surface">
      <div className="container-x grid gap-10 py-10 sm:py-14 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-14">
        <aside className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Request a Quote' }]} />
          <span className="eyebrow">Request a quote</span>
          <h1 className="text-4xl leading-[1.08] font-bold tracking-[-0.03em] sm:text-[44px]">Tell us what you need. We’ll source it.</h1>
          <p className="leading-relaxed text-muted">
            Share as much detail as you can. Pricing, availability, warranty and delivery timelines are confirmed individually in your quotation.
          </p>
          <ol className="on-dark aurora relative flex flex-col gap-4 overflow-hidden rounded-3xl p-6 text-white">
            <li className="text-sm font-bold">What happens next</li>
            {[
              [FileText, 'We review your requirement'],
              [Search, 'We check options across our vendor network'],
              [Clock, 'You receive an itemised quotation to review'],
            ].map(([Icon, t], i) => {
              const I = Icon as typeof FileText
              return (
                <li key={i} className="flex items-center gap-3 text-sm text-on-dark">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-cyan-accent">
                    <I size={17} aria-hidden />
                  </span>
                  {t as string}
                </li>
              )
            })}
          </ol>
          <ContactMethods compact />
        </aside>
        <div className="rounded-3xl border border-line bg-white p-5 shadow-[0_30px_60px_-40px_rgb(11_18_32/0.25)] sm:p-8 lg:p-10">
          <QuoteForm />
        </div>
      </div>
    </section>
  )
}
