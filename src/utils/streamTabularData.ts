import { write, WorkBook, BookType } from 'xlsx';
import { Response } from 'express';
import { generateCSV } from '../utils/generateCsv';
import { generateExcelWorkbook } from '../utils/generateExcel';

export function streamTabularData(
  response: Response,
  bookType: BookType,
  rows?: string[][]
) {
  const template: WorkBook =
    bookType === 'csv' ? generateCSV(rows) : generateExcelWorkbook(rows);

  const templateStream = write(template, {
    bookType,
    type: 'buffer',
  });
  response.contentType('application/octet-stream');
  response.send(templateStream);
}
