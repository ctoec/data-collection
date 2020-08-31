import moment, { Moment } from 'moment';
import { FindOperator } from 'typeorm';

export const momentTransformer = {
  from: (dbDate?: string) => (dbDate ? moment.utc(dbDate) : undefined),
  to: (entityDate?: Moment) => {
    if (entityDate instanceof FindOperator) return entityDate;
    return entityDate ? entityDate.format('YYYY-MM-DD') : undefined;
  },
};
