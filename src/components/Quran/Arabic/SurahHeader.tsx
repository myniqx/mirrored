import { Heading, Text, Image } from '@chakra-ui/react'
import { getSurahDetails } from '@/providers/QuranProvider'
import { HStack } from '@chakra-ui/react'
import { HeaderAspectRatio } from './types'

type SurahHeaderProps = {
  surah: number
}

export const SurahHeader: React.FC<SurahHeaderProps> = (props) => {
  const surah = getSurahDetails(props.surah)
  return (
    <HStack
      width="100%"
      aspectRatio={HeaderAspectRatio}
      borderWidth={1}
      borderColor={'gray.600'}
      alignItems="center"
      justifyContent="space-around"
      position={'relative'}
      boxShadow={'lg'}
    >
      <Image
        src={'./ornament-left.png'}
        left={0}
        top={0}
        bottom={0}
        height={'-webkit-fill-available'}
        alt="Mirrored Logo"
        position={'absolute'}
        _dark={{
          filter: 'invert(1)',
        }}
      />
      <Image
        src={'./ornament-right.png'}
        right={0}
        top={0}
        bottom={0}
        height={'-webkit-fill-available'}
        alt="Mirrored Logo"
        position={'absolute'}
        _dark={{ filter: 'invert(1)' }}

      />
      <Heading fontSize={24}>{surah.name}</Heading>
      <Heading fontSize={24}>{surah.totalAyahs} verses</Heading>
    </HStack>
  )
}
