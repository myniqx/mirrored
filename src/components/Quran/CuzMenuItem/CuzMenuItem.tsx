import { Card, Stack, Heading, Text, For, Show, Link } from '@chakra-ui/react'

import ayahDetails from '@/constants/quran/surahDetails.json'
import { AyahDetailsInArray } from '@/types/AyahDetails'
import { AyetMenuItem } from '../AyetMenuItem'

export const CuzMenuItem = ({ cuz }: { cuz: number }) => {
  const startingPage = cuz === 1 ? 0 : (cuz - 1) * 20 + 1
  const endingPage = cuz === 30 ? 604 : cuz * 20
  const details = (ayahDetails as AyahDetailsInArray[]).filter(
    ([, page]) => page >= startingPage && page <= endingPage,
  )

  return (
    <Card.Root size="sm" _hover={{ bg: 'gray.800' }}>
      <Card.Body>
        <Link href={`/arabic?page=${startingPage}`}>
          <Stack>
            <Heading size="md">Cüz {cuz}</Heading>
            <Text>
              Sayfa: {startingPage} - {endingPage}
            </Text>
          </Stack>
        </Link>
        <Show when={details.length > 0}>
          <Stack gap={4} mt={4}>
            <For each={details}>
              {([index, page, isMakkah, name, ayahNumber]) => (
                <AyetMenuItem
                  index={index}
                  page={page}
                  isMakkah={isMakkah}
                  name={name}
                  ayahNumber={ayahNumber}
                  key={index}
                />
              )}
            </For>
          </Stack>
        </Show>
      </Card.Body>
    </Card.Root>
  )
}
