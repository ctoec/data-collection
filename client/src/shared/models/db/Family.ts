import { Child, IncomeDetermination, Organization } from '.';
import { ObjectWithValidationErrors } from '../ObjectWithValidationErrors';
import { UndefinableBoolean } from '../UndefinableBoolean';

export interface Family extends ObjectWithValidationErrors {
  id: number;
  streetAddress?: string;
  town?: string;
  state?: string;
  zipCode?: string;
  homelessness?: UndefinableBoolean;
  incomeDeterminations?: Array<IncomeDetermination>;
  children?: Array<Child>;
  organization?: Organization;
}
