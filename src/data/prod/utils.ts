import { WorkSheet, utils, readFile } from 'xlsx';

export function read(filename: string) {
  return Object.values(readFile(filename).Sheets)[0];
}

export function parse<T>(sheetData: WorkSheet, header: string[]) {
  return utils.sheet_to_json<T>(sheetData, {
    range: 1,
    raw: false,
    header,
  });
}
