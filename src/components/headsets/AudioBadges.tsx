import { Bluetooth, Building2, Headset, Home, Plug, Presentation, Usb } from 'lucide-react'
import type { AudioSpecs, Connectivity, Workplace } from '../../data/types'
import { cn } from '../../lib/cn'

const connIcon: Record<Connectivity, typeof Usb> = { 'USB-A': Usb, 'USB-C': Usb, Bluetooth: Bluetooth, '3.5 mm': Plug }
const useIcon: Record<Workplace, typeof Usb> = { 'Call Centre': Headset, Office: Building2, 'Remote Work': Home, 'Meeting Room': Presentation }

/** Connection badges (blue) and workplace badges (neutral) for headset cards. */
export function AudioBadges({ audio, className }: { audio: AudioSpecs; className?: string }) {
  const conn = [...audio.connectivity]
  const wireless = audio.link.startsWith('Wireless')
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <ul className="flex flex-wrap gap-1.5" aria-label="Connection">
        {conn.map((c) => {
          const I = connIcon[c]
          return (
            <li key={c} className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-2 py-1 text-[11.5px] font-bold text-brand-700">
              <I size={12} aria-hidden /> {c}
            </li>
          )
        })}
        {wireless && <li className="inline-flex items-center rounded-md bg-cyan-50 px-2 py-1 text-[11.5px] font-bold text-cyan-800">Wireless</li>}
      </ul>
      <ul className="flex flex-wrap gap-1.5" aria-label="Suited to">
        {audio.workplace.map((w) => {
          const I = useIcon[w]
          return (
            <li key={w} className="inline-flex items-center gap-1 rounded-md border border-line px-2 py-1 text-[11.5px] font-semibold text-muted">
              <I size={12} aria-hidden /> {w}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
