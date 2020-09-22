import { ColumnMetadata } from '../../client/src/shared/models';
import { EnrollmentReportRow, getColumnMetadata } from './';
/**
 * Retrieve our own custom ColumnMetadata for all columns on the EnrollmentReportRow model.
 */
export function getAllColumnMetadata(): ColumnMetadata[] {
  const _row = new EnrollmentReportRow();
  const enrollmentReportRowPropertyNames = Object.getOwnPropertyNames(_row);
  return enrollmentReportRowPropertyNames.map((propName) =>
    getColumnMetadata(_row, propName)
  );
}
