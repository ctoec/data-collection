import { EnrollmentReport, FlattenedEnrollment } from '../../entity';
import { readFile, utils, WorkSheet } from 'xlsx';
import { getManager, getConnection, Column } from 'typeorm';
import { report } from 'process';

export class EnrollmentReportService {
  public async get(id: number): Promise<EnrollmentReport> {
    return getManager().findOne(EnrollmentReport, id);
  }

  public async save(
    enrollmentReport: EnrollmentReport
  ): Promise<EnrollmentReport> {
    return getManager().save(enrollmentReport);
  }

  public parse(
    enrollmentReportBodyParams: Express.Multer.File
  ): FlattenedEnrollment[] {
    const fileData = readFile(enrollmentReportBodyParams.path, {
      cellDates: true,
    });

    const sheet = Object.values(fileData.Sheets)[0];

    const expectedHeaders = getConnection()
      .getMetadata(FlattenedEnrollment)
      .columns.filter(
        (column) =>
          column.propertyName !== 'id' &&
          column.propertyName !== 'report' &&
          column.propertyName !== 'reportId'
      )
      .map((column) => column.propertyName);

    const parsedSheet = utils.sheet_to_json(sheet, {
      range: this.getStartingRow(sheet),
      header: expectedHeaders,
    });

    console.log('parsed sheet', parsedSheet);
    return parsedSheet.map((enrollment) =>
      this.parseFlattenedEnrollment(enrollment as object)
    );
  }

  private getStartingRow(sheet: WorkSheet): number {
    // If the second cell in the first row has value 'Child Info'
    // then the sheet has section headers, meaning it is the
    // excel format and data starts on row 3
    // (after section headers, column headers, and column descriptions).
    // Otherwise, it is the csv format and data starts on row 1
    return sheet['B1'].v === 'Child Info' ? 3 : 1;
  }

  private parseFlattenedEnrollment(rawEnrollment: object) {
    Object.entries(rawEnrollment).forEach(([property, value]) => {
      if (
        [
          'americanIndianOrAlaskaNative',
          'asian',
          'blackOrAfricanAmerican',
          'nativeHawaiianOrPacificIslander',
          'white',
          'hispanicOrLatinxEthnicity',
          'dualLanguageLearner',
          'receivingSpecialEducationServices',
          'livesWithFosterFamily',
          'experiencedHomelessnessOrHousingInsecurity',
          'receivingCareForKids',
        ].includes(property)
      ) {
        rawEnrollment[property] = this.getBoolean(value);
      }
    });

    return getConnection().manager.create(FlattenedEnrollment, rawEnrollment);
  }

  private getBoolean(value: string): boolean {
    if (['', 'N', 'NO', undefined].includes(value)) return false;
    return true;
  }
}
