import { write, WorkBook, utils } from 'xlsx';
import { ColumnMetadata } from '../../client/src/shared/models';
import { EntityMetadata, getConnection, getManager } from 'typeorm';
import { FlattenedEnrollment, Child } from '../entity';
import { getColumnMetadata } from '../entity/decorators/columnMetadata';
import { Response } from 'express';
import { propertyDateSorter } from '../../client/src/utils/dateSorter';

export async function streamUploadedChildren(
  response: Response,
  childrenToMap: Child[]
) {
  // var childrenToMap: Child[] = [];
  // for (let i = 0; i < uploadedIds.length; i++) {
  //   childrenToMap.push(
  //     await getManager().findOne(Child, { id: uploadedIds[i] })
  //   );
  // }
  // response.send(childrenToMap);

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
  const determinations = child.family.incomeDeterminations || [];
  // const sortedDeterminations = determinations.sort((a, b) =>
  //   propertyDateSorter(a, b, (det) => det.determinationDate, true)
  // );
  const currentDetermination =
    determinations.length > 0 ? determinations[0] : null;
  const activeEnrollment = (child.enrollments || []).find((e) => !e.exit);
  const fundings =
    activeEnrollment == undefined ? [] : activeEnrollment.fundings;
  // const sortedFundings = fundings.sort((a, b) =>
  //   propertyDateSorter(a, b, (f) => f.firstReportingPeriod.period, true)
  // );
  const activeFunding = fundings.length > 0 ? fundings[0] : null;

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
      // TODO: Update data model to account for this variable
      // It's not currently a field of a child object
      case 'Dual language learner':
        // childString.push(child.asian == undefined ? '' : child.asian == true ? 'Yes' : 'No');
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
            ? 'undef provider'
            : activeEnrollment.site.organization.name || 'no prov name'
        );
        childString.push('');
        break;
      case 'Site':
        childString.push(
          activeEnrollment == undefined
            ? 'undef site'
            : activeEnrollment.site.name || 'no site name'
        );
        break;
      // TODO: Update data model to account for this variable
      // It's not currently a field of an enrollment object
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
        // Note: Property names are NOT the same as the object fields
        // in a child object--that's why we need the big switch statement
        childString.push(child[c.propertyName] || '');
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
  // var childStrings: string[][] = [];
  // childArray.forEach((c) => {
  // childStrings.push(flattenChild(c, columnMetadatas));
  // });
  const childStrings = childArray.map((c) => flattenChild(c, columnMetadatas));
  // return childStrings;

  const sheet = utils.aoa_to_sheet([formattedColumnNames]);
  // const children = utils.aoa_to_sheet(childStrings);

  utils.sheet_add_aoa(sheet, childStrings, { origin: -1 });

  // WORK OFF OF THIS GUY
  // const children = utils.json_to_sheet(childArray);
  // const children = utils.json_to_sheet(childArray);

  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, sheet);
  // utils.book_append_sheet(workbook, children);
  // utils.sheet_add_json(sheet, childArray);
  // utils.book_append_sheet(workbook, children);
  return workbook;
}
