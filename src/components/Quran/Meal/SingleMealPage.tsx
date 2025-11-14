'use client'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getSurahDetails, useQuranContext } from '@/providers/QuranProvider'
import { type FC, useEffect, useMemo, useState, useCallback, memo } from 'react'
import type { SinglePageViewProps } from '../Arabic/types'
import { useHoverStore } from '@/stores/hoverStore'
import { useSelectStore, useIsSelected } from '@/stores/selectStore'
import { useIsHovered } from '@/stores/hoverStore'
import { getQuranStyles } from '@/lib/quranStyles'

import meals from '../../../constants/meal/meal.json'
import pageContent from '../../../constants/quran/pageContents.json'
import type { QuranData, Verse } from './types'

// Memoized verse card component for better performance
const MealVerseCard = memo(
  ({
    verse,
    index,
  }: {
    verse: Verse & { surah: number; ayah: number }
    index: number
  }) => {
    const setHover = useHoverStore((state) => state.setHover)
    const toggleSelected = useSelectStore((state) => state.toggleSelected)
    const isHovered = useIsHovered(verse.surah, verse.ayah)
    const isSelected = useIsSelected(verse.surah, verse.ayah)

    const styles = useMemo(
      () => getQuranStyles(isHovered, isSelected),
      [isHovered, isSelected],
    )

    const handleMouseEnter = useCallback(
      () => setHover(verse.surah, verse.ayah, true),
      [verse.surah, verse.ayah, setHover],
    )

    const handleMouseLeave = useCallback(
      () => setHover(verse.surah, verse.ayah, false),
      [verse.surah, verse.ayah, setHover],
    )

    const handleClick = useCallback(
      () => toggleSelected(verse.surah, verse.ayah),
      [verse.surah, verse.ayah, toggleSelected],
    )

    return (
      <Card
        key={index}
        className={`mb-2 ${styles}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <CardHeader className="flex flex-row justify-between items-start p-4">
          {verse.ayah === 0 ? (
            <h2 className="text-sm font-bold">
              {getSurahDetails(verse.surah).name}
            </h2>
          ) : (
            <>
              <h3
                className="text-sm font-medium"
                dangerouslySetInnerHTML={{ __html: verse?.text ?? '' }}
              />
              <Badge>{verse.ayah}</Badge>
            </>
          )}
        </CardHeader>
        {verse?.subtext && (
          <CardContent className="text-muted-foreground pt-0">
            <div
              className="w-full"
              dangerouslySetInnerHTML={{ __html: verse?.subtext ?? '' }}
            />
          </CardContent>
        )}
      </Card>
    )
  },
)

MealVerseCard.displayName = 'MealVerseCard'

export const SingleMealPage: FC<SinglePageViewProps> = ({ page }) => {
  const content = useMemo(() => pageContent[page], [page])
  const { mealSlug, setMealSlug } = useQuranContext()
  const selectedMeal = useMemo(
    () => (mealSlug ? meals.find((m) => m.slug === mealSlug) : meals[0]),
    [mealSlug],
  )
  const [mealAyah, setMealAyah] = useState<
    (Verse & { surah: number; ayah: number })[]
  >([])

  useEffect(() => {
    if (!selectedMeal) return

    import(`../../../constants/meal/${selectedMeal.id}.json`).then((module) => {
      const mealData = module.default as QuranData
      const verseList = []

      for (const [surah, ayah] of content) {
        const ayahData = mealData[surah.toString()][ayah.toString()]
        verseList.push({ ...ayahData, surah, ayah })
      }

      setMealAyah(verseList)
    })
  }, [selectedMeal, content])

  return (
    <div className="flex flex-col gap-4 border w-full px-4 pb-12">
      <div className="flex w-full gap-4 justify-between items-center p-2">
        <p>Seçili Meal: {selectedMeal?.name}</p>
        <div className="w-1/2"></div>
        <Select
          value={selectedMeal?.slug || mealSlug}
          onValueChange={(value) => setMealSlug(value)}
        >
          <SelectTrigger className="w-[320px]">
            <SelectValue placeholder="Bir meal seçin" />
          </SelectTrigger>
          <SelectContent>
            {meals.map((meal) => (
              <SelectItem key={meal.slug} value={meal.slug}>
                {meal.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col">
        {mealAyah.map((verse, index) => (
          <MealVerseCard key={index} verse={verse} index={index} />
        ))}
      </div>
    </div>
  )
}
