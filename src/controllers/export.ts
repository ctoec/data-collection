import { write, WorkBook, utils } from 'xlsx';
import { ColumnMetadata } from '../../client/src/shared/models';
import { EntityMetadata, getConnection, getManager } from 'typeorm';
import { FlattenedEnrollment, Child } from '../entity';
import { getColumnMetadata } from '../entity/decorators/columnMetadata';
import { Response } from 'express';
import { format } from 'path';

export async function streamUploadedChildren(
  response: Response,
  childIds: string[]
) {
  var childrenToMap: Child[] = [];
  childIds.forEach(async (id) => {
    childrenToMap.push(await getManager().findOne(Child, { id: id }));
  });

  const csvToExport: WorkBook = generateCSV(childrenToMap);

  const csvStream = write(csvToExport, {
    bookType: 'csv',
    type: 'buffer',
  });
  response.contentType('application/octet-stream');
  response.send(csvStream);
}

// export async function retrieveChildren(childIds: string[]) {
//     var childrenToMap: Child[] = [];
//     childIds.forEach(async (id) => {
//         childrenToMap.push(await getManager().findOne(Child, {id: id}));
//     });
//     return childrenToMap;
// }

/**
 * Retrieve ColumnMetadata information for all columns on the
 * FlattenedEnrollment model.
 */
export function getAllEnrollmentColumns(): ColumnMetadata[] {
  const metadata: EntityMetadata = getConnection().getMetadata(
    FlattenedEnrollment
  );
  return metadata.columns
    .map((column) =>
      getColumnMetadata(new FlattenedEnrollment(), column.propertyName)
    )
    .filter((templateMeta) => !!templateMeta);
}

/**
 * Workhorse function that turns a Child object into an array of string
 * descriptors of specific fields of its data. The strings are
 * arranged according to the column format specified by the data
 * templates on the site.
 *
 * Note: We need this function to perform reverse mapping of the kind
 * done by mapFlattenedEnrollment because the property names in the
 * column meta-data are NOT the same as the object fields on a Child
 *
 * TODO: Several fields in the data template are not currently captured
 * by the data model or the child object. We eventually need to
 * reconcile these properties to live somewhere. They include:
 *  - dual language learner
 *  - model (of an enrollment/site)
 * @param child
 * @param cols
 */
