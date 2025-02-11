import { For, HStack, Text } from '@chakra-ui/react'
import { ArabicLineAspectRatio } from './types'

export const Besmele = ({ fontSize }: { fontSize: number }) => {
  const words = [
    'بِسْمِ',
    'اللَّهِ',
    'الرَّحْمَنِ',
    'الرَّحِيمِ',
  ];


  return (
    <HStack justifyContent={'space-between'} w={'100%'} px={'20%'} flexDir={'row-reverse'} aspectRatio={ArabicLineAspectRatio}>
      <For each={words}>
        {(word, index) => (
          <Text key={index} fontFamily={'arabic'} fontSize={fontSize} fontWeight={'bold'}>
            {word}
          </Text>
        )}
      </For>
    </HStack>
  )
}
