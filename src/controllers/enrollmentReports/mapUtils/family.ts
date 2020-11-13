import { EntityManager } from 'typeorm';
import { Family, Organization, User } from '../../../entity';

import { EnrollmentReportRow } from '../../../template';

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
  let family = {
    streetAddress: source.streetAddress,
    town: source.town,
    state: source.state,
    zipCode: source.zipCode,
    homelessness: source.homelessness,
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
