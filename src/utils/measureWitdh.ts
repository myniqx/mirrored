let canvas: HTMLCanvasElement | null = null
let context: CanvasRenderingContext2D | null = null

function measureTextWidth(text: string, font: string): number {
  if (!canvas) canvas = document.createElement('canvas')

  if (!context) {
    context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas context could not be created.')
  }

  context.font = font
  return context.measureText(text).width
}

const deltaLimit = 30
export const findFontSize = (text: string, font: string, maxWidth: number): number => {
  let fontSize = 24
  let width = measureTextWidth(text, `${fontSize}px ${font}`)
  let step = 1

  while (true) {
    const delta = width - maxWidth
    if (delta > 0) {
      fontSize -= step
    } else if (delta <= deltaLimit) {
      break
    } else {
      fontSize += step
    }

    width = measureTextWidth(text, `${fontSize}px ${font}`)
  }

  return fontSize
}