function flattenChild(child: Child, cols: ColumnMetadata[]) {
  // Can just use 0th element of each array as the 'active'/'current'
  // value because controller.getChildById does presorting for us
  const determinations = child.family.incomeDeterminations || [];
  const currentDetermination =
    determinations.length > 0 ? determinations[0] : null;
  const workingEnrollment = (child.enrollments || []).find((e) => !e.exit);
  const activeEnrollment =
    workingEnrollment == undefined
      ? child.enrollments == undefined
        ? undefined
        : child.enrollments[0]
      : workingEnrollment;
  const fundings =
    activeEnrollment == undefined ? undefined : activeEnrollment.fundings || [];

  const activeFunding = fundings.length > 0 ? fundings[0] : undefined;

  var childString: string[] = [];
  for (let i = 0; i < cols.length; i++) {
    const c = cols[i];
    switch (c.formattedName) {
      case 'Name':
        childString.push(
          child.firstName + ' ' + (child.middleName || '') + child.lastName
        );
        break;
      case 'SASID':
        childString.push(child.sasid || '');
        break;
      case 'Date of birth':
        childString.push(child.birthdate.toDate().toLocaleDateString() || '');
        break;
      case 'Birth certificate ID #':
        childString.push(child.birthCertificateId || '');
        break;
      case 'Town of birth':
        childString.push(child.birthTown || '');
        break;
      case 'State of birth':
        childString.push(child.birthState || '');
        break;
      case 'Race: American Indian or Alaska Native':
        childString.push(
          child.americanIndianOrAlaskaNative == undefined
            ? ''
            : child.americanIndianOrAlaskaNative == true
            ? 'Yes'
            : 'No'
        );
        break;
      case 'Race: Asian':
        childString.push(
          child.asian == undefined ? '' : child.asian == true ? 'Yes' : 'No'
        );
        break;
      case 'Race: Black or African American':
        childString.push(
          child.blackOrAfricanAmerican == undefined
            ? ''
            : child.blackOrAfricanAmerican == true
            ? 'Yes'
            : 'No'
        );
        break;
      case 'Race: Native Hawaiian or Pacific Islander':
        childString.push(
          child.nativeHawaiianOrPacificIslander == undefined
            ? ''
            : child.nativeHawaiianOrPacificIslander == true
            ? 'Yes'
            : 'No'
        );
        break;
      case 'Race: White':
        childString.push(
          child.white == undefined ? '' : child.white == true ? 'Yes' : 'No'
        );
        break;
      case 'Hispanic or Latinx Ethnicity':
        childString.push(
          child.hispanicOrLatinxEthnicity == undefined
            ? ''
            : child.hispanicOrLatinxEthnicity == true
            ? 'Yes'
            : 'No'
        );
        break;
      case 'Gender':
        childString.push(child.gender || '');
        break;
      case 'Dual language learner':
        childString.push('');
        break;
      case 'Receiving Special Education Services':
        childString.push(
          child.recievesSpecialEducationServices == undefined
            ? ''
            : child.recievesSpecialEducationServices == true
            ? 'Yes'
            : 'No'
        );
        break;
      case 'Special Education Services Type':
        childString.push(child.specialEducationServicesType || '');
        break;
      case 'Street address':
        childString.push(child.family.streetAddress || '');
        break;
      case 'Town':
        childString.push(child.family.town || '');
        break;
      case 'State':
        childString.push(child.family.state || '');
        break;
      case 'Zipcode':
        childString.push(child.family.zip || '');
        break;
      case 'Lives with foster family':
        childString.push(
          child.foster == undefined ? '' : child.foster == true ? 'Yes' : 'No'
        );
        break;
      case 'Experienced homelessness or housing insecurity':
        childString.push(
          child.family.homelessness == undefined
            ? ''
            : child.family.homelessness == true
            ? 'Yes'
            : 'No'
        );
        break;
      case 'Household size':
        childString.push(
          currentDetermination == null
            ? ''
            : (currentDetermination.numberOfPeople || '').toString()
        );
        break;
      case 'Annual household income':
        childString.push(
          currentDetermination == null
            ? ''
            : (currentDetermination.income || '').toString()
        );
        break;
      case 'Determination date':
        childString.push(
          currentDetermination == null
            ? ''
            : currentDetermination.determinationDate
                .toDate()
                .toLocaleDateString()
        );
        break;
      case 'Provider':
        childString.push(
          activeEnrollment == undefined
            ? ''
            : activeEnrollment.site.organization.name
        );
        break;
      case 'Site':
        childString.push(
          activeEnrollment == undefined ? '' : activeEnrollment.site.name
        );
        break;
      case 'Model':
        childString.push('');
        break;
      case 'Age Group':
        childString.push(
          activeEnrollment == undefined ? '' : activeEnrollment.ageGroup || ''
        );
        break;
      case 'Enrollment Start Date':
        childString.push(
          activeEnrollment == undefined
            ? ''
            : activeEnrollment.entry.toDate().toLocaleDateString() || ''
        );
        break;
      case 'Enrollment End Date':
        childString.push(
          activeEnrollment == undefined
            ? ''
            : activeEnrollment.exit == null
            ? ''
            : activeEnrollment.exit.toDate().toLocaleDateString()
        );
        break;
      case 'Enrollment Exit Reason':
        childString.push(
          activeEnrollment == undefined
            ? ''
            : activeEnrollment.exitReason == null
            ? ''
            : activeEnrollment.exitReason
        );
        break;
      case 'Funding Type':
        childString.push(
          activeFunding == null ? '' : activeFunding.fundingSpace.source
        );
        break;
      case 'Space type':
        childString.push(
          activeFunding == null ? '' : activeFunding.fundingSpace.time
        );
        break;
      case 'First funding period':
        childString.push(
          activeFunding == null
            ? ''
            : activeFunding.firstReportingPeriod.period
                .toDate()
                .toLocaleDateString()
        );
        break;
      case 'Last funding period':
        childString.push(
          activeFunding == null
            ? ''
            : activeFunding.lastReportingPeriod == null
            ? ''
            : activeFunding.lastReportingPeriod.period
                .toDate()
                .toLocaleDateString()
        );
        break;
      case 'Receiving Care 4 Kids?':
        childString.push(
          child.recievesC4K == undefined
            ? ''
            : child.recievesC4K == true
            ? 'Yes'
            : 'No'
        );
        break;
      // Don't do anything in the default case because we've already
      // handled all the fields
      default:
        break;
    }
  }

  return childString;
}

/**
 * Process an array of retrieved child objects and turn them into
 * string representations to cascade into a CSV with column headers.
 * @param childArray
 */
export function generateCSV(childArray: Child[]) {
  const columnMetadatas: ColumnMetadata[] = getAllEnrollmentColumns();
  const formattedColumnNames: string[] = columnMetadatas.map(
    (c) => c.formattedName
  );
  const childStrings = childArray.map((c) => flattenChild(c, columnMetadatas));
  const sheet = utils.aoa_to_sheet([formattedColumnNames]);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, sheet);
  const children = utils.aoa_to_sheet(childStrings);
  utils.book_append_sheet(workbook, children);
  return workbook;
}
