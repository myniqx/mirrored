import { MatchResult } from '@/types/matchResult'

type LowerString = string

const getCharacter = (C: string) => {
  const c = C.toLowerCase()
  switch (c) {
    case 'ö':
      return 'o'
    case 'ç':
      return 'c'
    case 'ş':
      return 's'
    case 'ğ':
      return 'g'
    case 'ü':
    case 'û':
      return 'u'
    case 'ı':
      return 'i'
    case 'â':
      return 'a'
    default:
      return c
  }
}

export const rebuildQuery = (query: string | undefined) => {
  if (!query) return null
  return query.split('').map(getCharacter).join('')
}

const ignorableCharacter = (c: string) => {
  return c === "'" || c === '-'
}

export function findMatch(
  text: string,
  query: LowerString | null,
): string | null {
  if (!query) return null

  const len = text.length
  const queryLen = query.length
  for (let i = 0; i < len; i++) {
    const c = getCharacter(text[i])
    if (c !== query[0]) continue

    let ignorableCharacterCount = 0
    for (let j = i + 1; ; j++) {
      if (queryLen === j - i) return text.slice(i, j + ignorableCharacterCount)

      if (j >= len) break
      const c2 = getCharacter(text[j])
      const q2 = query[j - i - ignorableCharacterCount]
      if (c2 !== q2) {
        if (ignorableCharacter(c2)) {
          ignorableCharacterCount++
        } else {
          break
        }
      }
    }
  }

  return null
}
