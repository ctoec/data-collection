import {
  BirthCertificateType,
  ChangeTag,
} from '../../../../../../client/src/shared/models';
import { Child } from '../../../../../entity';
import { EnrollmentReportRow } from '../../../../../template';
import { mapEnum } from '../../..';
import { MapThingHolder } from '../../setUpMapThingHolder';

export const updateBirthCertificate = (
  row: EnrollmentReportRow,
  match: Child,
  thingHolder: MapThingHolder
) => {
  if (
    !row.birthCertificateType ||
    row.birthCertificateType === BirthCertificateType.Unavailable
  )
    return;

  match.birthCertificateType = mapEnum(
    BirthCertificateType,
    row.birthCertificateType
  );
  match.birthCertificateId = row.birthCertificateId ?? match.birthCertificateId;
  match.birthTown = row.birthTown ?? match.birthTown;
  match.birthState = row.birthState ?? match.birthState;

  match.tags.push(ChangeTag.Edited);
};
