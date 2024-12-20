'use client'
import React, {
  PropsWithChildren,
  ReactNode,
  createContext,
  useState,
} from 'react'

import { Flex, IconButton, Input, Show, Text } from '@chakra-ui/react'
import common from '../constants/common.json'
import Navbar from '@/components/NavBar'
import { MdVisibility } from 'react-icons/md'

interface LayoutProviderProps {
  visibleHeader: boolean
  headerContent: ReactNode
  measures: MeasureProps
  setVisibleHeader: (value: boolean) => void
  setHeaderContent: (value: ReactNode | null) => void
  toggleDarkTheme: () => void
  toggleSearch: () => void
  searchText?: string
  setSearchID: (value: string) => void
  setMeasures: (value: MeasureProps) => void
}

export const LayoutContext = createContext<LayoutProviderProps>(
  {} as LayoutProviderProps,
)

type ProviderProps = PropsWithChildren<{
  toggleDarkTheme?: () => void
}>

type MeasureProps = {
  width: number
  height: number
}


export const LayoutProvider: React.FC<ProviderProps> = ({
  children,
  toggleDarkTheme = () => { },
}) => {
  const [visibleHeader, setVisibleHeader] = useState(true)
  const [headerContent, setHeaderContent_] = useState<ReactNode>(
    <Text>{common.appName}</Text>,
  )
  const [measures, setMeasures] = useState<MeasureProps>({ width: 0, height: 0 })
  const [searchVisible, setSearchVisible] = useState(false)
  const [searchTexts, setSearchTexts] = useState<{ [key: string]: string }>({})
  const [searchID, setSearchID] = useState('')
  const searchText = searchVisible ? (searchTexts[searchID] ?? '') : undefined

  const setHeaderContent = (value: ReactNode | null) => {
    setHeaderContent_(value ?? <Text>{common.appName}</Text>)
  }

  // const theme = useTheme()

  return (
    <LayoutContext.Provider
      value={{
        headerContent,
        visibleHeader,
        measures,
        setMeasures,
        setHeaderContent,
        setVisibleHeader,
        toggleDarkTheme,
        toggleSearch: () => setSearchVisible(!searchVisible),
        searchText,
        setSearchID,
      }}
    >
      <Flex flexDir={'column'} flex={1} position={'relative'}>
        <Show
          when={visibleHeader}
          fallback={
            <IconButton
              variant="outline"
              onClick={() => setVisibleHeader(true)}
              position={'absolute'}
              right={10}
              top={10}
              zIndex={44}
            >
              <MdVisibility />
            </IconButton>
          }
        >
          <Navbar webName={''} pageTitle={''} />
        </Show>
        <Flex flex={1} flexGrow={1} mt={visibleHeader ? 14 : 0}>
          {children}
        </Flex>
      </Flex>
    </LayoutContext.Provider>
  )
}

export const useLayoutContext = () => React.useContext(LayoutContext)
