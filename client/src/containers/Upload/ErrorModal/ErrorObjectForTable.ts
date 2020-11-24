/**
 * Object format to hold the information the error dictionary
 * compiler sends from the back end. Used in the error modal
 * to create a table of columns within the modal.
 */
export type ErrorObjectForTable = {
  property: string;
  count: number;
  formattedName: string;
  occursIn: string[];
};
