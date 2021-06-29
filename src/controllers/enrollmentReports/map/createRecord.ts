import { ChangeTag } from '../../../../client/src/shared/models';
import { EnrollmentReportRow } from '../../../template';
import {
  addFamily,
  addIncomeDetermination,
  addChild,
  addEnrollment,
  addFunding,
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
  const family = addFamily(row, organization);
  family.incomeDeterminations = [addIncomeDetermination(row, family)];

  const child = addChild(row, organization, family);
  child.family = family;

  const site = lookUpSite(row, organization.id, transactionMetadata.sites);
  const enrollment = addEnrollment(row, site, child);
  const funding = addFunding(
    row,
    organization,
    enrollment.ageGroup,
    transactionMetadata.fundingSpaces,
  );

  enrollment.fundings = [funding];
  child.enrollments = [enrollment];
  child.tags = [ChangeTag.NewRecord];

  return child;
};
