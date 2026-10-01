import { Hero } from '../components/home/Hero'
import { BusinessValue, ITCategories, ServiceStrip, SolutionCta } from '../components/home/HomeIntro'
import {
  CommunicationSection,
  EnvironmentsSection,
  JourneySection,
  NewRefurbSection,
  PartnerSection,
  ProcurementSimplified,
  RequirementCta,
  SecureSection,
} from '../components/home/Premium'
import { FaqSection } from '../components/home/sections'
import { VideoShowcase } from '../components/home/VideoShowcase'
import { site } from '../config/site'
import { faqs } from '../data/content'
import { usePageMeta } from '../lib/seo'

const homeJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: site.companyName,
      ...(site.siteUrl ? { url: site.siteUrl } : {}),
      slogan: site.tagline,
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
      description:
        'Complete IT solutions and procurement partner in India: laptops, desktops, Apple devices, IT accessories, networking, cybersecurity and DLP, headsets and call-centre audio, meeting room technology, Microsoft 365 and cloud, and IT support.',
      knowsAbout: [
        'IT hardware procurement',
        'Laptop and MacBook procurement',
        'Audio video solutions',
        'Boardroom AV and video conferencing',
        'Digital signage solutions',
        'Microsoft 365 licensing',
        'Data Loss Prevention (DLP)',
        'Endpoint security',
        'Networking',
        'IT AMC and support',
        'Professional headsets and call centre solutions',
        'Refurbished IT equipment',
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ],
}

export default function HomePage() {
  usePageMeta({
    title: site.tagline,
    description:
      'Complete IT solutions and procurement for businesses — laptops, desktops, Apple devices, IT accessories, networking, cybersecurity, headsets, meeting room technology, cloud and IT support.',
    jsonLd: homeJsonLd,
  })
  return (
    <>
      {/* Rhythm (≈70% light / 30% dark): light hero with a dark composite visual → dark service strip → light value, IT categories → dark CTA → dark product showcase → light communication,
          partner, journey → dark security → light procurement, new & refurbished, industries, FAQ → dark CTA → dark footer */}
      <Hero />
      <ServiceStrip />
      <BusinessValue />
      <ITCategories />
      <SolutionCta />
      <VideoShowcase />
      <CommunicationSection />
      <PartnerSection />
      <JourneySection />
      <SecureSection />
      <ProcurementSimplified />
      <NewRefurbSection />
      <EnvironmentsSection />
      <FaqSection />
      <RequirementCta />
    </>
  )
}
