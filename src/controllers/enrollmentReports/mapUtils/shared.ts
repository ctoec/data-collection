export function processedStringsMatch(str1, str2) {
  if (str1.startsWith(str2) || str2.startsWith(str1)) {
    return true;
  }
  return false;
}

const stripRegex = /[-\/\s/]+/;
export function normalizeString(
  inputString: string | number | undefined,
  isFundingSource?: boolean
): string | string[] | undefined {
  if (!inputString) {
    return;
  }
  let _inputString = inputString.toString().slice();
  // Non destructive
  if (isFundingSource) {
    return _inputString
      .split('-')
      .map((s) => s.trim().replace(stripRegex, '').toLowerCase());
  }
  return _inputString.trim().replace(stripRegex, '').toLowerCase();
}
