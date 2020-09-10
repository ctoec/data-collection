import { write, WorkBook, utils, ColInfo, WorkSheet } from 'xlsx';
import { ColumnMetadata } from '../../client/src/shared/models';
import { EntityMetadata, getConnection, getManager } from 'typeorm';
import { FlattenedEnrollment, Child } from '../entity';
import { getColumnMetadata } from '../entity/decorators/columnMetadata';
import { Response } from 'express';
import { format } from 'path';
import { momentTransformer } from '../entity/transformers/momentTransformer';
import Moment from 'moment';

export async function streamUploadedChildren(
  response: Response,
  childrenToMap: Child[]
) {
  // var childrenToMap: Child[] = [];
  // childIds.forEach(async (id) => {
  //   childrenToMap.push(await getManager().findOne(Child, { id: id }));
  // });
  // response.send(generateCSV(childrenToMap));

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
 * Retrieve our own custom ColumnMetadata for all columns on the FlattenedEnrollment model.
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

function flattenChild(child: Child, cols: ColumnMetadata[]) {
  var childString: string[] = [];
  for (let i = 0; i < cols.length; i++) {
    const c = cols[i];
    switch (c.formattedName) {
      case 'Name':
        childString.push(
          child.firstName + ' ' + (child.middleName || '') + child.lastName
        );
        break;
      case 'Date of birth':
        childString.push(child.birthdate.toDate().toDateString() || '');
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
      case 'Native Hawaiian or Pacific Islander':
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
      // case 'Dual language learner':
      // childString.push(child.asian == undefined ? '' : child.asian == true ? 'Yes' : 'No');
      // break
      case 'Receiving Special Education Services':
        childString.push(
          child.recievesSpecialEducationServices == undefined
            ? ''
            : child.recievesSpecialEducationServices == true
            ? 'Yes'
            : 'No'
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
      case 'Receiving Care 4 Kids?':
        childString.push(
          child.recievesC4K == undefined
            ? ''
            : child.recievesC4K == true
            ? 'Yes'
            : 'No'
        );
        break;
      default:
        // Note: Property names are NOT the same as the object fields
        // in a child object--that's why we need the big switch statement
        childString.push(child[c.propertyName] || '');
        break;
    }
  }

  // cols.forEach((c) => {
  //   childString.push('' + child[c.propertyName]);
  // })
  // console.log(childString);
  return childString;
}

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
