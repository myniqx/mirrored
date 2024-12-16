type LineHeader = {
  type: 'header'
  surah: number
}

type LineBesmele = {
  type: 'besmele'
}

type LineContent = {
  type: 'content'
  words: LineWord[]
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
