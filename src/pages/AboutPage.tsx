import { ArrowRight, Eye, Handshake, ListChecks, Scale } from 'lucide-react'
import { Logo } from '../components/brand/Logo'
import { PageHero } from '../components/layout/PageHero'
import { Button } from '../components/ui/Button'
import { Reveal, RevealGroup, RevealItem } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { site } from '../config/site'
import { categories } from '../data/categories'
import { paths } from '../data/routes'
import { services } from '../data/services'
import { usePageMeta } from '../lib/seo'

const principles = [
  { icon: Eye, title: 'Transparency first', text: 'Specifications, condition and warranty are stated plainly. When something isn’t confirmed, we say so.' },
  { icon: Scale, title: 'Right-sized recommendations', text: 'New, refurbished or used — we recommend what fits the job and the budget, not the most expensive option.' },
  { icon: ListChecks, title: 'Clear quotations', text: 'Itemised quotes with the details you need to compare, approve and account for your purchase.' },
  { icon: Handshake, title: 'One accountable partner', text: 'Products, procurement and support through a single point of contact.' },
]

export default function AboutPage() {
  usePageMeta({
    title: 'About Us',
    description: `${site.companyName} is an Indian IT products, procurement and technology services company — ${site.tagline.toLowerCase()}.`,
  })
  return (
    <>
      <PageHero
        crumbs={[{ label: 'Home', to: '/' }, { label: 'About Us' }]}
        eyebrow="About Zova Infotech"
        title={site.brandMessage}
        image="laptopHero"
        description={`${site.companyName} helps individuals, businesses and institutions across India buy the right technology — new and refurbished laptops, IT hardware and accessories, software — and keep it running with dependable IT services.`}
      />

      <section className="container-x grid gap-12 py-20 lg:grid-cols-2 lg:gap-20">
        <Reveal className="flex flex-col gap-5">
          <SectionHeading eyebrow="What we do" title="A procurement partner, not just a store." />
          <p className="text-[16.5px] leading-relaxed text-muted">
            Many of our products are sourced from a network of vendors based on each customer’s requirement. That lets us match exact brands,
            models and configurations — and quote honestly on availability and lead times rather than claiming everything is on the shelf.
          </p>
          <p className="text-[16.5px] leading-relaxed text-muted">
            Alongside products, we offer installation, IT support, annual maintenance contracts, cybersecurity, software licensing, networking
            and audio-visual solutions — available on enquiry and scoped to your location.
          </p>
          {/* TODO(business): add founding story, team, registered office and verified credentials once supplied. */}
          <p className="rounded-2xl border border-dashed border-slate-300 bg-surface p-4 text-[13.5px] text-muted">
            [Company story, founding year, leadership and verified registrations to be added by Zova Infotech.]
          </p>
        </Reveal>
        <Reveal delay={0.08} className="grid gap-4 self-start sm:grid-cols-2">
          <div className="flex items-center justify-center rounded-3xl border border-line bg-gradient-to-br from-white to-surface p-8 sm:col-span-2">
            <Logo tagline className="[&_img]:w-[340px]" />
          </div>
          <div className="on-dark rounded-3xl bg-navy-950 p-6 text-white sm:col-span-2">
            <p className="text-sm font-bold text-cyan-accent">Products</p>
            <p className="mt-2 leading-relaxed text-on-dark">{categories.map((c) => c.shortName).join(' · ')}</p>
          </div>
          <div className="rounded-3xl border border-line p-6 sm:col-span-2">
            <p className="text-sm font-bold text-brand-600">Services</p>
            <p className="mt-2 leading-relaxed text-muted">{services.map((s) => s.navLabel).join(' · ')}</p>
          </div>
        </Reveal>
      </section>

      <section className="border-y border-line bg-surface py-20">
        <div className="container-x flex flex-col gap-10">
          <Reveal>
            <SectionHeading align="center" eyebrow="How we work" title="Principles behind every quotation" />
          </Reveal>
          <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map(({ icon: Icon, title, text }) => (
              <RevealItem key={title} className="flex">
                <div className="card flex w-full flex-col gap-3 p-6">
                  <Icon size={24} className="text-brand-600" aria-hidden />
                  <h2 className="text-lg font-bold">{title}</h2>
                  <p className="text-[14.5px] leading-relaxed text-muted">{text}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="container-x flex flex-col items-center gap-5 py-20 text-center">
        <h2 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl">Have a requirement in mind?</h2>
        <p className="max-w-lg text-muted">Tell us what you need and we’ll come back with options and a clear quotation.</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button to={paths.quote} iconRight={<ArrowRight size={17} />}>
            Request a Quote
          </Button>
          <Button to={paths.contact} variant="secondary">
            Contact Our Team
          </Button>
        </div>
      </section>
    </>
  )
}
