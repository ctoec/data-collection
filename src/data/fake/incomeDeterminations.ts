import { random } from 'faker';
import moment from 'moment';
import { IncomeDetermination } from '../../entity';

export const getFakeIncomeDet = (
  id,
  family,
  notDisclosed: boolean
): IncomeDetermination => {
  if (notDisclosed) {
    return {
      id,
      incomeNotDisclosed: true,
      familyId: family.id,
      family,
      updateMetaData: { updatedAt: new Date() },
      deletedDate: null,
    };
  } else {
    return {
      id,
      numberOfPeople: random.number({ min: 2, max: 8 }),
      income: random.number(60000),
      determinationDate: moment().add(-random.number(60), 'days'),
      incomeNotDisclosed: notDisclosed,
      familyId: family.id,
      family,
      updateMetaData: { updatedAt: new Date() },
      deletedDate: null,
    };
  }
};
