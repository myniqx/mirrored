import { ReactNode, useEffect, useState } from 'react'
import { PageLine } from './PageLine'
import { SurahHeader } from './SurahHeader'
import { WordView } from './WordView'
import { VerseEnd } from './VerseEnd'
import { hasBasmala, useQuranContext } from '@/providers/QuranProvider'
import pageContent from '../../../constants/quran/pageContents.json'
import { Code, For, VStack } from '@chakra-ui/react'
import { LineDetails, LineWord } from './types'
import { Besmele } from './Besmele'
import { ArabicLine } from './ArabicLine'
import { useLayoutContext } from '@/providers/LayoutProvider'

type SinglePageViewProps = {
  page: number
}

export const SinglePageView: React.FC<SinglePageViewProps> = ({ page }) => {
  const content = pageContent[page]
  const { getArabic, hasLineEnding } = useQuranContext()
  const { measures } = useLayoutContext()

  const getLines = () => {
    const list: LineDetails[] = []
    let listWords: LineWord[] = []

    content.forEach(([surah, ayah]) => {
      if (ayah === 0) {
        list.push({ type: 'header', surah })
        return
      }
      if (ayah === 1 && hasBasmala(surah)) {
        list.push({ type: 'besmele' })
      }

      const words = getArabic(surah, ayah)

      words.forEach((w, i) => {
        listWords.push({ isEnd: false, surah, ayah, word: w, wordIndex: i })

        if (hasLineEnding(surah, ayah, i)) {
          list.push({ type: 'content', words: listWords })
          listWords = []
        }
      })

      listWords.push({ isEnd: true, surah, ayah })

      if (hasLineEnding(surah, ayah, -1)) {
        list.push({ type: 'content', words: listWords })
        listWords = []
      }
    })

    if (listWords.length > 0) {
      list.push({ type: 'content', words: listWords })
    }

    return list
  }

  const lineList = getLines()

  return (
    <VStack gap={4} borderWidth={1} p={4}>
      <For each={lineList}>
        {(line, index) => {
          if (line.type === 'header') {
            return <SurahHeader key={index} surah={line.surah} />
          } else if (line.type === 'besmele') {
            return <Besmele key={index} />
          } else {
            return <ArabicLine key={index} words={line.words} width={measures.width} />
          }
        }}
      </For>
    </VStack>
  )
}
