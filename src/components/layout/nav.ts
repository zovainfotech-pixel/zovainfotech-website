import { paths } from '../../data/routes'

export type MenuKind = 'products' | 'solutions'

export interface NavItem {
  label: string
  /** Condensed label for mid-size desktops (1280–1535px). */
  short?: string
  to: string
  /** Opens a mega-menu on desktop. */
  mega?: MenuKind
  /** Custom active-state test (defaults to exact/prefix path match). */
  active?: (pathname: string, search: string) => boolean
}

const cyber = paths.service('cybersecurity-dlp')
const solutionPaths: string[] = [paths.av, paths.microsoft, paths.corporate, paths.service('network-setup'), paths.service('cctv-surveillance')]

export const mainNav: NavItem[] = [
  { label: 'Home', to: paths.home, active: (p) => p === '/' },
  { label: 'Products', to: paths.products, mega: 'products', active: (p) => (p.startsWith('/products') || p.startsWith('/product/')) && !p.includes('headsets') },
  { label: 'Solutions', to: `${paths.home}#solutions`, mega: 'solutions', active: (p) => solutionPaths.includes(p) || p.includes('headsets') },
  { label: 'Services', to: paths.services, active: (p) => p.startsWith(paths.services) && p !== cyber && !solutionPaths.includes(p) },
  { label: 'Cybersecurity', to: cyber },
  { label: 'About Us', to: paths.about },
  { label: 'Contact', to: paths.contact },
]

const cat = paths.category
const q = (base: string, params: Record<string, string>) => `${base}?${new URLSearchParams(params).toString()}`

export interface MenuGroup {
  title: string
  to: string
  links: { label: string; to: string }[]
}

/** Products mega-menu, grouped the way procurement teams think about hardware. */
export const productGroups: MenuGroup[] = [
  {
    title: 'Computers',
    to: cat('new-laptops'),
    links: [
      { label: 'Laptops', to: cat('new-laptops') },
      { label: 'Desktops', to: cat('desktops-workstations') },
      { label: 'Workstations', to: q(cat('desktops-workstations'), { subcategory: 'Workstations' }) },
      { label: 'Mac', to: q(cat('apple-products'), { subcategory: 'MacBook' }) },
    ],
  },
  {
    title: 'Accessories',
    to: cat('it-accessories'),
    links: [
      { label: 'Monitors', to: cat('monitors-displays') },
      { label: 'Docking', to: q(cat('it-accessories'), { subcategory: 'USB hubs & docking stations' }) },
      { label: 'Keyboard & Mouse', to: q(cat('it-accessories'), { subcategory: 'Keyboards & mice' }) },
      { label: 'Stands & Cables', to: q(cat('it-accessories'), { subcategory: 'Laptop stands' }) },
    ],
  },
  {
    title: 'Networking',
    to: cat('networking'),
    links: [
      { label: 'Switches', to: q(cat('networking'), { subcategory: 'Switches' }) },
      { label: 'Routers', to: q(cat('networking'), { subcategory: 'Routers' }) },
      { label: 'Wi-Fi', to: q(cat('networking'), { subcategory: 'Wi-Fi access points' }) },
      { label: 'Servers & Storage', to: cat('servers-storage') },
    ],
  },
  {
    title: 'Security',
    to: cyber,
    links: [
      { label: 'Antivirus', to: cyber },
      { label: 'DLP', to: cyber },
      { label: 'XDR', to: cyber },
      { label: 'Endpoint Security', to: cyber },
    ],
  },
  {
    title: 'Communication',
    to: cat('headsets-audio-solutions'),
    links: [
      { label: 'Headsets', to: cat('headsets-audio-solutions') },
      { label: 'Call Centre', to: q(cat('headsets-audio-solutions'), { subcategory: 'Call Centre Headsets' }) },
      { label: 'Conference Audio', to: q(cat('headsets-audio-solutions'), { subcategory: 'Meeting Room Audio' }) },
    ],
  },
  {
    title: 'Workplace',
    to: paths.av,
    links: [
      { label: 'Printers', to: cat('printers-scanners') },
      { label: 'Digital Signage', to: `${paths.av}?cat=signage` },
      { label: 'Smart Boards', to: paths.av },
    ],
  },
  {
    title: 'Refurbished',
    to: cat('refurbished-laptops'),
    links: [
      { label: 'Laptops', to: cat('refurbished-laptops') },
      { label: 'Desktops, Mac & Monitors', to: q(paths.products, { condition: 'refurbished' }) },
      { label: 'Request a model', to: `${cat('refurbished-laptops')}#request-model` },
    ],
  },
]

export interface SolutionLink {
  label: string
  text: string
  to: string
  icon: 'network' | 'shield' | 'cloud' | 'video' | 'signage' | 'cctv' | 'headset' | 'procure'
}

export const solutionLinks: SolutionLink[] = [
  { label: 'IT Infrastructure & Networking', text: 'LAN, Wi-Fi, firewalls, servers', to: paths.service('network-setup'), icon: 'network' },
  { label: 'Cybersecurity & DLP', text: 'Endpoint security, DLP, XDR', to: cyber, icon: 'shield' },
  { label: 'Microsoft 365 & Cloud', text: 'Licensing, Intune, Purview', to: paths.microsoft, icon: 'cloud' },
  { label: 'Audio-Video & Meeting Rooms', text: 'Conferencing, cameras, audio', to: paths.av, icon: 'video' },
  { label: 'Digital Signage & Smart Displays', text: 'Screens, kiosks, video walls', to: `${paths.av}?cat=signage`, icon: 'signage' },
  { label: 'CCTV & Surveillance', text: 'Cameras, NVRs, installation', to: paths.service('cctv-surveillance'), icon: 'cctv' },
  { label: 'Headsets & Call Centre', text: 'USB, wireless, speakerphones', to: cat('headsets-audio-solutions'), icon: 'headset' },
  { label: 'IT Procurement', text: 'Bulk and multi-site sourcing', to: paths.corporate, icon: 'procure' },
]

export function navActive(item: NavItem, pathname: string, search: string) {
  return item.active ? item.active(pathname, search) : pathname === item.to || pathname.startsWith(`${item.to}/`)
}
