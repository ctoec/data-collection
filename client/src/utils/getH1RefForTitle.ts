export type TextAccessor = (h1Node: HTMLHeadingElement) => string;

export const getH1RefForTitle = (textAccessor?: TextAccessor | string) => {
  // From Deque https://dequeuniversity.com/assets/html/jquery-summit/html5/slides/headings.html
  // "on most web pages the <title> and the <h1> heading at the beginning of the content should match, or should at least be very similar"

  if (typeof textAccessor === 'string') {
    document.title = textAccessor
    return null;
  }

  const h1Ref = (h1Node: HTMLHeadingElement) => {
    if (!h1Node) return;
    if (textAccessor) {
      document.title = textAccessor(h1Node);
    } else {
      document.title = h1Node.textContent || 'ECE Reporter';
    }
  }
  return h1Ref;
}