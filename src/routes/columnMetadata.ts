import express from 'express';
import { Response, Request } from 'express';
import { utils, WorkBook, write, ColInfo, WorkSheet } from 'xlsx';
import { ECEColumnMetadata } from '../../shared/models';
import { EntityMetadata, getConnection } from 'typeorm';
import { getColumnMetadata } from '../entity/decorators/columnMetadata';
import { FlattenedEnrollment } from '../entity';


export const columnMetadataRouter = express.Router();

/**
 * /column-metadata GET
 *
 * Returns all data-definition metadata from the FlattenedEnrollment model,
 * as an array of DataDefinitionInfo objects
 */
columnMetadataRouter.get('/', (_, res) => {
  res.send(getAllEnrollmentColumns());
});

columnMetadataRouter.get('/csv', (req: Request, res: Response) => {
  streamTemplate(res, 'csv');
});

columnMetadataRouter.get('/xlsx', (req: Request, res: Response) => {
  streamTemplate(res, 'xlsx');
});

function streamTemplate(response: Response, bookType: 'csv' | 'xlsx') {
  const template: WorkBook = bookType === 'csv' ? generateCsvWorkbook() : generateExcelWorkbook();

  const templateStream = write(template, {
    bookType,
    type: 'buffer'
  });
  response.contentType('application/octet-stream');
  response.send(templateStream);
};

function generateCsvWorkbook(): WorkBook {
  const columnMetadatas: ECEColumnMetadata[] = getAllEnrollmentColumns();

  const formattedColumnNames: string[] = columnMetadatas.map(c => c.formattedName);
    const sheet = utils.aoa_to_sheet([formattedColumnNames]);

    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, sheet);

    return workbook;
}

function generateExcelWorkbook(): WorkBook {
  const columnMetadatas: ECEColumnMetadata[] = getAllEnrollmentColumns();

  let columnNames: string[] = [];
    let formats: string[] = [];
    let sections: string[] = [];
    let sectionCounts: any = {};
    let cols: ColInfo[] = [];

    columnMetadatas.forEach((columnMetadata, index) => {
      sections[index] = columnMetadata.section;
      columnNames[index] = columnMetadata.formattedName;
      formats[index] = columnMetadata.format;

      //  Reserve AT LEAST 14 characters for column widths, for the sake of
      //  having actually readable format descriptors
      const displayNameLength: number = columnMetadata.formattedName.length;
      const columnCharCount: number = displayNameLength > 14 ? displayNameLength : 14;

      cols[index] = {
        wch: columnCharCount
      };

      formats[index] = columnMetadata.format.match(new RegExp('.{1,' + columnCharCount + '}', 'g')).join('\n');

      if (!sectionCounts[columnMetadata.section]) {
        sectionCounts[columnMetadata.section] = 0;
      } else {
        sectionCounts[columnMetadata.section]++;
      }
    });

    const aoa = [
      sections,
      columnNames,
      formats,
    ];

  const sheet: WorkSheet = utils.aoa_to_sheet(aoa);

  let merges = [];
  let start = 0;

  sections.forEach((sectionName, index) => {
    if (index === sections.length - 1 || sectionName !== sections[index + 1]) {
      merges.push({ s: { c: start, r: 0 }, e: { c: index, r: 0 } });
      start = index + 1;
    }
  });

  sheet["!cols"] = cols;
  sheet['!merges'] = merges;

  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, sheet);

  return workbook;
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
