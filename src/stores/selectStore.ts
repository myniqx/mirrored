import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type VerseKey = string // "surah-ayah" format
type Listener = () => void

// Event-based subscription system: Only notify components that care about specific verses
const verseListeners = new Map<VerseKey, Set<Listener>>()

type SelectState = {
  selectedVerses: Record<string, boolean>
  toggleSelected: (surah: number, ayah: number) => void
  clearSelected: () => void
  subscribeToVerse: (
    surah: number,
    ayah: number,
    callback: Listener,
  ) => () => void
}

export const useSelectStore = create<SelectState>()(
  persist(
    (set, get) => ({
      selectedVerses: {},

      toggleSelected: (surah, ayah) => {
        const key = `${surah}-${ayah}`

        set((state) => ({
          selectedVerses: {
            ...state.selectedVerses,
            [key]: !state.selectedVerses[key],
          },
        }))

        // Event-based notification: Only notify the toggled verse
        notifyListeners(key)
      },

      clearSelected: () => {
        const prevSelected = get().selectedVerses
        set({ selectedVerses: {} })

        // Notify all previously selected verses that they're no longer selected
        Object.keys(prevSelected).forEach((key) => {
          if (prevSelected[key]) {
            notifyListeners(key)
          }
        })
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
    }),
    {
      name: 'quran-selected-verses', // localStorage key
    },
  ),
)

// Helper: Notify all listeners for a specific verse
function notifyListeners(verseKey: VerseKey) {
  const listeners = verseListeners.get(verseKey)
  if (listeners) {
    listeners.forEach((callback) => callback())
  }
}

// Legacy hook for backward compatibility (uses broadcast pattern)
// @deprecated Use useVerseSelectState from '@/hooks/useVerseSelectState' instead
export const useIsSelected = (surah: number, ayah: number): boolean => {
  return useSelectStore(
    (state) => state.selectedVerses[`${surah}-${ayah}`] ?? false,
  )
}
