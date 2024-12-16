'use client'
import {
  Box,
  For,
  Heading,
  SimpleGrid,
  Stack,
  Tabs,
  Text,
} from '@chakra-ui/react'
import ayahDetails from '@/constants/quran/surahDetails.json'
import { AyetMenuItem, AyetMenuItemProps } from '../Quran/AyetMenuItem'
import { AyahDetailsInArray } from '@/types/AyahDetails'
import { nuzulOrder } from '@/constants/quran/nuzulOrder'
import { CuzMenuItem } from '../Quran/CuzMenuItem'
import { MasonryGrid } from '@chakra/masonry'
import { useChangeParams } from '@/hooks/useChangeParam'
import { findMatch, rebuildQuery } from '@/utils/FindMatch'

const contentHeight = '70vh'
export const MainMenu = () => {
  const { getParams, changeParams } = useChangeParams()
  const tab = getParams('tab', 'byIndex')
  const q = rebuildQuery(getParams('q'))

  const details = ayahDetails as AyahDetailsInArray[]
  const orderedDetails =
    tab === 'byIndex'
      ? details
      : nuzulOrder.map(
          (index) =>
            (ayahDetails as AyahDetailsInArray[])[
              index - 1
            ] as AyahDetailsInArray,
        )

  const mappedDetails = orderedDetails.map(
    ([index, page, isMakkah, name, ayahNumber]) =>
      ({
        index,
        page,
        isMakkah,
        name,
        ayahNumber,
        matchedString: findMatch(name, q),
      }) satisfies AyetMenuItemProps,
  )

  const filteredDetails = q
    ? mappedDetails.filter(({ matchedString }) => matchedString)
    : mappedDetails

  return (
    <Stack>
      <Tabs.Root
        defaultValue={tab}
        onValueChange={({ value: tab }) => {
          changeParams({ tab })
        }}
      >
        <Tabs.List>
          <Tabs.Trigger value={'byIndex'}>Mushaf Sırasıyla</Tabs.Trigger>
          <Tabs.Trigger value={'byNüzul'}>Nüzul Sırasıyla</Tabs.Trigger>
          <Tabs.Trigger value={'byCuz'}>Cüzler</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content
          value={'byIndex'}
          h={contentHeight}
          overflowY={'scroll'}
          pr={2}
        >
          <SimpleGrid columns={{ base: 1, md: 2, lg: 1, xl: 2 }} gap={4}>
            <For each={filteredDetails}>
              {(item) => <AyetMenuItem key={item.name} {...item} />}
            </For>
          </SimpleGrid>
        </Tabs.Content>
        <Tabs.Content
          value={'byNüzul'}
          h={contentHeight}
          pr={2}
          overflowY={'scroll'}
        >
          <SimpleGrid columns={2} gap={4}>
            <For each={filteredDetails}>
              {(item) => <AyetMenuItem key={item.name} {...item} />}
            </For>
          </SimpleGrid>
        </Tabs.Content>
        <Tabs.Content
          value={'byCuz'}
          h={contentHeight}
          pr={2}
          overflowY={'scroll'}
        >
          <MasonryGrid>
            <For each={Array.from({ length: 30 }) as number[]}>
              {(_, index) => <CuzMenuItem cuz={index + 1} key={index} />}
            </For>
          </MasonryGrid>
        </Tabs.Content>
      </Tabs.Root>
    </Stack>
  )
}
