import { ValidationError } from 'class-validator';
import { ColumnMetadata } from './ColumnMetadata';

export type EnrichedValidationError = ValidationError & {
  metadata?: ColumnMetadata;
};

export interface ObjectWithValidationErrors {
  validationErrors?: EnrichedValidationError[];
}
