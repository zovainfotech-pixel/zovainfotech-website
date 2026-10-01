import { ArrowRight, GitCompareArrows, X } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { audioRows } from '../components/headsets/audio'
import { compareHref, useCompare } from '../components/headsets/compare-context'
import { headsetQuoteHref } from '../components/headsets/HeadsetSections'
import { PageHero } from '../components/layout/PageHero'
import { ProductMedia } from '../components/product/ProductCard'
import { Button } from '../components/ui/Button'
import { COMPARE_MAX } from '../components/headsets/compare-context'
import { products } from '../data/products'
import { paths } from '../data/routes'
import type { Product } from '../data/types'
import { quoteLinkFor } from '../lib/contact'
import { usePageMeta } from '../lib/seo'

const NS = 'Not specified'

/** Side-by-side comparison of up to three headsets, read from ?ids= so the page can be shared. */
export default function CompareHeadsetsPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const compare = useCompare()
  const ids = (params.get('ids') ?? '').split(',').filter(Boolean).slice(0, COMPARE_MAX)
  const items = ids.map((id) => products.find((p) => p.id === id && p.audio)).filter((p): p is Product => !!p)

  usePageMeta({
    title: 'Compare Headsets',
    description: 'Compare professional headsets and speakerphones side by side: connection, wearing style, microphone and platform notes.',
    index: false,
  })

  const remove = (id: string) => {
    compare?.remove(id)
    const next = items.filter((p) => p.id !== id).map((p) => p.id)
    navigate(next.length ? compareHref(next) : paths.compare, { replace: true })
  }

  const rows: { label: string; get: (p: Product) => string }[] = [
    { label: 'Brand / model', get: (p) => `${p.brand} · ${p.model}` },
    { label: 'Type', get: (p) => p.subcategory ?? NS },
    ...audioRows(undefined).map(([label], i) => ({ label, get: (p: Product) => audioRows(p.audio)[i][1] })),
    { label: 'Warranty', get: (p) => p.warranty ?? 'Confirmed in quotation (not specified here)' },
    { label: 'Quotation', get: (p) => (p.enquiry.quote ? 'Available on request' : NS) },
  ]

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Headsets & Audio', to: paths.category('headsets-audio-solutions') }, { label: 'Compare' }]}
        eyebrow="Compare products"
        title="Compare Headsets"
        description={`Compare up to ${COMPARE_MAX} headsets or speakerphones side by side. Details not published for a model are marked “${NS}”.`}
        image="headsetWireless"
      />
      <section className="container-x py-12 sm:py-16">
        {items.length === 0 ? (
          <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-3xl border border-dashed border-line bg-white p-10 text-center">
            <GitCompareArrows size={32} className="text-brand-600" aria-hidden />
            <h2 className="text-xl font-bold">No headsets selected</h2>
            <p className="text-[14.5px] text-muted">Use the “Compare” button on headset cards to add up to {COMPARE_MAX} products.</p>
            <Button to={`${paths.category('headsets-audio-solutions')}#catalogue`} iconRight={<ArrowRight size={16} />}>
              Browse headsets
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-line bg-white shadow-[var(--shadow-card)]">
            <table className="w-full min-w-[640px] border-collapse text-left text-[14px]">
              <caption className="sr-only">Headset comparison</caption>
              <thead>
                <tr className="align-top">
                  <th scope="col" className="w-44 p-4 text-[12px] font-semibold tracking-[0.1em] text-muted uppercase">
                    Product
                  </th>
                  {items.map((p) => (
                    <th key={p.id} scope="col" className="border-l border-line p-4">
                      <div className="flex flex-col gap-3">
                        <div className="relative overflow-hidden rounded-2xl">
                          <ProductMedia product={p} className="aspect-[4/3]" sizes="260px" />
                          <button
                            type="button"
                            onClick={() => remove(p.id)}
                            className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-white/90 text-muted shadow hover:text-red-600"
                            aria-label={`Remove ${p.name} from comparison`}
                          >
                            <X size={15} />
                          </button>
                        </div>
                        <Link to={paths.product(p.slug)} className="text-[15px] leading-snug font-bold text-ink hover:text-brand-600">
                          {p.name}
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className="border-t border-line align-top">
                    <th scope="row" className="bg-[var(--background-primary)] p-4 text-[13px] font-semibold text-muted">
                      {r.label}
                    </th>
                    {items.map((p) => {
                      const v = r.get(p)
                      return (
                        <td key={p.id} className={`border-l border-line p-4 ${v.startsWith(NS) ? 'text-subtle italic' : 'font-medium text-ink'}`}>
                          {v}
                        </td>
                      )
                    })}
                  </tr>
                ))}
                <tr className="border-t border-line">
                  <th scope="row" className="bg-[var(--background-primary)] p-4" />
                  {items.map((p) => (
                    <td key={p.id} className="border-l border-line p-4">
                      <Button to={quoteLinkFor(p)} size="sm" className="w-full">
                        Request a Quote
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-4 text-[12.5px] text-muted">
          Demonstration listings. Specifications come from manufacturer information for each model family and can vary by variant; platform
          certification, warranty and pricing are confirmed for the exact SKU in your{' '}
          <Link to={headsetQuoteHref} className="font-semibold text-brand-600 hover:underline">
            quotation
          </Link>
          .
        </p>
      </section>
    </>
  )
}
