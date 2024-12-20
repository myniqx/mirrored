'use client'
import { SinglePageView } from '@/components/Quran/Arabic/SinglePageView'
import { useChangeParams } from '@/hooks/useChangeParam'
import { QuranProvider } from '@/providers/QuranProvider'

const ArabicPage = () => {
  const { getParams } = useChangeParams()
  const pageNumber = getParams('page', 0)

  return (
    <QuranProvider>
      <SinglePageView page={pageNumber} />
    </QuranProvider>
  )
}

export default ArabicPage
