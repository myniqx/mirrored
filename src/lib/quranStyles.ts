import { cn } from './utils'

/**
 * Get combined styles for a Quran verse (hover + selected states)
 * This is a pure utility function that can be used with any state management
 */
export const getQuranStyles = (
  isHovered: boolean,
  isSelected: boolean,
): string => {
  return cn(
    isHovered && 'bg-blue-300 dark:bg-gray-700',
    isSelected && 'bg-green-100 dark:bg-green-700',
  )
}
