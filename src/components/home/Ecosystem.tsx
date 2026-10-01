import { ArrowUpRight, Cloud, HardDrive, Headset, MonitorPlay, Network, PackageCheck, ShieldCheck, Video, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { paths } from '../../data/routes'
import { cn } from '../../lib/cn'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal, RevealGroup, RevealItem } from '../ui/Reveal'

const areas: { title: string; items: string[]; to: string; icon: LucideIcon; tone: string }[] = [
  { title: 'IT Hardware', items: ['Laptops', 'Desktops', 'MacBooks', 'Monitors', 'Printers', 'Accessories'], to: paths.products, icon: HardDrive, tone: 'from-brand-600 to-cyan-accent' },
  { title: 'Audio & Video', items: ['Conference rooms', 'Boardrooms', 'Video conferencing', 'Speakers', 'Displays'], to: paths.av, icon: Video, tone: 'from-brand-600 to-violet-accent' },
  { title: 'Digital Signage', items: ['LED walls', 'Commercial displays', 'Kiosks', 'Digital menu boards'], to: `${paths.av}?cat=signage`, icon: MonitorPlay, tone: 'from-orange-accent to-crimson-accent' },
  { title: 'Microsoft', items: ['Microsoft 365', 'Licensing', 'Intune', 'Entra', 'Power BI'], to: paths.microsoft, icon: Cloud, tone: 'from-cyan-accent to-brand-600' },
  { title: 'Cybersecurity', items: ['Endpoint security', 'DLP', 'Data protection', 'Security policies'], to: paths.service('cybersecurity-dlp'), icon: ShieldCheck, tone: 'from-teal-accent to-cyan-accent' },
  { title: 'Networking', items: ['Switches', 'Wi-Fi', 'Firewall', 'Structured networking'], to: paths.service('network-setup'), icon: Network, tone: 'from-violet-accent to-purple-accent' },
  { title: 'IT Procurement', items: ['New IT assets', 'Refurbished IT assets', 'Bulk procurement', 'Vendor management'], to: paths.corporate, icon: PackageCheck, tone: 'from-purple-accent to-brand-600' },
  { title: 'AMC & Support', items: ['Installation', 'Maintenance', 'On-site support', 'Remote support'], to: paths.service('it-amc'), icon: Headset, tone: 'from-teal-accent to-brand-600' },
]

/** "Complete IT ecosystem" — eight practice areas with links to their pages. */
export function EcosystemSection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28" aria-labelledby="eco-heading">
      <div className="dot-bg absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" aria-hidden />
      <div className="container-x flex flex-col gap-12">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Complete IT ecosystem"
            title={<span id="eco-heading">Everything your workplace runs on, from one IT solutions provider.</span>}
            description="Hardware procurement, audio-video, digital signage, Microsoft solutions, security, networking and support — planned together so every piece works with the rest."
          />
        </Reveal>
        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.05}>
          {areas.map(({ title, items, to, icon: Icon, tone }) => (
            <RevealItem key={title} className="flex">
              <Link
                to={to}
                className="glow-border group flex w-full rounded-[var(--radius-card)]"
              >
                <span className="relative flex w-full flex-col gap-4 overflow-hidden rounded-[var(--radius-card)] border border-line bg-white p-6 transition-shadow duration-300 group-hover:border-transparent group-hover:shadow-[var(--shadow-card-hover)]">
                  <span className={cn('absolute -top-16 -right-16 size-40 rounded-full bg-gradient-to-br opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-25', tone)} aria-hidden />
                  <span className="flex items-center justify-between">
                    <span className="relative flex size-12 items-center justify-center">
                      <span className={cn('absolute inset-0 rounded-2xl bg-gradient-to-br opacity-40 transition-transform duration-700 group-hover:scale-125 group-hover:opacity-0', tone)} aria-hidden />
                      <span className={cn('relative flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-[0_10px_24px_-10px_rgb(12_93_174/0.7)] transition-transform duration-500 group-hover:-rotate-6', tone)}>
                        <Icon size={22} aria-hidden />
                      </span>
                    </span>
                    <ArrowUpRight size={20} className="text-slate-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-600" aria-hidden />
                  </span>
                  <span className="text-[18px] font-bold tracking-[-0.01em] group-hover:text-brand-700">{title}</span>
                  <span className="flex flex-wrap gap-x-2 gap-y-1 text-[13.5px] leading-relaxed text-muted">
                    {items.map((it, i) => (
                      <span key={it} className="inline-flex items-center gap-2">
                        {i > 0 && <span className="size-1 rounded-full bg-slate-300" aria-hidden />}
                        {it}
                      </span>
                    ))}
                  </span>
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
