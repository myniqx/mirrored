import {
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { LineWord } from './types'

import { getArabicNumberWithShape } from '@/utils/arabicNumber'
import { Box, For, HStack } from '@chakra-ui/react'
import { VerseEnd } from './VerseEnd'
import { WordView } from './WordView'
import { findFontSize } from '../../../utils/measureWitdh'

type ArabicLineProps = {
  words?: LineWord[]
  width: number
}

const LineContext = createContext<{
  fontSize: number
}>({ fontSize: 36 })

export const ArabicLine: React.FC<ArabicLineProps> = ({ words = [], width }) => {

  const fontSize = useMemo(() => {
    if (!words?.length || !width) return 36

    const sentence = words
      .map((w) => {
        if (w.isEnd) return getArabicNumberWithShape(w.ayah)
        return w.word
      })
      .join(' ')

    return findFontSize(sentence, 'arabic', width)
  }, [words, width])


  return (
    <LineContext.Provider value={{ fontSize }}>
      <HStack
        w={width}
        flexDir={'row-reverse'}
        gap={fontSize / 2}
        py={18}
        justifyContent={'space-between'}
        alignItems={'center'}
        borderWidth={2}
        pos={'relative'}
      >
        <Box pos={'absolute'} left={0} top={0} zIndex={5}>
          fontSize {fontSize}, width {width}
        </Box>
        <For each={words}>
          {(word, i) => {
            if (word.isEnd)
              return <VerseEnd key={i} surah={word.surah} ayah={word.ayah} />
            else
              return (
                <WordView
                  key={`${word.surah}.${word.ayah}.${word.wordIndex}`}
                  {...word}
                />
              )
          }}
        </For>
      </HStack>
    </LineContext.Provider>
  )
}
