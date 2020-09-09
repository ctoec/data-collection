import { write, WorkBook, utils, ColInfo, WorkSheet } from 'xlsx';
import { ColumnMetadata } from '../../client/src/shared/models';
import { wrapText } from '../utils/string';
import { EntityMetadata, getConnection } from 'typeorm';
import { FlattenedEnrollment } from '../entity';
import { getColumnMetadata } from '../entity/decorators/columnMetadata';
import { Response } from 'express';

export function streamTemplate(response: Response) {
  const template: WorkBook = generateCsvWorkbook();

  const templateStream = write(template, {
    bookType: 'csv',
    type: 'buffer',
  });
  response.contentType('application/octet-stream');
  response.send(templateStream);
}

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

function generateCsvWorkbook(): WorkBook {
  const columnMetadatas: ColumnMetadata[] = getAllEnrollmentColumns();

  const formattedColumnNames: string[] = columnMetadatas.map(
    (c) => c.formattedName
  );
  const sheet = utils.aoa_to_sheet([formattedColumnNames]);

  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, sheet);

  return workbook;
}
