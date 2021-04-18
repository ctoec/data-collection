import { ChangeTag } from '../../../../../../client/src/shared/models';
import { Child, Family } from '../../../../../entity';
import { EnrollmentReportRow } from '../../../../../template';
import { MapThingHolder } from '../../setUpMapThingHolder';

export const updateFamilyAddress = (
  row: EnrollmentReportRow,
  match: Child,
  thingHolder: MapThingHolder
) => {
  if (rowHasNewAddress(row, match.family)) {
    match.family.streetAddress = row.streetAddress;
    match.family.town = row.town;
    match.family.state = row.state;
    match.family.zipCode = row.zipCode;

    match.tags.push(ChangeTag.Edit);
  }
};

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
