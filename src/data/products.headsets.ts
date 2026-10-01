/**
 * Professional headsets & meeting-room audio — DEMONSTRATION LISTINGS (isDemo: true).
 *
 * Model names and the connection / wearing-style facts below come from the manufacturers'
 * published product pages. No price, stock, warranty, certification or partnership is claimed.
 * Platform certification (e.g. Microsoft Teams) is variant-specific, so listings only say that
 * certified variants exist and that the exact SKU must be confirmed in the quotation.
 */
import type { AudioSpecs, Product } from './types'

type Draft = Omit<Product, 'images' | 'enquiry' | 'isDemo' | 'category' | 'condition' | 'specs'> & {
  audio: AudioSpecs
  specs?: Product['specs']
}

const CONFIRM = 'Teams / UC variants available — confirm exact SKU'

const hs = (p: Draft): Product => ({
  images: [],
  enquiry: { quote: true, whatsapp: true },
  isDemo: true,
  category: 'headsets-audio-solutions',
  condition: 'new',
  specs: {},
  ...p,
})

export const headsetProducts: Product[] = [
  // ─── HP Poly ───────────────────────────────────────────────────────────
  hs({
    id: 'ZV-DEMO-H001',
    slug: 'poly-blackwire-3200-series',
    name: 'Poly Blackwire 3200 Series (3210 / 3220)',
    brand: 'Poly',
    model: 'Blackwire 3210 mono · 3220 stereo',
    subcategory: 'USB Headsets',
    description: 'Lightweight corded USB headsets for everyday office calling, in mono (3210) or stereo (3220) with USB-A or USB-C connectors.',
    audio: { connectivity: ['USB-A', 'USB-C'], link: 'Wired', wearing: 'Mono (3210) or stereo (3220)', microphone: 'Noise-cancelling boom microphone', platforms: CONFIRM, workplace: ['Office', 'Call Centre', 'Remote Work'] },
  }),
  hs({
    id: 'ZV-DEMO-H002',
    slug: 'poly-blackwire-5200-series',
    name: 'Poly Blackwire 5200 Series (5210 / 5220)',
    brand: 'Poly',
    model: 'Blackwire 5210 mono · 5220 stereo',
    subcategory: 'USB Headsets',
    description: 'Corded USB headsets with an additional 3.5 mm connection, so the same headset works with a PC and a mobile device.',
    audio: { connectivity: ['USB-A', 'USB-C', '3.5 mm'], link: 'Wired', wearing: 'Mono (5210) or stereo (5220)', microphone: 'Noise-cancelling boom microphone', platforms: CONFIRM, workplace: ['Office', 'Remote Work'] },
  }),
  hs({
    id: 'ZV-DEMO-H003',
    slug: 'poly-encorepro-500-series',
    name: 'Poly EncorePro 500 Series (515 / 525)',
    brand: 'Poly',
    model: 'EncorePro 515 mono · 525 stereo (USB)',
    subcategory: 'Call Centre Headsets',
    description: 'Contact-centre headsets built for all-day wear, with USB-A and USB-C versions and Teams-optimised "-M" variants.',
    audio: { connectivity: ['USB-A', 'USB-C'], link: 'Wired', wearing: 'Mono (515) or stereo (525)', microphone: 'Noise-cancelling boom microphone', platforms: CONFIRM, workplace: ['Call Centre', 'Office'] },
  }),
  hs({
    id: 'ZV-DEMO-H004',
    slug: 'poly-voyager-4300-uc-series',
    name: 'Poly Voyager 4300 UC Series (4310 / 4320)',
    brand: 'Poly',
    model: 'Voyager 4310 mono · 4320 stereo UC',
    subcategory: 'Wireless Bluetooth Headsets',
    description: 'Bluetooth office headsets supplied with a USB-A or USB-C Bluetooth adapter; an optional charge stand is available.',
    audio: { connectivity: ['Bluetooth', 'USB-A', 'USB-C'], link: 'Wireless', wearing: 'Mono (4310) or stereo (4320)', microphone: 'Noise-cancelling boom microphone', platforms: CONFIRM, workplace: ['Office', 'Remote Work', 'Call Centre'] },
  }),
  hs({
    id: 'ZV-DEMO-H005',
    slug: 'poly-voyager-focus-2-uc',
    name: 'Poly Voyager Focus 2 UC',
    brand: 'Poly',
    model: 'Voyager Focus 2 UC',
    subcategory: 'Wireless Bluetooth Headsets',
    description: 'Stereo Bluetooth headset with active noise cancelling for open-plan offices, with USB adapter and optional charge stand.',
    audio: { connectivity: ['Bluetooth', 'USB-A', 'USB-C'], link: 'Wireless', wearing: 'Stereo', microphone: 'Boom microphone with noise reduction; ANC on the earcups', platforms: CONFIRM, workplace: ['Office', 'Remote Work'] },
  }),
  hs({
    id: 'ZV-DEMO-H006',
    slug: 'poly-sync-speakerphones',
    name: 'Poly Sync Speakerphones (Sync 20 / 40 / 60)',
    brand: 'Poly',
    model: 'Sync 20 · Sync 40 · Sync 60',
    subcategory: 'Meeting Room Audio',
    description: 'USB and Bluetooth speakerphones — from a personal Sync 20 to room-sized Sync 40 and Sync 60 models for huddle and meeting rooms.',
    audio: { connectivity: ['USB-A', 'USB-C', 'Bluetooth'], link: 'Wired & Bluetooth', microphone: 'Multi-microphone array (varies by model)', platforms: CONFIRM, workplace: ['Meeting Room', 'Office', 'Remote Work'] },
  }),

  // ─── Jabra ─────────────────────────────────────────────────────────────
  hs({
    id: 'ZV-DEMO-H007',
    slug: 'jabra-evolve2-30-se',
    name: 'Jabra Evolve2 30 SE',
    brand: 'Jabra',
    model: 'Evolve2 30 SE (mono / stereo)',
    subcategory: 'USB Headsets',
    description: 'Corded USB headset for hybrid workers, in mono or stereo with USB-A or USB-C connectors.',
    audio: { connectivity: ['USB-A', 'USB-C'], link: 'Wired', wearing: 'Mono or stereo versions', microphone: 'Boom microphone', platforms: CONFIRM, workplace: ['Office', 'Remote Work', 'Call Centre'] },
  }),
  hs({
    id: 'ZV-DEMO-H008',
    slug: 'jabra-evolve2-65-flex',
    name: 'Jabra Evolve2 65 Flex',
    brand: 'Jabra',
    model: 'Evolve2 65 Flex',
    subcategory: 'Wireless Bluetooth Headsets',
    description: 'Foldable stereo Bluetooth headset for mobile and hybrid workers, supplied with a USB Bluetooth adapter.',
    audio: { connectivity: ['Bluetooth', 'USB-A', 'USB-C'], link: 'Wireless', wearing: 'Stereo', microphone: 'Foldable boom microphone', platforms: CONFIRM, workplace: ['Remote Work', 'Office'] },
  }),
  hs({
    id: 'ZV-DEMO-H009',
    slug: 'jabra-engage-50-ii',
    name: 'Jabra Engage 50 II',
    brand: 'Jabra',
    model: 'Engage 50 II (mono / stereo)',
    subcategory: 'Call Centre Headsets',
    description: 'Corded digital headset designed for contact centres, in mono and stereo with USB connection.',
    audio: { connectivity: ['USB-A', 'USB-C'], link: 'Wired', wearing: 'Mono or stereo versions', microphone: 'Noise-cancelling boom microphone', platforms: CONFIRM, workplace: ['Call Centre'] },
  }),

  // ─── Other brands ──────────────────────────────────────────────────────
  hs({
    id: 'ZV-DEMO-H010',
    slug: 'yealink-uh34',
    name: 'Yealink UH34',
    brand: 'Yealink',
    model: 'UH34 mono / dual',
    subcategory: 'USB Headsets',
    description: 'Wideband corded USB headset in mono or dual-ear versions, with USB-A or USB-C and Teams / UC variants.',
    audio: { connectivity: ['USB-A', 'USB-C'], link: 'Wired', wearing: 'Mono or dual (stereo)', microphone: 'Noise-cancelling boom microphone', platforms: CONFIRM, workplace: ['Office', 'Call Centre', 'Remote Work'] },
  }),
  hs({
    id: 'ZV-DEMO-H011',
    slug: 'logitech-zone-wired',
    name: 'Logitech Zone Wired',
    brand: 'Logitech',
    model: 'Zone Wired',
    subcategory: 'USB Headsets',
    description: 'Stereo USB-C headset supplied with a USB-A adapter, for open offices and home workers.',
    audio: { connectivity: ['USB-C', 'USB-A'], link: 'Wired', wearing: 'Stereo', microphone: 'Noise-cancelling boom microphone', platforms: CONFIRM, workplace: ['Office', 'Remote Work'] },
  }),
  hs({
    id: 'ZV-DEMO-H012',
    slug: 'cisco-headset-730',
    name: 'Cisco Headset 730',
    brand: 'Cisco',
    model: 'Headset 730',
    subcategory: 'Wireless Bluetooth Headsets',
    description: 'Stereo Bluetooth headset with active noise cancellation and a USB adapter, for Webex and other calling platforms.',
    audio: { connectivity: ['Bluetooth', 'USB-A', 'USB-C'], link: 'Wireless', wearing: 'Stereo', microphone: 'Integrated microphones', platforms: 'Confirm platform support for the exact SKU', workplace: ['Office', 'Remote Work'] },
  }),
  hs({
    id: 'ZV-DEMO-H013',
    slug: 'epos-headsets-on-request',
    name: 'EPOS Professional Headsets — models on request',
    brand: 'EPOS',
    model: 'Model confirmed in quotation',
    subcategory: 'USB Headsets',
    description: 'EPOS office and contact-centre headsets can be sourced to requirement; tell us your connection type and use case.',
    audio: { connectivity: ['USB-A', 'USB-C', 'Bluetooth'], link: 'Wired or wireless (by model)', platforms: 'Confirm with the chosen model', workplace: ['Office', 'Call Centre'] },
  }),

  // ─── Accessories ───────────────────────────────────────────────────────
  hs({
    id: 'ZV-DEMO-H014',
    slug: 'headset-accessories',
    name: 'Headset Accessories',
    brand: 'Multiple brands',
    model: 'Ear cushions · adapters · stands · cables',
    subcategory: 'Headset Accessories',
    description: 'Replacement ear cushions, USB-C to USB-A adapters, Bluetooth dongles, charging stands and extension or quick-disconnect cables — matched to your headset model.',
    audio: { connectivity: ['USB-A', 'USB-C', 'Bluetooth'], link: 'Accessory', workplace: ['Call Centre', 'Office', 'Meeting Room'] },
  }),
]
