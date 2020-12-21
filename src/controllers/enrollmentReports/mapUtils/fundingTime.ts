import { FundingSource } from '../../../../client/src/shared/models';
import { FUNDING_SOURCE_TIMES } from '../../../../client/src/shared/constants';
import { normalizeString } from '../../../utils/normalizeString';

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
  const normalizedValue = normalizeString(value);
  const matchingFundingTime = sourceTimes.fundingTimes.find((time) =>
    time.formats.some((format) => {
      return normalizeString(format) === normalizedValue;
    })
  );
  return matchingFundingTime?.value;
};
