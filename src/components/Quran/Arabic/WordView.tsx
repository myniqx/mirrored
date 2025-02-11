import { useQuranContext } from '@/providers/QuranProvider'
import { Show, Text, VStack } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { usePageLine } from './ArabicLine'
import useMeasureElement from '@/hooks/useMeasureElement'

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
  const { getTurkish, setHover, isHovered } = useQuranContext()
  const { fontSize } = usePageLine()
  const [ref, { width }] = useMeasureElement<HTMLParagraphElement>()
  const turks = getTurkish(surah, ayah)[wordIndex]
  const hover = isHovered(surah, ayah)

  return (
    <VStack alignItems={'center'} position={'relative'} {...hover}>
      <Text
        ref={ref}
        fontFamily={'arabic'}
        fontSize={fontSize}
        userSelect={'none'}
        cursor={'pointer'}
        textAlign={'center'}
        onClick={() => setVisible(!visible)}
        onMouseEnter={() => setHover(surah, ayah, true)}
        onMouseLeave={() => setHover(surah, ayah, false)}
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
