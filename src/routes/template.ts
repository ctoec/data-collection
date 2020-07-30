import { utils, writeFile } from 'xlsx';
import Excel, { Worksheet } from 'exceljs';
import path from 'path';
import { Response, Request } from 'express';
import { getConnection } from 'typeorm';
import { FlattenedEnrollment } from '../entity';
import { getTemplateMeta } from '../decorators/templateMetadata';

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
const templateGet = async (
  request: Request,
  response: Response,
  type: 'csv' | 'xlsx'
) => {
  const template = getTemplateWorkbook(type);
  const filePath = path.join('/tmp', `template.${type}`);

  // writeFile(template, filePath, { bookType: type });
  if (type === 'xlsx') {
    await template.xlsx.writeFile(filePath);
  } else {
    await template.csv.writeFile(filePath);
  }

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
const getTemplateWorkbook = (type: 'csv' | 'xlsx') => {
  const { titles, descriptions, sectionCounts } = getTemplateData();

  const workbook = new Excel.Workbook();
  const sheet = workbook.addWorksheet('Data collection');

  // If getting excel format, add section titles and merge cells
  if (type === 'xlsx') {
    sheet.addRow(getWideSectionTitles(sectionCounts, titles.length));
    mergeAndFormatSectionTitleCells(sheet, sectionCounts);
  }

  // Add column titles
  sheet.addRow(titles);

  // If getting excel format, add column descriptions
  if (type === 'xlsx') {
    sheet.addRow(descriptions);
  }

  return workbook;
};

const getWideSectionTitles = (sectionCounts: object, width: number) => {
  const sectionTitles = Array.from({ length: width });

  let fillStart = 0;
  Object.entries(sectionCounts).forEach(([key, value]) => {
    sectionTitles.fill(key, fillStart, fillStart + value);
    fillStart += value;
  });

  return sectionTitles;
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
    .columns.map((column) =>
      getTemplateMeta(new FlattenedEnrollment(), column.propertyName)
    )
    .filter((templateMeta) => !!templateMeta)
    .reduce(
      (acc, currentValue) => {
        acc.titles = [...acc.titles, currentValue.title];
        acc.descriptions = [...acc.descriptions, currentValue.description];
        if (acc.sectionCounts[currentValue.section]) {
          acc.sectionCounts[currentValue.section] += 1;
        } else {
          acc.sectionCounts[currentValue.section] = 1;
        }

        return acc;
      },
      { titles: [], descriptions: [], sectionCounts: {} }
    );

/**
 * Merge section title cells (top row) based on number of columns in each section
 * @param worksheet
 * @param sectionCounts
 */
const mergeAndFormatSectionTitleCells = (
  worksheet: Worksheet,
  sectionCounts: object
) => {
  let left = 0;
  Object.entries(sectionCounts).forEach(([section, count]) => {
    worksheet.mergeCells(0, left, 0, left + count);
    if (left === 0) {
      const thisCell = worksheet.getCell('A1');
      thisCell.alignment = { horizontal: 'center' };
      thisCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        bgColor: { argb: 'FFFAEBD7' },
        fgColor: { argb: 'FFFAEBD7' },
      };
    }
    left += count + 1;
  });
};
