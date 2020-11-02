import { random } from 'faker';
import moment from 'moment';
import { IncomeDetermination } from '../entity';

export const getFakeIncomeDet = (id, family): IncomeDetermination => {
  return {
    id,
    numberOfPeople: random.number({ min: 2, max: 10 }),
    income: random.number(60000),
    determinationDate: moment().add(-random.number(60), 'days'),
    familyId: family.id,
    family,
    updateMetaData: { updatedAt: new Date() },
  };
};
