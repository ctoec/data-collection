import { ChangeTag } from '../../../../../client/src/shared/models';
import { EnrollmentReportRow } from '../../../../template';
import {
  mapFamily,
  mapIncomeDetermination,
  mapChild,
  mapEnrollment,
  mapFunding,
} from '../..';
import { lookUpSite } from './lookUpSite';
import { MapThingHolder } from '../setUpMapThingHolder';
import { Organization } from '../../../../entity';

export const createRecord = async (
  row: EnrollmentReportRow,
  organization: Organization,
  thingHolder: MapThingHolder
) => {
  const family = mapFamily(row, organization);
  const incomeDetermination = mapIncomeDetermination(row, family);
  family.incomeDeterminations = [incomeDetermination];

  const child = mapChild(row, organization, family);
  child.family = family;

  const site = lookUpSite(row, organization.id, thingHolder.sites);
  const enrollment = mapEnrollment(row, site, child);
  const funding = mapFunding(
    row,
    organization,
    enrollment.ageGroup,
    thingHolder.fundingSpaces,
    thingHolder.reportingPeriods
  );

  enrollment.fundings = [funding];
  child.enrollments = [enrollment];

  thingHolder.mappedChildren.push({ ...child, tags: [ChangeTag.NewRecord] });
};
