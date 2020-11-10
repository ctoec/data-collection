import {
  Gender,
  AgeGroup,
  FundingSource,
  CareModel,
  BirthCertificateType,
} from '../../../../client/src/shared/models';

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
    | typeof FundingSource,
  value: string | undefined,
  opts: {
    isFundingSource?: boolean;
  } = {}
) => {
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
      let normalizedReferences = normalizeString(refString, true);
      if (!Array.isArray(normalizedReferences)) {
        // Make typescript happy
        normalizedReferences = [normalizedReferences];
      }
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

function processedStringsMatch(str1, str2) {
  if (str1.startsWith(str2) || str2.startsWith(str1)) {
    return true;
  }
  return false;
}

const stripRegex = /[-\/\s/]+/;
function normalizeString(
  inputString: string,
  isFundingSource?: boolean
): string | string[] {
  // Non destructive
  let _inputString = inputString.slice();
  if (isFundingSource) {
    return _inputString
      .split('-')
      .map((s) => s.trim().replace(stripRegex, '').toLowerCase());
  }
  return _inputString.toString().trim().replace(stripRegex, '').toLowerCase();
}
