/**
 * Meal Conversion Utilities
 * Converts HTML to Markdown with special formatting for religious terms
 */

// Allah'ın isimleri (99 isim + genel kullanımlar)
const ALLAH_NAMES = [
  'Allah',
  'Rahman',
  'Rahim',
  'Rabb',
  'Malik',
  'Kuddüs',
  'Selam',
  "Mü'min",
  'Müheymin',
  'Aziz',
  'Cebbar',
  'Mütekebbir',
  'Halik',
  'Bari',
  'Musavvir',
  'Gaffar',
  'Kahhar',
  'Vehhab',
  'Rezzak',
  'Fettah',
  'Alim',
  'Kabız',
  'Basıt',
  'Hafız',
  'Rafi',
  "Mu'izz",
  'Müzill',
  'Semi',
  'Basir',
  'Hakem',
  'Adl',
  'Latif',
  'Habir',
  'Halim',
  'Azim',
  'Gafur',
  'Şekur',
  'Ali',
  'Kebir',
  'Hafiz',
  'Mukît',
  'Hasib',
  'Celil',
  'Kerim',
  'Rakib',
  'Mucib',
  'Vasi',
  'Hakim',
  'Vedud',
  'Mecid',
  'Bais',
  'Şehid',
  'Hakk',
  'Vekil',
  'Kaviyy',
  'Metin',
  'Veliyy',
  'Hamid',
  'Muhsi',
  'Mubdi',
  'Muid',
  'Muhyi',
  'Mumit',
  'Hayy',
  'Kayyum',
  'Vacid',
  'Macid',
  'Vahid',
  'Ehad',
  'Samed',
  'Kadir',
  'Muktedir',
  'Mukaddim',
  'Muahhir',
  'Evvel',
  'Ahir',
  'Zahir',
  'Batın',
  'Vali',
  'Müteali',
  'Berr',
  'Tevvab',
  'Müntakim',
  'Afüvv',
  'Rauf',
  "Malikü'l-Mülk",
  "Zü'l-Celali ve'l-İkram",
  'Muksıt',
  'Cami',
  'Ganiyy',
  'Muğni',
  'Mani',
  'Darr',
  'Nafi',
  'Nur',
  'Hadi',
  'Bedi',
  'Baki',
  'Varis',
  'Reşid',
  'Sabur',
]

// Peygamber isimleri ve unvanlar
const PROPHET_NAMES = [
  'Muhammed',
  'Peygamber',
  'Resul',
  'Resulullah',
  'Nebi',
  'Hz. Muhammed',
  'Mustafa',
  'Ahmed',
  'Habibullah',
  'Rasulullah',
  'Adem',
  'Nuh',
  'İbrahim',
  'Musa',
  'İsa',
  'Davud',
  'Süleyman',
  'Yunus',
  'Yusuf',
  'Eyyub',
  'Yakub',
  'İshak',
  'İsmail',
  'Harun',
  'Zekeriya',
  'Yahya',
  'Eliyasa',
  'Elyesa',
  'Şuayb',
  'Salih',
  'Hud',
  'Lut',
  'İdris',
  'Zülkifl',
  'Lokman',
]

/**
 * HTML to Markdown conversion
 */
export function htmlToMarkdown(html: string): string {
  if (!html) return ''

  return (
    html
      // Bold tags
      .replace(/<b>(.*?)<\/b>/gi, '**$1**')
      .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
      // Italic tags
      .replace(/<i>(.*?)<\/i>/gi, '*$1*')
      .replace(/<em>(.*?)<\/em>/gi, '*$1*')
      // Underline (markdown doesn't support, use bold)
      .replace(/<u>(.*?)<\/u>/gi, '__$1__')
      // Line breaks
      .replace(/<br\s*\/?>/gi, '\n')
      // Paragraphs
      .replace(/<p>(.*?)<\/p>/gi, '$1\n\n')
      // Remove other HTML tags
      .replace(/<[^>]+>/g, '')
      // Decode HTML entities
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
  )
}

