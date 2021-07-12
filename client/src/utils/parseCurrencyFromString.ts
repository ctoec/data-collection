export default function parseCurrencyFromString(string: string) {
  const undecoratedString = string.replace(/[^-0-9.]/g, '');
  const parsedFloat = parseFloat(undecoratedString);
  const roundedFloat = Math.round(parsedFloat * 100) / 100;

  return isNaN(roundedFloat) ? null : roundedFloat;
}
