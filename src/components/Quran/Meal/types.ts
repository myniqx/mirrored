export interface Verse {
  text: string
  subtext: string
}

export interface Chapter {
  [key: string]: Verse
}

export interface QuranData {
  [key: string]: Chapter
}
