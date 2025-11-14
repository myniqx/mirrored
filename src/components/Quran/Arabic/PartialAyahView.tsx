import { FC, useMemo, memo, useCallback } from 'react'
import { LineWord } from './types'
import { VerseEnd } from './VerseEnd'
import { WordView } from './WordView'
import { useHoverStore } from '@/stores/hoverStore'
import { useVerseHoverState } from '@/hooks/useVerseHoverState'
import { useVerseSelectState } from '@/hooks/useVerseSelectState'
import { getQuranStyles } from '@/lib/quranStyles'

export type PartialAyahViewProps = {
  words: (LineWord | number)[]
  surah: number
  ayah: number
}

export const PartialAyahView: FC<PartialAyahViewProps> = memo(
  ({ words, surah, ayah }) => {
    // Event-based state: Only re-renders when THIS verse's state changes
    const setHover = useHoverStore((state) => state.setHover)
    const isHovered = useVerseHoverState(surah, ayah)
    const isSelected = useVerseSelectState(surah, ayah)

    const styles = useMemo(
      () => getQuranStyles(isHovered, isSelected),
      [isHovered, isSelected],
    )

    const hidden = words.some((w) => w === 0)

    const content = useMemo(() => {
      return words.map((word, i) => {
        if (typeof word === 'number')
          return (
            <div key={`space-${i}-${word}`} style={{ width: `${word}px` }} />
          )
        if (word.isEnd)
          return (
            <VerseEnd
              key={`${word.surah}.${word.ayah}`}
              surah={word.surah}
              ayah={word.ayah}
            />
          )
        else
          return (
            <WordView
              key={`${word.surah}.${word.ayah}.${word.wordIndex}`}
              {...word}
            />
          )
      })
    }, [words])

    const handleMouseEnter = useCallback(
      () => setHover(surah, ayah, true),
      [surah, ayah, setHover],
    )
    const handleMouseLeave = useCallback(
      () => setHover(surah, ayah, false),
      [surah, ayah, setHover],
    )

    return (
      <div
        className={`flex flex-row-reverse items-center rounded-lg ${styles} ${hidden ? 'h-1' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {content}
      </div>
    )
  },
  (prevProps, nextProps) => {
    // Custom comparison: only re-render if words array reference changed
    return (
      prevProps.words === nextProps.words &&
      prevProps.surah === nextProps.surah &&
      prevProps.ayah === nextProps.ayah
    )
  },
)
