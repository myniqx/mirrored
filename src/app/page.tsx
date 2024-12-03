
import { LayoutProvider } from "@/providers/LayoutProvider"
import { Code, Image, SimpleGrid, Stack } from "@chakra-ui/react"



const Home = () => {

  const data = {}

  return (
    <Stack w={'100vw'} h={'100vh'}>
      <SimpleGrid columns={2} w={'95%'} h={'100%'} mx={'auto'} alignItems={'center'}>
        <Image src={'/icon.png'} w={'100%'} h={'100%'} alt="Mirrored Logo" />

        <Stack >
          LoL
        </Stack>
      </SimpleGrid>
    </Stack>
  )
}


export default Home

