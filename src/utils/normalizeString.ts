// Match "-", "/", " ", ".", "'"
const stripRegex = /[-\/\s/\.']/g;
export function normalizeString(
  inputString: string | number | undefined
): string | undefined {
  if (!inputString) {
    return;
  }
  // copy string -- non-destructive normalization
  let _inputString = inputString.toString().slice();
  return _inputString.trim().replace(stripRegex, '').toLowerCase();
}
