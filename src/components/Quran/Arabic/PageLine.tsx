import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import { Stack, Text } from '@chakra-ui/react'

type PageLineProps = {
  isBasmala: boolean
  wordList?: ReactNode[]
  hasEnding?: boolean
}

const LineContext = createContext<{
  fontSize: number
}>({ fontSize: 36 })

export const PageLine: React.FC<PageLineProps> = ({
  isBasmala,
  hasEnding,
  wordList,
}) => {
  const [hasMeasured, setHasMeasured] = useState(false)
  const [measures, setMeasures] = useState<{
    totalWidth: number
    tempWidth: number
    fontSize: number
  }>({
    totalWidth: 0,
    tempWidth: 0,
    fontSize: 36,
  })
  const totalStackRef = useRef<HTMLDivElement>(null)
  const tempStackRef = useRef<HTMLDivElement>(null)

  const baseStyle = {
    display: 'flex',
    flexDirection: 'row-reverse',
    gap: measures.fontSize / 2,
    paddingHorizontal: 18,
    justifyContent: 'space-between',
    alignItems: 'center',
  }

  useEffect(() => {
    if (!measures.totalWidth || !measures.tempWidth) return
    setHasMeasured(false)
    setMeasures((prev) => ({
      ...prev,
      fontSize: prev.totalWidth / (prev.tempWidth / prev.fontSize),
    }))
  }, [measures.totalWidth])

  useEffect(() => {
    if (!measures.totalWidth || !measures.tempWidth || hasMeasured) return
    if (measures.totalWidth < measures.tempWidth) {
      setMeasures((prev) => ({ ...prev, fontSize: prev.fontSize - 1 }))
    } else if (measures.totalWidth * 0.9 > measures.tempWidth) {
      setMeasures((prev) => ({ ...prev, fontSize: prev.fontSize + 1 }))
    } else {
      setHasMeasured(true)
    }
  }, [measures.tempWidth, hasMeasured])

  useEffect(() => {
    if (!totalStackRef?.current) return
    const observer = new ResizeObserver(([entry]) => {
      const { width } = entry.contentRect
      setMeasures((prev) => ({ ...prev, totalWidth: width }))
    })

    observer.observe(totalStackRef.current)

    return () => observer.disconnect()
  }, [totalStackRef])

  useEffect(() => {
    if (!tempStackRef?.current) return
    const observer = new ResizeObserver(([entry]) => {
      const { width } = entry.contentRect
      setMeasures((prev) => ({ ...prev, totalWidth: width }))
    })

    observer.observe(tempStackRef.current)

    return () => observer.disconnect()
  }, [tempStackRef])

  console.log(measures, measures.totalWidth / measures.fontSize)

  if (isBasmala) return <Text>﷽</Text>

  return (
    <LineContext.Provider value={{ fontSize: measures.fontSize }}>
      <Text>{JSON.stringify({ measures, hasMeasured })}</Text>
      <Stack ref={totalStackRef} {...baseStyle}>
        {!hasMeasured && (
          <Stack
            {...baseStyle}
            justifyContent={'flex-start'}
            ref={tempStackRef}
          >
            {wordList}
          </Stack>
        )}
        {wordList}
      </Stack>
    </LineContext.Provider>
  )
}

export const usePageLine = () => useContext(LineContext)
