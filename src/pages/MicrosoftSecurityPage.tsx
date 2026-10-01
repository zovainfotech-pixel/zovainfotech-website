import {
  ArrowRight,
  BarChart3,
  Cloud,
  ExternalLink,
  FileSearch,
  FileLock2,
  Fingerprint,
  Info,
  KeyRound,
  Laptop,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Tags,
  UserCheck,
  type LucideIcon,
} from 'lucide-react'
import { Orbs } from '../components/brand/Decor'
import { MicrosoftVisual } from '../components/home/TechSolutions'
import { Breadcrumbs } from '../components/layout/PageHero'
import { Button } from '../components/ui/Button'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Reveal, RevealGroup, RevealItem } from '../components/ui/Reveal'
import { paths } from '../data/routes'
import { cn } from '../lib/cn'
import { usePageMeta } from '../lib/seo'

const quoteHref = `${paths.quote}?type=Software&model=${encodeURIComponent('Microsoft 365 / security licensing')}`

type Item = { icon: LucideIcon; title: string; text: string }

const microsoft: Item[] = [
  { icon: Cloud, title: 'Microsoft 365 licensing', text: 'Help choosing between Business and Enterprise plans and add-ons, plus quotations, new subscriptions and renewals.' },
  { icon: Smartphone, title: 'Microsoft Intune', text: 'Enrol, configure and manage Windows, macOS and mobile devices, with compliance and app policies.' },
  { icon: UserCheck, title: 'Microsoft Entra ID', text: 'Identity and access: multi-factor authentication, single sign-on and access policies for users and apps.' },
  { icon: ShieldCheck, title: 'Microsoft Defender', text: 'Protection for endpoints, email and collaboration, configured to match your licences and risk.' },
  { icon: BarChart3, title: 'Power BI', text: 'Licensing and set-up for reporting and dashboards across your Microsoft 365 data.' },
  { icon: Laptop, title: 'Deployment & migration', text: 'Tenant set-up, mailbox and file migration, device roll-out and user onboarding.' },
]

const purview: Item[] = [
  { icon: Tags, title: 'Information Protection', text: 'Sensitivity labels to classify documents and email — for example Public, Internal, Confidential — with encryption where required.' },
  { icon: FileLock2, title: 'Data Loss Prevention (DLP)', text: 'Policies that detect and restrict sharing of sensitive information across Exchange, SharePoint, OneDrive and Teams.' },
  { icon: Laptop, title: 'Endpoint DLP', text: 'Extends DLP to onboarded Windows and macOS devices: copying to USB, printing, uploading and more.' },
  { icon: ShieldAlert, title: 'Insider Risk Management', text: 'Identify and investigate risky activity such as data theft by departing users, with privacy controls.' },
  { icon: FileSearch, title: 'eDiscovery & Audit', text: 'Search, hold and export content for investigations, and review audit logs.' },
  { icon: Fingerprint, title: 'Data security posture', text: 'Review where sensitive data lives and how it moves, then tune policies over time.' },
]

const steps = [
  { t: 'Assess', d: 'Review current licences, devices and where sensitive data lives.' },
  { t: 'Design', d: 'Recommend plans and draft labels and DLP policies for your data.' },
  { t: 'Pilot', d: 'Run policies in simulation mode with a pilot group before enforcing.' },
  { t: 'Deploy & support', d: 'Roll out, train users and fine-tune; ongoing support on request.' },
]

