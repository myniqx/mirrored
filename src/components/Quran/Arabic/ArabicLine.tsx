import { createContext, useContext } from 'react'
import { ArabicLineAspectRatio, LineWord } from './types'

import { Box, For, HStack, Show, Text } from '@chakra-ui/react'
import { VerseEnd } from './VerseEnd'
import { WordView } from './WordView'

type ArabicLineProps = {
  words?: LineWord[]
  width: number
  fontSize: number
}

const DEBUG = false
const LineContext = createContext<{
  fontSize: number
  debug: boolean
}>({ fontSize: 36, debug: DEBUG })

export const ArabicLine: React.FC<ArabicLineProps> = ({
  words = [],
  width,
  fontSize,
}) => {

  /*
  const groups = words.reduce((acc, word) => {
    const last = acc[acc.length - 1]
    if (last && last.surah === word.surah && last.ayah === word.ayah)
      last.words.push(word)
    else acc.push({ surah: word.surah, ayah: word.ayah, words: [word] })
    return acc
  }, [] as { surah: number; ayah: number; words: LineWord[] }[])
  */

  return (
    <LineContext.Provider value={{ fontSize, debug: DEBUG }}>
      <HStack
        w={width}
        aspectRatio={ArabicLineAspectRatio}
        flexDir={'row-reverse'}
        py={4}
        px={2}
        justifyContent={'space-between'}
        alignItems={'center'}
        borderWidth={DEBUG ? 2 : 0}
        pos={'relative'}
      >
        <Show when={DEBUG}>
          <Box pos={'absolute'} left={0} top={0} zIndex={5}>
            <Text>
              fontSize {fontSize}, width {width}
            </Text>
          </Box>
        </Show>
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

export const usePageLine = () => useContext(LineContext)
