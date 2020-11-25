import { parseEnrollmentReportRow } from './';
import { EnrollmentReportRow } from '../../template';

describe('controllers', () => {
  describe('enrollmentReports', () => {
    describe('parseZipCode', () => {
      it('parses a zip code with a leading zero correctly, not as a negative long', () => {
        const dateProperties = [];
        const booleanProperties = [];
        // Assume excel got its hands on the zipcode and killed off a 0
        const rawObj = { zipCode: '1920' } as EnrollmentReportRow;
        const parsedRow = parseEnrollmentReportRow(
          rawObj,
          booleanProperties,
          dateProperties
        );
        expect(parsedRow.zipCode).toBe('01920');
      });
    });
  });
});
