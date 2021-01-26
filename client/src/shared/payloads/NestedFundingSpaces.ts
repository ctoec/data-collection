import { FundingSpace, FundingSource, AgeGroup, FundingTime } from '../models';

export type FundingSpaceWithFillCount = FundingSpace & {
  filled: number;
};

export type NestedFundingSpaces = {
  [key in FundingSource]: {
    [key in AgeGroup]: {
      [key in FundingTime]: FundingSpaceWithFillCount;
    };
  };
};
