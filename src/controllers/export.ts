import { write, WorkBook, utils, ColInfo, WorkSheet } from 'xlsx';
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
  return cols.map((colName) => {
    child[colName.propertyName];
  });
  // Object.keys(child)
}

function generateCSV(childArray: Child[]): WorkBook {
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
