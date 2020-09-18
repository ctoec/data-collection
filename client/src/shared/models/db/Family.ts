import { Child, IncomeDetermination, Organization } from '.';
import { ObjectWithValidationErrors } from '../ObjectWithValidationErrors';

export interface Family extends ObjectWithValidationErrors {
  id: number;
  streetAddress?: string;
  town?: string;
  state?: string;
  zip?: string;
  homelessness?: boolean;
  incomeDeterminations?: Array<IncomeDetermination>;
  children?: Array<Child>;
  organization?: Organization;
}
