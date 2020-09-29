import { Provider, User } from '.';

export interface ProviderPermission {
  id: number;
  user: User;
  provider: Provider;
}
