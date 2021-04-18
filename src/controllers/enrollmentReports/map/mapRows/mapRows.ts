import { validate } from 'class-validator';
import { EnrollmentReportRow } from '../../../../template';
import { lookUpOrganization } from './lookUpOrganization';
import { ApiError } from '../../../../middleware/error/errors';
import { getChildMatch } from './getChildMatch';
import { createRecord } from './createRecord';
import { updateRecord } from './updateRecord/updateRecord';
import { MapThingHolder } from '../setUpMapThingHolder';

export const mapRows = async (
  rows: EnrollmentReportRow[],
  thingHolder: MapThingHolder
) => {
  for (const row of rows) {
    await mapRow(row, thingHolder);
  }

  return Promise.all(
    thingHolder.mappedChildren.map(async (child) => ({
      ...child,
      validationErrors: await validate(child, {
        validationError: { target: false, value: false },
      }),
    }))
  );
};

const mapRow = async (
  row: EnrollmentReportRow,
  thingHolder: MapThingHolder
) => {
  try {
    const organization = lookUpOrganization(row, thingHolder);
    const match = await getChildMatch(row, organization, thingHolder);
    if (match) updateRecord(row, match, thingHolder);
    else createRecord(row, organization, thingHolder);
  } catch (err) {
    if (err instanceof ApiError) throw err;

    console.error('Error occured parsing row:', err);
  }
};
