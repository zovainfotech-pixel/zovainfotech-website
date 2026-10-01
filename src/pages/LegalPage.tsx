import { FileWarning } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHero } from '../components/layout/PageHero'
import { legalDocs, type LegalDoc } from '../data/legal'
import { usePageMeta } from '../lib/seo'

export default function LegalPage({ doc }: { doc: LegalDoc['slug'] }) {
  const d = legalDocs[doc]
  usePageMeta({ title: d.title, description: d.seoDescription })
  return (
    <>
      <PageHero crumbs={[{ label: 'Home', to: '/' }, { label: d.title }]} eyebrow="Policies" title={d.title} description={d.intro} />
      <section className="container-x grid gap-10 py-14 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
        <nav aria-label="On this page" className="hidden lg:block">
          <ul className="sticky top-28 flex flex-col gap-2 border-l border-line pl-4 text-sm">
            {d.sections.map((s, i) => (
              <li key={s.heading}>
                <Link to={{ hash: s.id ?? `s${i}` }} className="text-muted hover:text-brand-700">
                  {s.heading}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <article className="prose-legal max-w-3xl">
          <p className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-[13.5px] leading-relaxed text-amber-900">
            <FileWarning size={18} className="mt-0.5 shrink-0" aria-hidden />
            Template policy — to be reviewed and completed by Zova Infotech and a qualified legal professional before publication. Bracketed
            items need business information. Last updated: [date].
          </p>
          {d.sections.map((s, i) => (
            <section key={s.heading} id={s.id ?? `s${i}`} className="scroll-mt-28">
              <h2>{s.heading}</h2>
              {s.paragraphs?.map((p) => <p key={p}>{p}</p>)}
              {s.bullets && (
                <ul>
                  {s.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>
      </section>
    </>
  )
}
