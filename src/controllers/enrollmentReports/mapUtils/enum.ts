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

  const stripRegex = /[-\/\s]+/;
  const normalizedInput = value
    .toString()
    .trim()
    .replace(stripRegex, '')
    .toLowerCase();
  let ret: T;

  // Iterate through all enum values and check if any match
  Object.values(referenceEnum).forEach((ref: T) => {
    const refString = (ref as unknown) as string;

    // Base case for all other enums -- compare the normalized enum values
    // to the normalized input value
    const normalizedReference = refString
      .trim()
      .replace(stripRegex, '')
      .toLowerCase();
    if (
      normalizedReference.startsWith(normalizedInput) ||
      normalizedInput.startsWith(normalizedReference)
    ) {
      ret = ref;
    }
    // Special case for mapping FundingSource, to check for
    // the acronym (i.e. CDC), full name (i.e. Child day care)
    // or full combined (i.e. CDC - Child day care) version
    if (!ret && opts.isFundingSource) {
      const normalizedReferences = refString
        .split('-')
        .map((r) => r.trim().replace(stripRegex, '').toLowerCase());
      normalizedReferences.forEach((normalizedReference) => {
        if (normalizedInput.startsWith(normalizedReference)) {
          ret = ref;
        }
      });
    }
  });

  return ret;
};
