import { random } from 'faker';
import { Child, Enrollment, Site } from '../entity';
import { AgeGroup, CareModel } from '../../client/src/shared/models';
import moment from 'moment';

export const makeFakeEnrollment = (
  id: number,
  child: Child,
  site: Site
): Enrollment => {
  return {
    id,
    childId: child.id,
    child,
    site,
    siteId: site.id,
    ageGroup: random.arrayElement(Object.values(AgeGroup)),
    model: random.arrayElement(Object.values(CareModel)),
    entry: moment(),
    updateMetaData: { updatedAt: new Date() },
  };
};
