import {
  Box,
  Flex,
  Heading,
  Image,
  Input,
  InputElement,
  Stack,
} from '@chakra-ui/react'
import common from '../constants/common.json'
import { InputGroup } from '@chakra/input-group'
import { Field } from '@chakra/field'
import { MainMenu } from '@/components/MainPage/MainMenu'
import { useChangeParams } from '@/hooks/useChangeParam'
import { MainSearchBox } from '@/components/MainPage/MainSearchBox'

const Home = () => {
  return (
    <Stack w={'100vw'} h={'100vh'} overflowX={'hidden'}>
      <Flex w={'95%'} h={'100%'} mx={'auto'} position={'relative'}>
        <Box
          position={'absolute'}
          left={0}
          top={0}
          bottom={0}
          right={{ base: 0, lg: '50%' }}
        >
          <Image
            src={'/icon.png'}
            w={'100%'}
            h={'100%'}
            objectFit={'contain'}
            alt="Mirrored Logo"
          />
        </Box>

        <Stack
          position={'absolute'}
          left={{ base: 10, lg: '50%' }}
          top={10}
          bottom={10}
          right={10}
          gap={8}
          bg={'blackAlpha.700'}
        >
          <Heading fontSize={{ base: '4xl', md: '5xl' }} lineHeight={'0.9em'}>
            {common.appName}
          </Heading>
          <MainSearchBox />
          <MainMenu />
        </Stack>
      </Flex>
    </Stack>
  )
}

export default Home
