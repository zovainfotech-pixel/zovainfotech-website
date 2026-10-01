import { motion } from 'motion/react'
import { Check, CircleAlert, FlaskConical } from 'lucide-react'
import { isDemoMode, site } from '../../config/site'
import { mailLink, telLink } from '../../lib/contact'
import type { EnquiryResult } from '../../lib/enquiry'
import { Button } from '../ui/Button'

/** Shown after a successful submit. Never claims delivery in demo mode. */
export function FormSuccess({ result, onReset, noun = 'enquiry' }: { result: EnquiryResult; onReset: () => void; noun?: string }) {
  const demo = result.status === 'demo'
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-4 px-4 py-16 text-center"
      role="status"
      aria-live="polite"
      tabIndex={-1}
      ref={(el) => el?.focus()}
    >
      <span
        className={`flex size-16 items-center justify-center rounded-full ${demo ? 'bg-amber-100 text-amber-800' : 'bg-brand-100 text-brand-700'}`}
      >
        {demo ? <FlaskConical size={28} /> : <Check size={30} strokeWidth={2.4} />}
      </span>
      <h2 className="text-2xl font-bold">{demo ? `Demo mode — ${noun} not sent` : `Thank you — your ${noun} has been received`}</h2>
      <p className="max-w-md leading-relaxed text-muted">
        {demo ? (
          <>
            Your details passed validation, but <strong className="text-ink">nothing was sent</strong> because no enquiry service is connected yet.
            Once the enquiry endpoint is configured, submissions will be delivered to the Zova Infotech team.
          </>
        ) : (
          <>
            Our team will review your requirement and get back to you. Pricing, availability and timelines are confirmed individually.
            {result.status === 'sent' && result.reference && (
              <>
                {' '}
                Your reference: <strong className="font-mono text-ink">{result.reference}</strong>
              </>
            )}
            {result.status === 'sent' && result.emailSentTo && (
              <span className="mt-2 block text-sm font-medium text-brand-700">
                A confirmation copy has been dispatched to <strong className="font-semibold text-ink">{result.emailSentTo}</strong>.
              </span>
            )}
          </>
        )}
      </p>
      <Button variant="secondary" onClick={onReset}>
        Submit another {noun}
      </Button>
    </motion.div>
  )
}

export function FormError({ message }: { message: string }) {
  const tel = telLink()
  const mail = mailLink('Website enquiry')
  return (
    <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      <CircleAlert size={18} className="mt-0.5 shrink-0" aria-hidden />
      <span className="flex flex-col gap-1">
        <strong className="font-bold">Your enquiry was not sent.</strong>
        <span>{message}</span>
        {(tel || mail) && (
          <span className="flex flex-wrap gap-x-4 gap-y-1 pt-1 font-semibold">
            {tel && (
              <a href={tel} className="underline underline-offset-2 hover:text-red-950">
                Call {site.contact.phoneDisplay}
              </a>
            )}
            {mail && (
              <a href={mail} className="underline underline-offset-2 hover:text-red-950">
                Email {site.contact.email}
              </a>
            )}
          </span>
        )}
      </span>
    </div>
  )
}

export function DemoModeNotice() {
  if (!isDemoMode) return null
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] leading-relaxed text-amber-900">
      <FlaskConical size={17} className="mt-0.5 shrink-0" aria-hidden />
      <span>
        <strong>Demo mode.</strong> No email or CRM service is connected yet, so this form validates your details but does not send them
        anywhere.
      </span>
    </div>
  )
}
