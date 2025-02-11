import { HeaderAspectRatio } from './SurahHeader'

type LineHeader = {
  type: 'header'
  surah: number
}

type LineBesmele = {
  type: 'besmele'
  fontSize: number
}

type LineContent = {
  type: 'content'
  words: LineWord[]
  fontSize: number
}

export type LineDetails = LineHeader | LineBesmele | LineContent

type LineWordArabic = {
  isEnd: false
  surah: number
  ayah: number
  wordIndex: number
  word: string
}

type LineAyahEnding = {
  isEnd: true
  surah: number
  ayah: number
}

export type LineWord = LineWordArabic | LineAyahEnding

export type SinglePageViewProps = {
  page: number
}

export const HeaderAspectRatio = 604 / 98
export const ArabicLineAspectRatio = 604 / 51
