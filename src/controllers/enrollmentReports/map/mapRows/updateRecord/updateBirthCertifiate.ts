import {
  BirthCertificateType,
  ChangeTag,
} from '../../../../../../client/src/shared/models';
import { Child } from '../../../../../entity';
import { EnrollmentReportRow } from '../../../../../template';
import { mapEnum } from '../../..';

/**
 * Update birth certificate information if necessary
 * @param row
 * @param match
 * @param thingHolder
 */
export const updateBirthCertificate = (
  row: EnrollmentReportRow,
  match: Child
) => {
  const rowBCType: BirthCertificateType = mapEnum(
    BirthCertificateType,
    row.birthCertificateType
  );

  // If no birth certificate information in row
  // or row.birthCertificiateType is Unavailable,
  // then there's nothing to update
  if (
    !row.birthCertificateType ||
    rowBCType === BirthCertificateType.Unavailable
  )
    return;

  // If row birth certificate info matches the match
  // birth certificate info, then there's nothing
  // to update.
  if (
    rowBCType === match.birthCertificateType &&
    row.birthCertificateId === match.birthCertificateType &&
    row.birthTown === match.birthTown &&
    row.birthState === match.birthState
  )
    return;

  // Otherwise, update birth certificate info to values from row
  match.birthCertificateType = rowBCType;
  match.birthCertificateId = row.birthCertificateId ?? match.birthCertificateId;
  match.birthTown = row.birthTown ?? match.birthTown;
  match.birthState = row.birthState ?? match.birthState;

  match.tags.push(ChangeTag.Edited);
};
