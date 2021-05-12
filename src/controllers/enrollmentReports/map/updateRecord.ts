import { Child } from '../../../entity';
import { EnrollmentReportRow } from '../../../template';
import { TransactionMetadata } from './mapRows';
import { updateBirthCertificate } from './updates/updateBirthCertificate';
import { updateEnrollmentFunding } from './updates/updateEnrollmentFunding';
import { updateFamilyAddress } from './updates/updateFamilyAddress';
import { updateIncomeDetermination } from './updates/updateIncomeDetermination';

/**
 * Update an existing child object graph from the mappedChild cache
 * (either encountered earlier in the upload or pulled from DB).
 * Updates object by reference.
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
 * @param transactionMetadata
 */
export const updateRecord = (
  row: EnrollmentReportRow,
  match: Child,
  transactionMetadata: TransactionMetadata
) => {
  updateBirthCertificate(row, match);
  updateFamilyAddress(row, match);
  updateIncomeDetermination(row, match);
  updateEnrollmentFunding(row, match, transactionMetadata);
};
