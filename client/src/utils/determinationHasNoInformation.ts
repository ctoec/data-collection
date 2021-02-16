import { IncomeDetermination } from '../shared/models';

/**
 * Quickly verify whether an income determination contains useful data
 * @param det
 */
export const determinationHasNoInformation = (det: IncomeDetermination) => {
  return (
    det.determinationDate === undefined &&
    det.income === null &&
    det.numberOfPeople === null &&
    !det.incomeNotDisclosed
  );
};
