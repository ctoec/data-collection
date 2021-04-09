import { FundingSource, FundingSpace } from '../shared/models';

/**
 * Util function that cleans up a funding source name by stripping
 * off the hyphenated abbreviation.
 * @param source
 */
export const getStrippedFundingSourceName = (source: FundingSource) => {
  return source.split('-')[1].trim();
};

/**
 * Creates a streamlined funding space display name by concatenating
 * the defining attributes of a funding space into a single dashed
 * line of text.
 * @param fs
 */
export const getFundingSpaceDisplayName = (fs: FundingSpace) => {
  const spaceName = getStrippedFundingSourceName(fs.source);
  return fs.ageGroup + ' - ' + spaceName + ' - ' + fs.time;
};
