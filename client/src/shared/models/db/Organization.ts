import { Provider } from '.';

export interface Organization {
  id: number;
  name: string;
  providers?: Array<Provider>;
}
