import {
  ArrowRight,
  BadgeCheck,
  ClipboardList,
  Cloud,
  Cpu,
  FileSearch,
  Handshake,
  HardDrive,
  Headset,
  LifeBuoy,
  Network,
  PackageCheck,
  Presentation,
  Scale,
  Search,
  Settings2,
  ShieldCheck,
  Truck,
  Cctv,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { paths } from '../../data/routes'
import { Button } from '../ui/Button'
import { Reveal, RevealGroup, RevealItem } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

/* ——— IT procurement workflow ——— */

const flow: { t: string; d: string; icon: LucideIcon }[] = [
  { t: 'Requirement', d: 'Devices, quantities, specs, sites and timelines.', icon: ClipboardList },
  { t: 'Sourcing', d: 'Options identified across brands and distributors.', icon: Search },
  { t: 'Vendor comparison', d: 'Specifications, lead times and terms compared.', icon: Scale },
  { t: 'Negotiation', d: 'Commercials agreed on your behalf.', icon: Handshake },
  { t: 'Procurement', d: 'Itemised, GST-ready quotation and ordering.', icon: PackageCheck },
  { t: 'Delivery', d: 'Dispatch, installation and configuration on request.', icon: Truck },
  { t: 'Support', d: 'Warranty coordination, AMC and ongoing support.', icon: LifeBuoy },
]

const focus = [
  'IT hardware procurement',
  'Software procurement',
  'Enterprise technology sourcing',
  'Vendor coordination',
  'Asset procurement',
  'New & refurbished IT equipment',
  'Pan-India support, subject to location',
]

export function ProcurementSection() {
  return (
    <section id="procurement" className="relative scroll-mt-16 overflow-hidden bg-[var(--background-primary)] py-20 lg:py-28" aria-labelledby="proc-heading">
      <div className="absolute -top-32 left-[-10%] -z-0 size-[520px] rounded-full bg-[radial-gradient(circle,rgb(10_123_193/0.10),transparent_65%)]" aria-hidden />
      <div className="container-x relative flex flex-col gap-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-end">
          <Reveal>
            <SectionHeading
              eyebrow="IT procurement"
              title={<span id="proc-heading">Your IT procurement, simplified.</span>}
              description="From a single laptop to multi-site rollouts, we take a requirement from brief to delivery — and stay on for support."
            />
          </Reveal>
          <Reveal delay={0.08}>
            <ul className="flex flex-wrap gap-2">
              {focus.map((f) => (
                <li key={f} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[13px] font-semibold text-ink shadow-[var(--shadow-card)]">
                  <BadgeCheck size={14} className="text-brand-600" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="relative">
          <div className="absolute top-7 right-[7%] left-[7%] hidden h-px overflow-hidden bg-brand-200 lg:block" aria-hidden>
            <div className="h-full w-1/5 animate-flow-x bg-gradient-to-r from-transparent via-brand-500 to-transparent" />
          </div>
          <RevealGroup className="relative grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7" stagger={0.07}>
            {flow.map(({ t, d, icon: Icon }, i) => (
              <RevealItem key={t} className="flex">
                <div className="group flex w-full flex-col items-center gap-3 text-center">
                  <span className="relative flex size-14 items-center justify-center rounded-2xl border border-line bg-white text-brand-600 shadow-[var(--shadow-card)] transition duration-300 group-hover:-translate-y-1 group-hover:border-brand-300 group-hover:bg-[image:var(--gradient-primary)] group-hover:text-white">
                    <Icon size={22} aria-hidden />
                    <span className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-white">{i + 1}</span>
                  </span>
                  <span className="text-[14.5px] font-bold text-ink">{t}</span>
                  <span className="text-[12.5px] leading-relaxed text-muted">{d}</span>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <Reveal className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button to={`${paths.corporate}#requirement`} size="lg" iconRight={<ArrowRight size={18} />}>
            Get Procurement Support
          </Button>
          <Button to={paths.corporate} size="lg" variant="secondary">
            Corporate procurement details
          </Button>
        </Reveal>
        <p className="text-center text-[12.5px] text-subtle">Quotations, lead times and service coverage are confirmed individually for each requirement.</p>
      </div>
    </section>
  )
}

/* ——— Services ——— */

const serviceCards: { t: string; d: string; to: string; icon: LucideIcon }[] = [
  { t: 'IT support', d: 'Remote and on-site help for users and devices.', to: paths.service('desktop-laptop-support'), icon: Headset },
  { t: 'AMC', d: 'Annual maintenance contracts scoped to your fleet.', to: paths.service('it-amc'), icon: Wrench },
  { t: 'Hardware support', d: 'Diagnosis, repair, upgrades and part replacement.', to: paths.service('computer-repair'), icon: Cpu },
  { t: 'Software support', d: 'Installation, licensing and application setup.', to: paths.service('software-licensing'), icon: Settings2 },
  { t: 'Network support', d: 'LAN, Wi-Fi and firewall setup and troubleshooting.', to: paths.service('network-setup'), icon: Network },
  { t: 'Endpoint management', d: 'Device setup, policies and patching, incl. Intune.', to: paths.microsoft, icon: HardDrive },
  { t: 'IT asset management', d: 'Track, refresh and retire devices across sites.', to: paths.corporate, icon: FileSearch },
  { t: 'CCTV & surveillance', d: 'Cameras, recorders and monitoring, installed.', to: paths.service('cctv-surveillance'), icon: Cctv },
  { t: 'Installation & configuration', d: 'Imaging, deployment and handover.', to: paths.service('installation-configuration'), icon: PackageCheck },
  { t: 'Cybersecurity & DLP', d: 'Endpoint security and data-protection policies.', to: paths.service('cybersecurity-dlp'), icon: ShieldCheck },
  { t: 'Microsoft solutions', d: 'Microsoft 365, Intune, Entra ID, Defender, Purview.', to: paths.microsoft, icon: Cloud },
  { t: 'AV & signage support', d: 'Meeting rooms, displays and signage, maintained.', to: paths.service('audio-visual-digital-signage'), icon: Presentation },
]

export function ServicesSection() {
  return (
    <section className="bg-white py-20 lg:py-28" aria-labelledby="svc-heading">
      <div className="container-x flex flex-col gap-10">
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="IT services"
            title={<span id="svc-heading">Support that keeps every system running.</span>}
            description="IT support services, AMC, security and Microsoft solutions — available on enquiry, with scope and coverage confirmed for your locations."
          />
          <Button to={paths.services} variant="secondary" className="shrink-0" iconRight={<ArrowRight size={17} />}>
            All services
          </Button>
        </Reveal>
        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.04}>
          {serviceCards.map(({ t, d, to, icon: Icon }) => (
            <RevealItem key={t} className="flex">
              <Link
                to={to}
                className="group flex w-full flex-col gap-3 rounded-[18px] border border-line bg-white p-5 shadow-[var(--shadow-card)] transition duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:border-brand-300 hover:shadow-[var(--shadow-card-hover)] motion-reduce:hover:transform-none"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors duration-300 group-hover:bg-[image:var(--gradient-primary)] group-hover:text-white">
                  <Icon size={20} aria-hidden />
                </span>
                <span className="text-[16px] font-bold text-ink group-hover:text-brand-700">{t}</span>
                <span className="text-[13.5px] leading-relaxed text-muted">{d}</span>
                <span className="mt-auto inline-flex items-center gap-1 text-[13px] font-bold text-brand-600">
                  Learn more <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

