import { FundingSource } from '../../shared/models';

export const getShortFundingSourceName = (fundingSource: FundingSource) =>
  fundingSource.split('-')[0].trim();
