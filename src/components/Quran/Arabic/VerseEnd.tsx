import { getArabicNumberWithShape } from '@/utils/arabicNumber'
import { Stack, Text } from '@chakra-ui/react'
import { usePageLine } from './ArabicLine'
import { useQuranContext } from '@/providers/QuranProvider'

type VerseEndProps = {
  surah: number
  ayah: number
}

export const VerseEnd: React.FC<VerseEndProps> = ({ surah, ayah }) => {
  const { fontSize } = usePageLine()
  const { isHovered, isSelected, toggleSelected, setHover } =
    useQuranContext()

  return (
    <Stack
      position={'relative'}
      {...isHovered(surah, ayah)}
      {...isSelected(surah, ayah)}
      onMouseEnter={() => setHover(surah, ayah, true)}
      onMouseLeave={() => setHover(surah, ayah, false)}
      onClick={() => toggleSelected(surah, ayah)}
    >
      <Text
        fontFamily={'font-arabic'}
        fontSize={fontSize * (3 / 4)}
        userSelect={'none'}
        color={'yellow.400'}
        cursor={'pointer'}
        lineClamp={1}
      >
        {getArabicNumberWithShape(ayah)}
      </Text>
      <Text
        lineClamp={1}
        position={'absolute'}
        bottom={-5}
        left={'40%'}
        textAlign={'center'}
        color={'red'}
      >
        {ayah}
      </Text>
    </Stack>
  )
}
