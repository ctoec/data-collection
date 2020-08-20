import express from 'express';
import { Response, Request } from 'express';
import { utils, WorkBook, write, ColInfo, WorkSheet } from 'xlsx';
import { ColumnMetadata } from '../../shared/models';
import { EntityMetadata, getConnection } from 'typeorm';
import { getColumnMetadata } from '../entity/decorators/columnMetadata';
import { FlattenedEnrollment } from '../entity';
import { wrapText } from '../utils/string';


export const columnMetadataRouter = express.Router();

/**
 * /column-metadata GET
 *
 * Returns all column metadata from the FlattenedEnrollment model,
 * as an array of ColumnMetadata objects
 */
columnMetadataRouter.get('/', (req: Request, res: Response) => {
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
  const columnMetadatas: ColumnMetadata[] = getAllEnrollmentColumns();

  const formattedColumnNames: string[] = columnMetadatas.map(c => c.formattedName);
    const sheet = utils.aoa_to_sheet([formattedColumnNames]);

    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, sheet);

    return workbook;
}

function generateExcelWorkbook(): WorkBook {
  const columnMetadatas: ColumnMetadata[] = getAllEnrollmentColumns();

  let columnNames: string[] = [];
    let formats: string[] = [];
    let sections: string[] = [];
    let sectionCounts: any = {};
    let cols: ColInfo[] = [];

    columnMetadatas.forEach((columnMetadata, index) => {
      sections[index] = columnMetadata.section;
      columnNames[index] = columnMetadata.formattedName;
      formats[index] = columnMetadata.format;

      //  Reserve a certain number of minimum characters for column widths, for the sake of
      //  having actually readable format descriptors
      const displayNameLength: number = columnMetadata.formattedName.length;
      const columnCharCount: number = displayNameLength > 16 ? displayNameLength : 16;

      cols[index] = {
        wch: columnCharCount
      };

      formats[index] = wrapText(columnMetadata.format, columnCharCount);

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

  //  Iterate through each column's section and add merge points whenever
  //  the section changes
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
 * Retrieve our own custom ColumnMetadata for all columns on the FlattenedEnrollment model.
 */
export function getAllEnrollmentColumns(): ColumnMetadata[] {
  const metadata: EntityMetadata = getConnection().getMetadata(FlattenedEnrollment);

  return metadata.columns.map((column) =>
    getColumnMetadata(new FlattenedEnrollment(), column.propertyName)
  )
  .filter((templateMeta) => !!templateMeta);
}
