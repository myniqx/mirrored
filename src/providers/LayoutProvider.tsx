"use client"
import React, { type PropsWithChildren, type ReactNode, createContext, useState } from "react"

import { Button } from "@/components/ui/button"
import common from "../constants/common.json"
import Navbar from "@/components/NavBar"
import { MdVisibility } from "react-icons/md"
import { useLocalStorage } from "@/hooks/useLocalStorage"

interface LayoutProviderProps {
  visibleHeader: boolean
  headerContent: ReactNode
  measures: MeasureProps
  showMeal: boolean
  twoPageView: boolean
  setVisibleHeader: (value: boolean) => void
  setHeaderContent: (value: ReactNode | null) => void
  toggleDarkTheme: () => void
  toggleSearch: () => void
  setShowMeal: (value: boolean) => void
  setTwoPageView: (value: boolean) => void
  searchText?: string
  setSearchID: (value: string) => void
  setMeasures: (value: MeasureProps) => void
  debug: false | string
  getParams: <T = string>(key: string, defaultValue?: T) => T | undefined
  getParamsAsArray: <T = string>(key: string) => T[]
  changeParams: (newParams: { [key: string]: any }) => void
  resetParams: () => void
}

export const LayoutContext = createContext<LayoutProviderProps>({} as LayoutProviderProps)

type ProviderProps = PropsWithChildren<{
  toggleDarkTheme?: () => void
}>

type MeasureProps = {
  width: number
  height: number
}

export const LayoutProvider: React.FC<ProviderProps> = ({ children, toggleDarkTheme = () => { } }) => {
  const [visibleHeader, setVisibleHeader] = useState(true)
  const [headerContent, setHeaderContent_] = useState<ReactNode>(<p>{common.appName}</p>)
  const [measures, setMeasures] = useState<MeasureProps>({
    width: 0,
    height: 0,
  })
  const [searchVisible, setSearchVisible] = useState(false)
  const [searchTexts, setSearchTexts] = useState<{ [key: string]: string }>({})
  const [searchID, setSearchID] = useState("")
  const [showMeal, setShowMeal] = useLocalStorage("showMeal", false)
  const [twoPageView, setTwoPageView] = useLocalStorage("twoPageView", false)
  const searchText = searchVisible ? (searchTexts[searchID] ?? "") : undefined
  const [params, setParams] = useState<{ [key: string]: any }>({})

  const changeParams = (newParams: { [key: string]: any }) => {
    setParams((prevParams) => ({
      ...prevParams,
      ...newParams,
    }))
  }
  const getParams = <T = string>(key: string, defaultValue?: T) => {
    return params[key] as T || defaultValue
  }

  const getParamsAsArray = <T = string>(key: string) => {
    const value = getParams(key)
    if (!value) return [] as T[]
    const array = Array.isArray(value) ? value : [value]
    return array as T[]
  }

  const resetParams = () => {
    setParams({})
  }

  const setHeaderContent = (value: ReactNode | null) => {
    setHeaderContent_(value ?? <p>{common.appName}</p>)
  }

  return (
    <LayoutContext.Provider
      value={{
        headerContent,
        visibleHeader,
        measures,
        showMeal,
        twoPageView,
        setMeasures,
        setHeaderContent,
        setVisibleHeader,
        toggleDarkTheme,
        toggleSearch: () => setSearchVisible(!searchVisible),
        setShowMeal,
        setTwoPageView,
        searchText,
        setSearchID,
        changeParams,
        getParams,
        getParamsAsArray,
        resetParams,
        debug: false // "p-1 bg-gray-800 text-white dark:bg-white/80 dark:text-black rounded-lg", 
      }}
    >
      <div className="flex flex-col flex-1 relative">
        {visibleHeader ? (
          <Navbar webName={""} pageTitle={""} />
        ) : (
          <Button variant="outline" onClick={() => setVisibleHeader(true)} className="absolute right-10 top-10 z-50">
            <MdVisibility />
          </Button>
        )}
        <div className="flex flex-1 grow mt-14">
          {children}
        </div>
      </div>
    </LayoutContext.Provider>
  )
}

export const useLayoutContext = () => React.useContext(LayoutContext)

