import { ArrowRight, Building, Clock, Handshake, Mail, MapPin, MessageCircle, Navigation, Phone, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ContactForm } from '../components/forms/ContactForm'
import { PageHero } from '../components/layout/PageHero'
import { Reveal, RevealGroup, RevealItem } from '../components/ui/Reveal'
import { site } from '../config/site'
import { paths } from '../data/routes'
import { mailLink, mapsLink, telLink, whatsappLink } from '../lib/contact'
import { usePageMeta } from '../lib/seo'

const contactJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.companyName,
  slogan: site.tagline,
  ...(site.siteUrl ? { url: site.siteUrl } : {}),
  ...(site.contact.phoneE164 ? { telephone: site.contact.phoneE164 } : {}),
  ...(site.contact.email ? { email: site.contact.email } : {}),
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.contact.address.street,
    addressLocality: site.contact.address.locality,
    addressRegion: site.contact.address.region,
    postalCode: site.contact.address.postalCode,
    addressCountry: site.contact.address.country,
  },
}

interface Card {
  icon: LucideIcon
  title: string
  value: string
  href: string
  cta: string
  ctaIcon: LucideIcon
  external?: boolean
  note: string
}

export default function ContactPage() {
  usePageMeta({
    title: 'Contact Us',
    description: `Contact ${site.companyName} — call ${site.contact.phoneDisplay}, email ${site.contact.email} or visit us at ${site.contact.addressFull} IT products, procurement and services enquiries.`,
    jsonLd: contactJsonLd,
  })

  const tel = telLink()
  const mail = mailLink('Enquiry from website')
  const maps = mapsLink()
  const wa = whatsappLink(site.contact.whatsappGreeting)

  const cards: Card[] = [
    ...(tel ? [{ icon: Phone, title: 'Call Our Team', value: site.contact.phoneDisplay!, href: tel, cta: 'Call Now', ctaIcon: Phone, note: 'Speak to us about products, quotes or support.' }] : []),
    ...(mail ? [{ icon: Mail, title: 'Email Us', value: site.contact.email!, href: mail, cta: 'Send an Email', ctaIcon: Mail, note: 'Share specifications or a bill of materials.' }] : []),
    ...(maps
      ? [{ icon: MapPin, title: 'Our Location', value: site.contact.addressFull, href: maps, cta: 'Get Directions', ctaIcon: Navigation, external: true, note: 'Opens Google Maps in a new tab.' }]
      : []),
  ]

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]}
        eyebrow="Contact us"
        title="Let’s talk about your IT requirements."
        image="headsetWorkstation"
        description={`Call, email or visit ${site.companyName} — or send your requirement below. We respond to every enquiry individually.`}
      />

      {/* Contact cards */}
      <section className="relative -mt-2 bg-[var(--background-primary)] pt-12 pb-6 sm:pt-16" aria-labelledby="reach-heading">
        <div className="container-x">
          <h2 id="reach-heading" className="sr-only">
            Reach {site.companyName} directly
          </h2>
          <RevealGroup className="grid gap-5 md:grid-cols-3">
            {cards.map(({ icon: Icon, title, value, href, cta, ctaIcon: CtaIcon, external, note }) => (
              <RevealItem key={title} className="h-full">
                <div className="group relative flex h-full flex-col gap-5 overflow-hidden rounded-[20px] border border-line bg-white p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_24px_50px_-24px_rgb(8_120_232/0.45)] sm:p-7 motion-reduce:hover:translate-y-0">
                  <span className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-[image:var(--gradient-primary)] transition-transform duration-500 group-hover:scale-x-100" aria-hidden />
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-[image:var(--gradient-primary)] text-white shadow-[0_12px_26px_-12px_rgb(8_120_232/0.8)] transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3 motion-reduce:transform-none">
                    <Icon size={24} strokeWidth={1.8} aria-hidden />
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-[13px] font-bold tracking-[0.12em] text-brand-600 uppercase">{title}</h3>
                    <a
                      href={href}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="text-[19px] leading-snug font-extrabold tracking-[-0.01em] break-words text-ink transition-colors hover:text-brand-600"
                    >
                      {value}
                    </a>
                    <p className="text-[13.5px] text-muted">{note}</p>
                  </div>
                  <a
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    aria-label={`${cta}: ${value}${external ? ' (opens in a new tab)' : ''}`}
                    className="mt-auto inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-[linear-gradient(110deg,#123b73,#0878e8_60%,#00a8c8)] bg-[length:200%_100%] bg-left px-5 text-[14px] font-bold text-white shadow-[0_10px_24px_-12px_rgb(8_120_232/0.9)] transition-[background-position,transform] duration-500 hover:bg-right active:scale-[0.98]"
                  >
                    <CtaIcon size={16} aria-hidden /> {cta}
                  </a>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Form + side panel */}
      <section className="bg-[var(--background-primary)] pt-8 pb-16 lg:pb-24" aria-labelledby="form-heading">
        <div className="container-x grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
          <Reveal>
            <div className="rounded-[24px] border border-line bg-white p-5 shadow-[var(--shadow-card)] sm:p-8 lg:p-10">
              <span className="eyebrow">Send an enquiry</span>
              <h2 id="form-heading" className="mt-3 mb-2 text-[28px] leading-tight font-extrabold tracking-[-0.03em] text-ink">
                Tell us what you need
              </h2>
              <p className="mb-7 text-[15px] text-muted">Share your requirement and our team will come back with options and a quotation.</p>
              <ContactForm />
            </div>
          </Reveal>
          <aside className="flex flex-col gap-5">
            <Reveal delay={0.05}>
              <div className="on-dark relative isolate overflow-hidden rounded-[20px] bg-[linear-gradient(150deg,#123b73,#0b2550)] p-6 text-white shadow-[var(--shadow-card)]">
                <div className="absolute -top-16 -right-16 -z-10 size-48 rounded-full bg-cyan-accent/20 blur-3xl" aria-hidden />
                <p className="text-[12px] font-bold tracking-[0.14em] text-cyan-accent uppercase">{site.companyName}</p>
                <p className="mt-1 text-[15px] font-semibold text-slate-100">{site.tagline}</p>
                <address className="mt-5 flex flex-col gap-3 text-[14px] not-italic">
                  {tel && (
                    <a href={tel} className="flex items-center gap-3 text-white hover:text-cyan-accent">
                      <Phone size={16} className="text-cyan-accent" aria-hidden /> {site.contact.phoneDisplay}
                    </a>
                  )}
                  {mail && (
                    <a href={mail} className="flex items-center gap-3 break-all text-white hover:text-cyan-accent">
                      <Mail size={16} className="shrink-0 text-cyan-accent" aria-hidden /> {site.contact.email}
                    </a>
                  )}
                  <span className="flex items-start gap-3 text-slate-200">
                    <MapPin size={16} className="mt-0.5 shrink-0 text-cyan-accent" aria-hidden /> {site.contact.addressFull}
                  </span>
                  <span className="flex items-start gap-3 text-slate-300">
                    <Clock size={16} className="mt-0.5 shrink-0 text-cyan-accent" aria-hidden /> Service coverage: {site.coverage}.
                  </span>
                </address>
                {wa && (
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1FAF38] text-[14px] font-bold text-white transition-colors hover:bg-[#189a30]"
                    aria-label="Chat with us on WhatsApp (opens in a new tab)"
                  >
                    <MessageCircle size={17} aria-hidden /> Chat on WhatsApp
                  </a>
                )}
              </div>
            </Reveal>
            <Reveal delay={0.1} className="grid gap-3">
              <Link
                to={`${paths.corporate}#requirement`}
                className="group flex items-center gap-3 rounded-2xl border border-line bg-white p-4 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:border-brand-300"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Building size={19} aria-hidden />
                </span>
                <span className="flex-1">
                  <span className="block font-bold text-ink">Business enquiry</span>
                  <span className="text-[13px] text-muted">Bulk & multi-product procurement</span>
                </span>
                <ArrowRight size={16} className="text-brand-600 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
              <Link
                to={paths.vendor}
                className="group flex items-center gap-3 rounded-2xl border border-line bg-white p-4 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:border-brand-300"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Handshake size={19} aria-hidden />
                </span>
                <span className="flex-1">
                  <span className="block font-bold text-ink">Vendor registration</span>
                  <span className="text-[13px] text-muted">Supply products or services to us</span>
                </span>
                <ArrowRight size={16} className="text-brand-600 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </Reveal>
          </aside>
        </div>
      </section>
    </>
  )
}
