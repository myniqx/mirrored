'use client'

import { useQuranContext } from '@/providers/QuranProvider'
import type React from 'react'
import { useEffect, useState } from 'react'
import { usePageLine } from './ArabicLine'
import useMeasureElement from '@/hooks/useMeasureElement'

export type WordViewProps = {
  surah: number
  ayah: number
  wordIndex: number
  word: string
}

export const WordView: React.FC<WordViewProps> = ({
  surah,
  ayah,
  wordIndex,
  word,
}) => {
  const [visible, setVisible] = useState(false)
  const { getTurkish } = useQuranContext()
  const { fontSize, setWordWidth } = usePageLine()
  const [ref, { width }] = useMeasureElement<HTMLParagraphElement>()
  const turks = getTurkish(surah, ayah)[wordIndex]

  useEffect(() => {
    setWordWidth(surah, ayah, wordIndex, width)
  }, [width])

  return (
    <div className={`flex flex-col items-center relative`}>
      <p
        ref={ref}
        className="quran-text select-none cursor-pointer text-center"
        style={{ fontSize: `${fontSize}px` }}
        onClick={() => setVisible(!visible)}
        //    onMouseEnter={() => setHover(surah, ayah, true)}
        //    onMouseLeave={() => setHover(surah, ayah, false)}
      >
        {word}
      </p>

      {visible && turks && (
        <p
          className="absolute bottom-[-20px] font-arabic select-none cursor-pointer text-center text-yellow-200 text-shadow-red z-100 overflow-visible line-clamp-1 whitespace-nowrap"
          style={{
            fontSize: fontSize / 2,
            maxWidth: width,
            textShadow: '0 0 5px red',
          }}
          onClick={() => setVisible(false)}
        >
          {turks}
        </p>
      )}
    </div>
  )
}
