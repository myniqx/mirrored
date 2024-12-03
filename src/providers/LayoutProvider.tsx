"use client"
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
  setVisibleHeader: (value: boolean) => void
  setHeaderContent: (value: ReactNode | null) => void
  toggleDarkTheme: () => void
  toggleSearch: () => void
  searchText?: string
  setSearchID: (value: string) => void
}

export const LayoutContext = createContext<LayoutProviderProps>(
  {} as LayoutProviderProps,
)

type ProviderProps = PropsWithChildren<{
  toggleDarkTheme?: () => void
}>

export const LayoutProvider: React.FC<ProviderProps> = ({
  children,
  toggleDarkTheme = () => { },
}) => {
  const [visibleHeader, setVisibleHeader] = useState(true)
  const [headerContent, setHeaderContent_] = useState<ReactNode>(
    <Text>{common.appName}</Text>,
  )
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
        setHeaderContent,
        setVisibleHeader,
        toggleDarkTheme,
        toggleSearch: () => setSearchVisible(!searchVisible),
        searchText,
        setSearchID,
      }}
    >
      <Flex
        flexDir={'column'}
        flex={1}
        position={'relative'}
      >
        <Show when={visibleHeader} fallback={
          <IconButton
            variant="outline"

            onClick={() => setVisibleHeader(true)}
            position={'absolute'}
            right={10}
            top={10}
            zIndex={44}
          >
            <MdVisibility />
          </IconButton>}>
          <Navbar webName={''} pageTitle={''} />

          <Show when={searchVisible}  >
            <Input
              // label="Search"
              value={searchText ?? ''}
              //   left={<Icon source="magnify" size={24} color={'black'} />}
              //  mode="outlined"

              placeholder="type some names"
              style={{
                margin: 6,
              }}
            />
          </Show>
        </Show>
        <Flex flex={1} flexGrow={1}>
          {children}
        </Flex>
      </Flex>
    </LayoutContext.Provider>
  )
}

export const useLayoutContext = () => React.useContext(LayoutContext)
