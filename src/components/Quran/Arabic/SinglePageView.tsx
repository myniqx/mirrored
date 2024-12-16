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

type SinglePageViewProps = {
  page: number
}

export const SinglePageView: React.FC<SinglePageViewProps> = ({ page }) => {
  const content = pageContent[page]
  const { getArabic, hasLineEnding } = useQuranContext()

  const getLines = () => {
    const list: LineDetails[] = []
    let listWords: LineWord[] = []
    // const lines = []
    // let wordList: ReactNode[] = []

    content.forEach(([surah, ayah]) => {
      if (ayah === 0) {
        list.push({ type: 'header', surah })
        // lines.push(<SurahHeader key={lines.length} surah={surah} />)
        return
      }
      if (ayah === 1 && hasBasmala(surah)) {
        list.push({ type: 'besmele' })
        //lines.push(<PageLine key={lines.length} isBasmala={true} />)
      }

      const words = getArabic(surah, ayah)

      words.forEach((w, i) => {
        listWords.push({ isEnd: false, surah, ayah, word: w, wordIndex: i })
        /*
        wordList.push(
          <WordView
            key={`${surah}.${ayah}.${i}`}
            word={w}
            surah={surah}
            ayah={ayah}
            wordIndex={i}
          />,
        )
        */

        if (hasLineEnding(surah, ayah, i)) {
          /*
          lines.push(
            <PageLine
              key={lines.length}
              wordList={wordList}
              hasEnding={true}
              isBasmala={false}
            />,
          )
          */
          list.push({ type: 'content', words: listWords })
          listWords = []
        }
      })

      listWords.push({ isEnd: true, surah, ayah })
      /*
      wordList.push(
        <VerseEnd key={wordList.length} ayah={ayah} surah={surah} />,
      )
      */

      if (hasLineEnding(surah, ayah, -1)) {
        list.push({ type: 'content', words: listWords })
        listWords = []
        /*
        lines.push(
          <PageLine key={lines.length} wordList={wordList} isBasmala={false} />,
        )
        wordList = []
        */
      }
    })

    if (listWords.length > 0) {
      list.push({ type: 'content', words: listWords })
      /*
      lines.push(
        <PageLine key={lines.length} wordList={wordList} isBasmala={false} />,
      )
      */
    }

    return list
  }

  const lineList = getLines()

  return (
    <VStack gap={4} borderWidth={1} p={4}>
      <Code>
        <pre>
          {
            //  JSON.stringify(lineList, null, 2)
          }
        </pre>
      </Code>
      <For each={lineList}>
        {(line, index) => {
          if (line.type === 'header') {
            return <SurahHeader key={index} surah={line.surah} />
          } else if (line.type === 'besmele') {
            return <Besmele key={index} />
          } else {
            return <ArabicLine key={index} words={line.words} />
          }
        }}
      </For>
    </VStack>
  )
}
