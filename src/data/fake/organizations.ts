// These don't have ids because when putting them into the db the db assigns an id that doesn't necessarily align with what we specify
import { UniqueIdType } from '../../client/src/shared/models';

export const hogwarts = {
  providerName: 'Hogwarts Childcare',
  uniqueIdType: UniqueIdType.SASID,
};

export const beauxbatons = {
  providerName: 'Académie de Magie Beauxbâtons',
  uniqueIdType: UniqueIdType.Other,
};

export const durmstrang = {
  providerName: 'Durmstrang',
  uniqueIdType: UniqueIdType.None,
};

export const organizations = [hogwarts, beauxbatons, durmstrang];
export const stagingUserAllowedOrganizations = [hogwarts];
