import { ChangeTag } from '../../../../../client/src/shared/models';
import { Child, Enrollment, Funding } from '../../../../entity';
import { EnrollmentReportRow } from '../../../../template';
import { TransactionMetadata } from '../mapRows';
import { mapEnrollment, mapFunding } from '../entities';
import { lookUpSite } from '../utils';

/**
 * Update enrollment and funding information. A row can either:
 * - end an existing, current enrollment (and if it has current funding, end that as well) OR
 * - end an existing, current funding OR
 * - create a new enrollment, with a funding OR
 * - create a new funding for an existing enrollment
 */
export const updateEnrollmentFunding = (
  row: EnrollmentReportRow,
  match: Child,
  transactionMetadata: TransactionMetadata
) => {
  // If no enrollment information is provided, don't update anything
  if (!row.site && !row.entry && !row.ageGroup) {
    return;
  }

  // Get the site for the row enrollment
  const site = lookUpSite(
    row,
    match.organization.id,
    transactionMetadata.sites
  );
  // Create enrollment entity from row values
  const newEnrollment = mapEnrollment(row, site, match);
  // Look up an existing enrollment that matches the row enrollment
  // (may not exist)
  const matchingEnrollment = getEnrollmentMatch(
    newEnrollment,
    match.enrollments
  );

  // Create funding entity from row values
  const newFunding = mapFunding(
    row,
    match.organization,
    newEnrollment.ageGroup,
    transactionMetadata.fundingSpaces,
    transactionMetadata.reportingPeriods
  );
  // Look up an existing funding that matches row funding
  // (may not exist)
  const matchingFunding = getFundingMatch(
    newFunding,
    matchingEnrollment?.fundings
  );

  // If row exits a current enrollment, end enrollment and funding
  if (rowHasExitForCurrentEnrollment(newEnrollment, matchingEnrollment)) {
    matchingEnrollment.exit = newEnrollment.exit;
    matchingEnrollment.exitReason = newEnrollment.exitReason;
    matchingFunding.lastReportingPeriod = newFunding.lastReportingPeriod;
    match.tags.push(ChangeTag.WithdrawnRecord);
  }
  // If row has new enrollment, create new enrollment and funding
  else if (rowHasNewEnrollment(matchingEnrollment)) {
    newEnrollment.fundings = [newFunding];
    if (match.enrollments) match.enrollments.push(newEnrollment);
    else match.enrollments = [newEnrollment];
    match.tags.push(ChangeTag.ChangedEnrollment);
  }
  // If row ends a current funding, end funding
  else if (rowEndsCurrentFunding(newFunding, matchingFunding)) {
    matchingFunding.lastReportingPeriod = newFunding.lastReportingPeriod;
    match.tags.push(ChangeTag.ChangedFunding);
  }
  // If row has new funding, create new funding
  else if (rowHasNewFunding(matchingFunding)) {
    matchingEnrollment.fundings.push(newFunding);
    match.tags.push(ChangeTag.ChangedFunding);
  }
};

/**
 * Find an existing enrollment that matches the enrollment from row values.
 * Enrollment considered to match if:
 * - sites are the same AND
 * - age gruops are the same AND
 * - entry date is the same AND
 * - if exit date exists, exit date is the same
 *
 * Enrollments with missing site age group and entry will not
 * be considered matching, so enrollments with out site/agegroup/entry
 * cannot be updated by file upload.
 */
export const getEnrollmentMatch = (
  enrollmentFromRow: Enrollment,
  enrollments: Enrollment[] | undefined
) =>
  enrollments?.find(
    (e) =>
      // Sites match
      e.site &&
      enrollmentFromRow.site?.id === e.site?.id &&
      // Age groups match
      e.ageGroup &&
      enrollmentFromRow.ageGroup === e.ageGroup &&
      // Entry dates match
      e.entry &&
      enrollmentFromRow.entry.isSame(e.entry, 'day') &&
      // If existing enrollment has exit date, then exit dates match
      (e.exit ? enrollmentFromRow.exit.isSame(e.exit, 'day') : true)
  );

/**
 * Determines if newEnrollment (from row) ends an existing enrollment.
 * Enrollment ends existing enrollment if:
 * - existing matching enrollment was found AND
 * - existing matching enrollment does not have an exit date AND
 * - new enrollment from row does have an exit date
 *
 * @param newEnrollment
 * @param matchingEnrollment
 */
const rowHasExitForCurrentEnrollment = (
  newEnrollment: Enrollment,
  matchingEnrollment: Enrollment | undefined
) => !!matchingEnrollment && !matchingEnrollment.exit && !!newEnrollment.exit;

/**
 * Determines if newEnrollment from row is a new enrollment.
 * Enrollment is new if:
 * - no existing matching enrollment was found
 */
export const rowHasNewEnrollment = (
  matchingEnrollment: Enrollment | undefined
) =>
  // Matching enrollment does not exist
  !matchingEnrollment;

/**
 * Find an existing funding that matches the funding from row values.
 * Fundings are considered matching if
 * - They reference the same funding space AND
 * - they reference the same first reporting period AND
 * - if a last reporting period exists, they reference the same last reporting period
 * @param fundingFromRow
 * @param fundings
 */
export const getFundingMatch = (
  fundingFromRow: Funding,
  fundings: Funding[] | undefined
) =>
  fundings?.find(
    (f) =>
      f.fundingSpace &&
      fundingFromRow.fundingSpace?.id === f.fundingSpace.id &&
      f.firstReportingPeriod &&
      fundingFromRow.firstReportingPeriod?.id === f.firstReportingPeriod.id &&
      (f.lastReportingPeriod
        ? fundingFromRow.lastReportingPeriod?.id === f.lastReportingPeriod.id
        : true)
  );

/**
 * Determines if a new funding from row ends a current funding.
 * Funding ends current funding if:
 * - existing matching funding was found AND
 * - existing matching funding does not have last reporting period AND
 * - new funding from row does have a last reporting period
 */
export const rowEndsCurrentFunding = (
  newFunding: Funding,
  matchingFunding: Funding
) =>
  !!matchingFunding &&
  !matchingFunding.lastReportingPeriod &&
  !!newFunding.lastReportingPeriod;

/**
 * Determines if a new funding from row is a new funding.
 * Funding is new if:
 * - existing matching funding was not found
 * @param matchingFunding
 */
export const rowHasNewFunding = (matchingFunding: Funding | undefined) =>
  !matchingFunding;
