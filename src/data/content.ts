/** Shared marketing copy: FAQs, brands, industries, process steps. */

export const faqs: { q: string; a: string }[] = [
  {
    q: 'Do you sell new and refurbished laptops?',
    a: 'Yes. We supply new laptops as well as refurbished and used laptops. Every listing states its condition clearly, and refurbished or used units include condition details specific to that unit.',
  },
  {
    q: 'How can I request a quotation?',
    a: 'Use the Request a Quote form, click "Get a Quote" on any product, or contact our team. Share the product, quantity, budget and delivery city, and we will respond with options and an itemised quotation.',
  },
  {
    q: 'Can I purchase laptops in bulk?',
    a: 'Yes. Bulk and multi-product requirements can be submitted through our Corporate IT Procurement form. Pricing, availability and delivery schedules for bulk orders are confirmed in the quotation.',
  },
  {
    q: 'Can I request a specific brand or model?',
    a: 'Yes. Tell us the exact brand, model or configuration you need. We source through multiple vendors and will confirm availability, lead time and price before you commit.',
  },
  {
    q: 'How is refurbished laptop condition described?',
    a: 'Refurbished and used units carry a condition grade — Excellent, Very Good, Good or Fair — assigned only after that specific unit has been inspected. Listings also state battery information, cosmetic notes, any known defects and included accessories where these have been checked.',
  },
  {
    q: 'What warranty is available?',
    a: 'Warranty depends on the product, its condition and the source. New products typically carry the manufacturer’s warranty; refurbished and used items may carry a seller warranty. The exact duration and coverage are confirmed in writing with each quotation.',
  },
  {
    q: 'Do you provide delivery outside major cities?',
    a: 'We aim to serve customers across India. Delivery to your PIN code, the courier or logistics partner, charges and timelines are confirmed for each order.',
  },
  {
    q: 'Can you provide installation and IT support?',
    a: 'Installation, configuration, remote support and on-site support can be arranged on enquiry. Coverage depends on your location and is confirmed before any commitment.',
  },
  {
    q: 'Can I request a custom IT procurement solution?',
    a: 'Yes. Share your full requirement — hardware, software, networking and services — and we will put together a consolidated proposal for your review.',
  },
]

/** Text wordmarks only. Listing a brand does not imply authorised-reseller status. */
export const brands = ['Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'Apple', 'Logitech', 'TP-Link', 'Samsung', 'LG', 'Epson', 'Synology']

export const industries = [
  { title: 'Corporate Offices', icon: 'building', text: 'Standardised laptops, desktops and peripherals for teams.' },
  { title: 'Healthcare', icon: 'heart', text: 'Reliable front-desk, clinic and diagnostic-centre IT.' },
  { title: 'Education', icon: 'cap', text: 'Labs, classrooms, smart displays and staff devices.' },
  { title: 'Retail', icon: 'bag', text: 'Billing counters, printers, networks and signage.' },
  { title: 'Hospitality', icon: 'hotel', text: 'Front-office systems, Wi-Fi and in-room displays.' },
  { title: 'Small & Medium Businesses', icon: 'briefcase', text: 'Right-sized hardware, software and support.' },
  { title: 'Training Centres', icon: 'presentation', text: 'Lab machines, projectors and connectivity.' },
] as const

export const processSteps = [
  { title: 'Share your requirement', text: 'Tell us the products or services you need, quantities, budget and delivery city.' },
  { title: 'Receive a product or service quote', text: 'We check options across our vendor network and send an itemised quotation.' },
  { title: 'Confirm the order and delivery details', text: 'Approve the quotation and confirm billing, delivery address and schedule.' },
  { title: 'Delivery, installation or support', text: 'We arrange delivery, installation or support as applicable to your order.' },
]

export const whyChoose = [
  { title: 'Complete IT solutions', text: 'Hardware, software, AV, signage, security and support planned together — one partner, one point of contact.', icon: 'boxes' },
  { title: 'Technology procurement', text: 'Requirements consolidated into one itemised quotation, sourced across multiple vendors.', icon: 'list' },
  { title: 'Enterprise support', text: 'Installation, AMC, remote and on-site support scoped to your devices and sites.', icon: 'wrench' },
  { title: 'Hardware & software', text: 'New and refurbished hardware alongside licences and software, with conditions stated plainly.', icon: 'layers' },
  { title: 'Security & DLP', text: 'Endpoint security and data-loss-prevention policies, including Microsoft Purview where licensed.', icon: 'shield' },
  { title: 'AV & digital signage', text: 'Boardrooms, conferencing, displays and signage — designed, installed and maintained.', icon: 'presentation' },
  { title: 'Vendor coordination', text: 'We coordinate brands, distributors and service partners so you do not have to.', icon: 'building' },
  { title: 'Pan-India service capability', text: 'Delivery and support across India, confirmed for your locations and subject to service availability.', icon: 'map' },
] as const

export const requirementTypes = [
  'New Laptop',
  'Refurbished Laptop',
  'IT Accessories',
  'Headsets & Meeting Room Audio',
  'IT Hardware',
  'Software',
  'IT Services',
  'Bulk Procurement',
  'Other',
] as const

export const budgetRanges = [
  'Not sure yet',
  'Under ₹25,000',
  '₹25,000 – ₹50,000',
  '₹50,000 – ₹1,00,000',
  '₹1,00,000 – ₹5,00,000',
  'Above ₹5,00,000',
] as const
