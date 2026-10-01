import type { Category, CategorySlug } from './types'

export const categories: Category[] = [
  {
    slug: 'new-laptops',
    name: 'New Laptops',
    shortName: 'New Laptops',
    description: 'Factory-new business, student, performance and premium laptops, sourced to your specification.',
    subcategories: ['Business laptops', 'Student laptops', 'Performance laptops', 'Premium laptops'],
    art: 'laptop',
    seoTitle: 'New Laptops — Business, Student & Performance',
    seoDescription:
      'Enquire for new business, student, performance and premium laptops from leading brands. Specifications listed clearly; pricing and availability confirmed per quote.',
  },
  {
    slug: 'refurbished-laptops',
    name: 'Refurbished & Used Laptops',
    shortName: 'Refurbished Laptops',
    description: 'Business-class refurbished and used laptops with condition, battery and defects disclosed per unit.',
    subcategories: ['Business-class refurbished', 'Budget laptops', 'Used laptops'],
    art: 'laptop',
    seoTitle: 'Refurbished & Used Laptops — Condition Clearly Graded',
    seoDescription:
      'Browse refurbished and used laptops with transparent specifications, condition grades, battery notes and disclosed defects. Enquire for price and warranty.',
  },
  {
    slug: 'desktops-workstations',
    name: 'Desktops & Workstations',
    shortName: 'Desktops',
    description: 'Office towers, all-in-ones, mini PCs and professional workstations.',
    subcategories: ['Office desktops', 'All-in-one PCs', 'Mini PCs', 'Workstations'],
    art: 'desktop',
    seoTitle: 'Desktops & Workstations',
    seoDescription: 'Office desktops, all-in-one PCs, mini PCs and workstations for businesses and institutions. Request a quotation.',
  },
  {
    slug: 'apple-products',
    name: 'Apple Products',
    shortName: 'Apple',
    description: 'MacBook, iMac, Mac mini, iPhone, iPad, AirPods, Apple Watch and accessories — new or pre-owned, sourced on request.',
    subcategories: ['MacBook', 'iMac & Mac mini', 'iPhone', 'iPad', 'AirPods', 'Apple Watch', 'Accessories'],
    art: 'tablet',
    seoTitle: 'Apple Products — MacBook, iPhone, iPad, AirPods & Accessories',
    seoDescription: 'Enquire for Apple MacBook, iMac, Mac mini, iPhone, iPad, AirPods, Apple Watch and accessories for business. Availability and pricing confirmed on request.',
  },
  {
    slug: 'monitors-displays',
    name: 'Monitors & Displays',
    shortName: 'Monitors',
    description: 'Office monitors, design displays and large-format screens.',
    subcategories: ['Office monitors', 'Professional displays', 'Large-format displays'],
    art: 'monitor',
    seoTitle: 'Monitors & Displays',
    seoDescription: 'Office and professional monitors and large-format displays for workplaces. Request a quotation.',
  },
  {
    slug: 'printers-scanners',
    name: 'Printers & Scanners',
    shortName: 'Printers',
    description: 'Laser, ink-tank and multifunction printers, document scanners and consumables.',
    subcategories: ['Laser printers', 'Ink-tank printers', 'Multifunction printers', 'Scanners'],
    art: 'printer',
    seoTitle: 'Printers & Scanners',
    seoDescription: 'Laser, ink-tank and multifunction printers and document scanners for offices. Enquire for models and pricing.',
  },
  {
    slug: 'it-accessories',
    name: 'IT Accessories',
    shortName: 'Accessories',
    description: 'Keyboards, mice, chargers, docks, headsets, webcams, stands and cables.',
    subcategories: [
      'Keyboards & mice',
      'Chargers & adapters',
      'USB hubs & docking stations',
      'Laptop stands',
      'Headsets & webcams',
      'Cables',
    ],
    art: 'keyboard',
    seoTitle: 'IT Accessories — Keyboards, Chargers, Docks & More',
    seoDescription: 'Computer and laptop accessories including keyboards, mice, chargers, docking stations, headsets, webcams and cables.',
  },
  {
    slug: 'components-parts',
    name: 'Computer Components & Laptop Parts',
    shortName: 'Parts & Components',
    description: 'RAM, SSDs, external drives, batteries, screens and replacement laptop parts.',
    subcategories: ['RAM', 'SSDs & storage', 'External drives', 'Laptop batteries', 'Replacement parts'],
    art: 'component',
    seoTitle: 'Computer Components & Laptop Parts',
    seoDescription: 'RAM, SSDs, external drives, laptop batteries and replacement parts. Share your model number for a compatible match.',
  },
  {
    slug: 'networking',
    name: 'Networking Products',
    shortName: 'Networking',
    description: 'Routers, switches, Wi-Fi access points and structured cabling.',
    subcategories: ['Routers', 'Switches', 'Wi-Fi access points', 'Cabling & accessories'],
    art: 'router',
    seoTitle: 'Networking Products — Routers, Switches, Wi-Fi',
    seoDescription: 'Routers, switches, Wi-Fi access points and cabling for homes and businesses. Request a networking quotation.',
  },
  {
    slug: 'servers-storage',
    name: 'Servers & Storage',
    shortName: 'Servers',
    description: 'Tower and rack servers, NAS devices and backup storage.',
    subcategories: ['Tower servers', 'Rack servers', 'NAS & storage'],
    art: 'server',
    seoTitle: 'Servers & Storage',
    seoDescription: 'Tower and rack servers, NAS and storage solutions for small and medium businesses. Request a quotation.',
  },
  {
    slug: 'headsets-audio-solutions',
    name: 'Professional Headsets & Meeting Room Solutions',
    shortName: 'Headsets & Audio',
    description:
      'Professional audio and communication solutions for call centres, corporate offices, hybrid teams and modern meeting rooms.',
    subcategories: ['USB Headsets', 'Wireless Bluetooth Headsets', 'Call Centre Headsets', 'Meeting Room Audio', 'Headset Accessories'],
    art: 'keyboard',
    seoTitle: 'Professional Headsets, Call Centre Audio & Meeting Room Solutions',
    seoDescription:
      'Poly, Jabra, Logitech, Yealink, EPOS and Cisco headsets and speakerphones for call centres, offices and meeting rooms — USB-A, USB-C and Bluetooth options with bulk procurement quotes.',
  },
]

export const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c])) as Record<CategorySlug, Category>

export function isCategorySlug(value: string | undefined): value is CategorySlug {
  return !!value && value in categoryBySlug
}
