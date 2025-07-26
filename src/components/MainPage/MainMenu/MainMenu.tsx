'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AyetMenuItem, type AyetMenuItemProps } from '../AyetMenuItem'
import { CuzMenuItem } from '../CuzMenuItem'
import { useChangeParams } from '@/hooks/useChangeParam'
import { findMatch, rebuildQuery } from '@/utils/FindMatch'
import ayahDetails from '@/constants/quran/surahDetails.json'
import type { AyahDetailsInArray } from '@/types/AyahDetails'
import { nuzulOrder } from '@/constants/quran/nuzulOrder'

const contentHeight = 'h-[70vh]'

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
    <div className="flex flex-col">
      <Tabs
        defaultValue={tab}
        onValueChange={(value) => changeParams({ tab: value })}
      >
        <TabsList className="w-full">
          <TabsTrigger value="byIndex">Mushaf Order</TabsTrigger>
          <TabsTrigger value="byNüzul">Revelation Order</TabsTrigger>
          <TabsTrigger value="byCuz">Juz</TabsTrigger>
        </TabsList>

        <TabsContent
          value="byIndex"
          className={`${contentHeight} overflow-y-scroll pr-2`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            {filteredDetails.map((item) => (
              <AyetMenuItem key={item.name} {...item} />
            ))}
          </div>
        </TabsContent>

        <TabsContent
          value="byNüzul"
          className={`${contentHeight} overflow-y-scroll pr-2`}
        >
          <div className="grid grid-cols-2 gap-4">
            {filteredDetails.map((item) => (
              <AyetMenuItem key={item.name} {...item} />
            ))}
          </div>
        </TabsContent>

        <TabsContent
          value="byCuz"
          className={`${contentHeight} overflow-y-scroll pr-2`}
        >
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
            {Array.from({ length: 30 }).map((_, index) => (
              <div key={index} className="break-inside-avoid mb-4">
                <CuzMenuItem cuz={index + 1} />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
