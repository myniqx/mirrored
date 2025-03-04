import { FC, useMemo } from "react"
import { LineWord } from "./types"
import { VerseEnd } from "./VerseEnd"
import { WordView } from "./WordView"
import { useQuranContext } from "@/providers/QuranProvider"

export type PartialAyahViewProps = {
  words: (LineWord | number)[],
  surah: number
  ayah: number
}

export const PartialAyahView: FC<PartialAyahViewProps> = ({
  words,
  surah,
  ayah,
}) => {

  const { getStyles, setHover } = useQuranContext()

  const styles = getStyles(surah, ayah)

  const hidden = words.some(w => w === 0)

  const content = useMemo(() => {
   return words.map((word, i) => {
      if (typeof word === "number") return <div key={i} style={{ width: `${word}px` }} />
      if (word.isEnd) return <VerseEnd key={i} surah={word.surah} ayah={word.ayah} />
      else return <WordView key={`${word.surah}.${word.ayah}.${word.wordIndex}`} {...word} />
    })
  }, [words])

  return (
    <div className={`flex flex-row-reverse items-center rounded-lg ${styles} ${hidden ? "h-1" : ""}`}
      onMouseEnter={() => setHover(surah, ayah, true)}
      onMouseLeave={() => setHover(surah, ayah, false)}
    >
      {content}
    </div>
  )


}
