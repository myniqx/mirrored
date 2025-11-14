'use client'

import React, { useEffect } from 'react'

import { createContext, useContext, useMemo } from 'react'
import { ArabicLineAspectRatio, type LineWord } from './types'
import { VerseEnd } from './VerseEnd'
import { WordView } from './WordView'
import { PartialAyahView, PartialAyahViewProps } from './PartialAyahView'
import { useLayoutContext } from '@/providers/LayoutProvider'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

type ArabicLineProps = {
  words?: LineWord[]
  width: number
  fontSize: number
}

const LineContext = createContext<{
  fontSize: number
  setWordWidth: (
    surah: number,
    ayah: number,
    wordIndex: number,
    width: number,
  ) => void
}>({ fontSize: 36, setWordWidth: () => {} })

export const ArabicLine: React.FC<ArabicLineProps> = ({
  words = [],
  width,
  fontSize,
}) => {
  const { debug } = useLayoutContext()
  const [widths, setWidths] = React.useState<Record<string, number>>({})

  // Batch state updates for performance (collects all width changes and applies them in one render)
  const pendingWidthsRef = React.useRef<Record<string, number>>({})
  const updateTimeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined)

  const space = useMemo(() => {
    const values = Object.values(widths)
    if (values.some((v) => !v)) return 0

    const total = values.reduce((a, b) => a + b, 0)
    return (width - total) / (values.length - 1)
  }, [widths, width])

  const groupedWords = useMemo(() => {
    const groups: PartialAyahViewProps[] = []
    let currentGroup: PartialAyahViewProps = {
      words: [],
      surah: 0,
      ayah: 0,
    }

    words.forEach((word, i) => {
      if (
        word.surah !== currentGroup.surah ||
        word.ayah !== currentGroup.ayah
      ) {
        if (currentGroup.words.length > 0) {
          groups.push(currentGroup)
        }
        currentGroup = {
          words: i !== 0 ? [space / 2] : [],
          surah: word.surah,
          ayah: word.ayah,
        }
      }

      if (word.isEnd) {
        currentGroup.words.push(word)
        if (i < words.length - 1) {
          currentGroup.words.push(space / 2)
        }
      } else {
        currentGroup.words.push(word)
        if (i < words.length - 1) {
          currentGroup.words.push(space)
        }
      }
    })

    if (currentGroup.words.length > 0) {
      groups.push(currentGroup)
    }

    return groups
  }, [space, words])

  const setWordWidth = React.useCallback(
    (surah: number, ayah: number, wordIndex: number, width: number) => {
      const key = `${surah}.${ayah}.${wordIndex}`
      pendingWidthsRef.current[key] = width

      // Debounce: batch all updates within 16ms (one frame at 60fps)
      if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current)
      updateTimeoutRef.current = setTimeout(() => {
        setWidths((prev) => {
          const next = { ...prev, ...pendingWidthsRef.current }
          pendingWidthsRef.current = {}
          return next
        })
      }, 16)
    },
    [],
  )

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current)
    }
  }, [])

  return (
    <LineContext.Provider value={{ fontSize, setWordWidth }}>
      <div
        className="flex flex-row-reverse py-4 px-2 justify-between items-center relative"
        style={{ width, aspectRatio: ArabicLineAspectRatio }}
      >
        {debug && (
          <div className={cn('absolute top-0 left-0 w-full ', debug)}>
            <p>
              fontSize {fontSize}, width {width}, space {space}
            </p>
          </div>
        )}
        {groupedWords.map((group, i) => (
          <PartialAyahView key={i} {...group} />
        ))}
        {space && (
          <Skeleton
            className="w-full absolute left-0 top-0"
            style={{ aspectRatio: ArabicLineAspectRatio }}
          />
        )}
      </div>
    </LineContext.Provider>
  )
}

export const usePageLine = () => useContext(LineContext)
