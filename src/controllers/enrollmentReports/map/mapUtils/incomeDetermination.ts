import { Family, IncomeDetermination } from '../../../../entity';
import { EnrollmentReportRow } from '../../../../template';
import { getManager } from 'typeorm';

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
      // Cast empty strings to undefined to avoid DB write failures
      numberOfPeople: source.numberOfPeople || undefined,
      // Need to accept 0 as valid income, so use forcible number conversion
      // to check if the result is a valid number
      income: isNaN(source.income) ? undefined : source.income,
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
  console.log('Det From Row: ', detFromRow);
  console.log('New Determination: ', determination);
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
