import { utils, writeFile } from 'xlsx';
import path from 'path';
import { Response, Request } from 'express';
import { getConnection } from 'typeorm';
import { FlattenedEnrollment } from '../entity';

const CSV_MIME_TYPE = 'text/csv';
const XLSX_MIME_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

/**
 * Creates and sends the data collection template as csv
 * @param request
 * @param response
 */
export const csvGet = (request: Request, response: Response) =>
  templateGet(request, response, 'csv');

/**
 *  Creates and sends the data collection template as an xlsx
 * @param request
 * @param response
 */
export const xlsxGet = (request: Request, response: Response) =>
  templateGet(request, response, 'xlsx');

/**
 * Creates and sends the data collection template as specified type
 * by writing the file to /tmp, and then sending via express builtin `sendFile`
 *
 * Adds Content-type and Content-disposition headers to response.
 * @param request
 * @param response
 * @param type
 */
const templateGet = (
  request: Request,
  response: Response,
  type: 'csv' | 'xlsx'
) => {
  const template = getTemplateWorkbook();
  const filePath = path.join('/tmp', `template.${type}`);

  writeFile(template, filePath, { bookType: type });

  response.setHeader(
    'Content-type',
    type === 'csv' ? CSV_MIME_TYPE : XLSX_MIME_TYPE
  );
  response.setHeader(
    'Content-disposition',
    `attachement; filename="ECE Data Collection Template.${type}"`
  );
  response.sendFile(filePath);
};

/**
 * Creates Workbook object containing a single worksheet,
 * which contains the data collection template data.
 */
const getTemplateWorkbook = () => {
  const templateData = getTemplateData();
  const sheet = utils.aoa_to_sheet(templateData);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, sheet);

  return workbook;
};

/**
 * Creates template data as array of arrays, derived from FlattenedEnrollment entity.
 * Template data includes column headers and optionally descriptions, which are stored
 * along with the entity as DB column comments.
 *
 * Only entity properties with column comments are exposed via the template.
 */
const getTemplateData = () =>
  getConnection()
    .getMetadata(FlattenedEnrollment)
    .columns.filter((column) => column.comment.length > 0)
    .map((column) => parseColumnComment(column.comment))
    .reduce(
      (acc, currentValue) => [
        [...acc[0], currentValue.title],
        [...acc[1], currentValue.description],
      ],
      [[], []]
    );

/**
 * Parses column title and description from column comment string.
 * Assumes title is separated from description by first instance of `\n`.
 * If no new lines exist, then there is no description.
 * @param columnComment
 */
const parseColumnComment = (columnComment: string) => {
  const newLineIdx = columnComment.indexOf('\n');
  return newLineIdx > 0
    ? {
        title: columnComment.slice(0, newLineIdx),
        description: columnComment.slice(newLineIdx + 1),
      }
    : { title: columnComment, description: '' };
};
