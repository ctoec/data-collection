import { Organization } from '../../../entity';
import { EnrollmentReportRow } from '../../../template';
import { BadRequestError } from '../../../middleware/error/errors';

export const MISSING_PROVIDER_ERROR =
  'You uploaded a file with missing information.\nProvider name is required for every record in your upload. Make sure this column is not empty.';

/**
 * Look up organization from user's organizations that matches
 * source provider name.
 * If the source provider name does not exist, throw an error
 * as this is required for upload to succeed
 * TODO: How do we want to implement fuzzy matching here?
 * @param source
 */
export const lookUpOrganization = (
  source: EnrollmentReportRow,
  organizations: Organization[]
) => {
  if (organizations.length === 1) return organizations[0];

  if (!source.providerName) throw new BadRequestError(MISSING_PROVIDER_ERROR);

  return organizations.find(
    (organization) =>
      organization.providerName.toLowerCase() ===
      source.providerName.toLowerCase()
  );
};
