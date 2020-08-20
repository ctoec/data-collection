/**
 * Add line breaks to a human readable string based on the maximum line
 * width provided, so that it overflows accordingly when rendered.
 */
export function wrapText(text: string, maxLineWidth: number): string {
  let newlyFormattedString: string = '';
  let currLineCount: number = 0;

  text.split(' ').forEach((word) => {
    if (currLineCount === 0 && word.length > maxLineWidth) {
      newlyFormattedString += `${word}\n`;
      currLineCount = 0;
    } else if (currLineCount + word.length > maxLineWidth) {
      newlyFormattedString += `\n${word} `;
      currLineCount = word.length + 1;
    } else {
      newlyFormattedString += `${word} `;
      currLineCount += word.length + 1;
    }
  });

  return newlyFormattedString;
}