export default function MicrosoftSecurityPage() {
  usePageMeta({
    title: 'Microsoft 365 Licensing, Purview & DLP Security',
    description:
      'Microsoft 365 licensing, Intune, Entra ID and Defender, plus Microsoft Purview Information Protection and Data Loss Prevention (DLP) — planned, deployed and supported by Zova Infotech.',
  })
  return (
    <>
      <section className="on-dark aurora relative isolate overflow-hidden text-white">
        <Orbs />
        <div className="grid-bg absolute inset-0 -z-10 opacity-70 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_78%)]" aria-hidden />
        <div className="container-x grid items-center gap-10 py-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:py-20">
          <div className="flex min-w-0 flex-col gap-6">
            <Breadcrumbs dark items={[{ label: 'Home', to: '/' }, { label: 'Microsoft & Security' }]} />
            <span className="inline-flex items-center gap-2 self-start rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 font-mono text-[11px] font-semibold tracking-[0.12em] text-teal-200 uppercase">
              Microsoft solutions · Cybersecurity & DLP
            </span>
            <h1 className="text-[36px] leading-[1.05] font-bold tracking-[-0.035em] sm:text-5xl lg:text-[54px]">
              Microsoft 365 licensing and <span className="text-gradient">data loss prevention</span>, done properly.
            </h1>
            <p className="max-w-xl text-[16.5px] leading-relaxed text-on-dark">
              The right Microsoft 365 plans for your users, devices managed and secured, and Microsoft Purview policies that protect sensitive
              information without getting in the way of work.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button to={quoteHref} size="lg" iconRight={<ArrowRight size={18} />}>
                Request a quote
              </Button>
              <Button to={paths.contact} size="lg" variant="ghost-dark">
                Talk to an IT expert
              </Button>
            </div>
          </div>
          <div className="relative h-[300px] overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] sm:h-[360px]" aria-hidden>
            <MicrosoftVisual />
          </div>
        </div>
      </section>

      <section id="microsoft" className="scroll-mt-24 py-16 lg:py-24" aria-labelledby="ms-heading">
        <div className="container-x flex flex-col gap-10">
          <Reveal>
            <SectionHeading
              eyebrow="Microsoft solutions"
              title={<span id="ms-heading">Microsoft 365, identity and device management.</span>}
              description="Licences sized to how your people work, and the tools around them configured, not just switched on."
            />
          </Reveal>
          <Cards items={microsoft} tone="from-brand-600 to-cyan-accent" />
        </div>
      </section>

      <section id="security" className="scroll-mt-24 border-y border-line bg-surface py-16 lg:py-24" aria-labelledby="dlp-heading">
        <div className="container-x flex flex-col gap-10">
          <Reveal>
            <SectionHeading
              eyebrow="Cybersecurity & DLP"
              title={<span id="dlp-heading">Protect sensitive data with Microsoft Purview.</span>}
              description="Classify information, control how it is shared, and see where risk is building — across email, files, chat and devices."
            />
          </Reveal>
          <Cards items={purview} tone="from-teal-accent to-cyan-accent" />
          <Reveal>
            <div className="flex flex-col gap-4 rounded-2xl border border-brand-200 bg-brand-50 p-5 text-[14.5px] leading-relaxed text-blue-950 sm:flex-row sm:items-start">
              <Info size={20} className="mt-0.5 shrink-0 text-brand-600" aria-hidden />
              <p>
                <span className="font-bold">Licensing matters.</span> Features vary by Microsoft 365 plan and add-on — some Purview capabilities, such as
                Endpoint DLP and Insider Risk Management, need specific enterprise or compliance licences. We check your requirements against
                Microsoft’s current service descriptions before quoting.{' '}
                <a
                  href="https://learn.microsoft.com/en-us/office365/servicedescriptions/microsoft-365-service-descriptions/microsoft-365-tenantlevel-services-licensing-guidance/microsoft-purview-service-description"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-brand-700 underline underline-offset-2"
                >
                  Microsoft Purview service description <ExternalLink size={13} aria-hidden />
                </a>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="ms-process">
        <div className="container-x flex flex-col gap-10">
          <Reveal>
            <SectionHeading align="center" eyebrow="How we deliver" title={<span id="ms-process">From licence review to enforced policies.</span>} />
          </Reveal>
          <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <RevealItem key={s.t} className="flex">
                <div className="card flex w-full flex-col gap-3 p-6">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-accent to-brand-600 font-mono text-sm font-semibold text-white">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-[17px] font-bold">{s.t}</h3>
                  <p className="text-[14.5px] leading-relaxed text-muted">{s.d}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button to={quoteHref} iconRight={<ArrowRight size={17} />}>
                Request a quote
              </Button>
              <Button to={paths.service('cybersecurity-dlp')} variant="secondary" iconRight={<KeyRound size={16} />}>
                Other endpoint security & DLP options
              </Button>
            </div>
            <p className="max-w-3xl text-[12px] leading-relaxed text-muted">
              Microsoft, Microsoft 365, Microsoft Purview, Intune, Entra, Defender and Power BI are trademarks of the Microsoft group of companies.
              Zova Infotech’s partner status and licensing programmes are confirmed on enquiry.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

function Cards({ items, tone }: { items: Item[]; tone: string }) {
  return (
    <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(({ icon: Icon, title, text }) => (
        <RevealItem key={title} className="flex">
          <div className="glow-border group flex w-full rounded-[var(--radius-card)]">
            <div className="flex w-full flex-col gap-3 rounded-[var(--radius-card)] border border-line bg-white p-6 transition-shadow group-hover:border-transparent group-hover:shadow-[var(--shadow-card-hover)]">
              <span className={cn('flex size-11 items-center justify-center rounded-xl bg-gradient-to-br text-white transition-transform duration-500 group-hover:-rotate-6', tone)}>
                <Icon size={20} aria-hidden />
              </span>
              <h3 className="text-[17px] font-bold">{title}</h3>
              <p className="text-[14.5px] leading-relaxed text-muted">{text}</p>
            </div>
          </div>
        </RevealItem>
      ))}
    </RevealGroup>
  )
}
