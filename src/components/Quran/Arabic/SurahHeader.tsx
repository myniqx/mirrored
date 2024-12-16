import { Text } from '@chakra-ui/react'
import { getSurahDetails } from '@/providers/QuranProvider'
import { HStack } from '@chakra-ui/react'

type SurahHeaderProps = {
  surah: number
}

export const SurahHeader: React.FC<SurahHeaderProps> = (props) => {
  const surah = getSurahDetails(props.surah)
  const bracketSize = 64
  return (
    <HStack
      width="100%"
      aspectRatio={604 / 112}
      borderWidth={1}
      borderColor={'gray.600'}
      alignItems="center"
      justifyContent="space-around"
    >
      <Text fontSize={bracketSize} fontFamily="font-arabic">
        ﷌
      </Text>
      <Text fontSize={24}>{surah.name}</Text>
      <Text fontSize={24}>{surah.totalAyahs} verses</Text>
      <Text
        fontSize={bracketSize}
        fontFamily="font-arabic"
        transform={'scaleX(-1)'}
      >
        ﷌
      </Text>
    </HStack>
  )
}
