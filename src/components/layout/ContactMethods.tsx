import { Mail, MessageCircle, Phone } from 'lucide-react'
import { PLACEHOLDER, site } from '../../config/site'
import { mailLink, telLink, whatsappLink } from '../../lib/contact'
import { cn } from '../../lib/cn'

/** Click-to-call / email / WhatsApp. Unconfigured channels show a neutral placeholder or are hidden. */
export function ContactMethods({ compact }: { compact?: boolean }) {
  const tel = telLink()
  const mail = mailLink('Enquiry from website')
  const wa = whatsappLink(site.contact.whatsappGreeting)

  const items = [
    { icon: Phone, label: 'Call us', value: site.contact.phoneDisplay ?? PLACEHOLDER.phone, href: tel },
    { icon: Mail, label: 'Email', value: site.contact.email ?? PLACEHOLDER.email, href: mail },
    ...(wa ? [{ icon: MessageCircle, label: 'WhatsApp', value: 'Chat with our team', href: wa }] : []),
  ]

  return (
    <ul className={cn('grid gap-3', !compact && 'sm:grid-cols-2 lg:grid-cols-1')}>
      {items.map(({ icon: Icon, label, value, href }) => {
        const inner = (
          <>
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Icon size={19} aria-hidden />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="text-[12.5px] text-muted">{label}</span>
              <span className={cn('truncate font-bold', !href && 'font-medium text-slate-500')}>{value}</span>
            </span>
          </>
        )
        return (
          <li key={label}>
            {href ? (
              <a
                href={href}
                {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3.5 transition-colors hover:border-brand-600"
              >
                {inner}
              </a>
            ) : (
              <div className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white p-3.5">{inner}</div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
