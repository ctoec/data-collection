import { Child, Family, IncomeDetermination } from '../../../../entity';
import { EnrollmentReportRow } from '../../../../template';
import { getManager } from 'typeorm';
import { EnrollmentReportUpdate } from '../uploadTypes';
import { getLastIncomeDetermination } from '../../../../utils/getLastIncomeDetermination';
import { ChangeTag } from '../../../../../client/src/shared/models';

/**
 * Create IncomeDetermination object from FlattenedEnrollment source.
 * @param source
 */
export const mapIncomeDetermination = (
  source: EnrollmentReportRow,
  family: Family
) => {
  // If the user supplied any of the income determination value fields,
  // create the det and overwrite not disclosed to false
  if (source.numberOfPeople || source.income || source.determinationDate) {
    return getManager().create(IncomeDetermination, {
      numberOfPeople: stripInt(source.numberOfPeople),
      income: stripFloat(source.income),
      determinationDate: source.determinationDate,
      incomeNotDisclosed: false,
      family,
    });
  }

  // If there are no provided values and user deliberately checked not
  // disclosed, then make an undisclosed income determination
  else if (source.incomeNotDisclosed) {
    return getManager().create(IncomeDetermination, {
      incomeNotDisclosed: true,
      family,
    });
  } else {
    return getManager().create(IncomeDetermination, {
      family,
    });
  }
};

/**
 * Util function that determines whether an income determination mapped
 * from an EnrollmentReportRow provides any new or different information
 * from the income determination currently associated with a child's
 * family.
 * @param detFromRow
 * @param determination
 */
export const rowHasNewDetermination = (
  detFromRow,
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
    (detFromRow.income &&
      parseFloat(detFromRow.income) !== determination.income) ||
    (detFromRow.numberOfPeople &&
      parseFloat(detFromRow.numberOfPeople) !== determination.numberOfPeople) ||
    (detFromRow.determinationDate &&
      detFromRow.determinationDate.format('MM/DD/YYYY') !==
        determination.determinationDate.format('MM/DD/YYYY')) ||
    detFromRow.incomeNotDisclosed !== determination.incomeNotDisclosed
  );
};

/**
 * Decide whether, given a child and an enrollment report row,
 * the row contains sufficient information to add an updated
 * income determination.
 */
export const handleIncomeDeterminationUpdate = (
  child: Child,
  source: EnrollmentReportRow,
  matchingIdx: number,
  determinationsToUpdate: IncomeDetermination[],
  mapResult: EnrollmentReportUpdate
) => {
  const currentDetermination = getLastIncomeDetermination(child.family);
  const determination = mapIncomeDetermination(source, child.family);
  if (rowHasNewDetermination(determination, currentDetermination)) {
    mapResult.changeTagsForChildren[matchingIdx].push(ChangeTag.IncomeDet);
    determinationsToUpdate.push(determination);
    child.family.incomeDeterminations.push(determination);
  }
};

/**
 * Return value if it is a number, or pull numeric value
 * from string
 *
 * For cases when:
 * - errant characters/spaces result in invalid string (i.e. user accidentally prepends a '`')
 * - legacy ECIS value "9 or more" is entered
 * @param value
 */
const stripInt = (value: string | number) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const match = value.match(/\d+/);
    if (match) {
      return parseInt(match[0]);
    }
  }

  return undefined;
};

/**
 * Return value if it is a number, or string out all non-numeric
 * characters from a string.
 *
 * For when:
 * - excel formatting does not apply correctly to copy/pasted
 * numeric values, and they end up as strings with commas
 * - users accidentially enter errant spaces in dollar amount
 * @param value
 */
const stripFloat = (value: string | number) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const float = parseFloat(value.replace(/\D/g, ''));
    if (!isNaN(float)) return float;
  }
  return undefined;
};
