import React, { FC } from 'react'
import { VerseEnd } from './VerseEnd'
import { WordView } from './WordView'
import { useQuranContext } from '@/providers/QuranProvider'
import { VStack } from '@chakra-ui/react'
import pageContent from '../../../constants/quran/pageContents.json'

type PageViewProps = {
  page: number
}

export const PageView: FC<PageViewProps> = ({ page }) => {
  const content = pageContent[page]
  const { getArabic } = useQuranContext()

  return (
    <VStack gap={4} alignItems="flex-end" maxWidth={780} padding={18}>
      {content.flatMap(([surah, ayah]) => {
        const verses = getArabic(surah, ayah)
        const verseViews = verses.map((v, i) => (
          <WordView
            key={`${surah}.${ayah}.${i}`}
            word={v}
            surah={surah}
            ayah={ayah}
            wordIndex={i}
          />
        ))

        return [
          ...verseViews,
          <VerseEnd key={surah} surah={surah} ayah={ayah} />,
        ]
      })}
    </VStack>
  )
}
