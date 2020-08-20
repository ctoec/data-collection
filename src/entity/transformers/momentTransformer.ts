import moment, { Moment } from 'moment';

export const momentTransformer = {
  from: (dbDate?: Date) => (dbDate ? moment.utc(dbDate) : undefined),
  to: (entityDate?: Moment) => (entityDate ? entityDate.toDate() : undefined),
};
