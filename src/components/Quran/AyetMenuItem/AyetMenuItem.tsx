import { AyahDetails } from '@/types/AyahDetails'
import {
  Badge,
  Card,
  Heading,
  HStack,
  Image,
  Show,
  Stack,
  Text,
  Highlight,
  Link,
} from '@chakra-ui/react'
import { AyetMenuItemProps } from './types'

export const AyetMenuItem: React.FC<AyetMenuItemProps> = ({
  page,
  isMakkah,
  name,
  ayahNumber,
  matchedString,
}) => {
  return (
    <Link href={`/arabic?page=${page}`}>
      <Card.Root size="sm" _hover={{ bg: 'gray.900', borderColor: 'gray.600' }}>
        <Card.Body flexDir={'row'} gap={4} alignItems={'center'}>
          <Image
            src={isMakkah ? './mekki.jpg' : './medeni.jpg'}
            rounded={'full'}
            boxSize={'50px'}
            alt="Mirrored Logo"
          />
          <Stack>
            <Heading size="md">
              <Show when={matchedString} fallback={name}>
                <Highlight
                  query={matchedString!}
                  styles={{ bg: 'yellow.300', color: 'black' }}
                >
                  {name}
                </Highlight>
              </Show>
            </Heading>
            <HStack wrap={'wrap'}>
              <Badge colorScheme={isMakkah ? 'green' : 'red'}>
                {isMakkah ? 'Mekki' : 'Medeni'}
              </Badge>
              <Badge colorScheme={'blue'}>Ayah: {ayahNumber}</Badge>
              <Badge colorScheme={'blue'}>Page: {page}</Badge>
            </HStack>
          </Stack>
        </Card.Body>
      </Card.Root>
    </Link>
  )
}
