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

const getTextP = () => {
  const span = document.createElement('p')
  span.style.whiteSpace = 'nowrap'
  span.style.position = 'absolute'
  span.style.visibility = 'hidden'
  span.style.fontFamily = 'var(--mc-fonts-arabic)'
  document.body.appendChild(span)
  return span
}

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
  textP,
  gapCount = 0,
}: FontSizeProps) => {
  if (!textP) {
    textP = getTextP()
  }
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

  return { fontSize: bestFontSize, width: bestWidth }
}
