export type ServiceIcon =
  | 'laptop'
  | 'wrench'
  | 'network'
  | 'calendar'
  | 'shield'
  | 'lock'
  | 'cloud'
  | 'settings'
  | 'presentation'
  | 'tv'
  | 'cctv'

import type { MediaKey } from './media'

export interface Service {
  slug: string
  name: string
  navLabel: string
  short: string
  icon: ServiceIcon
  /** Hero image from the media registry. */
  image: MediaKey
  /** Related equipment shown on the service page. */
  equipment: { k: MediaKey; label: string }[]
  intro: string
  offerings: { title: string; description: string }[]
  suitableFor: string[]
  scopeNote: string
  seoTitle: string
  seoDescription: string
}

const scope =
  'Service scope, coverage area, response times and pricing are confirmed individually for each enquiry. Availability depends on your location.'

export const services: Service[] = [
  {
    slug: 'it-amc',
    name: 'IT AMC & Managed Support',
    navLabel: 'IT AMC & Managed Support',
    short: 'Annual maintenance contracts scoped to your devices and locations.',
    icon: 'calendar',
    image: 'server',
    equipment: [{ k: 'laptopSilver', label: 'Laptops & desktops' }, { k: 'printer', label: 'Printers' }, { k: 'switch', label: 'Network equipment' }, { k: 'server', label: 'Servers' }],
    intro:
      'An Annual Maintenance Contract (AMC) gives your business a planned approach to keeping computers, printers and networks running — with preventive maintenance, support requests handled through one point of contact, and clear reporting.',
    offerings: [
      { title: 'Preventive maintenance', description: 'Scheduled health checks, cleaning, updates and performance tuning for covered devices.' },
      { title: 'Break-fix support', description: 'Remote and on-site troubleshooting for hardware and software issues within the agreed scope.' },
      { title: 'Asset inventory', description: 'A maintained register of covered devices, configurations and warranty dates.' },
      { title: 'Patch & update management', description: 'Operating system and application updates applied on an agreed schedule.' },
      { title: 'Comprehensive or non-comprehensive plans', description: 'Choose whether replacement parts are included or quoted separately.' },
      { title: 'Periodic reporting', description: 'Summaries of tickets handled, maintenance done and recommendations.' },
    ],
    suitableFor: ['Offices with 5+ computers', 'Clinics and diagnostic centres', 'Schools and training centres', 'Retail chains and branches'],
    scopeNote: scope,
    seoTitle: 'IT AMC & Managed Support Services',
    seoDescription:
      'Annual maintenance contracts for computers, printers and networks: preventive maintenance, break-fix support and reporting. Scope confirmed per enquiry.',
  },
  {
    slug: 'cybersecurity-dlp',
    name: 'Endpoint Security, Cybersecurity & DLP',
    navLabel: 'Cybersecurity & DLP',
    short: 'Protect devices and sensitive data with the right security stack.',
    icon: 'shield',
    image: 'firewall',
    equipment: [{ k: 'firewall', label: 'Firewall appliances' }, { k: 'laptopBlack', label: 'Endpoint protection' }, { k: 'externalDrive', label: 'Backup storage' }, { k: 'server', label: 'Secure servers' }],
    intro:
      'We help businesses select, deploy and manage endpoint protection and data loss prevention (DLP) tools that fit their size, compliance needs and budget.',
    offerings: [
      { title: 'Endpoint protection', description: 'Business antivirus and endpoint detection & response (EDR) licensing and deployment.' },
      { title: 'Data Loss Prevention (DLP)', description: 'Policies to control USB usage, uploads, email attachments and sensitive data movement.' },
      { title: 'Firewall & network security', description: 'Firewall selection and configuration for offices and branches.' },
      { title: 'Patch management', description: 'Keeping operating systems and applications up to date to reduce exposure.' },
      { title: 'Backup & recovery planning', description: 'Backup tools and routines to recover from device failure or ransomware.' },
      { title: 'Security hygiene review', description: 'A practical review of accounts, passwords, devices and access to find quick wins.' },
    ],
    suitableFor: ['Healthcare providers handling patient data', 'Finance and accounting teams', 'Businesses with remote staff', 'Organisations preparing for audits'],
    scopeNote: scope,
    seoTitle: 'Cybersecurity, Endpoint Security & DLP Solutions',
    seoDescription:
      'Endpoint protection, EDR, data loss prevention, firewalls and backup for businesses in India. Solutions scoped and quoted per requirement.',
  },
  {
    slug: 'software-licensing',
    name: 'Cloud & Software Licensing',
    navLabel: 'Software & Licensing',
    short: 'Operating systems, productivity suites, security and cloud subscriptions.',
    icon: 'cloud',
    image: 'laptopGrey',
    equipment: [{ k: 'laptopGrey', label: 'Productivity suites' }, { k: 'allInOne', label: 'Operating systems' }, { k: 'laptopBlack', label: 'Security software' }, { k: 'tablet', label: 'Cloud apps' }],
    intro:
      'Get the right licences for your team — from operating systems and office suites to cloud email, collaboration and security subscriptions — with help choosing plans and setting them up.',
    offerings: [
      { title: 'Productivity suites', description: 'Microsoft 365, Google Workspace and similar subscriptions, sized to your team.' },
      { title: 'Operating system licences', description: 'Windows and other OS licensing for new or upgraded devices.' },
      { title: 'Security software', description: 'Antivirus, EDR and backup subscriptions for business devices.' },
      { title: 'Design & specialist software', description: 'Sourcing of specialist software on request.' },
      { title: 'Email & domain setup', description: 'Business email migration and configuration assistance.' },
      { title: 'Renewal tracking', description: 'Help keeping track of renewal dates and user counts.' },
    ],
    suitableFor: ['Startups setting up their first stack', 'SMBs consolidating licences', 'Schools and training centres', 'Teams moving to cloud email'],
    scopeNote:
      'Software is supplied through appropriate licensing channels; available products, editions and pricing are confirmed per enquiry.',
    seoTitle: 'Cloud & Software Licensing',
    seoDescription:
      'Microsoft 365, Google Workspace, Windows, security and specialist software licences for businesses, with setup assistance. Enquire for a quote.',
  },
  {
    slug: 'cctv-surveillance',
    name: 'CCTV & Video Surveillance',
    navLabel: 'CCTV & Surveillance',
    short: 'IP cameras, recorders and monitoring for offices, warehouses and campuses.',
    icon: 'cctv',
    image: 'cctv',
    equipment: [{ k: 'cctv', label: 'Dome & bullet cameras' }, { k: 'switch', label: 'PoE network switches' }, { k: 'externalDrive', label: 'Recording & storage' }, { k: 'monitor', label: 'Monitoring displays' }],
    intro:
      'Plan, supply and install CCTV systems sized to your premises — from a few cameras at a shop entrance to multi-site coverage with central monitoring.',
    offerings: [
      { title: 'Site survey & camera plan', description: 'Coverage, camera types and mounting positions agreed before installation.' },
      { title: 'IP & analogue cameras', description: 'Dome, bullet and PTZ cameras for indoor and outdoor use.' },
      { title: 'Recorders & storage', description: 'NVR/DVR and storage sized to your retention needs.' },
      { title: 'PoE networking & cabling', description: 'Switches, cabling and power for camera networks.' },
      { title: 'Remote viewing setup', description: 'Monitoring displays and secure mobile/desktop viewing where supported.' },
      { title: 'Maintenance & AMC', description: 'Health checks, cleaning and support under an agreed scope.' },
    ],
    suitableFor: ['Offices and branches', 'Warehouses and factories', 'Retail stores', 'Schools and campuses'],
    scopeNote: scope,
    seoTitle: 'CCTV & Video Surveillance Installation',
    seoDescription:
      'CCTV camera supply and installation for offices, warehouses, retail and campuses: site survey, IP cameras, recorders, PoE networking and maintenance. Quote on enquiry.',
  },
  {
    slug: 'audio-visual-digital-signage',
    name: 'Audio-Visual Integration & Digital Signage',
    navLabel: 'Audio-Visual & Signage',
    short: 'Meeting rooms, conferencing, smart displays and signage screens.',
    icon: 'tv',
    image: 'conference',
    equipment: [{ k: 'conference', label: 'Video conferencing' }, { k: 'videoWall', label: 'LED & video walls' }, { k: 'projector', label: 'Projection' }, { k: 'speakers', label: 'Professional audio' }],
    intro:
      'From a single huddle-room display to a multi-screen signage network, we help plan, source and install audio-visual equipment that is simple for your people to use.',
    offerings: [
      { title: 'Meeting & conference rooms', description: 'Displays, cameras, speakers and microphones for video conferencing.' },
      { title: 'Interactive smart displays', description: 'Touch displays for classrooms, training and collaboration.' },
      { title: 'Digital signage', description: 'Screens and media players for lobbies, retail, menus and notices.' },
      { title: 'Projectors & screens', description: 'Projection solutions for training rooms and auditoriums.' },
      { title: 'Installation & cabling', description: 'Mounting, cabling and configuration of AV equipment.' },
      { title: 'User orientation', description: 'A short handover so staff can use the setup confidently.' },
    ],
    suitableFor: ['Corporate meeting rooms', 'Classrooms and training centres', 'Hotels and hospitality', 'Retail and showrooms'],
    scopeNote: scope,
    seoTitle: 'Audio-Visual Integration & Digital Signage',
    seoDescription:
      'Meeting room AV, video conferencing, interactive displays and digital signage for offices, schools, hotels and retail. Site survey and quote on enquiry.',
  },
  {
    slug: 'desktop-laptop-support',
    name: 'Desktop & Laptop Support',
    navLabel: 'Desktop & Laptop Support',
    short: 'Remote and on-site help for everyday computer issues.',
    icon: 'laptop',
    image: 'laptopSilver',
    equipment: [{ k: 'laptopSilver', label: 'Laptops' }, { k: 'desktopTower', label: 'Desktops' }, { k: 'printer', label: 'Printers' }, { k: 'dock', label: 'Docks & peripherals' }],
    intro:
      'Help for slow computers, software errors, printer connection problems, email issues and more — delivered remotely where possible and on-site where needed.',
    offerings: [
      { title: 'Remote support', description: 'Secure remote sessions to fix software and configuration issues.' },
      { title: 'On-site visits', description: 'Technician visits for hardware issues, subject to location.' },
      { title: 'Performance tuning', description: 'Clean-up, updates and upgrades to improve speed.' },
      { title: 'Peripheral setup', description: 'Printers, scanners, docks and monitors connected and configured.' },
    ],
    suitableFor: ['Home offices', 'Small businesses without in-house IT', 'Professionals and consultants'],
    scopeNote: scope,
    seoTitle: 'Desktop & Laptop Support',
    seoDescription: 'Remote and on-site desktop and laptop support for homes and businesses. Coverage and pricing confirmed per enquiry.',
  },
  {
    slug: 'computer-repair',
    name: 'Computer Repair & Troubleshooting',
    navLabel: 'Repair & Troubleshooting',
    short: 'Diagnosis, part replacement and upgrades for laptops and desktops.',
    icon: 'wrench',
    image: 'batteryParts',
    equipment: [{ k: 'batteryParts', label: 'Batteries & boards' }, { k: 'ssdRam', label: 'RAM & SSD upgrades' }, { k: 'charger', label: 'Chargers' }, { k: 'laptopPorts', label: 'Keyboards & ports' }],
    intro:
      'We diagnose hardware faults and recommend the most sensible fix — repair, upgrade or replacement — with a clear estimate before any work begins.',
    offerings: [
      { title: 'Diagnosis', description: 'Identification of hardware or software faults with a written estimate.' },
      { title: 'Part replacement', description: 'Screens, keyboards, batteries, chargers, fans and storage.' },
      { title: 'Upgrades', description: 'RAM and SSD upgrades to extend the life of existing machines.' },
      { title: 'Data backup before repair', description: 'Backup of accessible data where feasible, before work begins.' },
    ],
    suitableFor: ['Individuals', 'Offices with ageing fleets', 'Schools and institutions'],
    scopeNote: 'Repair feasibility, parts availability, turnaround and cost are confirmed after diagnosis.',
    seoTitle: 'Computer & Laptop Repair and Troubleshooting',
    seoDescription: 'Laptop and desktop diagnosis, part replacement and RAM/SSD upgrades with estimates before work begins.',
  },
  {
    slug: 'network-setup',
    name: 'Network Setup & Support',
    navLabel: 'Network Setup',
    short: 'Office LAN, Wi-Fi, firewall and structured cabling.',
    icon: 'network',
    image: 'switch',
    equipment: [{ k: 'router', label: 'Routers' }, { k: 'switch', label: 'Switches' }, { k: 'accessPoint', label: 'Wi-Fi access points' }, { k: 'cables', label: 'Structured cabling' }],
    intro: 'Reliable connectivity for your office — from choosing the right router and switches to Wi-Fi coverage planning and structured cabling.',
    offerings: [
      { title: 'Wi-Fi planning & setup', description: 'Access point selection and placement for reliable coverage.' },
      { title: 'LAN & structured cabling', description: 'Cabling, racks, patch panels and switch configuration.' },
      { title: 'Firewall & VPN', description: 'Secure internet access and remote connectivity for staff.' },
      { title: 'Network troubleshooting', description: 'Diagnosis of slow or unstable connections.' },
    ],
    suitableFor: ['New office set-ups', 'Office relocations', 'Clinics and retail stores', 'Multi-branch businesses'],
    scopeNote: scope,
    seoTitle: 'Network Setup & Support — LAN, Wi-Fi, Firewall',
    seoDescription: 'Office network design, Wi-Fi, structured cabling, firewall and VPN setup and support. Site survey and quotation on enquiry.',
  },
  {
    slug: 'installation-configuration',
    name: 'Installation & Configuration',
    navLabel: 'Installation & Configuration',
    short: 'Imaging, software setup and deployment for new devices.',
    icon: 'settings',
    image: 'desktopTower',
    equipment: [{ k: 'laptopSilver', label: 'Laptop imaging' }, { k: 'desktopTower', label: 'Desktop deployment' }, { k: 'monitor', label: 'Displays & docks' }, { k: 'printer', label: 'Printer setup' }],
    intro: 'New hardware ready to use on day one: operating system setup, software installation, user accounts, data migration and on-site deployment.',
    offerings: [
      { title: 'Device imaging', description: 'Standardised OS and software setup across multiple devices.' },
      { title: 'Data migration', description: 'Moving files and settings from old devices to new ones.' },
      { title: 'On-site deployment', description: 'Unboxing, placement, connection and testing at your premises.' },
      { title: 'Asset tagging', description: 'Labelling and recording devices for your inventory.' },
    ],
    suitableFor: ['Bulk laptop and desktop rollouts', 'New office openings', 'Staff onboarding'],
    scopeNote: scope,
    seoTitle: 'IT Installation & Configuration Services',
    seoDescription: 'Device imaging, software installation, data migration and on-site deployment for new computers and IT equipment.',
  },
]

