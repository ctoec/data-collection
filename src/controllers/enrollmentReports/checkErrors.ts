import { Child } from '../../entity';
import { ColumnMetadata } from '../../../client/src/shared/models';
import { getAllColumnMetadata } from '../../template';
import { ValidationError } from 'class-validator';

/**
 * Function that recursively determines the lowest level from
 * which a validation error came. If there's no error children,
 * it was directly on the child. If there are children errors,
 * the error came from a nested field of the child (like family,
 * enrollment, etc.), so process down to get the right property
 * name.
 * @param error
 * @param errorDict
 */
const processErrorsInFields = (error: ValidationError, errorDict: Object) => {
  // Base case: error is not in a nested field
  if (error.children.length === 0) {
    errorDict[error.property] += 1;
  }
  // Recursive case: validation errors live on children
  // of initial error
  else {
    error.children.map((e) => processErrorsInFields(e, errorDict));
  }
};

/**
 * Receives an array of child objects created with a DB manager
 * and determines how many validation errors occur in each
 * possible field of the child schema.
 * @param children Array of DB-view child objects to analyze
 */
export const checkErrorsInChildren = async (children: Child[]) => {
  const cols: ColumnMetadata[] = getAllColumnMetadata();

  // Need to start the tracking dicts off with a few mappings because
  // our variable names on nested entities don't perfectly match
  // the property names in column metadata
  const propertyNameToFormattedName = {
    site: 'Site',
    fundingSpace: 'Funding Type',
    firstReportingPeriod: 'First Funding Period',
    lastReportingPeriod: 'Last Funding Period',
  };
  let errorDict = {
    site: 0,
    fundingSpace: 0,
    firstReportingPeriod: 0,
    lastReportingPeriod: 0,
  };

  // Start the count of each type of error at 0 overall
  cols.map((c) => {
    errorDict[c.propertyName] = 0;
    propertyNameToFormattedName[c.propertyName] = c.formattedName;
  });

  children.forEach(async (child) => {
    // Accumulate counts across all children (don't need to
    // differentiate errors by individual child)
    child.validationErrors.map((e) => processErrorsInFields(e, errorDict));
  });

  // Only need fields with error counts; send back a formated
  // object for tabular display
  const filteredKeys = Object.keys(errorDict).filter((k) => errorDict[k] > 0);
  const filteredErrors = filteredKeys.map((k) => {
    return {
      property: k,
      formattedName: propertyNameToFormattedName[k],
      count: errorDict[k],
    };
  });

  return filteredErrors;
};
