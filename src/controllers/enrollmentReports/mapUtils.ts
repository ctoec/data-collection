import { Child, Enrollment } from '../../entity';
import { EnrollmentReportRow } from '../../template';

/**
 * Determine whether a given enrollment report row from an
 * uploaded sheet has demographic/identifier information matching
 * a given child.
 * @param child
 * @param other
 */
export const isIdentifierMatch = (
  child: Child | EnrollmentReportRow,
  other: EnrollmentReportRow
) => {
  return (
    child.firstName === other.firstName &&
    child.lastName === other.lastName &&
    child.birthdate.format('MM/DD/YYYY') ===
      other.birthdate.format('MM/DD/YYYY') &&
    child.sasid === other.sasid
  );
};

/**
 * Determine whether a child with the given identifying
 * information has already been seen, out of all children
 * that have thus far been parsed.
 * @param row
 * @param processedChildren
 */
export const getChildToUpdate = (
  row: EnrollmentReportRow,
  processedChildren: Child[]
) => {
  return processedChildren.find((c) => isIdentifierMatch(c, row));
};

/**
 * Finds an enrollment on the given child object that matches
 * the characteristics of an enrollment report row from an
 * uploaded sheet. Two enrollments match if they have the same
 * dates at the same site.
 * @param row
 * @param child
 */
export const getExistingEnrollmentOnChild = (
  row: EnrollmentReportRow,
  child: Child
) => {
  if (!child.enrollments) return null;
  return child.enrollments.find((e) => {
    return (
      e.site.siteName === row.siteName &&
      e.entry.format('MM/DD/YYYY') === row.entry.format('MM/DD/YYYY')
    );
  });
};

/**
 * Finds a funding for the given enrollment that matches the
 * characteristics of an enrollment report row from an
 * uploaded sheet. Two fundings match if they are from the
 * same source, have the same time, and cover the same dates.
 * @param row
 * @param enrollment
 */
export const getExistingFundingForEnrollment = (
  row: EnrollmentReportRow,
  enrollment: Enrollment
) => {
  if (!enrollment || !enrollment.fundings) return null;
  return enrollment.fundings.find((f) => {
    return (
      row.firstFundingPeriod.format('MM/DD/YYYY') ===
        f.firstReportingPeriod.periodStart.format('MM/DD/YYYY') &&
      row.source === f.fundingSpace.source &&
      row.time === f.fundingSpace.time
    );
  });
};
