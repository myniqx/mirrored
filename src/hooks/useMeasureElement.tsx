import { useRef, useState, useEffect } from 'react'

type useMeasureElementProps = {
  p?: number
  px?: number
  py?: number
  pl?: number
  pr?: number
  pt?: number
  pb?: number
  name?: string
}

const useMeasureElement = <T extends HTMLElement = HTMLElement>(
  props?: useMeasureElementProps,
): [
    React.RefObject<T>,
    {
      width: number
      height: number
      top: number
      left: number
      right: number
      bottom: number
    },
  ] => {
  const ref = useRef<T>(null)
  const [measurements, setMeasurements] = useState({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  })
  const padding = {
    left: props?.pl || props?.px || props?.p || 0,
    right: props?.pr || props?.px || props?.p || 0,
    top: props?.pt || props?.py || props?.p || 0,
    bottom: props?.pb || props?.py || props?.p || 0,
  }

  useEffect(() => {
    if (!ref?.current) return

    const observer = new ResizeObserver(([entry]) => {
      const rect = entry.contentRect
      setMeasurements({
        width: rect.width - padding.left - padding.right,
        height: rect.height - padding.top - padding.bottom,
        top: rect.top + padding.top,
        left: rect.left + padding.left,
        right: rect.right - padding.right,
        bottom: rect.bottom - padding.bottom,
      })
    })

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref, padding.bottom, padding.left, padding.right, padding.top])

  return [ref, measurements]
}

export default useMeasureElement
