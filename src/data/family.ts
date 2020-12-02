import { address } from 'faker';
import { Family } from '../entity';
import { weightedUndefinableBoolean } from './fakeDataUtils';

export const makeFakeFamily = (id): Family => {
  const homelessness = weightedUndefinableBoolean(5);
  const familyAddress = homelessness
    ? {}
    : {
        streetAddress: address.streetAddress(),
        town: address.city(),
        state: 'CT',
        zipCode: address.zipCodeByState('CT'),
      };
  return {
    id,
    ...familyAddress,
    homelessness,
    updateMetaData: { updatedAt: new Date() },
    deletedDate: null,
    cascadeDeleteDets: null,
  };
};
