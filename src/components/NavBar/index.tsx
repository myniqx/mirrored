import { useLayoutContext } from '@/providers/LayoutProvider'
import {
  Box,
  Flex,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Image,
  SimpleGrid,
} from '@chakra-ui/react'
import { FaMoon } from 'react-icons/fa6'
import { IoMdEyeOff } from 'react-icons/io'
import { MdArrowBack, MdMobileFriendly, MdSearch } from 'react-icons/md'

interface NavbarProps {
  webName: string
  pageTitle: string
  onBackClick?: () => void
  icon1?: React.ReactElement
  icon2?: React.ReactElement
}

const Navbar: React.FC<NavbarProps> = () => {
  const { setVisibleHeader, headerContent, toggleDarkTheme, toggleSearch } =
    useLayoutContext()

  return (
    <HStack
      //   bg={useColorModeValue('gray.100', 'gray.900')}
      py={4}
      px={6}
      position={'absolute'}
      left={0}
      right={0}
      top={0}
      h={14}
      bg="gray.700"
      boxShadow="md"
    >
      <Flex align="center" flexGrow={0} flexShrink={1}>
        <Image w={8} h={8} alt="Mirrored Logo" src={'/icon.png'} />
        <IconButton
          variant="ghost"
        >
          <MdArrowBack />
        </IconButton>
      </Flex>

      <Box flexGrow={1} flex={1} alignItems="center">
        {headerContent}
      </Box>


      <HStack justify="space-between" align="center">
        <IconButton variant="ghost" onClick={toggleSearch}>
          <MdSearch />
        </IconButton>
        <IconButton variant="ghost" onClick={toggleDarkTheme}>
          <FaMoon />
        </IconButton>
        <IconButton variant="ghost" onClick={() => setVisibleHeader(false)}>
          <IoMdEyeOff />
        </IconButton>
        <IconButton variant="ghost">
          <MdMobileFriendly />
        </IconButton>
      </HStack>

    </HStack>
  )
}

export default Navbar
