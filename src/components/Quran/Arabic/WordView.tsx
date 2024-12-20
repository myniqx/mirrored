import { Show, VStack, Text, Heading } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { usePageLine } from './PageLine'
import { useQuranContext } from '@/providers/QuranProvider'

export type WordViewProps = {
  surah: number
  ayah: number
  wordIndex: number
  word: string
}

export const WordView: React.FC<WordViewProps> = ({
  surah,
  ayah,
  wordIndex,
  word,
}) => {
  const [visible, setVisible] = React.useState(false)
  const { getTurkish } = useQuranContext()
  const { fontSize } = usePageLine()
  const ref = React.useRef<HTMLParagraphElement>(null)

  const turks = getTurkish(surah, ayah)[wordIndex]
  const [width, setWidth] = React.useState(0)

  useEffect(() => {
    if (!ref?.current) return
    const observer = new ResizeObserver(([entry]) => {
      const { width } = entry.contentRect
      setWidth((prev) => width ?? prev)
    })

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [ref])

  return (
    <VStack alignItems={'center'} position={'relative'}>
      <Text
        ref={ref}
        fontFamily={'arabic'}
        fontSize={fontSize}
        userSelect={'none'}
        cursor={'pointer'}
        textAlign={'center'}
        onClick={() => setVisible(!visible)}
      >
        {word}
      </Text>

      <Show when={visible && turks}>
        <Text
          position={'absolute'}
          bottom={-5}
          fontFamily={'arabic'}
          fontSize={fontSize / 2}
          userSelect={'none'}
          cursor={'pointer'}
          textAlign={'center'}
          maxWidth={width}
          zIndex={100}
          color={'yellow.200'}
          textShadow={'0 0 5px red'}
          overflow={'visible'}
          lineClamp={1}
          textWrap={'nowrap'}
          onClick={() => setVisible(false)}
        >
          {turks}
        </Text>
      </Show>
    </VStack>
  )
}
