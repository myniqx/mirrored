'use client'
import { SinglePageView } from '@/components/Quran/Arabic/SingleArabicPage'
import { SingleMealPage } from '@/components/Quran/Meal/SingleMealPage'
import { useChangeParams } from '@/hooks/useChangeParam'
import { QuranProvider } from '@/providers/QuranProvider'
import { useLayoutContext } from '@/providers/LayoutProvider'

const ArabicPage = () => {
  const { getParams } = useChangeParams()
  const { showMeal, twoPageView } = useLayoutContext()
  const pageNumber = getParams('page', 0)

  return (
    <QuranProvider>
      <div
        className={`grid ${twoPageView || showMeal ? 'grid-cols-2' : 'grid-cols-1'} gap-4 w-screen mt-12 p-4`}
      >
        <SinglePageView page={pageNumber} />
        {showMeal && <SingleMealPage page={pageNumber} />}
        {twoPageView && <SinglePageView page={pageNumber + 1} />}
      </div>
    </QuranProvider>
  )
}

export default ArabicPage
