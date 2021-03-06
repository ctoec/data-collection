import { random } from 'faker';
import { Child, Enrollment, Site } from '../../entity';
import { AgeGroup, CareModel } from '../../../client/src/shared/models';
import moment from 'moment';
import { getFakeFunding } from './funding';

export const makeFakeEnrollments = (
  id: number,
  child: Child,
  site: Site
): Enrollment[] => {
  const returnEnrollments = [];
  const currentEnrollmentEntry = moment().add(
    -random.number({ min: 5, max: 300 }),
    'days'
  );
  const commonEnrollmentAttrs = {
    childId: child.id,
    child,
    site,
    siteId: site.id,
  };
  const currentEnrollment: Enrollment = {
    ...commonEnrollmentAttrs,
    id,
    ageGroup: random.arrayElement(Object.values(AgeGroup)),
    model: random.arrayElement(Object.values(CareModel)),
    entry: currentEnrollmentEntry,
    updateMetaData: { updatedAt: new Date() },
    deletedDate: null,
  };
  currentEnrollment.fundings = [
    getFakeFunding(id, currentEnrollment, site.organization),
  ];
  returnEnrollments.push(currentEnrollment);
  if (currentEnrollment.ageGroup === AgeGroup.SchoolAge) {
    const oldEnrollment: Enrollment = {
      ...commonEnrollmentAttrs,
      id, // duplicates don't matter for fake data
      ageGroup: AgeGroup.Preschool,
      model: random.arrayElement(Object.values(CareModel)),
      entry: currentEnrollmentEntry.clone().add(-1, 'years'),
      exit: currentEnrollmentEntry.clone().add(-1, 'days'),
      exitReason: 'Aged out',
      updateMetaData: { updatedAt: new Date() },
      deletedDate: null,
    };
    oldEnrollment.fundings = [
      getFakeFunding(id, currentEnrollment, site.organization, true),
    ];
    returnEnrollments.push(oldEnrollment);
  }
  return returnEnrollments;
};
