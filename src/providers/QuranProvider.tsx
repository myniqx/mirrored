'use client'
import React, {
  type PropsWithChildren,
  createContext,
  useEffect,
  useMemo,
  useCallback,
} from 'react'
import type { AyahDetailsInArray } from '@/types/AyahDetails'
import { arabic } from '../constants/quran/arapca'
import endings from '../constants/quran/pageEndings.json'
import surah_details from '../constants/quran/surahDetails.json'
import turkish from '../constants/quran/turkishMeal.json'
import { arabicFonts } from '@/components/Settings/arabicFonts'
import { useLocalStorage } from '@uidotdev/usehooks'
import { useHoverStore } from '@/stores/hoverStore'
import { useSelectStore } from '@/stores/selectStore'
import { getQuranStyles } from '@/lib/quranStyles'

type BookmarkData = {
  id: number
  page: number
  last_seen: string
}

interface QuranContextProps {
  hasLineEnding: (sure: number, ayet: number, wordIndex: number) => boolean
  getArabic: (sure: number, ayet: number) => string[]
  getTurkish: (sure: number, ayet: number) => string[]
  setBookmark: (page: number, id?: number) => void
  /** @deprecated Use useHoverStore from '@/stores/hoverStore' instead */
  setHover: (surah: number, ayah: number, value: boolean) => void
  /** @deprecated Use useSelectStore from '@/stores/selectStore' instead */
  toggleSelected: (surah: number, ayah: number) => void
  /** @deprecated Use useIsSelected from '@/stores/selectStore' instead */
  isSelected: (surah: number, ayah: number) => string
  /** @deprecated Use useIsHovered from '@/stores/hoverStore' instead */
  isHovered: (surah: number, ayah: number) => string
  /** @deprecated Use getQuranStyles from '@/lib/quranStyles' instead */
  getStyles: (surah: number, ayah: number) => string
  bookmarks: BookmarkData[]
  arabicFont: string
  setArabicFont: (font: string) => void
  mealSlug: string
  setMealSlug: (id: string) => void
}

export const QuranContext = createContext<QuranContextProps>(
  {} as QuranContextProps,
)

type QuranProviderProps = PropsWithChildren

export const QuranProvider: React.FC<QuranProviderProps> = ({ children }) => {
  const [bookmarks, setBookmarks] = useLocalStorage<BookmarkData[]>(
    'quranBookmarks',
    [],
  )
  const [mealSlug, setMealSlug] = useLocalStorage('mealSlug', '')
  const [arabicFont, setArabicFont] = useLocalStorage(
    'arabicFont',
    arabicFonts[0].name,
  )

  // Get Zustand store actions (backward compatibility)
  const setHoverAction = useHoverStore((state) => state.setHover)
  const toggleSelectedAction = useSelectStore((state) => state.toggleSelected)
  const hoveredVerse = useHoverStore((state) => state.hoveredVerse)
  const selectedVerses = useSelectStore((state) => state.selectedVerses)

  const hasLineEnding = useCallback(
    (sure: number, ayet: number, wordIndex: number) => {
      const surah = endings[sure - 1]
      const list = surah?.[ayet.toString() as keyof typeof surah]
      return list?.includes(wordIndex) ?? false
    },
    [],
  )

  const getArabic = useCallback((sure: number, ayet: number) => {
    return arabic[sure - 1][ayet - 1]
  }, [])

  const getTurkish = useCallback((sure: number, ayet: number) => {
    return turkish[sure - 1][ayet - 1]
  }, [])

  const setBookmark = useCallback(
    (page: number, id?: number) => {
      const bm = id
        ? bookmarks.find((b: BookmarkData) => b.id === id)
        : undefined
      if (bm) {
        if (bm.page === page) {
          return
        }
        bm.page = page
        bm.last_seen = new Date().toISOString()
        setBookmarks([
          bm,
          ...bookmarks.filter((b: BookmarkData) => b.id !== id),
        ])
      } else {
        setBookmarks([
          {
            id: id ?? Date.now(),
            page,
            last_seen: new Date().toISOString(),
          },
          ...bookmarks,
        ])
      }
    },
    [bookmarks, setBookmarks],
  )

  // Backward compatibility wrappers (deprecated - use stores directly)
  const setHover = useCallback(
    (surah: number, ayah: number, value: boolean) => {
      setHoverAction(surah, ayah, value)
    },
    [setHoverAction],
  )

  const toggleSelected = useCallback(
    (surah: number, ayah: number) => {
      toggleSelectedAction(surah, ayah)
    },
    [toggleSelectedAction],
  )

  const isSelected = useCallback(
    (surah: number, ayah: number) => {
      return selectedVerses[`${surah}-${ayah}`]
        ? 'bg-green-100 dark:bg-green-700'
        : ''
    },
    [selectedVerses],
  )

  const isHovered = useCallback(
    (surah: number, ayah: number) =>
      hoveredVerse?.[0] === surah && hoveredVerse?.[1] === ayah
        ? 'bg-blue-300 dark:bg-gray-700'
        : '',
    [hoveredVerse],
  )

  const getStyles = useCallback(
    (sure: number, ayet: number) => {
      const hovered = hoveredVerse?.[0] === sure && hoveredVerse?.[1] === ayet
      const selected = selectedVerses[`${sure}-${ayet}`] ?? false
      return getQuranStyles(hovered, selected)
    },
    [hoveredVerse, selectedVerses],
  )

  useEffect(() => {
    const loadFont = async () => {
      const font = arabicFonts.find((f) => f.name === arabicFont)
      if (font) {
        const fontFace = new FontFace(font.name, `url(${font.path})`)
        await fontFace.load()
        document.fonts.add(fontFace)
        document.body.style.setProperty('--arabic-font', font.name)
      }
    }
    loadFont()
  }, [arabicFont])

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      hasLineEnding,
      getArabic,
      getTurkish,
      getStyles,
      setBookmark,
      bookmarks,
      toggleSelected,
      setHover,
      isSelected,
      isHovered,
      arabicFont,
      setArabicFont,
      mealSlug,
      setMealSlug,
    }),
    [
      hasLineEnding,
      getArabic,
      getTurkish,
      getStyles,
      setBookmark,
      bookmarks,
      toggleSelected,
      setHover,
      isSelected,
      isHovered,
      arabicFont,
      setArabicFont,
      mealSlug,
      setMealSlug,
    ],
  )

  return (
    <QuranContext.Provider value={contextValue}>
      {children}
    </QuranContext.Provider>
  )
}

export const useQuranContext = () => React.useContext(QuranContext)

export const getSurahDetails = (sure: number) => {
  const [order, page, isMekki, name, totalAyahs] = surah_details[
    sure - 1
  ] as AyahDetailsInArray
  return {
    order,
    page,
    juz: Math.ceil(Math.min(page, 600) / 20),
    isMekki,
    name,
    totalAyahs,
  }
}

export const hasBasmala = (sure: number) => {
  return sure !== 1 && sure !== 9
}
