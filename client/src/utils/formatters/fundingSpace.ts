import { FundingSpace, FundingTime } from '../../shared/models';

export const fundingSpaceFormatter = (fundingSpace: FundingSpace) => {
  console.log('Formatting funding space...');
  if (fundingSpace.time !== FundingTime.SplitTime) {
    return fundingSpace.time;
  }

  // Handle "split-time" funding spaces (CDC only)
  const fullTimeWeeks = fundingSpace.timeSplit?.fullTimeWeeks;
  const partTimeWeeks = fundingSpace.timeSplit?.partTimeWeeks;

  // TODO: change this once we have this data
  if (!fullTimeWeeks || !partTimeWeeks || partTimeWeeks <= fullTimeWeeks) {
    console.warn(
      'Part time full time split display needs to be updated when data is available'
    );
    return `${FundingTime.PartTime} / ${FundingTime.FullTime}`;
  } else {
    return `${FundingTime.FullTime} / ${FundingTime.PartTime}`;
  }
};
