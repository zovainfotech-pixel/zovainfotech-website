import { cn } from '../../lib/cn'

/** Soft animated gradient orbs (CSS only, GPU-friendly). */
export function Orbs({ className }: { className?: string }) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 -z-10 overflow-hidden', className)} aria-hidden>
      <div className="absolute -top-32 -left-24 size-[520px] animate-orb rounded-full bg-brand-600/35 blur-[110px]" />
      <div className="absolute top-10 -right-24 size-[480px] animate-orb rounded-full bg-purple-accent/30 blur-[110px] [animation-delay:-6s]" />
      <div className="absolute -bottom-40 left-1/3 size-[420px] animate-orb rounded-full bg-cyan-accent/20 blur-[110px] [animation-delay:-11s]" />
    </div>
  )
}

/** A handful of slowly rising light particles. Deterministic positions; hidden for reduced motion. */
export function Particles({ count = 16, className }: { count?: number; className?: string }) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 -z-10 overflow-hidden motion-reduce:hidden', className)} aria-hidden>
      {Array.from({ length: count }).map((_, i) => {
        const left = (i * 61) % 100
        const top = 30 + ((i * 37) % 65)
        const size = 2 + (i % 3)
        return (
          <span
            key={i}
            className="absolute animate-drift rounded-full bg-cyan-accent/70 shadow-[0_0_8px_1px_rgb(2_198_220/0.4)]"
            style={{ left: `${left}%`, top: `${top}%`, width: size, height: size, animationDelay: `${-(i * 1.3)}s`, animationDuration: `${22 + (i % 5) * 3}s` }}
          />
        )
      })}
    </div>
  )
}

/** Circuit-board traces with travelling light pulses. Decorative only. */
export function CircuitLines({ className, tone = 'dark' }: { className?: string; tone?: 'dark' | 'light' }) {
  const base = tone === 'dark' ? 'rgb(111 143 255 / 0.18)' : 'rgb(12 93 174 / 0.14)'
  const paths = [
    'M0 120 H180 L220 160 H420 L460 120 H700',
    'M0 300 H120 L170 250 H380 L430 300 H640 L680 340 H900',
    'M60 520 H260 L300 480 H520 L560 440 H820',
    'M900 80 H760 L720 120 H560',
    'M900 420 H780 L740 460 H600 L560 500 H400',
  ]
  return (
    <svg
      className={cn('pointer-events-none absolute inset-0 -z-10 h-full w-full', className)}
      viewBox="0 0 900 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id="pulse" x1="0" x2="1">
          <stop offset="0" stopColor="#02c6dc" stopOpacity="0" />
          <stop offset="0.5" stopColor="#02c6dc" />
          <stop offset="1" stopColor="#0a7bc1" stopOpacity="0" />
        </linearGradient>
      </defs>
      {paths.map((d, i) => (
        <g key={d}>
          <path d={d} fill="none" stroke={base} strokeWidth="1.2" />
          <path
            d={d}
            fill="none"
            stroke="url(#pulse)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="40 160"
            className="animate-dash motion-reduce:hidden"
            style={{ animationDelay: `${-i * 1.2}s`, animationDuration: `${5 + i}s` }}
          />
        </g>
      ))}
      {[
        [220, 160],
        [460, 120],
        [170, 250],
        [430, 300],
        [300, 480],
        [720, 120],
        [740, 460],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="3.5" fill={tone === 'dark' ? '#02c6dc' : '#0c5dae'} opacity="0.6" />
      ))}
    </svg>
  )
}

/** Abstract network topology used behind the IT solutions section. */
export function NetworkMesh({ className }: { className?: string }) {
  const nodes: [number, number][] = [
    [80, 90], [230, 60], [380, 120], [520, 70], [660, 130], [800, 80],
    [140, 230], [300, 260], [460, 220], [600, 280], [750, 240],
    [90, 380], [250, 400], [420, 370], [580, 420], [720, 380], [850, 330],
  ]
  const edges: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [0, 6], [1, 7], [2, 8], [3, 8], [4, 9], [5, 10],
    [6, 7], [7, 8], [8, 9], [9, 10], [6, 11], [7, 12], [8, 13], [9, 14], [10, 15], [10, 16],
    [11, 12], [12, 13], [13, 14], [14, 15], [15, 16],
  ]
  return (
    <svg className={cn('pointer-events-none absolute inset-0 -z-10 h-full w-full', className)} viewBox="0 0 900 460" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a][0]}
          y1={nodes[a][1]}
          x2={nodes[b][0]}
          y2={nodes[b][1]}
          stroke={i % 3 ? 'rgb(111 143 255 / 0.22)' : 'rgb(10 123 193 / 0.3)'}
          strokeWidth="1"
          strokeDasharray={i % 4 === 0 ? '4 6' : undefined}
          className={i % 4 === 0 ? 'animate-dash motion-reduce:animate-none' : undefined}
          style={i % 4 === 0 ? { animationDuration: '14s' } : undefined}
        />
      ))}
      {nodes.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={i % 5 === 0 ? 7 : 4} fill="#0E1530" stroke={i % 2 ? '#02c6dc' : '#10a5e6'} strokeWidth="1.5" />
          {i % 5 === 0 && <circle cx={x} cy={y} r="14" fill="none" stroke="#02c6dc" strokeOpacity="0.25" />}
        </g>
      ))}
    </svg>
  )
}
