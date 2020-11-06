import { address, random } from 'faker';
import { Family } from '../entity';
import { weightedBoolean } from './fakeDataUtils';

export const makeFakeFamily = (id): Family => {
  const homelessness = weightedBoolean(5);
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
  };
};
