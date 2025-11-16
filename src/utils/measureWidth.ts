type FontSizeProps = {
  text: string
  font?: string
  maxWidth: number
  gapCount: number
  context?: CanvasRenderingContext2D | null
  textP?: HTMLParagraphElement | null
}

export const findFontSize = ({
  text,
  maxWidth,
  font = 'font-arabic',
  context,
}: FontSizeProps) => {
  if (!context) {
    const canvas = document.createElement('canvas')
    context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas context could not be created.')
  }

  const deltaLimit = Math.max(-20, -0.05 * maxWidth)
  let minFontSize = 1
  let maxFontSize = 180
  let fontSize = 24
  let width = 0

  while (minFontSize <= maxFontSize) {
    fontSize = Math.floor((minFontSize + maxFontSize) / 2)
    context.font = `${fontSize}px ${font}`
    width = context.measureText(text).width

    if (width > maxWidth) {
      maxFontSize = fontSize - 1
    } else if (width >= maxWidth + deltaLimit) {
      break
    } else {
      minFontSize = fontSize + 1
    }
  }

  context.clearRect(0, 0, 500, 500)
  context.fillText(text, 10, 100)

  return { fontSize, width }
}

// Singleton DOM element for measurements (performance optimization)
let _measureElement: HTMLParagraphElement | null = null

const getMeasureElement = () => {
  if (!_measureElement) {
    _measureElement = document.createElement('p')
    _measureElement.style.whiteSpace = 'nowrap'
    _measureElement.style.position = 'absolute'
    _measureElement.style.visibility = 'hidden'
    _measureElement.style.top = '-9999px' // Off-screen
    _measureElement.style.fontFamily = 'var(--mc-fonts-arabic)'
    document.body.appendChild(_measureElement)
  }
  return _measureElement
}

// LRU Cache for font size calculations (performance optimization)
const fontSizeCache = new Map<string, { fontSize: number; width: number }>()
const MAX_CACHE_SIZE = 500 // ~15 lines * 30 pages

export const getTextWidthFallback = (
  text: string,
  fontSize: number,
  p: HTMLParagraphElement,
) => {
  p.style.fontSize = `${fontSize}px`
  p.innerText = text
  return p.getBoundingClientRect().width
}

export const findFontSize2 = ({
  text,
  maxWidth,
  font = 'font-arabic',
  gapCount = 0,
}: Omit<FontSizeProps, 'textP'>) => {
  // Check cache first
  const cacheKey = `${text}-${maxWidth}-${gapCount}`
  const cached = fontSizeCache.get(cacheKey)
  if (cached) return cached

  // Use singleton element for measurements
  const textP = getMeasureElement()
  const targetWidth = maxWidth - gapCount * (maxWidth * 0.01)
  const deltaLimit = Math.max(-20, -0.05 * targetWidth)
  let minFontSize = 1
  let maxFontSize = 180
  let fontSize = 24
  let width = 0
  let bestFontSize = 0
  let bestWidth = 0

  while (minFontSize <= maxFontSize) {
    fontSize = Math.floor((minFontSize + maxFontSize) / 2)
    width = getTextWidthFallback(text, fontSize, textP)

    if (width > targetWidth) {
      maxFontSize = fontSize - 1
    } else if (width >= targetWidth + deltaLimit) {
      if (bestFontSize < fontSize) {
        bestFontSize = fontSize
        bestWidth = width
      }
      break
    } else {
      minFontSize = fontSize + 1
      if (bestFontSize < fontSize) {
        bestFontSize = fontSize
        bestWidth = width
      }
    }
  }

  const result = { fontSize: bestFontSize, width: bestWidth }

  // Add to cache with LRU eviction
  if (fontSizeCache.size >= MAX_CACHE_SIZE) {
    const firstKey = fontSizeCache.keys().next().value
    if (firstKey !== undefined) {
      fontSizeCache.delete(firstKey)
    }
  }
  fontSizeCache.set(cacheKey, result)

  return result
}
