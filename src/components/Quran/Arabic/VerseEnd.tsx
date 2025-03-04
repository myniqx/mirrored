import type React from "react"
import { getArabicNumberWithShape } from "@/utils/arabicNumber"
import { usePageLine } from "./ArabicLine"
import { useQuranContext } from "@/providers/QuranProvider"
import useMeasureElement from "@/hooks/useMeasureElement"
import { useEffect } from "react"

type VerseEndProps = {
  surah: number
  ayah: number
}

export const VerseEnd: React.FC<VerseEndProps> = ({ surah, ayah }) => {
  const { fontSize, setWordWidth } = usePageLine()
  const { getStyles, toggleSelected, setHover } = useQuranContext()
  const [ref, { width }] = useMeasureElement<HTMLDivElement>()

  useEffect(() => {
    setWordWidth(surah, ayah, -1, width)
  }, [width])

  return (
    <div
      className={`relative flex flex-col flex-shrink-0 ${getStyles(surah, ayah)} `}
      onClick={() => toggleSelected(surah, ayah)}
    >
      <p
        ref={ref}
        className="quran-text text-yellow-400 select-none cursor-pointer line-clamp-1"
        style={{ fontSize: fontSize * (3 / 4) }}
      >
        {getArabicNumberWithShape(ayah)}
      </p>
      <p className="line-clamp-1 absolute bottom-[-20px] left-[40%] text-center text-red-500">{ayah}</p>
    </div>
  )
}

