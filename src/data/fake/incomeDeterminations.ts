import { random } from 'faker';
import moment from 'moment';
import { Family, IncomeDetermination } from '../../entity';

export const getFakeIncomeDet = (
  id: number,
  family: Family,
  incomeNotDisclosed: boolean
): IncomeDetermination => {
  let mockIncomeDet: IncomeDetermination = {
    id,
    incomeNotDisclosed,
    familyId: family.id,
    family,
    updateMetaData: { updatedAt: new Date() },
    deletedDate: null,
  };

  if (!incomeNotDisclosed) {
    mockIncomeDet = Object.assign(mockIncomeDet, {
      numberOfPeople: random.number({ min: 2, max: 8 }),
      income: random.number(60000),
      determinationDate: moment().add(-random.number(60), 'days'),
    });
  }

  return mockIncomeDet;
};
