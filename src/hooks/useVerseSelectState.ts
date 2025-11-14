import { useState, useEffect } from 'react'
import { useSelectStore } from '@/stores/selectStore'

/**
 * Event-based hook to check if a specific verse is selected
 *
 * Performance: Only re-renders when THIS specific verse's selection state changes.
 * Unlike useIsSelected, this doesn't re-render on every selection change in the app.
 *
 * @param surah - Surah number
 * @param ayah - Ayah number
 * @returns boolean - True if this verse is currently selected
 *
 * @example
 * const isSelected = useVerseSelectState(2, 50)
 * // Only re-renders when verse 2:50's selection state changes
 */
export const useVerseSelectState = (surah: number, ayah: number): boolean => {
  const selectedVerses = useSelectStore((state) => state.selectedVerses)
  const subscribeToVerse = useSelectStore((state) => state.subscribeToVerse)

  // Local state (only for this component)
  const [isSelected, setIsSelected] = useState(
    selectedVerses[`${surah}-${ayah}`] ?? false,
  )

  useEffect(() => {
    // Subscribe this component to only its specific verse
    const unsubscribe = subscribeToVerse(surah, ayah, () => {
      // This callback only runs when THIS verse's selection state changes!
      const current = useSelectStore.getState().selectedVerses
      setIsSelected(current[`${surah}-${ayah}`] ?? false)
    })

    return unsubscribe // Cleanup on unmount
  }, [surah, ayah, subscribeToVerse])

  return isSelected
}
