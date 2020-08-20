import express from 'express';
import { Response, Request } from 'express';
import { utils, WorkBook, write } from 'xlsx';
import { ECEColumnMetadata } from '../../shared/models';
import { EntityMetadata, getConnection } from 'typeorm';
import { getColumnMetadata } from '../entity/decorators/columnMetadata';
import { FlattenedEnrollment } from '../entity';


export const dataDefinitionRouter = express.Router();

/**
 * /data-definitions GET
 *
 * Returns all data-definition metadata from the FlattenedEnrollment model,
 * as an array of DataDefinitionInfo objects
 */
dataDefinitionRouter.get('/', (_, res) => {
  res.send(getAllEnrollmentColumns());
});

dataDefinitionRouter.get('/csv', (req: Request, res: Response) => {
  generateTemplate(res, 'csv');
});

dataDefinitionRouter.get('/xlsx', (req: Request, res: Response) => {
  generateTemplate(res, 'xlsx');
});

function generateTemplate(response: Response, bookType: 'csv' | 'xlsx') {
  const template: WorkBook = getTemplateWorkbook(bookType);

  // const filePath = path.join('/tmp', `ECE Data Collection Template.${bookType}`);
  // writeFile(template, filePath, { bookType });
  // response.download(filePath);

  const templateStream = write(template, {
    bookType,
    type: 'buffer'
  });
  response.contentType('application/octet-stream');
  response.send(templateStream);
};

/**
 * Creates Workbook object containing a single worksheet,
 * which contains the data collection template data.
 */
function getTemplateWorkbook(type: 'csv' | 'xlsx'): WorkBook {
  const columnMetadatas: ECEColumnMetadata[] = getAllEnrollmentColumns().sort();

  if (type === 'csv') {
    const formattedColumnNames: string[] = columnMetadatas.map(c => c.formattedName);
    const sheet = utils.aoa_to_sheet([formattedColumnNames]);

    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, sheet);

    return workbook;
  } else {
    let columnNames: string[] = [];
    let definitions: string[] = [];
    let sections: string[] = [];
    let sectionCounts: any = {};

    columnMetadatas.forEach((columnMetadata, index) => {
      columnNames[index] = columnMetadata.formattedName;
      definitions[index] = columnMetadata.definition;
      sections[index] = columnMetadata.section;

      if (!sectionCounts[columnMetadata.section]) {
        sectionCounts[columnMetadata.section] = 0;
      } else {
        sectionCounts[columnMetadata.section]++;
      }
    });

    const aoa = [
      sections,
      columnNames,
      definitions,
    ];

  const sheet = utils.aoa_to_sheet(aoa);

  let merges = [];
  let lastEnd = 0;
  sections.forEach((sectionName) => {
    const start = lastEnd > 0 ? lastEnd + 1 : lastEnd;
    const end = lastEnd + sectionCounts[sectionName];
    merges.push({ s: { c: start, r: 0 }, e: { c: end, r: 0 } });

    lastEnd = end;
  });

  sheet['!merges'] = merges;

  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, sheet);

  return workbook;
  }
}

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
