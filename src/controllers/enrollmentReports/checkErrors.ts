import { Child } from '../../entity';
import { ColumnMetadata } from '../../../client/src/shared/models';
import { EnrollmentReportRow, getAllColumnMetadata } from '../../template';
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
const processErrorsInFields = (
  child: Child,
  error: ValidationError,
  errorDict: Object,
  errorOccursIn: Object
) => {
  // Base case: error is not in a nested field
  if (error.children.length === 0) {
    // There are some validation errors that aren't related to
    // fields in the spreadsheet, so this conditional ensures
    // the error modal only reports actual _sheet_ errors as
    // present in the spreadsheet
    if (errorDict.hasOwnProperty(error.property)) {
      errorDict[error.property] += 1;
      errorOccursIn[error.property].push(
        (child.firstName || '') + ' ' + (child.lastName || '')
      );
    }
  }
  // Recursive case: validation errors live on children
  // of initial error
  else {
    error.children.map((e) =>
      processErrorsInFields(child, e, errorDict, errorOccursIn)
    );
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
  const propertyNameToFormattedName = {};
  let errorDict = {};
  let errorOccursIn = {};

  // Start the count of each type of error at 0 overall
  cols.map((c) => {
    errorDict[c.propertyName] = 0;
    propertyNameToFormattedName[c.propertyName] = c.formattedName;
    errorOccursIn[c.propertyName] = [];
  });

  await Promise.all(
    children.map(async (child) => {
      child.validationErrors.map((e) =>
        processErrorsInFields(child, e, errorDict, errorOccursIn)
      );
    })
  );

  // Only need fields with error counts; send back a formated
  // object for tabular display
  const filteredKeys = Object.keys(errorDict).filter((k) => errorDict[k] > 0);
  const filteredErrors = filteredKeys.map((k) => {
    return {
      property: k,
      formattedName: propertyNameToFormattedName[k],
      count: errorDict[k],
      affectedRows: errorOccursIn[k],
    };
  });

  return filteredErrors;
};
