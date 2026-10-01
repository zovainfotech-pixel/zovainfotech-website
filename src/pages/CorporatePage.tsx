import { ArrowRight, Boxes, ClipboardList, FileSpreadsheet, Headset, Receipt, Truck } from 'lucide-react'
import { CorporateForm } from '../components/forms/CorporateForm'
import { SmartImage } from '../components/ui/SmartImage'
import { CircuitLines } from '../components/brand/Decor'
import type { MediaKey } from '../data/media'
import { miscIcon } from '../components/brand/icons'
import { PageHero } from '../components/layout/PageHero'
import { Button } from '../components/ui/Button'
import { Reveal, RevealGroup, RevealItem } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { industries, processSteps } from '../data/content'
import { usePageMeta } from '../lib/seo'

const benefits: { k: MediaKey; title: string; text: string }[] = [
  { k: 'laptopSilver', title: 'Bulk Laptop Procurement', text: 'Standardised fleets or mixed specifications, new or refurbished, for teams of any size.' },
  { k: 'desktopTower', title: 'Desktop & Workstation Procurement', text: 'Office towers, all-in-ones, mini PCs and professional workstations.' },
  { k: 'keyboardMouse', title: 'IT Accessories', text: 'Docks, headsets, webcams, keyboards, monitors and cables in bulk.' },
  { k: 'printer', title: 'Printer & Networking Procurement', text: 'MFPs, scanners, switches, routers, Wi-Fi and cabling.' },
  { k: 'firewall', title: 'Software & Cybersecurity', text: 'Licences, endpoint protection, firewalls and data loss prevention.' },
  { k: 'server', title: 'Installation & IT Support', text: 'Deployment, configuration, AMC and on-site support after delivery.' },
]

const extras = [
  { icon: ClipboardList, title: 'One consolidated requirement' },
  { icon: Boxes, title: 'Multi-vendor comparison' },
  { icon: FileSpreadsheet, title: 'Itemised, GST-ready quotations' },
  { icon: Truck, title: 'Multi-location delivery, subject to location' },
  { icon: Headset, title: 'Deployment & support on request' },
  { icon: Receipt, title: 'Billing to your registered entity' },
]

export default function CorporatePage() {
  usePageMeta({
    title: 'Corporate IT Procurement — Bulk Laptops, Hardware & Services',
    description:
      'Submit one consolidated requirement for laptops, desktops, printers, networking, software and IT services. Multi-vendor sourcing and itemised quotations for businesses and institutions.',
  })
  return (
    <>
      <PageHero
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Corporate IT Procurement' }]}
        eyebrow="Corporate solutions"
        title={
          <>
            Your IT Procurement, <span className="text-gradient">Simplified.</span>
          </>
        }
        image="server"
        description="From individual laptops to bulk business hardware, Zova Infotech helps customers source technology products and IT solutions according to their requirements."
      >
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <Button to="/corporate-it-procurement#requirement" size="lg" iconRight={<ArrowRight size={18} />}>
            Submit Your Requirement
          </Button>
          <Button to="/contact" size="lg" variant="ghost-dark">
            Talk to our team
          </Button>
        </div>
      </PageHero>

      <section className="container-x py-20">
        <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map(({ k, title, text }) => (
            <RevealItem key={title} className="flex">
              <div className="glow-border group flex w-full rounded-[var(--radius-card)]">
                <div className="flex w-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white transition-shadow group-hover:border-transparent group-hover:shadow-[var(--shadow-card-hover)]">
                  <span className="bg-media flex aspect-[16/9] items-center justify-center overflow-hidden">
                    <SmartImage k={k} alt="" sizes="(min-width: 1024px) 30vw, 90vw" className="w-[62%] transition-transform duration-700 group-hover:scale-[1.07]" />
                  </span>
                  <div className="flex flex-col gap-2 p-6">
                    <h2 className="font-sans text-lg font-bold">{title}</h2>
                    <p className="text-[14.5px] leading-relaxed text-muted">{text}</p>
                  </div>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
        <ul className="mt-10 grid gap-3 rounded-3xl border border-line bg-surface p-5 sm:grid-cols-2 lg:grid-cols-3">
          {extras.map(({ icon: Icon, title }) => (
            <li key={title} className="flex items-center gap-3 text-[14.5px] font-semibold">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-violet-accent text-white">
                <Icon size={16} aria-hidden />
              </span>
              {title}
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-line bg-surface py-20">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading eyebrow="Process" title="How corporate procurement works" />
            <ol className="mt-8 flex flex-col gap-5">
              {processSteps.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-navy-950 font-mono text-sm font-semibold text-white">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-bold">{s.title}</h3>
                    <p className="mt-1 text-[14.5px] leading-relaxed text-muted">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal delay={0.08}>
            <SectionHeading eyebrow="Who it’s for" title="Organisations we support" />
            <ul className="mt-8 grid grid-cols-2 gap-3">
              {industries.map((ind) => {
                const Icon = miscIcon[ind.icon]
                return (
                  <li key={ind.title} className="flex flex-col gap-2 rounded-2xl border border-line bg-white p-4">
                    <Icon size={22} className="text-brand-600" aria-hidden />
                    <span className="font-bold">{ind.title}</span>
                    <span className="text-[13px] leading-relaxed text-muted">{ind.text}</span>
                  </li>
                )
              })}
            </ul>
          </Reveal>
        </div>
      </section>

      <section id="requirement" className="on-dark relative isolate scroll-mt-20 overflow-hidden bg-gradient-to-br from-navy-950 via-navy-800 to-[#0a2a5c] py-20 text-white">
        <CircuitLines className="opacity-50" />
        <div className="container-x grid gap-10 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-14">
          <div className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
            <span className="eyebrow text-cyan-accent">Procurement requirement</span>
            <h2 className="text-3xl leading-tight font-bold tracking-[-0.03em] sm:text-4xl">Submit your requirement</h2>
            <p className="leading-relaxed text-on-dark">
              Add each item with its specification and quantity. Not sure of exact specs? Describe the use case and we’ll recommend options.
            </p>
            <p className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-[13.5px] leading-relaxed text-on-dark">
              Quotations, availability, delivery schedules and service coverage are confirmed individually. Submitting a requirement does not
              place an order.
            </p>
          </div>
          <div className="rounded-3xl border border-line bg-white p-5 text-ink shadow-[0_30px_60px_-40px_rgb(11_18_32/0.25)] sm:p-8 lg:p-10">
            <CorporateForm />
          </div>
        </div>
      </section>
    </>
  )
}
