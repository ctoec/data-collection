import moment, { Moment } from 'moment';

export const momentTransformer = {
  from: (dbDate?: Date) => (dbDate ? moment.utc(dbDate) : undefined),
  to: (entityDate?: Moment) => {
    console.log('entity date', entityDate);
    return entityDate ? entityDate.toDate() : undefined;
  },
};
