import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type SelectState = {
  selectedVerses: Record<string, boolean>
  toggleSelected: (surah: number, ayah: number) => void
  clearSelected: () => void
}

export const useSelectStore = create<SelectState>()(
  persist(
    (set) => ({
      selectedVerses: {},
      toggleSelected: (surah, ayah) =>
        set((state) => ({
          selectedVerses: {
            ...state.selectedVerses,
            [`${surah}-${ayah}`]: !state.selectedVerses[`${surah}-${ayah}`],
          },
        })),
      clearSelected: () => set({ selectedVerses: {} }),
    }),
    {
      name: 'quran-selected-verses', // localStorage key
    },
  ),
)

// Helper hook to check if a specific verse is selected
export const useIsSelected = (surah: number, ayah: number): boolean => {
  return useSelectStore(
    (state) => state.selectedVerses[`${surah}-${ayah}`] ?? false,
  )
}
