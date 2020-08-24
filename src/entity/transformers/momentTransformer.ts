import moment, { Moment } from 'moment';

export const momentTransformer = {
  from: (dbDate?: string) => (dbDate ? moment.utc(dbDate) : undefined),
  to: (entityDate?: Moment) => {
    if (!entityDate) return undefined;
    let _entityDate = entityDate;
    if (!moment.isMoment(entityDate)) {
      // Need to do this so upload works
      console.log('ENTITY DATE ', entityDate)
      _entityDate = moment(entityDate);
    }
    return _entityDate.format('YYYY-MM-DD');
  },
};