/**
 * Converts FULL CAPS text to Title Case
 */
export function normalizeCase(text: string): string {
  if (!text) return ''

  // Check if text is mostly uppercase (more than 70% uppercase)
  const uppercaseCount = (text.match(/[A-ZÇĞİÖŞÜ]/g) || []).length
  const letterCount = (text.match(/[A-Za-zÇçĞğİıÖöŞşÜü]/g) || []).length

  if (letterCount === 0) return text
  if (uppercaseCount / letterCount < 0.7) return text // Not mostly uppercase

  // Convert to title case
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => {
      if (word.length === 0) return word
      // Keep all caps for short words like "O", "BİR"
      if (word.length <= 2 && word === word.toUpperCase()) {
        return word
      }
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

/**
 * Format Allah names (Red, Bold, Capitalize)
 * Returns markdown with custom syntax for red color: {{Allah}}
 */
export function formatAllahNames(text: string): string {
  if (!text) return ''

  let result = text

  ALLAH_NAMES.forEach((name) => {
    // Case-insensitive regex
    const regex = new RegExp(`\\b${name}\\b`, 'gi')
    result = result.replace(regex, (match) => {
      // Capitalize first letter
      const capitalized =
        match.charAt(0).toUpperCase() + match.slice(1).toLowerCase()
      // Use custom syntax for red color (will be handled in renderer)
      return `**{{${capitalized}}}**`
    })
  })

  return result
}

/**
 * Format Prophet names (Bold)
 */
export function formatProphetNames(text: string): string {
  if (!text) return ''

  let result = text

  PROPHET_NAMES.forEach((name) => {
    const regex = new RegExp(`\\b${name}\\b`, 'gi')
    result = result.replace(regex, (match) => {
      // Don't double-bold if already bolded
      if (result.includes(`**${match}**`)) return match
      return `**${match}**`
    })
  })

  return result
}

/**
 * Full conversion pipeline
 */
export function convertMealText(
  text: string,
  options: {
    htmlToMarkdown?: boolean
    normalizeCase?: boolean
    formatAllah?: boolean
    formatProphet?: boolean
  } = {},
): string {
  if (!text) return ''

  let result = text

  // Step 1: HTML to Markdown
  if (options.htmlToMarkdown !== false) {
    result = htmlToMarkdown(result)
  }

  // Step 2: Normalize case (if full caps)
  if (options.normalizeCase !== false) {
    result = normalizeCase(result)
  }

  // Step 3: Format Allah names
  if (options.formatAllah !== false) {
    result = formatAllahNames(result)
  }

  // Step 4: Format Prophet names
  if (options.formatProphet !== false) {
    result = formatProphetNames(result)
  }

  return result.trim()
}

/**
 * Convert entire verse (text + subtext)
 */
export type VerseData = {
  text: string
  subtext?: string | null
}

export function convertVerse(
  verse: VerseData,
  options?: Parameters<typeof convertMealText>[1],
): VerseData {
  return {
    text: convertMealText(verse.text, options),
    subtext: verse.subtext
      ? convertMealText(verse.subtext, options)
      : verse.subtext,
  }
}

/**
 * Preview: Check what would change
 */
export function previewConversion(text: string): {
  original: string
  converted: string
  changes: string[]
} {
  const converted = convertMealText(text)
  const changes: string[] = []

  if (htmlToMarkdown(text) !== text) {
    changes.push('HTML tags converted to Markdown')
  }

  if (normalizeCase(text) !== text) {
    changes.push('Case normalized (CAPS → Title Case)')
  }

  const allahCount = (converted.match(/\{\{.*?\}\}/g) || []).length
  if (allahCount > 0) {
    changes.push(`${allahCount} Allah name(s) formatted`)
  }

  const boldCount = (converted.match(/\*\*.*?\*\*/g) || []).length - allahCount
  if (boldCount > 0) {
    changes.push(`${boldCount} term(s) bolded`)
  }

  return {
    original: text,
    converted,
    changes,
  }
}
