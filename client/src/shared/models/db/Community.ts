import { Provider } from '.';

export interface Community {
  id: number;
  name: string;
  providers?: Array<Provider>;
}
