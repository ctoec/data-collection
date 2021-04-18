import { BadRequestError } from '../../../../middleware/error/errors';
import { EnrollmentReportRow } from '../../../../template';
import { MapThingHolder } from '../setUpMapThingHolder';

export const MISSING_PROVIDER_ERROR =
  'You uploaded a file with missing information.\nProvider name is required for every record in your upload. Make sure this column is not empty.';

export const lookUpOrganization = (
  source: EnrollmentReportRow,
  thingHolder: MapThingHolder
) => {
  if (thingHolder.organizations?.length === 1)
    return thingHolder.organizations[0];

  if (!source.providerName) throw new BadRequestError(MISSING_PROVIDER_ERROR);

  const organization = thingHolder.organizations.find(
    (organization) =>
      organization.providerName.toLowerCase() ===
      source.providerName.trim().toLowerCase()
  );

  if (!organization) {
    const organizationNames = thingHolder.organizations.map(
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
