import { useState, useEffect } from 'react'
import { useHoverStore } from '@/stores/hoverStore'

/**
 * Event-based hook to check if a specific verse is hovered
 *
 * Performance: Only re-renders when THIS specific verse's hover state changes.
 * Unlike useIsHovered, this doesn't re-render on every hover change in the app.
 *
 * @param surah - Surah number
 * @param ayah - Ayah number
 * @returns boolean - True if this verse is currently hovered
 *
 * @example
 * const isHovered = useVerseHoverState(2, 50)
 * // Only re-renders when verse 2:50's hover state changes
 */
export const useVerseHoverState = (surah: number, ayah: number): boolean => {
  const hoveredVerse = useHoverStore((state) => state.hoveredVerse)
  const subscribeToVerse = useHoverStore((state) => state.subscribeToVerse)

  // Local state (only for this component)
  const [isHovered, setIsHovered] = useState(
    hoveredVerse?.[0] === surah && hoveredVerse?.[1] === ayah,
  )

  useEffect(() => {
    // Subscribe this component to only its specific verse
    const unsubscribe = subscribeToVerse(surah, ayah, () => {
      // This callback only runs when THIS verse's hover state changes!
      const current = useHoverStore.getState().hoveredVerse
      setIsHovered(current?.[0] === surah && current?.[1] === ayah)
    })

    return unsubscribe // Cleanup on unmount
  }, [surah, ayah, subscribeToVerse])

  return isHovered
}
