import type React from 'react'
import { getArabicNumberWithShape } from '@/utils/arabicNumber'
import { usePageLine } from './ArabicLine'
import useMeasureElement from '@/hooks/useMeasureElement'
import { useEffect, memo, useCallback, useMemo } from 'react'
import { useSelectStore } from '@/stores/selectStore'
import { useVerseHoverState } from '@/hooks/useVerseHoverState'
import { useVerseSelectState } from '@/hooks/useVerseSelectState'
import { getQuranStyles } from '@/lib/quranStyles'

type VerseEndProps = {
  surah: number
  ayah: number
}

export const VerseEnd: React.FC<VerseEndProps> = memo(
  ({ surah, ayah }) => {
    const { fontSize, setWordWidth } = usePageLine()
    const toggleSelected = useSelectStore((state) => state.toggleSelected)
    const isHovered = useVerseHoverState(surah, ayah)
    const isSelected = useVerseSelectState(surah, ayah)
    const [ref, { width }] = useMeasureElement<HTMLDivElement>()

    const styles = useMemo(
      () => getQuranStyles(isHovered, isSelected),
      [isHovered, isSelected],
    )

    useEffect(() => {
      setWordWidth(surah, ayah, -1, width)
    }, [width, surah, ayah, setWordWidth])

    const handleClick = useCallback(
      () => toggleSelected(surah, ayah),
      [surah, ayah, toggleSelected],
    )

    return (
      <div
        className={`relative flex flex-col flex-shrink-0 ${styles} `}
        onClick={handleClick}
      >
        <p
          ref={ref}
          className="quran-text text-yellow-400 select-none cursor-pointer line-clamp-1"
          style={{ fontSize: fontSize * (3 / 4) }}
        >
          {getArabicNumberWithShape(ayah)}
        </p>
        <p className="line-clamp-1 absolute bottom-[-20px] left-[40%] text-center text-red-500">
          {ayah}
        </p>
      </div>
    )
  },
  (prevProps, nextProps) => {
    // Only re-render if surah or ayah changed
    return (
      prevProps.surah === nextProps.surah && prevProps.ayah === nextProps.ayah
    )
  },
)
