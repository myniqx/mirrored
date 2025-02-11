import { useLayoutContext } from '@/providers/LayoutProvider'
import { hasBasmala, useQuranContext } from '@/providers/QuranProvider'
import { Box, For, Skeleton, VStack } from '@chakra-ui/react'
import pageContent from '../../../constants/quran/pageContents.json'
import { ArabicLine } from './ArabicLine'
import { Besmele } from './Besmele'
import { SurahHeader } from './SurahHeader'
import {
  ArabicLineAspectRatio,
  HeaderAspectRatio,
  LineDetails,
  LineWord,
  SinglePageViewProps,
} from './types'
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react'
import useMeasureElement from '@/hooks/useMeasureElement'
import { findFontSize } from '@/utils/measureWidth'
import { getArabicNumberWithShape } from '@/utils/arabicNumber'

const ArabicPageContent = createContext<{
  fontSizes: Record<string, number>
  setFontSizes: Dispatch<SetStateAction<Record<string, number>>>
}>({
  fontSizes: {},
  setFontSizes: () => { },
})

export const SinglePageView: React.FC<SinglePageViewProps> = ({ page }) => {
  const content = pageContent[page]
  const { getArabic, hasLineEnding } = useQuranContext()
  const [ref, { width }] = useMeasureElement<HTMLDivElement>({ p: 4 })

  const lineList = useMemo(() => {
    const list: LineDetails[] = []
    let listWords: LineWord[] = []

    content.forEach(([surah, ayah]) => {
      if (ayah === 0) {
        list.push({ type: 'header', surah })
        return
      }
      if (ayah === 1 && hasBasmala(surah)) {
        list.push({ type: 'besmele', fontSize: 0 })
      }

      const words = getArabic(surah, ayah)

      words.forEach((w, i) => {
        listWords.push({ isEnd: false, surah, ayah, word: w, wordIndex: i })

        if (hasLineEnding(surah, ayah, i)) {
          list.push({ type: 'content', words: listWords, fontSize: 0 })
          listWords = []
        }
      })

      listWords.push({ isEnd: true, surah, ayah })

      if (hasLineEnding(surah, ayah, -1)) {
        list.push({ type: 'content', words: listWords, fontSize: 0 })
        listWords = []
      }
    })

    if (listWords.length > 0) {
      list.push({ type: 'content', words: listWords, fontSize: 0 })
    }

    return list
  }, [content, getArabic, hasLineEnding])

  const measuredLineList = useMemo(() => {
    if (!width) return []

    const fontSizes = lineList
      .filter((line) => line.type === 'content')
      ?.map((line) => {
        const sentences = line.words
          .map((w) => {
            if (w.isEnd) return getArabicNumberWithShape(w.ayah)
            return w.word
          })
          .join('')
        return findFontSize(sentences, 'arabic', width)
      })
    const averageValues =
      fontSizes.reduce((size, acc) => acc + size, 0) / fontSizes.length

    lineList.forEach((line) => {
      if (line.type === 'content') {
        line.fontSize = Math.max(line.fontSize, averageValues * 1)
      } else if (line.type === 'besmele') {
        line.fontSize = averageValues
      }
    })

    return lineList
  }, [lineList, width])

  return (
    <VStack
      gap={4}
      borderWidth={1}
      p={4}
      ref={ref}
      w={'100%'}
    >
      <For
        each={measuredLineList}
        fallback={
          <For each={lineList}>
            {(line, index) => {
              if (line.type === 'header') {
                return (
                  <Skeleton
                    key={index}
                    variant={'pulse'}
                    aspectRatio={HeaderAspectRatio}
                    w={'100%'}
                  />
                )
              } else {
                return (
                  <Skeleton
                    key={index}
                    w={'100%'}
                    variant={'shine'}
                    aspectRatio={ArabicLineAspectRatio}
                  />
                )
              }
            }}
          </For>
        }
      >
        {(line, index) => {
          if (line.type === 'header') {
            return <SurahHeader key={index} surah={line.surah} />
          } else if (line.type === 'besmele') {
            return <Besmele key={index} fontSize={line.fontSize} />
          } else {
            return <ArabicLine key={index} words={line.words} width={width} fontSize={line.fontSize} />
          }
        }}
      </For>
    </VStack>
  )
}

