/**
 * Given an array of 'rows' (assumed to be a property of some
 * entity), filter out any objects in those rows that have been
 * soft-deleted.
 * @param rows
 */
export const removeDeletedElements = (rows?: any[]) => {
  if (!rows) return [];
  return rows.filter((row: any) => !row.deletedDate);
};
