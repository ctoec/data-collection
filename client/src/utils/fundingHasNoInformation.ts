import { Funding } from '../shared/models';

/**
 * Quick verification of whether a funding has meaningful info.
 */
export const fundingHasNoInformation = (funding: Funding | undefined) => {
  if (!funding) return true;
  return (
    !funding.fundingSpace &&
    !funding.startDate &&
    !funding.endDate
  );
};
