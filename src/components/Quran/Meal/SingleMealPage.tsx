import { FC, useEffect, useMemo, useState } from 'react'
import { SinglePageViewProps } from '../Arabic/types'
import {
  createListCollection,
  For,
  Text,
  SelectRoot,
  Stack,
  VStack,
  HStack,
  Spacer,
  Card,
  Heading,
  Show,
  Box,
  Badge,
} from '@chakra-ui/react'
import { useQuranContext } from '@/providers/QuranProvider'
import { useLayoutContext } from '@/providers/LayoutProvider'

import pageContent from '../../../constants/quran/pageContents.json'
import meals from '../../../constants/meal/meal.json'
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValueText,
} from '@chakra/select'
import { useChangeParams } from '@/hooks/useChangeParam'
import { MealAyahContent, QuranData, Verse } from './types'

export const SingleMealPage: FC<SinglePageViewProps> = ({ page }) => {
  const content = pageContent[page]
  const { isHovered, setHover, isSelected, toggleSelected } = useQuranContext()
  const { getParams, changeParams } = useChangeParams()
  const mealSlug = getParams('meal')
  const selectedMeal = mealSlug
    ? meals.find((m) => m.slug === mealSlug)
    : undefined

  const mealCollection = createListCollection({
    items: meals.map((meal) => ({ label: meal.name, value: meal.slug })),
  })

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedMeal])

  return (
    <VStack gap={4} borderWidth={1} w={'100%'} px={4} pb={12}>
      <HStack w={'100%'} gap={4} justifyContent={'space-between'} p={2}>
        <Text>Seçili Meal: {selectedMeal?.name}</Text>
        <Spacer w={'50%'} />
        <SelectRoot
          size={'sm'}
          collection={mealCollection}
          w={320}
          value={mealSlug ? [mealSlug] : undefined}
          onValueChange={({ value }) => changeParams({ meal: value[0] })}
          variant={'subtle'}
        >
          <SelectLabel>Meali Değiştir:</SelectLabel>
          <SelectTrigger clearable>
            <SelectValueText placeholder="Bir meal seçin" />
          </SelectTrigger>
          <SelectContent>
            <For each={mealCollection.items}>
              {(meal) =>
                meal && (
                  <SelectItem item={meal} key={meal.value}>
                    {meal.label}
                  </SelectItem>
                )
              }
            </For>
          </SelectContent>
        </SelectRoot>
      </HStack>

      <Stack>
        <For each={mealAyah}>
          {(verse, index) => {
            return (
              <Card.Root
                size="sm"
                key={index}
                onMouseEnter={() => setHover(verse.surah, verse.ayah, true)}
                onMouseLeave={() => setHover(verse.surah, verse.ayah, false)}
                onClick={() => toggleSelected(verse.surah, verse.ayah)}
                {...isHovered(verse.surah, verse.ayah)}
                {...isSelected(verse.surah, verse.ayah)}
              >
                <Card.Header justifyContent={'space-between'} flexDir={'row'} alignItems={'top'}>
                  <Heading size="sm">{verse?.text ?? 'Verse'}</Heading>
                  <Badge>{verse.ayah}</Badge>
                </Card.Header>
                <Show when={verse?.subtext} fallback={<Box h={2} />}>
                  <Card.Body color="fg.muted">
                    <Box as='p'
                      w={'100%'}
                      dangerouslySetInnerHTML={{ __html: verse?.subtext ?? '' }}
                    />
                  </Card.Body>
                </Show>
              </Card.Root>
            )
          }}
        </For>
      </Stack>
    </VStack>
  )
}
