import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import ayahDetails from '@/constants/quran/surahDetails.json'
import type { AyahDetailsInArray } from '@/types/AyahDetails'
import { AyetMenuItem } from '../AyetMenuItem'

export const CuzMenuItem = ({ cuz }: { cuz: number }) => {
  const startingPage = cuz === 1 ? 0 : (cuz - 1) * 20 + 1
  const endingPage = cuz === 30 ? 604 : cuz * 20
  const details = (ayahDetails as AyahDetailsInArray[]).filter(
    ([, page]) => page >= startingPage && page <= endingPage,
  )

  return (
    <Card className="hover:bg-gray-800 transition-colors">
      <CardContent className="p-4">
        <Link href={`/arabic?page=${startingPage}`}>
          <div className="flex flex-col">
            <h3 className="text-lg font-medium">Cüz {cuz}</h3>
            <p className="text-sm text-muted-foreground">
              Sayfa: {startingPage} - {endingPage}
            </p>
          </div>
        </Link>
        {details.length > 0 && (
          <div className="flex flex-col gap-4 mt-4">
            {details.map(([index, page, isMakkah, name, ayahNumber]) => (
              <AyetMenuItem
                key={index}
                index={index}
                page={page}
                isMakkah={isMakkah}
                name={name}
                ayahNumber={ayahNumber}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
