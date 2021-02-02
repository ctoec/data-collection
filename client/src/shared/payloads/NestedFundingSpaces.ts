import { FundingSpace, FundingSource, AgeGroup } from '../models';

export type FundingSpaceWithFillCount = FundingSpace & {
  filled: number;
};

export type NestedFundingSpaces = {
  [key in FundingSource]: {
    [key in AgeGroup]: FundingSpaceWithFillCount[];
  };
};
