import type { DeviceArtKind } from '../../data/types'

/**
 * Original, lightweight product illustrations used as placeholders when a
 * product has no photograph yet. Replace with real photos via product.images.
 */
export function DeviceArt({ kind, tone = 'light', className }: { kind: DeviceArtKind; tone?: 'light' | 'dark'; className?: string }) {
  const d = tone === 'dark'
  const body = d ? '#334155' : '#1E293B'
  const screen = d ? '#0F172A' : '#0c5dae'
  const shine = d ? '#1E293B' : '#1D4ED8'
  const base = d ? '#64748B' : '#CBD5E1'
  const baseDark = d ? '#475569' : '#94A3B8'
  const soft = d ? '#475569' : '#E2E8F0'

  const common = { viewBox: '0 0 200 130', className, 'aria-hidden': true as const, role: 'presentation' }

  switch (kind) {
    case 'laptop':
      return (
        <svg {...common}>
          <rect x="30" y="8" width="140" height="92" rx="7" fill={body} />
          <rect x="36" y="14" width="128" height="80" rx="3" fill={screen} />
          <path d="M36 94 164 14v80z" fill={shine} />
          <path d="M14 100h172l-8 12a6 6 0 0 1-5 3H27a6 6 0 0 1-5-3z" fill={base} />
          <rect x="86" y="100" width="28" height="4" rx="2" fill={baseDark} />
        </svg>
      )
    case 'tablet':
      return (
        <svg {...common}>
          <rect x="38" y="14" width="96" height="106" rx="10" fill={body} />
          <rect x="44" y="20" width="84" height="94" rx="4" fill={screen} />
          <path d="M44 114 128 20v94z" fill={shine} />
          <rect x="120" y="44" width="54" height="76" rx="8" fill={body} />
          <rect x="124" y="48" width="46" height="68" rx="4" fill={d ? '#1E293B' : '#60A5FA'} />
        </svg>
      )
    case 'desktop':
      return (
        <svg {...common}>
          <rect x="22" y="10" width="112" height="76" rx="6" fill={body} />
          <rect x="27" y="15" width="102" height="66" rx="3" fill={screen} />
          <path d="M27 81 129 15v66z" fill={shine} />
          <path d="M68 86h20l4 22H64z" fill={baseDark} />
          <rect x="52" y="106" width="52" height="6" rx="3" fill={base} />
          <rect x="146" y="22" width="36" height="92" rx="6" fill={body} />
          <rect x="154" y="32" width="20" height="3" rx="1.5" fill={baseDark} />
          <rect x="154" y="40" width="20" height="3" rx="1.5" fill={baseDark} />
          <circle cx="164" cy="100" r="4" fill={d ? '#22D3EE' : '#60A5FA'} />
        </svg>
      )
    case 'monitor':
      return (
        <svg {...common}>
          <rect x="24" y="8" width="152" height="92" rx="7" fill={body} />
          <rect x="30" y="14" width="140" height="80" rx="3" fill={screen} />
          <path d="M30 94 170 14v80z" fill={shine} />
          <path d="M90 100h20l6 18H84z" fill={baseDark} />
          <rect x="66" y="116" width="68" height="6" rx="3" fill={base} />
        </svg>
      )
    case 'printer':
      return (
        <svg {...common}>
          <rect x="54" y="10" width="92" height="30" rx="3" fill={soft} />
          <rect x="30" y="36" width="140" height="58" rx="10" fill={body} />
          <rect x="44" y="48" width="36" height="6" rx="3" fill={d ? '#22D3EE' : '#60A5FA'} />
          <circle cx="152" cy="52" r="4" fill={d ? '#22D3EE' : '#60A5FA'} />
          <rect x="50" y="82" width="100" height="36" rx="3" fill="#fff" stroke={soft} />
          <rect x="62" y="94" width="60" height="4" rx="2" fill={soft} />
          <rect x="62" y="104" width="44" height="4" rx="2" fill={soft} />
        </svg>
      )
    case 'keyboard':
      return (
        <svg {...common}>
          <rect x="14" y="44" width="136" height="54" rx="8" fill={body} />
          {Array.from({ length: 3 }).map((_, r) =>
            Array.from({ length: 10 }).map((__, c) => (
              <rect key={`${r}-${c}`} x={22 + c * 12.4} y={52 + r * 12} width="9.5" height="8.5" rx="2" fill={d ? '#475569' : '#334155'} />
            )),
          )}
          <rect x="44" y="88" width="76" height="6" rx="2" fill={d ? '#475569' : '#334155'} />
          <rect x="158" y="46" width="30" height="48" rx="15" fill={body} />
          <path d="M173 50v14" stroke={d ? '#22D3EE' : '#60A5FA'} strokeWidth="3" strokeLinecap="round" />
        </svg>
      )
    case 'component':
      return (
        <svg {...common}>
          <rect x="20" y="40" width="160" height="40" rx="4" fill={d ? '#0E7490' : '#15803D'} />
          {Array.from({ length: 4 }).map((_, i) => (
            <rect key={i} x={32 + i * 36} y="48" width="26" height="22" rx="2" fill={body} />
          ))}
          {Array.from({ length: 22 }).map((_, i) => (
            <rect key={i} x={26 + i * 7} y="80" width="4" height="8" fill="#EAB308" />
          ))}
          <rect x="54" y="96" width="92" height="24" rx="4" fill={body} />
          <rect x="62" y="104" width="30" height="8" rx="2" fill={d ? '#22D3EE' : '#60A5FA'} />
        </svg>
      )
    case 'router':
      return (
        <svg {...common}>
          <path d="M60 58 50 14M100 58V8M140 58l10-44" stroke={body} strokeWidth="6" strokeLinecap="round" />
          <rect x="26" y="56" width="148" height="46" rx="12" fill={body} />
          {Array.from({ length: 6 }).map((_, i) => (
            <circle key={i} cx={52 + i * 16} cy="79" r="3.5" fill={i < 4 ? (d ? '#22D3EE' : '#60A5FA') : baseDark} />
          ))}
          <rect x="40" y="104" width="120" height="6" rx="3" fill={base} />
        </svg>
      )
    case 'server':
      return (
        <svg {...common}>
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x="36" y={14 + i * 36} width="128" height="30" rx="5" fill={body} />
              <circle cx="52" cy={29 + i * 36} r="3.5" fill={d ? '#22D3EE' : '#60A5FA'} />
              <rect x="66" y={26 + i * 36} width="52" height="6" rx="3" fill={baseDark} />
              <rect x="128" y={24 + i * 36} width="24" height="10" rx="2" fill={d ? '#1E293B' : '#334155'} />
            </g>
          ))}
        </svg>
      )
  }
}
