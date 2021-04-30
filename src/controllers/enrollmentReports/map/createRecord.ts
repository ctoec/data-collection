import { ChangeTag } from '../../../../client/src/shared/models';
import { EnrollmentReportRow } from '../../../template';
import {
  mapFamily,
  mapIncomeDetermination,
  mapChild,
  mapEnrollment,
  mapFunding,
} from '..';
import { lookUpSite } from './utils';
import { TransactionMetadata } from './mapRows';
import { Organization } from '../../../entity';

/**
 * Create a new record from an EnrollmentReportRow
 * for which no matching child was found.
 *
 * Creates full object graph (family, income determinations, child, enrollment, funding)
 * regardless of if the information provided is complete
 * i.e. will create an empty funding if no funding information is provided,
 * because every enrollment requires a funding.
 * If this requirement changes, be sure to update the mapping utils.
 *
 * @param row
 * @param organization
 * @param transactionMetadata
 */
export const createRecord = async (
  row: EnrollmentReportRow,
  organization: Organization,
  transactionMetadata: TransactionMetadata
) => {
  const family = mapFamily(row, organization);
  family.incomeDeterminations = [mapIncomeDetermination(row, family)];

  const child = mapChild(row, organization, family);
  child.family = family;

  const site = lookUpSite(row, organization.id, transactionMetadata.sites);
  const enrollment = mapEnrollment(row, site, child);
  const funding = mapFunding(
    row,
    organization,
    enrollment.ageGroup,
    transactionMetadata.fundingSpaces,
    transactionMetadata.reportingPeriods
  );

  enrollment.fundings = [funding];
  child.enrollments = [enrollment];
  child.tags = [ChangeTag.NewRecord];

  return child;
};
