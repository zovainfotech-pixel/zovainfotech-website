import { createContext, useContext } from 'react'
import { paths } from '../../data/routes'

export const COMPARE_MAX = 3

export interface CompareState {
  ids: string[]
  toggle: (id: string) => void
  remove: (id: string) => void
  clear: () => void
  has: (id: string) => boolean
  full: boolean
}

export const CompareContext = createContext<CompareState | null>(null)

export function useCompare(): CompareState | null {
  return useContext(CompareContext)
}

export const compareHref = (ids: string[]) => `${paths.compare}?ids=${ids.map(encodeURIComponent).join(',')}`
