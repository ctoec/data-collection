import { DefaultApi, Configuration } from '../generated';
import { getCurrentHost } from './getCurrentHost';

export function getApi(accessToken: string | null) {
  return new DefaultApi(
    new Configuration({
      basePath: `${getCurrentHost()}/api`,
      apiKey: `Bearer ${accessToken}`,
    })
  );
}
