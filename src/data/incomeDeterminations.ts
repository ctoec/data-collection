import { random } from 'faker';
import moment from 'moment';
import { IncomeDetermination } from '../entity';

export const getFakeIncomeDet = (id, family): IncomeDetermination => {
  return {
    id,
    numberOfPeople: random.number({ min: 2, max: 10 }),
    income: random.number(100000),
    determinationDate: moment(),
    familyId: family.id,
    family,
    updateMetaData: { updatedAt: new Date() },
  };
};
