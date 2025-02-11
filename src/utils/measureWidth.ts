export const findFontSize = (
  text: string,
  font: string,
  maxWidth: number,
): number => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas context could not be created.');

  const deltaLimit = Math.max(-20, -0.05 * maxWidth);
  let minFontSize = 1;
  let maxFontSize = 100;
  let fontSize = 24;

  while (minFontSize <= maxFontSize) {
    fontSize = Math.floor((minFontSize + maxFontSize) / 2);
    context.font = `${fontSize}px ${font}`;
    const width = context.measureText(text).width;

    if (width > maxWidth) {
      maxFontSize = fontSize - 1;
    } else if (width >= maxWidth + deltaLimit) {
      break;
    } else {
      minFontSize = fontSize + 1;
    }
  }

  return fontSize;
};