export const serviceBySlug = new Map(services.map((s) => [s.slug, s]))

/** Cards shown on the home page (maps onto the service detail pages). */
export const homeServiceCards: { title: string; description: string; icon: ServiceIcon; slug: string }[] = [
  { title: 'Desktop & Laptop Support', description: 'Remote and on-site troubleshooting.', icon: 'laptop', slug: 'desktop-laptop-support' },
  { title: 'Computer Repair & Troubleshooting', description: 'Diagnosis, part replacement, upgrades.', icon: 'wrench', slug: 'computer-repair' },
  { title: 'Network Setup & Support', description: 'LAN, Wi-Fi, firewall configuration.', icon: 'network', slug: 'network-setup' },
  { title: 'IT AMC & Managed Support', description: 'Annual contracts scoped to your fleet.', icon: 'calendar', slug: 'it-amc' },
  { title: 'Endpoint Security & Cybersecurity', description: 'Antivirus, EDR, patching, firewalls.', icon: 'shield', slug: 'cybersecurity-dlp' },
  { title: 'Data Loss Prevention (DLP)', description: 'Policies that protect sensitive data.', icon: 'lock', slug: 'cybersecurity-dlp' },
  { title: 'Cloud & Software Licensing', description: 'Microsoft 365, Google Workspace and more.', icon: 'cloud', slug: 'software-licensing' },
  { title: 'Installation & Configuration', description: 'Imaging, setup and deployment.', icon: 'settings', slug: 'installation-configuration' },
  { title: 'Audio-Visual Integration', description: 'Meeting rooms and conferencing.', icon: 'presentation', slug: 'audio-visual-digital-signage' },
  { title: 'Digital Signage & Smart Displays', description: 'Screens for lobbies, retail, classrooms.', icon: 'tv', slug: 'audio-visual-digital-signage' },
]
