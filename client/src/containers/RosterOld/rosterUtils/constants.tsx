import { AgeGroup, Child } from '../../../shared/models';

export const MAX_LENGTH_EXPANDED = 50;
export const QUERY_STRING_MONTH_FORMAT = 'MMMM-YYYY';

/**
 * Helper types for organizing children into sections by ageGroup
 */
export const NoAgeGroup = 'Incomplete enrollments';
export type RosterSections = AgeGroup | typeof NoAgeGroup;
export type ChildrenByAgeGroup = {
  [key in RosterSections]?: Child[];
};
