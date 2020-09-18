import { ValidationError } from 'class-validator';

export interface ObjectWithValidationErrors {
  validationErrors?: ValidationError[];
}
