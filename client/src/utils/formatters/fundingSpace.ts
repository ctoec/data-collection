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
  const fullTimeWeeks = timeSplit.fullTimeWeeks;
  const partTimeWeeks = timeSplit.partTimeWeeks;
  if (!fullTimeWeeks || !partTimeWeeks) {
    // TODO: change this once we have this data
    console.warn(
      'Part time full time split display needs to be updated when data is available'
    );
    return `${FundingTime.PartTime} / ${FundingTime.FullTime}`;
  }

  const fullTimeFirst = fullTimeWeeks > partTimeWeeks;

  if (fullTimeFirst) {
    return `${FundingTime.FullTime} (${fullTimeWeeks} weeks) / ${FundingTime.PartTime} (${partTimeWeeks} weeks)`;
  }

  return `${FundingTime.PartTime} (${partTimeWeeks} weeks) / ${FundingTime.FullTime} (${fullTimeWeeks} weeks)`;
};
