'use client'
import { SinglePageView } from '@/components/Quran/Arabic/SingleArabicPage'
import { SingleMealPage } from '@/components/Quran/Meal/SingleMealPage'
import { useChangeParams } from '@/hooks/useChangeParam'
import { QuranProvider } from '@/providers/QuranProvider'
import { SimpleGrid } from '@chakra-ui/react'

const ArabicPage = () => {
  const { getParams } = useChangeParams()
  const pageNumber = getParams('page', 0)

  return (
    <QuranProvider>
      <SimpleGrid columns={2} gap={4} w={'100%'}>
        <SinglePageView page={pageNumber} />
        <SingleMealPage page={pageNumber} />
      </SimpleGrid>
    </QuranProvider>
  )
}

export default ArabicPage
