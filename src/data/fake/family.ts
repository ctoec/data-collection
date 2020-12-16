import { address } from 'faker';
import { Family } from '../../entity';

export const makeFakeFamily = (familyStub): Family => {
  const homelessness = familyStub.homelessness;
  const familyAddress = homelessness
    ? {}
    : {
      streetAddress: address.streetAddress(),
      town: address.city(),
      state: 'CT',
      zipCode: address.zipCodeByState('CT'),
    };
  return {
    ...familyStub,
    ...familyAddress,
    updateMetaData: { updatedAt: new Date() },
    deletedDate: null,
    cascadeDeleteDets: null,
  };
};
