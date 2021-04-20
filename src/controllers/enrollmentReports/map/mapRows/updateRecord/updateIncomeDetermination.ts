import { ChangeTag } from '../../../../../../client/src/shared/models';
import { Child, IncomeDetermination } from '../../../../../entity';
import { EnrollmentReportRow } from '../../../../../template';
import { mapIncomeDetermination } from '../../..';
import { getLastIncomeDetermination } from '../../../../../utils/getLastIncomeDetermination';

/**
 * Create a new income determination for the given match.Family
 * if row contains information for a new determination.
 */
export const updateIncomeDetermination = (
  row: EnrollmentReportRow,
  match: Child
) => {
  const currentDetermination = getLastIncomeDetermination(match.family);
  const newDetermination = mapIncomeDetermination(row, match.family);

  if (rowHasNewDetermination(newDetermination, currentDetermination)) {
    match.family.incomeDeterminations.push(newDetermination);
    match.tags.push(ChangeTag.IncomeDet);
  }
};

/**
 * Determine whether an income determination mapped
 * from an EnrollmentReportRow is a "new" determination.
 *
 * Considered new if:
 * - row income is not the same as  match income OR
 * - row number of people is not the same as match number of people OR
 * - row determination date is not the same as match determination date OR
 * - row income not disclosed i not the same as match income not disclosed
 *
 * @param detFromRow
 * @param determination
 */
export const rowHasNewDetermination = (
  detFromRow: IncomeDetermination,
  determination: IncomeDetermination
) => {
  if (
    detFromRow.income === undefined &&
    detFromRow.numberOfPeople === undefined &&
    detFromRow.determinationDate === undefined
  ) {
    return false;
  }
  return (
    detFromRow.income !== determination.income ||
    detFromRow.numberOfPeople !== determination.numberOfPeople ||
    !detFromRow.determinationDate.isSame(
      determination.determinationDate,
      'day'
    ) ||
    detFromRow.incomeNotDisclosed !== determination.incomeNotDisclosed
  );
};
