import pageContents from '../constants/quran/pageContents.json'
import { getSurahDetails } from '@/providers/QuranProvider'

/**
 * Get page information (surah, juz) for a given page number
 */
export const getPageInfo = (page: number) => {
  if (page < 0 || page >= pageContents.length) {
    return { surah: 1, ayah: 1, surahName: 'Fatiha', juz: 1 }
  }

  const content = pageContents[page]
  if (!content || content.length === 0) {
    return { surah: 1, ayah: 1, surahName: 'Fatiha', juz: 1 }
  }

  // Get first ayah on the page (skip surah header if present)
  const firstVerse = content.find((item) => item[1] !== 0) || content[0]
  const [surah, ayah] = firstVerse

  const surahDetails = getSurahDetails(surah)
  const juz = Math.ceil(Math.min(surahDetails.page, 600) / 20)

  return {
    surah,
    ayah,
    surahName: surahDetails.name,
    juz,
  }
}
