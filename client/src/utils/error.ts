export const ERROR_DELIMITER = '\n';

export function getErrorHeading(error: string): string {
  return error.includes(ERROR_DELIMITER) ? error.split(ERROR_DELIMITER)[0] : '';
}

export function getErrorText(error: string): string {
  return error.includes(ERROR_DELIMITER) ? error.split(ERROR_DELIMITER)[1] : error;
}