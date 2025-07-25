'use client'
import type React from 'react'

import { hasBasmala, useQuranContext } from '@/providers/QuranProvider'
import { Skeleton } from '@/components/ui/skeleton'
import pageContent from '../../../constants/quran/pageContents.json'
import { ArabicLine } from './ArabicLine'
import { Besmele } from './Besmele'
import { SurahHeader } from './SurahHeader'
import {
  ArabicLineAspectRatio,
  HeaderAspectRatio,
  LineContent,
  type LineDetails,
  type LineWord,
  type SinglePageViewProps,
} from './types'
import {
  createContext,
  type Dispatch,
  type SetStateAction,
  useMemo,
  useState,
  useEffect,
  useRef,
} from 'react'
import useMeasureElement from '@/hooks/useMeasureElement'
import {
  findFontSize,
  findFontSize2,
  getTextWidthFallback,
} from '@/utils/measureWidth'
import { getArabicNumberWithShape } from '@/utils/arabicNumber'
import { For } from '@/components/Condition/For'
import { useLayoutContext } from '@/providers/LayoutProvider'
import { cn } from '@/lib/utils'

const ArabicPageContent = createContext<{
  fontSizes: Record<string, number>
  setFontSizes: Dispatch<SetStateAction<Record<string, number>>>
}>({
  fontSizes: {},
  setFontSizes: () => {},
})

export const SinglePageView: React.FC<SinglePageViewProps> = ({ page }) => {
  const { debug } = useLayoutContext()
  const { getArabic, hasLineEnding } = useQuranContext()
  const [ref, { width }] = useMeasureElement<HTMLDivElement>({ inside: true })

  const lineList = useMemo(() => {
    const content = pageContent[page]
    const list: LineDetails[] = []
    let listWords: LineWord[] = []
    const zero: Omit<LineContent, 'type' | 'words' | 'sentence'> = {
      fontSize: 0,
    }

    content.forEach(([surah, ayah]) => {
      if (ayah === 0) {
        list.push({ type: 'header', surah })
        return
      }
      if (ayah === 1 && hasBasmala(surah)) {
        list.push({ type: 'besmele', fontSize: 0, surah })
      }

      const words = getArabic(surah, ayah)

      words.forEach((w, i) => {
        listWords.push({ isEnd: false, surah, ayah, word: w, wordIndex: i })

        if (hasLineEnding(surah, ayah, i)) {
          list.push({
            type: 'content',
            words: listWords,
            sentence: listWords.reduce(
              (s, w) =>
                s + (w.isEnd ? getArabicNumberWithShape(w.ayah) : w.word),
              '',
            ),
            ...zero,
          })
          listWords = []
        }
      })

      listWords.push({ isEnd: true, surah, ayah })

      if (hasLineEnding(surah, ayah, -1)) {
        list.push({
          type: 'content',
          words: listWords,
          sentence: listWords.reduce(
            (s, w) => s + (w.isEnd ? getArabicNumberWithShape(w.ayah) : w.word),
            '',
          ),
          ...zero,
        })
        listWords = []
      }
    })

    if (listWords.length > 0) {
      list.push({
        type: 'content',
        words: listWords,
        sentence: listWords.reduce(
          (s, w) => s + (w.isEnd ? getArabicNumberWithShape(w.ayah) : w.word),
          '',
        ),
        ...zero,
      })
    }

    return list
  }, [page])

  const measuredLineList = useMemo(() => {
    if (!width) return []
    const maxWidth = width
    const font = 'quran-text'

    const fontSizes = lineList.map((line) => {
      if (line.type !== 'content') return { fontSize: 0, text: '', width: 0 }

      return findFontSize2({
        text: line.sentence,
        gapCount: line.words.length - 1,
        maxWidth,
        font,
      })
    })

    const minFont = Math.min(
      ...fontSizes.map((f) => (f.fontSize > 0 ? f.fontSize : 999)),
    )

    lineList.forEach((line, index) => {
      if (line.type === 'content') {
        line.fontSize = minFont // fontSizes[index].fontSize
      } else if (line.type === 'besmele') {
        line.fontSize = minFont // averageValues
      }
    })

    return lineList
  }, [lineList, width, page])

  return (
    <div className="flex flex-col gap-4 border p-4 w-full relative" ref={ref}>
      {debug && (
        <div
          className={cn('absolute top-0 left-0 w-full ', debug)}
          style={{ pointerEvents: 'none' }}
        >
          <p>width {width}</p>
        </div>
      )}
      <For each={measuredLineList}>
        {(line, index) => {
          if (line.type === 'header') {
            return (
              <SurahHeader key={`header-${line.surah}`} surah={line.surah} />
            )
          } else if (line.type === 'besmele') {
            return (
              <Besmele key={`besmele-${line.surah}`} fontSize={line.fontSize} />
            )
          } else {
            return (
              <ArabicLine
                key={`line-${line.sentence}`}
                {...line}
                width={width}
              />
            )
          }
        }}
      </For>
    </div>
  )
}
