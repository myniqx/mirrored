"use client"
import { type FC, useEffect, useState } from "react"
import type { SinglePageViewProps } from "../Arabic/types"
import { getSurahDetails, useQuranContext } from "@/providers/QuranProvider"
import { useChangeParams } from "@/hooks/useChangeParam"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import pageContent from "../../../constants/quran/pageContents.json"
import meals from "../../../constants/meal/meal.json"
import type { QuranData, Verse } from "./types"

export const SingleMealPage: FC<SinglePageViewProps> = ({ page }) => {
  const content = pageContent[page]
  const { setHover, getStyles, toggleSelected, mealSlug, setMealSlug } = useQuranContext()
  const selectedMeal = mealSlug ? meals.find((m) => m.slug === mealSlug) : undefined

  const [mealAyah, setMealAyah] = useState<(Verse & { surah: number; ayah: number })[]>([])

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMeal]) //Corrected dependencies

  return (
    <div className="flex flex-col gap-4 border w-full px-4 pb-12">
      <div className="flex w-full gap-4 justify-between items-center p-2">
        <p>Seçili Meal: {selectedMeal?.name}</p>
        <div className="w-1/2"></div>
        <Select value={mealSlug} onValueChange={(value) => setMealSlug(value)}>
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
        {mealAyah.map((verse, index) => {

          return (
            <Card
              key={index}
              className={`mb-2 ${getStyles(verse.surah, verse.ayah)}`}
              onMouseEnter={() => setHover(verse.surah, verse.ayah, true)}
              onMouseLeave={() => setHover(verse.surah, verse.ayah, false)}
              onClick={() => toggleSelected(verse.surah, verse.ayah)}
            >
              <CardHeader className="flex flex-row justify-between items-start p-4">
                {verse.ayah === 0 ? (
                  <h2 className="text-sm font-bold" >
                    {getSurahDetails(verse.surah).name}
                  </h2>
                ) : (
                  <>
                    <h3 className="text-sm font-medium" dangerouslySetInnerHTML={{ __html: verse?.text ?? "" }} />
                    <Badge>{verse.ayah}</Badge>
                  </>
                )}
              </CardHeader>
              {
                verse?.subtext && (
                  <CardContent className="text-muted-foreground pt-0">
                    <div className="w-full" dangerouslySetInnerHTML={{ __html: verse?.subtext ?? "" }} />
                  </CardContent>
                )
              }
            </Card>
          )
        })}
      </div>
    </div >
  )
}

