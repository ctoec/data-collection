export function dateSorter(
  a: Date | null | undefined,
  b: Date | null | undefined,
  inverse?: true
): number {
  let result = 0;
  if (!a && !b) result = 0;
  else if (!a) result = 1;
  else if (!b) result = -1;
  else result = a.valueOf() - b.valueOf();
  if (result === 0) return result;
  if (inverse) {
    result = -1 * result;
  }
  return result;
}

export function propertyDateSorter<T>(
  a: T,
  b: T,
  accessor: (_: T) => Date | null | undefined,
  inverse?: true
) {
  const aDate = accessor(a);
  const bDate = accessor(b);
  return dateSorter(aDate, bDate, inverse);
}
