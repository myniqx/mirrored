import { create } from 'zustand'

type HoverState = {
  hoveredVerse: [number, number] | null
  setHover: (surah: number, ayah: number, value: boolean) => void
}

export const useHoverStore = create<HoverState>((set) => ({
  hoveredVerse: null,
  setHover: (surah, ayah, value) =>
    set({ hoveredVerse: value ? [surah, ayah] : null }),
}))

// Helper hook to check if a specific verse is hovered
// Note: This will cause re-renders on every hover change for all components using it
// However, it's still more performant than Context because there's no Provider overhead
export const useIsHovered = (surah: number, ayah: number): boolean => {
  const hoveredVerse = useHoverStore((state) => state.hoveredVerse)
  return hoveredVerse?.[0] === surah && hoveredVerse?.[1] === ayah
}
