import { Family } from '../entity';
import { propertyDateSorter } from './propertyDateSorter';

export const getLastIncomeDetermination = (family: Family) => {
  return (family.incomeDeterminations || []).sort((a, b) =>
    propertyDateSorter(a, b, (d) => d?.determinationDate, true)
  )[0];
};
