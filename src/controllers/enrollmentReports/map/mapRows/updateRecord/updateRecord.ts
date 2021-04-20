import { Child } from '../../../../../entity';
import { EnrollmentReportRow } from '../../../../../template';
import { MapThingHolder } from '../../setUpMapThingHolder';
import { updateBirthCertificate } from './updateBirthCertifiate';
import { updateEnrollmentFunding } from './updateEnrollmentFunding';
import { updateFamilyAddress } from './updateFamilyAddress';
import { updateIncomeDetermination } from './updateIncomeDetermination';

/**
 * Update an existing child object graph from the mappedChild cache
 * (either encountered earlier in the upload or pulled from DB).
 * Supported changes include:
 * - updating birth certificate information
 * - updating family address
 * - adding a new income determination
 * - updating enrollment/funding information:
 * 		- ending enrollment
 * 		- ending funding
 *    - adding new enrollment
 *    - adding new funding
 * @param row
 * @param match
 * @param thingHolder
 */
export const updateRecord = (
  row: EnrollmentReportRow,
  match: Child,
  thingHolder: MapThingHolder
) => {
  updateBirthCertificate(row, match);
  updateFamilyAddress(row, match);
  updateIncomeDetermination(row, match);
  updateEnrollmentFunding(row, match, thingHolder);
};
