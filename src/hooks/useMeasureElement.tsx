'use client'

import type React from 'react'
import { useRef, useState, useEffect } from 'react'

type UseMeasureElementProps = {
  inside?: boolean
}

const useMeasureElement = <T extends HTMLElement = HTMLElement>({
  inside = false,
}: UseMeasureElementProps = {}): [
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

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new ResizeObserver(() => {
      const rect = element.getBoundingClientRect()
      const styles = getComputedStyle(element)

      const paddingLeft = inside
        ? parseFloat(styles.paddingLeft) + parseFloat(styles.borderLeftWidth)
        : 0
      const paddingRight = inside
        ? parseFloat(styles.paddingRight) + parseFloat(styles.borderRightWidth)
        : 0
      const paddingTop = inside
        ? parseFloat(styles.paddingTop) + parseFloat(styles.borderTopWidth)
        : 0
      const paddingBottom = inside
        ? parseFloat(styles.paddingBottom) +
          parseFloat(styles.borderBottomWidth)
        : 0

      setMeasurements({
        width: rect.width - paddingLeft - paddingRight,
        height: rect.height - paddingTop - paddingBottom,
        top: rect.top + paddingTop,
        left: rect.left + paddingLeft,
        right: rect.right - paddingRight,
        bottom: rect.bottom - paddingBottom,
      })
    })

    observer.observe(element)

    return () => observer.disconnect()
  }, [inside])

  return [ref, measurements]
}

export default useMeasureElement
