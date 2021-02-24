import { Child } from '../../../entity';

/**
 * Type that holds the accumulation of all new and edited
 * upload changes to child records from a spreadsheet. The
 * index of child i in the `children` field is the same
 * index where the tags for child i can be found in the
 * `changeTags` field.
 */
export type EnrollmentReportUpdate = {
  changeTagsForChildren: string[][];
  children: Child[];
};
