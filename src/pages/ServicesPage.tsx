import { ArrowRight } from 'lucide-react'
import { SmartImage } from '../components/ui/SmartImage'
import { Link } from 'react-router-dom'
import { serviceIcon } from '../components/brand/icons'
import { PageHero } from '../components/layout/PageHero'
import { Button } from '../components/ui/Button'
import { RevealGroup, RevealItem } from '../components/ui/Reveal'
import { paths } from '../data/routes'
import { services } from '../data/services'
import { usePageMeta } from '../lib/seo'

export default function ServicesPage() {
  usePageMeta({
    title: 'IT Services — Support, AMC, Cybersecurity, Licensing & AV',
    description:
      'IT support, repairs, network setup, AMC, endpoint security and DLP, software licensing, installation and audio-visual solutions for businesses in India. Available on enquiry.',
  })
  return (
    <>
      <PageHero
        crumbs={[{ label: 'Home', to: '/' }, { label: 'IT Services' }]}
        eyebrow="IT services & solutions"
        title={
          <>
            Support that keeps your <span className="text-gradient">hardware earning.</span>
          </>
        }
        image="conference"
        description="From one-off repairs to managed support contracts, security and AV integration. All services are available on enquiry; scope and coverage are confirmed for your location."
      >
        <div className="mt-3">
          <Button to={`${paths.quote}?type=IT%20Services`} size="lg" iconRight={<ArrowRight size={18} />}>
            Request a service quote
          </Button>
        </div>
      </PageHero>
      <section className="container-x py-16 sm:py-20">
        <RevealGroup className="grid gap-5 md:grid-cols-2">
          {services.map((s) => {
            const Icon = serviceIcon[s.icon]
            return (
              <RevealItem key={s.slug} className="flex">
                <Link to={paths.service(s.slug)} className="glow-border group flex w-full rounded-[var(--radius-card)]">
                  <span className="grid w-full overflow-hidden rounded-[var(--radius-card)] border border-line bg-white transition-shadow group-hover:border-transparent group-hover:shadow-[var(--shadow-card-hover)] sm:grid-cols-[minmax(0,1fr)_200px]">
                    <span className="flex flex-col gap-4 p-6 sm:p-7">
                      <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-violet-accent text-white shadow-[0_10px_24px_-10px_rgb(12_93_174/0.7)] transition-transform duration-500 group-hover:-rotate-6">
                        <Icon size={22} aria-hidden />
                      </span>
                      <span>
                        <span className="block font-display text-xl font-bold tracking-[-0.01em] group-hover:text-brand-700">{s.name}</span>
                        <span className="mt-2 block leading-relaxed text-muted">{s.short}</span>
                      </span>
                      <span className="mt-auto flex flex-wrap gap-2">
                        {s.offerings.slice(0, 3).map((o) => (
                          <span key={o.title} className="rounded-full bg-surface px-3 py-1 text-[12.5px] font-semibold text-slate-600">
                            {o.title}
                          </span>
                        ))}
                      </span>
                    </span>
                    <span className="bg-media-dark relative hidden items-center justify-center overflow-hidden sm:flex">
                      <SmartImage k={s.image} alt="" tone="dark" sizes="200px" className="w-[92%] drop-shadow-[0_18px_22px_rgb(0_0_0/0.45)] transition-transform duration-700 group-hover:scale-110" />
                    </span>
                  </span>
                </Link>
              </RevealItem>
            )
          })}
        </RevealGroup>
      </section>
    </>
  )
}
