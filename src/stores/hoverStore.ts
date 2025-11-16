import { create } from 'zustand'

type VerseKey = string // "surah-ayah" format
type Listener = () => void

// Event-based subscription system: Only notify components that care about specific verses
const verseListeners = new Map<VerseKey, Set<Listener>>()

type HoverState = {
  hoveredVerse: [number, number] | null
  setHover: (surah: number, ayah: number, value: boolean) => void
  subscribeToVerse: (
    surah: number,
    ayah: number,
    callback: Listener,
  ) => () => void
}

export const useHoverStore = create<HoverState>((set, get) => ({
  hoveredVerse: null,

  setHover: (surah, ayah, value) => {
    const prev = get().hoveredVerse
    const next: [number, number] | null = value ? [surah, ayah] : null

    set({ hoveredVerse: next })

    // Event-based notification: Only notify affected verses
    if (prev) {
      const prevKey = `${prev[0]}-${prev[1]}`
      notifyListeners(prevKey) // Old hovered verse: "You're no longer hovered"
    }
    if (next) {
      const nextKey = `${next[0]}-${next[1]}`
      notifyListeners(nextKey) // New hovered verse: "You're now hovered"
    }
  },

  subscribeToVerse: (surah, ayah, callback) => {
    const key = `${surah}-${ayah}`

    // Add component to listener list
    if (!verseListeners.has(key)) {
      verseListeners.set(key, new Set())
    }
    verseListeners.get(key)!.add(callback)

    // Return cleanup function (called on component unmount)
    return () => {
      verseListeners.get(key)?.delete(callback)
      // Clean up empty listener sets
      if (verseListeners.get(key)?.size === 0) {
        verseListeners.delete(key)
      }
    }
  },
}))

// Helper: Notify all listeners for a specific verse
function notifyListeners(verseKey: VerseKey) {
  const listeners = verseListeners.get(verseKey)
  if (listeners) {
    listeners.forEach((callback) => callback())
  }
}

// Legacy hook for backward compatibility (uses broadcast pattern)
// @deprecated Use useVerseHoverState from '@/hooks/useVerseHoverState' instead
export const useIsHovered = (surah: number, ayah: number): boolean => {
  const hoveredVerse = useHoverStore((state) => state.hoveredVerse)
  return hoveredVerse?.[0] === surah && hoveredVerse?.[1] === ayah
}
