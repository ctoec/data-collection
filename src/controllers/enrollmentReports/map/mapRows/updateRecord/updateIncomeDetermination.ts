import { ChangeTag } from '../../../../../../client/src/shared/models';
import { Child, IncomeDetermination } from '../../../../../entity';
import { EnrollmentReportRow } from '../../../../../template';
import { mapIncomeDetermination } from '../../..';
import { MapThingHolder } from '../../setUpMapThingHolder';
import { getLastIncomeDetermination } from '../../../../../utils/getLastIncomeDetermination';

export const updateIncomeDetermination = (
  row: EnrollmentReportRow,
  match: Child,
  thingHolder: MapThingHolder
) => {
  const currentDetermination = getLastIncomeDetermination(match.family);
  const newDetermination = mapIncomeDetermination(row, match.family);

  if (rowHasNewDetermination(newDetermination, currentDetermination)) {
    match.family.incomeDeterminations.push(newDetermination);
    match.tags.push(ChangeTag.IncomeDet);
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
