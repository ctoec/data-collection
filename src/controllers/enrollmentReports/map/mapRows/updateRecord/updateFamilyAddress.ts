import { ChangeTag } from '../../../../../../client/src/shared/models';
import { Child, Family } from '../../../../../entity';
import { EnrollmentReportRow } from '../../../../../template';

/**
 * Update family address if necessary
 * @param row
 * @param match
 */
export const updateFamilyAddress = (row: EnrollmentReportRow, match: Child) => {
  if (rowHasNewAddress(row, match.family)) {
    match.family.streetAddress = row.streetAddress;
    match.family.town = row.town;
    match.family.state = row.state;
    match.family.zipCode = row.zipCode;

    match.tags.push(ChangeTag.Edit);
  }
};

/**
 * Determine whether address information is new and needs
 * to be updated. Update required if:
 * - row street address is provided and is not same as match OR
 * - row town is provided and is not same as match OR
 * - row state is provided and is not same as match OR
 * - row zip code is provided and is not same as match
 */
export const rowHasNewAddress = (
  source: EnrollmentReportRow,
  family: Family
) => {
  return (
    (!!source.streetAddress && source.streetAddress !== family.streetAddress) ||
    (!!source.town && source.town !== family.town) ||
    (!!source.state && source.state !== family.state) ||
    (!!source.zipCode && source.zipCode !== family.zipCode)
  );
};
