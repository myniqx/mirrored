import { LineWord } from './types'
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import { For, HStack, Stack, Text } from '@chakra-ui/react'
import { getArabicNumberWithShape } from '@/utils/arabicNumber'
import { VerseEnd } from './VerseEnd'
import { WordView } from './WordView'

type ArabicLineProps = {
  words?: LineWord[]
}

const LineContext = createContext<{
  fontSize: number
}>({ fontSize: 36 })

export const ArabicLine: React.FC<ArabicLineProps> = ({ words = [] }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [fontSize, setFontSize] = useState(36)

  useEffect(() => {
    if (!ref?.current) return

    const observer = new ResizeObserver(([entry]) => {
      const { width } = entry.contentRect
      const sentence = words
        .map((w) => {
          if (w.isEnd) return getArabicNumberWithShape(w.ayah)
          return w.word
        })
        .join(' ')

      const bestSize = findFontSize(sentence, 'font-arabic', width)

      setFontSize(bestSize)
    })

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref])

  return (
    <LineContext.Provider value={{ fontSize }}>
      <HStack
        ref={ref}
        w={'100%'}
        flexDir={'row-reverse'}
        gap={fontSize / 2}
        py={18}
        justifyContent={'space-between'}
        alignItems={'center'}
        borderWidth={2}
      >
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
