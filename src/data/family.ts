import { address, random } from 'faker';
import { Family } from '../entity';

export const makeFakeFamily = (id): Family => {
  const homelessness = random.boolean();
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
  };
};
