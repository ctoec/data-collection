import { normalizeString } from '../../../../utils/normalizeString';
import {
  Gender,
  AgeGroup,
  FundingSource,
  CareModel,
  BirthCertificateType,
  UndefinableBoolean,
} from '../../../../../client/src/shared/models';

/**
 * Helper function to lookup enum values from source string values.
 *
 * Can optionally do first letter comparison, indicated by the
 * `firstLetterComparison` flag, which limits comparison to only
 * the first letter of the input value and enum values.
 *
 * Also, does special case handling for FundingSource lookup,
 * indicated by the `isFundingSource` flag.
 * @param referenceEnum
 * @param value
 * @param firstLetterComparison
 * @param isFundingSource
 */
export const mapEnum = <T>(
  referenceEnum:
    | typeof BirthCertificateType
    | typeof Gender
    | typeof CareModel
    | typeof AgeGroup
    | typeof FundingSource
    | typeof UndefinableBoolean,
  value: string | undefined,
  opts: {
    isFundingSource?: boolean;
    isBirthCertificateType?: boolean;
    isUndefineableBoolean?: boolean;
  } = {}
) => {
  // Handle special case of blanks in undefineable boolean columns
  // and the birth certificate type right upfront
  // Note: Birth certificate is its own conditional beacuse we don't
  // want the undefinable boolean's 'Not Collected,' we want blanks
  // to be parsed as 'Unavailable'
  if (!value && opts.isUndefineableBoolean) {
    return (UndefinableBoolean.NotCollected as unknown) as T;
  } else if (!value && opts.isBirthCertificateType) {
    return (BirthCertificateType.Unavailable as unknown) as T;
  }

  if (!value) return;
  const normalizedInput = normalizeString(value);
  let ret: T;

  // Iterate through all enum values and check if any match
  Object.values(referenceEnum).forEach((ref: T) => {
    const refString = (ref as unknown) as string;

    // Base case for all other enums -- compare the normalized enum values
    // to the normalized input value
    const normalizedReference = normalizeString(refString);
    if (processedStringsMatch(normalizedInput, normalizedReference)) {
      ret = ref;
    }
    // Special case for mapping FundingSource, to check for
    // the acronym (i.e. CDC), full name (i.e. Child day care)
    // or full combined (i.e. CDC - Child day care) version
    if (!ret && opts.isFundingSource) {
      let normalizedReferences = refString
        .split('-')
        .map((stringPart) => normalizeString(stringPart));
      normalizedReferences.forEach((_normalizedReference) => {
        if (processedStringsMatch(normalizedInput, _normalizedReference)) {
          ret = ref;
        }
      });
    }
  });
  if (!ret) {
    console.log(value);
  }
  return ret;
};

function processedStringsMatch(str1: string, str2: string) {
  if (str1.startsWith(str2) || str2.startsWith(str1)) {
    return true;
  }
  return false;
}
