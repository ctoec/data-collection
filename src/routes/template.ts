import express from 'express';

import { utils, writeFile } from 'xlsx';
import path from 'path';
import { Response, Request } from 'express';
import { getConnection, EntityMetadata } from 'typeorm';
import { FlattenedEnrollment } from '../entity';
import { getColumnMetadata } from '../entity/decorators/columnMetadata';
import { ECEColumnMetadata } from '../../shared/models';

const CSV_MIME_TYPE = 'text/csv';
const XLSX_MIME_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export const templateRouter = express.Router();

templateRouter.get('/csv', (req: Request, res: Response) => {
  generateTemplate(req, res, 'csv');
});

templateRouter.get('/xlsx', (req: Request, res: Response) => {
  generateTemplate(req, res, 'xlsx');
});

// /**
//  * Creates and sends the data collection template as specified type
//  * by writing the file to /tmp, and then sending via express builtin `sendFile`
//  *
//  * Adds Content-type and Content-disposition headers to response.
//  * @param request
//  * @param response
//  * @param type
//  */
// const templateGet = (
//   request: Request,
//   response: Response,
//   type: 'csv' | 'xlsx'
// ) => {
//   const template = getTemplateWorkbook(type);
//   const filePath = path.join('/tmp', `template.${type}`);

//   writeFile(template, filePath, { bookType: type });

//   response.setHeader(
//     'Content-type',
//     type === 'csv' ? CSV_MIME_TYPE : XLSX_MIME_TYPE
//   );
//   response.setHeader(
//     'Content-disposition',
//     `attachement; filename="ECE Data Collection Template.${type}"`
//   );
//   response.sendFile(filePath);
// };

// const getMergesForSections = (sectionCounts: object) => {
//   const sectionNames = Object.keys(sectionCounts);
//   const merges = [];
//   let lastEnd = 0;
//   sectionNames.forEach((sectionName) => {
//     const start = lastEnd > 0 ? lastEnd + 1 : lastEnd;
//     const end = lastEnd + sectionCounts[sectionName];
//     merges.push({ s: { c: start, r: 0 }, e: { c: end, r: 0 } });

//     lastEnd = end;
//   });

//   return merges;
// };

/**
 * Creates and sends the data collection template as specified type
 * by writing the file to /tmp, and then sending via express builtin `sendFile`
 *
 * Adds Content-type and Content-disposition headers to response.
 * @param request
 * @param response
 * @param type
 */
function generateTemplate(
  request: Request,
  response: Response,
  type: 'csv' | 'xlsx'
) {
  const template = getTemplateWorkbook(type);
  const filePath = path.join('/tmp', `ECE Data Collection Template.${type}`);

  writeFile(template, filePath, { bookType: type });

  // response.setHeader(
  //   'Content-Type',
  //   type === 'csv' ? CSV_MIME_TYPE : XLSX_MIME_TYPE
  // );
  response.download(filePath);
};

/**
 * Creates Workbook object containing a single worksheet,
 * which contains the data collection template data.
 */
const getTemplateWorkbook = (type: 'csv' | 'xlsx') => {
  const columnMetadatas: ECEColumnMetadata[] = getAllEnrollmentColumns().sort();

  if (type === 'csv') {
    const formattedColumnNames: String[] = columnMetadatas.map(c => c.formattedName);
    const sheet = utils.aoa_to_sheet([formattedColumnNames]);

    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, sheet);

    return workbook;
  } else {
    let columnNames: String[];
    let definitions: String[];
    let sections: String[];

    columnMetadatas.forEach((columnMetadata, index) => {
      columnNames[index] = columnMetadata.propertyName;
      definitions[index] = columnMetadata.definition;
      sections[index] = columnMetadata.section;
    });

    const aoa = [
      [sections],
      [columnNames],
      [definitions],
    ];
  const sheet = utils.aoa_to_sheet(aoa);

  // if (type === 'xlsx') {
  //   sheet['!merges'] = getMergesForSections(sectionCounts);
  // }

  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, sheet);

  return workbook;
  }
};

/**
 * Creates template data as array of arrays, derived from FlattenedEnrollment entity.
 * Template data includes column headers and optionally descriptions, which are stored
 * along with the entity as DB column comments.
 *
 * Only entity properties with column comments are exposed via the template.
 */
export function getAllEnrollmentColumns(): ECEColumnMetadata[] {
  const metadata: EntityMetadata = getConnection().getMetadata(FlattenedEnrollment);

  return metadata.columns.map((column) =>
    getColumnMetadata(new FlattenedEnrollment(), column.propertyName)
  )
  .filter((templateMeta) => !!templateMeta);
}