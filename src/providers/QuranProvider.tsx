"use client"
import React, { type PropsWithChildren, createContext, useState, useEffect, CSSProperties } from "react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import type { AyahDetailsInArray } from "@/types/AyahDetails"
import { arabic } from "../constants/quran/arapca"
import endings from "../constants/quran/pageEndings.json"
import surah_details from "../constants/quran/surahDetails.json"
import turkish from "../constants/quran/turkishMeal.json"
import { arabicFonts } from "@/components/Settings/arabicFonts"
import { cn } from "@/lib/utils"

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
  setHover: (surah: number, ayah: number, value: boolean) => void
  toggleSelected: (surah: number, ayah: number) => void
  isSelected: (surah: number, ayah: number) => string
  isHovered: (surah: number, ayah: number) => string
  getStyles: (surah: number, ayah: number) => string
  bookmarks: BookmarkData[]
  arabicFont: string
  setArabicFont: (font: string) => void
  mealSlug: string
  setMealSlug: (id: string) => void
}

export const QuranContext = createContext<QuranContextProps>({} as QuranContextProps)

type QuranProviderProps = PropsWithChildren

export const QuranProvider: React.FC<QuranProviderProps> = ({ children }) => {
  const [bookmarks, setBookmarks] = useLocalStorage<BookmarkData[]>("quranBookmarks", [])
  const [mealSlug, setMealSlug] = useLocalStorage("mealSlug", '')
  const [hoveredVerse, setHoveredVerse] = useState<[number, number] | null>(null)
  const [selectedVerses, setSelectedVerses] = useState<Record<string, boolean>>({})
  const [arabicFont, setArabicFont] = useLocalStorage("arabicFont", arabicFonts[0].name)

  const hasLineEnding = (sure: number, ayet: number, wordIndex: number) => {
    const surah = endings[sure - 1]
    const list = surah?.[ayet.toString() as keyof typeof surah]
    return list?.includes(wordIndex) ?? false
  }

  const getArabic = (sure: number, ayet: number) => {
    return arabic[sure - 1][ayet - 1]
  }

  const getTurkish = (sure: number, ayet: number) => {
    return turkish[sure - 1][ayet - 1]
  }

  const setBookmark = (page: number, id?: number) => {
    const bm = id ? bookmarks.find((b) => b.id === id) : undefined
    if (bm) {
      if (bm.page === page) {
        return
      }
      bm.page = page
      bm.last_seen = new Date().toISOString()
      setBookmarks([bm, ...bookmarks.filter((b) => b.id !== id)])
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
  }

  const setHover = (surah: number, ayah: number, value: boolean) => {
    setHoveredVerse(value ? [surah, ayah] : null)
  }

  const toggleSelected = (surah: number, ayah: number) => {
    setSelectedVerses((prev) => ({
      ...prev,
      [`${surah}-${ayah}`]: !prev[`${surah}-${ayah}`],
    }))
  }

  const isSelected = (surah: number, ayah: number) => {
    return selectedVerses[`${surah}-${ayah}`]
      ? "bg-green-100 dark:bg-green-700"
      : ""
  }

  const isHovered = (surah: number, ayah: number) =>
    hoveredVerse?.[0] === surah && hoveredVerse?.[1] === ayah
      ? "bg-blue-300 dark:bg-gray-700"
      : "";

  const getStyles = (sure: number, ayet: number) => {
    return cn(
      isHovered(sure, ayet),
      isSelected(sure, ayet),
    )
  }

  useEffect(() => {
    const loadFont = async () => {
      const font = arabicFonts.find((f) => f.name === arabicFont)
      if (font) {
        const fontFace = new FontFace(font.name, `url(${font.path})`)
        await fontFace.load()
        document.fonts.add(fontFace)
        document.body.style.setProperty("--arabic-font", font.name)
      }
    }
    loadFont()
  }, [arabicFont])

  return (
    <QuranContext.Provider
      value={{
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
        setMealSlug
      }}
    >
      {children}
    </QuranContext.Provider>
  )
}

export const useQuranContext = () => React.useContext(QuranContext)

export const getSurahDetails = (sure: number) => {
  const [order, page, isMekki, name, totalAyahs] = surah_details[sure - 1] as AyahDetailsInArray
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

