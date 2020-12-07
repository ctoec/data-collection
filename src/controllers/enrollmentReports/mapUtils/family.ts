import { UndefinableBoolean } from '../../../../client/src/shared/models';
import { EntityManager } from 'typeorm';
import { Family, Organization, User } from '../../../entity';

import { EnrollmentReportRow } from '../../../template';
import { mapEnum } from './enum';

/**
 * Create Family object (with IncomeDetermination) from FlattenedEnrollment
 * source.
 * TODO: Lookup existing families before creating new one
 * @param source
 */
export const mapFamily = (
  transaction: EntityManager,
  source: EnrollmentReportRow,
  organization: Organization,
  user: User,
  save: boolean
) => {
  const homelessness: UndefinableBoolean = mapEnum(
    UndefinableBoolean,
    source.homelessness
  );

  let family = {
    streetAddress: source.streetAddress,
    town: source.town,
    state: source.state,
    zipCode: source.zipCode,
    homelessness,
    organization,
  } as Family;

  if (save) {
    family = transaction.create(Family, {
      ...family,
      updateMetaData: {
        author: user,
      },
    });
    return transaction.save(family);
  }

  return family;
};
