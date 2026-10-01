import type { AudioSpecs } from '../../data/types'

/** Rows used by the product page spec table and the comparison table. */
export function audioRows(a: AudioSpecs | undefined): [string, string][] {
  const ns = 'Not specified'
  return [
    ['Connection', a?.connectivity.join(' · ') || ns],
    ['Wired / wireless', a?.link || ns],
    ['Mono / stereo', a?.wearing || ns],
    ['Microphone', a?.microphone || ns],
    ['Platforms', a?.platforms || ns],
    ['Suited to', a?.workplace.join(' · ') || ns],
  ]
}
