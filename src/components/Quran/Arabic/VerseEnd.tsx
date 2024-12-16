import { Stack, Text } from '@chakra-ui/react'
import { usePageLine } from './PageLine'
import { getArabicNumber, getArabicNumberWithShape } from '@/utils/arabicNumber'

type VerseEndProps = {
  surah: number
  ayah: number
}

export const VerseEnd: React.FC<VerseEndProps> = ({ surah, ayah }) => {
  const { fontSize } = usePageLine()

  return (
    <Stack position={'relative'}>
      <Text
        fontFamily={'font-arabic'}
        fontSize={fontSize}
        userSelect={'none'}
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
