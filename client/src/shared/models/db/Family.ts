import { Child, IncomeDetermination, Organization } from '.';

export interface Family {
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
