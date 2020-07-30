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
  if (type === 'xlsx') {
    sheet.addRow(getWideSectionTitles(sectionCounts, titles.length));
    mergeCells(sheet, sectionCounts);
  }
  sheet.addRow(titles);
  if (type === 'xlsx') {
    sheet.addRow(descriptions);
  }

  // const aoa = type === 'xlsx' ? [getWideSectionTitles(sectionCounts, titles.length), titles, descriptions] : [titles];
  // const sheet = utils.aoa_to_sheet(aoa);

  // if(type === 'xlsx') {
  // 	sheet["!merges"] = getMergesForSections(sectionCounts);
  // }

  // const workbook = utils.book_new();
  // utils.book_append_sheet(workbook, sheet);

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

const mergeCells = (worksheet: Worksheet, sectionCounts: object) => {
  let left = 0;
  Object.entries(sectionCounts).forEach(([section, count]) => {
    worksheet.mergeCells(0, left, 0, left + count);
    left += count + 1;
  });
};
const getMergesForSections = (sectionCounts: object) => {
  const sectionNames = Object.keys(sectionCounts);
  const merges = [];
  let lastEnd = 0;
  sectionNames.forEach((sectionName) => {
    const start = lastEnd > 0 ? lastEnd + 1 : lastEnd;
    const end = lastEnd + sectionCounts[sectionName];
    merges.push({ s: { c: start, r: 0 }, e: { c: end, r: 0 } });

    lastEnd = end;
  });

  return merges;
};
