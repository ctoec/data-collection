import { Child, IncomeDetermination, Provider } from '.';
import { ObjectWithValidationErrors } from '../ObjectWithValidationErrors';

export interface Family extends ObjectWithValidationErrors {
  id: number;
  streetAddress?: string;
  town?: string;
  state?: string;
  zipCode?: string;
  homelessness?: boolean;
  incomeDeterminations?: Array<IncomeDetermination>;
  children?: Array<Child>;
  provider?: Provider;
}
