import { BadRequestError } from '../../../../middleware/error/errors';
import { EnrollmentReportRow } from '../../../../template';
import { TransactionMetadata } from '../mapRows';

export const MISSING_PROVIDER_ERROR =
  'You uploaded a file with missing information.\nProvider name is required for every record in your upload. Make sure this column is not empty.';

/**
 * Look up organization that matches source provider name.
 *
 * If the user has only one organization, that is used regardless of the value from the row.
 *
 * If one cannot be matched, then an ApiError is thrown to return early from the processing
 * and return an error response to the API caller.
 */
export const lookUpOrganization = (
  source: EnrollmentReportRow,
  transactionMetadata: TransactionMetadata
) => {
  if (transactionMetadata.organizations?.length === 1)
    return transactionMetadata.organizations[0];

  if (!source.providerName) throw new BadRequestError(MISSING_PROVIDER_ERROR);

  const organization = transactionMetadata.organizations.find(
    (organization) =>
      organization.providerName.toLowerCase() ===
      source.providerName.trim().toLowerCase()
  );

  if (!organization) {
    const organizationNames = transactionMetadata.organizations.map(
      (o) => o.providerName
    );
    throw new BadRequestError(
      `You entered invalid provider names\nCheck that your spreadsheet provider column only contains ${organizationNames
        .slice(0, 1)
        .join(', ')} or ${organizationNames.slice(-1)} before uploading again.`
    );
  }

  return organization;
};
