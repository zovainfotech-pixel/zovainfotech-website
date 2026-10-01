import { ArrowRight, Check, Info } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { serviceIcon } from '../components/brand/icons'
import { SignageServices } from '../components/home/SignageServices'
import { AvSolutionsSection } from '../components/home/AvSolutions'
import { SmartImage } from '../components/ui/SmartImage'
import { PageHero } from '../components/layout/PageHero'
import { Button } from '../components/ui/Button'
import { Reveal, RevealGroup, RevealItem } from '../components/ui/Reveal'
import { paths } from '../data/routes'
import { serviceBySlug, services } from '../data/services'
import { usePageMeta } from '../lib/seo'
import NotFoundPage from './NotFoundPage'

export default function ServiceDetailPage() {
  const { slug } = useParams()
  const s = slug ? serviceBySlug.get(slug) : undefined
  if (!s) return <NotFoundPage />
  return <ServiceDetail slug={s.slug} />
}

function ServiceDetail({ slug }: { slug: string }) {
  const s = serviceBySlug.get(slug)!
  usePageMeta({ title: s.seoTitle, description: s.seoDescription })
  const others = services.filter((x) => x.slug !== s.slug).slice(0, 3)
  const quoteHref = `${paths.quote}?type=IT%20Services&model=${encodeURIComponent(s.name)}`

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Home', to: '/' }, { label: 'IT Services', to: paths.services }, { label: s.navLabel }]}
        eyebrow="IT service"
        title={s.name}
        description={s.intro}
        image={s.image}
      >
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <Button to={quoteHref} size="lg" iconRight={<ArrowRight size={18} />}>
            Request this service
          </Button>
          <Button to={paths.contact} size="lg" variant="ghost-dark">
            Ask a question
          </Button>
        </div>
      </PageHero>

      <section className="container-x py-16 sm:py-20">
        <h2 className="text-2xl font-bold tracking-[-0.02em] sm:text-3xl">What’s included</h2>
        <RevealGroup className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {s.offerings.map((o) => (
            <RevealItem key={o.title} className="flex">
              <div className="card flex w-full flex-col gap-2.5 p-6">
                <Check size={20} className="text-brand-600" aria-hidden />
                <h3 className="text-[17px] font-bold">{o.title}</h3>
                <p className="text-[14.5px] leading-relaxed text-muted">{o.description}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {s.slug === 'audio-visual-digital-signage' && (
        <>
          <SignageServices />
          <AvSolutionsSection />
        </>
      )}

      <section className="container-x pb-16">
        <h2 className="text-2xl font-bold tracking-[-0.02em] sm:text-3xl">Equipment we work with</h2>
        <RevealGroup className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {s.equipment.map((e) => (
            <RevealItem key={e.label} className="flex">
              <div className="group flex w-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]">
                <span className="bg-media flex aspect-[4/3] items-center justify-center">
                  <SmartImage k={e.k} alt="" sizes="(min-width: 1024px) 22vw, 45vw" className="w-[84%] transition-transform duration-700 group-hover:scale-[1.07]" />
                </span>
                <span className="p-4 text-[14.5px] font-bold">{e.label}</span>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="border-y border-line bg-surface py-16">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-2xl font-bold tracking-[-0.02em]">Suitable for</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {s.suitableFor.map((x) => (
                <li key={x} className="rounded-2xl border border-line bg-white p-4 font-semibold">
                  {x}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.06} className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold tracking-[-0.02em]">Scope & availability</h2>
            <p className="flex items-start gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-5 text-[15px] leading-relaxed text-blue-950">
              <Info size={20} className="mt-0.5 shrink-0 text-brand-600" aria-hidden />
              {s.scopeNote}
            </p>
            <Button to={quoteHref} className="self-start" iconRight={<ArrowRight size={17} />}>
              Get a service quote
            </Button>
          </Reveal>
        </div>
      </section>

      <section className="container-x py-16">
        <h2 className="text-xl font-bold">Related services</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {others.map((o) => {
            const I = serviceIcon[o.icon]
            return (
              <Link key={o.slug} to={paths.service(o.slug)} className="group card card-hover flex items-center gap-4 p-5">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-navy-950 text-cyan-accent">
                  <I size={19} aria-hidden />
                </span>
                <span className="font-bold group-hover:text-brand-700">{o.navLabel}</span>
              </Link>
            )
          })}
        </div>
      </section>
    </>
  )
}
