import { FundingSource } from '../../../../../client/src/shared/models';
import { FUNDING_SOURCE_TIMES } from '../../../../../client/src/shared/constants';
import { normalizeString } from '../../../../utils/normalizeString';

const FT_REGEX = /fulltime/g;
const PT_REGEX = /parttime/g;
const FD_REGEX = /fullday/g;
const PD_REGEX = /partday/g;

/**
 * Leverage funding source -> time -> format mappings from FUNDING_SOURCE_TIMES
 * to determine the valid funding time entered by the user.
 */
export const mapFundingTime = (
  value: number | string | undefined,
  fundingSource: FundingSource | undefined
) => {
  if (!value) return;

  // Cannot determine a funding time without a funding space, as they are space-specific
  if (!fundingSource) return;

  const sourceTimes = FUNDING_SOURCE_TIMES.find((fst) =>
    fst.fundingSources.includes(fundingSource)
  );
  const normalizedValue = trimToFullAndPartRoots(normalizeString(value));
  const matchingFundingTime = sourceTimes.fundingTimes.find((time) =>
    time.formats.some((format) => {
      return (
        trimToFullAndPartRoots(normalizeString(format)) === normalizedValue
      );
    })
  );
  return matchingFundingTime?.value;
};

/**
 * We only want to use the root 'full' and 'part' words in all of the
 * full-day/full-time/part-day/part-time permutations, so this throws
 * out the 'day'/'time' part that leads to unnecessary mixups.
 */
const trimToFullAndPartRoots = (value: string) => {
  return value
    .replace(FT_REGEX, 'full')
    .replace(FD_REGEX, 'full')
    .replace(PT_REGEX, 'part')
    .replace(PD_REGEX, 'part');
};
