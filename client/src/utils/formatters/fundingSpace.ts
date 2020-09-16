import {
  FundingSpace,
  FundingTime,
  FundingTimeSplit,
} from '../../shared/models';

export const fundingSpaceFormatter = (fundingSpace: FundingSpace) => {
  const FULL_YEAR_WEEKS = 52;
  if (fundingSpace.time !== FundingTime.SplitTime) {
    return `${fundingSpace.time} (${FULL_YEAR_WEEKS} weeks)`;
  }

  // Handle "split-time" funding spaces (CDC only)
  const timeSplit = fundingSpace.timeSplit || ({} as FundingTimeSplit);
  const fullTimeWeeks = timeSplit.fullTimeWeeks || 0;
  const partTimeWeeks = timeSplit.partTimeWeeks || 0;
  const fullTimeFirst = fullTimeWeeks > partTimeWeeks;

  if (fullTimeFirst) {
    return `${FundingTime.FullTime} (${fullTimeWeeks} weeks) / ${FundingTime.PartTime} (${partTimeWeeks} weeks)`;
  }

  return `${FundingTime.PartTime} (${partTimeWeeks} weeks) / ${FundingTime.FullTime} (${fullTimeWeeks} weeks)`;
};
