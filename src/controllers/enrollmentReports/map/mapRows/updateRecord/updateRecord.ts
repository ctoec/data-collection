import { Child } from '../../../../../entity';
import { EnrollmentReportRow } from '../../../../../template';
import { MapThingHolder } from '../../setUpMapThingHolder';
import { updateBirthCertificate } from './updateBirthCertifiate';
import { updateEnrollmentFunding } from './updateEnrollmentFunding';
import { updateFamilyAddress } from './updateFamilyAddress';
import { updateIncomeDetermination } from './updateIncomeDetermination';

export const updateRecord = (
  row: EnrollmentReportRow,
  match: Child,
  thingHolder: MapThingHolder
) => {
  // birth cert
  updateBirthCertificate(row, match, thingHolder);
  // family address
  updateFamilyAddress(row, match, thingHolder);
  // income determination
  updateIncomeDetermination(row, match, thingHolder);
  // enrollment
  updateEnrollmentFunding(row, match, thingHolder);
};
