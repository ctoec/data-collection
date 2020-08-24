import moment, { Moment } from 'moment';

export const momentTransformer = {
  from: (dbDate?: string) => (dbDate ? moment.utc(dbDate) : undefined),
  to: (entityDate?: Moment) => {
    return entityDate ? entityDate.format('YYYY-MM-DD') : undefined;
  },
};
